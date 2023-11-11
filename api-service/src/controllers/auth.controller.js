import { validator } from '../utils/validator';
import { handleLoginSV, handleRefreshTokenSV } from '../services/auth.service';
import { ValidationError } from '../common/customError';

export const handleLoginCtl = async (req, res, next) => {
  try {
    // Validate
    validateLoginInput(req);

    // Handle business logic
    const loginUser = req.body;
    const token = await handleLoginSV(loginUser);
    res.status(200).json({
      status: 'SUCCESS',
      data: token
    })

  } catch (err) {
    next(err);
  }
}


export const handleRefreshTokenCtl = async (req, res, next) => {
  try {
    // Validate
    validateRefreshTokenInput(req);

    // Handle business logic
    const { refreshToken, userId } = req.body;
    const token = await handleRefreshTokenSV({refreshToken, userId});
    res.status(200).json({
      status: 'SUCCESS',
      data: token
    })

  } catch (err) {
    next(err);
  }
}

const validateLoginInput = (req) => {
  if (!req.body) {
    throw new ValidationError('Missing body input');
  }
  validator.obj.required(req.body, 'email');
  validator.obj.required(req.body, 'password');
  const { email, password } = req.body;
  validator.string.isString(email, 'email');
  validator.string.isString(password, 'password');
  validator.string.isEmail(email);
}


const validateRefreshTokenInput = (req) => {
  if (!req.body) {
    throw new ValidationError('Missing body input');
  }
  validator.obj.required(req.body, 'refreshToken');
  validator.obj.required(req.body, 'userId');
  const { refreshToken, userId } = req.body;
  validator.string.isString(refreshToken, 'refreshToken');
  validator.number.isNumber(userId, 'userId');
}