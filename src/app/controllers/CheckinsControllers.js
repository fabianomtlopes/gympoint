import { Op } from 'sequelize';
import { startOfWeek, endOfWeek } from 'date-fns';
import Checkins from '../models/Checkins';
import Students from '../models/Students';

class CheckinsControllers {
  async index(req, res) {
    const student = await Students.findOne({
      where: { id: req.params.studentId },
    });

    if (!student) {
      return res.status(400).json({ error: 'Does not exists this student.' });
    }

    const studentAllCheckin = await Checkins.findAll({
      where: { student_id: req.params.studentId },
      include: [
        {
          model: Students,
          as: 'student',
          attributes: ['name'],
        },
      ],
    });

    // const { student_id, created_at } = studentAllCheckin;

    return res.json({
      studentAllCheckin,
    });
  }

  async store(req, res) {
    const student = await Students.findOne({
      where: { id: req.params.studentId },
    });

    if (!student) {
      return res.status(400).json({ error: 'Does not exists this student.' });
    }

    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Invalid date.' });
    }

    const searchDate = Number(date); // ou parseInt(date)

    const checkinCount = await Checkins.count({
      where: {
        student_id: req.params.studentId,
        created_at: {
          [Op.between]: [startOfWeek(searchDate), endOfWeek(searchDate)],
        },
      },
    });

    if (checkinCount >= 5) {
      return res
        .status(403)
        .json({ error: 'Can not do more 5 checkin per week.' });
    }

    const checkin = await Checkins.create({
      student_id: student.id,
    });

    return res.json({
      checkin,
    });
  }
}

export default new CheckinsControllers();
