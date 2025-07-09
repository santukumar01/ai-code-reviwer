const express = require("express");
const path = require("path");
// const app = require("./src/app"); // commonjs import
const app = require("./src/app.js");

const PORT = process.env.PORT || 3000;

// Serve static files from the frontend's dist folder
app.use(express.static(path.join(__dirname, "../Frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
