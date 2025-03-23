import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import JWT_SECRET from "@repo/be-common/auth"

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}


const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1]
    if (!token) {
      res.status(403).json({ message: "Access denied. No token provided." })
      return
    }
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload

    req.userId = decoded.id
    // console.log(decoded.id)

    next()
  } catch (err) {
    res.status(401).json({ message: "Unauthorized. Invalid token." })
    return
  }
}

export default authenticateToken
