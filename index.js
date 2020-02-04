// express 웹 서버를 가져 옴
const express = require("express"),
  // app : express 초기화
  app = express(),
  util = require("util");

const Pool = require("./pool"),
  Mydb = require("./mydb");
// test 폴더의 test.json 파일 경로를 변수에 저장
const testJson = require("./test/test.json");

// 웹 서버가 실행될 때 pool이 한 번만 생성되도록 함
const pool = new Pool();

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
  // params: 패스 변수의 인자가 저장된 객체
  testJson.email = req.params.email; // cf. req.body, req.query
  // query string: URI의 ?이하 부분 [?변수이름=값]
  testJson.aa = req.query.aa;

  // URI가 /test/aaa@ddd.com?aa=123 일 때 123이 출력됨
  res.json(testJson.aa);
});

app.get("/dbtest/:user", (req, res) => {
  let user = req.params.user;
  let mydb = new Mydb(pool);
  // mydb 모듈의 execute 함수 실행
  mydb.execute(conn => {
    conn.query("select * from User where uid=?", [user], (err, ret) => {
      res.json(ret);
    });
  });
});

// express 실행(run)
// ~ 번 포트에서 실행하도록 함
const server = app.listen(7000, function() {
  console.log("Express's started on port 7000");
});

// socket.io
// 단독으로 사용할 수도 있고 웹서버와도 같이 사용할 수 있는데
// 웹서버와 같이 사용할 때 이점(DB와 연결한다거나)이 더 많기 때문에
// 주로 아래와 같이 사용함
const io = require("socket.io").listen(server, {
  log: false,
  // URL이 달라도 채팅서버에 들어올 수 있도록 함
  origins: "*:*",

  // handshake: 서로 확인을 하는 것
  // 클라이언트와 서버가 서로의 작동 상태를 체크하는 것
  // default: interval 25초, timeout 60초
  // 한 번만 연결해두면 웹브라우저를 새로고침하거나 껏다 켜도 자동으로 다시 연결되도록 함
  pingInterval: 3000,
  pingTimeout: 5000
});

// ================ socket.io 서버측 ================

// 클라이언트가 연결되었을 때
io.sockets.on("connection", (socket, opt) => {
  // 클라이언트에 Welcome!! 메세지 전송
  socket.emit("message", { msg: "Welcome!! " + socket.id });

  // socket handshake의 query(?aaa=123) 출력
  // query string: 웹 서버에 데이터를 전달할 수 있도록 하는 값
  util.log("connection>>", socket.id, socket.handshake.query);

  // socket의 채팅방 입장(join) 처리
  socket.on("join", function(roomId, fn) {
    // 해당 소켓이 채팅방에 들어가게(join) 됨
    socket.join(roomId, () => {
      // 채팅방에 입장했을 때 방 id와 연결된 방 목록 출력, 두 개 이상의 방에 들어갈 수 있음
      util.log("Join", roomId, Object.keys(socket.rooms));
      // 클라이언트에서 콜백 함수가 전달되지 않을 수도 있기 때문에
      // 항상 fn이 있는 경우에 fn()을 호출하도록 함
      if (fn) fn();
    });
  });

  // socket의 채팅방 퇴장(leave) 처리
  socket.on("leave", function(roomId, fn) {
    // 해당 소켓이 채팅방에 들어가게(join) 됨
    socket.leave(roomId, function() {
      if (fn) fn();
    });
  });

  socket.on("rooms", function(fn) {
    if (fn) fn(Object.keys(socket.rooms));
  });

  // 클라이언트에서 메세지 전송(사용자 -> 서버)
  // data: {room: 'roomid', msg: 'msg 내용...'}
  socket.on("message", (data, fn) => {
    // Object.keys(매개변수): JSON으로부터 특정 매개변수가 있는 key 값의 value를 찾음
    // rooms: room(채팅방)에 들어와 있는 socket들의 목록을 배열로 갖고 있음
    util.log("message>>", data.msg, Object.keys(socket.rooms));
    // 채팅방 내의 나를 제외한 사람들에게 메세지 전송
    socket.broadcast
      .to(data.room)
      .emit("message", { room: data.room, msg: data.msg });
    if (fn) fn(data.msg);
  });

  // 특정 유저에게만 메세지 전송
  socket.on("message-for-one", (socketid, msg, fn) => {
    socket.to(socketid).emit("message", { msg: msg });
  });

  // 연결이 끊기고 있을 때 호출되는 함수
  socket.on("disconnecting", function(data) {
    util.log("disconnecting>>", socket.id, Object.keys(socket.rooms));
    // socket.leave(roomId);
    // 원래대로라면 연결이 끊겼을 때 방에서 사용자가 떠나게 처리해 주어야 하지만
    // socket.io가 자동으로 이를 지원해 줌
  });

  // 연결이 끊긴 뒤에 호출되는 함수
  socket.on("disconnect", function(data) {
    // disconnecting 에서는 Object.keys(socket.rooms)로 나오려는 방을 알 수 있지만
    // disconnect에서는 socket.id 값만 확인 가능
    util.log("disconnect>>", socket.id, Object.keys(socket.rooms));
  });
});
