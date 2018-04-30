const express = require("express");
const {
  createMessage,
  getMessage,
  deleteMessage
} = require("../handlers/messages");

const router = express.Router({ mergeParams: true }); // allows build routes using params

// prefix: /api/users/:id/messages
router.route("/").post(createMessage);

// prefix: /api/users/:id/messages/message_id
router
  .route("/:message_id")
  .get(getMessage)
  .delete(deleteMessage);

module.exports = router;
