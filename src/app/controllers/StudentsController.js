import * as Yup from 'yup';

import Students from '../models/Students';

class StudentsController {
  async store(req, res) {
    // para criar as validacaoes
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .integer()
        .max(105)
        .positive()
        .required(),
      weight: Yup.number()
        .positive()
        .required(),
      height: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const studentExist = await Students.findOne({
      where: { email: req.body.email },
    });
    if (studentExist) {
      res.status(400).json({ error: 'Students already exists.' });
    }
    const { id, name, email, age, weight, height } = await Students.create(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }

  async update(req, res) {
    // para criar as validacaoes
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      age: Yup.number()
        .integer()
        .max(105)
        .positive(),
      weight: Yup.number().positive(),
      height: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    // const { email } = req.body;
    const students = await Students.findByPk(req.params.id);

    if (req.body.email !== students.email) {
      const studentExist = await Students.findOne({
        where: { email: req.body.email },
      });

      if (studentExist) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    const { id, name, email, age, weight, height } = await students.update(
      req.body
    );
    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }
}

export default new StudentsController();
