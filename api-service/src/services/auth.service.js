import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { addSeconds } from 'date-fns';
import User from '../models/user.model';
import Auth from '../models/auth.model';
import { AuthenticationError, BusinessError, NotfoundError } from '../common/customError';
import { ACCESS_TOKEN_EXPIRY_ON_SECOND, AUTH_ACCESS_SERCRET_KEY, AUTH_REFRESH_SERCRET_KEY, REFRESH_TOKEN_EXPIRY_ON_SECOND } from '../common/constant';

export const handleLoginSV = async ({ email, password }) => {
  const existsUser = await User.findOne({ where: { email } });
  if (!existsUser) {
    throw new NotfoundError('User not existed', 'UserNotFound');
  }

  const isEqual = bcrypt.compareSync(password, existsUser.password);
  if (!isEqual) {
    throw new BusinessError('Username or password is wrong', 'AuthenticationFailed');
  }

  const accessTokenExpiryIn = addSeconds(new Date(), ACCESS_TOKEN_EXPIRY_ON_SECOND).getTime();
  const refreshTokenExpiryIn = addSeconds(new Date(), REFRESH_TOKEN_EXPIRY_ON_SECOND).getTime();

  const accessToken = jwt.sign({ userId: existsUser.id, email, type: 'access' }, AUTH_ACCESS_SERCRET_KEY, { expiresIn: accessTokenExpiryIn });
  const refreshToken = jwt.sign({ userId: existsUser.id, type: 'refresh' }, AUTH_REFRESH_SERCRET_KEY, { expiresIn: refreshTokenExpiryIn });

  await Auth.destroy({ where: { userId: existsUser.id } });

  await Auth.upsert(
    {
      userId: existsUser.id,
    },
    { refreshToken }
  );

  return { userId: existsUser.id, accessToken, accessTokenExpiryIn, refreshToken, refreshTokenExpiryIn }
}

export const handleLogoutSV = async (userId) => {
  return Auth.destroy({ where: { id: userId } });
}


export const handleRefreshTokenSV = async ({ refreshToken, userId }) => {
  return jwt.verify(refreshToken, AUTH_REFRESH_SERCRET_KEY, async (error, decoded) => {

    if (error) {
      if (error.name === 'TokenExpiredError') {
        await Auth.destroy({ where: { userId } });
        throw new AuthenticationError('Token is expired', 'TokenExpiredError');
      }

      throw new AuthenticationError('Invalid token')
    }

    if (!decoded.userId) {
      throw new AuthenticationError('Invalid token');
    }

    const existedRefreshToken = await Auth.findOne({ where: { userId: decoded.userId } });
    if (!existedRefreshToken) {
      throw new AuthenticationError('Invalid token');
    }

    if (existedRefreshToken.refreshToken !== refreshToken) {
      throw new AuthenticationError('Invalid token');
    }

    const existsUser = await User.findOne({ where: { id: decoded.userId } });
    if (!existsUser) {
      throw new NotfoundError('User not existed', 'UserNotFound');
    }

    const accessToken = jwt.sign({ userId: decoded.userId, email: existsUser.email, type: 'access' }, AUTH_ACCESS_SERCRET_KEY, { expiresIn: '10s' });

    return accessToken;
  });
}
