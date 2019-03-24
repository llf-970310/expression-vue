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
            <div class="page-optimize--subtitle" style="color: #ABABAB; font-size: 12px; margin-left: 20px; padding-top: 4px">优化日期: {{optimizeDate}}</div>
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
  export default {
    name: 'optimize-auto',
    data() {
      let textStub = '高铁是现在是最受欢迎的出行方式。首先，高铁速度快，比如说，以前从贵阳到北京，要用40个小时左右，但现在高铁只需要6个小时，大大减少了路途时间。其次，高铁正点率高，因为高铁受天气条件影响较小，通常都可以准时发车，按时到达。最后，高铁环境舒适，高铁坐席宽敞，运行时速度平稳，没有噪音，餐车环境整洁，配有电源插座和无线网络，乘坐高铁很少会造成不适感，对于不习惯坐飞机出行的人士，高铁是更理想的选择。但高铁的建设';
      let costData = [];
      for (let i = 0; i < 50; i++) {
        costData.push({"迭代次数": i + 1, "损失函数值": Math.pow(2, (50 - i) / 15)})
      }
      console.log(costData);
      return {
        filename: __filename,
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
        // search
        searchQuestion: {
          questionNum: '',
        },
        displayQuestionNum: '1',

        // 优化是否可见
        inOptimize: false,

        // 当前题目是否正在优化中
        optimizing: false,

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
        scoreData: {
          columns: ['得分', '主旨人数频率', '细节人数频率', '总分人数频率'],
          rows: [
            {'得分': '0 ~ 20', '主旨人数频率': 0.12, '细节人数频率': 0.15, '总分人数频率': 0.13},
            {'得分': '20 ~ 40', '主旨人数频率': 0.23, '细节人数频率': 0.17, '总分人数频率': 0.16},
            {'得分': '30 ~ 60', '主旨人数频率': 0.33, '细节人数频率': 0.24, '总分人数频率': 0.30},
            {'得分': '40 ~ 80', '主旨人数频率': 0.23, '细节人数频率': 0.33, '总分人数频率': 0.31},
            {'得分': '50 ~ 100', '主旨人数频率': 0.11, '细节人数频率': 0.10, '总分人数频率': 0.105},
          ]
        },

        // 优化表单
        optimizeForm: {times: 10000, alpha: 0.1, lambda: 1, algorithm: 'gradient', watch: true},
        algorithmOptions: [{label: "梯度下降", value: "gradient"}],

        // cost function
        costData : {
          columns: ['迭代次数', '损失函数值'],
          rows: costData,
        },
        optimizeDate: "2019-03-19"

      }
    },
    methods: {

      handleOpt(index, row) {
        console.log("opt");
        console.log(index, row.questionNum);
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
        this.displayQuestionNum = row.questionNum;
        this.inOptimize = true;
        this.optimizing = true;
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
