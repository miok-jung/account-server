const mongoose = require("mongoose");

const transferSchema = new mongoose.Schema(
  {
    postNum: Number,
    date: String,
    content: String,
    price: Number,
  },
  { collection: "transfers" }
);

const Transfer = mongoose.model("Transfer", transferSchema);

module.exports = { Transfer };
