'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
          queryInterface.addColumn('application_keys', 'application_type', {
              type: Sequelize.ENUM,
              values: ["home_automation", "access_control"]
          }, { transaction: t })
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
          // queryInterface.removeColumn('application_keys', 'application_type', { transaction: t })
          queryInterface.removeColumn('application_keys', 'application_type')
      .then(() => queryInterface.sequelize.query('DROP TYPE "enum_application_keys_application_type";'))
      ])
  })
  }
};
