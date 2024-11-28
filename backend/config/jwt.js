const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRATION_TIME_SECONDS,
};

export default jwtConfig;
