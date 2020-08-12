const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ApproveSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    file: {
        type: String,
        required:true
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
       type: String,
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

module.exports = {Approve: mongoose.model('Approve', ApproveSchema)};