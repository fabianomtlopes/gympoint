import { Router } from 'express';

import UserController from './app/controllers/UserController';
import StudentsController from './app/controllers/StudentsController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

// utilizando o middleware global
routes.use(authMiddleware);
// abaixo deste routes de middleware tudo sera verificado com ele
routes.put('/users', UserController.update);
// Para insercao de estudantes
routes.post('/students', StudentsController.store);
// Para alterar os estudantes
routes.put('/students/:id', StudentsController.update);

export default routes;
