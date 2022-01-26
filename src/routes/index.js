const captionMaster = require('./caption-master');

const setAllRoutes = (app) => {
  app.use('/caption-master', captionMaster);
};

module.exports = setAllRoutes;