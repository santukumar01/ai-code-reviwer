if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = require("./src/app.js");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
