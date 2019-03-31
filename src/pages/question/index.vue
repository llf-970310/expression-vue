<!--题目管理界面-->
<template>
  <d2-container :filename="filename">
    <template slot="header">题目管理</template>

    <div>
      <!--通过题号搜索-->
      <el-row>
        <el-col :span="7">
          <el-button-group>
            <el-button type="success" @click="handleNewQuestion" icon="el-icon-plus">新增题目</el-button>
            <el-button type="success" @click="handleNewQuestionFromPool">题库导入
              <i class="el-icon-refresh"></i>
            </el-button>
          </el-button-group>
        </el-col>
        <el-col :span="10">
          <el-form :inline="true" :model="questionSearchForm" :rules="questionSearchRules" ref="questionSearchForm">
            <el-form-item label="题目编号" prop="questionId">
              <el-input v-model.trim="questionSearchForm.questionId" placeholder="请输入题目编号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchQuestion">查询题目</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <!--该题目详情-->
      <div v-if="searchedQuestionId !== ''">
        <question-detail :question-id="searchedQuestionId"
                         @modify="goToModifyQuestion"
                         @back="goBackToAllQuestions">
        </question-detail>
      </div>

      <!--新增/修改题目-->
      <div v-if="isEditableQuestion">
        <div v-if="modifiedQuestionId">
          <new-question :key="modifiedQuestionId"
                        :modified-question-id="modifiedQuestionId"
                        @back="goBackToAllQuestions">
          </new-question>
        </div>
        <div v-else>
          <!--增加key值区分，以保证新增题目/词库导入切换时不会复用-->
          <new-question :key="isNewFromPool"
                        :new-from-pool="isNewFromPool"
                        @back="goBackToAllQuestions">
          </new-question>
        </div>
      </div>

      <!--所有题目-->
      <div v-show="showAllQuestions">
        <el-table :data="allQuestions" border stripe highlight-current-row @current-change="searchQuestionByClick"
                  style="width: 100%">
          <el-table-column
              prop="questionId"
              label="题号"
              width="50">
          </el-table-column>
          <el-table-column
              prop="rawText"
              label="题目原文">
          </el-table-column>
          <el-table-column
              prop="keywords"
              label="keywords"
              width="180">
          </el-table-column>
          <el-table-column
              prop="mainwords"
              label="mainwords"
              width="180">
          </el-table-column>
          <el-table-column
              prop="detailwords"
              label="detailwords"
              width="250">
          </el-table-column>
        </el-table>

        <el-row class="d2-text-center pagination">
          <el-pagination
              @size-change="curSizePerPageChanged"
              @current-change="curPageChanged"
              :current-page="curPage"
              :page-sizes="[10, 25, 50, 100, 200]"
              :page-size="curSizePerPage"
              layout="prev, pager, next, total, sizes"
              :total="totalCount">
          </el-pagination>
        </el-row>

      </div>
    </div>
  </d2-container>
</template>

<script>
  import QuestionDetail from './detail/index'
  import NewQuestion from './new/index'
  import {getAllQuestions} from '@api/manager.question'

  export default {
    name: "question",
    components: {
      'question-detail': QuestionDetail,
      'new-question': NewQuestion
    },
    data() {
      const validateQuestionId = (rule, value, callback) => {
        // console.log('value: ' + value)
        if (value === '') {
          return callback(new Error('题目编号不可为空'))
        }

        let reg = /^[0-9]+$/
        if (!reg.test(value)) {
          return callback(new Error('题目编号只包含数字'))
        } else {
          callback()
        }
      }
      return {
        filename: __filename,

        // 题目搜索部分
        questionSearchForm: {
          questionId: ''
        },
        questionSearchRules: {
          questionId: [{required: true, trigger: 'blur', validator: validateQuestionId}]
        },

        // 要查看的题目详情部分
        searchedQuestionId: '',

        // 新建/修改题目部分
        isEditableQuestion: false,
        isNewFromPool: false,
        modifiedQuestionId: '',

        // 所有题目部分
        allQuestions: [],
        // 总条数
        totalCount: 1,
        // 当前页数
        curPage: 1,
        // 每页条数
        curSizePerPage: 50
      }
    },
    computed: {
      showAllQuestions: function () {
        return this.searchedQuestionId === '' && !this.isEditableQuestion
      }
    },
    mounted: function () {
      this.initQuestions()
    },
    methods: {
      initQuestions() {
        new Promise((resolve, reject) => {
          getAllQuestions(this.curPage, this.curSizePerPage).then(res => {
            console.log(res)
            this.allQuestions = res.questions
            this.totalCount = res.count
            resolve()
          }).catch(err => {
            console.log('err: ', err)
            reject(err)
          })
        }).then().catch()
      },

      // 新建题目
      handleNewQuestion() {
        this.searchedQuestionId = ''
        this.isEditableQuestion = true
        this.isNewFromPool = false
        this.modifiedQuestionId = ''
      },
      // 词库导入
      handleNewQuestionFromPool() {
        this.searchedQuestionId = ''
        this.isEditableQuestion = true
        this.isNewFromPool = true
        this.modifiedQuestionId = ''
      },

      searchQuestion() {
        this.$refs['questionSearchForm'].validate((valid) => {
          if (valid) {
            this.searchedQuestionId = parseInt(this.questionSearchForm.questionId)
            this.isEditableQuestion = false
          } else {
            console.log('error submit!!')
            return false;
          }
        })
      },
      searchQuestionByClick(currentRow, oldCurrentRow) {
        this.questionSearchForm.questionId = currentRow.questionId
        this.searchedQuestionId = currentRow.questionId
        this.isEditableQuestion = false
      },

      // 去修改题目的界面
      goToModifyQuestion(questionId) {
        this.searchedQuestionId = ''
        this.isEditableQuestion = true
        this.modifiedQuestionId = questionId
      },

      // 返回显示所有题目的主界面
      goBackToAllQuestions() {
        this.searchedQuestionId = ''
        this.isEditableQuestion = false
        this.modifiedQuestionId = ''
      },

      curPageChanged(val) {
        // console.log(`当前页: ${val}`);
        this.initQuestions()
      },
      curSizePerPageChanged(val) {
        // 每页大小变化之后，总是回到第一页 TODO 组件自动变更，无法更改
        // this.curPage = 1
        // console.log(`每页 ${val} 条`);
        this.initQuestions()
      }

    }
  }
</script>

<style scoped>
  .pagination {
    margin-top: 15px;
  }
</style>