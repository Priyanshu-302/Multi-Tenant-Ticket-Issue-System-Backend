const bcrypt = require("bcrypt");
const { getUserByEmail } = require("../models/user.model");
const { createUser } = require("../models/user.model");

exports.registerUser = async (name, email, password) => {
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser(name, email, hashedPassword);

    return newUser;
  } catch (error) {
    console.log(error);
  }
};

exports.loginUser = async (email, password) => {
  try {
    const currUser = await getUserByEmail(email);
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
