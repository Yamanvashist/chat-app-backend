const express = require("express")
const { signUp, login } = require("../controllers/User")
const verifyToken = require("../authMiddleware/middleware")

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
    res.json({message : "Logged out"})
})

module.exports = router;