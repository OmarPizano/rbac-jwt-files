import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwt.js";

// authentication
export const authenticateToken = (req, res, next) => {
  // extract auth header
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) return res.sendStatus(401);

  // extract token from header
  const token = authHeader.split(" ")[1];
  
  jwt.verify(token, jwtConfig.secret, (err, decodedPayload) => {
    // invalid or expired token
    if (err) return res.sendStatus(403);
    // malformed token
    if (!decodedPayload.id || !decodedPayload.username || !decodedPayload.role_id) return res.sendStatus(400);
    // if everything OK, insert accountData
    req.accountData = decodedPayload;
    next();
  });
};

// authorization
// this middleware always executes after authentication middleware
export const authorizeRole = (role) => (req, res, next) => {
  const roles = { "admin": 1, "user": 2 };
  if (req.accountData.role_id !== roles[role] ) return res.sendStatus(403);
  next();
}
