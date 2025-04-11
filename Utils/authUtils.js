const jwt = require("jsonwebtoken");

const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

function generateAccessToken(user) {
  return jwt.sign({ userId: user._id }, ACCESS_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(user) {
  return jwt.sign({ userId: user._id }, REFRESH_SECRET, { expiresIn: '7d' });
}

module.exports = { generateAccessToken, generateRefreshToken };