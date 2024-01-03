
const express = require("express");
const next = require('next');
const mysql = require('mysql2');
const PORT = 3000;

const isDev = process.env.NODE_ENV !== 'development';
const app = next({ dev: isDev });
// const handle = app.getRequestHandler();


// MariaDB 연결 설정
const connection = mysql.createConnection({
  host: "localhost",
  user: "admin ",  // 테이블 이름
  password: "1108",
  database: "erpproject",  // 데이터베이스 이름
});

app.prepare().then(() => {
  const server = express();
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  server.get("/product", (req, res) => {
    let query = "SELECT productName FROM product";
  
    connection.query(query, (err, results, fields) => {
      if (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ error: "상품을 불러오는 중에 오류가 발생했습니다.", details: err.message });
        return;
      }
  
      // 에러가 없으면 결과를 확인
      console.log("Fetched products:", results);
  
      res.status(200).json(results);
    });
  });

// server.get("/product", (req, res) => {
//   const { cateName } = req.query;
//   // let query = "SELECT productName FROM product";
//   // let params = [];
//   let query = "SELECT productName FROM product WHERE cateName = ?";
//   let params = [cateName];
  
//   if (cateName) {
//     query += " WHERE cateName = ?";
//     params = [cateName];
//   }
  
//   connection.query(query, params, (err, results, fields) => {
//     if (err) {
//       console.error("Error fetching products by category:", err);
//       res.status(500).json({ message: "상품을 불러오는 중에 오류가 발생했습니다." });
//       return;
//     }
    
//     res.status(200).json(results);
//   });
// });

// server.get("/category", (req, res) => {
//   const query = "SELECT cateName FROM category"; // 쿼리로 상품 이름 가져오기
//   connection.query(query, (err, results, fields) => {
//     if (err) {
//       console.error("Error fetching category:", err);
//       res.status(500).json({ message: "카테고리를 불러오는 중에 오류가 발생했습니다." });
//       return;
//     }
    
//     res.status(200).json(results); // 결과를 JSON 형태로 반환
//   });
// });
server.listen(3000, (err) => {
  if (err) throw err;
  console.log('> Ready on http://localhost:3000');
});
});

// server.get("/products", (req, res) => {
  //   const { cateName } = req.query;
//   let query = "SELECT productName FROM product";
//   let params = [];

//   if (cateName) {
//     query += " WHERE cateName = ?";
//     params = [cateName];
//   }

//   connection.query(query, params, (err, results, fields) => {
//     if (err) {
//       console.error("Error fetching products by category:", err);
//       res.status(500).json({ message: "상품을 불러오는 중에 오류가 발생했습니다." });
//       return;
//     }

//     res.status(200).json(results);
//   });
// });