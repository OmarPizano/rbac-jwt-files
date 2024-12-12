import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwt.js";

const roles = { "admin": 1, "user": 2 };

/**
 * Usage: auth("admin"), auth("admin", "user")
 */
export const auth = (...allowedRoles) => (req, res, next) => {
  // 1. AUTHENTICATION
  // check auth header
  const authHeader = req.headers["authorization"];
  // if there is no auth header returns Unauthorized
  if (!authHeader || !authHeader.startsWith("Bearer ")) return res.status(401).json({ message: "missing authorization token" });

  // extract token from header
  const token = authHeader.split(" ")[1];

  try {
    // authenticate token and extract its payload
    const payload = jwt.verify(token, jwtConfig.secret);

    // if the payload does not contain what is expected, returns Bad Request
    if (!payload.id || !payload.username || !payload.role_id) return res.status(400).json({ message: "unexpected token content" });

    // insert accountData for further frontend processing
    // NOTE: accountData is created BEFORE the authorization check because every response triggers the request logger and, in this case, we need the accountData.id to log it to the DB
    req.accountData = payload;

    // 2. AUTHORIZATION
    // check if authenticated user have one of the allowed roles
    const roleFound = allowedRoles.filter((role) => roles[role] == payload.role_id);
    // if there is no matching role returns Forbidden
    if (roleFound.length == 0) return res.status(403).json({ message: "access denied to requested resource" });

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "expired or invalid token" });
    }

    // other error
    console.log(`ERROR: (auth middleware) ${req.method} ${req.originalUrl}: ${error}`);
    res.status(500).json({ message: "internal server errror" }); 
  }
}
