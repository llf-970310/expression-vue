<template>
  <div>

    <el-row>
      <el-col :span="12">
        <span class="title">{{ titleDistribution }}</span>
      </el-col>
      <el-col :span="12" class="input-num">
        <span>区间大小：</span>
        <el-input-number v-model="scorePartitionSize"
                         @change="initScoreDistribution"
                         :min="2" :max="50"
                         size="small"
                         label="区间大小"
                         controls-position="right">
        </el-input-number>
      </el-col>
    </el-row>
    <score-distribution v-loading="distributionLoading"
                        :legend="distributionLegend"
                        :score-partition="scorePartition"
                        :num-by-partition="scoreNumByPartition"
                        :proportion-by-partition="scoreProportionByPartition"
                        @ready="distributionReady"
                        @prepare="distributionPrepare">
    </score-distribution>

    <el-row>
      <el-col :span="12">
        <span class="title">{{ titleChange }}</span>
      </el-col>
    </el-row>
    <score-change v-loading="changeLoading"
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
  import ScoreDistribution from './score-distribution-histogram'
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

      // 分布图的图例
      distributionLegend: {
        required: true,
        type: String
      },

      // 成绩变化图的x轴自变量数据
      variables: {
        required: true,
        type: Array
      },
      // 成绩变化图x轴自变量名称的和数据表格第一项展现的名称
      variableName: {
        required: true,
        type: String
      },

      // 成绩数据表格中的第一项的 prop 变量名
      variable: {
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
        scorePartitionSize: 2,
        scorePartition: [],
        scoreNumByPartition: [],
        scoreProportionByPartition: [],

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
        let partitionNum = Math.ceil(100.0 / this.scorePartitionSize);

        // 初始化分区（X轴）
        this.scorePartition = [];
        for (let i = 0; i < partitionNum; i++) {
          let max = (i + 1) * this.scorePartitionSize;
          this.scorePartition.push(`${i * this.scorePartitionSize} - ${max > 100 ? 100 : max}`)
        }

        // 初始化该分区人数（Y1轴）
        this.scoreNumByPartition = Array(partitionNum).fill(0);
        for (let i = 0; i < this.scoreData.length; i++) {
          let curScore = this.scoreData[i].totalScore;
          let n = Math.floor(curScore / this.scorePartitionSize);
          this.scoreNumByPartition[n]++
        }

        // 初始化该分区人数比例（Y2轴）
        this.scoreProportionByPartition = []
        for (let i = 0; i < this.scoreNumByPartition.length; i++) {
          let curScoreNum = this.scoreNumByPartition[i];
          this.scoreProportionByPartition.push(curScoreNum / this.scoreData.length)
        }
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
  .input-num {
    text-align: right;
  }

  .title {
    font-size: 20px;
    font-weight: bold;
  }
</style>