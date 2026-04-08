import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLES } from '../enums/user';

export type AuthJwtPayload = JwtPayload & {
  id:    string;
  email: string;
  name:  string;
  role:  USER_ROLES;
};

declare module 'express-serve-static-core' {
  interface Request {
    user: AuthJwtPayload;
  }
}

declare module 'socket.io' {
  interface Socket {
    userId?:    string;
    userName?:  string;
    userEmail?: string;
    userRole?:  string;
  }
}

export interface ISendEmail {
  to:      string;
  subject: string;
  html:    string;
}