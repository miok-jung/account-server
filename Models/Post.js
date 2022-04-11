const mongoose = require("mongoose");

// postSchema를 mongoose를 이용하여 만든다.
const postSchema = new mongoose.Schema(
  {
    largeCategory: String,
    smallCategory: String,
    content: String,
    price: Number,
  },
  { collection: "myPosts" }
);

const Post = mongoose.model("Post", postSchema);

module.exports = { Post }; // module로 내보내서 어디서나 Post를 사용할 수 있다.
