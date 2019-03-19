<!--回答题目-->
<template>
  <div>

    <div v-if="isTextShowing">
      <read :text="text"></read>
    </div>

    <count-down :time-to-count="timeToCount" @progress="handleCountdownProgress" @ended="handleEnded"></count-down>

    <el-row class="answer_btn">
      <el-col class="d2-text-center">
        <div v-if="isPreparation">
          <el-button type="danger" @click="directToAnswer">立刻回答</el-button>
        </div>
        <div v-else>
          <el-button type="danger" @click="finishAnswer">结束回答</el-button>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import read from './read'
  import MyCountDown from './count-down'

  export default {
    name: "answer",
    components: {
      read,
      'count-down': MyCountDown
    },
    props: {
      // 文本是否显示
      isTextShowing: Boolean,
      text: String,

      // 倒计时时长
      timeToCount: Number,

      // 是【准备阶段】立刻回答 或 【回答阶段】结束回答
      isPreparation: Boolean
    },
    mounted() {
      console.log(this.text)
    },
    methods: {
      // 结束回答
      finishAnswer() {
        this.$emit('next')
      },

      // 立刻回答
      directToAnswer() {
        this.$emit('direct')
      },

      handleCountdownProgress(data) {
        console.log(data.days);
        console.log(data.hours);
        console.log(data.minutes);
        console.log(data.seconds);
        console.log(data.milliseconds);
        console.log(data.totalDays);
        console.log(data.totalHours);
        console.log(data.totalMinutes);
        console.log(data.totalSeconds);
        console.log(data.totalMilliseconds);
      },

      handleEnded() {
        console.error('end!!!!!!')
      },

    }
  }
</script>

<style scoped>
  .answer_btn {
    margin-top: 15px;
  }
</style>