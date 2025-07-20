import multer from 'multer';
import path from 'path';
const storage = multer.diskStorage({ // Configurando o multer para salvar no Disco Rígido
  destination: function (req, file, cb) { // DefiniNDO em qual pasta o arquivo será salvo.
    if (file.fieldname === 'profileImage') { // Verifica se o campo file está com o nome 'profileImage'.
      cb(null, 'uploads-users/'); // Se estiver com esse nome ele salva nessa pasta.
    } else if (file.fieldname === 'exerciseImage') {
      cb(null, 'uploads-exercises/');
    } else if (file.fieldname === 'workoutImage') {
      cb(null, 'uploads-workouts/');
    } else {
      cb(new Error('Campo de upload inválido'), null);
    }
  },
  filename: function (req, file, cb) { // Definindo o nome do arquivo salvo.
    if (file.fieldname === 'profileImage') { // Verifica se o campo file está com o nome 'profileImage'.
      cb(null, 'user-'+Date.now()+path.extname(file.originalname)); // Se estiver com esse nome ele salva nessa pasta.
    } else if (file.fieldname === 'exerciseImage') {
      cb(null, 'exercise-'+Date.now()+path.extname(file.originalname));
    } else if (file.fieldname === 'workoutImage') {
      cb(null, 'workout-'+Date.now()+path.extname(file.originalname));
    }
  },
});

const upload = multer({ // Configura o middleware Multer com as opções de armazenamento.
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // limite de 2MB
  fileFilter: function (req, file, cb) {
    // Permitir somente arquivos de imagem (jpeg, png, etc)
    if (!file.mimetype.startsWith('image/')) { // Configurando o upload permitindo somente imagens.
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

export default upload;