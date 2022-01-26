const router = require('express').Router();
const _ = require('lodash');
const { getTransaction, models, sequelize } = require('../../sequelize-client');
const { QueryTypes } = require('sequelize');

//TODO: Create Caption Master
router.post('/create', async (req, res, next) => {
  let transaction;
  try {
    const { body } = req;
    const { CaptionMaster: CaptionMasterModel } = models;
    transaction = await getTransaction();

    if (_.isEmpty(body)) {
      throw new Error('Body can not be null');
    }

    const count = await CaptionMasterModel.count({ where: { label: body.label.trim() } });
    if (count) {
      throw new Error('Provide Unique Label!');
    }

    const masterInstance = await CaptionMasterModel.create(body, { transaction });

    await transaction.commit();
    res.json({
      message: 'Caption Master Created Successfully!',
      data: masterInstance
    });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    res.status(500).json({ error: error.message });
    next();
  }
});

//TODO: Delete Caption Master
router.delete('/delete/:id', async (req, res, next) => {
  let transaction;
  try {
    const { params: { id = 0 } } = req;
    const { CaptionMaster: CaptionMasterModel, Caption: CaptionModel } = models;
    transaction = await getTransaction();

    const findInstance = await CaptionMasterModel.count({ where: { id } });
    if (!findInstance) {
      throw new Error('No Such Instance Found!');
    }

    await CaptionModel.destroy({ where: { captionMasterId: id }, transaction });
    await CaptionMasterModel.destroy({ where: { id }, transaction });

    await transaction.commit();
    res.json({
      message: 'Caption Master Deleted Successfully!',
    });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    res.status(500).json({ error: error.message });
    next();
  }
});

//TODO: Fetch All Caption Master
router.get('/list', async (req, res, next) => {
  try {
    const { query: { skip = 0, limit = 10, search = '', sortOn = 'id', sortBy = 'DESC' } } = req;
    let query = `select
    cm.id,
    cm."label",
    cm.description,
    cm.is_active as "isActive"
  from
    caption_master cm
  where
    cm.deleted_at is null
    and cm."label" ilike :searchValue
  order by
    cm.${_.snakeCase(sortOn)} ${sortBy}`;

    const countQuery = `select count(*) from (${query}) as "count"`;
    query = `${query} limit :limit offset :skip`;

    const instances = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { searchValue: `%${search}%`, limit, skip }
    });

    const [{ count }] = await sequelize.query(countQuery, {
      type: QueryTypes.SELECT,
      replacements: { searchValue: `%${search}%`, limit, skip }
    });

    res.json({
      data: instances,
      count: parseInt(count)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    next();
  }
});

module.exports = router;