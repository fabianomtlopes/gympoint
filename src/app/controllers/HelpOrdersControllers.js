import * as Yup from 'yup';
import HelpOrders from '../models/HelpOrders';
import Students from '../models/Students';
import AnswerMail from '../jobs/AnswerMail';
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

  // Look for all questions without answer
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

  // Save the question
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

  // Answer the questions e send an e-mail
  async update(req, res) {
    const schema = Yup.object().shape({
      // student_id: Yup.number().positive(),
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails.' });
    }

    const date = new Date().getTime();
    // const { date } = req.query;

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

    const answerStudent = await HelpOrders.findOne({
      where: { student_id: req.params.studentId },
      attributes: ['id', 'question', 'answer', 'answer_at', 'created_at'],
      order: [['answer_at', 'DESC']],
      include: [
        {
          model: Students,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    // To send email answering  stundent
    await Queue.add(AnswerMail.key, {
      answerStudent,
    });

    return res.json({
      answerQuestion,
    });
  }
}

export default new HelpOrdersController();
