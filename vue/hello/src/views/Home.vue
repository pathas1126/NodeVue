<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />

    <span v-once>메세지: {{msg}}</span>
    <input type="text" v-model="msg" />
    <span v-html="msg"></span>
    <span class="red">{{reversedMessage}}</span>
    <button
      :disabled="isButtonDisabled"
      @click.prevent="isButtonDisabled = !isButtonDisabled"
    >disabledButton</button>

    <a href="#" @click.prevent="aaa()">
      aaaaa
      <span @click.stop="bbb()">bbbbb</span>
    </a>

    <TodoItem v-for="todo in todos" :todo="todo" :key="todo.id"></TodoItem>

    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import TodoItem from "@/components/todo-item";

export default {
  name: "home",
  components: {
    HelloWorld,
    TodoItem
  },
  // Computed Property
  computed: {
    // 변수처럼 사용, 함수처럼 호출 X
    reversedMessage: function() {
      return this.msg
        .split("")
        .reverse()
        .join("");
    }
  },
  methods: {
    aaa() {
      alert("aaaaa");
    },
    bbb() {
      alert("bbbbb");
    }
  },
  data() {
    return {
      msg: "abcdd",
      isButtonDisabled: false,
      todos: [
        { id: 0, text: "JS 배우기" },
        { id: 1, text: "Vue 배우기" },
        { id: 2, text: "멋진 것 만들기" }
      ]
    };
  }
};
</script>

<style >
.red {
  color: red;
}
</style>
