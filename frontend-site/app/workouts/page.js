'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Dumbbell, 
  Target, 
  Clock, 
  Weight,
  Repeat,
  Edit,
  Trash2,
  Search,
  Filter,
  Save,
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import Layout from '@/components/layout/Layout'
import { useAuth } from '@/components/providers/AuthProvider'
import { useTheme } from '@/components/providers/ThemeProvider'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function WorkoutsPage() {
  const { userData, loading } = useAuth()
  const { isDarkMode } = useTheme()
  
  const [exercises, setExercises] = useState([])
  const [workouts, setWorkouts] = useState([])
  const [activeTab, setActiveTab] = useState('exercises')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Estados do formulário de exercício
  const [exerciseForm, setExerciseForm] = useState({
    nameExercise: '',
    descriptionExercise: '',
    reps: 0,
    duration: 0,
    load: 0,
    sets: 0
  })
  
  // Estados do formulário de treino
  const [workoutForm, setWorkoutForm] = useState({
    nameWorkout: '',
    descriptionWorkout: '',
    exercises: []
  })
  
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Carregar dados do localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedExercises = localStorage.getItem('userExercises')
      const savedWorkouts = localStorage.getItem('userWorkouts')
    
      if (savedExercises) {
        setExercises(JSON.parse(savedExercises))
      }
    
      if (savedWorkouts) {
        setWorkouts(JSON.parse(savedWorkouts))
      }
    }
  }, [])

  // Salvar no localStorage
  const saveToStorage = (exercises, workouts) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userExercises', JSON.stringify(exercises))
      localStorage.setItem('userWorkouts', JSON.stringify(workouts))
    }
  }

  const resetForms = () => {
    setExerciseForm({
      nameExercise: '',
      descriptionExercise: '',
      reps: 0,
      duration: 0,
      load: 0,
      sets: 0
    })
    setWorkoutForm({
      nameWorkout: '',
      descriptionWorkout: '',
      exercises: []
    })
    setErrors({})
    setSuccess('')
  }

  const handleCreateExercise = async (e) => {
    e.preventDefault()
    
    if (isSubmitting) return

    // Validações
    const newErrors = {}
    
    if (!exerciseForm.nameExercise.trim()) {
      newErrors.nameExercise = 'Nome do exercício é obrigatório'
    }
    
    if (exerciseForm.reps <= 0) {
      newErrors.reps = 'Repetições deve ser maior que 0'
    }
    
    if (exerciseForm.sets <= 0) {
      newErrors.sets = 'Séries deve ser maior que 0'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newExercise = {
        id: Date.now().toString(),
        ...exerciseForm,
        createdAt: new Date().toISOString()
      }

      const updatedExercises = editingItem 
        ? exercises.map(ex => ex.id === editingItem.id ? { ...newExercise, id: editingItem.id } : ex)
        : [...exercises, newExercise]

      setExercises(updatedExercises)
      saveToStorage(updatedExercises, workouts)
      
      setSuccess(editingItem ? 'Exercício atualizado com sucesso!' : 'Exercício criado com sucesso!')
      
      setTimeout(() => {
        setShowCreateModal(false)
        setEditingItem(null)
        resetForms()
      }, 1500)

    } catch (error) {
      setErrors({ general: 'Erro ao salvar exercício. Tente novamente.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreateWorkout = async (e) => {
    e.preventDefault()
    
    if (isSubmitting) return

    // Validações
    const newErrors = {}
    
    if (!workoutForm.nameWorkout.trim()) {
      newErrors.nameWorkout = 'Nome do treino é obrigatório'
    }
    
    if (workoutForm.exercises.length === 0) {
      newErrors.exercises = 'Selecione pelo menos um exercício'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newWorkout = {
        id: Date.now().toString(),
        ...workoutForm,
        createdAt: new Date().toISOString()
      }

      const updatedWorkouts = editingItem 
        ? workouts.map(wo => wo.id === editingItem.id ? { ...newWorkout, id: editingItem.id } : wo)
        : [...workouts, newWorkout]

      setWorkouts(updatedWorkouts)
      saveToStorage(exercises, updatedWorkouts)
      
      setSuccess(editingItem ? 'Treino atualizado com sucesso!' : 'Treino criado com sucesso!')
      
      setTimeout(() => {
        setShowCreateModal(false)
        setEditingItem(null)
        resetForms()
      }, 1500)

    } catch (error) {
      setErrors({ general: 'Erro ao salvar treino. Tente novamente.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    
    if (item.nameExercise) {
      setExerciseForm({
        nameExercise: item.nameExercise,
        descriptionExercise: item.descriptionExercise || '',
        reps: item.reps,
        duration: item.duration || 0,
        load: item.load || 0,
        sets: item.sets
      })
      setActiveTab('exercises')
    } else {
      setWorkoutForm({
        nameWorkout: item.nameWorkout,
        descriptionWorkout: item.descriptionWorkout || '',
        exercises: item.exercises
      })
      setActiveTab('workouts')
    }
    
    setShowCreateModal(true)
  }

  const handleDelete = (id, type) => {
    if (type === 'exercise') {
      const updatedExercises = exercises.filter(ex => ex.id !== id)
      setExercises(updatedExercises)
      saveToStorage(updatedExercises, workouts)
    } else {
      const updatedWorkouts = workouts.filter(wo => wo.id !== id)
      setWorkouts(updatedWorkouts)
      saveToStorage(exercises, updatedWorkouts)
    }
  }

  const handleExerciseSelection = (exerciseId) => {
    setWorkoutForm(prev => ({
      ...prev,
      exercises: prev.exercises.includes(exerciseId)
        ? prev.exercises.filter(id => id !== exerciseId)
        : [...prev.exercises, exerciseId]
    }))
  }

  const filteredExercises = exercises.filter(exercise =>
    exercise.nameExercise.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredWorkouts = workouts.filter(workout =>
    workout.nameWorkout.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getExerciseById = (id) => exercises.find(ex => ex.id === id)

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen pt-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
              Carregando...
            </p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!userData) {
    return (
      <Layout>
        <div className="min-h-screen pt-16 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className={`w-16 h-16 mx-auto mb-4 ${
              isDarkMode ? 'text-slate-500' : 'text-slate-400'
            }`} />
            <h1 className={`text-2xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-slate-800'
            }`}>Acesso negado</h1>
            <p className={`mb-4 ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>Você precisa estar logado para ver esta página.</p>
            <Button variant="primary" onClick={() => window.location.href = '/accounts/login'}>
              Fazer Login
            </Button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className={`min-h-screen pt-16 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-slate-900 to-slate-800' 
          : 'bg-gradient-to-br from-slate-50 to-blue-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>Meus Treinos</h1>
              <p className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                Gerencie seus exercícios e treinos personalizados
              </p>
            </div>
            <Button 
              variant="primary" 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center group"
            >
              <Plus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
              Criar {activeTab === 'exercises' ? 'Exercício' : 'Treino'}
            </Button>
          </div>

          {/* Tabs */}
          <div className={`rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-white border-slate-100'
          }`}>
            <div className={`flex border-b ${
              isDarkMode ? 'border-slate-700' : 'border-slate-100'
            }`}>
              <button
                onClick={() => setActiveTab('exercises')}
                className={`flex-1 flex items-center justify-center py-4 px-6 font-semibold transition-all duration-200 ${
                  activeTab === 'exercises'
                    ? isDarkMode
                      ? 'bg-blue-900/30 text-blue-400 border-b-2 border-blue-400'
                      : 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : isDarkMode
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Target className="w-5 h-5 mr-2" />
                Exercícios ({exercises.length})
              </button>
              <button
                onClick={() => setActiveTab('workouts')}
                className={`flex-1 flex items-center justify-center py-4 px-6 font-semibold transition-all duration-200 ${
                  activeTab === 'workouts'
                    ? isDarkMode
                      ? 'bg-blue-900/30 text-blue-400 border-b-2 border-blue-400'
                      : 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : isDarkMode
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Dumbbell className="w-5 h-5 mr-2" />
                Treinos ({workouts.length})
              </button>
            </div>

            {/* Search */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <Input
                type="text"
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder={`Buscar ${activeTab === 'exercises' ? 'exercícios' : 'treinos'}...`}
                icon={Search}
              />
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === 'exercises' ? (
                <div className="space-y-4">
                  {filteredExercises.length > 0 ? (
                    filteredExercises.map((exercise) => (
                      <div key={exercise.id} className={`border rounded-xl p-6 hover:shadow-md transition-all duration-200 ${
                        isDarkMode 
                          ? 'border-slate-700 hover:border-slate-600' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className={`text-xl font-semibold mb-2 ${
                              isDarkMode ? 'text-white' : 'text-slate-800'
                            }`}>{exercise.nameExercise}</h3>
                            {exercise.descriptionExercise && (
                              <p className={`mb-4 ${
                                isDarkMode ? 'text-slate-300' : 'text-slate-600'
                              }`}>{exercise.descriptionExercise}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(exercise)}
                              className={`p-2 rounded-lg transition-colors duration-200 ${
                                isDarkMode
                                  ? 'text-slate-400 hover:text-blue-400 hover:bg-blue-900/30'
                                  : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'
                              }`}
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(exercise.id, 'exercise')}
                              className={`p-2 rounded-lg transition-colors duration-200 ${
                                isDarkMode
                                  ? 'text-slate-400 hover:text-red-400 hover:bg-red-900/30'
                                  : 'text-slate-500 hover:text-red-600 hover:bg-red-50'
                              }`}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className={`flex items-center rounded-lg px-3 py-2 ${
                            isDarkMode ? 'bg-slate-700' : 'bg-slate-50'
                          }`}>
                            <Repeat className={`w-4 h-4 mr-2 ${
                              isDarkMode ? 'text-blue-400' : 'text-blue-600'
                            }`} />
                            <div>
                              <div className={`text-xs ${
                                isDarkMode ? 'text-slate-400' : 'text-slate-500'
                              }`}>Repetições</div>
                              <div className={`font-semibold ${
                                isDarkMode ? 'text-white' : 'text-slate-800'
                              }`}>{exercise.reps}</div>
                            </div>
                          </div>
                          
                          <div className={`flex items-center rounded-lg px-3 py-2 ${
                            isDarkMode ? 'bg-slate-700' : 'bg-slate-50'
                          }`}>
                            <Target className={`w-4 h-4 mr-2 ${
                              isDarkMode ? 'text-green-400' : 'text-green-600'
                            }`} />
                            <div>
                              <div className={`text-xs ${
                                isDarkMode ? 'text-slate-400' : 'text-slate-500'
                              }`}>Séries</div>
                              <div className={`font-semibold ${
                                isDarkMode ? 'text-white' : 'text-slate-800'
                              }`}>{exercise.sets}</div>
                            </div>
                          </div>
                          
                          {exercise.duration > 0 && (
                            <div className={`flex items-center rounded-lg px-3 py-2 ${
                              isDarkMode ? 'bg-slate-700' : 'bg-slate-50'
                            }`}>
                              <Clock className={`w-4 h-4 mr-2 ${
                                isDarkMode ? 'text-purple-400' : 'text-purple-600'
                              }`} />
                              <div>
                                <div className={`text-xs ${
                                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                }`}>Duração</div>
                                <div className={`font-semibold ${
                                  isDarkMode ? 'text-white' : 'text-slate-800'
                                }`}>{exercise.duration}s</div>
                              </div>
                            </div>
                          )}
                          
                          {exercise.load > 0 && (
                            <div className={`flex items-center rounded-lg px-3 py-2 ${
                              isDarkMode ? 'bg-slate-700' : 'bg-slate-50'
                            }`}>
                              <Weight className={`w-4 h-4 mr-2 ${
                                isDarkMode ? 'text-orange-400' : 'text-orange-600'
                              }`} />
                              <div>
                                <div className={`text-xs ${
                                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                }`}>Carga</div>
                                <div className={`font-semibold ${
                                  isDarkMode ? 'text-white' : 'text-slate-800'
                                }`}>{exercise.load}kg</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Target className={`w-16 h-16 mx-auto mb-4 ${
                        isDarkMode ? 'text-slate-600' : 'text-slate-400'
                      }`} />
                      <h3 className={`text-xl font-semibold mb-2 ${
                        isDarkMode ? 'text-white' : 'text-slate-800'
                      }`}>Nenhum exercício encontrado</h3>
                      <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                        {searchTerm ? 'Tente buscar por outro termo' : 'Comece criando seu primeiro exercício'}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredWorkouts.length > 0 ? (
                    filteredWorkouts.map((workout) => (
                      <div key={workout.id} className={`border rounded-xl p-6 hover:shadow-md transition-all duration-200 ${
                        isDarkMode 
                          ? 'border-slate-700 hover:border-slate-600' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className={`text-xl font-semibold mb-2 ${
                              isDarkMode ? 'text-white' : 'text-slate-800'
                            }`}>{workout.nameWorkout}</h3>
                            {workout.descriptionWorkout && (
                              <p className={`mb-4 ${
                                isDarkMode ? 'text-slate-300' : 'text-slate-600'
                              }`}>{workout.descriptionWorkout}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(workout)}
                              className={`p-2 rounded-lg transition-colors duration-200 ${
                                isDarkMode
                                  ? 'text-slate-400 hover:text-blue-400 hover:bg-blue-900/30'
                                  : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'
                              }`}
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(workout.id, 'workout')}
                              className={`p-2 rounded-lg transition-colors duration-200 ${
                                isDarkMode
                                  ? 'text-slate-400 hover:text-red-400 hover:bg-red-900/30'
                                  : 'text-slate-500 hover:text-red-600 hover:bg-red-50'
                              }`}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className={`text-sm font-medium mb-3 ${
                            isDarkMode ? 'text-slate-300' : 'text-slate-700'
                          }`}>Exercícios ({workout.exercises.length}):</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {workout.exercises.map((exerciseId) => {
                              const exercise = getExerciseById(exerciseId)
                              return exercise ? (
                                <div key={exerciseId} className={`flex items-center rounded-lg px-3 py-2 ${
                                  isDarkMode ? 'bg-slate-700' : 'bg-slate-50'
                                }`}>
                                  <Target className={`w-4 h-4 mr-2 flex-shrink-0 ${
                                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                                  }`} />
                                  <span className={`text-sm ${
                                    isDarkMode ? 'text-slate-300' : 'text-slate-700'
                                  }`}>{exercise.nameExercise}</span>
                                </div>
                              ) : null
                            })}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Dumbbell className={`w-16 h-16 mx-auto mb-4 ${
                        isDarkMode ? 'text-slate-600' : 'text-slate-400'
                      }`} />
                      <h3 className={`text-xl font-semibold mb-2 ${
                        isDarkMode ? 'text-white' : 'text-slate-800'
                      }`}>Nenhum treino encontrado</h3>
                      <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                        {searchTerm ? 'Tente buscar por outro termo' : 'Comece criando seu primeiro treino'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal de Criação/Edição */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className={`w-full max-w-2xl rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-slate-800 border-slate-700' 
                : 'bg-white border-slate-100'
            }`}>
              {/* Header */}
              <div className={`px-6 py-4 border-b ${
                isDarkMode ? 'border-slate-700' : 'border-slate-100'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 ${
                      activeTab === 'exercises'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700'
                        : 'bg-gradient-to-r from-green-600 to-green-700'
                    }`}>
                      {activeTab === 'exercises' ? (
                        <Target className="w-5 h-5 text-white" />
                      ) : (
                        <Dumbbell className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <h3 className={`text-lg font-semibold ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>
                      {editingItem 
                        ? `Editar ${activeTab === 'exercises' ? 'Exercício' : 'Treino'}`
                        : `Criar ${activeTab === 'exercises' ? 'Exercício' : 'Treino'}`
                      }
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setShowCreateModal(false)
                      setEditingItem(null)
                      resetForms()
                    }}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      isDarkMode 
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={activeTab === 'exercises' ? handleCreateExercise : handleCreateWorkout} className="p-6">
                {/* Error Message */}
                {errors.general && (
                  <div className={`mb-4 p-3 rounded-xl border flex items-center ${
                    isDarkMode 
                      ? 'bg-red-900/20 border-red-700 text-red-400' 
                      : 'bg-red-50 border-red-200 text-red-700'
                  }`}>
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">{errors.general}</span>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className={`mb-4 p-3 rounded-xl border flex items-center ${
                    isDarkMode 
                      ? 'bg-green-900/20 border-green-700 text-green-400' 
                      : 'bg-green-50 border-green-200 text-green-700'
                  }`}>
                    <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">{success}</span>
                  </div>
                )}

                {activeTab === 'exercises' ? (
                  <div className="space-y-4">
                    <Input
                      label="Nome do Exercício *"
                      type="text"
                      value={exerciseForm.nameExercise}
                      onChange={(value) => setExerciseForm(prev => ({ ...prev, nameExercise: value }))}
                      placeholder="Ex: Supino Reto"
                      icon={Target}
                      error={errors.nameExercise}
                      required
                    />

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Descrição do Exercício
                      </label>
                      <textarea
                        value={exerciseForm.descriptionExercise}
                        onChange={(e) => setExerciseForm(prev => ({ ...prev, descriptionExercise: e.target.value }))}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                          isDarkMode 
                            ? 'border-slate-600 bg-slate-700 text-white placeholder-slate-400' 
                            : 'border-slate-200 bg-slate-50 text-slate-700 placeholder-slate-400'
                        }`}
                        placeholder="Descreva como executar o exercício..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          isDarkMode ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          Repetições *
                        </label>
                        <input
                          type="number"
                          value={exerciseForm.reps}
                          onChange={(e) => setExerciseForm(prev => ({ ...prev, reps: parseInt(e.target.value) || 0 }))}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                            errors.reps 
                              ? 'border-red-300' 
                              : isDarkMode 
                                ? 'border-slate-600 bg-slate-700 text-white' 
                                : 'border-slate-200 bg-slate-50 text-slate-700'
                          }`}
                          min="1"
                          required
                        />
                        {errors.reps && (
                          <p className="mt-1 text-sm text-red-600">{errors.reps}</p>
                        )}
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          isDarkMode ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          Séries *
                        </label>
                        <input
                          type="number"
                          value={exerciseForm.sets}
                          onChange={(e) => setExerciseForm(prev => ({ ...prev, sets: parseInt(e.target.value) || 0 }))}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                            errors.sets 
                              ? 'border-red-300' 
                              : isDarkMode 
                                ? 'border-slate-600 bg-slate-700 text-white' 
                                : 'border-slate-200 bg-slate-50 text-slate-700'
                          }`}
                          min="1"
                          required
                        />
                        {errors.sets && (
                          <p className="mt-1 text-sm text-red-600">{errors.sets}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          isDarkMode ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          Duração (segundos)
                        </label>
                        <input
                          type="number"
                          value={exerciseForm.duration}
                          onChange={(e) => setExerciseForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                            isDarkMode 
                              ? 'border-slate-600 bg-slate-700 text-white' 
                              : 'border-slate-200 bg-slate-50 text-slate-700'
                          }`}
                          min="0"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          isDarkMode ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          Carga (kg)
                        </label>
                        <input
                          type="number"
                          value={exerciseForm.load}
                          onChange={(e) => setExerciseForm(prev => ({ ...prev, load: parseInt(e.target.value) || 0 }))}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                            isDarkMode 
                              ? 'border-slate-600 bg-slate-700 text-white' 
                              : 'border-slate-200 bg-slate-50 text-slate-700'
                          }`}
                          min="0"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Input
                      label="Nome do Treino *"
                      type="text"
                      value={workoutForm.nameWorkout}
                      onChange={(value) => setWorkoutForm(prev => ({ ...prev, nameWorkout: value }))}
                      placeholder="Ex: Treino de Peito e Tríceps"
                      icon={Dumbbell}
                      error={errors.nameWorkout}
                      required
                    />

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Descrição do Treino
                      </label>
                      <textarea
                        value={workoutForm.descriptionWorkout}
                        onChange={(e) => setWorkoutForm(prev => ({ ...prev, descriptionWorkout: e.target.value }))}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                          isDarkMode 
                            ? 'border-slate-600 bg-slate-700 text-white placeholder-slate-400' 
                            : 'border-slate-200 bg-slate-50 text-slate-700 placeholder-slate-400'
                        }`}
                        placeholder="Descreva o objetivo do treino..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Exercícios * ({workoutForm.exercises.length} selecionados)
                      </label>
                      {exercises.length > 0 ? (
                        <div className={`border rounded-xl p-4 max-h-60 overflow-y-auto ${
                          errors.exercises 
                            ? 'border-red-300' 
                            : isDarkMode 
                              ? 'border-slate-600 bg-slate-700' 
                              : 'border-slate-200 bg-slate-50'
                        }`}>
                          <div className="space-y-2">
                            {exercises.map((exercise) => (
                              <label key={exercise.id} className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                                workoutForm.exercises.includes(exercise.id)
                                  ? isDarkMode
                                    ? 'bg-blue-900/30 border border-blue-700'
                                    : 'bg-blue-50 border border-blue-200'
                                  : isDarkMode
                                    ? 'hover:bg-slate-600'
                                    : 'hover:bg-slate-100'
                              }`}>
                                <input
                                  type="checkbox"
                                  checked={workoutForm.exercises.includes(exercise.id)}
                                  onChange={() => handleExerciseSelection(exercise.id)}
                                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:ring-2 mr-3"
                                />
                                <div className="flex-1">
                                  <div className={`font-medium ${
                                    isDarkMode ? 'text-white' : 'text-slate-800'
                                  }`}>{exercise.nameExercise}</div>
                                  <div className={`text-sm ${
                                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                                  }`}>
                                    {exercise.reps} reps × {exercise.sets} séries
                                    {exercise.load > 0 && ` • ${exercise.load}kg`}
                                  </div>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className={`border rounded-xl p-8 text-center ${
                          isDarkMode 
                            ? 'border-slate-600 bg-slate-700' 
                            : 'border-slate-200 bg-slate-50'
                        }`}>
                          <Target className={`w-12 h-12 mx-auto mb-3 ${
                            isDarkMode ? 'text-slate-500' : 'text-slate-400'
                          }`} />
                          <p className={`font-medium mb-2 ${
                            isDarkMode ? 'text-white' : 'text-slate-800'
                          }`}>Nenhum exercício disponível</p>
                          <p className={`text-sm ${
                            isDarkMode ? 'text-slate-400' : 'text-slate-600'
                          }`}>Crie alguns exercícios primeiro para poder criar treinos</p>
                        </div>
                      )}
                      {errors.exercises && (
                        <p className="mt-1 text-sm text-red-600">{errors.exercises}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 mt-6">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="flex-1"
                    disabled={isSubmitting || (activeTab === 'workouts' && exercises.length === 0)}
                  >
                    {isSubmitting ? (
                      <span>Salvando...</span>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        {editingItem ? 'Atualizar' : 'Criar'} {activeTab === 'exercises' ? 'Exercício' : 'Treino'}
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => {
                      setShowCreateModal(false)
                      setEditingItem(null)
                      resetForms()
                    }}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}