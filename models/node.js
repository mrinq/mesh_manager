'use strict';
const randomstring = require("randomstring");

module.exports = (sequelize, DataTypes) => {
  const node = sequelize.define('node', {
    name: DataTypes.STRING,
    node_uuid: DataTypes.STRING,
    mesh_uuid: DataTypes.STRING,
    unicast_address: DataTypes.STRING,
    device_key: DataTypes.STRING,
    security: DataTypes.STRING,
    configComplete: DataTypes.STRING,
    name: DataTypes.STRING,
    cid: DataTypes.STRING,
    pid: DataTypes.STRING,
    vid: DataTypes.STRING,
    crpl: DataTypes.STRING,
    features: DataTypes.JSON,
    appKeys: DataTypes.JSON,
    netKeys: DataTypes.JSON,
    elements: DataTypes.JSON,
    secureNetworkBeacon:DataTypes.STRING,
    defaultTTL:DataTypes.STRING,
    networkTransmit:DataTypes.STRING,
    relayRetransmit:DataTypes.STRING,
    blacklisted: DataTypes.STRING,
  }, {
    hooks: {
      beforeCreate: function(network, options, fn) {
        
        network.node_uuid = randomstring.generate({
          charset: 'abc12345',
          length: 32
        });
      
      }
    },
  });
  node.associate = function(models) {
    node.belongsTo(models.network, {
      foreignKey: "mesh_uuid",
      targetKey: 'mesh_uuid',
      as: "node"
    });
  };
  return node;
};