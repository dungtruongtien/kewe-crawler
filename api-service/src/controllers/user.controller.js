import { validator } from '../utils/validator';
import { handleRegisterSV } from '../services/user.service';

export const handleRegisterCtr = async (req, res, next) => {
  res.json({ msg: 'done' })
  return;
  try {
    // Validate
    validateRegisterInput(req);

    // Handle business logic
    const registerInput = req.body;
    const user = await handleRegisterSV(registerInput);
    res.status(201).json({
      data: 'Register successfully',
      status: 'SUCCESS',
      data: user
    })

  } catch (err) {
    next(err);
  }
}

const validateRegisterInput = (req) => {
  if (!req.body) {
    throw new Error('Missing body input');
  }
  validator.obj.required(req.body, 'email');
  validator.obj.required(req.body, 'password');
  const { email, password, fullName } = req.body;
  validator.string.isString(email, 'email');
  validator.string.isString(password, 'password');
  validator.string.isString(fullName, 'fullName');
  validator.string.isEmail(email);
}