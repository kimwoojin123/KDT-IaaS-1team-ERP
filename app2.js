const http = require("http");    // HTTP 모듈
const fs = require("fs");        // 파일 시스템 모듈
const mysql = require("mysql");  // npm install mysql

const port = 3218;
const fetchHtmlPath = "./index.html";

// MySQL 데이터베이스 연결을 설정합니다.
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "0177",
  database: "shop",
});

// HTTP 서버를 생성합니다.
const serv = http.createServer((req, res) => {
  // 요청이 GET 메서드이고 URL이 '/'인 경우
  if (req.method === "GET" && req.url === "/") {
    // index.html 파일을 읽어 응답으로 보냅니다.
    fs.readFile(fetchHtmlPath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end("Internal Server Error");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  } 
  // 요청이 GET 메서드이고 URL이 '/mariaDB'인 경우
  else if (req.method === "GET" && req.url === "/mariaDB") {
    const productQuery = "SELECT * FROM product"; 

    connection.query(productQuery, (error, results) => {
      if (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
      } else {
        res.writeHead(200, { "Content-Type": "application/json" }); 
        res.end(JSON.stringify(results)); 
      }
    });
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

// 서버를 지정된 포트에서 실행하고 연결을 기다립니다.
serv.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});