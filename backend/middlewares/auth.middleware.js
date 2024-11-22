import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwt.js";

export const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, jwtConfig.secret, (err, decodedPayload) => {
    if (err) return res.sendStatus(403);
    req.accountData = decodedPayload;
    next();
  });
};

export const authorizeRole = (role) => (req, res, next) => {
  if (req.accountData.role =! role) return res.sendStatus(403);
  next();
}
