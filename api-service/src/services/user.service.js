import bcrypt from 'bcrypt';
import User from '../models/user.model';
import { BusinessError } from '../common/customError';

export const handleRegisterSv = async ({ email, password, fullName }) => {
  const existsEmail = await User.findOne({ where: { email } });
  if (existsEmail) {
    throw new BusinessError('This email was registerd', 'RegisterdEmail');
  }

  var salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  const userInput = {
    email,
    fullName,
    password: hashedPassword
  };
  const user = await User.create(userInput);
  return user;
}


export const handleMeSv = async (userId) => {
  const userData = await User.findOne({ 
    where: { id: userId } ,
    attributes: ['email', 'fullName', 'name', 'id']
  });
  if (!userData) {
    throw new BusinessError('User not existed', 'UserNotFound');
  }

  return userData;
}
