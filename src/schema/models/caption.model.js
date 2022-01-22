const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {

  class Caption extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Caption.init({
    label: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false
    },
    captionMasterId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
  }, {
    sequelize,
    modelName: 'Caption',
    tableName: 'caption'
  })

  Caption.associate = (models) => {
    Caption.belongsTo(models.CaptionMaster, {
      foreignKey: 'captionMasterId',
      targetKey: 'id',
      as: 'captionMaster',
      allowNull: true,
      defaultValue: null,
      constraints: false
    })
  }

  return Caption
}