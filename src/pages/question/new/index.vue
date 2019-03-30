<template>
  <div>
    <el-row>
      <h1>题目原文</h1>
      <el-input
          type="textarea"
          :rows="4"
          placeholder="请输入题目原文"
          v-model="curQuestion.rawText">
      </el-input>
    </el-row>

    <el-row>
      <h1>Keywords</h1>
      <div v-for="keywordPair in curQuestion.keywords">
        <synonyms-modifiable :synonyms-pairs="keywordPair"></synonyms-modifiable>
      </div>
      <el-button size="small" @click="handleNewKeywordSynonymsPair">+ 添加同义词列表</el-button>
    </el-row>

    <el-row>
      <h1>Mainwords</h1>
      <div v-for="mainwordPair in curQuestion.mainwords">
        <synonyms-modifiable :synonyms-pairs="mainwordPair"></synonyms-modifiable>
      </div>
      <el-button size="small" @click="handleNewMainwordSynonymsPair">+ 添加同义词列表</el-button>
    </el-row>

    <div v-for="(detailwordsPerSentence, index) in curQuestion.detailwords">
      <el-row>
        <h1>Detailwords {{ index + 1 }}</h1>
        <div v-for="detailwordPair in detailwordsPerSentence">
          <synonyms-modifiable :synonyms-pairs="detailwordPair"></synonyms-modifiable>
        </div>
        <el-button size="small" @click="handleNewDetailwordSynonymsPair(index)">+ 添加同义词列表</el-button>
        <el-button size="small" @click="handleDeleteDetailwordSynonymsPair(index)">- 删除该组同义词</el-button>
      </el-row>
    </div>

    <el-button @click="handleNewDetailwords" class="new-detail-btn">添加一组 Detailwords</el-button>

    <div class="d2-text-center">
      <el-button type="success" @click="confirmModification">确认修改</el-button>
      <el-button type="danger" @click="resetComponent">重置</el-button>
      <el-button type="primary" @click="goBackToAllQuestions">返回</el-button>
    </div>
  </div>
</template>

<script>
  import SynonymsModifiable from './synonyms-modifiable'
  import {getQuestion} from '@/api/manager.question'

  export default {
    name: "new-question",
    components: {
      'synonyms-modifiable': SynonymsModifiable
    },
    props: {
      // 是否从题库中新建
      'newFromPool': Boolean
    },
    data() {
      return {
        curQuestion: {}
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        if (this.newFromPool) {
          new Promise((resolve, reject) => {
            getQuestion(2).then(res => {
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
      },

      // 新增keywords同义词列表
      handleNewKeywordSynonymsPair() {
        this.curQuestion.keywords.push([])
      },

      // 新增mainwords同义词列表
      handleNewMainwordSynonymsPair() {
        this.curQuestion.mainwords.push([])

      },

      // 新增detailwords同义词列表
      handleNewDetailwordSynonymsPair(index) {
        this.curQuestion.detailwords[index].push([])

      },

      // 删除detailwords同义词列表
      handleDeleteDetailwordSynonymsPair(index) {
        this.curQuestion.detailwords.splice(index, 1)
      },

      // 新增一组Detailwords
      handleNewDetailwords() {
        this.curQuestion.detailwords.push([[]])
      },


      // 确认修改保存
      confirmModification() {

      },

      // 重置
      resetComponent() {
        this.$confirm('确认重置此题目吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.init()
          this.$message({
            type: 'success',
            message: '重置成功!'
          })
        }).catch()

      },

      // 返回全部问题界面
      goBackToAllQuestions() {
        this.$emit('back')
      }
    }
  }
</script>

<style scoped>
  .new-detail-btn {
    margin-top: 30px;
  }
</style>