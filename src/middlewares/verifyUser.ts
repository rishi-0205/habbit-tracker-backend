import jwt, { JwtPayload as JwtPayloadBase, VerifyErrors } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface JwtPayload extends JwtPayloadBase {
  id: string;
}

export interface CustomRequest extends Request {
  user?: JwtPayload;
}

export const verifyToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(new Error("Unauthorized"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (typeof decoded === "object" && decoded !== null) {
      req.user = decoded as JwtPayload;
      next();
    } else {
      next(new Error("Unauthorized - Invalid token format"));
    }
  } catch (err) {
    next(err instanceof Error ? err : new Error("Unknown Error"));
  }
};
