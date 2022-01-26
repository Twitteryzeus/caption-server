const router = require('express').Router();
const _ = require('lodash');
const { models } = require('../../sequelize-client');

//TODO: Create Caption Master
router.post('/create', async (req, res, next) => {
  try {
    const { body } = req;
    const { CaptionMaster: CaptionMasterModel } = models;

    if (_.isEmpty(body)) {
      throw new Error('Body can not be null');
    }

    const count = await CaptionMasterModel.count({ where: { label: body.label.trim() } });
    if (count) {
      throw new Error('Provide Unique Label!');
    }

    const masterInstance = await CaptionMasterModel.create(body);
    res.json({
      message: 'Caption Master Created Successfully!',
      data: masterInstance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    next();
  }
});

module.exports = router;