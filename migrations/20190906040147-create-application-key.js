'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('application_keys', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      index: {
        type: Sequelize.INTEGER
      },
      boundNetKey: {
        type: Sequelize.INTEGER
      },
      app_name: {
        type: Sequelize.STRING
      },
      key: {
        type: Sequelize.STRING,
        unique: true
      },
      oldKey: {
        type: Sequelize.STRING
      },
      minSecurity: {
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
    return queryInterface.dropTable('application_keys');
  }
};