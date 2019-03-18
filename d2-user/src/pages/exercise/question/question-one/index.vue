<!--【题型一】朗读-->
<template>
  <div>
    <read :text="text"></read>
    <count-down :time-to-count="timeToCount"></count-down>

    <el-row class="finish_read">
      <el-col class="d2-text-center">
        <el-button type="danger" @click="finishRead">结束回答</el-button>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import read from '../components/read'
  import MyCountDown from '../components/count-down'

  export default {
    name: "question-one",
    components: {
      read,
      'count-down': MyCountDown
    },
    props: {
      text: String
    },
    mounted() {
      console.log(this.text)
    },
    data() {
      const readTimeLimitConst = 60 * 1000

      return {
        timeToCount: readTimeLimitConst
      }
    },
    methods: {
      finishRead() {
        this.$emit('next')
      }
    }
  }
</script>

<style scoped>
  .finish_read {
    margin-top: 15px;
  }
</style>