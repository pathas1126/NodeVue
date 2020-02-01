// mysql 모듈을 불러옴
const mysql = require("mysql");

// mysql과 연결하기 위해 객체를 생성해서 mysql db의 데이터로 초기화함
const connection = mysql.createConnection({
  host: "115.71.233.22",
  user: "testuser",
  password: "testuser!@#",
  database: "testdb"
});

// mysql과 실제로 연결하는 함수 호출
connection.connect();

// mysql의 begin 구문을 실행함(트랜잭션 구분점을 생성)
// 트랜잭션: 일련의 논리적 작업 단위, begin~commit을 하나의 트랜잭션이라고 할 수 있음
connection.beginTransaction(err2 => {
  // mysql에 query(질의)를 던지는 함수
  // query("SQL 구문", "SQL구문의 ?에 들어갈 인자, 배열 or 스트링이면 자동으로 인식", 콜백)
  // mysql과 연결되지 않으면 실행되지 않음
  connection.query(
    "UPDATE User set lastlogin=now() where uid=?",
    ["user2"],
    function(err, results, fields) {
      // results : 쿼리로 얻어온 로우(객체 형태)들이 배열에 담긴 상태로 반환됨
      if (err) throw err;
      // throw: 에러를 발생시키는 구문, 에러 객체를 throw 하면 콘솔 창에 에러가 출력됨
      // try/catch/finally: 예외를 처리할 때 사용하는 구문
      console.log("The Update", results.affectedRows);

      // .query()는 둘 이상일 때 각각의 프로세스로 처리됨, 즉 따로따로 실행되며
      // 아래에 작성한 것이 먼저 실행될 수도 있음
      // 따라서 다음에 처리하고자 하는 query()를 앞의 query()의 콜백 함수 안에 넣어줌
      connection.query("SELECT * FROM User where uid=?", ["user2"], function(
        err,
        results,
        fields
      ) {
        if (err) throw err;
        console.log("The First User is:", results[0]);
      });
      // mysql 프로세스 종료
      // .end()를 작성하지 않으면 프로세스가 계속 진행됨
      connection.end();
    }
  );
});

// connection은 connect() -> query() -> end() 순서로 실행 큐에 담기는데
// query() 내부의 query()는 큐에 담기지 못함
// 즉, end()가 실행된 이후에 내부 query()가 실행되기 때문에 에러 발생
// 따라서 query() 내부의 마지막에 end()를 작성해야 함

// ======= 콜백 지옥 =======
// 위에서처럼 콜백 함수에 콜백 함수를 계속해서 넣어주는 것을 말함
// 블루버드 모듈, promise 로 처리해야 함
