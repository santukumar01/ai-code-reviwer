const path = require("path");
const express = require("express");
const app = require("./src/app");
const PORT = process.env.PORT || 3000;

const frontendPath = path.join(__dirname, "Frontend", "dist");

app.use(express.static(frontendPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
