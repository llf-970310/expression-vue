<!--所有的题目控制-->
<template>
  <d2-container :filename="filename">
    <question-frame :cur-detail-of-question="curQuestionTip.detail" :cur-tip-of-question="curQuestionTip.tip"
                    :question-index="curQuestionIndex"
                    :question-type="curQuestionType"
                    :question-raw-text="curQuestionRawText"
                    @next="nextQuestion">
    </question-frame>
  </d2-container>
</template>

<script>
  import QuestionFrame from './question/index'
  import {nextQuestion} from '@/api/question'

  export default {
    name: "index",
    components: {
      'question-frame': QuestionFrame
    },
    data() {
      return {
        filename: __filename,

        curQuestionIndex: 1,
        curQuestionType: 1,
        curQuestionRawText: '',
        curQuestionTip: {
          detail: '',
          tip: ''
        }
      }
    },
    mounted() {
      this.nextQuestion()
    },
    methods: {
      nextQuestion() {
        new Promise((resolve, reject) => {
          nextQuestion().then(res => {
            // console.log(res)
            this.curQuestionIndex = res.questionNumber
            this.curQuestionType = res.questionType
            this.curQuestionRawText = res.questionContent
            this.curQuestionTip.detail = res.questionInfo.detail
            this.curQuestionTip.tip = res.questionInfo.tip
            // TODO timeLimit

            // TODO 测试结束的标志
            resolve()
          }).catch(err => {
            console.log('err: ', err)
            reject(err)
          })
        }).then().catch()
      }
    }
  }
</script>

<style scoped>

</style>