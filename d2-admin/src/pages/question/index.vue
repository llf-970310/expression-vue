<!--题目管理界面-->
<template>
  <d2-container :filename="filename">
    <template slot="header">题目管理</template>

    <!--查看题目详情-->
    <div>
      <!--通过题号搜索-->
      <el-row>
        <el-col :span="10" :offset="7">
          <el-form :inline="true" :model="questionSearchForm" :rules="questionSearchRules" ref="questionSearchForm">
            <el-form-item label="题目编号" prop="questionId">
              <el-input v-model="questionSearchForm.questionId" placeholder="请输入题号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchQuestion">查询题目</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <!--该题目详情-->
      <div v-if="searchedQuestionId !== ''">
        <question-detail :question-id="searchedQuestionId"></question-detail>
      </div>

      <!--所有题目-->
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

    </div>
  </d2-container>
</template>

<script>
  import QuestionDetail from './detail/index'
  import {getAllQuestions} from '@api/question'

  export default {
    name: "question",
    components: {
      'question-detail': QuestionDetail
    },
    data() {
      const validateQuestionId = (rule, value, callback) => {
        // console.log('value: ' + value)
        let reg = /^[0-9]+$/
        if (!reg.test(value)) {
          return callback(new Error('题号只包含数字'))
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

        // 所有题目部分
        allQuestions: []
      }
    },
    mounted: function () {
      new Promise((resolve, reject) => {
        getAllQuestions(1, 50).then(res => {
          console.log(res)
          // TODO res.count 页数分页
          this.allQuestions = res.questions
          resolve()
        }).catch(err => {
          console.log('err: ', err)
          reject(err)
        })
      }).then().catch()
    },
    methods: {
      searchQuestion() {
        this.$refs['questionSearchForm'].validate((valid) => {
          if (valid) {
            this.searchedQuestionId = this.questionSearchForm.questionId
          } else {
            console.log('error submit!!')
            return false;
          }
        })
      },
      searchQuestionByClick(currentRow, oldCurrentRow) {
        this.questionSearchForm.questionId = currentRow.questionId
        this.searchedQuestionId = currentRow.questionId
      }
    }
  }
</script>

<style scoped>

</style>