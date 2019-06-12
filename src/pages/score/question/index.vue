<template>
  <div>
    <!--按题目查看-->
    <el-row>
      <el-col :span="10" :offset="7">
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

    <div v-if="searchedQuestionId">
      <!--指定查询-->
      <score-representation :title-distribution="titleDistributionSpecific"
                            :title-change="titleChangeSpecific"
                            distribution-legend="区间人数"
                            :variables="dates"
                            :variable='variable'
                            variable-name="日期"
                            :score-data="scoreData">
      </score-representation>

      <div class="d2-text-center">
        <el-button type="primary" @click="backToOverview" class="back">返回查看概况</el-button>
      </div>
    </div>
    <div v-else>
      <!--概况-->
      <score-representation title-distribution="各题目平均分的成绩分布情况"
                            title-change="各题目平均分的成绩变化情况"
                            distribution-legend="区间题数"
                            :variables="questions"
                            :variable='variable'
                            variable-name="题目编号"
                            :score-data="scoreData">
      </score-representation>
    </div>

  </div>
</template>

<script>
  import ScoreRepresentation from '../components/score-representation'

  import {validateQuestionId} from '@/libs/validator'
  import {extractVariableAsList} from '@/libs/my-util'
  import {getScoreOfQuestions, getScoreOfSpecoficQuestion} from '@/api/manager.score'

  export default {
    name: "score-question",
    components: {
      'score-representation': ScoreRepresentation
    },
    data() {
      return {
        // 搜索框部分
        questionSearchForm: {
          questionId: ''
        },
        questionSearchRules: {
          questionId: [{required: true, trigger: 'blur', validator: validateQuestionId}]
        },

        // 查看详情部分
        searchedQuestionId: '',

        // 成绩变化图x轴自变量
        variable: '',

        // 具体数据
        scoreData: [],
        questions: [],
        dates: [],
      }
    },
    computed: {
      titleDistributionSpecific() {
        return `题目 ${this.searchedQuestionId} 的成绩分布情况`
      },

      titleChangeSpecific() {
        return `题目 ${this.searchedQuestionId} 的成绩变化情况`
      }
    },
    mounted() {
      this.initOverview()
    },
    watch: {
      searchedQuestionId: function (val, oldVal) {
        if (val === '') {
          this.initOverview()
        } else {
          this.initByQuestionId()
        }
      }
    },
    methods: {
      searchQuestion() {
        this.$refs['questionSearchForm'].validate((valid) => {
          if (valid) {
            this.searchedQuestionId = parseInt(this.questionSearchForm.questionId)
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },

      backToOverview() {
        this.searchedQuestionId = ''
      },

      // 未指定具体的题目编号，查看总体情况
      initOverview() {
        console.log('question initOverview')
        new Promise((resolve, reject) => {
          getScoreOfQuestions().then(res => {
            const result = res.result
            console.log(result)

            this.scoreData = result

            this.variable = 'questionId'
            this.questions = extractVariableAsList(result, this.variable)
            console.log(this.questions)

            resolve()
          }).catch(err => {
            console.log('err: ', err)
            reject(err)
          })
        }).then().catch()
      },


      // 通过问题编号具体查询
      initByQuestionId() {
        console.log('initByQuestionId')
        console.log(this.searchedQuestionId)
        new Promise((resolve, reject) => {
          getScoreOfSpecoficQuestion(this.searchedQuestionId).then(res => {
            const result = res.result
            console.log(result)

            this.scoreData = result

            this.variable = 'date'
            this.dates = extractVariableAsList(result, this.variable)
            console.log(this.dates)

            resolve()
          }).catch(err => {
            console.log('err: ', err)
            reject(err)
          })
        }).then().catch()
      },
    }
  }
</script>

<style scoped>
  .back {
    margin-top: 15px;
  }
</style>