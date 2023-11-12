import jwt from "jsonwebtoken";
import { AUTH_ACCESS_SERCRET_KEY } from "../common/constant";
import { AuthenticationError } from "../common/customError";

export const authenticate = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    throw new AuthenticationError('Authentication failed')
  }
  jwt.verify(token, AUTH_ACCESS_SERCRET_KEY, function (err, decoded) {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        throw new AuthenticationError('Authentication failed', 'TokenExpiredError');
      }

      throw new AuthenticationError('Authentication failed')
    }
    res.locals.user = decoded;
    next();
  });
}