const dotenv = require("dotenv").config();

const PORT = process.env.PORT;
const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;
const AUTH_TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET;
const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET;
const BACKEND_SERVER_PATH = process.env.BACKEND_SERVER_PATH;

module.exports = {
  PORT,
  MONGODB_CONNECTION_STRING,
  AUTH_TOKEN_SECRET,
  ADMIN_TOKEN_SECRET,
  BACKEND_SERVER_PATH,
};
