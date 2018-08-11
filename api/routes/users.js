const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const checkAuth = require('../middlewares/Auth');
const userController = require('../controllers/usersController');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/shopRestApi',{useNewUrlParser: true});

router.post('/signup', userController.userSignup);

router.post('/signin', userController.userSignIn);

router.delete('/:userId', checkAuth, userController.userDeleteSpecific);

module.exports = router;