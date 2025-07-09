const express = require("express");
const aiRoutes = require("./routes/ai.routes");
const cors = require("cors");

const app = express();

app.use(cors());

// test route
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use(express.json());
app.use("/ai", aiRoutes);

module.exports = app;
