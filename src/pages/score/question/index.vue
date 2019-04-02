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
      <score-representation :title-distribution="titleDistribution"
                            :title-change="titleChange"
                            :variables="dates"
                            :variable='variable'
                            :variable-name="variableNameDate"
                            :questions="questions"
                            :score-data="scoreData">
      </score-representation>

      <div class="d2-text-center">
        <el-button type="primary" @click="backToOverview">返回查看概况</el-button>
      </div>
    </div>
    <div v-else>
      <!--概况-->
      <score-representation :title-distribution="overviewTitleDistribution"
                            :title-change="overviewTitleChange"
                            :variables="questions"
                            :variable='variable'
                            :variable-name="variableNameQuestionId"
                            :questions="questions"
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

        // 概况图表标题
        overviewTitleDistribution: '各题目平均分的成绩分布情况',
        overviewTitleChange: '各题目平均分的成绩变化情况',

        // 成绩变化图x轴自变量
        variable: 'questionId',
        variableNameQuestionId: '题目编号',
        variableNameDate: '日期',

        // 具体数据
        scoreData: [],
        questions: [],
        dates: [],
        mainScore: [],
        detailScore: [],
        totalScore: [],
      }
    },
    computed: {
      titleDistribution() {
        return '题目' + this.searchedQuestionId + '的成绩分布情况'
      },

      titleChange() {
        return '题目' + this.searchedQuestionId + '的成绩变化情况'
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
            this.questions = extractVariableAsList(result, 'questionId')
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
        // this.dates = []
        // this.mainScore = []
        // this.detailScore = []
        // this.totalScore = []
        //
        // let base = +new Date(2017, 9, 3);
        // const oneDay = 24 * 3600 * 1000;
        // for (let i = 0; i < 200; i++) {
        //   let now = new Date(base += oneDay);
        //   this.dates.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
        //   this.mainScore.push(Math.floor(Math.random() * 100))
        //   this.detailScore.push(Math.floor(Math.random() * 100))
        //   this.totalScore.push(this.mainScore[i] * 0.7 + this.detailScore[i] * 0.3)
        // }
      },
    }
  }
</script>

<style scoped>

</style>