const jwt = require("jsonwebtoken");

const { AUTH_TOKEN_SECRET } = require("../config/index");

class JWTService {
  // sign access token

  static signaccessToken(payload, expiryTime) {
    return jwt.sign(payload, AUTH_TOKEN_SECRET, { expiresIn: expiryTime });
  }

  // verify access token
  static verifyaccessToken(token) {
    return jwt.verify(token, AUTH_TOKEN_SECRET);
  }
}
module.exports = JWTService;
