const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: "1h",
};

export default jwtConfig;
