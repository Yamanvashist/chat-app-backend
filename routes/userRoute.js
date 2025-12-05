const express = require("express")
const { signUp, login } = require("../controllers/User")
const verifyToken = require("../authMiddleware/middleware")
const User = require("../models/userModel")

const router = express.Router()

router.post("/signup", signUp)
router.post("/login", login)
router.get("/me", verifyToken, (req, res) => {
    res.status(200).json({
        loggedIn: true,
        user: {
            userId: req.user.userId,
            email: req.user.email,
            username: req.user.username,
        }
    })
})
router.get("/logout",(req,res)=>{
    res.clearCookie("token",{httpOnly : true})
    res.json({message : "Logged ou t"})
})

router.get("/all",async(req,res)=>{
    try {
        const users = await User.find({},"username email _id")
        res.json(users);
    }catch(err){
        res.status(500).json({message : "Server Error"})
    }
})

module.exports = router;