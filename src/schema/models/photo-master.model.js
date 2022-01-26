const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {

  class PhotoMaster extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  PhotoMaster.init({
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
    modelName: 'PhotoMaster',
    tableName: 'photo_master'
  })

  PhotoMaster.associate = (models) => {
    PhotoMaster.hasMany(models.Photo, {
      as: 'photos',
      foreignKey: 'photoMasterId',
      sourceKey: 'id',
      constraints: false,
      onDelete: 'RESTRICT',
      hooks: true
    })
  }

  return PhotoMaster
}