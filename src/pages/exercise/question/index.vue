<!--【一道题目】，包含<题目tip + 准备时间（可选） + 回答时间>-->
<template>
  <div>
    <el-row>
      <el-col :span="12" :offset="6">
        <el-steps :active="active" finish-status="success" align-center>
          <el-step title="阅读要求"></el-step>
          <el-step title="准备作答"></el-step>
          <el-step title="正在录音"></el-step>
        </el-steps>
      </el-col>
    </el-row>
    <!--考试时间&题目编号-->
    <el-row class="index">
      <el-col :span="10" class="exercise-left-time">
        <exercise-timer :time-to-count="exerciseLeftTime"
                        :total-time="exerciseTime"
                        :only-seconds="false"
                        @end="handleExerciseTimeEnd"
                        :show-progress="false"
                        left-time-string="本次评测剩余时间">
        </exercise-timer>
      </el-col>

      <el-col :span="4" class="d2-text-center question-index">
        {{ questionIndex }}
      </el-col>
<!--      <el-col :span="3" offset="7" class="last-question">-->
<!--        剩余题数:-->
<!--      </el-col>-->
    </el-row>
    <!--题目tip-->
    <div v-if="isTipShowing">
      <tip :detail="questionTipDetail" :tip="questionTip" @showQuestion="showQuestion"></tip>
    </div>
    <!--题目内容-->
    <div v-else>
      <el-row>
        <el-col :offset="3" :span="18">
          <question-one v-if="questionType === 1"
                        :text="questionRawText"
                        :preparation-time="questionPreparationTime"
                        :answer-time="questionAnswerTime"
                        :audio-volume="audioVolume"
                        @next="nextQuestion"
                        @nextStep="nextStep">
          </question-one>
          <question-two v-if="questionType === 2"
                        :text="questionRawText"
                        :preparation-time="questionPreparationTime"
                        :answer-time="questionAnswerTime"
                        :audio-volume="audioVolume"
                        @next="nextQuestion"
                        @nextStep="nextStep">
          </question-two>
          <question-three v-if="questionType === 3"
                          :text="questionRawText"
                          :preparation-time="questionPreparationTime"
                          :answer-time="questionAnswerTime"
                          :audio-volume="audioVolume"
                          @next="nextQuestion"
                          @nextStep="nextStep">
          </question-three>
          <question-five-six v-if="questionType === 5 || questionType === 6"
                             :text="questionRawText"
                             :preparation-time="questionPreparationTime"
                             :answer-time="questionAnswerTime"
                             :audio-volume="audioVolume"
                             @next="nextQuestion"
                             @nextStep="nextStep">
          </question-five-six>
        </el-col>
      </el-row>
      <feedback-bar :question-db-id="questionDbId" style="margin-top: 20px"></feedback-bar>
    </div>
  </div>
</template>

<script>
  import tip from '../components/tip'
  import ExerciseTimer from '../components/count-down'
  import QuestionOne from './question-one/index'
  import QuestionTwo from './question-two/index'
  import QuestionThree from './question-three/index'
  import QuestionFiveSix from './question-five-six/index'

  import { getUploadPath, uploadSuccess } from '@/api/manager.exam'
  import { uploadRecording } from '@/libs/my-recorder'
  import FeedbackBar from '../components/feedback-bar'

  export default {
    name: 'question-frame',
    components: {
      FeedbackBar,
      tip,
      'exercise-timer': ExerciseTimer,
      'question-one': QuestionOne,
      'question-two': QuestionTwo,
      'question-three': QuestionThree,
      'question-five-six': QuestionFiveSix
    },
    props: {
      // 问题提示
      questionTipDetail: String,
      questionTip: String,

      // 问题序号
      questionIndex: Number,

      // 问题类型
      questionType: Number,

      // 问题原文
      questionRawText: String,

      // 问题时间限制，【以秒为单位】
      questionPreparationTime: Number,
      questionAnswerTime: Number,
      exerciseLeftTime: Number,
      exerciseTime: Number,

      // 是否是最后一题
      isLastQuestion: Boolean,

      // 音量大小
      audioVolume: Number,

      // 题目对应数据库id,用于点赞收藏反馈
      questionDbId: String,
    },
    data () {
      return {
        // 是否显示 tip
        isTipShowing: true,

        // 录音上传路径
        uploadLocation: '',
        uploadUrl: '',

        // 重试相关的参数
        retryCount: 0,
        maxRetry: 20,
        active: 0
      }
    },
    methods: {
      // 下一步（展示条用）这种实现绑定了三步做题步骤，实际上不是很好
      nextStep () {
        this.active = (this.active + 1) % 3
      },
      // 点击「显示题目」
      showQuestion () {
        this.isTipShowing = false
        this.nextStep()

      },

      /**
       * 回答结束，在获取下一道题目前，获取录音上传路径，并根据返回的上传 url 将音频上传
       */
      nextQuestion () {
        getUploadPath(this.questionIndex).then(res => {
          this.uploadLocation = res.fileLocation
          this.uploadUrl = res.url
          this.uploadCurRecording()
          this.$emit('next')
        }).catch(err => {
          console.log('err: ', err)
        })
      },

      /**
       * 上传当前的音频
       */
      uploadCurRecording () {
        const _this = this

        uploadRecording(_this.uploadLocation, _this.uploadUrl, function () {
          // 上传成功调用，告知服务器进行分析
          uploadSuccess(_this.questionIndex).then(res => {
            if (_this.isLastQuestion) {
              _this.$emit('showResult')
            }
          }).catch(err => {
            if (_this.retryCount < _this.maxRetry) {
              _this.reTry(([location, url]) => uploadRecording(location, url), [_this.uploadLocation, _this.uploadUrl])
            } else {
              console.log('Try uploadCurRecording() max times!')
              console.error(err)
            }
          })
        })
      },

      reTry (func, arg) {
        this.retryCount++
        setTimeout(() => func(arg), 500)
      },

      // 考试时间超时
      handleExerciseTimeEnd () {
        this.$message({
          message: '考试时间到，考试结束！为您自动跳转至结果界面～',
          type: 'error',
          duration: 5 * 1000,
          center: true,
          showClose: true
        })
        this.$emit('showResult')
      }
    },
    mounted(){
      // 初始化音频设备
      const _this = this
      initAudio(function (data) {
        let avg = 0
        let max_data = 0
        for (let i = 0; i < data.length; i++) {
          let temp = Math.abs(data[i])
          avg += temp
          max_data = Math.max(max_data, temp)
        }
        avg /= data.length
        _this.audioVolume = avg * 800
      })
    }

  }
</script>

<style scoped>
  .index {
    margin: 20px 0 30px 0;
  }
  
  .exercise-left-time {
    font-size: 14px;
    color: #909399;
  }

  .last-question{
    font-size:14px;
    color: #909399;
  }
  
  .question-index {
    font-size: 26px;
    line-height: 26px;
  }
</style>
