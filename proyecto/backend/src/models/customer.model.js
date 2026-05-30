const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Customer = sequelize.define(
  "Customer",
  {
    cust_num: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    company: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    cust_rep: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    credit_limit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "customers",
    timestamps: false,
  }
);

module.exports = Customer;