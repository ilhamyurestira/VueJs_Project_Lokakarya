'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class role_menu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.role, { foreignKey: 'roleId' });
      this.belongsTo(models.menu, { foreignKey: 'menuId' });
    }
  }
  role_menu.init(
    {
      roleId: {
        type: DataTypes.INTEGER,
        field: 'roleId',
        references: {
          model: 'roles',
          key: 'id',
        },
      },
      menuId: {
        type: DataTypes.INTEGER,
        field: 'menuId',
        references: {
          model: 'menus',
          key: 'id',
        },
      },
      isActive: {
        type: DataTypes.STRING,
        field: 'isActive',
      },
      programName: {
        type: DataTypes.STRING,
        field: 'programName', // Atur nama kolom sesuai yang digunakan di database
      },
      createdBy: {
        type: DataTypes.STRING,
        field: 'createdBy', // Atur nama kolom sesuai yang digunakan di database
      },
      updatedBy: {
        type: DataTypes.STRING,
        field: 'updatedBy', // Atur nama kolom sesuai yang digunakan di database
      },
    },
    {
      sequelize,
      modelName: 'role_menu',
      underscored: true,
    }
  );
  return role_menu;
};
