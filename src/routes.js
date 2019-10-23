import { Router } from 'express';

import UserController from './app/controllers/UserController';
import StudentsController from './app/controllers/StudentsController';

const routes = new Router();

routes.post('/users', UserController.store);

export default routes;
