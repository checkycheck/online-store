const Admin = require('../models/admin').Admin;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {mongoDbUrl} = require('../config/configuration');

mongoose.Promise = global.Promise







// configure mongoose to connect to mongoDB
mongoose.connect(mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(response =>{
        console.log('mongoDB connected successfully.');
    }).catch(err =>{
        console.log('Database connection failed.');
    })



const admin = new Admin({
    firstName: 'zacks',
    lastName: 'checky',
    email: 'dungji.zacks.9@gmail.com',
    password: '080',
    usertype: 'admin'
})

bcrypt.genSalt(10,(err, salt) =>{
    bcrypt.hash(admin.password, salt, (err, hash) =>{
        if(err){
            throw err;
        }
        admin.password = hash;
        admin.save().then(()=>{
            console.log('admin save successfully')
        }).catch(err  =>{
            console.log(err);
        })
    })
})