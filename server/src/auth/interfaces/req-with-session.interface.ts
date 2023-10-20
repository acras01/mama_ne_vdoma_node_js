import { Request } from 'express';

interface RequestWithSession extends Request {
  user: {
    id: string;
    email: string;
  };
}

export default RequestWithSession;
