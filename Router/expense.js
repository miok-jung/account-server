const express = require("express");
const router = express.Router();

// ANCHOR Models를 불러오기
const { Expense } = require("../Models/Expense");
const { Counter } = require("../Models/Counter");

// ANCHOR expense
router.post("/submit", (req, res) => {
  let temp = req.body;
  Counter.findOne({ name: "expenseCounter" })
    .exec()
    .then((counter) => {
      temp.postNum = counter.postNum;
      const accountPost = new Expense(temp);
      accountPost
        .save()
        .then(() => {
          Counter.updateOne(
            { name: "expenseCounter" },
            { $inc: { postNum: 1 } }
          ).then(() => {
            res.status(200).json({ success: true });
          });
        })
        .catch((err) => {
          res.status(400).json({ success: false, err });
        });
    });
});
router.get("/list", (req, res) => {
  // NOTE find() : MongoDB에서 Document를 찾는 명령어
  Expense.find()
    .sort({ date: "desc" })
    .exec()
    .then((doc) => {
      res.status(200).json({ success: true, postList: doc });
    })
    .catch((err) => {
      res.status(400).json({ success: false, err });
    });
});
router.post("/detail", (req, res) => {
  Expense.findOne({ postNum: Number(req.body.postNum) })
    .exec()
    .then((doc) => {
      res.status(200).json({ success: true, post: doc });
    })
    .catch((err) => {
      res.status(400).json({ success: false, err });
    });
});
router.post("/edit", (req, res) => {
  let temp = {
    date: req.body.date,
    content: req.body.content,
    price: req.body.price,
  };
  Expense.updateOne({ postNum: Number(req.body.postNum) }, { $set: temp })
    .exec()
    .then((doc) => {
      res.status(200).json({ success: true });
    })
    .catch((err) => {
      res.status(400).json({ success: false, err });
    });
});
// FIXME post대신 delete로 변경할 방법 알아보기
router.post("/delete", (req, res) => {
  Expense.deleteOne({ postNum: Number(req.body.postNum) })
    .exec()
    .then((doc) => {
      res.status(200).json({ success: true, post: doc });
    })
    .catch((err) => {
      res.status(400).json({ success: false, err });
    });
});

module.exports = router;
