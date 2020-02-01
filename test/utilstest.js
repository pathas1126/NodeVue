// node.js 기본 모듈
const util = require("util");
// utils.js에서 만든 모듈
const utils = require("../utils");

let map = utils.makeMap("name", "hong");
util.log("map>>>>>>>", map.get("name"));

return;

let str = "NodeJS";

// 양방향 암호화, 매번 다르게 암호화가 됨
let enc = utils.encrypt(str);
// data O, key X
util.log("enc: ", enc);
// data O, key O
util.log("enc: ", utils.encrypt(str, "aaa"));

// 암호 해석, 16진수로 나옴 => 인코딩을 해주어야 함
let dec = utils.decrypt(enc);
util.log("dec: " + dec);

// 단방향 암호화, 양방향 암호화보다 조금 더 길게 출력됨
let encSha2 = utils.encryptSha2(str);
util.log("encSha2: " + encSha2);

return;

let url = "https://naver.com";

// naver.com 사이트의 og 정보들을 콘솔에 출력
utils.ogsinfo(url, (err, ret) => {
  util.log(ret);
});
