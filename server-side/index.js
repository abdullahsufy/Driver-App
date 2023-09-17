const express = require("express");
const { PORT } = require("./config");
const dbConnect = require("./database/index");
const router = require("./routes");
const ErrorHandler = require("./middlewares/ErrorHandler");
const app = express();
const cors = require("cors");

const corsOption = {
  origin: ["http://localhost:3000"],
  credentials: true,
};

app.use(express.json({ limit: "50mb" }));

app.use(cors(corsOption));

dbConnect();

app.use(router);

app.use(ErrorHandler);

app.listen(PORT, () => {
  console.log(`Backend is running on port : ${PORT}`);
});
