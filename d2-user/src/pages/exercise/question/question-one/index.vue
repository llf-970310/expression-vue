<!--【题型一】朗读-->
<template>
  <div>
    <answer :is-text-showing="true" :text="text"
            :time-to-count="timeToCount"
            :is-preparation="false"
            @next="finishAnswer">
    </answer>
  </div>
</template>

<script>
  import answer from '../components/answer'

  export default {
    name: "question-one",
    components: {
      answer
    },
    props: {
      text: String
    },
    data() {
      const readTimeLimitConst = 60 * 1000

      return {
        timeToCount: readTimeLimitConst
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