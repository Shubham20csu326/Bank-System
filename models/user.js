const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    account: { type: Number, required: true },
    password: { type: String, required: true },
    balance: { type: Number, required: true }
})
module.exports = mongoose.model('User', userSchema)