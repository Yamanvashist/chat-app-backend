const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

dotenv.config();

const verifyToken = (req, res, next) => {
    const token = req.cookies.token

    if (!token) return res.status(401).json({loggedIn : false, message: "Not authorized , no token" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).json({loggedIn : false, message: "Invalid or expired token", err });
    }


} ;

module.exports = verifyToken;
