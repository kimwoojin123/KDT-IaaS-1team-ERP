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
    host: "dyabya-db.cfceog0mau8e.ap-northeast-2.rds.amazonaws.com",
    user: "root",
    password: "dnwls12!",
    database: "kimdb",
    port: 3308,
  });



app.prepare().then(() => {
  const server = express();
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  // 회원가입 API 엔드포인트
  server.post("/signup", (req, res) => {
    const { name, username, password, email, address, phoneNumber } = req.body;
    const hashedPassword = password;
    const currentDate = new Date();
    const addDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');

    // 회원가입 정보를 DB에 삽입
    const query = "INSERT INTO users (name, username, password, email, address, phoneNumber, addDate, admin) VALUES (?, ?, ?, ?, ?, ?, ?, 0)";
    connection.query(query, [name, username, hashedPassword, email, address, phoneNumber, addDate], (err, results, fields) => {
      if (err) {
        console.error("Error signing up:", err);
        res.status(500).json({ message: "회원가입에 실패했습니다." });
        return;
      }
      res.status(200).json({ message: "회원가입이 완료되었습니다." });
    });
  });

  server.post("/userEdit", (req, res) => {
    const {username, password, email, address, phoneNumber} = req.body;

    const query = `UPDATE users SET password = ?, email = ?, address = ?, phoneNumber = ? WHERE username = ?`;
    connection.query(query, [password, email, address, phoneNumber, username], (err, results, fields) => {
      if (err) {
        console.error("Error signing up:", err);
        res.status(500).json({ message: "회원정보 수정에 실패했습니다." });
        return;
      }
      res.status(200).json({ message: "회원정보 수정이 완료되었습니다." });
    });
  })


  // 로그인 API 엔드포인트
  server.post("/login", (req, res) => {
    const { username, password } = req.body;

    // 해당 사용자가 존재하는지 확인하는 쿼리
    const query = "SELECT * FROM users WHERE username = ? AND password = ? AND activate = 1";
    connection.query(query, [username, password], (err, results, fields) => {
      if (err) {
        console.error("Error logging in:", err);
        res.status(500).json({ message: "로그인에 실패했습니다." });
        return;
      }

      // 로그인 성공 여부 확인
      if (results.length > 0) {
        const tokenPayload = {
          username : username
        }
        const token = jwt.sign(tokenPayload, secretKey, { expiresIn: '1h' });
        res.status(200).json({ message: "로그인 성공", token });
      } else {
        res.status(401).json({ message: "아이디 또는 비밀번호가 올바르지 않습니다." });
      }
    });
  });


  server.post('/checkUsername', async (req, res) => {
    const { username } = req.body;
  
    try {
      const query = 'SELECT COUNT(*) AS count FROM users WHERE username = ?';
      connection.query(query, [username], (err, results, fields) => {
        if (results && results.length > 0) {
          const isDuplicate = results[0].count > 0;
          res.json({ isDuplicate });
        } else {
          console.error('Error checking duplicate username: No results');
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });
    } catch (error) {
      console.error('Error checking duplicate username:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });



  server.post("/createOrder", (req, res) => {
    const {
      username,
      customer,
      receiver,
      phoneNumber,
      address,
      price,
      productName,
      productKey,
      quantity,
    } = req.body;
  
    const currentDate = new Date();
    const timeZone = 'Asia/Seoul'; // 선택적으로 'Asia/Seoul' 또는 'Asia/Korea'를 사용할 수 있습니다.
    
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    
    const [
      { value: month },,
      { value: day },,
      { value: year },,
      { value: hour },,
      { value: minute },,
      { value: second },
    ] = formatter.formatToParts(currentDate);
    const formattedHour = hour === '24' ? '00' : hour;
    const formattedDateTime = `${year}-${month}-${day} ${formattedHour}:${minute}:${second}`;


    // 사용자의 현금을 가져오는 쿼리
    const userCashQuery = "SELECT cash FROM users WHERE username = ?";
    connection.query(userCashQuery, [username], async (cashErr, cashResults) => {
      if (cashErr) {
        console.error("Error fetching user's cash:", cashErr);
        res.status(500).json({ message: "현금 정보를 가져오는 중에 오류가 발생했습니다." });
        return;
      }
  
      if (cashResults.length === 0) {
        res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
        return;
      }
  
      const userCash = cashResults[0].cash;
  
      // 사용자의 현금과 결제 금액 비교하여 처리
      if (userCash >= price) {
        // 주문 정보를 DB에 삽입
        const insertOrderQuery = "INSERT INTO orders (username, productKey, productName, customer, receiver, phoneNumber, address, price, quantity, adddate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const productKeyArray = productKey.split(','); // 쉼표로 구분된 문자열을 배열로 변환
        const quantityArray = quantity.split(','); // 쉼표로 구분된 문자열을 배열로 변환
  
        try {
          // 주문 정보 삽입
          await connection.promise().query(
            insertOrderQuery,
            [username, productKeyArray.join(','), productName, customer, receiver, phoneNumber, address, price, quantity, formattedDateTime]
          );
  
          // 주문이 성공적으로 생성되었으므로 각 상품의 재고를 업데이트
          const updateProductStockQuery = "UPDATE product SET stock = stock - ? WHERE productKey = ?";
  
          // 각 상품에 대해 주문 수량만큼 재고를 감소시킵니다.
          for (let i = 0; i < productKeyArray.length; i++) {
            const quantityValue = parseInt(quantityArray[i], 10); // 정수로 변환
            const productKey = productKeyArray[i];
  
            console.log(`Updating stock for productKey: ${productKey}, quantity: ${quantityValue}`);
            await connection.promise().query(updateProductStockQuery, [quantityValue, productKey]);
          }
  

          const updateCashQuery = "UPDATE users SET cash = cash - ? WHERE username = ?";
          await connection.promise().query(updateCashQuery, [price, username]);
          res.status(200).json({ message: "주문이 성공적으로 생성되었습니다." });
        } catch (err) {
          console.error("Error creating order or updating product stock:", err);
          res.status(500).json({ message: "주문 생성 또는 상품 재고 업데이트 중에 오류가 발생했습니다." });
        }
      } else {
        // 현금이 부족한 경우: 결제 실패
        res.status(400).json({ message: "결제 실패 - 잔액이 부족합니다." });
      }
    });
  });

  server.post("/addToCart", (req, res) => {
    const {
      username,
      productKey,
      price,
      quantity,
    } = req.body;
  
    const currentDate = new Date();
    const timeZone = 'Asia/Seoul'; // 선택적으로 'Asia/Seoul' 또는 'Asia/Korea'를 사용할 수 있습니다.
    
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    
    const [
      { value: month },,
      { value: day },,
      { value: year },,
      { value: hour },,
      { value: minute },,
      { value: second },
    ] = formatter.formatToParts(currentDate);
    const formattedHour = hour === '24' ? '00' : hour;
    const formattedDateTime = `${year}-${month}-${day} ${formattedHour}:${minute}:${second}`;
  
    // 장바구니에 상품 추가하는 쿼리 실행
    const query = "INSERT INTO cart (username, productKey, price, quantity, adddate) VALUES (?, ?, ?, ?, ?)";
    connection.query(query, [username, productKey, price, quantity, formattedDateTime], (err, results, fields) => {
      if (err) {
        console.error("Error adding product to cart:", err);
        res.status(500).json({ message: "장바구니에 상품을 추가하는 중에 오류가 발생했습니다." });
        return;
      }
      res.status(200).json({ message: "장바구니에 상품이 성공적으로 추가되었습니다." });
    });
  });


  server.get("/products", (req, res) => {
    const { cateName, standard } = req.query;
    
    let query = "SELECT productName, productKey, price FROM product";
    let params = [];
  
    if (cateName) {
      query += " WHERE cateName = ?";
      params = [cateName];
    }
    
    if(standard) {
      query += " AND standard = ?";
      params.push(standard);
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
    const query = "SELECT productName, price, productKey, cateName FROM product WHERE productKey = ?";
    connection.query(query, [productKey], (err, results, fields) => {
      if (err) {
        console.error("Error fetching product details:", err);
        res.status(500).json({ message: "상품 상세 정보를 불러오는 중에 오류가 발생했습니다." });
        return;
      }
  
      if (results.length > 0) {
        res.status(200).json(results[0]);
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
      SELECT product.productName, product.productKey, cart.price, cart.quantity, DATE_FORMAT(cart.adddate, '%Y-%m-%d %H:%i:%s') AS adddate, cartKey 
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


  server.get("/orders", (req, res) => {
    const { username } = req.query;
  
    if (!username) {
      res.status(400).json({ message: "로그인이 필요합니다." });
      return;
    }
  
    const query = "SELECT orderKey, username, productName, customer, receiver, phoneNumber, address, price, quantity, DATE_FORMAT(orders.adddate, '%Y-%m-%d %H:%i:%s') AS adddate FROM orders WHERE username = ?"; 
    connection.query(query, [username], (err, results, fields) => {
      if (err) {
        console.error("Error fetching order:", err);
        res.status(500).json({ message: "주문정보를 불러오는 중에 오류가 발생했습니다." });
        return;
      }
  
      res.status(200).json(results); // 결과를 JSON 형태로 반환
    });
  });



  
  server.get("/users", (req, res) => {
    const { username } = req.query;
  
    const query = "SELECT name, username, password, cash FROM users WHERE username = ?"; 
    connection.query(query, [username], (err, results, fields) => {
      if (err) {
        console.error("Error fetching order:", err);
        res.status(500).json({ message: "주문정보를 불러오는 중에 오류가 발생했습니다." });
        return;
      }
  
      res.status(200).json(results); // 결과를 JSON 형태로 반환
    });
  });


  server.post("/order-edit", (req, res) => {
    const {
      orderKey,
      receiver,
      phoneNumber,
      address,
    } = req.body;
  
    // 주문 정보를 업데이트하는 쿼리
    const updateOrderQuery =
        "UPDATE orders SET receiver = ?, phoneNumber = ?, address = ? WHERE orderKey = ?";
    connection.query(
      updateOrderQuery,
      [receiver, phoneNumber, address, orderKey],
      (updateErr, updateResults, fields) => {
        if (updateErr) {
          console.error("Error updating order:", updateErr);
          res.status(500).json({ message: "주문정보를 업데이트하는 중에 오류가 발생했습니다." });
          return;
        }
  
        res.status(200).json({ message: "주문 정보가 성공적으로 업데이트되었습니다." });
      }
    );
  });

  server.post('/find-username', (req, res) => {
    const { name, email } = req.body;
  
    // MySQL 쿼리 실행하여 username 찾기
    const query = `SELECT username FROM users WHERE name = ? AND email = ?`;
    connection.query(query, [name, email], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ message: '서버 오류 발생' });
        return;
      }
  
      if (results.length > 0) {
        const foundUsername = results[0].username;
        res.status(200).json({ username: foundUsername });
      } else {
        res.status(404).json({ message: '해당하는 아이디를 찾을 수 없습니다.' });
      }
    });
  });


  server.post('/find-password', (req, res) => {
    const { name, username, email } = req.body;
    const query = 'SELECT * FROM users WHERE name = ? AND username = ? AND email = ?';
    connection.query(query, [name, username, email], (error, results) => {
      if (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ message: '서버 오류 발생' });
        return;
      }
  
      if (results.length > 0) {
        res.status(200).json({ username: results[0].username, message: '해당 사용자를 찾았습니다.' });
      } else {
        res.status(404).json({ message: '일치하는 사용자를 찾을 수 없습니다.' });
      }
    });
  });
  
  server.put('/update-password', (req, res) => {
    const { username, newPassword } = req.body;
    const query = 'UPDATE users SET password = ? WHERE username = ?';
    connection.query(query, [newPassword, username], (error, results) => {
      if (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: '서버 오류 발생' });
        return;
      }
  
      if (results.affectedRows > 0) {
        res.status(200).json({ message: '비밀번호가 업데이트되었습니다.' });
      } else {
        res.status(404).json({ message: '해당 사용자를 찾을 수 없습니다.' });
      }
    });
  });


  server.post("/resign", (req, res) => {
    const { username } = req.body; // 로그인된 사용자의 username (또는 다른 식별자)
  
    // 회원 탈퇴를 위한 쿼리 실행
    const updateQuery = "UPDATE users SET activate = 0 WHERE username = ?";
    connection.query(updateQuery, [username], (err, results, fields) => {
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


  server.get("/api/qna", async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 20;

      // SQL 쿼리를 직접 실행
      const query = "SELECT * FROM board LIMIT ?, ?";
      const queryParams = [(page - 1) * pageSize, pageSize];

      const [boards] = await connection.promise().query(query, queryParams);

      // 전체 게시물 수 가져오기
      const totalCountQuery = "SELECT COUNT(*) AS totalCount FROM board";
      const [totalCount] = await connection
        .promise()
        .query(totalCountQuery, queryParams.slice(0, 1));
      const totalPages = Math.ceil(totalCount[0].totalCount / pageSize);
      res.json({
        boards,
        pageInfo: {
          currentPage: page,
          pageSize,
          totalPages,
        },
      });
    } catch (error) {
      console.error("Error fetching boards:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  server.post("/api/qnawrite", async (req, res) => {
    try {
      if (req.method === "POST") {
        const { username, password, title, content, reply } = req.body; // 변경된 부분
        const currentDate = new Date();
        const timeZone = 'Asia/Seoul'; // 선택적으로 'Asia/Seoul' 또는 'Asia/Korea'를 사용할 수 있습니다.
        
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });
        
        const [
          { value: month },,
          { value: day },,
          { value: year },,
          { value: hour },,
          { value: minute },,
          { value: second },
        ] = formatter.formatToParts(currentDate);
        const formattedHour = hour === '24' ? '00' : hour;
        const formattedDateTime = `${year}-${month}-${day} ${formattedHour}:${minute}:${second}`;

        // 데이터베이스에서 subscription 정보 추가
        const [result] = await connection.promise().query(
          "INSERT INTO board (username, password, title, content, reply, adddate) VALUES (?, ?, ?, ?, ?, ?)",
          [username, password, title, content, reply, formattedDateTime] // 변경된 부분
        );

        if (result.affectedRows === 1) {
          // 성공적으로 추가된 경우
          res.status(200).json({ message: "board 정보 추가 성공" });
        } else {
          // 추가 실패
          res.status(500).json({ error: "board 정보 추가 실패" });
        }
      } else {
        // 허용되지 않은 메서드
        res.status(405).json({ error: "허용되지 않은 메서드" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "내부 서버 오류" });
    }
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