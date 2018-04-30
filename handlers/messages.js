const db = require("../models");

// POST -> /api/users/:id/messages
exports.createMessage = async function(req, res, next) {
  try {
    // create a message with "text" and user "id"
    const message = await db.Message.create({
      text: req.body.text,
      user: req.params.id
    });
    // find user in db
    const foundUser = await db.User.findById(req.params.id);
    // push message into the user's message array in db
    foundUser.messages.push(message.id);
    // save changes on user to db
    await foundUser.save();
    // populates the message's user key with user info
    const foundMessage = await db.Message.findById(message.id).populate(
      "user",
      {
        username: true,
        profileImageUrl: true
      }
    );
    // respond with the message with the user's info
    return res.status(201).json(foundMessage);
  } catch (error) {
    return next(error);
  }
};

// GET -> /api/users/:id/messages/:message_id
exports.getMessage = async function(req, res, next) {
  try {
    const message = await db.Message.find(req.params.message_id);
    return res.status(200).json(message);
  } catch (error) {
    next(error);
  }
};

// DELETE -> /api/users/:id/messages/:message_id
exports.deleteMessage = async function(req, res, next) {
  try {
    const foundMessage = await db.Message.findById(req.params.message_id);
    await foundMessage.remove(); // findByIdAndRemove won't work
    return res.status(200).json(foundMessage);
  } catch (error) {
    return next(error);
  }
};
