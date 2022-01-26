const express = require('express');
const cors = require('cors')
const nodePackage = require('../package.json');
const app = express();
const { port } = require('./config');
const { sequelize } = require('./sequelize-client');
const setAllRoutes = require('./routes');

app.use(cors());
app.use(express.json());

app.get('/version', (req, res) => {
  res.json({ version: nodePackage.version });
});

app.get('/', (req, res) => {
  res.json({ message: "Server is working!" });
});

setAllRoutes(app);

sequelize.sync().then(async () => {
  app.listen(port, () => {
    console.log(`Server up and running at http://localhost:${port}/`);
  });
})