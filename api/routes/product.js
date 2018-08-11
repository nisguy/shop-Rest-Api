const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middlewares/Auth');

const storage = multer.diskStorage({
    destination: (req,file, cb)=>{
        cb(null, 'uploads');
    },
    filename: (req, file, cb)=>{
        cb(null, file.originalname)
    }
});
const upload = multer({
    storage: storage
});

const productsController = require('../controllers/productsController');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/shopRestApi',{useNewUrlParser: true});

router.get('/', productsController.productsGetAll);
router.post('/', checkAuth, upload.single('productImage'), productsController.productsPostNewProduct);
router.get('/:productId', productsController.productsGetSpecific);
router.patch('/:productId', checkAuth, productsController.productsUpdateSpecific);
router.delete('/:productId', checkAuth, productsController.productsDeleteSpecific);

module.exports = {router};