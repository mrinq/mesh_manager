'use strict';
const randomstring = require("randomstring");

module.exports = (sequelize, DataTypes) => {
  const network = sequelize.define('network', {
    mesh_uuid: DataTypes.STRING,
    name: DataTypes.STRING,
    network_type: DataTypes.STRING,
    application_type: DataTypes.VIRTUAL,
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
        await network.createApplication_key({ mesh_uuid: network.mesh_uuid, application_type: network.application_type})
        await network.createProvisioner({ mesh_uuid: network.mesh_uuid})
        await network.createGroup({address: 'C000', parentAddress: 'C000'})
        await network.createGroup({address: 'C001', parentAddress: 'C001'})
        await network.createGroup({address: 'C002', parentAddress: 'C002'})
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

    network.hasMany(models.provisioner, {
      foreignKey: "mesh_uuid",
      as: "provisioners",
      sourceKey: 'mesh_uuid'
    });

    network.hasMany(models.node, {
      foreignKey: "mesh_uuid",
      as: "nodes",
      sourceKey: 'mesh_uuid'
    });

    network.hasMany(models.group, {
      as: "groups",
      foreignKey: "mesh_uuid",
      sourceKey: 'mesh_uuid'
    });

  };
  return network;
};