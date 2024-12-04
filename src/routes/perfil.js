const express = require('express');
const perfilController = require('../controllers/perfilController');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.get('/:correo', perfilController.obtenerusuario);
router.post('/:correo', upload.single('profile_image'), perfilController.modificarusuario);
router.get('/:correo/eliminar', perfilController.eliminarusuario);
router.get('/:correo/cajas', perfilController.obtenercajas);

module.exports = router;

