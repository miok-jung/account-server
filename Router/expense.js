const express = require("express");
const dayjs = require("dayjs");
const router = express.Router();

// ANCHOR Models를 불러오기
const { Expense } = require("../Models/Expense");
const { Counter } = require("../Models/Counter");

// ANCHOR GET
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
router.get("/month/total", (req, res) => {
  let total = 0;
  let startDate = dayjs().set("day", 0).format("YYYY-MM-DD");
  let endDay = dayjs().daysInMonth() - 1;
  let endDate = dayjs().set("day", endDay).format("YYYY-MM-DD");
  // gte : ~이상, lte : ~이하
  Expense.find({
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  })
    .exec()
    .then((doc) => {
      doc.map((item) => {
        total += item.price;
      });
      res.status(200).json({ success: true, total: total });
    })
    .catch((err) => {
      res.status(400).json({ success: false, err });
    });
});

// ANCHOR POST
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
