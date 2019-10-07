'use strict';
module.exports = (sequelize, DataTypes) => {
  const group_node = sequelize.define('group_node', {
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    node_uuid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {});
  group_node.associate = function(models) {
    group_node.belongsTo(models.group, {
      foreignKey: "group_id",
      as: "group"
    });
    group_node.belongsTo(models.node, {
      foreignKey: "node_uuid",
      targetKey: 'node_uuid',
      as: "node",
    });
  };
  return group_node;
};