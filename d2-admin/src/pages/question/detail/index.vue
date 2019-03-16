<template>
  <div>
    <el-row>
      <h1>题目原文</h1>
      <p>{{ cur_question.rawText }}</p>
    </el-row>

    <el-row>
      <h1>Keywords</h1>
      <div v-for="keyword_pair in cur_question.keywords">
        <synonyms :synonyms-pairs="keyword_pair"></synonyms>
      </div>
    </el-row>

    <el-row>
      <h1>Mainwords</h1>
      <div v-for="keyword_pair in cur_question.keywords">
        <synonyms :synonyms-pairs="keyword_pair"></synonyms>
      </div>
    </el-row>

    <div v-for="(detailwords_per_sentence, index) in cur_question.detailwords">
      <el-row>
        <h1>Detailwords {{ index + 1 }}</h1>
        <div v-for="detailword_pair in detailwords_per_sentence">
          <synonyms :synonyms-pairs="detailword_pair"></synonyms>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
  import synonyms from './synonyms'
  import {get_question} from '@/api/question'

  export default {
    name: "question-detail",
    props: {
      // 要查看的题目ID
      'questionId': String
    },
    components: {
      synonyms
    },
    data() {
      return {
        filename: __filename,
        cur_question: {}
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
          get_question(id).then(res => {
            // console.log(res)
            this.cur_question = res
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