const express = require('express');
const productosController = require('../controllers/productosController');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.get('/golosinas', productosController.golosinas);
router.post('/golosinas',upload.single('product_image'), productosController.registrargolosina);
router.get('/inventario_golosinas', productosController.mostrarInventarioGolosinas);
module.exports = router;



