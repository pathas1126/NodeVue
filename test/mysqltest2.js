const util = require("util"),
  Promise = require("bluebird");

const Pool = require("../pool");

const sql1 = "update User set lastlogin=now() where uid='user1'";
const sql2 = "update User set lastlogin=now() where uid='user2'";

// pool.js는 클래스 형태이며 생성자를 갖고 있기 때문에
// new 연산자로 초기화를 해주어야 함
const pool = new Pool();

// 에러가 발생하면 트랜잭션의 begin으로 롤백을 실행함
// Promise.using(pool.connect(), conn => {
//   conn.beginTransaction(txerr => {
//     Promise.all([conn.queryAsync(sql1), conn.queryAsync(sql2)])
//       .then(r => {
//         for (let i = 0; i < r.length; i++)
//           util.log(`sql${i + 1}=`, r[i].affectedRows);
//         conn.commit();
//         pool.end();
//       })
//       .catch(e => {
//         conn.rollback();
//         pool.end();
//       });
//   });
// });

// 위의 트랜잭션 코드와 기능은 동일하지만 보다 간결해짐
// execute(conn => {
//   Promise.all([conn.queryAsync(sql1), conn.queryAsync(sql2)])
//     .then(r => {
//       for (let i = 0; i < r.length; i++)
//         util.log(`sql${i + 1}=`, r[i].affectedRows);
//       conn.commit();
//       pool.end();
//     })
//     .catch(e => {
//       conn.rollback();
//       pool.end();
//     });
// });

// 매번 트랜잭션을 생성하기 번거롭기 때문에 함수를 작성해서 사용하는 것
// function execute(fn) {
//   Promise.using(pool.connect(), conn => {
//     conn.beginTransaction(txerr => {
//       fn(conn);
//     });
//   });
// }

// Promise.using(pool.connect(), conn => {
//   // .all(): ()안의 모든 비동기 함수가 수행 된 후에 then()에서 결과를 처리함
//   // ()안의 비동기 함수들은 병렬로 연결되며, 결과는 Array배열로 반환됨
//   Promise.all([conn.queryAsync(sql1), conn.queryAsync(sql2)])
//     .then(r => {
//       util.log("End of Then!!!!!!!!!!!!!!!!!!!");
//       util.log("sql1=", r[0].affectedRows);
//       util.log("sql2=", r[1].affectedRows);
//       pool.end();
//     })
//     .catch(err => {
//       // 에러가 발생한 경우 에러 이전 코드는 실행되고 에러 이하의 코드는 실행되지 않음
//       util.log("ERRRRRRRRRRRRRRRRRRRR");
//       // 에러가 난 경우에도 확실히 pool을 종료해주는 것이 좋음
//       pool.end();
//     });
// });

// Promise.using(pool.connect(), conn => {
//   // then 은 error 처리를 .catch로 하기 때문에 매개변수에 err 사용 X
//   conn
//     // Async를 붙여야 then을 사용할 수 있음
//     .queryAsync(sql1)
//     .then(util.log)
//     // catch로 에러 처리
//     .catch(err => {
//       util.log("err>>>", err);
//     });

//   pool.end();
// });

// Promise.using(pool.connect(), conn => {
//   // then 대신 콜백 함수도 사용 가능
//   conn.queryAsync(sql1, (err, ret) => {
//     util.log("sql1: ", ret.affectedRows);
//   });

//   //   conn.queryAsync(sql2, (err2, ret2) => {
//   //     util.log("sql2: ", ret2.affectedRows);
//   //   });

//   pool.end();
// });
