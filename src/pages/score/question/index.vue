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

    <div v-loading="dataLoading">
      <div v-if="searchedQuestionId">
        <!--指定查询-->
        <score-representation :title-distribution="titleDistributionSpecific"
                              :title-change="titleChangeSpecific"
                              distribution-legend="区间人数"
                              :distribution-variables="distributionVariables"
                              distribution-variable-name="区间"
                              :distribution-data="distributionData"
                              :variables="dates"
                              :variable='variable'
                              variable-name="日期"
                              :score-data="scoreData"
                              @distributionPartitionSizeChanged="handleDistributionDataOrigin">
        </score-representation>

        <div class="d2-text-center">
          <el-button type="primary" @click="backToOverview" class="back">返回查看概况</el-button>
        </div>
      </div>
      <div v-else>
        <!--概况-->
        <score-representation title-distribution="各题目的平均分分布情况"
                              title-change="各题目各日的平均分变化情况"
                              distribution-legend="区间题数"
                              :distribution-variables="distributionVariables"
                              distribution-variable-name="区间"
                              :distribution-data="distributionData"
                              :variables="questions"
                              :variable='variable'
                              variable-name="题目编号"
                              :score-data="scoreData"
                              @distributionPartitionSizeChanged="handleDistributionDataOrigin">
        </score-representation>
      </div>
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

        // 数据加载动画
        dataLoading: true,

        // 查看详情部分
        searchedQuestionId: '',

        // 成绩分布图的x轴变量
        distributionVariables: [],
        // 保存分布图需要的所有原始数据，减少网络IO
        distributionDataOrigin: [],
        // 分布图所需要的真实数据
        distributionData: {
          num: [],
          proportion: [],
        },

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
        return `题目 ${this.searchedQuestionId} 各次测试的成绩分布情况`
      },

      titleChangeSpecific() {
        return `题目 ${this.searchedQuestionId} 各日的平均成绩变化情况`
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
        this.dataLoading = true;
        console.log('question initOverview')
        new Promise((resolve, reject) => {
          getScoreOfQuestions().then(res => {
            const result = res.result
            this.distributionDataOrigin = extractVariableAsList(result, 'totalScore')
            this.scoreData = result

            this.variable = 'questionId'
            this.questions = extractVariableAsList(result, this.variable)
            console.log(this.questions)

            resolve()
          }).catch(err => {
            console.log('err: ', err)

            if (err.code === 4701) {
              this.$message({
                message: '暂无成绩数据',
                type: 'error',
                duration: 5 * 1000,
                center: true,
                showClose: true
              })
            }

            reject(err)
          })
        }).then(() => {
          this.handleDistributionDataOrigin()
          this.dataLoading = false;
        }).catch(err => {
          this.emptyData();
          this.dataLoading = false;
        })
      },


      // 通过问题编号具体查询
      initByQuestionId() {
        this.dataLoading = true;
        console.log('initByQuestionId')
        console.log(this.searchedQuestionId)
        new Promise((resolve, reject) => {
          getScoreOfSpecoficQuestion(this.searchedQuestionId).then(res => {
            this.distributionDataOrigin = res.allResult
            this.scoreData = res.resultByDate

            this.variable = 'date'
            this.dates = extractVariableAsList(this.scoreData, this.variable)
            console.log(this.dates)

            resolve()
          }).catch(err => {
            console.log('err: ', err)

            if (err.code === 4701) {
              this.$message({
                message: '暂无成绩数据',
                type: 'error',
                duration: 5 * 1000,
                center: true,
                showClose: true
              })
            }

            reject(err)
          })
        }).then(() => {
          this.handleDistributionDataOrigin()
          this.dataLoading = false;
        }).catch(err => {
          this.emptyData();
          this.dataLoading = false;
        })
      },

      // 对分布图的原始数据进行处理
      handleDistributionDataOrigin(partitionSize = 2) {
        let partitionNum = Math.ceil(100.0 / partitionSize);

        // 初始化分区（x轴）
        this.distributionVariables = [];
        for (let i = 0; i < partitionNum; i++) {
          let max = (i + 1) * partitionSize;
          this.distributionVariables.push(`${i * partitionSize} - ${max > 100 ? 100 : max}`)
        }

        // 初始化该分区人数（y1轴）
        this.distributionData.num = Array(partitionNum).fill(0);
        for (let i = 0; i < this.distributionDataOrigin.length; i++) {
          let n = Math.floor(this.distributionDataOrigin[i] / partitionSize);
          this.distributionData.num[n]++
        }

        // 初始化该分区人数比例（y2轴）
        this.distributionData.proportion = []
        for (let i = 0; i < this.distributionData.num.length; i++) {
          let curScoreNum = this.distributionData.num[i];
          this.distributionData.proportion.push(curScoreNum / this.distributionDataOrigin.length)
        }
      },

      // 清空数据
      emptyData() {
        this.distributionVariables = [];
        this.distributionDataOrigin = [];
        this.distributionData = {
          num: [],
          proportion: [],
        };
        this.variable = '';
        this.scoreData = [];
        this.questions = [];
        this.dates = [];
      }
    }
  }
</script>

<style scoped>
  .back {
    margin-top: 15px;
  }
</style>