const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const generateToken = ({ username, email, userId }) => {
    return jwt.sign(
        { username, email, userId },
        process.env.JWT_SECRETKEY,
        { expiresIn: "3h" }
    );
};

module.exports = generateToken;
