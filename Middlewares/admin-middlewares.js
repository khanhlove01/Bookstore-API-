const express = require('express')

const isAdminUser = (req,res,next) => {
    console.log('====================================');
    console.log(req.userinfo.role);
    console.log('====================================');

    if(req.userinfo.role !== "admin"){
        return res.status(404).json({
            success: false,
            message: "Access denied because you are not admin"
        })
    }
    next();
}

module.exports = isAdminUser