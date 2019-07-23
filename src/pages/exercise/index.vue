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
                        :audio-volume="audioVolume"
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
                   :audio-volume="audioVolume"
                   @prepared="finishPreparation">
      </preparation>
    </div>
  </d2-container>
</template>

<script>
  import Preparation from './preparation/index'
  import QuestionFrame from './question/index'
  import ShowResult from './question/showResult'
  import { getPrepareTestInfo, checkUnfinishedExam, nextQuestion } from '@/api/question'
  import { initAudio } from '@/libs/my-recorder'

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

        // 音量大小
        audioVolume: 0,

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
      const _this = this;
      initAudio(function (data) {
        let avg = 0;
        let max_data = 0;
        for (let i = 0; i < data.length; i++) {
          let temp = Math.abs(data[i]);
          avg += temp;
          max_data = Math.max(max_data, temp)
        }
        avg /= data.length;
        _this.audioVolume = avg * 800;
      });
    },
    methods: {
      /**
       * 结束预测试的准备阶段，检查是否有未完成的测试
       */
      finishPreparation() {
        this.hasFinishedPreparation = true

        new Promise((resolve, reject) => {
          checkUnfinishedExam().then(() => {
            // 没有未完成的考试
            console.log('dont have unfinished exam')
            resolve()
          }).catch(err => {
            console.log('err: ', err)

            if (err.code === 2) {
              // 有考试正在进行中
              this.$confirm('监测到您有正在进行的考试，请问是否需要继续考试?', '提示', {
                confirmButtonText: '继续考试',
                cancelButtonText: '重新考试',
                type: 'error'
              }).then(() => {

                const questionData = err.data;
                this.curQuestionIndex = parseInt(questionData['next_q_num']) - 1;
                resolve()
              }).catch(() => {
                reject()
              })
            }
          })
        }).then(() => {
          console.log('checkUnfinishedExam resolved')
          this.nextQuestion()
        }).catch(() => {
          console.log('checkUnfinishedExam reset')
          this.nextQuestion(true)
        })
      },

      /**
       * 预测试通过，进行正式的试题测试
       * @param forceNew 强制新建考试，即考试题目从 0 开始计数
       */
      nextQuestion(forceNew = false) {
        if (this.isLastQuestion) {
          // TODO 做题已结束
//          this.hasFinishExercise = true
        } else {
          // 继续做题
          this.dataLoading = true;
          new Promise((resolve, reject) => {
            nextQuestion(forceNew ? 0 : this.curQuestionIndex).then(res => {
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