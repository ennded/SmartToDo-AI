// server.js
const app = require("./app");
const PORT = process.env.PORT || 3000;

module.exports = app;

if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
