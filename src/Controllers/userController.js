const userModel = require("../models/userModel")
const vaidator = require("validator")
const { default: isEmail } = require("validator/lib/isemail")
const jwt = require("jsonwebtoken")

//============================================================= validation ==================================================================//
const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidTitle = function (title) {
    return ["Mr", "Mrs", "Miss"].indexOf(title.trim()) != -1

}

let isValidMobile = function (number) {
    let mobileRegex = /^[6-9]{1}[0-9]{9}$/;
    return mobileRegex.test(number);
}
//======================================================= create User ======================================================================//
const createUser = async function (req, res) {
    try {
        const data = req.body
        const { title, name, phone, email, password, address } = data

        if (Object.keys(data).length <= 0) {
            return res.status(400).send({ status: false, message: "please provide data" })
        }
        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: "title field should not be empty" })
        }

        if (!isValidTitle(title)) {
            return res.status(400).send({ status: false, message: "title should be Mr, Mrs, or Miss" })
        }

        if (!isValid(name)) {
            return res.status(400).send({ status: false, message: "Name is mandatory" })
        }
        if (!(/^[A-Za-z]+$/).test(name.trim())) {
            return res.status(400).send({ status: false, message: "Name should only contain alphabet" })
        }
        if (!isValid(phone)) {
            return res.status(400).send({ status: false, message: "please provide phone number" })
        }

        if (!isValidMobile(phone)) {
            return res.status(400).send({ status: false, message: "please provide 10 digit phone number" })
        }
        let phoneunique = await userModel.findOne({ phone: phone })
        if (phoneunique) return res.status(400).send({ status: false, message: "phone number already exist please provide different phone number" })

        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "email is mandatory" })
        }
        if (!isEmail(email.trim())) {
            return res.status(400).send({ status: false, message: "email is not in correct format" })
        }

        let uniqueEmail = await userModel.findOne({ email: email })
        if (uniqueEmail) return res.status(400).send({ status: false, message: email + "has already registered" })

        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "password is mandatory" })
        }
        if (!(/^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9!@#$%^&*]{8,15})$/).test(password.trim())) {
            return res.status(400).send({ status: false, message: "password is not strong,must contain atleast 1 uppercase 1 lowercase ,1 specialcharacter,and number and must be 8 or 15 characters" })
        }
        if (!isValid(address)) {
            return res.status(400).send({ status: false, message: "address is mandatory" })
        }
        if (!isValid(address.street)) {
            return res.status(400).send({ status: false, message: "In the address street is mandatory" })
        }
        if (!isValid(address.city)) {
            return res.status(400).send({ status: false, message: "In the address city is mandatory" })
        }
        if (!isValid(address.pincode)) {
            return res.status(400).send({ status: false, message: "In the address pincode is mandatory" })
        }
        const userCreation = await userModel.create(data)
        res.status(201).send({ status: true, message: "Success", data: userCreation })

    } catch (err) {
        res.status(500).send({ message: "Error", error: err.message });
    }
}

//======================================================== login User ==================================================================== //
const loginUser = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length <= 0) {
            return res.status(400).send({ status: false, message: "please provide login credentials" })
        }
        if (!isValid(data.email)) {
            return res.status(400).send({ status: false, message: "Please provide your Email " })
        }
        if (!isValid(data.password)) {
            return res.status(400).send({ status: false, message: "Please provide your Password " })
        }
        let useremail = await userModel.findOne({ email: data.email })
        if (!useremail) return res.status(404).send({ status: false, message: "Invalid email" })

        let userpassword = await userModel.findOne({ password: data.password })
        if (!userpassword) return res.status(404).send({ status: false, message: "Invalid password" })

        let user = await userModel.findOne({ email: data.email, password: data.password })
        let token = jwt.sign({
            userId: user._id.toString(),
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) * 24 * 60 * 60,
        }, "Project_3_BooksManagement")
        res.setHeader("x-api-key", token);
        res.status(200).send({ status: true, message: "Success", data: token });

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}


module.exports = {
    createUser,
    loginUser
}
