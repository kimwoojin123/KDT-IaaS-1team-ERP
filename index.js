import fs, { writeFile } from "fs";
import { parse, stringify } from "querystring";
const JSONPath = "index.json";

// JSON 데이터를 문자열로 변환
const parsedJSON = JSON.parse(fs.readFileSync(JSONPath, 'utf8'))
  console.log(parsedJSON)
// jsonDataContainer라는 ID를 가진 div 요소를 찾아서 그 안에 JSON 데이터를 넣습니다.
const root = document.getElementById("root");
root.textContent = parsedJSON;

