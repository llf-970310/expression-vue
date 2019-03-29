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
              <el-button size="mini" @click="handleOpt(scope.$index, scope.row)" :disabled=scope.row.inUse>手动优化
              </el-button>
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

      <div style="width: 100%; height: auto; overflow: hidden;">
        <!--权重分布图-->
        <div style="width: 49%; height: auto; overflow: hidden; float: left">
          <div style="width: 100%; height: 28px; overflow: hidden">
            <div class="page-optimize--subtitle">关键词权重分布图</div>
          </div>
          <template>
            <ve-line :data="paramData" height="350px"></ve-line>
          </template>
        </div>
        <!--得分频率分布图-->
        <div style="width: 49%; height: auto; overflow: hidden; float: right">
          <div style="width: 100%; height: 28px; overflow: hidden">
            <div class="page-optimize--subtitle">得分频率分布图</div>
            <div style="float: right;">
              <el-button icon="el-icon-refresh" type="text" size="mini" @click="refreshScoreChart">刷新数据</el-button>
            </div>
          </div>
          <template>
            <ve-line :data="scoreData" height="350px"></ve-line>
          </template>
        </div>
      </div>
      <template>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="主旨权重调整" name="main">
            <!--主旨权重调整表格-->
            <template>
              <el-table
                  :data="mainTableData.filter(data => !search || data.word.toLowerCase().includes(search.toLowerCase()))"
                  style="width: 100%" :default-sort="{prop: 'hitRate', order: 'descending'}">
                <el-table-column prop="word" label="关键词" :show-overflow-tooltip=true></el-table-column>
                <el-table-column label="击中频率" width="120px" prop="hitRate" sortable></el-table-column>
                <el-table-column label="权重" sortable prop="weight">
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
                  style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}">
                <el-table-column prop="word" label="关键词" :show-overflow-tooltip=true></el-table-column>
                <el-table-column label="击中频率" width="120px" prop="hitRate" sortable></el-table-column>
                <el-table-column label="权重" prop="weight" sortable>
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
  import {getAllQuestions} from '@api/manager.question'
  import {getScoreData, getWeightData, updateWeight} from '@/api/optimize'

  export default {
    name: 'optimize-manual',
    data() {
      return {
        filename: __filename,
        // v-charts
        paramData: {
          columns: ['关键词权重', '主旨关键词数', '细节关键词数'],
          rows: [],
        },
        scoreData: {
          columns: ['得分', '主旨人数', '细节人数', '总分人数'],
          rows: [],
        },

        // tab
        activeName: 'main',

        // question table
        questionTable: [],

        // opt table
        mainTableData: [],
        detailTableData: [],
        search: '',

        // search
        searchQuestion: {
          questionNum: '',
        },
        displayQuestionNum: '',

        // 优化是否可见
        inOptimize: false,
      }
    },
    mounted() {
      this.getQuestionTableData();
    },
    methods: {
      // 获得question表格的数据
      getQuestionTableData() {
        new Promise((resolve, reject) => {
          getAllQuestions().then(res => {
            res.questions.forEach(question => {
              this.questionTable.push({
                'questionNum': question.questionId,
                'lastOpDate': question.lastOpDate,
                'inUse': question.inOptimize,
                'text': question.rawText,
              });
            });
            console.log(this.questionTable);
            resolve()
          }).catch(err => {
            console.log('err: ', err);
            reject(err);
          })
        }).then().catch();
      },

      // 获得score chart的数据
      getScoreChartData(questionNum, histNum) {
        new Promise((resolve, reject) => {
          getScoreData(questionNum).then(res => {
            let mainHist = [];
            let detailHist = [];
            let totalHist = [];
            this.fillHist(mainHist, res.main, histNum, 100);
            this.fillHist(detailHist, res.detail, histNum, 100);
            this.fillHist(totalHist, res.total, histNum, 100);
            this.scoreData.rows = [];
            for (let i = 0; i < histNum; i++) {
              this.scoreData.rows.push({
                '得分': (i * 100 / histNum) + ' ~ ' + ((i + 1) * 100 / histNum),
                '主旨人数': mainHist[i],
                '细节人数': detailHist[i],
                '总分人数': totalHist[i],
              });
            }

            resolve();
          }).catch(err => {
            console.log('err: ', err);
            reject(err);
          })
        }).then().catch();
      },

      // 获得weight chart和table的数据
      getWeightChartData(questionNum, histNum) {
        new Promise((resolve, reject) => {
          getWeightData(questionNum).then(res => {
            // chart部分
            let mainHist = [];
            let detailHist = [];
            this.fillHist(mainHist, res.mainWeight, histNum, 100);
            this.fillHist(detailHist, res.detailWeight, histNum, 100);
            this.paramData.rows = [];
            for (let i = 0; i < histNum; i++) {
              this.paramData.rows.push({
                '关键词权重': (i / histNum) + ' ~ ' + ((i + 1) / histNum),
                '主旨关键词数': mainHist[i],
                '细节关键词数': detailHist[i],
              });
            }
            // table部分
            this.mainTableData = [];
            for (let i = 0; i < res.mainWords.length; i++) {
              this.mainTableData.push({
                word: this.array2str(res.mainWords[i]),
                hitRate: res.mainHitTimes[i] / res.allHitTimes,
                weight: res.mainWeight[i],
              });
            }
            this.detailTableData = [];
            for (let i = 0; i < res.detailWords.length; i++) {
              this.detailTableData.push({
                word: this.array2str(res.detailWords[i]),
                hitRate: res.detailHitTimes[i] / res.allHitTimes,
                weight: res.detailWeight[i],
              });
            }
            resolve();
          }).catch(err => {
            console.log('err: ', err);
            reject(err);
          });
        }).then().catch();
      },

      // 保存优化表格
      saveWeight(questionNum) {
        new Promise((resolve, reject) => {
          let mainWords = this.mainTableData.map(e => e.word);
          let mainWeight = this.mainTableData.map(e => e.weight);
          let detailWords = this.mainTableData.map(e => e.word);
          let detailWeight = this.detailTableData.map(e => e.weight);
          updateWeight(questionNum, {
            "mainWords": mainWords,
            "mainWeight": mainWeight,
            "detailWords": detailWords,
            "detailWeight": detailWeight,
          }).then(res => {
            this.$message({
              message: '权重保存成功',
              type: 'success'
            });
            resolve();
          }).then(() => this.getWeightChartData(questionNum, 5)).catch(err => {
            console.log(err);
            reject();
          });
        }).then().catch();
      },

      // 优化表格相关的方法
      handleDelete(index, row) {
        console.log("delete");
        console.log(index, row);
        this.saveWeight(row.questionNum);
      },

      handleSave(index, row) {
        console.log("save");
        console.log(index, row);
        this.saveWeight(row.questionNum);
      },

      handleReset(index, row) {
        console.log("reset");
        console.log(index, row);

      },

      // 去优化按钮监听
      handleOpt(index, row) {
        console.log("opt");
        console.log(index, row.questionNum);
        this.getScoreChartData(row.questionNum, 5);
        this.getWeightChartData(row.questionNum, 5);
        this.displayQuestionNum = row.questionNum;
        this.inOptimize = true;
      },
      // 返回按钮监听
      quitOpt() {
        this.displayQuestionNum = '';
        this.inOptimize = false;
      },
      // 切换tab监听
      handleClick(tab, event) {
        console.log(tab, event);
      },
      // 搜索题目按钮监听
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('submit!');
            this.getScoreChartData(this.searchQuestion.questionNum, 5);
            this.getWeightChartData(this.searchQuestion.questionNum, 5);
            this.displayQuestionNum = this.searchQuestion.questionNum;
            this.inOptimize = true;
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 刷新得分频率图
      refreshScoreChart() {
        console.log("refresh chart!");
        this.getScoreChartData(this.displayQuestionNum, 5);
      },


      // 填充频率分布图
      fillHist(hist, data, histNum, limit) {
        for (let i = 0; i < histNum; i++) {
          hist.push(0);
        }
        let total = 0;
        data.forEach(score => {
          total += score;
          for (let i = 0; i < histNum; i++) {
            if (score < (i + 1) * limit / histNum) {
              hist[i]++;
              break;
            }
          }
        });
      },

      // 关键词数组转string
      array2str(arr) {
        let str = '[';
        for (let i = 0; i < arr.length; i++) {
          str += arr[i];
          if (i < arr.length - 1) {
            str += ', '
          }
        }
        str += ']';
        return str;
      },
    }
  }
</script>

<style lang="scss">
  .page-optimize--subtitle {
    font-size: 16px;
    float: left;
  }

</style>
