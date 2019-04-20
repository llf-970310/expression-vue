<template>
  <div v-loading="questionLoading">
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
      <div class="new-synonyms">
        <el-button size="small" @click="handleNewKeywordSynonymsPair">+ 添加一组同义词</el-button>
      </div>
    </el-row>

    <div v-for="(detailwordsPerSentence, index) in curQuestion.detailwords">
      <el-row>
        <h1>Detailwords {{ index + 1 }}</h1>
        <div v-for="(detailwordPair, pairIndex) in detailwordsPerSentence">
          <synonyms-modifiable :synonyms-pairs="detailwordPair"
                               @delete="handleDeleteDetailwordSynonymsPair(index, pairIndex)">
          </synonyms-modifiable>
        </div>
        <div class="new-synonyms">
          <el-button size="small" @click="handleNewDetailwordSynonymsPair(index)">+ 添加一组同义词</el-button>
          <el-button size="small" @click="handleDeleteDetailwords(index)">- 删除该组 Detailwords</el-button>
        </div>
      </el-row>
    </div>

    <div class="new-detail">
      <el-button @click="handleNewDetailwords">添加一组 Detailwords</el-button>
    </div>

    <el-row type="flex" justify="center">
      <el-button type="success" @click="confirmModification">
        <div v-if="modifiedQuestionId">确认修改</div>
        <div v-else>确认保存</div>
      </el-button>
      <el-button type="warning" @click="resetComponent">重置</el-button>

      <!--题目导入时-->
      <el-button v-if="newFromPool" type="danger" @click="discard">丢弃</el-button>

      <el-button v-if="modifiedQuestionId" type="primary" @click="goBackToQuestionDetail">返回</el-button>
      <el-button v-else type="primary" @click="goBackToAllQuestions">返回</el-button>
    </el-row>
  </div>
</template>

<script>
  import SynonymsModifiable from './synonyms-modifiable'
  import {
    getQuestion,
    getQuestionFromPool,
    deleteQuestionFromPool,
    newQuestion,
    modifyQuestion
  } from '@/api/manager.question'

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
        questionLoading: true,
        curQuestion: {
          rawText: '',
          keywords: [[]],
          detailwords: [[[]]]
        },

        // 若 newFromPool = true，则会初始化此参数
        idFromPool: '',

        // 修改/保存成功
        changeSucceeded: false,
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.questionLoading = true

        if (this.modifiedQuestionId) {
          // 修改题目
          new Promise((resolve, reject) => {
            getQuestion(this.modifiedQuestionId).then(res => {
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
        } else {
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
            }).then(() => {
              this.questionLoading = false
            }).catch(err => {
            })
          } else {
            // 新建题目
            this.curQuestion = {
              rawText: '',
              keywords: [[]],
              detailwords: [[[]]]
            }
            this.questionLoading = false
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

      // 成功保存
      successSave() {
        // 传给父组件的状态变更
        this.changeSucceeded = true
        this.$message({
          message: '已成功保存！',
          type: 'success',
          center: true,
          showClose: true,
          duration: 5000
        });

        if (this.modifiedQuestionId) {
          // 修改题目不需要重新初始化，返回详情界面
          this.$emit('back', this.modifiedQuestionId)
        } else {
          // 成功保存后，重新初始化组件，连续化工作流程
          this.init()
        }
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

      // 丢弃此题目
      discard() {
        this.$confirm('确认丢弃题目吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          new Promise((resolve, reject) => {
            console.log(this.idFromPool)
            deleteQuestionFromPool(this.idFromPool).then(res => {
              resolve()
            }).catch(err => {
              console.log('err: ', err)
              reject(err)
            })
          }).then(() => {
            this.init()
            this.$message({
              type: 'success',
              message: '已为您导入题库中新题目!'
            })
          }).catch(err => {
          })
        }).catch()
      },

      // 返回全部问题界面
      goBackToAllQuestions() {
        this.$emit('back', this.changeSucceeded)
      },

      // 返回全部问题界面
      goBackToQuestionDetail() {
        this.$emit('back', this.modifiedQuestionId)
      }
    }
  }
</script>

<style scoped>
  .new-synonyms {
    margin-top: 5px;
  }

  .new-detail {
    margin-top: 30px;
  }
</style>