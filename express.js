import express from "express";
import fs from "fs";

const app = express();
const PORT = 3213;
const JSONPath = "./index.json";

// 정적 파일을 서빙하기 위해 public 디렉토리를 사용합니다.
// app.use(express.static("public"));

// 메인 페이지에 대한 라우트
app.get("/", (req, res) => {
  const indexPath = "./index.html";
  fs.readFile(indexPath, "utf8", (err, data) => {
    res.status(200).send(data);
  });
});

// 데이터 로드에 대한 라우트
app.post("/loadData", (req, res) => {
  fs.readFile(JSONPath, "utf8", (err, data) => {
    const jsonData = JSON.parse(data);
    res.status(200).json(jsonData);
  });
});

// 서버를 시작합니다.
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}/ 에서 실행 중입니다.`);
});