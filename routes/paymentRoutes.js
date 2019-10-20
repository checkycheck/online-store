const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");




router.route('/checkout')
    .get(paymentController.checkoutGet)


router.route('/paystack/pay')
.post(paymentController.paymentPayPost)










module.exports = router;
