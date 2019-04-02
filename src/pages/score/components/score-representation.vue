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

    <score-table :variable="variable"
                 :variable-name="variableName"
                 :score-data="scoreData">
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
        dataLoading: true,

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
      }
    }

  }
</script>

<style scoped>

</style>