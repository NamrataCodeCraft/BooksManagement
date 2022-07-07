const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({

    title: { type:String, required:true, enum:["Mr","Mrs","Miss"]},

    name: { type:String, required:true},

    phone: { type:Number, required:true, unique:true},

    email: { type:String, required:true, unique:true, },

<<<<<<< HEAD
    password: { type:String, required:true, minLength:8, maxLength:15 }, //  password: {string, mandatory, minLen 8, maxLen 15},
=======
    password: {}
       

>>>>>>> 479051c457af013069c7d379c7960455e3f6f143

    address: [{
        street: String,
        city: String,
        pincode: String,
    }],
    
<<<<<<< HEAD
},{timestamps:true})
=======
}, { timestamps: true });

module.exports = mongoose.model('users', userSchema)


>>>>>>> 479051c457af013069c7d379c7960455e3f6f143

module.exports = mongoose.model("user",userSchema)