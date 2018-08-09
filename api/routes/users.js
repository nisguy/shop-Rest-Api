const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const express = require('express');
const {ObjectID} = require('mongodb');

const router = express.Router();
const User = require('../models/users');

router.post('/signup', (req, res, next) =>{
    User.find({email: req.body.email}).then((user)=>{
        if(user.length >0){
            return res.status(409).json({
                error: "User with the same email exists"
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash)=>{
                if(err){
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user.save().then((result)=>{
                        console.log(result);
                        res.status(201).json({
                            text: "User created"
                        });
                    }).catch((e)=>{
                        res.status(500).json({
                            error: e
                        });
                    });
                }
            });
        }
    }).catch((e)=>{
        res.status(500).json({
            error: e
        });
    });
});

router.delete('/:userId', (req, res, next)=>{
    const id = req.params.userId;
    if (!ObjectID.isValid(id)){
        return res.status(400).json({
            error: "The given user Id is invalid"
        });
    } else {
        User.findByIdAndDelete(id).then((result)=>{
            if(!result){
                return res.status(404).json({
                    error: "No user with that id"
                })
            }
            res.status(200).json({
                text: "User successfully deleted"
            });
        }).catch((e)=>{
            console.log(e);
            res.status(500).json({
                error: e
            });
        });
    }
});

module.exports = router;