'use strict';
const randomstring = require("randomstring");

module.exports = (sequelize, DataTypes) => {
  const application_key = sequelize.define('application_key', {
    app_name: DataTypes.STRING,
    mesh_uuid: DataTypes.STRING,
    index: DataTypes.INTEGER,
    boundNetKey: DataTypes.INTEGER,
    key: DataTypes.STRING,
    oldKey: DataTypes.STRING,
    minSecurity: DataTypes.STRING,
  }, {
    hooks: {
      beforeCreate: function(application_key, options, fn) {
        application_key.key = randomstring.generate({
          charset: 'abc12345',
          length: 32
        });
      }
    }
  });
  application_key.associate = function(models) {
    application_key.belongsTo(models.network, {
      foreignKey: "mesh_uuid",
      as: "network"
    });
  };
  return application_key;
};