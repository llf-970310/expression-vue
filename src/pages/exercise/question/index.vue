<!--【一道题目】，包含<题目tip + 准备时间（可选） + 回答时间>-->
<template>
  <div>

    <!--题目编号-->
    <el-row class="d2-text-center index">
      {{ questionIndex }}
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
                        @next="nextQuestion"></question-one>
          <question-two v-if="questionType === 2"
                        :text="questionRawText"
                        :preparation-time="questionPreparationTime"
                        :answer-time="questionAnswerTime"
                        @next="nextQuestion"></question-two>
          <question-three v-if="questionType === 3"
                          :text="questionRawText"
                          :preparation-time="questionPreparationTime"
                          :answer-time="questionAnswerTime"
                          @next="nextQuestion"></question-three>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import tip from './components/tip'
  import QuestionOne from './question-one/index'
  import QuestionTwo from './question-two/index'
  import QuestionThree from './question-three/index'

  import {getUploadPath} from '@/api/question'
  import {uploadRecording} from '@/libs/my-recorder'

  export default {
    name: "question-frame",
    components: {
      tip,
      'question-one': QuestionOne,
      'question-two': QuestionTwo,
      'question-three': QuestionThree,
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
      questionAnswerTime: Number
    },
    data() {
      return {
        // 是否显示 tip
        isTipShowing: true,

        // 录音上传路径
        uploadLocation: '',
        uploadUrl: '',

        audio_context: '',
        recorder: ''
      }
    },
    methods: {
      // 点击「显示题目」
      showQuestion() {
        this.isTipShowing = false
      },

      // 回答结束，在获取下一道题目前，获取录音上传路径，并根据返回的上传 url 将音频上传
      nextQuestion() {
        new Promise((resolve, reject) => {
          getUploadPath(this.questionIndex).then(res => {
            console.log(res)
            this.uploadLocation = res.fileLocation
            this.uploadUrl = res.url
            resolve()
          }).catch(err => {
            console.log('err: ', err)
            reject(err)
          })
        }).then(() => {
            // 上传音频
            uploadRecording(this.uploadLocation, this.uploadUrl)
          }
        ).catch()

        this.$emit('next')
      }
    }

  }
</script>

<style scoped>
  .index {
    margin-bottom: 20px;
  }
</style>