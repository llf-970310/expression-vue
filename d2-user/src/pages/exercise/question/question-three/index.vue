<!--【题型三】表达-->
<template>
  <div>
    <!--准备-->
    <div v-if="isPreparation">
      <answer :is-text-showing="true" :text="text"
              :time-to-count="preparationTimeToCount"
              :is-preparation="true"
              @direct="finishPreparation">
      </answer>
    </div>

    <!--回答-->
    <div v-else>
      <answer :is-text-showing="true" :text="text"
              :time-to-count="answerTimeToCount"
              :is-preparation="false"
              @next="finishAnswer">
      </answer>
    </div>
  </div>
</template>

<script>
  import answer from '../components/answer'

  export default {
    name: "question-three",
    components: {
      answer
    },
    props: {
      text: String
    },
    data() {
      const preparationTimeLimitConst = 60 * 1000
      const answerTimeLimitConst = 120 * 1000

      return {
        // 准备/回答的时长限制
        preparationTimeToCount: preparationTimeLimitConst,
        answerTimeToCount: answerTimeLimitConst,

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