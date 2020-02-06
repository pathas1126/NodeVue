// webpack-node-externals: node_modules를 패키징하지 않도록 도와주는 라이브러리
// 노드 모듈스 폴더 자체가 너무 무겁기도 하고 디펜던시에 의해 한 번에 다운로드가 가능하기 때문에
// 패키징을 하지 않는 것이 더 이로움
const nodeExternals = require("webpack-node-externals");

module.exports = {
  // 패키징을 시작할 js 파일
  entry: "./index.js",
  // 패키징을 완료하면 생성할 js 파일
  output: { filename: "./server.js" },
  target: "node",
  externals: [nodeExternals()]
};
