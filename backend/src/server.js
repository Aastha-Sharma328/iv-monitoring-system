require("dotenv").config();

console.log("Loading app...");
const app = require("./app");
console.log("App loaded successfully");

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("SERVER RUNNING");
  console.log("Current file:", __filename);
  console.log(`Server running on port ${PORT}`);
});