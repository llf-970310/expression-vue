<!--题目tip-->
<template>
  <div>
    <el-row class="d2-text-center" v-html="detail">
    </el-row>
    <br>
    <el-row class="d2-text-center" v-html="tip">
    </el-row>

    <br>

    <el-row class="d2-text-center">
      <el-button type="primary" round @click="clickTip">显示题目</el-button>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "tip",
    props: {
      detail: String,
      tip: String
    },
    data() {
      return {

      }
    },
    methods: {
      clickTip: function () {
        this.$emit('showQuestion')
      }
    }
  }
</script>

<style scoped>

</style>
