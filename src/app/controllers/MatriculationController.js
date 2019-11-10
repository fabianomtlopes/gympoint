import * as Yup from 'yup';
import { addMonths, parseISO } from 'date-fns';
// import pt from 'date-fns/locale/pt';

import Plans from '../models/Plans';
import Students from '../models/Students';
import Matriculation from '../models/Matriculations';
import Mail from '../../lib/Mail';
// import Notification from '../schemas/Notification';

class MatriculationController {
  async index(req, res) {
    const { page = 1 } = req.body;
    const matriculations = await Matriculation.findAll({
      order: ['id'],
      attributes: ['id', 'start_date', 'end_date', 'price', 'past'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Students,
          as: 'student',
          attributes: ['id', 'name'],
        },
        {
          model: Plans,
          as: 'plan',
          attributes: ['id', 'title'],
        },
      ],
    });

    return res.json(matriculations);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .positive()
        .required(),
      plan_id: Yup.number()
        .positive()
        .required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails.' });
    }

    const { plan_id, student_id, start_date } = req.body;
    const plan = await Plans.findOne({
      where: { id: plan_id },
    });
    const student = await Students.findOne({
      where: { id: student_id },
    });

    if (!plan) {
      res.status(400).json({ error: 'Does not exists this plan.' });
    }

    if (!student) {
      res.status(400).json({ error: 'Does not exists this student.' });
    }

    const startDate = parseISO(start_date);

    const endDate = addMonths(startDate, plan.duration);
    const priceToPay = plan.price * plan.duration;

    const matriculation = await Matriculation.create({
      student_id: student.id,
      plan_id: plan.id,
      start_date,
      end_date: endDate,
      price: priceToPay,
    });

    // .then(result => console.log(result.id))

    // student_id: student.id, plan_id: plan.id
    const matriculations = await Matriculation.findOne({
      where: { student_id: req.body.student_id, plan_id: req.body.plan_id },
      attributes: ['id', 'start_date', 'end_date', 'price', 'past'],
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Students,
          as: 'student',
          attributes: ['id', 'name'],
        },
        {
          model: Plans,
          as: 'plan',
          attributes: ['id', 'title'],
        },
      ],
    });

    await Mail.sendMail({
      to: `${matriculations.student.name} <${matriculations.student.email}>`,
      subject: 'Matrícula da GymPoint',
      template: 'matriculation',
      context: {
        name: matriculations.student.name,
        title: matriculations.plan.title,
        dataInicio: startDate,
        dataFinal: endDate,
        price: priceToPay,
      },
    });

    return res.json({
      matriculation,
    });
  }
}

export default new MatriculationController();
