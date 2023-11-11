import bcrypt from 'bcrypt';
import User from '../models/user.model';
import { BusinessError } from '../common/customError';

export const handleRegisterSV = async ({ email, password, fullName }) => {
  const existsEmail = await User.findOne({ where: { email } });
  if (existsEmail) {
    throw new BusinessError('This email was registerd', 'RegisterdEmail');
  }

  var salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  console.log('hashedPassword-----', hashedPassword);
  const userInput = {
    email,
    fullName,
    password: hashedPassword
  };
  const user = await User.create(userInput);
  return user;
}
