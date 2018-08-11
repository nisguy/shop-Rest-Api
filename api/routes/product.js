const express = require('express');
const mongoose = require('mongoose');
const {ObjectID} = require('mongodb');
const _ = require('lodash');
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

const Product = require('../models/products');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/shopRestApi',{useNewUrlParser: true});

router.get('/', (req, res, next) =>{
    Product.find().select('_id name price productImage').then((docs)=>{
        let response = {
            count: docs.length,
            products: docs.map(doc=>{
                return {
                    id: doc._id,
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    request: {
                        type: 'GET',
                        url: `localhost:3000/products/${doc._id}`
                    }
                };
            })
        };
        res.status(200).json(response);
    }).catch((e)=>{
        res.status(500).json({error: e.message});
    });
});
router.post('/', checkAuth, upload.single('productImage'), (req, res, next) =>{
    let product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save().then((doc)=>{
        res.status(201).json({
            text: "Product was created:",
            createdProduct: {
                id: doc._id,
                name: doc.name,
                price: doc.price,
                productImage: doc.productImage
            }
        });
    });
});
router.get('/:productId', (req, res, next) =>{
    let id = req.params.productId;

    if (!ObjectID.isValid(id)){
        return res.status(400).json({error: 'Invalid product ID'});
    }
    Product.findById(id).select('name price productImage').then((doc)=>{
        if(!doc){
            return res.status(404).json({error: 'Product not found'});
        }
        res.status(200).json(doc);
    }).catch((e)=>{
        res.status(404).json({error: e.message});
    });
});
router.patch('/:productId', checkAuth, (req, res, next) =>{
    let id = req.params.productId;
    if (!ObjectID.isValid(id)){
        return res.status(400).json({error: 'Invalid product ID'});
    }
    let body = _.pick(req.body, ['name','price']);
    Product.findByIdAndUpdate(id, {$set: body}, {new: true}).then((doc)=>{
        if(!doc){
            return res.status(404).json({error: 'Product not found'});
        }
        res.status(202).json({
            text: 'Product updated',
            request: {
                type: 'GET',
                url: `localhost:3000/products/${id}`
            }
        });
    }).catch((e)=>{
        res.status(500).json({
            error: e.message
        });
    });
});
router.delete('/:productId', checkAuth, (req, res, next) =>{
    let id = req.params.productId;
    if(!ObjectID.isValid(id)){
        return res.status(400).json({error: 'Invalid product ID'});
    }
    Product.findByIdAndDelete(id).select('name price').then((doc)=>{
        if(!doc){
            return res.status(404).json({error: 'Product not found'});
        }
        res.status(200).json({
            text: 'Product deleted',
            Product: doc
        });
    }).catch((e)=>{
        res.status(404).json({error: e.message});
    });
});

module.exports = {router};