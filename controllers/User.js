const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const generateToken = require("../Services/generateToken")

const signUp = async (req, res) => {
    const { username, email, password } = req.body
    if (!username?.trim() || !email?.trim() || !password) return res.status(400).json({ message: "Fill all required fields" });

    const userExist = await User.findOne({ email })

    if (userExist) return res.status(409).json({ message: "Email already exist" });

    const hashPassword = await bcrypt.hash(password, 10)

    try {
        const user = await User.create({
            username,
            email,
            password: hashPassword,
        })

        const token = generateToken({
            username,
            email,
            userId: user._id
        })

        res.cookie("token", token, { httpOnly: true })


        return res.status(201).json({ sucess: true, message: "SignUp successfull" })

    } catch (err) {
        res.status(500).json({ message: "Server Error SignUp", err })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body

    if (!email?.trim() || !password) return res.status(400).json({ message: "Fill all required fields" })

    try {
        const user = await User.findOne({ email })
        if (!user) return res.status(404).json({ message: "User not Found" });

        const isCorrect = await bcrypt.compare(password, user.password);
        if (!isCorrect) return res.status(400).json({ message: "Wrong password" });

         const { password: _, ...userData } = user._doc;

        const token = generateToken({
            username: user.username,
            email,
            userId: user._id
        })

        res.cookie("token", token, { httpOnly: true })

        return res.status(200).json({ sucess: true, message: "Login success", user: userData });

    } catch (err) {
        res.status(500).json({ message: "Server Error Login", err })
    }
}

module.exports = { signUp, login }