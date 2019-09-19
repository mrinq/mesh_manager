'use strict';
const randomstring = require("randomstring");

module.exports = (sequelize, DataTypes) => {
  const network_key = sequelize.define('network_key', {
    mesh_uuid: DataTypes.STRING,
    index: DataTypes.INTEGER,
    subnet_name: DataTypes.STRING,
    key: DataTypes.STRING,
    phase: DataTypes.INTEGER,
    oldKey: DataTypes.STRING,
    minSecurity: DataTypes.STRING,
  }, {
    hooks: {
      beforeCreate: function(network_key, options, fn) {
        network_key.key = randomstring.generate({
          charset: 'abc12345',
          length: 32
        });
      }
    }
  });
  network_key.associate = function(models) {
    network_key.belongsTo(models.network, {
      foreignKey: "mesh_uuid",
      targetKey: 'mesh_uuid',
      as: "network"
    });
  };
  return network_key;
};