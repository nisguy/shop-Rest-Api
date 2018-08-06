const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) =>{
    res.json({
        text: "Handling GET requests to /products"
    });
});
router.post('/', (req, res, next) =>{
    let product = {
        name: req.body.name,
        price: req.body.price
    };
    res.status(201).json({
        text: "Product was created:",
        createdProduct: product
    });
});
router.get('/:productId', (req, res, next) =>{
    let id = req.params.productId;
    if (id === 'special'){
        res.status(200).json({
            message: "Congrats you have found the special product"
        })
    } else {
        res.json({
            message: "You have passed an ID"
        });
    }
});
router.patch('/:productId', (req, res, next) =>{
    let id = req.params.productId;
    res.json({
        text: `Handling UPDATE requests to product with id: ${id}`
    });
});
router.delete('/:productId', (req, res, next) =>{
    let id = req.params.productId;
    res.json({
        text: `Handling DELETE requests to product with id: ${id}`
    });
});

module.exports = {router};