<template>
  <div>
    <li>TTT : {{todo.text}}</li>
  </div>
</template>


<script>
export default {
  name: "todo-item",
  // 넘겨받을 props 지정
  props: {
    // todo props를 넘겨받을 것이다
    todo: {
      type: Object,
      required: true
    }
  }
};
</script>