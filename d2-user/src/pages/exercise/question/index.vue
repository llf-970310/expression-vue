<!--【一道题目】，包含<题目tip + 准备时间（可选） + 回答时间>-->
<template>
  <div>

    <!--题目编号-->
    <el-row class="d2-text-center">
      {{ questionIndex }}
    </el-row>

    <!--题目tip-->
    <div v-if="isTipShowing">
      <tip :detail="curDetailOfQuestion" :tip="curTipOfQuestion" @showQuestion="showQuestion"></tip>
    </div>

    <!--题目内容 TODO-->
    <question-one v-if="questionType === 1"></question-one>
    <question-two v-if="questionType === 2"></question-two>
    <question-three v-if="questionType === 3"></question-three>
  </div>
</template>

<script>
  import tip from './components/tip'
  import QuestionOne from './question-one/index'
  import QuestionTwo from './question-two/index'
  import QuestionThree from './question-three/index'

  import { getTipOfQuestions } from './components/tip-func'

  export default {
    name: "question-frame",
    components: {
      tip,
      'question-one': QuestionOne,
      'question-two': QuestionTwo,
      'question-three': QuestionThree,
    },
    props: {
      questionIndex: Number,
      questionType: Number
    },
    data() {
      return {
        // tip 部分
        curDetailOfQuestion: '',
        curTipOfQuestion: '',
        isTipShowing: true
      }
    },
    mounted() {
      const tipOfSpecificQuestion = this.getTipOfSpecificQuestion(this.questionType)
      this.curDetailOfQuestion = tipOfSpecificQuestion.detail
      this.curTipOfQuestion = tipOfSpecificQuestion.tip
    },
    methods: {
      getTipOfSpecificQuestion(type) {
        const questionTypeTip = getTipOfQuestions()
        return questionTypeTip[type]
      },
      // 点击「显示题目」
      showQuestion: function () {
        this.isTipShowing = false
      }
    }

  }
</script>

<style scoped>

</style>