import { Router } from 'express';

import AdminController from './app/controllers/AdminController';

const routes = new Router();

routes.post('/admins', AdminController.store);

routes.get('/', (req, res) => {
  return res.json({ message: 'Teste para o Gyn' });
});

export default routes;
