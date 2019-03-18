<!--所有的题目控制-->
<template>
  <d2-container :filename="filename">
    <!--<template slot="header">做题r</template>-->

    <question-frame :question-index="1" :question-type="1"></question-frame>
  </d2-container>
</template>

<script>
  import QuestionFrame from './question/index'

  export default {
    name: "index",
    components: {
      'question-frame': QuestionFrame
    },
    data() {
      return {
        filename: __filename
      }
    }
  }
</script>

<style scoped>

</style>