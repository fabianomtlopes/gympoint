import Admin from '../models/Admin';

class AdminController {
  // para gravar os dados do admin
  async store(req, res) {
    const admin = await Admin.create(req.body);

    return res.json(admin);
  }
}

export default new AdminController();
