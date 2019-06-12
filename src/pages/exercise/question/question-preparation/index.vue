<!--【预测试题】-->
<template>
  <div>
    <!--准备-->
    <div v-if="isPreparation">
      <answer :key="isPreparation"
              :is-text-showing="true" :text="text"
              :time-to-count="preparationTimeByMilliSec"
              :is-preparation="true"
              @direct="finishPreparation">
      </answer>
    </div>

    <!--回答-->
    <div v-else>
      <answer :key="isPreparation"
              :is-text-showing="true" :text="text"
              :time-to-count="answerTimeByMilliSec"
              :is-preparation="false"
              :audio-volume="audioVolume"
              @next="finishAnswer">
      </answer>
    </div>
  </div>
</template>

<script>
  import answer from '../components/answer'

  export default {
    name: "question-preparation",
    components: {
      answer
    },
    props: {
      // 显示的文本
      text: String,

      // 准备/回答的时长限制
      preparationTime: Number,
      answerTime: Number,

      // 音量大小
      audioVolume: Number,

    },
    data() {
      return {
        // 是否正在准备中
        isPreparation: true,
      }
    },

    computed: {
      preparationTimeByMilliSec: function () {
        return this.preparationTime * 1000
      },

      answerTimeByMilliSec: function () {
        return this.answerTime * 1000
      }
    },
    methods: {
      finishPreparation() {
        this.isPreparation = false
      },
      finishAnswer() {
        this.$emit('next')
      }
    }
  }
</script>

<style scoped>

</style>