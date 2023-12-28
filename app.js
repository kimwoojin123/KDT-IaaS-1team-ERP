import http from "http";
import fs from "fs";

const PORT = 3213;
const JSONPath = "index.json";

const serv = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    fs.readFile("index.html", "utf8", (err, data) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  } else if (req.method === "POST" && req.url === "/loadData") {
    fs.readFile(JSONPath, "utf8", (err, data) => {
      const jsonData = JSON.parse(data);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(jsonData));
    });
  }
});

serv.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/`);
});
