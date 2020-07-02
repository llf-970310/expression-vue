<!--所有的题目控制-->
<template>
  <d2-container :filename="filename" v-loading="dataLoading">
    <div v-if="isSupportedBrowser">
      <div v-if="!hasFinishedPreparation">
        <!--考试预准备-->
        <preparation :audio-volume="audioVolume"
                     @prepared="finishPreparation">
        </preparation>
      </div>
      <div v-else>
        <div v-if="hasFinishExercise">
          <!--考试结束-->
          <show-result @reExercise="reExercise"></show-result>
        </div>
        <div v-else>
          <div v-if="hasExerciseTime">
            <div v-if="isSupportedBrowser">
              <question-frame :key="curQuestionIndex"
                              :question-tip-detail="curQuestionTip.detail" :question-tip="curQuestionTip.tip"
                              :question-index="curQuestionIndex"
                              :question-db-id="curQuestionDbId"
                              :question-type="curQuestionType"
                              :question-raw-text="curQuestionRawText"
                              :question-preparation-time="curQuestionPreparationTime"
                              :question-answer-time="curQuestionAnswerTime"
                              :exerciseLeftTime="exerciseLeftTime"
                              :exerciseTime="exerciseTime"
                              :is-last-question="isLastQuestion"
                              :audio-volume="audioVolume"
                              @showResult="finishTest"
                              @next="nextQuestion">
              </question-frame>
            </div>
            <div v-else class="really-center">
              <!--不支持的浏览器-->
              <h2>请使用 Chrome 浏览器进行评测</h2>
            </div>
          </div>
          <div v-else class="really-center">
            <!--没有剩余考试次数-->
            <h2>您的考试次数已用尽</h2>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="really-center">
      <!--不支持的浏览器-->
      <h2>请使用版本高于 52.0 的 Chrome 浏览器进行评测</h2>
    </div>
  </d2-container>
</template>

