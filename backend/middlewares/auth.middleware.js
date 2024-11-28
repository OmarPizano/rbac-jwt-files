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

export const authorizeRole = (role) => (req, res, next) => {
  if (req.accountData.role =! role) return res.sendStatus(403);
  next();
}
