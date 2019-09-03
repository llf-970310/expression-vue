<template>
  <div v-loading="questionLoading">
    <el-row>
      <h1>题目原文</h1>
      <p>{{ curQuestion.rawText }}</p>
    </el-row>

    <el-row>
      <h1>Keywords</h1>
      <div v-for="keywordPair in curQuestion.keywords">
        <synonyms :synonyms-pairs="keywordPair"></synonyms>
      </div>
    </el-row>

    <div v-for="(detailwordsPerSentence, index) in curQuestion.detailwords">
      <el-row>
        <h1>Detailwords {{ index + 1 }}</h1>
        <div v-for="detailwordPair in detailwordsPerSentence">
          <synonyms :synonyms-pairs="detailwordPair"></synonyms>
        </div>
      </el-row>
    </div>

    <div class="d2-text-center">
      <el-button type="warning" @click="modifyQuestion">修改</el-button>
      <el-button type="danger" @click="deleteQuestion">删除</el-button>
      <el-button type="primary" @click="goBackToAllQuestions">返回</el-button>
    </div>
  </div>
</template>

<script>
  import synonyms from './synonyms'
  import {getQuestion, delQuestion} from '@/api/manager.question'

  export default {
    name: "question-detail",
    props: {
      // 要查看的题目ID
      'questionId': Number
    },
    components: {
      synonyms
    },
    data() {
      return {
        questionLoading: true,
        curQuestion: {}
      }
    },
    mounted() {
      // console.log('Mounted question detail.')
      this.init(this.questionId)
    },
    watch: {
      questionId: {
        handler: function (newVal, oldVal) {
          this.init(newVal)
        }
      }
    },
    methods: {
      init(id) {
        this.questionLoading = true
        new Promise((resolve, reject) => {
          getQuestion(id).then(res => {
            // console.log(res)
            this.curQuestion = res
            resolve()
          }).catch(err => {
            console.log('err: ', err)
            reject(err)
          })
        }).then(() => {
          this.questionLoading = false
        }).catch(err => {
        })
      },

      // 请求修改问题
      modifyQuestion() {
        this.$emit('modify', this.questionId)
      },

      // 请求删除问题
      deleteQuestion() {
        this.$confirm('确认删除此题目吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          new Promise((resolve, reject) => {
            delQuestion(this.questionId).then(() => {
              resolve()
            }).catch(err => {
              console.log('err: ', err)
              reject(err)
            })
          }).then(() => {
            this.$message({
              type: 'success',
              message: '已成功删除该题目!',
              center: true,
              showClose: true,
              duration: 5000
            })

            // 返回所有题目的界面，并要求重新加载
            this.$emit('back', true)
          }).catch()
        }).catch()

      },

      // 直接返回查看所有题目的界面
      goBackToAllQuestions() {
        this.$emit('back', false)
      }
    }
  }
</script>

<style scoped>

</style>