const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');

class ProductTag extends Model {}

ProductTag.init(
  {
    // define columns
    id: {// the id field is the primary key here
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      references: {
          model: 'product',// create a reference to the User model
          key: 'id'// by matching Post's key to User's id field
      }
    },
    tag_id: {
      type: DataTypes.INTEGER,
      references: {
          model: 'tag',// create a reference to the User model
          key: 'id'// by matching Post's key to User's id field
      }
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product_tag',
  }
);

module.exports = ProductTag;
