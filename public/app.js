const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex');
const jwt = require('jsonwebtoken');
const express = require("express");
const next = require('next');
const mysql = require('mysql2');
const isDev = process.env.NODE_ENV !== 'development';
const app = next({ dev: isDev });
const handle = app.getRequestHandler();
const port = 3001;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '0177',
  database: 'shop'
});

app.prepare().then(() => {
  const server = express();
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));


server.get('/products', (req, res) => {
  connection.query('SELECT * FROM product', (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});


server.all('*', (req,res) =>{
  return handle(req,res)
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
})