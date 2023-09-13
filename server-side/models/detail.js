const mongoose = require("mongoose");
const { Schema } = mongoose;

const detailSchema = new Schema(
  {
    data: { type: Array, required: true },
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Detail", detailSchema, "detail");
