const http = require("http");
const path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 3500;

const server = http.createServer((req, res) => {
  console.log(req.url, req.method);

  let filePath;

  if (req.url === "/" || req.url === "index.html") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    filePath = path.join(__dirname, "views", "index.html");
    fs.readFile(filePath, "utf-8", (err, data) => {
      res.end(jData);
    });
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
