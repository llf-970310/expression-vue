<!--【题型一】朗读-->
<template>
  <div>
    <!--准备-->
    <div v-if="isPreparation">
      <answer :key="isPreparation"
              :is-text-showing="true" :text="text"
              :time-to-count="preparationTime"
              :is-preparation="true"
              @direct="finishPreparation">
      </answer>
    </div>

    <!--回答-->
    <div v-else>
      <answer :key="isPreparation"
              :is-text-showing="true" :text="text"
              :time-to-count="answerTime"
              :is-preparation="false"
              :audio-volume="audioVolume"
              @next="finishAnswer">
      </answer>
    </div>
  </div>
</template>

<script>
  import answer from '../../components/answer'

  export default {
    name: "question-one",
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
        isPreparation: true
      }
    },
    methods: {
      finishPreparation() {
        this.isPreparation = false
        this.$emit('nextStep')
      },
      finishAnswer() {
        this.$emit('next')
      }
    }
  }
</script>

<style scoped>

</style>
