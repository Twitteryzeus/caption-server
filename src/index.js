const express = require('express');
const cors = require('cors')
const nodePackage = require('../package.json');
const app = express();
const {port} = require('./config');

app.use(cors());
app.use(express.json());

app.get('/version', (req, res) => {
  res.json({ version: nodePackage.version });
});

app.get('/', (req, res) => {
  res.json({ message: "Server is working!" });
});

app.listen(port, () => {
  console.log(`Server up and running at http://localhost:${port}/`);
});