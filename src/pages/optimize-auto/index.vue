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
          <el-table-column prop="lastOpDate" label="上次优化时间" width="150px"></el-table-column>
          <el-table-column prop="status" label="状态" width="70px"></el-table-column>
          <el-table-column align="right">
            <template slot-scope="scope">
              <el-button size="mini" @click="watchOpt(scope.$index, scope.row)">查看优化状态
              </el-button>
              <el-button size="mini" @click="handleOpt(scope.$index, scope.row)" :disabled=scope.row.inUse>自动优化
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
            <ve-line :data="costData" :settings="{xAxisType: 'value'}"></ve-line>
          </template>
        </div>
      </div>
      <!--优化表单-->
      <div v-if="!optimizing">

        <div class="page-optimize--subtitle" style="width: 100%; margin-bottom: 10px">优化选项设置</div>
        <div style="width: 60%">
          <el-form :model="optimizeForm" ref="optimizeForm" label-width="160px">
            <el-form-item label="迭代次数" prop="times"
                          :rules="[{ required: true, message: '迭代次数不能为空'},{ type: 'number', message: '迭代次数必须为数字值'}]">
              <el-input v-model.number="optimizeForm.times"></el-input>
            </el-form-item>
            <el-form-item label="步长 (α)" prop="alpha"
                          :rules="[{ required: true, message: '步长不能为空'},{ type: 'number', message: '步长必须为数字值'}]">
              <el-input v-model.number="optimizeForm.alpha"></el-input>
            </el-form-item>
            <el-form-item label="正规化参数 (λ)" prop="lambda"
                          :rules="[{ required: true, message: '步长不能为空'},{ type: 'number', message: '步长必须为数字值'}]">
              <el-input v-model.number="optimizeForm.lambda"></el-input>
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
            <el-form-item label="监测优化" prop="watch">
              <el-switch v-model="optimizeForm.watch"></el-switch>
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
  import {getAllQuestions} from '@api/manager.question'
  import {getWeightData, getScoreData, getLastCostData, startAutoOpt, stopAutoOpt, refreshAutoOpt} from '@/api/optimize'

  export default {
    name: 'optimize-auto',
    data() {

      return {
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
        optimizeForm: {times: 10000, alpha: 0.1, lambda: 1, algorithm: 'gradient', watch: true},
        algorithmOptions: [{label: "梯度下降", value: "gradient"}],

        // cost function
        costData: {
          columns: ['迭代次数', '损失函数值'],
          rows: [],
        },
        optimizeDate: ""

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

      // 获得weight chart的数据
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
            resolve();
          }).catch(err => {
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
              this.costData.rows.push({"迭代次数": data.itrTimes, "损失函数值": data.cost});
            });
            resolve();
          }).catch(err => {
            console.log('err: ', err);
            reject(err);
          })
        }).then().catch();
      },

      handleOpt(index, row) {
        console.log("opt");
        console.log(index, row.questionNum);
        this.getScoreChartData(row.questionNum, 5);
        this.getWeightChartData(row.questionNum, 5);
        this.displayQuestionNum = row.questionNum;
        this.inOptimize = true;
        this.optimizing = false;
      },

      quitOpt() {
        this.displayQuestionNum = '';
        this.inOptimize = false;
      },
      // 搜索题目按钮监听
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
      // 优化表单提交
      submitOptimize(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('submit!');
            new Promise((resolve, reject) => {
              startAutoOpt(this.displayQuestionNum, this.optimizeForm).then(res => {
                this.$message({
                  message: '提交自动优化申请成功',
                  type: 'success'
                });
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
        console.log("refresh chart!")
      },
      // 刷新得分频率图
      refreshCostChart() {
        console.log("refresh cost chart!")
      },
      // 查看优化状态
      watchOpt(index, row) {
        this.getScoreChartData(row.questionNum, 5);
        this.getWeightChartData(row.questionNum, 5);
        this.displayQuestionNum = row.questionNum;
        this.getCostChartData(row.questionNum);
        this.inOptimize = true;
        this.optimizing = true;
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
    }
  }
</script>

<style lang="scss">
  .page-optimize--subtitle {
    font-size: 16px;
    float: left;
  }

</style>
