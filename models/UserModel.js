const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
   
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    usertype: {
        type: String,
        required: true
    },
    post2: [{
        type: Schema.Types.ObjectId,
        ref: 'post2'
    }]

    
});

module.exports = {User: mongoose.model('user', UserSchema)};


  