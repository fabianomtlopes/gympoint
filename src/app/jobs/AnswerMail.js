import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class AnswerMail {
  get key() {
    return 'AnswerMail';
  }

  async handle({ data }) {
    const { questionAnswer } = data;

    console.log('************************* A fila andou...');

    await Mail.sendMail({
      to: `${questionAnswer.student.name} <${questionAnswer.student.email}>`,
      subject: 'Resposta de sua pergunta - GymPoint',
      template: 'question',
      context: {
        name: questionAnswer.student.name,
        // title: questionAnswer.plan.title,
        dataPergunta: format(
          parseISO(questionAnswer.created_at),
          "'dia' dd 'de' MMM' de'yyyy', às' H:mm'h' ",
          {
            locale: pt,
          }
        ),
        question: questionAnswer.question,
        answer: questionAnswer.answer,
        answer_at: format(
          parseISO(questionAnswer.updated_at),
          " 'dia' dd 'de' MMM' de' yyyy', às' H:mm'h' ",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new AnswerMail();
