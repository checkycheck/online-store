const express = require("express");
const router = express.Router();
const request = require('request');
const bodyParser = require('body-parser');
const _ = require('lodash');
const path = require('path');
var Cart = require('../models/cart');

const { Pay } = require('../models/pay')
const { initializePayment, verifyPayment } = require('../config/paystack')(request);


module.exports = {
        
        checkoutGet: (req, res) => {
            var cart = new Cart(req.session.cart);
            res.render('payment/checkout', {totalPrice: cart.totalPrice})
        },
        // ===============================================     major payment section =================================
        paymentPayPost:(req,res)=>{
            const form = _.pick(req.body, ['amount', 'email', 'full_name']);
            form.metadata = {
                full_name: form.full_name
            }
            form.amount *= 100;


            initializePayment(form, (error, body) => {
                if (error) {
                    //handle errors
                    console.log(error);
                    return res.redirect('/error')
                    return;
                }
                response = JSON.parse(body);
                res.redirect(response.data.authorization_url)
                console.log(response);
            });
        },

}