<!--【题型二】转述-->
<template>
  <div>
    <!--准备-->
    <div v-if="isPreparation">
      <answer :is-text-showing="true" :text="text"
              :time-to-count="preparationTimeByMilliSec"
              :is-preparation="true"
              @direct="finishPreparation">
      </answer>
    </div>

    <!--回答-->
    <div v-else>
      <answer :is-text-showing="false"
              :time-to-count="answerTimeByMilliSec"
              :is-preparation="false"
              @next="finishAnswer">
      </answer>
    </div>
  </div>
</template>

<script>
  import answer from '../components/answer'

  export default {
    name: "question-two",
    components: {
      answer
    },
    props: {
      // 显示的文本
      text: String,

      // 准备/回答的时长限制
      preparationTime: Number,
      answerTime: Number

    },
    computed: {
      preparationTimeByMilliSec: function () {
        return this.preparationTime * 1000
      },

      answerTimeByMilliSec: function () {
        return this.answerTime * 1000
      }
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
      },
      finishAnswer() {
        this.$emit('next')
      }
    }
  }
</script>

<style scoped>

</style>