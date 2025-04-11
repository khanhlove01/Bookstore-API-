const express = require('express')
const router = express.Router();
const authMiddleware = require('../Middlewares/auth-middlewares')
const isAdminUser = require('../Middlewares/admin-middlewares')

router.get('/welcomeAdmin',authMiddleware,isAdminUser, (req,res) => {
    res.json({
        message: "Welcome to addmin page"
    })
})

module.exports = router

