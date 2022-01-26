const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {

  class Photo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Photo.init({
    label: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false
    },
    photoMasterId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
  }, {
    sequelize,
    modelName: 'Photo',
    tableName: 'photo'
  })

  Photo.associate = (models) => {
    Photo.belongsTo(models.PhotoMaster, {
      foreignKey: 'photoMasterId',
      targetKey: 'id',
      as: 'photoMaster',
      allowNull: true,
      defaultValue: null,
      constraints: false
    })
  }

  return Photo
}