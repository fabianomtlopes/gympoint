import Sequelize from 'sequelize';
// Necessario importar os dados do DB
import databaseConfig from '../config/database';
// importar  os models da app
import User from '../app/models/User';
import Students from '../app/models/Students';

const models = [User, Students];

class Database {
  constructor() {
    this.init();
  }

  init() {
    // a variavel conection esta sendo esperada dentro do model no init
    // das classes
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection));
  }
}

export default new Database();
