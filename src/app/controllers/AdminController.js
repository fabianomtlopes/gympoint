import Admin from '../models/Admin';

class AdminController {
  // para gravar os dados do admin
  async store(req, res) {
    const users = await Admin.create(req.body);

    return res.json(users);
  }
}

export default new AdminController();
