const express = require('express')
const authMiddleware = require('../Middlewares/auth-middlewares')

const router = express.Router();

router.get('/welcome',authMiddleware,(req,res) => {
    const {username, userId, role} = req.userinfo;
    res.json({
        message: "Welcome to the home page",
        user: {
            username: username,
            userId : userId,
            role: role
        }
    })
})

module.exports = router;