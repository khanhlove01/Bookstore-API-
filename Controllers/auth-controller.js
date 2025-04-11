const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
console.log("Iam in auth-controllers");

const RegisterUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    console.log(username);

    const checkExistingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    // const checkExistingUser = await User.findOne({ $or: [{ username: username }, { email: email }]});
    //console.log(checkExistingUser);

    if (checkExistingUser) {
      return res.status(401).json({
        success: false,
        message: "User already existed",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await newUser.save();

    if (newUser) {
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: newUser,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Fail to register user",
      });
    }
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const LoginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "invalid credentials",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(404).json({
        success: false,
        message: "Password is not matched",
      });
    }

    //create user token
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    user.refreshToken = {
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days as Date
    };
    await user.save();

    

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only secure in prod
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
      path: "/", // or '/' if used globally
      //Bonus Tip: Use httpOnly + SameSite=Strict only if:
      //Your frontend and backend are on the same domain
      //Otherwise, use SameSite=None + Secure and CORS configured.
    });

    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username, // Ensure you pull from `user`
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1m" } // shorter for access tokens
    );

    res.status(200).json({
      success: true,
      message: "login successfully",
      accessToken: accessToken,
      refreshToken: refreshToken
    });
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.userinfo.userId;

    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    //check password match
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      return res.satus(400).json({
        success: false,
        message: "Old message is not current! Please try again",
      });
    }
    //hash the new password here
    const salt = await bcrypt.genSalt(10);
    const newhashedPassword = await bcrypt.hash(newPassword, salt);

    //update user password
    user.password = newhashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

module.exports = { RegisterUser, LoginUser, changePassword };
