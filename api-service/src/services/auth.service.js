import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.model';
import Auth from '../models/auth.model';
import { AuthenticationError, BusinessError, NotfoundError } from '../common/customError';
import { AUTH_ACCESS_SERCRET_KEY, AUTH_REFRESH_SERCRET_KEY } from '../common/constant';

export const handleLoginSV = async ({ email, password }) => {
  const existsUser = await User.findOne({ where: { email } });
  if (!existsUser) {
    throw new NotfoundError('User not existed', 'UserNotFound');
  }

  const isEqual = bcrypt.compareSync(password, existsUser.password);
  if (!isEqual) {
    throw new BusinessError('Username or password is wrong', 'AuthenticationFailed');
  }

  const accessToken = jwt.sign({ userId: existsUser.id, email, type: 'access' }, AUTH_ACCESS_SERCRET_KEY, { expiresIn: '30s' });
  const refreshToken = jwt.sign({ userId: existsUser.id, type: 'refresh' }, AUTH_REFRESH_SERCRET_KEY, { expiresIn: '60s' });

  await Auth.destroy({ where: { userId: existsUser.id } });

  await Auth.create({
    userId: existsUser.id,
    refreshToken
  });

  return { accessToken, refreshToken }
}


export const handleRefreshTokenSV = async ({ refreshToken, userId }) => {
  return jwt.verify(refreshToken, AUTH_REFRESH_SERCRET_KEY, async (error, decoded) => {
    
    if (error) {
      if (error.name === 'TokenExpiredError') {
        await Auth.destroy({ where: { userId } });
        throw new BusinessError('Token is expired', 'TokenExpiredError');
      }
      
      throw new BusinessError('Invalid token')
    }
    
    if (!decoded.userId) {
      throw new BusinessError('Invalid token');
    }

    const existedRefreshToken = await Auth.findOne({ where: { userId: decoded.userId } });
    if (!existedRefreshToken) {
      throw new BusinessError('Invalid token');
    }

    if (existedRefreshToken.refreshToken !== refreshToken) {
      throw new BusinessError('Invalid token');
    }

    const existsUser = await User.findOne({ where: { id: decoded.userId } });
    if (!existsUser) {
      throw new NotfoundError('User not existed', 'UserNotFound');
    }

    const accessToken = jwt.sign({ userId: decoded.userId, email: existsUser.email, type: 'access' }, AUTH_ACCESS_SERCRET_KEY, { expiresIn: '10s' });

    return accessToken;
  });
}
