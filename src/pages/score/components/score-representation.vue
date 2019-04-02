<template>
  <div v-loading="dataLoading">

    <score-distribution :title="titleDistribution"
                        :score-partition="scorePartition"
                        :num-by-partition="scoreNumByPartition">
    </score-distribution>

    <score-change :title="titleChange"
                  :variables="variables"
                  :variable-name="variableName"
                  :main-score="mainScore"
                  :detail-score="detailScore"
                  :total-score="totalScore">
    </score-change>

    <el-row type="flex" justify="center">
      <el-col :span="18">
        <el-table :data="scoreTableData" border stripe highlight-current-row @current-change=""
                  style="width: 100%">
          <el-table-column
              prop="name"
              :label="variableName">
          </el-table-column>
          <el-table-column
              prop="main"
              label="主旨分"
              width="100">
          </el-table-column>
          <el-table-column
              prop="detail"
              label="细节分"
              width="100">
          </el-table-column>
          <el-table-column
              prop="total"
              label="总分"
              width="100">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import ScoreChange from './score-change'
  import ScoreDistribution from './score-distribution'

  export default {
    name: "score-representation",
    components: {
      'score-distribution': ScoreDistribution,
      'score-change': ScoreChange,
    },
    props: {
      // 标题
      titleDistribution: {
        required: true,
        type: String
      },
      titleChange: {
        required: true,
        type: String
      },

      // 成绩变化图的x轴自变量
      variables: {
        required: true,
        type: Array
      },
      variableName: {
        required: true,
        type: String
      },
      mainScore: {
        required: true,
        type: Array
      },
      detailScore: {
        required: true,
        type: Array
      },
      totalScore: {
        required: true,
        type: Array
      },

    },
    data() {
      return {
        dataLoading: true,

        // 成绩分布图
        scorePartition: [],
        scoreNumByPartition: [],

        // 成绩表格
        scoreTableData: [],
      }
    },
    watch: {
      totalScore: function () {
        this.initScoreDistribution()
        this.initScoreTable()

        this.dataLoading = false
      }
    },
    methods: {
      // 根据总分成绩初始化分布图
      initScoreDistribution() {
        this.scorePartition = ['60分以下', '60-70', '70-80', '80-90', '90-100']
        this.scoreNumByPartition = [
          {value: 0, name: '60分以下'},
          {value: 0, name: '60-70'},
          {value: 0, name: '70-80'},
          {value: 0, name: '80-90'},
          {value: 0, name: '90-100'},
        ]
        for (let i = 0; i < this.totalScore.length; i++) {
          let curScore = this.totalScore[i]
          if (curScore < 60) {
            this.scoreNumByPartition[0].value++
          } else if (curScore >= 60 && curScore < 70) {
            this.scoreNumByPartition[1].value++
          } else if (curScore >= 70 && curScore < 80) {
            this.scoreNumByPartition[2].value++
          } else if (curScore >= 80 && curScore < 90) {
            this.scoreNumByPartition[3].value++
          } else {
            this.scoreNumByPartition[4].value++
          }
        }

        // console.log(this.scoreNumByPartition)
      },

      // 根据各成绩初始化表格
      initScoreTable() {
        this.scoreTableData = []
        for (let i = 0; i < this.totalScore.length; i++) {
          this.scoreTableData.push({
            name: this.variables[i],
            main: this.mainScore[i],
            detail: this.detailScore[i],
            total: this.totalScore[i]
          })
        }
      }
    }

  }
</script>

<style scoped>

</style>