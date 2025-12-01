const mongoose = require("mongoose")

async function connect(path) {
    try {
        await mongoose.connect(`mongodb://localhost:27017/${path}`)
        console.log("Mongoose connected")
    } catch (err) {
        console.log("Mongoose Error")
    }
}

module.exports = connect

