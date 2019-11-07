import Sequelize from 'sequelize';
// Necessario importar os dados do DB
import databaseConfig from '../config/database';
// importar  os models da app
import User from '../app/models/User';
import Students from '../app/models/Students';
import Plans from '../app/models/Plans';
import Matriculations from '../app/models/Matriculations';

const models = [User, Students, Plans, Matriculations];

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
