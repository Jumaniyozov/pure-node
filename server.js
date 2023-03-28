const logEvents = require("./utils/logEvents");
const serveFile = require("./utils/serveFile");

const http = require("http");
const path = require("path");
const fs = require("fs");
const EventEmitter = require("events");

const myEmitter = new EventEmitter();
myEmitter.on("log", (msg, fileName) => logEvents(msg, fileName));

const PORT = process.env.PORT || 3500;

const server = http.createServer((req, res) => {
  myEmitter.emit("log", `${req.url}\t${req.method}`, "reqLog.txt");

  const extension = path.extname(req.url);

  let contentType;

  switch (extension) {
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "text/javascript";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".jpg":
      contentType = "image/jpg";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".txt":
      contentType = "text/plain";
      break;
    default:
      contentType = "text/html";
  }

  let fileDirPath =
    contentType === "text/html" && req.url === "/"
      ? path.join(__dirname, "views", "index.html")
      : contentType === "text/html" && req.url.slice(-1) === "/"
      ? path.join(__dirname, "views", req.url, "index.html")
      : contentType === "text/html"
      ? path.join(__dirname, "views", req.url)
      : path.join(__dirname, req.url);

  if (!extension && req.url.slice(-1) !== "/") {
    fileDirPath += ".html";
  }

  const fileExists = fs.existsSync(fileDirPath);

  if (fileExists) {
    serveFile(fileDirPath, contentType, res);
  } else {
    switch (path.parse(fileDirPath).base) {
      case "old-page.html":
        res.writeHead(301, { Location: "/new-page.html" });
        res.end();
        break;
      case "www-page.html":
        res.writeHead(301, { Location: "/" });
        res.end();
        break;
      default:
        serveFile(path.join(__dirname, "views", "404.html"), "text/html", res);
    }
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
