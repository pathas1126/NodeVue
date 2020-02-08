<template>
  <div id="app">
    <h1>
      {{ test }} :: <span v-if="isVisible">{{ visit }}</span>
    </h1>
    <h2>{{ testVisit }}</h2>
    <!-- v-model: input의 데이터와 {{test}}의 데이터를 연결함 -->
    <!-- v-on:[이벤트 종류] => 이벤트를 연결함
        vue3부터는 @:[이벤트 종류]로 연결 가능 -->
    <input type="text" @keyup="visit++" v-model="test" />
    <button @click="visitCount()">Visit Count</button>

    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// HelloWorld 컴포넌트를 불러옴
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "app",
  // 컴포넌트 목록에 Helloworld 등록
  components: {
    HelloWorld
  },
  // 컴포넌트에 전달될 때는 data(){} 함수 형식 사용
  data() {
    return {
      test: "홍길동",
      visit: 0,
      isVisible: false
    };
  },
  // 이벤트 함수를 전달
  methods: {
    visitCount() {
      this.visit++;
      this.isVisible = true;
    }
  },
  // 변수들을 계속 감시함
  computed: {
    testVisit() {
      return "Hi~" + this.test + "You are" + this.visit + "Times Visited";
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
