const mongoose = require('mongoose')

// ADMIN SCHEMA AND MODEL: ---------------------------

const Schema = mongoose.Schema

const adminSchema = new Schema({
    login_name: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    login_level: {
        type: String,
        validate: {
            validator: function(level) {
                if (level === 'ADM' || level === 'GO' ) {
                    return true
                } else return false
            }
        },
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