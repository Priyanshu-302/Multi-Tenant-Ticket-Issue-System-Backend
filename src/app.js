const express = require("express");
const cookieParser = require("cookie-parser");
const index = require("../src/routes/index");
const errorHandler = require("../src/middlewares/error.middleware");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Main endpoint from which all the types of api's will be called
app.use("/api/v1", index);

// Error handler middleware
app.use(errorHandler);

module.exports = app;
