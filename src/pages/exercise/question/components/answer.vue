<!--回答题目-->
<template>
  <div>

    <div v-if="isTextShowing">
      <read :text="text"></read>
    </div>

    <count-down :time-to-count="timeToCount" @end="handleCountDown"></count-down>

    <el-row class="answer_btn">
      <el-col class="d2-text-center">
        <div v-if="isPreparation">
          <el-button type="success" @click="directToAnswer">立刻回答</el-button>
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
  import {checkRecorderReady, startRecording, endRecording} from '@/libs/my-recorder'

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
      // 【回答阶段】
      if (!this.isPreparation) {
        let isRecorderReady = checkRecorderReady()
        console.log('Audio status: ' + isRecorderReady)

        if (isRecorderReady) {
          startRecording()
        } else {
          console.error('Audio is not ready, so we can\'t provide exercise for you.')
          // TODO 用户提示
        }
      }
    },
    methods: {
      // 进度条结束
      handleCountDown() {
        if (this.isPreparation) {
          this.directToAnswer()
        } else {
          this.finishAnswer()
        }
      },
      // 主动结束回答
      finishAnswer() {
        endRecording()

        this.$emit('next')
      },

      // 主动立刻回答
      directToAnswer() {
        this.$emit('direct')
      }
    }
  }
</script>

<style scoped>
  .answer_btn {
    margin-top: 15px;
  }
</style>