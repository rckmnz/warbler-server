const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const User = require("./user");

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    maxlength: 160
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

messageSchema.plugin(timestamps);

messageSchema.pre("remove", async function(next) {
  try {
    // find a user
    const user = await User.findById(this.user);
    // remove the id of the message from the message list of the user
    user.messages.remove(this.id);
    // save that user
    await user.save();
    return next();
  } catch (error) {
    return next(error);
  }
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
