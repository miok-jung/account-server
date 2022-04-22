const mongoose = require("mongoose");

// postSchema를 mongoose를 이용하여 만든다.
const incomeSchema = new mongoose.Schema(
  {
    postNum: Number,
    date: String,
    content: String,
    price: Number,
  },
  { collection: "incomes" }
);

const Income = mongoose.model("Income", incomeSchema);

module.exports = { Income }; // module로 내보내서 어디서나 Post를 사용할 수 있다.
