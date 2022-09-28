const jwt = require("jsonwebtoken");

const authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) return res.status(401).send({ status: false, message: "token must be present" });
        let decodedToken = jwt.verify(token, "Project_3_BooksManagement");
        if (!decodedToken) return res.status(401).send({ status: false, message: "token is invalid" });
        next()
    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
}


module.exports.authentication = authentication

