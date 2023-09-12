'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class master_bank extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  master_bank.init({
    userId: DataTypes.INTEGER,
    nama: DataTypes.STRING,
    alamat: DataTypes.STRING,
    norek: DataTypes.INTEGER,
    noTlp: DataTypes.INTEGER,
    saldo: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'master_bank',
    underscored: true,
  });
  return master_bank;
};