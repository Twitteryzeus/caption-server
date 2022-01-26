const captionMaster = require('./caption-master');
const caption = require('./caption');

const setAllRoutes = (app) => {
  app.use('/caption-master', captionMaster);
  app.use('/caption', caption);
};

module.exports = setAllRoutes;