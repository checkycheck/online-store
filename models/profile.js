const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
   
    accountName: {
        type: String,
        required: false
    },
    accountNumber: {
        type: String,
        required: false
    },
    bank: {
        type: String,
        required: false
    },
    user: {
        type:    [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    }

});

module.exports = {Profile: mongoose.model('profile', ProfileSchema)};


  