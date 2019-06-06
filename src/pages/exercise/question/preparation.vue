<template>
  <div>

    <el-row class="d2-text-center index">
      <h3>音频环境测试</h3>
    </el-row>

    <!--题目tip-->
    <div v-if="isTipShowing">
      <tip :detail="questionTipDetail" :tip="questionTip" @showQuestion="showQuestion"></tip>
    </div>

    <!--题目内容-->
    <div v-else>
      <el-row>
        <el-col :offset="3" :span="18">
          <question-preparation :text="questionRawText"
                                :preparation-time="questionPreparationTime"
                                :answer-time="questionAnswerTime"
                                @next="uploadAndCheckPreparation">
          </question-preparation>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import tip from './components/tip'
  import QuestionPreparation from './question-preparation/index'

  import {getPrepareTestUploadPath, uploadPrepareTestSuccess, getPrepareTestResult} from '@/api/question'
  import {uploadRecording} from '@/libs/my-recorder'

  export default {
    name: "preparation",
    components: {
      tip,
      'question-preparation': QuestionPreparation,
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
    },
    data() {
      return {
        // 是否显示 tip
        isTipShowing: true,

        // 录音上传路径
        uploadLocation: '',
        uploadUrl: '',

        audio_context: '',
        recorder: '',
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
        uploadRecording(_this.uploadLocation, _this.uploadUrl, function () {
          new Promise((resolve, reject) => {
            //上传成功调用，告知服务器进行分析
            uploadPrepareTestSuccess(_this.preparationId).then(res => {
              console.log('SUCCESS')
              _this.isReTrying = false
              resolve();
            }).catch(err => {
              console.log('FAIL')
              console.log(`uploadCurRecording cur retry: ${_this.retryCount}`)

              // 正在尝试
              _this.isReTrying = true
              if (_this.retryCount < _this.maxRetry) {
                _this.reTry(([location, url]) => _this.uploadCurRecording(location, url), [_this.uploadLocation, _this.uploadUrl])
              } else {
                console.log('Try uploadCurRecording() max times!')
              }
            })
          }).then(() => {
            // 重置重试次数
            _this.isReTrying = false
            _this.retryCount = 0
            _this.checkPreparation()
          }).catch()
        });
      },

      /**
       *
       */
      checkPreparation() {
        // 获取上传路径
        new Promise((resolve, reject) => {
          getPrepareTestResult(this.preparationId).then(res => {
            console.log(res)
            // 分析结果，判断是否需要重做
            this.isReTrying = false

            if (res['canRcg']) {
              // 能识别
              let qualityIsOk = res['qualityIsOk']
              if (qualityIsOk) {
                // 声音预测试通过
                resolve()
              } else {
                // 声音预测试不通过，重新测试
                this.$message({
                  message: '您的声音质量不高，这可能由环境或麦克风记录导致，请进行调整噢～',
                  type: 'error',
                  duration: 10 * 1000,
                  center: true,
                  showClose: true
                });
                this.$emit('retest')
              }
            } else {
              // 不能识别，重新测试
              this.$message({
                message: '您的声音暂不能识别，请尽可能说清楚，并保持环境安静噢～',
                type: 'error',
                duration: 10 * 1000,
                center: true,
                showClose: true
              });
              this.$emit('retest')
            }
          }).catch(err => {
            console.log('err: ' + err)

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
            this.$emit('prepared')
          }
        ).catch()
      },

      reTry(func, arg) {
        this.retryCount++;
        setTimeout(() => func(arg), 500);
      },
    }
  }
</script>

<style scoped>
</style>