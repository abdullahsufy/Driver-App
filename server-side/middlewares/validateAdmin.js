const JWTService = require("../services/jwtService");

const validateAdmin = (req, res, next) => {
  const token = req.header("admin-token");
  if (!token) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
  try {
    const data = JWTService.verifyadminToken(token);
    req.user = data;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
};

module.exports = validateAdmin;
