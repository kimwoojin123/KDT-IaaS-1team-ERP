// 서버 설정 및 필요한 패키지 임포트
import http from 'http';
import mysql from  'mysql';


// MariaDB 연결 설정
const dbConfig = {
  host: 'localhost',  // 호스트 이름
  user: 'yourUsername',  // 사용자 이름
  password: 'yourPassword',  // 비밀번호
  database: 'shop'  // 데이터베이스 이름
};

// MariaDB 연결 생성
const connection = mysql.createConnection(dbConfig);

// 서버 생성
const server = http.createServer((req, res) => {
  // 'product' 테이블에서 모든 상품 조회 SQL 쿼리
  const query = 'SELECT * FROM product';

  // SQL 쿼리 실행
  connection.query(query, (error, results) => {
    if (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(results));  // 상품 목록을 JSON 형식으로 반환
    }
  });
});

// 서버를 3000 포트에서 실행
server.listen(3000, () => {
  console.log('Server running on port 3000');
});