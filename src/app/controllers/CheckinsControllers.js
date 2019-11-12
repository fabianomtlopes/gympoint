import * as Yup from 'yup';
import Checkins from '../models/Checkins';
import Students from '../models/Students';

class CheckinsControllers {
  async store(req, res) {
    const schema = Yup.object().shape({
      studen_id: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails.' });
    }

    const { student_id } = req.body;

    const student = await Students.findOne({
      where: { id: student_id },
    });

    if (!student) {
      return res.status(400).json({ error: 'Does not exists this student.' });
    }

    const checkin = await Checkins.create({
      student_id,
    });

    return res.json({
      checkin,
    });
  }
}

export default new CheckinsControllers();
