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
          <el-table-column prop="text" label="题目原文" width="520px" :show-overflow-tooltip=true></el-table-column>
          <el-table-column prop="lastOpDate" label="上次优化时间"></el-table-column>
          <el-table-column prop="status" label="状态" width="70px"></el-table-column>
          <el-table-column align="right" width="260px">
            <template slot-scope="scope">
              <el-button size="mini" @click="watchOpt(scope.$index, scope.row)"
                         :disabled="!scope.row.auto_optimized">查看详情
              </el-button>
              <el-button size="mini" @click="handleOpt(scope.$index, scope.row)" :disabled=scope.row.inUse>去优化
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>

    <!--自动优化部分-->
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
                               label="选择箱数" controls-position="right"></el-input-number>
            </div>
          </div>
          <template>
            <ve-line :data="paramData" height="350px" v-loading="weightLoading"></ve-line>
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
                               label="选择箱数" controls-position="right"></el-input-number>
            </div>
          </div>
          <template>
            <ve-line :data="scoreData" height="350px" v-loading="scoreLoading"></ve-line>
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
      <!--优化过程图-->
      <div v-if="optimizing">
        <div style="width: 100%; height: auto; overflow: hidden;">
          <div style="width: 100%; height: 28px; overflow: hidden">
            <div class="page-optimize--subtitle">损失函数-迭代次数关系图</div>
            <div class="page-optimize--subtitle"
                 style="color: #ABABAB; font-size: 12px; margin-left: 20px; padding-top: 4px">优化日期: {{optimizeDate}}
            </div>
            <div style="float: right;">
              <el-button icon="el-icon-refresh" type="text" size="mini" @click="refreshCostChart">刷新数据</el-button>
            </div>
          </div>
          <template>
            <ve-line :data="costData" :settings="{xAxisType: 'value'}" v-loading="costLoading"></ve-line>
          </template>
        </div>
        <div style="float: right">
          <el-button type="primary" @click="toOpt">继续优化</el-button>
        </div>
      </div>
      <!--优化表单-->
      <div v-if="!optimizing">

        <div class="page-optimize--subtitle" style="width: 100%; margin-bottom: 10px">优化选项设置</div>
        <div style="width: 60%">
          <el-form :model="optimizeForm" ref="optimizeForm" label-width="160px">
            <el-form-item label="迭代次数" prop="times" :rules="rule">
              <el-input v-model.number="optimizeForm.times"></el-input>
            </el-form-item>
            <el-form-item label="步长 (α)" prop="alpha" :rules="rule">
              <el-input v-model.number="optimizeForm.alpha"></el-input>
            </el-form-item>
            <el-form-item label="正规化参数 (λ)" prop="lambda" :rules="rule">
              <el-input v-model.number="optimizeForm.lambda"></el-input>
            </el-form-item>
            <el-form-item label="主旨均值" prop="keyMean" :rules="rule">
              <el-input v-model.number="optimizeForm.keyMean"></el-input>
            </el-form-item>
            <el-form-item label="主旨标准差" prop="keySigma" :rules="rule">
              <el-input v-model.number="optimizeForm.keySigma"></el-input>
            </el-form-item>
            <el-form-item label="细节均值" prop="detailMean" :rules="rule">
              <el-input v-model.number="optimizeForm.detailMean"></el-input>
            </el-form-item>
            <el-form-item label="细节标准差" prop="detailSigma" :rules="rule">
              <el-input v-model.number="optimizeForm.detailSigma"></el-input>
            </el-form-item>
            <el-form-item label="优化算法" prop="algorithm" :rules="[{ required: true, message: '算法不能为空'}]">
              <el-select v-model="optimizeForm.algorithm" placeholder="请选择算法">
                <el-option
                    v-for="item in algorithmOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="使用上一次的结果" prop="reuse">
              <el-switch v-model="optimizeForm.reuse"></el-switch>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitOptimize('optimizeForm')">立即优化</el-button>
              <el-button @click="resetForm('optimizeForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </d2-container>
</template>

