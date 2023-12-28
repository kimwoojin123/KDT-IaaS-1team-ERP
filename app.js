import http from "http";
import fs from "fs";

const PORT = 3213;
const JSONPath = "index.json";

const serv = http.createServer((req, res) => {
  if (req.method === "GET") {
    if (req.url === "/") {
      fs.readFile("index.html", "utf8", (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
          return;
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      });
    } else if (req.url === "/loadData") {
      fs.readFile(JSONPath, "utf8", (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Failed to read JSON data" }));
          return;
        }
        const jsonData = JSON.parse(data);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(jsonData));
      });
    }
  }
});

serv.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/`);
});