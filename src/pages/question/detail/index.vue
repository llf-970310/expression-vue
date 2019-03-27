<template>
  <div>
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

    <el-row>
      <h1>Mainwords</h1>
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
  </div>
</template>

<script>
  import synonyms from './synonyms'
  import {getQuestion} from '@/api/question'

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
        filename: __filename,
        curQuestion: {}
      }
    },
    mounted() {
      console.log('Mounted question detail.')
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
        new Promise((resolve, reject) => {
          getQuestion(id).then(res => {
            // console.log(res)
            this.curQuestion = res
            resolve()
          }).catch(err => {
            console.log('err: ', err)
            reject(err)
          })
        }).catch(err => {
        })
      }
    }
  }
</script>

<style scoped>

</style>