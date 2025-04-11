const express = require('express')
const router = express.Router();
const {RegisterUser, LoginUser,changePassword,renewAccessToken} =  require('../Controllers/auth-controller');
const authMiddleware = require('../Middlewares/auth-middlewares');

const User = require('../Models/User')
const jwt = require('jsonwebtoken')
console.log("Iam in auth-routes");

router.post('/register',RegisterUser);
router.post('/login', LoginUser);
router.post('/changePassword',authMiddleware,changePassword)

router.post('/refresh', async (req, res) => {
    try {
      const tokenFromCookie = req.cookies.refreshToken;
  
      if (!tokenFromCookie) {
        return res.status(401).json({ message: 'Refresh token missing' });
      }
  
      // Verify token signature
      const decoded = jwt.verify(tokenFromCookie, process.env.JWT_REFRESH_SECRET);
  
      // Find user and check if token matches and not expired
      
      const user = await User.findById(decoded.userId);
      console.log(user.refreshToken.expiresAt);
      if (
        !user ||
        !user.refreshToken ||
        user.refreshToken.token !== tokenFromCookie ||
        new Date() > new Date(user.refreshToken.expiresAt)
      ) {
        return res.status(403).json({ message: 'Invalid or expired refresh token' });
      }
  
      // Generate new access token
      const newAccessToken = jwt.sign(
        {
          userId: user._id,
          username: user.username,
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '1m' }
      );
  
      return res.json({ accessToken: newAccessToken });
    } catch (err) {
      console.error('[Refresh Error]', err.message);
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
  });

module.exports = router;