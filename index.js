require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("./handlers/error");
const authRoutes = require("./routes/auth");
const messagesRoutes = require("./routes/messages");
const db = require("./models");
const { loginRequired, ensureCorrectUser } = require("./middleware/auth");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// if req starts with "/api/auth" use authRoutes
app.use("/api/auth", authRoutes);

// if req starts with "/api/users/:id/messages" use messagesRoutes
app.use(
  "/api/users/:id/messages",
  loginRequired,
  ensureCorrectUser,
  messagesRoutes
);

app.get("/api/messages", loginRequired, async (req, res, next) => {
  try {
    const messages = await db.Message.find()
      .sort({ createdAt: "desc" })
      .populate("user", {
        username: true,
        profileImageUrl: true
      });
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
});

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});
