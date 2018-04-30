const db = require("../models");
const jwt = require("jsonwebtoken");

exports.signin = async (req, res, next) => {
  try {
    // find a user
    const user = await db.User.findOne({
      email: req.body.email
    });
    // destructure user
    const { id, username, profileImageUrl } = user;
    // check if password matches
    const isMatch = await user.comparePassword(req.body.password);
    if (isMatch) {
      // creates a session
      const token = jwt.sign(
        {
          id,
          username,
          profileImageUrl
        },
        process.env.SECRET_KEY
      );
      return res.status(200).json({
        id,
        username,
        profileImageUrl,
        token
      });
    }
    return next({
      status: 400,
      message: "Invalid Email/Password"
    });
  } catch (err) {
    return next({ status: 400, message: "Invalid Email/Password" });
  }
};

exports.signup = async (req, res, next) => {
  try {
    // create a user
    const user = await db.User.create(req.body);
    // destructure user
    const { id, username, profileImageUrl } = user;
    // create a session
    const token = jwt.sign(
      {
        id,
        username,
        profileImageUrl
      },
      process.env.SECRET_KEY
    );
    return res.status(200).json({
      id,
      username,
      profileImageUrl,
      token
    });
  } catch (err) {
    // if a mongoose validation fails
    if (err.code === 11000) {
      // 11000 = mongoose validation error code
      err.message = "Sorry, that username and/or email is taken already.";
    }
    return next({
      status: 400,
      message: err.message
    });
  }
};
