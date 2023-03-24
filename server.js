const express = require('express');
const app = express();
const environment = require('dotenv').config();

app.get('/', (req, res) => {
  res.send('Hello World 1!');
});

const server = app.listen(process.env.PORT || 8080, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log('Example app listening at http://' + host + ':' + port);
});
