const router = require('express').Router();
const _ = require('lodash');
const { getTransaction, models, sequelize } = require('../../sequelize-client');
const { QueryTypes } = require('sequelize');

//TODO: Create a Caption
router.post('/create', async (req, res, next) => {
  let transaction
  try {
    const { body } = req;
    const { CaptionMaster: CaptionMasterModel, Caption: CaptionModel } = models;
    transaction = await getTransaction();

    if (_.isEmpty(body)) {
      throw new Error('Body can not be null');
    }

    let count = await CaptionMasterModel.count({
      where: {
        id: body.captionMasterId
      }
    });
    if (!count) {
      throw new Error('No Such Caption Master Found!');
    }

    count = await CaptionModel.count({
      where: {
        captionMasterId: body.captionMasterId,
        label: body.label.trim()
      }
    });
    if (count) {
      throw new Error('Such caption already exits for this category!');
    }

    const createCaption = await CaptionModel.create(body, { transaction });

    await transaction.commit();
    res.json({
      message: 'Caption Created Successfully!',
      data: createCaption
    });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    res.status(500).json({ error: error.message });
    next();
  }
});

//TODO: Delete a caption
router.delete('/delete/:id', async (req, res, next) => {
  let transaction;
  try {
    const { params: { id = 0 } } = req;
    const { Caption: CaptionModel } = models;
    transaction = await getTransaction();

    const findInstance = await CaptionModel.count({ where: { id } });
    if (!findInstance) {
      throw new Error('No Such Instance Found!');
    }

    await CaptionModel.destroy({ where: { id }, transaction });

    await transaction.commit();
    res.json({
      message: 'Caption Deleted Successfully!',
    });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    res.status(500).json({ error: error.message });
    next();
  }
});

//TODO: List all Captions
router.get('/list', async (req, res, next) => {
  try {
    const { query = {} } = req;
    const { skip = 0, limit = 10, search = '', sortOn = 'id', sortBy = 'DESC' } = query;
    let sqlDataQuery, countQuery = '';

    sqlDataQuery = `select
    c.id,
    c."label",
    c.description,
    c.is_active as "isActive"
  from
    caption c
  where
    c.deleted_at is null
    and c."label" ilike :searchValue`;

    if (query.captionMasterId) {
      sqlDataQuery = `${sqlDataQuery} and c.caption_master_id = :captionMasterId`;
    }
    sqlDataQuery = `${sqlDataQuery} order by c.${_.snakeCase(sortOn)} ${sortBy}`;
    countQuery = `select count(*) from (${sqlDataQuery}) as "count"`;

    sqlDataQuery = `${sqlDataQuery} limit :limit offset :skip`;

    const captionInstance = await sequelize.query(sqlDataQuery, {
      type: QueryTypes.SELECT,
      replacements: { searchValue: `%${search}%`, captionMasterId: query.captionMasterId, limit, skip }
    });

    const [{count}] = await sequelize.query(countQuery, {
      type: QueryTypes.SELECT,
      replacements: { searchValue: `%${search}%`, captionMasterId: query.captionMasterId, limit, skip }
    })

    res.json({
      data: captionInstance,
      count: parseInt(count)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    next();
  }
});

module.exports = router;