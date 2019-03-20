<template>
  <d2-container :filename="filename">
    <!--搜索框-->
    <el-form :inline="true" :model="searchQuestion" ref="searchQuestion" size="medium">
      <el-form-item prop="questionNum" label="题号"
                    :rules="[{ required: true, message: '题号不能为空'},{ type: 'number', message: '题号必须为数字值'}]">
        <el-input v-model.number="searchQuestion.questionNum" placeholder="请输入题号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('searchQuestion')">查询</el-button>
      </el-form-item>
    </el-form>

    <!--表格展示部分-->
    <div v-if="!inOptimize">
      <template>
        <el-table :data="questionTable" style="width: 100%">
          <el-table-column prop="questionNum" label="题号" width="80px"></el-table-column>
          <el-table-column prop="text" label="题目原文" width="600px" :show-overflow-tooltip=true></el-table-column>
          <el-table-column prop="lastOpDate" label="上次优化时间"></el-table-column>
          <el-table-column prop="status" label="状态" width="100px"></el-table-column>
          <el-table-column align="right">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleOpt(scope.$index, scope.row)" :disabled=scope.row.inUse>去优化</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>

    <!--手动优化部分-->
    <div v-if="inOptimize">
      <div style="overflow: hidden; width: 100%; height: auto">
        <div class="page-optimize--subtitle">题号：{{displayQuestionNum}}</div>
        <div style="float: right;">
          <el-button size="mini" @click="quitOpt">返回</el-button>
        </div>
      </div>
      <hr style="border: 0.5px solid #cccccc;"/>
      <!--权重分布图-->
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
                <el-table-column label="击中频率" width="100px" prop="hitRate"></el-table-column>
                <el-table-column label="权重">
                  <template slot-scope="scope">
                    <el-slider v-model="scope.row.weight" show-input :max=1 :step=0.01></el-slider>
                  </template>
                </el-table-column>
                <el-table-column align="right" width="300px">
                  <template slot="header" slot-scope="scope">
                    <el-input v-model="search" size="mini" placeholder="输入关键字搜索"/>
                  </template>
                  <template slot-scope="scope">
                    <el-button size="mini" @click="handleReset(scope.$index, scope.row)">重置</el-button>
                    <el-button size="mini" type="primary" @click="handleSave(scope.$index, scope.row)">保存权重</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除词语</el-button>
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
                <el-table-column label="击中频率" width="100px" prop="hitRate"></el-table-column>
                <el-table-column label="权重">
                  <template slot-scope="scope">
                    <el-slider v-model="scope.row.weight" show-input :max=1 :step=0.01></el-slider>
                  </template>
                </el-table-column>
                <el-table-column align="right" width="300px">
                  <template slot="header" slot-scope="scope">
                    <el-input v-model="search" size="mini" placeholder="输入关键字搜索"/>
                  </template>
                  <template slot-scope="scope">
                    <el-button size="mini" @click="handleReset(scope.$index, scope.row)">重置</el-button>
                    <el-button size="mini" type="primary" @click="handleSave(scope.$index, scope.row)">保存权重</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除词语</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>

          </el-tab-pane>
        </el-tabs>
      </template>
    </div>
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
      let textStub = "高铁是现在是最受欢迎的出行方式。首先，高铁速度快，比如说，以前从贵阳到北京，要用40个小时左右，但现在高铁只需要6个小时，大大减少了路途时间。其次，高铁正点率高，因为高铁受天气条件影响较小，通常都可以准时发车，按时到达。最后，高铁环境舒适，高铁坐席宽敞，运行时速度平稳，没有噪音，餐车环境整洁，配有电源插座和无线网络，乘坐高铁很少会造成不适感，对于不习惯坐飞机出行的人士，高铁是更理想的选择。但高铁的建设，前期投资非常巨大，对设备技术、制作工艺要求都很高，后期的管理运营也需要更专业的人员来完成。";
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

        // question table
        questionTable: [{
          questionNum: "1",
          lastOpDate: "2019-03-15",
          status: "空闲中",
          inUse: false,
          text: textStub,
        }, {
          questionNum: "2",
          lastOpDate: "2019-03-15",
          status: "空闲中",
          inUse: false,
          text: textStub,
        }, {
          questionNum: "3",
          lastOpDate: "2019-03-15",
          status: "优化中",
          inUse: true,
          text: textStub,
        }, {
          questionNum: "4",
          lastOpDate: "2019-03-15",
          status: "空闲中",
          inUse: false,
          text: textStub,
        }, {
          questionNum: "5",
          lastOpDate: "2019-03-15",
          status: "空闲中",
          inUse: false,
          text: textStub,
        }],

        // opt table
        mainTableData: [{
          word: '关键词1',
          weight: 0.1,
          hitRate: 0.2
        }, {
          word: '关键词2',
          weight: 0.2,
          hitRate: 0.2,
        }, {
          word: '关键词3',
          hitRate: 0.2,
          weight: 0.3
        }, {
          word: '关键词4',
          hitRate: 0.2,
          weight: 0.3
        }, {
          word: '关键词5',
          hitRate: 0.2,
          weight: 0.2
        }, {
          word: '关键词6',
          hitRate: 0.2,
          weight: 0.1
        }],
        detailTableData: [{
          word: '关键词11',
          hitRate: 0.2,
          weight: 0.2
        }, {
          word: '关键词12',
          hitRate: 0.2,
          weight: 0.3
        }, {
          word: '关键词13',
          hitRate: 0.2,
          weight: 0.4
        }, {
          word: '关键词14',
          hitRate: 0.2,
          weight: 0.5
        }, {
          word: '关键词15',
          hitRate: 0.2,
          weight: 0.6
        }, {
          word: '关键词16',
          hitRate: 0.2,
          weight: 0.7
        }],
        search: '',

        // search
        searchQuestion: {
          questionNum: '',
        },
        displayQuestionNum: '1',

        // 优化是否可见
        inOptimize: false,
      }
    },

    methods: {

      handleDelete(index, row) {
        console.log("delete");
        console.log(index, row);
      },

      handleSave(index, row) {
        console.log("save");
        console.log(index, row);
      },

      handleReset(index, row) {
        console.log("reset");
        console.log(index, row);
      },

      handleOpt(index, row) {
        console.log("opt");
        console.log(index, row.questionNum);
        this.displayQuestionNum = row.questionNum;
        this.inOptimize = true;
      },

      quitOpt() {
        this.displayQuestionNum = '';
        this.inOptimize = false;
      },

      handleClick(tab, event) {
        console.log(tab, event);
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('submit!');
            this.displayQuestionNum = this.searchQuestion.questionNum;
            this.inOptimize = true;
          } else {
            console.log('error submit!!');
            return false;
          }
        });
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
    float: left;
  }

</style>
