import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwt.js";

export const auth = (requiredRole) => (req, res, next) => {
  // 1. authentication
  // extract auth header
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) return res.sendStatus(401);

  // extract token from header
  const token = authHeader.split(" ")[1];

  try {
    // extract jwt decoded payload
    const payload = jwt.verify(token, jwtConfig.secret);

    // malformed token
    if (!payload.id || !payload.username || !payload.role_id) return res.sendStatus(400);
  
    // 2. authorization
    const roles = { "admin": 1, "user": 2 };
    if (payload.role_id !== roles[requiredRole] ) return res.sendStatus(403);

    // insert accountData for further frontend processing
    req.accountData = payload;

    next();

  } catch (error) {
    return res.sendStatus(403);
  }
}
