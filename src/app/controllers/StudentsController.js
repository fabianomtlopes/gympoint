import * as Yup from 'yup';

import Students from '../models/Students';

class StudentsController {
  async store(req, res) {
    // para criar as validacaoes
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
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
      name: Yup.string().required(),
      email: Yup.string().required(),
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
  }
}

export default new StudentsController();
