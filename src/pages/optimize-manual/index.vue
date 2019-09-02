<template>
  <d2-container :filename="filename">
    <!--搜索框-->
    <el-form :inline="true" :model="searchQuestion" ref="searchQuestion" size="medium">
      <el-form-item prop="questionNum" label="题号"
                    :rules="[{ required: true, message: '题号不能为空'},{ type: 'number', message: '题号必须为数字值'}]">
        <el-input v-model.number="searchQuestion.questionNum" placeholder="请输入题号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('searchQuestion')">去优化</el-button>
      </el-form-item>
    </el-form>

    <!--表格展示部分-->
    <div v-if="!inOptimize">
      <template>
        <el-table :data="questionTable" style="width: 100%" :default-sort="{prop: 'questionNum', order: 'ascending'}">
          <el-table-column prop="questionNum" label="题号" width="80px" sortable></el-table-column>
          <el-table-column prop="text" label="题目原文" width="600px" :show-overflow-tooltip=true></el-table-column>
          <el-table-column prop="lastOpDate" label="上次优化时间"></el-table-column>
          <el-table-column prop="status" label="状态" width="100px"></el-table-column>
          <el-table-column align="right" width="100px">
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
        <div style="width: 49%; height: auto; overflow: hidden; float: left; margin-bottom: -20px;">
          <div style="width: 100%; height: 28px; overflow: hidden">
            <div class="page-optimize--subtitle">关键词权重分布图</div>
            <div style="float: right; margin-right: 0; color: #666666; font-size: 14px">
              选择箱数
              <el-input-number v-model="weightHistNum" @change="handleWeightHistChange" :min="3" :max="50" size="mini"
                               label="选择栏数" controls-position="right"></el-input-number>
            </div>
          </div>
          <template>
            <ve-line :data="paramData" height="350px"></ve-line>
          </template>
        </div>
        <!--得分频率分布图-->
        <div style="width: 49%; height: auto; overflow: hidden; float: right; margin-bottom: -20px;">
          <div style="width: 100%; height: 28px; overflow: hidden">
            <div class="page-optimize--subtitle">得分频率分布图</div>
            <div style="float: right;">
              <el-button icon="el-icon-refresh" type="text" size="mini" @click="refreshScoreChart">刷新数据</el-button>
            </div>
            <div style="float: right; margin-right: 20px; color: #666666; font-size: 14px">
              选择箱数
              <el-input-number v-model="scoreHistNum" @change="handleScoreHistChange" :min="3" :max="50" size="mini"
                               label="选择栏数" controls-position="right"></el-input-number>
            </div>
          </div>
          <template>
            <ve-line :data="scoreData" height="350px"></ve-line>
          </template>
        </div>

        <!--难度系数与区分度-->
        <div style="width: 100%; overflow: hidden; height: auto; margin-bottom: 25px">
          <template>
            <el-table :data="scoreStatistic" style="width: 100%" border>
              <el-table-column prop="type" label="类型" width="180"></el-table-column>
              <el-table-column prop="mean" label="平均分" width="180"></el-table-column>
              <el-table-column prop="sigma" label="标准差"></el-table-column>
              <el-table-column prop="difficulty" label="难度系数"></el-table-column>
              <el-table-column prop="discrimination" label="区分度"></el-table-column>
            </el-table>
          </template>
        </div>

      </div>

      <template>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="主旨权重调整" name="key">
            <!--主旨权重调整表格-->
            <template>
              <el-table
                  :data="keyTableData.filter(data => !search || data.word.toLowerCase().includes(search.toLowerCase()))"
                  style="width: 100%">
                <el-table-column prop="word" label="关键词" :show-overflow-tooltip=true></el-table-column>
                <el-table-column label="击中频率" width="120px" prop="hitRate"></el-table-column>
                <el-table-column label="权重" prop="weight">
                  <template slot-scope="scope">
                    <el-slider v-model="scope.row.weight" show-input :max=50 :step=0.01></el-slider>
                  </template>
                </el-table-column>
                <el-table-column align="right" width="300px">
                  <template slot="header" slot-scope="scope">
                    <el-input v-model="search" size="mini" placeholder="输入关键字搜索"/>
                  </template>
                  <template slot-scope="scope">
                    <el-button size="mini" @click="handleReset(scope.$index, scope.row)">重置</el-button>
                    <el-button size="mini" type="primary" @click="handleSave(scope.$index, scope.row)">保存权重</el-button>
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
                <el-table-column prop="word" label="关键词" :show-overflow-tooltip=true></el-table-column>
                <el-table-column label="击中频率" width="120px" prop="hitRate"></el-table-column>
                <el-table-column label="权重" prop="weight">
                  <template slot-scope="scope">
                    <el-slider v-model="scope.row.weight" show-input :max=50 :step=0.01></el-slider>
                  </template>
                </el-table-column>
                <el-table-column align="right" width="300px">
                  <template slot="header" slot-scope="scope">
                    <el-input v-model="search" size="mini" placeholder="输入关键字搜索"/>
                  </template>
                  <template slot-scope="scope">
                    <el-button size="mini" @click="handleReset(scope.$index, scope.row)">重置</el-button>
                    <el-button size="mini" type="primary" @click="handleSave(scope.$index, scope.row)">保存权重</el-button>
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
  import {getAllType2, getScoreData, getWeightData, updateWeight} from '@/api/optimize'

  export default {
    name: 'optimize-manual',
    data() {
      return {
        weightHistNum: 10,

        scoreHistNum: 5,

        filename: __filename,
        // v-charts
        paramData: {
          columns: ['关键词权重', '主旨关键词', '细节关键词'],
          rows: [],
        },
        scoreData: {
          columns: ['得分', '主旨频率', '细节频率', '总分频率'],
          rows: [],
        },

        // tab
        activeName: 'key',

        // question table
        questionTable: [],

        // opt table
        keyTableData: [],
        detailTableData: [],
        search: '',

        // backup


        // search
        searchQuestion: {
          questionNum: '',
        },
        displayQuestionNum: '',

        // 优化是否可见
        inOptimize: false,

        scoreStatistic: []
      }
    },
    mounted() {
      this.getQuestionTableData();
    },
    methods: {
      // 获得question表格的数据
      getQuestionTableData() {
        new Promise((resolve, reject) => {
          getAllType2().then(res => {
            this.questionTable = [];
            res.questions.forEach(question => {
              this.questionTable.push({
                'questionNum': question.questionId,
                'lastOpDate': question.lastOpDate ? question.lastOpDate : "—— ——",
                'inUse': question.inOptimize,
                'text': question.rawText,
                'status': question.inOptimize ? "优化中" : "空闲",
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
      getScoreChartData(questionNum, histNum, force = false) {
        new Promise((resolve, reject) => {
          getScoreData(questionNum, force).then(res => {
            let keyHist = [];
            let detailHist = [];
            let totalHist = [];
            this.fillHist(keyHist, res.key, histNum, 100);
            this.fillHist(detailHist, res.detail, histNum, 100);
            this.fillHist(totalHist, res.total, histNum, 100);
            this.scoreData.rows = [];
            for (let i = 0; i < histNum; i++) {
              this.scoreData.rows.push({
                '得分': (i * 100 / histNum).toFixed(0) + ' ~ ' + ((i + 1) * 100 / histNum).toFixed(0),
                '主旨频率': keyHist[i],
                '细节频率': detailHist[i],
                '总分频率': totalHist[i],
              });
            }
            this.scoreStatistic = [];
            this.scoreStatistic.push({
              "type": "主旨", "mean": res.keyStatistic.mean.toFixed(2),
              "sigma": res.keyStatistic.sigma.toFixed(2),
              "difficulty": res.keyStatistic.difficulty.toFixed(2),
              "discrimination": res.keyStatistic.discrimination.toFixed(2)
            });
            this.scoreStatistic.push({
              "type": "细节", "mean": res.detailStatistic.mean.toFixed(2),
              "sigma": res.detailStatistic.sigma.toFixed(2),
              "difficulty": res.detailStatistic.difficulty.toFixed(2),
              "discrimination": res.detailStatistic.discrimination.toFixed(2)
            });
            this.scoreStatistic.push({
              "type": "总分", "mean": res.totalStatistic.mean.toFixed(2),
              "sigma": res.totalStatistic.sigma.toFixed(2),
              "difficulty": res.totalStatistic.difficulty.toFixed(2),
              "discrimination": res.totalStatistic.discrimination.toFixed(2)
            });

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
            let max = 0;
            res.keyWeight.forEach(w => {
              if (w > max) {
                max = w;
              }
            });
            res.detailWeight.forEach(w => {
              if (w > max) {
                max = w;
              }
            });
            let keyHist = [];
            let detailHist = [];
            this.fillHist(keyHist, res.keyWeight, histNum, max);
            this.fillHist(detailHist, res.detailWeight, histNum, max);
            this.paramData.rows = [];
            for (let i = 0; i < histNum; i++) {
              this.paramData.rows.push({
                '关键词权重': (i * max / histNum).toFixed(1) + ' ~ ' + ((i + 1) * max / histNum).toFixed(1),
                '主旨关键词': keyHist[i],
                '细节关键词': detailHist[i],
              });
            }
            // table部分
            this.keyTableData = [];
            this.keyTableData.push({
              word: "常数项",
              hitRate: 1,
              weight: res.keyWeight[0],
            });
            for (let i = 0; i < res.keyWords.length; i++) {
              this.keyTableData.push({
                word: this.array2str(res.keyWords[i]),
                hitRate: res.allHitTimes === 0 ? 0 : (res.keyHitTimes[i] / res.allHitTimes * 100).toFixed(2) +
                  "%",
                weight: res.keyWeight[i + 1],
              });
            }
            this.detailTableData = [];
            this.detailTableData.push({
              word: "常数项",
              hitRate: 1,
              weight: res.detailWeight[0],
            });
            for (let i = 0; i < res.detailWords.length; i++) {
              this.detailTableData.push({
                word: this.array2str(res.detailWords[i]),
                hitRate: res.allHitTimes === 0 ? 0 :
                  (res.detailHitTimes[i] / res.allHitTimes * 100).toFixed(2) +  "%",
                weight: res.detailWeight[i + 1],
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
          let keyWords = this.keyTableData.map(e => e.word);
          let keyWeight = this.keyTableData.map(e => e.weight);
          let detailWords = this.detailTableData.map(e => e.word);
          let detailWeight = this.detailTableData.map(e => e.weight);
          updateWeight(questionNum, {
            "keyWeight": keyWeight,
            "detailWeight": detailWeight,
          }).then(res => {
            this.$message({
              message: '权重保存成功',
              type: 'success'
            });
            resolve();
          }).then(() => this.getWeightChartData(questionNum, this.weightHistNum)).catch(err => {
            console.log(err);
            reject();
          });
        }).then().catch();
      },

      // 优化表格相关的方法

      handleSave(index, row) {
        this.saveWeight(this.displayQuestionNum);
      },

      handleReset(index, row) {
        console.log("reset");
        console.log(index, row);
        this.getWeightChartData(this.displayQuestionNum, this.weightHistNum);
      },

      // 去优化按钮监听
      handleOpt(index, row) {
        console.log("opt");
        console.log(index, row.questionNum);
        this.getScoreChartData(row.questionNum, this.scoreHistNum);
        this.getWeightChartData(row.questionNum, this.weightHistNum);
        this.displayQuestionNum = row.questionNum;
        this.inOptimize = true;
      },
      // 返回按钮监听
      quitOpt() {
        this.getQuestionTableData();
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
            this.getScoreChartData(this.searchQuestion.questionNum, this.scoreHistNum);
            this.getWeightChartData(this.searchQuestion.questionNum, this.weightHistNum);
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
        this.getScoreChartData(this.displayQuestionNum, this.scoreHistNum, true);
      },
      handleScoreHistChange() {
        this.getScoreChartData(this.displayQuestionNum, this.scoreHistNum);
      },
      handleWeightHistChange() {
        this.getWeightChartData(this.displayQuestionNum, this.weightHistNum);
      },

      // 填充频率分布图
      fillHist(hist, data, histNum, limit) {
        for (let i = 0; i < histNum; i++) {
          hist.push(0);
        }
        let sum = 0;
        data.forEach(score => {
          for (let i = 0; i < histNum; i++) {
            if (score <= (i + 1) * limit / histNum) {
              hist[i]++;
              sum++;
              break;
            }
          }
        });
        for (let i = 0; i < hist.length; i++) {
          hist[i] /= sum;
        }
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
