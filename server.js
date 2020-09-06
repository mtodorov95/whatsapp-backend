import express from "express";

// App config
const app = express();
const port = process.env.PORT || 5000;

// Api routes
app.get("/", (req, res) => {
  res.status(200).send("Hello!");
});

// Listen
app.listen(port, () => console.log(`Server started on ${port}`));
