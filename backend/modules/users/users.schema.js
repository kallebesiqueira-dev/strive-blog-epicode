const mongoose = require('mongoose')

const User = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        max: 100
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    dob: {
        type: Date,
        required: false,
        default: Date.now()
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    avatar: {
        type: String,
        required: false,
        default: 'https://i.pravatar.cc/300',
    },
    age: {
        type: mongoose.Schema.Types.Int32,
        required: false,
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'post',
            default: []
        }
    ]
}, { timestamps: true, strict: true }) //createdAt e updatedAt

module.exports = mongoose.model('user', User, 'users')