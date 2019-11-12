import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class MatriculationMail {
  get key() {
    return 'MatriculationMail';
  }

  async handle({ data }) {
    const { matriculations } = data;

    // console.log('A fila andou... amém.');

    await Mail.sendMail({
      to: `${matriculations.student.name} <${matriculations.student.email}>`,
      subject: 'Matrícula da GymPoint',
      template: 'matriculation',
      context: {
        name: matriculations.student.name,
        title: matriculations.plan.title,
        dataInicio: format(
          parseISO(matriculations.start_date),
          "'dia' dd 'de' MMM' de'yyyy', às' H:mm'h' ",
          {
            locale: pt,
          }
        ),
        dataFinal: format(
          parseISO(matriculations.end_date),
          " 'dia' dd 'de' MMM' de' yyyy', às' H:mm'h' ",
          {
            locale: pt,
          }
        ),
        price: matriculations.price.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
      },
    });
  }
}

export default new MatriculationMail();
