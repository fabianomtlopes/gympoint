import Sequelize from 'sequelize';
import mongoose from 'mongoose';
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
    this.mongo();
  }

  init() {
    // a variavel conection esta sendo esperada dentro do model no init
    // das classes
    this.connection = new Sequelize(databaseConfig);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb://localhost:27017/gympoint',
      {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
      }
    );
  }
}

export default new Database();
