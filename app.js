import http from "http";
import fs, { writeFile } from "fs";
import { parse, stringify } from "querystring";
const PORT = 3213;
const htmlpath = "index.html";
const JSONPath = "index.json";

const serv = http.createServer((req, res)=>{
  if(req.method==="GET" && req.url==="/"){
    fs.readFileSync(htmlpath, 'utf8')
    const parsedJSON = JSON.parse(fs.readFileSync(JSONPath, 'utf8'))
    console.log(parsedJSON)
  }
});

serv.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/`);
});
