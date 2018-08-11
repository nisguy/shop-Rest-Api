const mongoose = require('mongoose');
const express = require('express');

const router = express.Router();

const ordersController = require('../controllers/ordersController');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/shopRestApi',{useNewUrlParser: true});

router.get('/', ordersController.ordersGetAll);
router.post('/', ordersController.ordersPostAnOrder);
router.get('/:orderId', ordersController.ordersGetASpecific);
router.delete('/:orderId', ordersController.ordersDeleteAnOrder);

module.exports = {router};