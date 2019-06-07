<!--所有的题目控制-->
<template>
  <d2-container :filename="filename" v-loading="dataLoading">
    <div v-if="hasFinishedPreparation">
      <div v-if="hasFinishExercise">
        <show-result></show-result>
      </div>
      <div v-else>
        <question-frame :key="curQuestionIndex"
                        :question-tip-detail="curQuestionTip.detail" :question-tip="curQuestionTip.tip"
                        :question-index="curQuestionIndex"
                        :question-type="curQuestionType"
                        :question-raw-text="curQuestionRawText"
                        :question-preparation-time="curQuestionPreparationTime"
                        :question-answer-time="curQuestionAnswerTime"
                        :is-last-question="isLastQuestion"
                        @showResult="finishTest"
                        @next="nextQuestion">
        </question-frame>
      </div>
    </div>
    <div v-else>
      <preparation :key="preparationId"
                   :question-tip-detail="curQuestionTip.detail" :question-tip="curQuestionTip.tip"
                   :preparation-id="preparationId"
                   :question-raw-text="curQuestionRawText"
                   :question-preparation-time="curQuestionPreparationTime"
                   :question-answer-time="curQuestionAnswerTime"
                   @retest="preparation"
                   @prepared="finishPreparation">
      </preparation>
    </div>
  </d2-container>
</template>

<script>
  import Preparation from './question/preparation'
  import QuestionFrame from './question/index'
  import ShowResult from './result/showResult'
  import {getPrepareTestInfo, nextQuestion} from '@/api/question'
  import {initAudio} from '@/libs/my-recorder'

  export default {
    name: "index",
    components: {
      'preparation': Preparation,
      'question-frame': QuestionFrame,
      'show-result': ShowResult
    },
    data() {
      return {
        filename: __filename,

        // 数据加载中
        dataLoading: false,

        // 预测试已完成的标志
        hasFinishedPreparation: false,
        preparationId: '',

        // 测试结束的标志
        hasFinishExercise: false,

        // 最后一道题的标志
        isLastQuestion: false,
        curQuestionIndex: 0,
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
      initAudio();

      this.preparation()
    },
    methods: {
      /**
       * 新建一次预测试
       */
      preparation() {
        this.dataLoading = true;
        new Promise((resolve, reject) => {
          getPrepareTestInfo().then(res => {
            console.log(res)
            this.preparationId = res['test_id']
            this.curQuestionRawText = res.questionContent
            this.curQuestionTip.detail = res.questionInfo.detail
            this.curQuestionTip.tip = res.questionInfo.tip
            this.curQuestionPreparationTime = res.readLimitTime
            this.curQuestionAnswerTime = res.questionLimitTime

            resolve()
          }).catch(err => {
            console.log('err: ', err)
            reject(err)
          })
        }).then(() => {
          this.dataLoading = false;
        }).catch()
      },

      /**
       * 结束预测试的准备阶段
       */
      finishPreparation() {
        this.hasFinishedPreparation = true
        this.nextQuestion()
      },

      /**
       * 预测试通过，进行正式的试题测试
       */
      nextQuestion() {
        if (this.isLastQuestion) {
          // TODO 做题已结束
//          this.hasFinishExercise = true
        } else {
          // 继续做题
          this.dataLoading = true;
          new Promise((resolve, reject) => {
            nextQuestion(this.curQuestionIndex).then(res => {
              // console.log(res)
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
          }).then(() => {
            this.dataLoading = false;
          }).catch()
        }
      },
      finishTest() {
        this.hasFinishExercise = true
      }
    }
  }
</script>

<style scoped>

</style>