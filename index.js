const express = require("express"); // NOTE express 불러오기
const path = require("path"); // NOTE path 불러오기 : 현재경로와 상대경로를 결합해주는 라이브러리인데 현재는 node에 내장된 함수로 되어 설치없이 사용가능하다.
const mongoose = require("mongoose"); // mongoose 라이브러리 불러오기

const app = express(); // NOTE app이라는 변수에 express 객체를 할당
const port = 5000;
const config = require("./config/key");

// ANCHOR Middleware
// NOTE express.static(root, [options]);
app.use(express.static(path.join(__dirname, "../client/build/index.html")));
// NOTE client에서 body로 오는 object를 읽을 수 있도록 하기 위해 body-parser를 사용한다.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ANCHOR Models를 불러오기
const { Expense } = require("./Models/Expense");
const { Income } = require("./Models/Income");

app.listen(port, () => {
  mongoose
    .connect(config.mongoURI)
    .then(() => {
      console.log(`Example app listening on port ${port}`);
      console.log("Connecting MongoDB");
    })
    .catch((err) => {
      console.log(`${err}`);
    });
});

// ANCHOR 라우팅
// NOTE app.METHOD(PATH, HANDLER)
// NOTE app : express의 인스턴스
// NOTE METHOD : HTTP 요청 메소드
// NOTE PATH : 서버에서의 경로
// NOTE HANDLER : 라우트가 일치할 때 실행되는 함수
app.get("/", (req, res) => {
  // NOTE res.sendFile(path, [, options] [, fn])
  // NOTE path.join(); -> 두개의 경로를 결합해주는 기능
  // NOTE __dirname : 노드에서 제공, 파일명을 제외한 절대 경로(__filename : 파일명을 포함한 절대경로)
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

app.get("*", (req, res) => {
  // * : 어느 IP로 들어오든 build/index.html을 실행시켜주겠다라는 스크립트적 의미를 가진다.
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// ANCHOR income
app.post("/api/income/submit", (req, res) => {
  let temp = req.body;
  const accountPost = new Income(temp);
  accountPost
    .save()
    .then(() => {
      res.status(200).json({ success: true });
    })
    .catch((err) => {
      res.status(400).json({ success: false, err });
    });
});

app.post("/api/income/list", (req, res) => {
  // NOTE find() : MongoDB에서 Document를 찾는 명령어
  Income.find()
    .exec()
    .then((doc) => {
      res.status(200).json({ success: true, postList: doc });
    })
    .catch((err) => {
      res.status(400).json({ success: false, err });
    });
});

// ANCHOR expense
app.post("/api/expense/submit", (req, res) => {
  let temp = req.body;
  const accountPost = new Expense(temp);
  accountPost
    .save()
    .then(() => {
      res.status(200).json({ success: true });
    })
    .catch((err) => {
      res.status(400).json({ success: false, err });
    });
});

app.post("/api/expense/list", (req, res) => {
  // NOTE find() : MongoDB에서 Document를 찾는 명령어
  Expense.find()
    .exec()
    .then((doc) => {
      res.status(200).json({ success: true, postList: doc });
    })
    .catch((err) => {
      res.status(400).json({ success: false, err });
    });
});
