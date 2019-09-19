'use strict';
const randomstring = require("randomstring");

module.exports = (sequelize, DataTypes) => {
  const network = sequelize.define('network', {
    mesh_uuid: DataTypes.STRING,
    name: DataTypes.STRING,
    network_type: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: function(network, options, fn) {
        
        network.mesh_uuid = randomstring.generate({
          charset: 'abc12345',
          length: 32
        });
      
      },
      afterCreate: async function(network, options, fn) {
        await network.createNetwork_key({ mesh_uuid: network.mesh_uuid})
        await network.createApplication_key({ mesh_uuid: network.mesh_uuid})
      }
    },
  });
  network.associate = function(models) {
    // associations can be defined here
    network.hasMany(models.network_key, {
      foreignKey: "mesh_uuid",
      as: "network_keys",
      sourceKey: 'mesh_uuid'
    });
    
    network.hasMany(models.application_key, {
      foreignKey: "mesh_uuid",
      as: "application_keys",
      sourceKey: 'mesh_uuid'
    });

    network.hasMany(models.node, {
      foreignKey: "mesh_uuid",
      as: "nodes",
      sourceKey: 'mesh_uuid'
    });
  };
  return network;
};