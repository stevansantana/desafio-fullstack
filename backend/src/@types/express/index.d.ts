declare namespace Express {
  export interface Request {
    user?: {
      preferred_username: string;
    };
  }
}
