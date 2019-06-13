<template>
  <div>

    <el-row>
      <el-col :span="18">
        <span class="title">{{ titleDistribution }}</span>
      </el-col>
      <el-col v-if="distributionPartitionAdjustable" :span="6" class="input-num">
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
                        :partition="distributionVariables"
                        :partition-name="distributionVariableName"
                        :num-by-partition="distributionData.num"
                        :proportion-by-partition="distributionData.proportion"
                        @ready="distributionReady"
                        @prepare="distributionPrepare">
    </score-distribution>

    <el-row>
      <el-col :span="18">
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

      // 分布图x轴大小可调整
      distributionPartitionAdjustable: {
        type: Boolean,
        default: true,
      },
      // 分布图的图例
      distributionLegend: {
        required: true,
        type: String
      },
      // 分布图的x轴自变量数据
      distributionVariables: {
        required: true,
        type: Array
      },
      // 分布图的x轴自变量名称
      distributionVariableName: {
        required: true,
        type: String
      },
      // 分布图的数据
      distributionData: {
        required: true,
        type: Object
      },

      // 成绩变化图的x轴自变量数据
      variables: {
        required: true,
        type: Array
      },
      // 成绩变化图x轴自变量名称和数据表格第一项展现的名称
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

        // 成绩分布图x轴的分区大小
        scorePartitionSize: 2,

        // 成绩变化图
        mainScore: [],
        detailScore: [],
        totalScore: [],
      }
    },
    watch: {
      distributionData: function () {
        this.initScoreDistribution()
      },
      scoreData: function () {
        this.initScoreChange()
      }
    },
    methods: {
      // 根据总分成绩初始化分布图
      initScoreDistribution() {
        this.$emit('distributionPartitionSizeChanged', this.scorePartitionSize)
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