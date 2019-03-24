<!--TODO 我的信息-->
<template>
  <d2-container :filename="filename">
    <template slot="header">我的信息</template>
    我的信息 TODO
  </d2-container>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        filename: __filename
      }
    }
  }
</script>

<style scoped>

</style>