const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Post2Schema = new Schema({
    title:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true
    },
    file: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    creationDate:{
        type: Date,
        default: Date.now
    },

    user: {
        type:    [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    },
    category: {
        type: [{
        type: Schema.Types.ObjectId,
        ref: 'category'
    }]

    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'comment'
        }
    ],

    allowComments: {
        type: Boolean,
        default: false
    }

});

module.exports = {Post2: mongoose.model('Post2', Post2Schema)};