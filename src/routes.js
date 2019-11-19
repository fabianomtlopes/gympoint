import { Router } from 'express';
// import multer from 'multer';
// import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import StudentsController from './app/controllers/StudentsController';
import PlanController from './app/controllers/PlanController';
import SessionController from './app/controllers/SessionController';
import MatriculationController from './app/controllers/MatriculationController';
import CheckinsController from './app/controllers/CheckinsControllers';
import HelpOrdersController from './app/controllers/HelpOrdersControllers';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
// const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

// Checkins
routes.post('/students/:studentId/checkins', CheckinsController.store);
// Help Orders
routes.post('/students/:studentId/help-orders', HelpOrdersController.store);
routes.get('/students/:studentId/help-orders', HelpOrdersController.listAsk);

// utilizando o middleware global - abaixo somente com token de admin
routes.use(authMiddleware);
// abaixo deste routes de middleware tudo sera verificado com ele
routes.put('/users', UserController.update);
// Para insercao de estudantes
routes.post('/students', StudentsController.store);
// Para alterar os estudantes
routes.put('/students/:id', StudentsController.update);

// Para Planos
routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

// Matriculation
routes.get('/matriculation', MatriculationController.index);
routes.post('/matriculation', MatriculationController.store);
routes.delete('/matriculation/:id', MatriculationController.delete);
routes.put('/matriculation/:id', MatriculationController.update);

// Checkins - verificacao de todos os checkins por estudantes
routes.get('/students/:studentId/checkins', CheckinsController.index);

// Help Orders - resposta
routes.put('/students/:studentId/help-orders', HelpOrdersController.update);
routes.get('/students/help-orders', HelpOrdersController.index);

export default routes;
