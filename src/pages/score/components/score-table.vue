<template>
  <div>
    <el-row type="flex" justify="center">
      <el-col :span="18">
        <el-table :data="visibleScoreData"
                  border stripe highlight-current-row style="width: 100%">
          <el-table-column
              :prop="variable"
              :label="variableName">
          </el-table-column>
          <el-table-column
              prop="times"
              label="测试次数"
              width="80">
          </el-table-column>
          <el-table-column
              prop="mainScore"
              label="主旨分"
              width="80">
          </el-table-column>
          <el-table-column
              prop="detailScore"
              label="细节分"
              width="80">
          </el-table-column>
          <el-table-column
              prop="totalScore"
              label="总分"
              width="80">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-row class="d2-text-center pagination">
      <el-pagination
          @size-change="curSizePerPageChanged"
          @current-change="curPageChanged"
          :current-page.sync="curPage"
          :page-sizes="[10, 25, 50, 100, 200]"
          :page-size.sync="curSizePerPage"
          layout="prev, pager, next, total, sizes"
          :total="totalCount">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "score-table",
    props: {
      // 表格中第一项的 prop，如 questionId/userEmail
      variable: {
        required: true,
        type: String
      },
      // 表格第一项展现的名称，如 问题编号/用户邮箱
      variableName: {
        required: true,
        type: String
      },

      scoreData: {
        required: true,
        type: Array
      }
    },
    data() {
      return {
        // 成绩表格
        visibleScoreData: [],

        // 总条数
        totalCount: 1,
        // 当前页数
        curPage: 1,
        // 每页条数
        curSizePerPage: 25
      }
    },
    watch: {
      scoreData: function () {
        // 重置表格参数
        this.totalCount = this.scoreData.length
        this.curPage = 1
        this.curSizePerPage = 25

        this.initVisibleTableData()
      }
    },
    methods: {
      // 初始化可以被看见的数据
      initVisibleTableData() {
        this.$emit('prepare')
        const start = (this.curPage - 1) * this.curSizePerPage
        const max = this.curPage * this.curSizePerPage
        const end = max > this.totalCount ? this.totalCount : max
        this.visibleScoreData = this.scoreData.slice(start, end)

        // console.log('curPage: ' + this.curPage + '    curSizePerPage: ' + this.curSizePerPage)
        // console.log(start)
        // console.log(end)
        // console.log(this.visibleScoreData)
        this.$emit('ready')
      },

      curPageChanged(val) {
        // console.log(`当前页: ${val}`);
        this.initVisibleTableData()
      },
      curSizePerPageChanged(val) {
        // console.log(`每页 ${val} 条`);
        // 每页大小变化之后，总是回到第一页
        this.curPage = 1
        this.initVisibleTableData()
      }
    }
  }
</script>

<style scoped>
  .pagination {
    margin-top: 15px;
  }
</style>