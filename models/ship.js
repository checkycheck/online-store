const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShipSchema = new Schema({
   
    // firstName: {
    //     type: String,
    //     required: false
    // },
    // lastName: {
    //     type: String,
    //     required: false
    // },
    // email: {
    //     type: String,
    //     required: false
    // },
    number: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }

    
});

module.exports = {Ship: mongoose.model('ship', ShipSchema)};


  