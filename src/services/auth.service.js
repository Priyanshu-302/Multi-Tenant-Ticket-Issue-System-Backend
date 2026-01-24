const bcrypt = require("bcrypt");
const User = require("../models/user.model");

exports.registerUser = async (name, email, password) => {
  try {
    const existingUser = await User.getUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.createUser(
      name,
      email,
      hashedPassword
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
};

exports.loginUser = async (email, password) => {
  try {
    const currUser = await User.getUserByEmail(email);
    if (!currUser) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, currUser.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    return currUser;
  } catch (error) {
    console.log(error);
  }
};
