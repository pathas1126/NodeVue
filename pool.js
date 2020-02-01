// DB의 connection pool 관리
const mysql = require("mysql"),
  util = require("util"),
  Promise = require("bluebird");

// mysql에서 promise, then을 사용할 수 있도록 강제로 만듦
Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

// DB 정보 객체
const DB_INFO = {
  host: "115.71.233.22",
  user: "testuser",
  password: "testuser!@#",
  database: "testdb",
  multipleStatements: true,
  // 커넥션 수 제한: 5개, 기본값은 2개이며 모자랄 때마다 생성하는 구조
  connectionLimit: 5,
  // 커넥션 반환을 기다리지 말고 새로 생성
  waitForConnections: false
};
// 커넥션 풀 장점: 커넥션을 풀에 저장하고 있다가 사용자가 사용한 뒤 다시 반환함
// 즉, 매번 커넥션을 생성할 때마다 생기는 0.5초씩의 시간을 단축할 수 있게됨

module.exports = class {
  // 생성자, new연산자 사용시 호출
  constructor(dbinfo) {
    dbinfo = dbinfo || DB_INFO;
    // dbinfo로  전달된 객체를 이용해서 pool 생성
    this.pool = mysql.createPool(dbinfo);
  }

  connect() {
    // this.pool.getConnectionAsync() : 커넥션을 하나 꺼내옴
    // 커넥션을 사용하는 프로세스가 종료되면 disposer() 실행
    return this.pool.getConnectionAsync().disposer(conn => {
      // 커넥션을 재사용해야하기 때문에 release 즉, 쉬게 만들어 줌
      return conn.release();
    });
  }

  // 메모리에 있는 풀을 해제하는 것
  // 해제하지 않으면 메모리에 5개의 커넥션이 계속 이어져 있음
  // 안 해줘도 메인 프로세스가 끝나면 자동 종료되기는 함
  end() {
    this.pool.end(function(err) {
      util.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> End of Pool!!");
      if (err) util.log("ERR pool ending!!");
    });
  }
};
