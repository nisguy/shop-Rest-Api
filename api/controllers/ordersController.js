const mongoose = require('mongoose');
const {ObjectID} = require('mongodb');

const Order = require('../models/orders');
const Product = require('../models/products');

exports.ordersGetAll = (req, res, next)=>{
    Order.find().select('_id product quantity').populate('product', 'name price productImage').then(docs=>{
        res.status(200).json({
            message: "Orders were fetched",
            count: docs.length,
            Orders: docs.map((doc)=>{
                return {
                    id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    orderCreatedAt: doc._id.getTimestamp(),
                    request: {
                        type: 'GET',
                        url: `localhost:3000/orders/${doc._id}`
                    }
                }
            })
        });
    }).catch((e)=>{
        res.status(500).json({error: e.message});
    });
};

exports.ordersPostAnOrder = (req, res, next)=>{
    let order = new Order({
        _id : mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity
    }) ;

    Product.findById(order.product).then(doc=>{
        if(!doc){
            return res.status(400).json({
                error: "The product doesn't exist."
            });
        }
        order.save().then((result)=>{
            res.status(201).json({
                text: 'Order created',
                Product: result.product,
                quantity: result.quantity,
                request: {
                    type: 'GET',
                    url: `localhost:3000/orders/${result._id}`
                }
            });
        }).catch((e)=>{
            res.status(500).json({error: e});
        });
    });
};

exports.ordersGetASpecific = (req, res, next)=>{
    let id = req.params.orderId;
    if (!ObjectID.isValid(id)){
        return res.json({error: "ID provided is not a valid one"});
    }

    Order.findById(id).populate('product', 'name price').then((doc)=>{
        if(!doc){
            res.status(404).json({
                error: 'No order by that Id'
            });
        }
        res.status(200).json({
            message: "Order details:",
            Orderid: id,
            Product: doc.product,
            quantity: doc.quantity,
            OrderCreatedAt: doc._id.getTimestamp()
        });
    });
};

exports.ordersDeleteAnOrder = (req, res, next)=>{
    let id = req.params.orderId;
    if(!ObjectID.isValid(id)) {
        return res.status(400).json({
            error: "The ID provided is not a valid one"
        });
    }

    Order.findByIdAndDelete(id).then(doc=>{
        if(!doc){
            return res.status(404).json({error: "There is no order by that ID in the database"});
        }
        res.status(200).json({
            text: "Successfully deleted the order."
        });
    }).catch((e)=>{
        res.status(500).json({
            error: e.message
        });
    });
};