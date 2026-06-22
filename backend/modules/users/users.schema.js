const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

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
        default: Date.now
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId
        },
        min: 8,
        select: false
    },
    googleId: {
        type: String,
        required: false
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

User.pre('save', async function () {
    if (!this.isModified('password')) {
        return
    }
    this.password = await bcrypt.hash(this.password, 10)
})

User.methods.comparePassword = function (plainPassword) {
    if (!this.password) {
        return false
    }
    return bcrypt.compare(plainPassword, this.password)
}

module.exports = mongoose.model('user', User, 'users')