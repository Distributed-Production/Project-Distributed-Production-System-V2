const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userModel = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirm_password: {
        type: String,
        required: true
    },
    twitter: String,
    facebook: String,
    instagram: String,
    first_name: {
        type: String,
        required: true
    },
    last_name: String,
    phone_number: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    date_created: {
        type: Date,
        default: Date.now
    }
})

const user_model = mongoose.model('user', userModel)

module.exports = user_model