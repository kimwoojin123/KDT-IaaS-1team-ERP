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
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  // 회원가입 API 엔드포인트
  server.post("/signup", (req, res) => {
    const { name, username, password } = req.body;
    const hashedPassword = password;

    // 회원가입 정보를 DB에 삽입
    const query = "INSERT INTO users (name, username, password) VALUES (?, ?, ?)";
    connection.query(query, [name, username, hashedPassword], (err, results, fields) => {
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
    const query = "SELECT * FROM users WHERE username = ? AND password = ?";
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


  server.post("/createOrder", (req, res) => {
    const {
      username,
      customer,
      receiver,
      phoneNumber,
      address,
      price
    } = req.body;
  
    // 주문 정보를 DB에 삽입
    const query = "INSERT INTO orders (username, customer, receiver, phoneNumber, address, price) VALUES (?, ?, ?, ?, ?, ?)";
    connection.query(
      query,
      [username, customer, receiver, phoneNumber, address, price],
      (err, results, fields) => {
        if (err) {
          console.error("Error creating order:", err);
          res.status(500).json({ message: "주문 생성에 실패했습니다." });
          return;
        }
        res.status(200).json({ message: "주문이 성공적으로 생성되었습니다." });
      }
    );
  });


  server.post("/addToCart", (req, res) => {
    const {
      username,
      productKey,
      price,
    } = req.body;
  
    // 현재 시간을 가져오기
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');
  
    // 장바구니에 상품 추가하는 쿼리 실행
    const query = "INSERT INTO cart (username, productKey, price, adddate) VALUES (?, ?, ?, ?)";
    connection.query(query, [username, productKey, price, formattedDate], (err, results, fields) => {
      if (err) {
        console.error("Error adding product to cart:", err);
        res.status(500).json({ message: "장바구니에 상품을 추가하는 중에 오류가 발생했습니다." });
        return;
      }
      res.status(200).json({ message: "장바구니에 상품이 성공적으로 추가되었습니다." });
    });
  });


  server.get("/products", (req, res) => {
    const { cateName } = req.query;
    let query = "SELECT productName, productKey, price FROM product";
    let params = [];
  
    if (cateName) {
      query += " WHERE cateName = ?";
      params = [cateName];
    }
  
    connection.query(query, params, (err, results, fields) => {
      if (err) {
        console.error("Error fetching products by category:", err);
        res.status(500).json({ message: "상품을 불러오는 중에 오류가 발생했습니다." });
        return;
      }
  
      res.status(200).json(results);
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
  


  server.get("/productDetails", (req, res) => {
    const { productKey } = req.query;
    const query = "SELECT productName, price, productKey FROM product WHERE productKey = ?";
    connection.query(query, [productKey], (err, results, fields) => {
      if (err) {
        console.error("Error fetching product details:", err);
        res.status(500).json({ message: "상품 상세 정보를 불러오는 중에 오류가 발생했습니다." });
        return;
      }
  
      if (results.length > 0) {
        res.status(200).json(results[0]); // 첫 번째 결과만 반환
      } else {
        res.status(404).json({ message: "해당 상품을 찾을 수 없습니다." });
      }
    });
  });

  server.get("/userCart", (req, res) => {
    const { username } = req.query; // 클라이언트에서 받아온 사용자명
    
    if (!username) {
      res.status(400).json({ message: "로그인이 필요합니다." });
      return;
    }
    
    // 사용자의 장바구니를 가져오는 쿼리
    const query = `
      SELECT product.productName, cart.price, DATE_FORMAT(cart.adddate, '%Y-%m-%d %H:%i:%s') AS adddate, cartKey 
      FROM cart
      INNER JOIN product ON cart.productKey = product.productKey
      WHERE cart.username = ?
    `;
      
    connection.query(query, [username], (err, results, fields) => {
      if (err) {
        console.error("Error fetching user's cart:", err);
        res.status(500).json({ message: "사용자 장바구니를 불러오는 중에 오류가 발생했습니다." });
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

  server.delete("/deleteCartItem/:cartItemId", (req, res) => {
    const cartItemId = req.params.cartItemId;
  
    const query = "DELETE FROM cart WHERE cartKey = ?";
    connection.query(query, [cartItemId], (err, results, fields) => {
      if (err) {
        console.error("Error deleting cart item:", err);
        res.status(500).json({ message: "장바구니 항목 삭제 중에 오류가 발생했습니다." });
        return;
      }
  
      res.status(200).json({ message: "장바구니 항목이 성공적으로 삭제되었습니다." });
    });
  });



  // Next.js 서버에 라우팅 위임
  server.all('*', (req,res) =>{
    return handle(req,res)
  });

  // 서버 시작
  server.listen(3001, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3001');
  });
});