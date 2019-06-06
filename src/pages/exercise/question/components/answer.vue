<!--回答题目-->
<template>
  <div>

    <div v-if="isTextShowing">
      <read :text="text"></read>
    </div>

    <count-down ref="countdown" :time-to-count="timeToCount" @end="handleCountDown"></count-down>

    <el-row class="answer_btn">
      <el-col class="d2-text-center">
        <div v-if="isPreparation">
          <el-button type="success" @click="directToAnswer">立刻回答</el-button>
        </div>
        <div v-else>
          <el-button type="danger" :loading="answerFinishing" @click="finishAnswer">结束回答</el-button>
        </div>
      </el-col>
    </el-row>

    <el-dialog
        title="警告"
        :visible.sync="finishCheckDialogVisible"
        width="40%">
      <span>您的回答时间太短，有可能致使您的该题评分异常，确定要提前结束吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="finishCheckDialogVisible = false">再想想</el-button>
        <el-button type="danger" @click="confirmFinishAnswer">确 定</el-button>
      </span>
    </el-dialog>
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
    data() {
      return {
        finishCheckDialogVisible: false,
        answerFinishing: false,
      }
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
          this.confirmFinishAnswer()
        }
      },

      // 主动结束回答，告知用户操作风险
      finishAnswer() {
        // 根据音频时长确定是否需要提醒
        let usedSeconds = this.timeToCount / 1000 - this.$refs.countdown.$refs.countdown.totalSeconds;
        if (usedSeconds < 10) {
          this.finishCheckDialogVisible = true
        } else {
          this.confirmFinishAnswer()
        }
      },

      // 确定主动结束回答
      confirmFinishAnswer() {
        this.finishCheckDialogVisible = false;

        // 停止录音
        endRecording()

        // 停止倒计时
        this.$refs.countdown.endCounting();

        // 按钮动画
        this.answerFinishing = true;

        // 告诉父组件下一题
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