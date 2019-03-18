<!--题目管理界面-->
<template>
  <d2-container :filename="filename">
    <template slot="header">题目管理</template>
    题目管理 TODO
  </d2-container>
</template>

<script>
  export default {
    name: "index",
    data () {
      return {
        filename: __filename
      }
    }
  }
</script>

<style scoped>

</style>