import * as Yup from 'yup';
import { addMonths, parseISO } from 'date-fns';
// import pt from 'date-fns/locale/pt';

import Matriculation from '../models/Matriculations';
import Plans from '../models/Plans';
import Student from '../models/Students';

class MatriculationController {
  async store(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
      plan_id: Yup.number()
        .positive()
        .required(),
      student_id: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails.' });
    }

    const { plan_id, student_id, start_date } = req.body;
    const plan = await Plans.findOne({
      where: { id: plan_id },
    });
    const student = await Student.findOne({
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
      student_id,
      plan_id,
      start_date,
      endDate,
      priceToPay,
    });

    res.json({
      matriculation,
    });
  }
}

export default new MatriculationController();
