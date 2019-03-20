<!--【一道题目】，包含<题目tip + 准备时间（可选） + 回答时间>-->
<template>
  <div>

    <!--题目编号-->
    <el-row class="d2-text-center">
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
  // import $ from 'jquery'
  import tip from './components/tip'
  import QuestionOne from './question-one/index'
  import QuestionTwo from './question-two/index'
  import QuestionThree from './question-three/index'

  import {getUploadPath} from '@/api/question'
  import {uploadSoundToBOS} from '@/api/bos'

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
    mounted() {
      // let test = $('#d2-text-center').text()
      // console.log(test)
      // try {
      //   // webkit shim
      //   window.AudioContext = window.AudioContext || window.webkitAudioContext;
      //   navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
      //   window.URL = window.URL || window.webkitURL;
      //
      //   this.audio_context = new AudioContext;
      //   console.log('Audio context set up.');
      //   console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
      //   if (!navigator.getUserMedia) {
      //     // canAudioUse = false;
      //     this.browserError()
      //     return;
      //   }
      // } catch (e) {
      //   // canAudioUse = false;
      //   this.browserError()
      //   return;
      // }
      //
      // try {
      //   navigator.getUserMedia({audio: true}, this.startUserMedia, function (e) {
      //     console.log('No live audio input: ' + e);
      //   });
      // } catch (e) {
      //   // canAudioUse = false;
      //   this.browserError();
      // }
    },
    methods: {
      browserError() {
        console.log('browser error')
      },

      startUserMedia(stream) {
        let input = this.audio_context.createMediaStreamSource(stream);
        console.log('Media stream created.');

        this.recorder = new Recorder(input, {
          onAudioProcess: this.onAudioProcess
        });
        console.log('Recorder initialised.');
      },

      onAudioProcess(data) {
        let avg = 0;
        let max_data = 0;
        for (let i = 0; i < data.length; i++) {
          let temp = Math.abs(data[i]);
          avg += temp;
          max_data = Math.max(max_data, temp)
        }
        avg /= data.length;
        let sound = avg * 80;
        // console.log(sound);
        let soundId = this.questionType > 1 ? "#sound-2-" : "#sound-";
        // for (let i = 1; i < 10; i++) {
        //   if (i < sound) {
        //     $(soundId + i).css("color", "rgb(95, 169, 249)");
        //   } else {
        //     $(soundId + i).css("color", "#cdcdcd");
        //   }
        // }
      },

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
            this.uploadSound()
          }
        ).catch()

        this.$emit('next')
      },

      // 上传音频
      uploadSound() {
        if (this.uploadLocation === 'BOS') {
          uploadSoundToBOS(this.uploadUrl)
        }
      }
    }

  }
</script>

<style scoped>

</style>