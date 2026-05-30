const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Product = sequelize.define(
  "Product",
  {
    mfr_id: {
      type: DataTypes.CHAR(3),
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.CHAR(5),
      primaryKey: true,
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    qty_on_hand: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "products",
    timestamps: false,
  }
);

module.exports = Product;