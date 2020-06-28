<template>
  <preparation v-loading="preparationDataLoading"
               :question-tip-detail="questionTipDetail" :question-tip="questionTip"
               :preparation-id="preparationId"
               :question-raw-text="questionRawText"
               :question-answer-time="questionAnswerTime"
               :audio-volume="audioVolume"
               @retest="retest"
               @prepared="templateID=>$emit('prepared',templateID)">
  </preparation>
</template>

<script>
  import Preparation from './preparation'
  import { getPrepareTestInfo } from '@/api/manager.exam'
  import { initAudio } from '@/libs/my-recorder'

  export default {
    name: 'preparation-index',
    components: {
      'preparation': Preparation,
    },
    props: {
      // 音量大小
      audioVolume: Number,
    },
    data () {
      return {
        // 展示温馨提示

        // 预测试数据加载中
        preparationDataLoading: false,

        // 预测试的问题ID
        preparationId: '',

        // 预测试的问题原文
        questionRawText: '',

        // 预测试的问题提示
        questionTipDetail: '',
        questionTip: '',

        // 预测试的问题时间限制，【以秒为单位】
        questionAnswerTime: 0,
      }
    },

    mounted () {
      this.preparation()
      console.log("初始化音频设备")
      // 初始化音频设备
      const _this = this
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
    },

    methods: {
      /**
       * 新建一次预测试
       */
      preparation () {
        this.preparationDataLoading = true
        new Promise((resolve, reject) => {
          getPrepareTestInfo().then(res => {
            // console.log(res)
            this.preparationId = res.testId
            this.questionRawText = res.questionContent
            this.questionTipDetail = res.questionInfo.detail
            this.questionTip = res.questionInfo.tip
            this.questionAnswerTime = res.questionLimitTime
            resolve()
          }).catch(err => {
            // console.log('err: ', err)
            reject(err)
          })
        }).then(() => {
          this.preparationDataLoading = false
        }).catch()
      },

      /**
       * 重新测试
       */
      retest () {
        // 重新测试
        this.preparation()
      }
    }
  }
</script>

<style scoped>

</style>
