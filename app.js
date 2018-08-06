const express = require('express');
const morgan = require('morgan');

const productRoutes = require('./api/routes/product').router;
const orderRoutes = require('./api/routes/orders').router;

const app = express();
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', "*");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With, Content-Type, Accept, Authorization");

    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','POST, GET, PATCH, DELETE,PUT');
        return res.json({});
    }
    next();

});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next)=> {
    const error = new Error('Error: not found');
    error.status =404;
    next(error);
});

app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
            error: {
                message: error.message
            }
    });
});

module.exports = {app};