<script>
  import Preparation from './preparation/index'
  import QuestionFrame from './question/index'
  import ShowResult from './question/showResult'
  import { checkUnfinishedExam, initExam, nextQuestion } from '@/api/manager.exam'
  import { initAudio } from '@/libs/my-recorder'

  export default {
    name: 'user-exercise',
    components: {
      'preparation': Preparation,
      'question-frame': QuestionFrame,
      'show-result': ShowResult
    },
    data () {
      return {
        filename: __filename,

        // 数据加载中
        dataLoading: false,

        // 音量大小
        audioVolume: 0,

        // 预测试已完成的标志
        hasFinishedPreparation: false,
        preparationId: '',

        //判断是否是重新测试的，如果是重新测试的话不需要再测试环境但是要回到选择模板
        preparationAlready:false,

        // 包含可测试次数
        hasExerciseTime: true,

        // 浏览器是否支持
        isSupportedBrowser: true,

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
        curQuestionAnswerTime: 0,

        // 整场测试的剩余时间
        exerciseLeftTime: 1800,
        // 整场考试的时间
        exerciseTime: 1800,

        // 题目对应数据库id,用于点赞收藏反馈
        curQuestionDbId: '',
        // 记录当前试卷templateId
        templateId:'',
        //模板的总题数
        templateQuestionSum:0
      }
    },
    mounted () {
       this.isSupportedBrowser = this.checkBrowser()
      const _this = this
      //准备录音
      if (this.isSupportedBrowser) {
        // 初始化音频设备
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
        //
        // // 直接开始考试
        // this.finishPreparation()
      }

      // 浏览器页面级提示用户正在离开考试
      window.onbeforeunload = function (e) {
        if (_this.hasFinishedPreparation && !_this.hasFinishExercise && _this.hasExerciseTime) {
          // console.log('show show')
          // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
          return '关闭提示'
        }
      }
    },
    methods: {
      /**
       * 检查浏览器是否支持录音
       */
      checkBrowser () {
        let Sys = {}
        let ua = navigator.userAgent.toLowerCase()
        let s;
        (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
            (s = ua.match(/msie ([\d\.]+)/)) ? Sys.ie = s[1] :
                (s = ua.match(/edge\/([\d\.]+)/)) ? Sys.edge = s[1] :
                    (s = ua.match(/firefox\/([\d\.]+)/)) ? Sys.firefox = s[1] :
                        (s = ua.match(/(?:opera|opr).([\d\.]+)/)) ? Sys.opera = s[1] :
                            (s = ua.match(/chrome\/([\d\.]+)/)) ? Sys.chrome = s[1] :
                                (s = ua.match(/version\/([\d\.]+).*safari/)) ? Sys.safari = s[1] : 0
        // 根据关系进行判断
        if (Sys.ie) {
          // return ('IE: ' + Sys.ie);
          return false
        }
        if (Sys.edge) {
          // return ('EDGE: ' + Sys.edge);
          return false
        }
        if (Sys.firefox) {
          // return ('Firefox: ' + Sys.firefox);
          return true
        }
        if (Sys.chrome) {
          return this.checkChrome(Sys.chrome)
        }
        if (Sys.opera) {
          // return ('Opera: ' + Sys.opera);
          return false
        }
        return !!Sys.safari

      },

      /**
       * 检查 Chrome 浏览器
       */
      checkChrome (chromeVersion) {
        return chromeVersion > '52.0'
      },

      /**
       * 结束预测试的准备阶段，检查是否有未完成的测试
       */
      finishPreparation (templateId) {
        this.hasFinishedPreparation = true
        this.templateId =  templateId;

        checkUnfinishedExam().then(() => {
          // 没有未完成的考试，开始考试
          this.newExam()
        }).catch(err => {
          // console.log('err: ', err)
          if (err.code === 2) {
            // 有考试正在进行中
            this.$confirm('监测到您有正在进行的考试，请问是否需要继续考试?', '提示', {
              confirmButtonText: '继续考试',
              cancelButtonText: '重新考试',
              type: 'error'
            }).then(() => {
              const questionData = err.data
              this.curQuestionIndex = parseInt(questionData['next_q_num']) - 1
              this.nextQuestion()
            }).catch(() => {
              this.newExam()
            })
          }
        })
      },
      newExam () {
        this.dataLoading = true
        initExam(this.templateId).then(() => {
          // 初始化成功，下一题开始
          this.nextQuestion()
        }).catch(err => {
          if (err.code === 4004) {
            this.hasExerciseTime = false
          } else if (err.code === 5101) {
            this.$message({
              message: '您的测试题目获取失败，请重新打开页面或联系管理员解决',
              type: 'error',
              duration: 5 * 1000,
              center: true,
              showClose: true
            })
          }
        }).then(() => {
          this.dataLoading = false
        }).catch(() => {
          this.dataLoading = false
        })
      },

      /**
       * 预测试通过，进行正式的试题测试
       */
      nextQuestion () {
        if (this.isLastQuestion) {
          // 做题已结束，不用做任何处理，页面会自己到result的，如果这里改成true会触发提前到结果页bug
          // this.hasFinishExercise = false
        } else {
          // 继续做题
          this.dataLoading = true
          new Promise((resolve, reject) => { // 这个promise的目的是为了显示loading
            nextQuestion(this.curQuestionIndex).then(res => {
              this.curQuestionIndex = res.questionNumber
              this.curQuestionType = res.questionType
              this.curQuestionDbId = res.questionDbId
              this.curQuestionRawText = res.questionContent
              this.curQuestionTip.detail = res.questionInfo.detail
              this.curQuestionTip.tip = res.questionInfo.tip
              this.curQuestionPreparationTime = res.readLimitTime
              this.curQuestionAnswerTime = res.questionLimitTime
              this.isLastQuestion = res.lastQuestion
              this.exerciseLeftTime = res.examLeftTime
              this.exerciseTime = res.examTime

              resolve()
            }).catch(err => {
              console.log('err: ', err)
              if (err.code === 4000) {
                // 请求参数错误
                console.error('请求参数错误')
              } else if (err.cod === 4003) {
                // 测试超时，不用处理
                console.error('考试时间到')
              } else if (err.code === 5100) {
                // 测试已完成
                this.hasFinishExercise = true
              } else if (err.code === 5102) {
                // 获取题目失败
                this.$message({
                  message: '您的测试题目获取失败，请重新打开页面或联系管理员解决',
                  type: 'error',
                  duration: 5 * 1000,
                  center: true,
                  showClose: true
                })
              }

              reject(err)
            })
          }).then(() => {
            this.dataLoading = false
          }).catch(err => {
            this.dataLoading = false
          })
        }
      },
      finishTest () {
        this.hasFinishExercise = true
      },

      // 重新测试
      reExercise () {
        this.curQuestionIndex = 0
        this.hasFinishExercise = false
        this.isLastQuestion = false
        this.hasFinishedPreparation=false
        //this.newExam()
      },
    }
  }
</script>

<style scoped>
  .really-center {
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
</style>
