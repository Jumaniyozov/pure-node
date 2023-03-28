const serveFile = async (filePath, contentType, res) => {
  try {
    const rawData = await fs.promises.readFile(
      filePath,
      !contentType.includes("image") ? "utf-8" : ""
    );
    const data =
      contentType === "application/json" ? JSON.parse(rawData) : rawData;
    res.writeHead(filePath.includes("404.html") ? 404 : 200, {
      "Content-Type": contentType,
    });
    res.end(contentType === "application/json" ? JSON.stringify(data) : data);
  } catch (err) {
    console.error(err);
    myEmitter.emit("log", `${err.name}: ${err.message}`, "errLog.txt");
    res.statusCode = 500;
    res.end();
  }
};
