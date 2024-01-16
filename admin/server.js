  const crypto = require('crypto');
  const secretKey = crypto.randomBytes(32).toString('hex');
  const jwt = require('jsonwebtoken');
  const express = require("express");
  const next = require('next');
  const mysql = require('mysql2');
  const isDev = process.env.NODE_ENV !== 'development';
  const app = next({ dev: isDev });
  const handle = app.getRequestHandler();
  const multer = require('multer');
  const fs = require('fs')

  // MariaDB 연결 설정
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "kimdb",
    port: 3308,
  });

  // multer 설정
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../user/public'); // 이미지를 저장할 경로 설정
    },
    filename: function (req, file, cb) {
      const ext = file.originalname.split('.').pop();
      cb(null, `${req.body.productName}.${ext}`);
    },
  });
  
  const upload = multer({
    storage: storage,
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
          res.status(200).json({ message: "로그인 성공", token });
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
      const query = "SELECT username, productName, customer, receiver, phoneNumber, address, price, quantity FROM orders"; 
      connection.query(query, (err, results, fields) => {
        if (err) {
          console.error("Error fetching order:", err);
          res.status(500).json({ message: "주문정보를 불러오는 중에 오류가 발생했습니다." });
          return;
        }
    
        res.status(200).json(results); // 결과를 JSON 형태로 반환
      });
    });


    server.get("/order/salesData", (req, res) => {
      const query = "SELECT DATE(adddate) AS date, quantity FROM orders";
      connection.query(query, (err, results) => {
        if (err) {
          console.error("Error fetching sales data:", err);
          res.status(500).json({ message: "주문 데이터를 불러오는 중에 오류가 발생했습니다." });
          return;
        }
    
        res.status(200).json(results);
      });
    });


    server.get('/mostSoldProduct', (req, res) => {
      const query = `
        SELECT
          SUBSTRING_INDEX(SUBSTRING_INDEX(productKey, ',', n.digit + 1), ',', -1) AS splitProductKey,
          SUBSTRING_INDEX(SUBSTRING_INDEX(quantity, ',', n.digit + 1), ',', -1) AS splitQuantity
        FROM
          orders
          JOIN (
            SELECT 0 AS digit UNION ALL
            SELECT 1 UNION ALL
            SELECT 2 UNION ALL
            SELECT 3 UNION ALL
            SELECT 4 UNION ALL
            SELECT 5 UNION ALL
            SELECT 6 UNION ALL
            SELECT 7 UNION ALL
            SELECT 8 UNION ALL
            SELECT 9
          ) n
        WHERE
          LENGTH(productKey) - LENGTH(REPLACE(productKey, ',', '')) >= n.digit
          AND LENGTH(quantity) - LENGTH(REPLACE(quantity, ',', '')) >= n.digit
      `;
    
      connection.query(query, (err, results, fields) => {
        if (err) {
          console.error('Error fetching most sold product:', err);
          res.status(500).json({ message: '최다 판매 상품을 불러오는 중에 오류가 발생했습니다.' });
          return;
        }
    
        const productQuantityMap = new Map();
    
        results.forEach(({ splitProductKey, splitQuantity }) => {
          const key = splitProductKey.trim();
          const quantity = parseInt(splitQuantity.trim(), 10);
    
          if (productQuantityMap.has(key)) {
            productQuantityMap.set(key, productQuantityMap.get(key) + quantity);
          } else {
            productQuantityMap.set(key, quantity);
          }
        });
    
        const mostSoldProduct = [...productQuantityMap.entries()].reduce((max, entry) => (entry[1] > max[1] ? entry : max), ['', 0]);
    
        // product 테이블에서 productName과 price를 가져오는 부분 추가
        const productInfoQuery = `
          SELECT productName, price
          FROM product
          WHERE productKey = ?
        `;
    
        connection.query(productInfoQuery, [mostSoldProduct[0]], (productErr, productResults, productFields) => {
          if (productErr) {
            console.error('Error fetching product information:', productErr);
            res.status(500).json({ message: '상품 정보를 불러오는 중에 오류가 발생했습니다.' });
            return;
          }
    
          const mostSoldProductInfo = {
            totalQuantity: mostSoldProduct[1],
            productKey: mostSoldProduct[0],
            productName: productResults[0].productName,
            price: productResults[0].price,
          };
    
          res.status(200).json(mostSoldProductInfo);
        });
      });
    });

    server.get('/topSellingProducts', async (req, res) => {
      try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
        const query = `
          SELECT
            SUBSTRING_INDEX(SUBSTRING_INDEX(productKey, ',', n.digit + 1), ',', -1) AS splitProductKey,
            SUBSTRING_INDEX(SUBSTRING_INDEX(quantity, ',', n.digit + 1), ',', -1) AS splitQuantity
          FROM
            orders
            JOIN (
              SELECT 0 AS digit UNION ALL
              SELECT 1 UNION ALL
              SELECT 2 UNION ALL
              SELECT 3 UNION ALL
              SELECT 4 UNION ALL
              SELECT 5 UNION ALL
              SELECT 6 UNION ALL
              SELECT 7 UNION ALL
              SELECT 8 UNION ALL
              SELECT 9
            ) n
          WHERE
            LENGTH(productKey) - LENGTH(REPLACE(productKey, ',', '')) >= n.digit
            AND LENGTH(quantity) - LENGTH(REPLACE(quantity, ',', '')) >= n.digit
            AND adddate >= ?
        `;
    
        const results = await new Promise((resolve, reject) => {
          connection.query(query, [thirtyDaysAgo], (err, results, fields) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          });
        });
    
        const productQuantityMap = new Map();
    
        // 중복된 productKey의 quantitiy 값을 합치기
        results.forEach(({ splitProductKey, splitQuantity }) => {
          const keys = splitProductKey.split(',').map((key) => key.trim());
          const quantities = splitQuantity.split(',').map((quantity) => parseInt(quantity.trim(), 10));
    
          keys.forEach((key, index) => {
            const existingQuantity = productQuantityMap.get(key) || 0;
            productQuantityMap.set(key, existingQuantity + quantities[index]);
          });
        });
    
        // 상위 4개 판매 상품 추출
        const topSellingProducts = [...productQuantityMap.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4);
    
        // 각 productKey에 대한 productName과 quantity를 병렬로 가져오기
        const productPromises = topSellingProducts.map(([productKey, quantity]) => {
          return new Promise((resolve, reject) => {
            const productInfoQuery = `
              SELECT productName
              FROM product
              WHERE productKey = ?
            `;
    
            connection.query(productInfoQuery, [productKey], (err, productResults, productFields) => {
              if (err) {
                reject(err);
              } else {
                resolve({
                  productKey,
                  productName: productResults[0].productName,
                  quantity,
                });
              }
            });
          });
        });
    
        // productName을 가져온 결과를 기다린 후 클라이언트에 전송
        const productInfos = await Promise.all(productPromises);
    
        res.status(200).json(productInfos);
      } catch (error) {
        console.error('Error fetching top selling products:', error);
        res.status(500).json({ message: '최다 판매 상품을 불러오는 중에 오류가 발생했습니다.' });
      }
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


    server.post("/addProduct", upload.single('image'), (req, res) => {
      const { cateName, productName, price, stock } = req.body;
    
      // Check if req.file is defined and the productName is available in req.body
      if (req.file && req.body.productName) {
        const newFilePath = req.file.path.replace('undefined', req.body.productName);
    
        // Rename the file asynchronously
        fs.rename(req.file.path, newFilePath, function (renameErr) {
          if (renameErr) {
            console.error("Error renaming file:", renameErr);
            return res.status(500).json({ message: "File renaming failed." });
          }
    
          const imageName = `${req.body.productName}.png`;
    
          // 상품명이 이미 존재하는지 확인
          const checkDuplicateQuery = "SELECT COUNT(*) AS count FROM product WHERE productName = ?";
          connection.query(checkDuplicateQuery, [productName], (duplicateErr, duplicateResults) => {
            if (duplicateErr) {
              console.error("중복 상품명 확인 중 오류 발생:", duplicateErr);
              res.status(500).json({ message: "상품 추가에 실패했습니다." });
              return;
            }
    
            const duplicateCount = duplicateResults[0].count;
    
            if (duplicateCount > 0) {
              // 상품명이 이미 존재하는 경우 특정한 오류 메시지를 반환
              res.status(400).json({ message: "해당 상품명이 이미 존재합니다." });
            } else {
              // 데이터베이스에 상품 추가
              const insertQuery = "INSERT INTO product (cateName, productName, price, stock, img) VALUES (?, ?, ?, ?, ?)";
              connection.query(insertQuery, [cateName, productName, price, stock, imageName], (err, results, fields) => {
                if (err) {
                  console.error("상품 추가 중 오류 발생:", err);
                  res.status(500).json({ message: "상품 추가에 실패했습니다." });
                  return;
                }
                res.status(200).json({ message: "상품 추가가 완료되었습니다." });
              });
            }
          });
        });
      } else {
        // Handle case where req.file or req.body.productName is missing
        res.status(400).json({ message: "Missing file or productName in the request." });
      }
    });

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
  
    server.put("/api/updateReply/:username", async (req, res) => {
      try {
        if (req.method === "PUT") {
          const { username } = req.params;
          const { reply } = req.body;
          // 데이터베이스에서 게시판 정보 수정
          const [result] = await connection.promise().query(
            "UPDATE board SET reply = ? WHERE username = ?",
            [reply, username]
          );
  
          if (result.affectedRows === 1) {
            // 성공적으로 수정된 경우
            res.status(200).json({ message: "Q&A 답변 등록 성공" });
          } else {
            // 삭제 실패 시
            res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
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
    server.listen(3002, (err) => {
      if (err) throw err;
      console.log('> Ready on http://localhost:3002');
    });
  });