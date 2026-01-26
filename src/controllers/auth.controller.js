const { registerUser } = require("../services/auth.service");
const { loginUser } = require("../services/auth.service");
const { generateAccessToken } = require("../utils/jwt");
const { generateRefreshToken } = require("../utils/jwt");

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const newUser = await registerUser(name, email, password);

    res.status(201).json({
      success: true,
      newUser,
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const currUser = await loginUser(email, password);

    const accessToken = generateAccessToken(currUser);
    const refreshToken = generateRefreshToken(currUser);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    });

    res.status(200).json({
      success: true,
      accessToken,
      message: "User logged in successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.clearCookie("refreshToken");

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};
