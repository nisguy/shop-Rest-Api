const express = require('express');
const router = express.Router();

router.get('/', (req, res, next)=>{
    res.status(200).json({
        message: "Orders were fetched"
    });
});
router.post('/', (req, res, next)=>{
    let order = {
        productId : req.body.id,
        quantity: req.body.quantity
    } ;
    res.status(201).json({
        message: "Order created.",
        order: order
    });
});
router.get('/:orderId', (req, res, next)=>{
    let id = req.params.orderId;
    res.status(200).json({
        message: "Order details:",
        Orderid: id
    });
});
router.delete('/:orderId', (req, res, next)=>{
    let id = req.params.orderId;
    res.status(200).json({
        message: "Order was deleted:",
    });
});

module.exports = {router}