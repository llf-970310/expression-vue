<!--所有的题目控制-->
<template>
  <d2-container :filename="filename">
    <div v-if="!hasFinishExercise">
      <question-frame :key="curQuestionIndex"
                      :question-tip-detail="curQuestionTip.detail" :question-tip="curQuestionTip.tip"
                      :question-index="curQuestionIndex"
                      :question-type="curQuestionType"
                      :question-raw-text="curQuestionRawText"
                      :question-preparation-time="curQuestionPreparationTime"
                      :question-answer-time="curQuestionAnswerTime"
                      @next="nextQuestion">
      </question-frame>
    </div>
  </d2-container>
</template>

<script>
  import QuestionFrame from './question/index'
  import {nextQuestion} from '@/api/question'
  import {initAudio} from '@/libs/my-recorder'

  export default {
    name: "index",
    components: {
      'question-frame': QuestionFrame
    },
    data() {
      return {
        filename: __filename,

        // 测试结束的标志
        hasFinishExercise: false,

        // 最后一道题的标志
        isLastQuestion: false,

        curQuestionIndex: 1,
        curQuestionType: 1,
        curQuestionRawText: '',
        curQuestionTip: {
          detail: '',
          tip: ''
        },
        curQuestionPreparationTime: 0,
        curQuestionAnswerTime: 0
      }
    },
    mounted() {
      // 初始化音频设备
      initAudio()

      this.nextQuestion()
    },
    methods: {
      nextQuestion() {
        if (this.isLastQuestion) {
          // TODO 做题已结束
          this.hasFinishExercise = true
        } else {
          // 继续做题
          new Promise((resolve, reject) => {
            nextQuestion().then(res => {
              console.log(res)
              this.curQuestionIndex = res.questionNumber
              this.curQuestionType = res.questionType
              this.curQuestionRawText = res.questionContent
              this.curQuestionTip.detail = res.questionInfo.detail
              this.curQuestionTip.tip = res.questionInfo.tip
              this.curQuestionPreparationTime = res.readLimitTime
              this.curQuestionAnswerTime = res.questionLimitTime
              this.isLastQuestion = res.lastQuestion

              resolve()
            }).catch(err => {
              console.log('err: ', err)
              reject(err)
            })
          }).then().catch()
        }
      }
    }
  }
</script>

<style scoped>

</style>