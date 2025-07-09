import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import app from "./src/app.js";

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// Serve static files from the frontend's dist folder
app.use(express.static(path.join(__dirname, "../Frontend/dist")));

// Fallback to index.html for any non-API route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
