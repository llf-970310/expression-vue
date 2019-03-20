<template>
  <d2-container :filename="filename">
    <div class="page-optimize--subtitle">关键词权重分布图</div>
    <template>
      <ve-line :data="paramData"></ve-line>
    </template>
    <template>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="主旨权重调整" name="main">
          <!--主旨权重调整表格-->
          <template>
            <el-table
                :data="mainTableData.filter(data => !search || data.word.toLowerCase().includes(search.toLowerCase()))"
                style="width: 100%">
              <el-table-column label="关键词">
                <template slot-scope="scope">
                  <el-input placeholder="请输入内容" v-model="scope.row.word" :disabled="false"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="权重">
                <template slot-scope="scope">
                  <el-slider v-model="scope.row.weight" show-input max=1 step=0.01></el-slider>
                </template>
              </el-table-column>
              <el-table-column align="right">
                <template slot="header" slot-scope="scope">
                  <el-input v-model="search" size="mini" placeholder="输入关键字搜索"/>
                </template>
                <template slot-scope="scope">
                  <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除词语</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>

        </el-tab-pane>
        <el-tab-pane label="细节权重调整" name="detail">
          <!--细节权重调整表格-->
          <template>
            <el-table
                :data="detailTableData.filter(data => !search || data.word.toLowerCase().includes(search.toLowerCase()))"
                style="width: 100%">
              <el-table-column label="关键词">
                <template slot-scope="scope">
                  <el-input placeholder="请输入内容" v-model="scope.row.word" :disabled="false"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="权重">
                <template slot-scope="scope">
                  <el-slider v-model="scope.row.weight" show-input max=1 step=0.01></el-slider>
                </template>
              </el-table-column>
              <el-table-column align="right">
                <template slot="header" slot-scope="scope">
                  <el-input v-model="search" size="mini" placeholder="输入关键字搜索"/>
                </template>
                <template slot-scope="scope">
                  <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除词语</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>

        </el-tab-pane>
      </el-tabs>
    </template>
  </d2-container>
</template>

<script>
  export default {
    name: 'optimize-manual',
    data() {
      this.chartSettings = {
        metrics: ['主旨关键词占比', '细节关键词占比'],
        dimension: ['关键词权重'],
      };
      return {
        filename: __filename,
        // v-charts
        paramData: {
          columns: ['关键词权重', '主旨关键词占比', '细节关键词占比'],
          rows: [
            {'关键词权重': '0 ~ 0.1', '主旨关键词占比': 0.12, '细节关键词占比': 0.15},
            {'关键词权重': '0.2 ~ 0.3', '主旨关键词占比': 0.23, '细节关键词占比': 0.17},
            {'关键词权重': '0.3 ~ 0.4', '主旨关键词占比': 0.33, '细节关键词占比': 0.24},
            {'关键词权重': '0.4 ~ 0.5', '主旨关键词占比': 0.23, '细节关键词占比': 0.33},
            {'关键词权重': '0.5 ~ 0.6', '主旨关键词占比': 0.11, '细节关键词占比': 0.10},
            {'关键词权重': '0.6 ~ 0.7', '主旨关键词占比': 0.07, '细节关键词占比': 0.02}
          ]
        },
        // tab
        activeName: 'main',

        // table
        mainTableData: [{
          word: '关键词1',
          weight: 0.1
        }, {
          word: '关键词2',
          weight: 0.2
        }, {
          word: '关键词3',
          weight: 0.3
        }, {
          word: '关键词4',
          weight: 0.3
        }, {
          word: '关键词5',
          weight: 0.2
        }, {
          word: '关键词6',
          weight: 0.1
        }],
        detailTableData: [{
          word: '关键词11',
          weight: 0.2
        }, {
          word: '关键词12',
          weight: 0.3
        }, {
          word: '关键词13',
          weight: 0.4
        }, {
          word: '关键词14',
          weight: 0.5
        }, {
          word: '关键词15',
          weight: 0.6
        }, {
          word: '关键词16',
          weight: 0.7
        }],
        search: ''
      }
    },

    methods: {

      handleDelete(index, row) {
        console.log(index, row);
      },

      handleClick(tab, event) {
        console.log(tab, event);
      },

      changeChartData() {
        this.paramData = {}
      }
    }
  }
</script>

<style lang="scss">
  .page-optimize--subtitle {
    font-size: 16px;
  }

</style>
