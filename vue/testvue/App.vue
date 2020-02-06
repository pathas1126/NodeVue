<template>
  <h1>hello! {{name}}</h1>
</template>

<script>
// CommonJS 방식 Node.js: module.exports
// AMD 방식 Vue: export default
export default {
  data() {
    return {
      name: "hong"
    };
  }
};
</script>