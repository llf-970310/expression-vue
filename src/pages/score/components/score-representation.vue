<template>
  <div v-loading="dataLoading">

    <score-change :title="avgScoreChangeTitle"
                  :score-partition="scorePartition"
                  :num-by-partition="scoreNumByPartition">
    </score-change>
    <score-distribution :title="avgScoreDistributionTitle"
                        :questions="questions"
                        :main-score="mainScore"
                        :detail-score="detailScore"
                        :total-score="totalScore">
    </score-distribution>

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
    data() {
      return {
        dataLoading: true,

        avgScoreChangeTitle: '各题目平均分的成绩分布',
        avgScoreDistributionTitle: '各题目平均分的成绩变动',

        questions: [],
        mainScore: [],
        detailScore: [],
        totalScore: [],

        scorePartition: [],
        scoreNumByPartition: []
      }
    },
    mounted() {
      this.dataLoading = true
      for (let i = 0; i < 200; i++) {
        this.questions.push(i)
        this.mainScore.push(Math.floor(Math.random() * 100))
        this.detailScore.push(Math.floor(Math.random() * 100))
        this.totalScore.push(this.mainScore[i] * 0.7 + this.detailScore[i] * 0.3)
      }

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

      this.dataLoading = false
    }

  }
</script>

<style scoped>

</style>