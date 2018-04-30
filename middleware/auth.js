require("dotenv").load();
const jwt = require("jsonwebtoken");

// check if user is loggedin - AUTHENTICATION
exports.loginRequired = function(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1]; // EXAMPLE: Authorization: Basic YWxhZGRpbjpvcGVuc2VzYW1l
    jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
      if (decoded) {
        return next();
      }
      return next({
        status: 401,
        message: "Unauthorized!"
      });
    });
  } catch (error) {
    return next({
      status: 401,
      message: "Unauthorized!"
    });
  }
};

// get the correct user - AUTHORIZATION
exports.ensureCorrectUser = function(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1]; // EXAMPLE: Authorization: Basic YWxhZGRpbjpvcGVuc2VzYW1l
    jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
      if (decoded && decoded.id === req.params.id) {
        return next();
      }
      return next({
        status: 401,
        message: "Unauthorized!"
      });
    });
  } catch (error) {
    return next({
      status: 401,
      message: "Unauthorized!"
    });
  }
};
