const express = require("express"); // NOTE express 불러오기
const path = require("path"); // NOTE path 불러오기 : 현재경로와 상대경로를 결합해주는 라이브러리인데 현재는 node에 내장된 함수로 되어 설치없이 사용가능하다.
const mongoose = require("mongoose"); // mongoose 라이브러리 불러오기

const app = express(); // NOTE app이라는 변수에 express 객체를 할당
const port = 5000;
const config = require("./config/key");

// NOTE express.static(root, [options]);
// NOTE
app.use(express.static(path.join(__dirname, "../client/build/index.html")));

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
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});
