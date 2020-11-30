const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const HttpError = require("../models/httpError");
const User = require("../models/userScehma");
const jwt = require("jsonwebtoken");

const login = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    console.log("error in signing up", error);
    return next(
      new HttpError(
        "enetred email/password not valid to proceed for login",
        400
      )
    );
  }
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch {
    const error = new HttpError(
      "finding user process from database failed, login process",
      401
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "no such user exist, either email entered is incorrect or signup to create a new account",
      401
    );
    return next(error);
  }
  if (existingUser && existingUser.password === password) {
    let token;
    try {
      token = await jwt.sign(
        {
          userId: existingUser.id,
          email: existingUser.email,
        },
        "secret_key",
        { expiresIn: "1h" }
      );
    } catch (err) {
      const error = new HttpError("unable to sign up", 500);
      return next(error);
    }
    return res.json({ id: existingUser.id, token: token });
  } else {
    return res.json({
      message: "incorrect password try again with correct password",
    });
  }
};

const signup = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    console.log(
      "entered data is not valid/incomplete to proceed for signup",
      error
    );
    return next(new HttpError("unable to sign up", 500));
  }
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch {
    const error = new HttpError("email finding is not completed", 500);
    return next(error);
  }
  if (existingUser) {
    throw new HttpError("user already exists, please login", 500);
  }
  const newUser = new User({
    name,
    email,
    password,
    events: [],
  });
  try {
    await newUser.save();
  } catch {
    const error = new HttpError("creating new user failed", 500);
  }
  try {
    token = await jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
      },
      "secret_key",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("unable to sign up", 500);
    return next(error);
  }
  res.json({ id: newUser.id, name: newUser.name, token: token });
};

exports.login = login;
exports.signup = signup;
