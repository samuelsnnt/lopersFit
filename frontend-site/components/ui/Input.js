'use client'

import { Eye, EyeOff } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

export default function Input({
  label,
  type,
  value,
  onChange,
  placeholder,
  icon: Icon,
  showPassword,
  onTogglePassword,
  error,
  required,
  className = ''
}) {
  const { isDarkMode } = useTheme()

  const inputType = type === 'password' && showPassword ? 'text' : type

  return (
    <div className={`group ${className}`}>
      {label && (
        <label className={`block text-sm font-medium mb-2 ${
          isDarkMode ? 'text-slate-300' : 'text-slate-700'
        }`}>
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
            isDarkMode ? 'text-slate-500' : 'text-slate-400'
          }`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full ${Icon ? 'pl-11' : 'pl-4'} ${
            type === 'password' ? 'pr-12' : 'pr-4'
          } py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
            error 
              ? 'border-red-300' 
              : isDarkMode 
                ? 'border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:bg-slate-600' 
                : 'border-slate-200 bg-slate-50 text-slate-700 placeholder-slate-400 focus:bg-white'
          }`}
          placeholder={placeholder}
          required={required}
        />
        {type === 'password' && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
              isDarkMode 
                ? 'text-slate-500 hover:text-slate-300' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}