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
      <el-button type="primary" round @click="clickTip">{{buttonName}}</el-button>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'tip',
    props: {
      detail: String,
      tip: String,
      buttonName: {
        default: '准备作答'
      }
    },
    data () {
      return {}
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
