import session from 'express-session';

declare module 'express-session' {
  export interface SessionData {
    passport: { user: { id: string; email: string } };
  }
}
