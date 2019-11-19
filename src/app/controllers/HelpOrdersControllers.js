import * as Yup from 'yup';
import HelpOrders from '../models/HelpOrders';
import Students from '../models/Students';
import QuestionMail from '../jobs/QuestionMail';
import Queue from '../../lib/Queue';

class HelpOrdersController {
  async index(req, res) {
    const allQuestions = await HelpOrders.findAll({
      where: { answer: null },
    });

    return res.json({
      allQuestions,
    });
  }

  async listAsk(req, res) {
    const student = await Students.findOne({
      where: { id: req.params.studentId },
    });

    if (!student) {
      return res.status(400).json({ error: 'Does not exists this student.' });
    }

    const allHelpOrders = await HelpOrders.findAll({
      where: {
        student_id: req.params.studentId,
      },
    });

    if (!allHelpOrders) {
      return res.status(400).json({ error: 'There is no question.' });
    }

    return res.json({
      allHelpOrders,
    });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails.' });
    }

    const student = await Students.findOne({
      where: { id: req.params.studentId },
    });

    if (!student) {
      res.status(400).json({ error: 'Does not exists this student.' });
    }

    const { question } = req.body;

    const helpOrders = await HelpOrders.create({
      student_id: req.params.studentId,
      question,
    });

    return res.json({
      helpOrders,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      // student_id: Yup.number().positive(),
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails.' });
    }

    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Invalid date.' });
    }

    const answerDate = Number(date);

    const answerQuestion = await HelpOrders.findOne({
      where: {
        student_id: req.params.studentId,
        answer: null,
      },
    });
    if (!answerQuestion) {
      return res
        .status(400)
        .json({ error: 'Impossible to find this request to answer.' });
    }

    const { answer } = req.body;

    // const { id, title, duration, price } = await plans.update(req.body);
    await answerQuestion.update({
      id: answerQuestion.id,
      answer,
      answer_at: answerDate,
    });

    const questionAnswer = await HelpOrders.findOne({
      where: {
        student_id: req.params.studentId,
      },
      order: [['answer_at', 'DESC']],
      attributes: ['id', 'question', 'answer', 'answer_at', 'created_at'],
      include: [
        {
          model: Students,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    // To send email answering  stundent
    await Queue.add(QuestionMail.key, {
      questionAnswer,
    });

    return res.json({
      answerQuestion,
    });
  }
}

export default new HelpOrdersController();
