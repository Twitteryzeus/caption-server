const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {

  class CaptionMaster extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  CaptionMaster.init({
    label: {
      type: DataTypes.STRING,
      unique: false,
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
    modelName: 'CaptionMaster',
    tableName: 'caption_master'
  })

  CaptionMaster.associate = (models) => {
    CaptionMaster.hasMany(models.Caption, {
      as: 'captions',
      foreignKey: 'captionMasterId',
      sourceKey: 'id',
      constraints: false,
      onDelete: 'RESTRICT',
      hooks: true
    })
  }

  return CaptionMaster
}