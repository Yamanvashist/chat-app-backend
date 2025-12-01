const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    username: {
        required: true,
        type: String,
        unique: true
    },
    email: {
        required: true,
        type: String,
        unique: true,
        lowercase: true
    },
    password: {
        required: true,
        type: String,
    }

}, { timestamps: true })

module.exports = mongoose.model("Users", userSchema)