const mongoose = require('mongoose')

const CommentsSchema = new mongoose.Schema({
    rate: {
        type: mongoose.Schema.Types.Int32,
        default: 1,
        required: false
    },
    comment: {
        type: String,
        required: true,
    }
}, { timestamps: true, strict: true })

module.exports = mongoose.model('comment', CommentsSchema, 'comments')