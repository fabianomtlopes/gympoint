import Sequelize, { Model } from 'sequelize';

class Students extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
        email: Sequelize.STRING,
        idade: Sequelize.INTEGER,
        peso: Sequelize.STRING,
        altura: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
  }
}

export default Students;
