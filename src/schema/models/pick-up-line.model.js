const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {

  class PickUpLine extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  PickUpLine.init({
    lineText: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
  }, {
    sequelize,
    modelName: 'PickUpLine',
    tableName: 'pick_up_line'
  })

  PickUpLine.associate = (models) => {}

  return PickUpLine
}