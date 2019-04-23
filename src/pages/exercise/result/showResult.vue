<template>
    <div class="result-container">

            <div>总得分：{{  }}</div>
        <div style="align:center">
            <div class="chartContainer" id="chart" ref="myEchart"></div>
        </div>
            <el-button>退出登录</el-button>
            <el-button>重新测试</el-button>
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
                counter: 0,
                timer: 0,
                queryTime: 500, //每0。5秒轮询一次
                limitTime: 120000 //120秒超时
            }
        },
        mounted() {
            this.initChart();
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
              if (counter * this.queryTime > this.limitTime) {
               return;
              }
              new Promise((resolve, reject) => {
                  getResult().then(res => {
                      resolve();
                  }).catch( err => {
                      reject()
                  });
              }).then()
            },

            initChart() {
                let chart = echarts.init(document.getElementById('chart'));
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
                                        value : [90, 80, 30, 60, 50],
                                        name : '得分情况'
                                    }
                                ]
                            }
                        ]
                    }
                )
            }
        }
    }
</script>

<style>
    .result-container {
        text-align: center;
    }
    .chartContainer {
        height:500px;
        width: 600px
    }
</style>