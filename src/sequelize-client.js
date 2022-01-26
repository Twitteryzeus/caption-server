const path = require('path')
const Sequelize = require('sequelize')
const { database: sequelizeConfig } = require('./config')
const glob = require('glob');

let sequelize
if (sequelizeConfig.databaseUrl) {
  sequelize = new Sequelize(sequelizeConfig.databaseUrl, {
    dialect: sequelizeConfig.dialect,
    logging: false,
    pool: {
      max: 50,
      min: 0,
      acquire: 1200000,
      idle: 1000000,
    },
    // Specify options, which are used when sequelize.define is called.
    define: {
      hooks: {
        beforeCount(options) {
          options.raw = true
        }
      },
      freezeTableName: true,
      timestamps: true,
      underscored: true,
      paranoid: true
    },
  })
} else {
  sequelize = new Sequelize(
    Object.assign(sequelizeConfig, {
      logging: false,
      pool: {
        max: 50,
        min: 0,
        acquire: 1200000,
        idle: 1000000,
      },
      // Specify options, which are used when sequelize.define is called.
      define: {
        freezeTableName: true,
        timestamps: true,
        underscored: true,
        paranoid: true
      },
    })
  )
}

// fs
//   .readdirSync(path.join(__dirname, 'schema/models'))
glob.sync('**/*.model.js')
  .forEach(file => {
    require(path.join(__dirname, '../', file))(sequelize, Sequelize.DataTypes)
  })

const models = sequelize.models

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models)
  }
})

const getTransaction = async () => sequelize.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED });

module.exports = { sequelize, models, getTransaction }