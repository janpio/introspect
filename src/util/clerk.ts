import { auth } from '@clerk/nextjs';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { isNil } from 'lodash';

import { environment } from './environment';

export const getIsAuthenticated = async (): Promise<
  string | JwtPayload | null
> => {
  const userAuth = auth();
  const token = await userAuth.getToken();
  const splitPem = environment.CLERK_PEM_KEY.match(/.{1,64}/g);

  if (isNil(token) || isNil(splitPem)) {
    return null;
  }

  const publicKey =
    '-----BEGIN PUBLIC KEY-----\n' +
    splitPem.join('\n') +
    '\n-----END PUBLIC KEY-----';

  try {
    return jwt.verify(token, publicKey);
  } catch {
    return null;
  }
};
