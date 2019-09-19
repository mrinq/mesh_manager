'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('nodes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: false,
        type: Sequelize.INTEGER
      },
      node_uuid: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      mesh_uuid: {
        type: Sequelize.STRING,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: {
          model: "networks",
          key: "mesh_uuid"
        }
      },
      unicast_address: {
        type: Sequelize.STRING
      },
      device_key: {
        type: Sequelize.STRING
      },
      security: {
        type: Sequelize.STRING
      },
      configComplete: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      cid: {
        type: Sequelize.STRING
      },
      pid: {
        type: Sequelize.STRING
      },
      vid: {
        type: Sequelize.STRING
      },
      crpl: {
        type: Sequelize.STRING
      },
      features: {
        type: Sequelize.JSON
      },
      appKeys: {
        type: Sequelize.JSON
      },
      netKeys: {
        type: Sequelize.JSON
      },
      elements: {
        type: Sequelize.JSON
      },
      secureNetworkBeacon:{
        type: Sequelize.STRING
      },
      defaultTTL:{
        type: Sequelize.STRING
      },
      networkTransmit:{
        type: Sequelize.STRING
      },
      relayRetransmit:{
        type: Sequelize.STRING
      },
      blacklisted:{
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('nodes');
  }
};