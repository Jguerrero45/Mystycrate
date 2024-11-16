const express = require('express');
const LoginController = require('../controllers/LoginController');
const router = express.Router();

router.get('/login', LoginController.login);
router.get('/register', LoginController.register);
router.post('/register', LoginController.storeUser);
router.post('/login', LoginController.auth);
router.get('/logout', LoginController.logout);
router.get('/register/plans/:id',LoginController.plans)
router.get('/register/plans/pay/:id_usuario/:id_plan',LoginController.pay)
router.post('/register/plans/pay/:id_usuario/:id_plan',LoginController.realizarpago)
router.get('/eliminar/:id',LoginController.eliminar)

module.exports = router;