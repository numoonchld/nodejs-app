const mongoose = require('mongoose')

// ADMIN SCHEMA AND MODEL: ---------------------------

const Schema = mongoose.Schema

const adminSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    last_login: {
        type: Date
    },
    login_count: Number
})

module.exports = mongoose.model('AdminUser',adminSchema)