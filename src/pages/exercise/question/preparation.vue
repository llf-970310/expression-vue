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
        maxRetry: 20
      }
    },
    methods: {
      // 点击「显示题目」
      showQuestion() {
        this.isTipShowing = false
      },

      // 回答结束，在获取下一道题目前，获取录音上传路径，并根据返回的上传 url 将音频上传
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

      // 上传当前的回答音频
      uploadCurRecording() {
        const _this = this
        uploadRecording(_this.uploadLocation, _this.uploadUrl, function () {
          new Promise((resolve, reject) => {
            //上传成功调用，告知服务器进行分析
            uploadPrepareTestSuccess(_this.preparationId).then(res => {
              console.log('SUCCESS')
              console.log(res);
              resolve();
            }).catch(err => {
              console.log('FAIL')
              // console.log(`cur retry: ${_this.retryCount}`)
              // if (_this.retryCount < _this.maxRetry) {
              //   _this.reTry(([location, url]) => _this.uploadCurRecording(location, url), [_this.uploadLocation, _this.uploadUrl])
              // } else {
              //   console.log('Try upload audio max times!')
              // }
            })
          }).then(() => {
            _this.checkPreparation()
          }).catch()
        });
      },

      checkPreparation() {
        // 获取上传路径
        new Promise((resolve, reject) => {
          getPrepareTestResult(this.preparationId).then(res => {
            console.log(res)
            // TODO 分析结果，判断是否需要重做
            resolve()
          }).catch(err => {
            console.log('err: ', err)
            reject(err)
          })
        }).then(() => {
          // TODO
          // this.$emit('prepared')
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