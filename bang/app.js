
const express = require("express");
const next = require('next');
const mysql = require('mysql2/promise');  // 비동기로 가져올 때 promise
const bodyParser = require('body-parser');

const isDev = process.env.NODE_ENV !== 'development';
const app = next({ dev: isDev });
const handle = app.getRequestHandler();

// MariaDB 연결 설정
const pool = mysql.createPool({
  host: "localhost",
  // port: '3306',
  user: "root",
  password: "1108",
  database: "erpproject",
  connectionLimit : 5, 
});

pool
  .getConnection()
  .then((conn) => {
    console.log("데이터베이스 연결 성공");
    conn.release();
  })
  .catch((err) => {
    console.error("데이터베이스 연결 실패:", err.message);
  });

app.prepare().then(() => {
  const server = express();
  server.use(bodyParser.json());
  server.use(express.urlencoded({ extended: true }));
  
  server.get("/api/admins", async (req, res) => {
    try {
      const users = await pool.query("SELECT * FROM admin");
      console.log(users);
    res.json(users); 
    } catch (error) {
      console.error("Error fetching classrooms:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  server.post("/addProduct", (req, res) => {
    const { productKey, productName, price } = req.body;
  
    // 상품을 DB에 삽입하는 쿼리
    const query = "INSERT INTO product (productKey, productName, price) VALUES (?, ?, ?)";
    connection.query(query, [productKey, productName, price], (err, results, fields) => {
      if (err) {
        console.error("Error adding product:", err);
        res.status(500).json({ message: "상품 추가에 실패했습니다." });
        return;
      }
      res.status(200).json({ message: "상품 추가가 완료되었습니다." });
    });
  });


  // 기본적인 Next.js 페이지 핸들링
  server.get("*", (req, res) => {
    return handle(req, res);
  });

server.listen(3000, (err) => {
  if (err) throw err;
  console.log('> Ready on http://localhost:3000');
  });
});

