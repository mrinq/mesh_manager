'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('provisioners', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: false,
        type: Sequelize.INTEGER
      },
      provisioner_uuid: {
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
      address: {
        type: Sequelize.STRING
      },
      allocated_unicast_range: {
        type: Sequelize.JSON
      },
      range_sort_value:{
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('provisioners');
  }
};