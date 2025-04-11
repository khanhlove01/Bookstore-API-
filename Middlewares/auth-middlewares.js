const jwt = require('jsonwebtoken')
const authMiddleware = (req,res,next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Access denied. No token provided"
        });
    }
    console.log('====================================');
    console.log(authHeader);
    console.log('====================================');

    const token = authHeader.split(" ")[1];
    console.log('====================================');
    console.log(token);
    console.log('====================================');

    if(!token){
        return res.status(401).json({
            success: false,
            message: "Access denied. No token provided"
        })
    }

    //decode token
    try {
        const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET)
        console.log('====================================');
        console.log(decodedTokenInfo);
        console.log('====================================');
        req.userinfo = decodedTokenInfo // custom property
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
}

module.exports = authMiddleware