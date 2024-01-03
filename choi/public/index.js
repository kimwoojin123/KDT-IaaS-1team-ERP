// server.js
const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3001;

const db = mysql.createConnection({
  host: 'your_host',
  user: 'your_user',
  password: 'your_password',
  database: 'shop'
});

db.connect();

app.get('/products', (req, res) => {
  const query = 'SELECT * FROM product';
  
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
