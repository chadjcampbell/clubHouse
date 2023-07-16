require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const messageRoute = require("./routes/messageRoute");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// middlwares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

// routes middleware
app.use("/api/users", userRoute);
app.use("/api/messages", messageRoute);

// routes
app.get("/", (req, res) => {
  res.send("Home Page");
});

// connect to DB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
