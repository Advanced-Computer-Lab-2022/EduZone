import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
export const JWTAccessDecoder: RequestHandler = async (req, res, next) => {
  try {
    const bearerHeader = req.headers.authorization as string;
    const token = bearerHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
    req.body.token = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: 'Auth failed' });
  }
};

export const JWTRefreshDecoder: RequestHandler = async (req, res, next) => {
  try {
    const bearerHeader = req.headers.authorization as string;
    const token = bearerHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
    req.body.refreshToken = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Refreshing token failed' });
  }
};
