<template>
  <div v-if="isNoticeShowing">
    <notice @noticed="isNoticeShowing=false"></notice>
  </div>
  <div v-else>
    <preparation v-loading="preparationDataLoading"
                 :question-tip-detail="questionTipDetail" :question-tip="questionTip"
                 :preparation-id="preparationId"
                 :question-raw-text="questionRawText"
                 :question-preparation-time="questionPreparationTime"
                 :question-answer-time="questionAnswerTime"
                 :audio-volume="audioVolume"
                 @retest="retest"
                 @prepared="$emit('prepared')">
    </preparation>
  </div>
</template>

<script>
  import Preparation from './preparation'
  import Notice from './notice'
  import { getPrepareTestInfo } from '@/api/question'

  export default {
    name: "preparation-index",
    components: {
      'preparation': Preparation,
      'notice': Notice,
    },
    data() {
      return {
        // 展示温馨提示
        isNoticeShowing: true,

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
        questionPreparationTime: 0,
        questionAnswerTime: 0,

        // 音量大小
        audioVolume: 0,
      }
    },

    mounted() {
      this.preparation()
    },

    methods: {
      /**
       * 新建一次预测试
       */
      preparation() {
        this.preparationDataLoading = true
        new Promise((resolve, reject) => {
          getPrepareTestInfo().then(res => {
            console.log(res)
            this.preparationId = res['test_id']
            this.questionRawText = res.questionContent
            this.questionTipDetail = res.questionInfo.detail
            this.questionTip = res.questionInfo.tip
            this.questionPreparationTime = res.readLimitTime
            this.questionAnswerTime = res.questionLimitTime

            resolve()
          }).catch(err => {
            console.log('err: ', err)
            reject(err)
          })
        }).then(() => {
          this.preparationDataLoading = false
        }).catch()
      },

      /**
       * 重新测试
       */
      retest() {
        // 重新展示温馨提示界面
        this.isNoticeShowing = true;

        // 重新测试
        this.preparation()
      }
    }
  }
</script>

<style scoped>

</style>