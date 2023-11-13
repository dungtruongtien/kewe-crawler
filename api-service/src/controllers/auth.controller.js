import { validator } from '../utils/validator';
import { handleLoginSv, handleLogoutSv, handleRefreshTokenSv } from '../services/auth.service';
import { ValidationError } from '../common/customError';

export const handleLoginCtr = async (req, res, next) => {
  try {
    // Validate
    validateLoginInput(req);

    // Handle business logic
    const loginUser = req.body;
    const token = await handleLoginSv(loginUser);
    res.status(200).json({
      status: 'SUCCESS',
      data: token
    })

  } catch (err) {
    next(err);
  }
}

export const handleLogoutCtr = async (req, res, next) => {
  try {
    // Validate
    validateLogoutInput(req);

    // Handle business logic
    const { userId } = req.body;
    const token = await handleLogoutSv(userId);
    res.status(200).json({
      status: 'SUCCESS'
    });

  } catch (err) {
    next(err);
  }
}


export const handleRefreshTokenCtr = async (req, res, next) => {
  try {
    // Validate
    validateRefreshTokenInput(req);

    // Handle business logic
    const { refreshToken, userId } = req.body;
    const token = await handleRefreshTokenSv({ refreshToken, userId });
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


const validateLogoutInput = (req) => {
  if (!req.body) {
    throw new ValidationError('Missing body input');
  }
  validator.obj.required(req.body, 'userId');
  const { userId } = req.body;
  validator.number.isNumber(userId);
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