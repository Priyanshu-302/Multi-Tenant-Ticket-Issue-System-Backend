const app = require("./src/app");
const https = require("https");
const fs = require("fs");

const options = {
  key: fs.readFileSync("certs/server.key"),
  cert: fs.readFileSync("certs/server.cert"),
};

https.createServer(options, app).listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
