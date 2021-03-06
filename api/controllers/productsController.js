const Product = require('../models/products');
const mongoose = require('mongoose');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

exports.productsGetAll = (req, res, next) =>{
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
};

exports.productsPostNewProduct = (req, res, next) =>{
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
};

exports.productsGetSpecific = (req, res, next) =>{
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
};

exports.productsUpdateSpecific = (req, res, next) =>{
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
};

exports.productsDeleteSpecific = (req, res, next) =>{
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
};