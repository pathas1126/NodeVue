// node.js 의 기본 모듈 중 하나, 파일 관련 기능
const fs = require("fs");
// node.js 에서 많이 사용되는 모듈 중 하나
const util = require("util");

console.log("aaaaaaa");
// log를 node를 실행한 시간과 함께 찍어줌, __dirname: 폴더 경로/이름 출력
util.log("aaaaaaa", __dirname);

// ====== 비동기 =======
// 비동기 함수의 작업이 끝나지 않아도 계속해서 다음 코드들이 실행됨
// 비동기 함수의 작업이 끝나면, 그 때서야 값을 반환함

// 파일을 비동기로 읽어오는 함수 fs.readFile("파일명", "인코딩", (error, date)=>{})
// 파일 이름 작성: node가 실행되고 있는 폴더를 기준으로 상대경로로 작성
fs.readFile(__dirname + "/test.json", "utf-8", (err, data) => {
  if (err) return console.error(err);

  util.log("data>>", data);
});

util.log("------------------------");
// 파일 경로 변수
const msgfile = __dirname + "/message.txt";

// 파일을 작성하는 함수
// fs.writeFile(("파일명", data[작성할 내용], err) =>{});
fs.writeFileSync(msgfile, "Hello, Node.js! 세종대왕", err => {
  if (err) throw err;
  console.log("The file has been saved!");
});

// ====== 동기 ======
// 동기 함수의 작업이 끝나지 않으면 다음 코드들은 실행되지 않음
// 동기 함수를 너무 많이 사용하면 node.js의 장점이 사라짐
let data2 = fs.readFileSync(msgfile, "utf-8");
util.log("data2>>", data2);

util.log("===================================");

// 이 예제에서 동기 함수들은 모두 순차적으로 실행되지만, 비동기 함수의 결과가 가장 마지막에 출력됨
