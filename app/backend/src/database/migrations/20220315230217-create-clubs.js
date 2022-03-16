
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('clubs',{
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      clubName: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'club_name'
      }
    })
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('clubs');
  }
};
