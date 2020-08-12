const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    // title:{
    //     type: String,
    //     required: true
    // },
    // status:{
    //     type: String,
    //     required: true
    // },
    // file: {
    //     type: String,
    //     default: ''
    // },
    // price: {
    //     type: Number,
    //     required: true
    // },
    // description:{
    //     type: String,
    //     required: true
    // },
    // creationDate:{
    //     type: Date,
    //     default: Date.now
    // },

    user: {
        type:    [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    },

    cart: {
        // type:  [{
        //     type: Schema.Types.ObjectId,
        //     required: true
        // }]
        type:Object,
        required: true
    }
    
    

});

module.exports = {Order: mongoose.model('order', OrderSchema)};