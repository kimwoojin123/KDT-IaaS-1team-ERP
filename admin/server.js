const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex');
const jwt = require('jsonwebtoken');
const express = require("express");
const next = require('next');
const mysql = require('mysql2');
const isDev = process.env.NODE_ENV !== 'development';
const app = next({ dev: isDev });
const handle = app.getRequestHandler();


// MariaDB 연결 설정
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "kimdb",
  port: 3308,
});

app.prepare().then(() => {
  const server = express();
  server.use(express.json({ limit: '10mb' })); // JSON 데이터를 해석하는 미들웨어에 대한 크기 제한 설정
  server.use(express.urlencoded({ extended: true, limit: '10mb' })); // URL-encoded 데이터를 해석하는 미들웨어에 대한 크기 제한 설정

  // 회원가입 API 엔드포인트
  server.post("/signup", (req, res) => {
    const { name, username, password, email, address, phoneNumber } = req.body;
    const hashedPassword = password;
    const currentDate = new Date();
    const addDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');

    // 회원가입 정보를 DB에 삽입
    const query = "INSERT INTO users (name, username, password, email, address, phoneNumber, addDate, admin) VALUES (?, ?, ?, ?, ?, ?, ?, 1)";
    connection.query(query, [name, username, hashedPassword, email, address, phoneNumber, addDate], (err, results, fields) => {
      if (err) {
        console.error("Error signing up:", err);
        res.status(500).json({ message: "회원가입에 실패했습니다." });
        return;
      }
      res.status(200).json({ message: "회원가입이 완료되었습니다." });
    });
  });

  // 로그인 API 엔드포인트
  server.post("/login", (req, res) => {
    const { username, password } = req.body;

    // 해당 사용자가 존재하는지 확인하는 쿼리
    const query = "SELECT * FROM users WHERE username = ? AND password = ? AND admin = 1";
    connection.query(query, [username, password], (err, results, fields) => {
      if (err) {
        console.error("Error logging in:", err);
        res.status(500).json({ message: "로그인에 실패했습니다." });
        return;
      }

      // 로그인 성공 여부 확인
      if (results.length > 0) {
        const user = results[0];
        const tokenPayload = {
          username : user.username
        }
        const token = jwt.sign(tokenPayload, secretKey, { expiresIn: '1h' });
        res.status(200).json({ message: "로그인 성공", token, user });
      } else {
        res.status(401).json({ message: "아이디 또는 비밀번호가 올바르지 않습니다." });
      }
    });
  });


  server.get("/products", (req, res) => {
    const query = "SELECT productKey, productName, price, stock, cateName FROM product"; 
    connection.query(query, (err, results, fields) => {
      if (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ message: "상품을 불러오는 중에 오류가 발생했습니다." });
        return;
      }
  
      res.status(200).json(results); // 결과를 JSON 형태로 반환
    });
  });

  server.get("/order", (req, res) => {
    const query = "SELECT username, productName, customer, receiver, phoneNumber, address, price FROM orders"; 
    connection.query(query, (err, results, fields) => {
      if (err) {
        console.error("Error fetching order:", err);
        res.status(500).json({ message: "주문정보를 불러오는 중에 오류가 발생했습니다." });
        return;
      }
  
      res.status(200).json(results); // 결과를 JSON 형태로 반환
    });
  });


  server.put("/users/:username/toggle-activate", (req, res) => {
    const { username } = req.params;
  
    // 현재 사용자의 activate 상태를 조회하는 쿼리
    const selectQuery = "SELECT activate FROM users WHERE username = ?";
    connection.query(selectQuery, [username], (err, results) => {
      if (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ message: "사용자 정보를 가져오는 중에 오류가 발생했습니다." });
        return;
      }
  
      // 현재 사용자의 activate 상태를 확인합니다.
      const currentActivateStatus = results[0]?.activate;
  
      // 사용자의 activate 상태를 토글하여 반대 값으로 설정합니다.
      const newActivateStatus = currentActivateStatus === 1 ? 0 : 1;
  
      // 사용자의 activate 값을 업데이트하는 쿼리
      const updateQuery = "UPDATE users SET activate = ? WHERE username = ?";
      connection.query(updateQuery, [newActivateStatus, username], (err, results) => {
        if (err) {
          console.error("Error toggling user activation:", err);
          res.status(500).json({ message: "사용자의 활성화 상태를 변경하는 중에 오류가 발생했습니다." });
          return;
        }
  
        const message = newActivateStatus === 1 ? `${username} 사용자가 활성화되었습니다.` : `${username} 사용자가 비활성화되었습니다.`;
        res.status(200).json({ message });
      });
    });
  });


  server.get("/category", (req, res) => {
    const query = "SELECT cateName FROM category"; // 쿼리로 상품 이름 가져오기
    connection.query(query, (err, results, fields) => {
      if (err) {
        console.error("Error fetching category:", err);
        res.status(500).json({ message: "카테고리를 불러오는 중에 오류가 발생했습니다." });
        return;
      }
  
      res.status(200).json(results); // 결과를 JSON 형태로 반환
    });
  });
  

  server.get("/users", (req, res) => {
    const query = "SELECT name, username, cash, addDate, activate FROM users"; // 필요한 사용자 정보를 가져오는 쿼리
    connection.query(query, (err, results, fields) => {
      if (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ message: "사용자 정보를 불러오는 중에 오류가 발생했습니다." });
        return;
      }
  
      res.status(200).json(results); // 결과를 JSON 형태로 반환
    });
  });

  server.post("/resign", (req, res) => {
    const { username } = req.body; // 로그인된 사용자의 username (또는 다른 식별자)
  
    // 회원 탈퇴를 위한 쿼리 실행
    const deleteQuery = "DELETE FROM users WHERE username = ?";
    connection.query(deleteQuery, [username], (err, results, fields) => {
      if (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ message: "회원 탈퇴 중 오류가 발생했습니다." });
        return;
      }
  
      res.status(200).json({ message: "회원 탈퇴가 완료되었습니다." });
    });
  });


  server.post("/addProduct", (req, res) => {
    const { cateName, productName, price, stock } = req.body;

  
    // 상품을 DB에 삽입하는 쿼리
    const query = "INSERT INTO product (cateName, productName, price, stock) VALUES (?, ?, ?, ?)";
    connection.query(query, [cateName, productName, price, stock], (err, results, fields) => {
      if (err) {
        console.error("Error adding product:", err);
        res.status(500).json({ message: "상품 추가에 실패했습니다." });
        return;
      }
      res.status(200).json({ message: "상품 추가가 완료되었습니다." });
    });
  })
  

  server.post('/give-cash', (req, res) => {
    const { usernames, giveCash } = req.body;
  
    // users 테이블에서 선택된 사용자들의 캐시를 업데이트하는 쿼리
    const updateQuery = `UPDATE users SET cash = cash + ? WHERE username IN (?)`;
  
    // 데이터베이스에 쿼리를 실행합니다.
    connection.query(updateQuery, [giveCash, usernames], (err, results) => {
      if (err) {
        console.error('Error give cash:', err);
        res.status(500).json({ message: '캐시를 지급하는 동안 오류가 발생했습니다.' });
        return;
      }
  
      // 업데이트된 사용자 목록을 다시 가져옵니다.
      const selectQuery = `SELECT * FROM users`;
      connection.query(selectQuery, [usernames], (err, updatedUsers) => {
        if (err) {
          console.error('Error fetching updated users:', err);
          res.status(500).json({ message: '업데이트된 사용자를 불러오는 동안 오류가 발생했습니다.' });
          return;
        }
  
        res.status(200).json({ updatedUsers });
      });
    });
  });




  server.delete("/deleteProduct/:productId", (req, res) => {
    const productId = req.params.productId;
  
    const query = "DELETE FROM product WHERE productKey = ?";
    connection.query(query, [productId], (err, results, fields) => {
      if (err) {
        console.error("Error deleting product:", err);
        res.status(500).json({ message: "상품 삭제 중에 오류가 발생했습니다." });
        return;
      }
  
      res.status(200).json({ message: "상품이 성공적으로 삭제되었습니다." });
    });
  });



  // Next.js 서버에 라우팅 위임
  server.all('*', (req,res) =>{
    return handle(req,res)
  });

  // 서버 시작
  server.listen(3002, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3002');
  });
});