import jwt from 'jsonwebtoken';
// vem de uma biblioteca padrao do nodejs
import { promisify } from 'util';

// necessario importar o authConfig devido a senha
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  // headers.authorization e o nome do header enviado pelo insomnia
  const authHeaders = req.headers.authorization;

  if (!authHeaders) {
    return res.status(401).json({ error: 'Token not provided.' });
  }
  // dividir  a header
  const [, token] = authHeaders.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    // console.log(decoded);
    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid.' });
  }
};
