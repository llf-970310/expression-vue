<template>
  <div>

    <score-distribution v-loading="distributionLoading"
                        :title="titleDistribution"
                        :score-partition="scorePartition"
                        :num-by-partition="scoreNumByPartition"
                        @ready="distributionReady"
                        @prepare="distributionPrepare">
    </score-distribution>

    <score-change v-loading="changeLoading"
                  :title="titleChange"
                  :variables="variables"
                  :variable-name="variableName"
                  :main-score="mainScore"
                  :detail-score="detailScore"
                  :total-score="totalScore"
                  @ready="changeReady"
                  @prepare="changePrepare">
    </score-change>

    <score-table v-loading="tableLoading"
                 :variable="variable"
                 :variable-name="variableName"
                 :score-data="scoreData"
                 @ready="tableReady"
                 @prepare="tablePrepare">
    </score-table>
  </div>
</template>

<script>
  import ScoreChange from './score-change'
  import ScoreDistribution from './score-distribution'
  import ScoreTable from './score-table'

  import {extractVariableAsList} from '@/libs/my-util'

  export default {
    name: "score-representation",
    components: {
      'score-distribution': ScoreDistribution,
      'score-change': ScoreChange,
      'score-table': ScoreTable,
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
      variable: {
        required: true,
        type: String
      },
      variableName: {
        required: true,
        type: String
      },
      // 成绩数据，包含 mainScore、detailScore、totalScore 的
      scoreData: {
        required: true,
        type: Array
      },
    },
    data() {
      return {
        // 组件加载动画
        distributionLoading: true,
        changeLoading: true,
        tableLoading: true,

        // 成绩分布图
        scorePartition: [],
        scoreNumByPartition: [],

        // 成绩变化图
        mainScore: [],
        detailScore: [],
        totalScore: [],
      }
    },
    watch: {
      scoreData: function () {
        this.initScoreDistribution()
        this.initScoreChange()
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
        for (let i = 0; i < this.scoreData.length; i++) {
          let curScore = this.scoreData[i].totalScore
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

      // 根据总分成绩初始化分布图
      initScoreChange() {
        this.mainScore = extractVariableAsList(this.scoreData, 'mainScore')
        this.detailScore = extractVariableAsList(this.scoreData, 'detailScore')
        this.totalScore = extractVariableAsList(this.scoreData, 'totalScore')

        // console.log('mainScore detailScore totalScore')
        // console.log(this.mainScore)
        // console.log(this.detailScore)
        // console.log(this.totalScore)
      },

      // 成绩分布图已准备好
      distributionReady() {
        this.distributionLoading = false
        // console.log('distributionReady')
      },

      // 成绩分布图正在准备中
      distributionPrepare() {
        this.distributionLoading = true
        // console.log('distributionPrepare')
      },

      // 成绩变化图已准备好
      changeReady() {
        this.changeLoading = false
        // console.log('changeReady')
      },

      // 成绩变化图正在准备中
      changePrepare() {
        this.changeLoading = true
        // console.log('changePrepare')
      },

      // 成绩变化表格已准备好
      tableReady() {
        this.tableLoading = false
        // console.log('tableReady')
      },

      // 成绩变化表格正在准备中
      tablePrepare() {
        this.tableLoading = true
        // console.log('tablePrepare')
      }
    }

  }
</script>

<style scoped>

</style>