<template>
  <div>

    <el-row class="d2-text-center index pretest-title">
      <h3 v-if="isResultShowing">音频环境测试结果</h3>
      <h3 v-else>音频环境测试</h3>
    </el-row>

    <!--题目tip-->
    <div v-if="isTipShowing">
      <tip :detail="questionTipDetail" :tip="questionTip" @showQuestion="showQuestion"></tip>
    </div>

    <!--题目内容-->
    <div v-else>
      <!--测试结果-->
      <div v-if="isResultShowing">
        <el-row>
          <el-col :offset="3" :span="18">
            <result-preparation :analysis-result="analysisResult"
                                :audio-url="audioData"
                                @ready="$emit('prepared')"
                                @fail="$emit('retest')">
            </result-preparation>
          </el-col>
        </el-row>
      </div>

      <!--测试-->
      <div v-else>
        <el-row>
          <el-col :offset="3" :span="18">
            <question-preparation :text="questionRawText"
                                  :preparation-time="questionPreparationTime"
                                  :answer-time="questionAnswerTime"
                                  :audio-volume="audioVolume"
                                  @next="uploadAndCheckPreparation">
            </question-preparation>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import tip from '../components/tip'
  import QuestionPreparation from './question-preparation/index'
  import ResultPreparation from './result'

  import { getPrepareTestUploadPath, uploadPrepareTestSuccess, getPrepareTestResult } from '@/api/question'
  import { uploadRecording } from '@/libs/my-recorder'

  export default {
    name: "preparation",
    components: {
      tip,
      'question-preparation': QuestionPreparation,
      'result-preparation': ResultPreparation,
    },
    props: {
      // 预测试的问题提示
      questionTipDetail: String,
      questionTip: String,

      // 预测试的问题ID
      preparationId: String,

      // 预测试的问题原文
      questionRawText: String,

      // 预测试的问题时间限制，【以秒为单位】
      questionPreparationTime: Number,
      questionAnswerTime: Number,

      // 音量大小
      audioVolume: Number,
    },
    data() {
      return {
        // 是否显示 tip
        isTipShowing: true,

        // 预测试之后的结果展示
        isResultShowing: false,
        analysisResult: {
          canRcg: false,
          qualityIsOk: false,
          msg: '',
        },

        // 录音上传路径
        uploadLocation: '',
        uploadUrl: '',

        // 录音音频数据
        audioData: '',

        // 重试相关的参数
        retryCount: 0,
        maxRetry: 100,

        // 正在尝试重试
        isReTrying: false,
      }
    },
    methods: {
      /**
       * 点击「显示题目」
       */
      showQuestion() {
        this.isTipShowing = false
      },

      /**
       * 回答结束，在获取下一道题目前，获取录音上传路径，并根据返回的上传 url 将音频上传
       */
      uploadAndCheckPreparation() {
        // 获取上传路径
        new Promise((resolve, reject) => {
          getPrepareTestUploadPath(this.preparationId).then(res => {
            console.log(res)
            this.uploadLocation = res.fileLocation
            this.uploadUrl = res.url
            resolve()
          }).catch(err => {
            console.log('err: ', err)

            if (err.code === 4002) {
              // test_id 错误，不应该出现的情况
              this.$message({
                message: '系统出了点状况，请联系管理员解决噢～',
                type: 'error',
                duration: 5 * 1000,
                center: true,
                showClose: true
              })
            }

            reject(err)
          })
        }).then(() => {
            // 上传音频
            this.uploadCurRecording()
          }
        ).catch()
      },

      /**
       * 上传当前的回答音频
       */
      uploadCurRecording() {
        const _this = this
        uploadRecording(_this.uploadLocation, _this.uploadUrl, function (audioData) {
          new Promise((resolve, reject) => {
            //上传成功调用，告知服务器进行分析
            uploadPrepareTestSuccess(_this.preparationId).then(res => {
              // console.log('uploadPrepareTestSuccess');
              _this.audioData = audioData;
              resolve();
            }).catch(err => {
              console.log(err)

              if (err.code === 4002) {
                // test_id 错误，不应该出现的情况
                this.$message({
                  message: '系统出了点状况，请联系管理员解决噢～',
                  type: 'error',
                  duration: 5 * 1000,
                  center: true,
                  showClose: true
                })
              }
            })
          }).then(() => {
            // 重置重试次数
            _this.checkPreparation()
          }).catch()
        });
      },

      /**
       * 根据预测试的结果判断是否合格
       */
      checkPreparation() {
        // console.log(`isRetrying: ${this.isReTrying}, curRetry: ${this.retryCount}`);
        // 获取测试结果
        new Promise((resolve, reject) => {
          getPrepareTestResult(this.preparationId).then(res => {
            console.log(res)
            // 分析结果，判断是否需要重做
            this.isReTrying = false;
            this.isResultShowing = true;
            this.analysisResult.canRcg = res['canRcg'];
            this.analysisResult.qualityIsOk = res['qualityIsOk'];

            if (this.analysisResult.canRcg) {
              // 能识别
              if (this.analysisResult.qualityIsOk) {
                // 声音预测试通过
                this.analysisResult.msg = '音频环境测试结束，您的环境符合要求。';
                resolve()
              } else {
                // 声音预测试不通过，重新测试
                this.analysisResult.msg = '您的声音质量不高，这可能由环境或麦克风记录导致，请进行调整噢～'
              }
            } else {
              // 不能识别，重新测试
              this.analysisResult.msg = '您的声音暂不能识别，请尽可能说清楚，并保持环境安静噢～'
            }
          }).catch(err => {
            if (err.code === 4002) {
              // test_id 错误，不应该出现的情况
              this.$message({
                message: '系统出了点状况，请联系管理员解决噢～',
                type: 'error',
                duration: 5 * 1000,
                center: true,
                showClose: true
              })
            } else if (err.code === 5104) {
              this.isReTrying = true
              if (this.retryCount < this.maxRetry) {
                this.reTry(() => this.checkPreparation())
              } else {
                console.log('Try checkPreparation() max times! But the task is still waiting')
              }
            }
            reject(err)
          })
        }).then(() => {
            this.isReTrying = false
          }
        ).catch(err => {
          console.log(err)
        })
      },

      reTry(func, arg) {
        this.retryCount++;
        setTimeout(() => func(arg), 500);
      },
    }
  }
</script>

<style scoped>
  .pretest-title {
    margin-top: 1.0rem;
  }
</style>
