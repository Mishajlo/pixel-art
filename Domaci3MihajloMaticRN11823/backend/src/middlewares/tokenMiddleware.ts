import { Request, Response, NextFunction } from 'express'
import { verifyToken } from './jwtutils'
import jwt, { Jwt } from 'jsonwebtoken'

interface TokenPayLoad {
  user_id: string
  username: string
}

export const tokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  const authHeader = req.headers.authorization;
    if(!authHeader){

        res.status(401).json({
          failed: true,
          code: "NOT_AUTHENTICATED",
      });
          return
      }

  const token = req.headers.authorization?.split(" ")[1]

  if (!token) {
    res.status(401).json({
      failed: true,
      code: "NOT_AUTHENTICATED",
  });
      return
  }

  try {

    const decoded = jwt.verify(token, "secret"); // Verifikujemo token

    // Proveravamo da li decoded ima očekivanu strukturu
    if (
      typeof decoded === "string" ||
      !("user_id" in decoded && "username" in decoded)
    ) {
      res.status(401).json({
        failed: true,
        code: "NOT_AUTHENTICATED",
    });
        return
    }
    console.log("PREZIVEOOOO")
    // Koristimo cast za TokenPayload
    req.user = decoded as TokenPayLoad;
    next()
  } catch (greska) {
    res.status(401).json({
      failed: true,
      code: "NOT_AUTHENTICATED",
  });
      return
  }
}
