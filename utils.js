// new로 만들어야하는 모듈은 대문자 카멜케이스로 작성, 다른 것들은 소문자
const ogs = require("open-graph-scraper"),
  // 모든 유형의 키를 허용하는 키 / 값 쌍을 저장하는 모듈
  // 일반 객체와 달리 키가 문자열화 되지 않음
  HashMap = require("hashmap"),
  Crypto = require("crypto-js"),
  // 단방향 암호화(디코딩 불가 암호) 서브 라이브러리, crypto-js에 포함되어 있음
  SHA256 = "crypro-js/sha256";

// 암호화할때 key를 모르면 절대 복구할 수 없게 만듬, 보안을 잘 해야함
// key 값에 따라 암호화가 다르게 됨
const Ekey = "nodevue";

// {} 안의 모듈을 json형태로 exports함, class 형으로도 작성 가능
// 쓰레드 간 영향을 받으면 안 되는 경우에 class 사용
module.exports = {
  makeMap(key, value) {
    const map = new HashMap();
    map.set(key, value);
    console.log("TTT>>", map.get(key));
    return map;
  },
  // 단방향 암호화, sha1은 보안이 다소 허술하기 때문에 sha2 사용
  // 모듈을 만들 때는 항상 data값이 없을 때의 경우와 예외(에러) 처리를 해주어야 함
  encryptSha2(data, key) {
    if (!data) return null;
    key = key || Ekey;

    try {
      return Crypto.SHA256(data + key).toString();
    } catch (err) {
      console.log("Error on encryptSha2::", err);
    }
  },

  // 양방향 암호화(복구가 될 수 있는 암호) 모듈
  encrypt(data, key) {
    // 양방향 암호화, 깨지는 경우도 있기 때문에 16진수로 바꾸어야함
    return Crypto.AES.encrypt(data, key || Ekey).toString();
  },

  // 암호 해석 모듈
  decrypt(data, key) {
    // Crypto 에서 사용하는 인코딩 양식에 따라 작성
    return Crypto.AES.decrypt(data, key || Ekey).toString(Crypto.enc.Utf8);
  },

  // url에 들어가서 og 정보를 가져옴
  ogsinfo(url, fn) {
    return ogs({ url: url }, (err, ret) => {
      fn(err, ret);
    });
  }
};
