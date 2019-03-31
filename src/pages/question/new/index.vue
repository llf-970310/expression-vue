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
      <div v-for="(keywordPair, pairIndex) in curQuestion.keywords">
        <synonyms-modifiable :synonyms-pairs="keywordPair"
                             @delete="handleDeleteKeywordSynonymsPair(pairIndex)">
        </synonyms-modifiable>
      </div>
      <el-button size="small" @click="handleNewKeywordSynonymsPair">+ 添加一组同义词</el-button>
    </el-row>

    <el-row>
      <h1>Mainwords</h1>
      <div v-for="(mainwordPair, pairIndex) in curQuestion.mainwords">
        <synonyms-modifiable :synonyms-pairs="mainwordPair"
                             @delete="handleDeleteMainwordSynonymsPair(pairIndex)">
        </synonyms-modifiable>
      </div>
      <el-button size="small" @click="handleNewMainwordSynonymsPair">+ 添加一组同义词</el-button>
    </el-row>

    <div v-for="(detailwordsPerSentence, index) in curQuestion.detailwords">
      <el-row>
        <h1>Detailwords {{ index + 1 }}</h1>
        <div v-for="(detailwordPair, pairIndex) in detailwordsPerSentence">
          <synonyms-modifiable :synonyms-pairs="detailwordPair"
                               @delete="handleDeleteDetailwordSynonymsPair(index, pairIndex)">
          </synonyms-modifiable>
        </div>
        <el-button size="small" @click="handleNewDetailwordSynonymsPair(index)">+ 添加一组同义词</el-button>
        <el-button size="small" @click="handleDeleteDetailwords(index)">- 删除该组 Detailwords</el-button>
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
  import {getQuestion, getQuestionFromPool, newQuestion, modifyQuestion} from '@/api/manager.question'

  export default {
    name: "new-question",
    components: {
      'synonyms-modifiable': SynonymsModifiable
    },
    props: {
      // 是否从题库中新建
      'newFromPool': Boolean,

      // 是否为修改题目，是则此参数为被修改的id
      'modifiedQuestionId': Number,
    },
    data() {
      return {
        curQuestion: {
          rawText: '',
          keywords: [[]],
          mainwords: [[]],
          detailwords: [[[]]]
        },

        // 若 newFromPool = true，则会初始化此参数
        idFromPool: '',
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        if (this.modifiedQuestionId) {
          new Promise((resolve, reject) => {
            getQuestion(this.modifiedQuestionId).then(res => {
              // console.log(res)
              this.curQuestion = res
              resolve()
            }).catch(err => {
              console.log('err: ', err)
              reject(err)
            })
          }).catch(err => {
          })
        } else {
          // 修改题目
          if (this.newFromPool) {
            // 词库导入
            new Promise((resolve, reject) => {
              getQuestionFromPool().then(res => {
                // console.log(res)
                this.curQuestion = res.question
                this.idFromPool = res.id
                resolve()
              }).catch(err => {
                console.log('err: ', err)
                reject(err)
              })
            }).catch(err => {
            })
          } else {
            // 新建题目
            this.curQuestion = {
              rawText: '',
              keywords: [[]],
              mainwords: [[]],
              detailwords: [[[]]]
            }
          }
        }
      },

      // 新增 Keywords 同义词列表
      handleNewKeywordSynonymsPair() {
        this.curQuestion.keywords.push([])
      },

      // 删除 Keywords 同义词列表
      handleDeleteKeywordSynonymsPair(index) {
        this.curQuestion.keywords.splice(index, 1)

        // 已经没有 Keywords 同义词时，默认增加一组
        if (this.curQuestion.keywords.length === 0) {
          this.handleNewKeywordSynonymsPair()
        }
      },

      // 新增 Mainwords 同义词列表
      handleNewMainwordSynonymsPair() {
        this.curQuestion.mainwords.push([])
      },

      // 删除 Mainwords 同义词列表
      handleDeleteMainwordSynonymsPair(index) {
        this.curQuestion.mainwords.splice(index, 1)

        // 已经没有 Mainwords 同义词时，默认增加一组
        if (this.curQuestion.mainwords.length === 0) {
          this.handleNewMainwordSynonymsPair()
        }
      },

      // 新增 Detailwords 同义词列表
      handleNewDetailwordSynonymsPair(index) {
        this.curQuestion.detailwords[index].push([])

      },

      // 删除 Detailwords 同义词列表
      handleDeleteDetailwordSynonymsPair(index, pairIndex) {
        this.curQuestion.detailwords[index].splice(pairIndex, 1)

        // 已经没有 Detailwords 同义词时，默认增加一组
        if (this.curQuestion.detailwords[index].length === 0) {
          this.handleNewDetailwordSynonymsPair(index)
        }
      },

      // 新增一组 Detailwords
      handleNewDetailwords() {
        this.curQuestion.detailwords.push([[]])
      },

      // 删除一组 Detailwords
      handleDeleteDetailwords(index) {
        this.curQuestion.detailwords.splice(index, 1)

        // 已经没有 Detailwords 时，默认增加一组
        if (this.curQuestion.detailwords.length === 0) {
          this.handleNewDetailwords()
        }

      },

      // 确认修改保存
      confirmModification() {
        if (this.modifiedQuestionId) {
          // 修改题目
          new Promise((resolve, reject) => {
            modifyQuestion(this.curQuestion, this.modifiedQuestionId).then(() => {
              this.successSave()
              resolve()
            }).catch(err => {
              console.log('err: ', err)
              reject(err)
            })
          }).catch(err => {
          })
        } else {
          if (this.newFromPool) {
            // 词库导入
            new Promise((resolve, reject) => {
              newQuestion(this.curQuestion, this.newFromPool, this.idFromPool).then(() => {
                this.successSave()
                resolve()
              }).catch(err => {
                console.log('err: ', err)
                reject(err)
              })
            }).catch(err => {
            })
          } else {
            // 新建题目
            new Promise((resolve, reject) => {
              newQuestion(this.curQuestion, this.newFromPool).then(() => {
                this.successSave()
                resolve()
              }).catch(err => {
                console.log('err: ', err)
                reject(err)
              })
            }).catch(err => {
            })
          }
        }
      },

      // 成功保存的提示
      successSave() {
        this.$message({
          message: '已成功保存！',
          type: 'success',
          center: true,
          showClose: true,
          duration: 5000
        });
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