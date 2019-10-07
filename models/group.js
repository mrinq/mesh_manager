'use strict';
module.exports = (sequelize, DataTypes) => {
  const group = sequelize.define('group', {
    mesh_uuid: DataTypes.STRING,
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    parentAddress: DataTypes.STRING
  }, {});
  group.associate = function(models) {
    group.belongsTo(models.network, {
      foreignKey: "mesh_uuid",
      targetKey: 'mesh_uuid',
      as: "network"
    });
    group.belongsToMany(models.node, {
      through: models.group_node,
      as: 'nodes',
      foreignKey: 'group_id',
      otherKey: 'node_uuid',
      targetKey: 'node_uuid'
    });
  };
  return group;
};