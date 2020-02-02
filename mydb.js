const Promise = require("bluebird");

// 매번 트랜잭션을 생성하기 번거롭기 때문에 모듈 작성 후 exports

// function 자체를 exports 하는 법
// module.exports = execute;

// class형 모듈 exports(함수형 및 json형으로도 exports 가능)
module.exports = class {
  constructor(pool) {
    this.pool = pool;
  }
  // 트랜잭션이 필요하지 않은 경우, select문
  execute(fn) {
    Promise.using(this.pool.connect(), conn => {
      fn(conn);
    });
  }

  // 트랜잭션을 생성해야 하는 경우 사용, update, delete문
  executeTx(fn) {
    Promise.using(this.pool.connect(), conn => {
      conn.beginTransaction(txerr => {
        fn(conn);
      });
    });
  }
};
