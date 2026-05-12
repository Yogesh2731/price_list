const express = require('express');
const { verifyToken } = require('../middleware/auth');
const { getProducts, patchProducts } = require('../controller/productController');
const router = express.Router();

router.get('/', verifyToken, getProducts);
router.get('/:id', verifyToken, getProducts);

router.patch('/:id', verifyToken, patchProducts);

module.exports = router;
