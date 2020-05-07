<template>
  <div class="result-container" id="result">
    <div class="main-content">
      <div v-if="!chart" class="error-container">
        {{ errorTitle }}
      </div>
      <div class="chart-container">
        <div class="titleContainer">{{ subTitle }}</div>
        <div>
          <div class="chartContainer" id="chart" ref="myEchart"></div>
        </div>
      </div>
      <div class="tip" v-if="chart">
        感谢您参与本次测试，此版本暂不提供具体测试结果解读。
        <br />
        <br />后续迭代版会提供详细测试结果报告，敬请期待。
      </div>
    </div>
    <div class="buttons">
      <el-button @click="logOff()">退出登录</el-button>
      <el-button @click="reExercise()">重新测试</el-button>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
import tooltip from "echarts/lib/component/tooltip";
import toolbox from "echarts/lib/component/toolbox";
import { getResult } from "@api/manager.exam";
import { mapActions } from "vuex";

export default {
  components: {},
  props: {
    width: {
      type: String,
      default: "800px"
    },
    height: {
      type: String,
      default: "600px"
    }
  },
  data() {
    return {
      chart: null,
      chartData: [],
      subTitle: "",
      errorTitle:"",
      totalScore: 100,
      counter: 0,
      timer: 0,
      queryTime: 3000, //每3秒轮询一次
      limitTime: 120000, //120秒超时
      loading: ""
    };
  },
  mounted() {
    this.loading = this.$loading({
      target: document.getElementById("result"),
      lock: true,
      text: "Loading",
      spinner: "el-icon-loading",
      // background: "rgba(0, 0, 0, 0.7)"
    });
    this.queryResult();
  },
  methods: {
    ...mapActions("d2admin/account", ["logout"]),

    queryResult() {
      new Promise((resolve, reject) => {
        getResult()
          .then(res => {
            let status = res.status;
            if (status === "Success") {
              clearInterval(this.timer);
              this.loading.close();
              this.chart = res.data;
              this.totalScore = res.totalScore;
              this.initChart();
            } else {
              // 不可能的情况
              this.$message({
                message: "系统出了点状况，请联系管理员解决噢～",
                type: "error",
                duration: 5 * 1000,
                center: true,
                showClose: true
              });
            }
            resolve();
          })
          .catch(err => {
            console.log("err: " + err);

            if (err.code === 5104) {
              if (this.counter * this.queryTime <= this.limitTime) {
                this.reTry(() => this.queryResult());
              } else {
                console.log(
                  "Try queryResult() max times! But the task is still waiting"
                );
              }
            } else {
              this.errorMessage(err);
            }
            reject(err);
          });
      })
        .then()
        .catch(err => {
          console.log(err);
        });
    },

    initChart() {
      this.subTitle = "总得分： " + this.totalScore.toFixed(2) + "分";
      let chart = echarts.init(document.getElementById("chart"));
      // 把配置和数据放这里
      chart.setOption({
        title: {
          text: "各项得分"
        },
        tooltip: {},
        name: {
          textStyle: {
            color: "#fff",
            backgroundColor: "#999",
            borderRadius: 3,
            padding: [3, 5]
          }
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        polar: [
          {
            indicator: [
              { text: "主旨", max: 100 },
              { text: "细节", max: 100 },
              { text: "音质", max: 100 },
              { text: "结构", max: 100 },
              { text: "逻辑", max: 100 }
            ]
          }
        ],
        calculable: true,
        series: [
          {
            name: "得分情况",
            type: "radar",
            itemStyle: {
              normal: {
                areaStyle: {
                  type: "default"
                }
              }
            },
            data: [
              {
                value: [
                  this.chart["主旨"].toFixed(2),
                  this.chart["细节"].toFixed(2),
                  this.chart["音质"].toFixed(2),
                  this.chart["结构"].toFixed(2),
                  this.chart["逻辑"].toFixed(2)
                ],
                name: "得分情况"
              }
            ]
          }
        ]
      });
    },
    errorMessage(e) {
      try {
        if (e === "timeout") {
          //                        this.$message('获取结果超时');
          this.errorTitle =
            "作答结果已记录，请稍作等待，在历史成绩中查看本次测试结果";
          clearInterval(this.timer);
          this.loading.close();
          return;
        }
        let response = JSON.parse(e.responseText);
        console.log(response);
        if (response.needDisplay) {
          this.$message(response.tip);
          this.errorTitle = "处理错误，请重新测试";
        } else {
          this.errorTitle = "处理出错，请重新测试";
        }
      } catch (e) {
        this.errorTitle = "处理出错，请重新测试";
      } finally {
        clearInterval(this.timer);
        this.loading.close();
      }
    },
    reExercise() {
      this.$emit("reExercise");
    },
    logOff() {
      this.logout({
        vm: this,
        confirm: true
      });
    },

    reTry(func, arg) {
      this.counter++;
      setTimeout(() => func(arg), this.queryTime);
    }
  }
};
</script>

<style>
.result-container {
  display: flex;
  flex-direction: column;
}
.buttons {
  display: flex;
  text-align: center;
  margin: 0 auto;
}
.chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  float: left;
  width: 60%;
}
.error-message{
    display: flex;
  flex-direction: column;
  align-items: center;
  float: left;
  width: 100%;
}
.titleContainer {
  margin-top: 20px;
}
.chartContainer {
  margin-top: 20px;
  height: 300px;
  width: 400px;
}
.tip {
  float: left;
  margin-top: 150px;
  font-size: large;
  width: 40%;
}
.error-container {
  margin-top: 20px;
  text-align: center;
}
</style>
