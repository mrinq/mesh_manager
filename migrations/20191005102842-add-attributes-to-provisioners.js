'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
          queryInterface.addColumn('provisioners', 'allocated_group_range', {
              type: Sequelize.JSON,
          }, { transaction: t }),
          queryInterface.addColumn('provisioners', 'allocated_scene_range', {
            type: Sequelize.JSON,
        }, { transaction: t }),
        queryInterface.addColumn('provisioners', 'sort_value', {
          type: Sequelize.JSON,
          defaultValue: {unicast: null, group: null, scene: null}
      }, { transaction: t })
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
          queryInterface.removeColumn('provisioners', 'allocated_group_range', { transaction: t }),
          queryInterface.removeColumn('provisioners', 'allocated_scene_range', { transaction: t }),
          queryInterface.removeColumn('provisioners', 'sort_value', { transaction: t })
      ])
  })
  }
};

