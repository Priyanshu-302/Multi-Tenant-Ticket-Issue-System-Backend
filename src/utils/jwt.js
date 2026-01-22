const jwt = require("jsonwebtoken");

exports.generateAccessToken = (user) => {
  try {
    const payload = {
      id: user.id,
      role: user.role,
    };

    return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, {
      expiresIn: "15m",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.generateRefreshToken = (user) => {
  try {
    const payload = {
      id: user.id,
      role: user.role,
    };

    return jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, {
      expiresIn: "7d",
    });
  } catch (error) {
    console.log(error);
  }
};

