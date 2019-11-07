import * as Yup from 'yup';

import Plans from '../models/Plans';

class PlanController {
  async index(req, res) {
    // const { page = 1 } = req.query;
    const plans = await Plans.findAll({
      order: ['title'],
      limit: 20,
      // offset: (page - 1) * 20,
      attributes: ['id', 'title', 'duration', 'price'],
    });
    return res.json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .positive()
        .required(),
      price: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails.' });
    }

    const planExist = await Plans.findOne({
      where: { title: req.body.title },
    });
    if (planExist) {
      res.status(400).json({ error: 'This plan already exists.' });
    }

    const { id, title, duration, price } = await Plans.create(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .positive()
        .required(),
      price: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails.' });
    }

    // const { idPlan } = req.body;

    const plans = await Plans.findByPk(req.params.id);

    if (!plans) {
      res.status(400).json({ error: 'This plan do not exist.' });
    }

    const { id, title, duration, price } = await plans.update(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async delete(req, res) {
    const plan = await Plans.findByPk(req.params.id);

    if (!plan) {
      return res
        .status(400)
        .json({ error: 'Impossible to find this plan to delete.' });
    }

    const destroyPlan = plan.destroy();

    return res.json(destroyPlan);
  }
}

export default new PlanController();
