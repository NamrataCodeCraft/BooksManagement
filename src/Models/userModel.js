const { trim } = require("lodash");
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    title: {
        type: String,
        required: "title is required",
        enum: ["Mr", "Mrs", "Miss"],
        trim: true

    },
    name: {
        type: String,
        required: "name is required field",
        trim: true

    },
    phone: {
        type: Number,
        required: "phone is required field",
        minLen: 8,
        maxLen: 15,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: "email is required field",
        unique: true,
        trim: true

    },
    password: {
        type: String,
        required: "password is required field",
        trim: true
    },
    address: {
        street: {
            type: String,
            trim: true
        },
        city: {
            type: String,
            trim: true
        },
        pincode: Number
    }

}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)  //users