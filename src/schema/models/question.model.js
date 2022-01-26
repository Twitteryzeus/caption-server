const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {

  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Question.init({
    label: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    questionType: {
      type: DataTypes.ENUM('DARE','QUESTION'),
      defaultValue: 'QUESTION'
    },
    isAdult: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
  }, {
    sequelize,
    modelName: 'Question',
    tableName: 'question'
  })

  Question.associate = (models) => {}

  return Question
}