import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Message from "./models/Message.js";

// ENV variables
dotenv.config();

// App config
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// DB config
mongoose.connect(process.env.MONGO_URL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Api routes
app.get("/", (req, res) => {
  res.status(200).send("Hello!");
});

app.post("/messages/new", (req, res) => {
  const dbMessage = req.body;

  Message.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(`New message created: \n ${data}`);
    }
  });
});

// Listen
app.listen(port, () => console.log(`Server started on ${port}`));
