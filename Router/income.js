const express = require("express");
const dayjs = require("dayjs");
const router = express.Router();

// ANCHOR Models를 불러오기
const { Income } = require("../Models/Income");
const { Counter } = require("../Models/Counter");

// ANCHOR GET
router.get("/list", (req, res) => {
  // NOTE find() : MongoDB에서 Document를 찾는 명령어
  Income.find()
    .sort({ date: "desc" })
    .exec()
    .then((doc) => {
      res.status(200).json({ success: true, postList: doc });
    })
    .catch((err) => {
      res.status(400).json({ success: false, err });
    });
});
router.get("/all/total", (req, res) => {
  let total = 0;
  Income.find()
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
router.get("/month/total", (req, res) => {
  let total = 0;
  let startDate = dayjs().set("day", 0).format("YYYY-MM-DD");
  let endDay = dayjs().daysInMonth() - 1;
  let endDate = dayjs().set("day", endDay).format("YYYY-MM-DD");
  // gte : ~이상, lte : ~이하
  Income.find({
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
  Income.findOne({ postNum: Number(req.body.postNum) })
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
  // find함수 중괄호 안에는 조건을 넣을 수 있다.
  // 즉, name이 incomeCounter이라는 것을 Counter collection에서 찾아서 실행을 한다는 의미이다.
  Counter.findOne({ name: "incomeCounter" })
    .exec()
    .then((counter) => {
      temp.postNum = counter.postNum;
      const accountPost = new Income(temp);
      accountPost
        .save()
        .then(() => {
          // 고유한 함수를 사용하기 위해서는 Counter의 숫자는 1씩 증가해야 한다.
          // updateOne에는 두개의 인자를 받는다.
          // 첫번째 인자는 조건, 두번째 인자는 어떻게 업데이트를 할지 작성한다.
          Counter.updateOne(
            { name: "incomeCounter" },
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
  Income.updateOne({ postNum: Number(req.body.postNum) }, { $set: temp })
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
  Income.deleteOne({ postNum: Number(req.body.postNum) })
    .exec()
    .then((doc) => {
      res.status(200).json({ success: true });
    })
    .catch((err) => {
      res.status(400).json({ success: false, err });
    });
});

module.exports = router;
