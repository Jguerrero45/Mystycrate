const express = require('express');
const LoginController = require('../controllers/LoginController');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.get('/login', LoginController.login);
router.get('/register', LoginController.register);
router.post('/register',upload.single('profile_image'), LoginController.storeUser);
router.post('/login', LoginController.auth);
router.get('/logout', LoginController.logout);
router.get('/register/plans/:id',LoginController.plans)
router.get('/register/plans/categorias/:id_usuario/:id_plan',LoginController.categorias)
router.post('/register/plans/categorias/:id_usuario/:id_plan',LoginController.eleccioncategorias)
router.get('/register/plans/categorias/:id_usuario/:id_plan/:categoria/encuesta',LoginController.encuestas)
//router.post('/register/plans/pay/:id_usuario/:id_plan',LoginController.realizarpago)
router.get('/register/plans/categorias/:id_usuario/:id_plan/:preferencia/encuesta/:tipo/:subtipo/pay',LoginController.pay)
router.post('/register/plans/categorias/:id_usuario/:id_plan/:preferencia/encuesta/:tipo/:subtipo/pay',LoginController.realizarpago)
router.get('/eliminar/:id',LoginController.eliminar)

module.exports = router;