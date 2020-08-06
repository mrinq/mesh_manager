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
  });
  node.associate = function(models) {
    node.belongsTo(models.network, {
      foreignKey: "mesh_uuid",
      targetKey: 'mesh_uuid',
      as: "node"
    });
    node.belongsToMany(models.group, {
      through: models.group_node,
      as: 'groups',
      foreignKey: 'node_uuid',
      otherKey: 'group_id',
      sourceKey: 'node_uuid'
      
    });
    node.hasMany(models.group_node, {
      as: "group_nodes",
      foreignKey: "node_uuid",
      sourceKey: 'node_uuid'
    });
  };
  return node;
};