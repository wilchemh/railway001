const express = require('express');
const app = express();
const environment = require('dotenv').config();

app.get('/', (req, res) => {
  res.send('Hello World 1!');
});

const server = app.listen(process.env.PORT || 8080, () => {
  console.log(process.env.PORT);
  console.log(process.env.NODE_ENV);
});