<script>
  import {getAllType2, getWeightData, getScoreData, getLastCostData, startAutoOpt} from '@/api/optimize'

  export default {
    name: 'optimize-auto',
    data() {

      return {
        weightHistNum: 10,

        scoreHistNum: 5,

        filename: __filename,
        // question table
        questionTable: [],
        // search
        searchQuestion: {
          questionNum: '',
        },
        displayQuestionNum: '',

        // 优化是否可见
        inOptimize: false,

        // 当前题目是否正在优化中
        optimizing: false,

        // v-charts
        paramData: {
          columns: ['关键词权重', '主旨关键词数', '细节关键词数'],
          rows: []
        },
        scoreData: {
          columns: ['得分', '主旨人数', '细节人数', '总分人数'],
          rows: []
        },

        // 优化表单
        optimizeForm: {
          times: 1000, alpha: 0.01, lambda: 0.1, keyMean: 50, keySigma: 20, detailMean: 50, detailSigma:
            20,
          algorithm: 'gradient', reuse: true
        },
        algorithmOptions: [{label: "梯度下降", value: "gradient"}, {label: "最小二乘法", value: "normal"}],

        // cost function
        costData: {
          columns: ['迭代次数', '主旨损失函数值', '细节损失函数值'],
          rows: [],
        },
        optimizeDate: "",

        scoreStatistic: [],

        rule: [{required: true, message: '步长不能为空'}, {type: 'number', message: '必须为数字值'}],

        // loading
        scoreLoading: true,
        weightLoading: true,
        costLoading: true
      }
    },
    mounted() {
      this.getQuestionTableData();
    },
    methods: {
      // 获得question表格的数据
      getQuestionTableData() {
        // new Promise((resolve, reject) => {
          getAllType2().then(res => {
            this.questionTable = [];
            res.questions.forEach(question => {
              this.questionTable.push({
                'questionNum': question.questionId,
                'lastOpDate': question.lastOpDate ? question.lastOpDate : "—— ——",
                'inUse': question.inOptimize,
                'text': question.rawText,
                'status': question.inOptimize ? "优化中" : "空闲",
                'auto_optimized': question.optimized
              });
            });

            // resolve()
          }).catch(err => {
            console.log('err: ', err);
            // reject(err);
          })
        // }).then().catch();
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
                '主旨人数': keyHist[i],
                '细节人数': detailHist[i],
                '总分人数': totalHist[i],
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

            this.optimizeForm.keyMean = parseFloat(res.keyStatistic.mean.toFixed(2));
            this.optimizeForm.keySigma = parseFloat(res.keyStatistic.sigma.toFixed(2));
            this.optimizeForm.detailMean = parseFloat(res.detailStatistic.mean.toFixed(2));
            this.optimizeForm.detailSigma = parseFloat(res.detailStatistic.sigma.toFixed(2));
            this.scoreLoading = false;
            resolve();
          }).catch(err => {
            this.scoreLoading = false;
            console.log('err: ', err);
            reject(err);
          })
        }).then().catch();
      },

      // 获得weight chart的数据
      getWeightChartData(questionNum, histNum) {
        new Promise((resolve, reject) => {
          getWeightData(questionNum).then(res => {
            // chart部分
            let keyHist = [];
            let detailHist = [];
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
            this.fillHist(keyHist, res.keyWeight, histNum, max);
            this.fillHist(detailHist, res.detailWeight, histNum, max);
            this.paramData.rows = [];
            for (let i = 0; i < histNum; i++) {
              this.paramData.rows.push({
                '关键词权重': (i * max / histNum).toFixed(1) + ' ~ ' + ((i + 1) * max / histNum).toFixed(1),
                '主旨关键词数': keyHist[i],
                '细节关键词数': detailHist[i],
              });
            }
            this.weightLoading = false;
            resolve();
          }).catch(err => {
            this.weightLoading = false;
            console.log('err: ', err);
            reject(err);
          });
        }).then().catch();
      },

      // 获得cost data的数据
      getCostChartData(questionNum) {
        new Promise((resolve, reject) => {
          getLastCostData(questionNum).then(res => {
            this.optimizeDate = res.date;
            this.costData.rows = [];
            res.costData.forEach(data => {
              this.costData.rows.push({"迭代次数": data.itrTimes, "主旨损失函数值": data.keyCost, "细节损失函数值": data.detailCost});
            });
            this.costLoading = false;
            resolve();
          }).catch(err => {
            this.costLoading = false;
            console.log('err: ', err);
            reject(err);
          })
        }).then().catch();
      },

      handleOpt(index, row) {
        console.log("opt");
        console.log(index, row.questionNum);
        this.getScoreChartData(row.questionNum, this.scoreHistNum);
        this.getWeightChartData(row.questionNum, this.weightHistNum);
        this.displayQuestionNum = row.questionNum;
        this.inOptimize = true;
        this.optimizing = false;
      },

      toOpt() {
        this.getScoreChartData(this.displayQuestionNum, this.scoreHistNum);
        this.getWeightChartData(this.displayQuestionNum, this.weightHistNum);
        this.inOptimize = true;
        this.optimizing = false;
      },

      quitOpt() {
        this.getQuestionTableData();
        this.displayQuestionNum = '';
        this.inOptimize = false;
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
            this.optimizing = false;
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 优化表单提交
      submitOptimize(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('submit!');
            new Promise((resolve, reject) => {
              this.scoreLoading = true;
              this.weightLoading = true;
              this.costLoading = true;
              startAutoOpt(this.displayQuestionNum, this.optimizeForm).then(res => {
                this.$message({
                  message: '自动优化成功',
                  type: 'success'
                });
                this.getCostChartData(this.displayQuestionNum);
                this.getScoreChartData(this.displayQuestionNum, this.scoreHistNum, true);
                this.getWeightChartData(this.displayQuestionNum, this.weightHistNum);
                resolve();
              }).catch(err => {
                console.log('err: ', err);
                reject(err);
              });
            }).then().catch();
            this.optimizing = true;
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      // 刷新得分频率图
      refreshScoreChart() {
        this.scoreLoading = true;
        this.getScoreChartData(this.displayQuestionNum, this.scoreHistNum, true);
        console.log("refresh chart!")
      },
      // 刷新cost图
      refreshCostChart() {
        console.log("refresh cost chart!");
        this.costLoading = true;
        this.getCostChartData(this.displayQuestionNum);
      },
      // 查看优化状态
      watchOpt(index, row) {
        this.getScoreChartData(row.questionNum, this.scoreHistNum);
        this.getWeightChartData(row.questionNum, this.weightHistNum);
        this.displayQuestionNum = row.questionNum;
        this.getCostChartData(row.questionNum);
        this.inOptimize = true;
        this.optimizing = true;
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
        data.forEach(score => {
          for (let i = 0; i < histNum; i++) {
            if (score <= (i + 1) * limit / histNum) {
              hist[i]++;
              break;
            }
          }
        });
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
