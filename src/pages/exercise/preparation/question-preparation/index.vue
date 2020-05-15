<!--【预测试题】-->
<template>
  <div>
      <answer key="false"
              :is-text-showing="true" :text="text"
              :time-to-count="answerTime"
              :is-preparation="false"
              :audio-volume="audioVolume"
              @next="finishAnswer">
      </answer>
  </div>
</template>

<script>
  import answer from '../../components/answer'

  export default {
    name: "question-preparation",
    components: {
      answer
    },
    props: {
      // 显示的文本
      text: String,

      // 准备/回答的时长限制
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
    methods: {
      finishAnswer() {
        this.$emit('next')
      }
    }
  }
</script>

<style scoped>

</style>
