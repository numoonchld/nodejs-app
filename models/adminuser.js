const mongoose = require('mongoose')

// ADMIN SCHEMA AND MODEL: ---------------------------

const Schema = mongoose.Schema

const adminSchema = new Schema({
    adminname: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    last_login: {
        type: Date,
        default: Date.now
    },
    login_count: Number,
    gym_count: Number
})

module.exports = mongoose.model('AdminUser',adminSchema)