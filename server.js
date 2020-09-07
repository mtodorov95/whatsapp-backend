import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import Message from "./models/Message.js";
import pusher from "./config/pusher.js";

// ENV variables
dotenv.config();

// App config
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// DB config
mongoose.connect(process.env.MONGO_URL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
// Watch for changes in the collection
db.once("open", () => {
  console.log("DB Connected");
  const msgCollection = db.collection("messages");
  const changeStream = msgCollection.watch();

  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        received: messageDetails.received,
      });
    } else {
      console.log("Error triggering pusher");
    }
  });
});

// Api routes
app.get("/", (req, res) => {
  res.status(200).send("Hello!");
});

// Post message
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

// Get all messages
app.get("/messages/sync", (req, res) => {
  Message.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

// Listen
app.listen(port, () => console.log(`Server started on ${port}`));
