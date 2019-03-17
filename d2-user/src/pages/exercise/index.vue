<template>
  <d2-container :filename="filename">
    <!--<template slot="header">做题r</template>-->
    欢迎来到做题界面
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