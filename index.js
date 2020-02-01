// express 웹 서버를 가져 옴
const express = require("express");
// app : express 초기화
const app = express(),
  // test 폴더의 test.json 파일 경로를 변수에 저장
  testJson = require("./test/test.json");

// ====== static 설정 ======
// public 폴더를 static 폴더로 지정함
app.use(express.static("public"));

// ====== view 설정 ======
// views 풀더를 view 폴더로 지정
app.set("views", __dirname + "/views");
// view 엔진으로 ejs로 쓰겠다고 신고함
app.set("view engine", "ejs");
// html 형식으로 ejs를 쓰겠다는 코드
app.engine("html", require("ejs").renderFile);

// root(/): 도메인 뒤에 아무런 내용도 없는 기본 페이지
// get 메소드: req(요청)를 url로 전달, res: 요청 결과를 클라이언트에 전달
app.get("/", (req, res) => {
  // res.json(testJson); // 응답으로 json파일 전달
  // res.send("Hello NodeJS!!"); , 응답 결과로 문자열 전달
  // index.ejs 파일을 화면에 렌더링 할 것이고, name의 값으로는 "홍길동"을 전달
  res.render("index", { name: "홍길동" });
});

// ":" Path Variable : URI에서 변수 값을 가져오는 것
app.get("/test/:email", (req, res) => {
  console.log(req.params);
  console.log(typeof req.params);
  // params: 패스 변수의 인자가 저장된 객체
  testJson.email = req.params.email; // cf. req.body, req.query
  // query string: URI의 ?이하 부분 [?변수이름=값]
  testJson.aa = req.query.aa;
  console.group(testJson.aa);
  // URI가 /test/aaa@ddd.com?aa=123 일 때 123이 출력됨
  res.json(testJson);
});

// express 실행(run)
// ~ 번 포트에서 실행하도록 함
const server = app.listen(7000, function() {
  console.log("Express's started on port 7000");
});
