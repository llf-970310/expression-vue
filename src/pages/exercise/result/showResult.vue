<template>
    <div class="result-container" id="result">

            <div class="titleContainer">{{ subTitle }}</div>
        <div>
            <div class="chartContainer" id="chart" ref="myEchart"></div>
        </div>
            <div>
                <el-button @click="returnToIndex()">退出登录</el-button>
                <el-button @click="logout()">重新测试</el-button>
            </div>
    </div>
</template>
<script>
    import echarts from 'echarts';
    import tooltip from 'echarts/lib/component/tooltip'
    import toolbox from 'echarts/lib/component/toolbox'
    import {getResult} from '@api/question'
    export default {
        components: {},
        props: {
            width: {
                type: String,
                default: '800px'
            },
            height: {
                type: String,
                default: '600px'
            }
        },
        data() {
            return {
                chart: null,
                chartData:[],
                subTitle:'',
                totalScore:100,
                counter: 0,
                timer: 0,
                queryTime: 500, //每0。5秒轮询一次
                limitTime: 120000, //120秒超时
                loading:''
            }
        },
        mounted() {
            this.loading = this.$loading({
                target:document.getElementById('result'),
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.queryResult();
            console.log(this.chart);
            console.log(this.chart.data)
        },
        beforeDestroy() {
            if (!this.chart) {
                return
            }
            this.chart.dispose();
            this.chart = null;
        },
        methods: {
            queryResult() {
              if (this.counter * this.queryTime > this.limitTime) {
                  this.errorMessage("timeout");
               return;
              }
              new Promise((resolve, reject) => {
                  getResult().then(res => {
                      this.counter++;
                      let status = res.status;
                      if(status === "Success") {
                          clearInterval(this.timer);
                          this.loading.close();
                          this.chart = res.data;
                          this.totalScore = res.totalScore;
                          this.initChart();
                      }else {
                          this.counter++;
                          setTimeout(this.queryResult(),this.queryTime);
                      }
                      resolve();
                  }).catch( err => {
                      this.errorMessage(err);
                      reject()
                  });
              }).then().catch(err => {
                  console.log(err)
              });
            },

            initChart() {
                this.subTitle = "总得分： "+ this.totalScore.toFixed(2) + "分";
                let chart = echarts.init(document.getElementById('chart'));
//                let indicator = [];
//                let value = [];
//                Object.keys(this.chartData).forEach(function (key) {
//                    indicator.push({name: key, max: 100});
//                    value.push(chartData[key].toFixed(2));
//                });
                // 把配置和数据放这里
                chart.setOption(
                    {
                        title : {
                            text: '各项得分'
                        },
                        tooltip : {

                        },
                        name: {
                            textStyle: {
                                color: '#fff',
                                backgroundColor: '#999',
                                borderRadius: 3,
                                padding: [3, 5]
                            }
                        },
                        toolbox: {
                            show : true,
                            feature : {
                                mark : {show: true},
                                dataView : {show: true, readOnly: false},
                                restore : {show: true},
                                saveAsImage : {show: true}
                            }
                        },
                        polar : [
                            {
                                indicator : [
                                    { text: '主旨', max: 100},
                                    { text: '细节', max: 100},
                                    { text: '音质', max: 100},
                                    { text: '结构', max: 100},
                                    { text: '逻辑', max: 100},
                                ]
                            }
                        ],
                        calculable : true,
                        series : [
                            {
                                name: '得分情况',
                                type: 'radar',
                                itemStyle: {
                                    normal: {
                                        areaStyle: {
                                            type: 'default'
                                        }
                                    }
                                },
                                data : [
                                    {
                                        value : this.chart.data,
                                        name : '得分情况',
//                                        label: {
//                                            normal: {
//                                                show: true,
//                                                formatter: function (params) {
//                                                    return params.value;
//                                                }
//                                            }
//                                        }
                                    }
                                ]
                            }
                        ]
                    }
                )
            },
            errorMessage(e) {
                try {
                    if (e === 'timeout') {
//                        this.$message('获取结果超时');
                        this.subTitle = '服务器正忙，请稍后刷新重试';
                        clearInterval(this.timer);
                        this.loading.close();
                        return;
                    }
                    let response = JSON.parse(e.responseText);
                    console.log(response);
                    if(response.needDisplay) {
                        this.$message(response.tip);
                        this.subTitle = '处理错误，请重新测试';
                    } else {
//                        elsethis.$message('服务器出错了');
                        this.subTitle='处理出错，请重新测试';
                    }
                } catch (e) {
//                    this.$message('服务器出错了');
                    this.subTitle='处理出错，请重新测试';
                }finally {
                    clearInterval(this.timer);
                    this.loading.close();
                }
            },
            returnToIndex() {
                window.location.href = '/';
            },
            logout() {
                window.location.href = '/';
            }
        }
    }
</script>

<style>
    .result-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .titleContainer{
        margin-top: 20px;
    }
    .chartContainer {
        margin-top: 20px;
        height:500px;
        width: 600px
    }
</style>