<!--成绩管理界面-->
<template>
  <d2-container :filename="filename">
    <!--<template slot="header">成绩管理</template>-->

    <el-tabs v-model="activatedTabName">
      <el-tab-pane label="按题目" name="question" :lazy=true>
        <score-question></score-question>
      </el-tab-pane>
      <el-tab-pane label="按用户" name="user" :lazy=true>
        <score-user></score-user>
      </el-tab-pane>
    </el-tabs>

  </d2-container>
</template>

<script>
  import ScoreQuestion from './question/index'
  import ScoreUser from './user/index'

  export default {
    name: "score",
    components: {
      'score-question': ScoreQuestion,
      'score-user': ScoreUser
    },
    data() {
      return {
        filename: __filename,

        activatedTabName: 'question'

      }
    },
    methods: {}
  }
</script>

<style scoped>

</style>