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
  import {uploadSuccess} from '@api/question'

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
      questionAnswerTime: Number,
        isLastQuestion: Boolean
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
          retryCount:0,
          maxRetry:20
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
            new Promise((resolve, reject) => {
                uploadRecording(this.uploadLocation, this.uploadUrl);
            }).then(
                new Promise((resolve, reject) => {
                    //上传成功调用，告知服务器进行分析
                   uploadSuccess(this.questionIndex).then(res=>{
                         if(this.isLastQuestion) {
                             this.$emit('showResult',true);
                         }
                         console.log(res);
                         resolve();
                     }).catch(err => {
                         if(this.retryCount<this.maxRetry) {
                             this.reTry( ([location, url]) => uploadRecording(location, url), [this.uploadLocation, this.uploadUrl] )
                         } else {
                             this.errorMessage(err);
                         }
                     })
                 }).then().catch()

            ).catch( err =>{
                console.log( 'err: ', err)
                reject();
            }
            );

          }
        ).catch()

        this.$emit('next')
      },
        reTry(func, arg) {
          this.retryCount++;
            setTimeout(() => func(arg), 500);
        },
        errorMessage(e) {
            try {
                if (e === 'timeout') {
//                        this.$message('获取结果超时');
                    this.subTitle = '服务器正忙，请稍后刷新重试';
                    clearInterval(this.timer);
                    this.loading.close();
                    return;
                }
                let response = JSON.parse(e.responseText);
                console.log(response);
                if(response.needDisplay) {
                    this.$message(response.tip);
                    this.subTitle = '处理错误，请重新测试';
                } else {
//                        elsethis.$message('服务器出错了');
                    this.subTitle='处理出错，请重新测试';
                }
            } catch (e) {
//                    this.$message('服务器出错了');
                this.subTitle='处理出错，请重新测试';
            }finally {
                clearInterval(this.timer);
                this.loading.close();
            }
        }
    }

  }
</script>

<style scoped>
  .index {
    margin-bottom: 20px;
  }
</style>