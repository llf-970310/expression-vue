<template>
  <div>
    <div class="result-container" id="result" v-if="isDetail==false">
      <div class="main-content" >
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
          <!--        感谢您参与本次测试，此版本暂不提供具体测试结果解读。-->
          <!--        <br/>-->
          <!--        <br/>后续迭代版会提供详细测试结果报告，敬请期待。-->
          感谢您参与本次测试，<i><a @click="goToDetail">点击此处</a></i>查看详细结果
        </div>
      </div>

      <div class="buttons">
        <el-button @click="logOff()">退出登录</el-button>
        <el-button @click="reExercise()">重新测试</el-button>
      </div>
    </div>
    <div v-else>
      <!--      查看结果的详细评价-->
      <result-detail
              :totalScore="totalScore"
              :report="report">
      </result-detail>
    </div>
  </div>

</template>
<script>
  import echarts from 'echarts'
  import { getResult } from '@api/manager.exam'
  import { mapActions } from 'vuex'
  import ResultDetail from "./resultDetail";

  export default {
    components: {ResultDetail},
    props: {
      width: {
        type: String,
        default: '800px'
      },
      height: {
        type: String,
        default: '600px'
      },
      //题目模板id
      templateId:String,
      //题目模板名称
      templateLabel:String,
    },
    data () {
      return {
        chart: null,
        chartData: [],
        subTitle: '',
        errorTitle: '',
        totalScore: 100,
        counter: 0,
        timer: 0,
        queryTime: 3000, //每3秒轮询一次
        limitTime: 120000, //120秒超时
        loading: '',
        isDetail:false,
        report:{},//文字报告
      }
    },
    mounted () {
      this.loading = this.$loading({
        target: document.getElementById('result'),
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
      })
      this.queryResult()
      console.log("结果页面"+this.templateLabel);
    },
    methods: {
      ...mapActions('d2admin/account', ['logout']),

      queryResult () {
        getResult().then(res => {
              let status = res.status
              if (status === 'Success') {
                clearInterval(this.timer)
                console.log("kkkkkkkkkkk")
                console.log(res)
                this.loading.close()
                this.chart = res.data
                console.log(this.chart)
                this.totalScore = res.totalScore
                this.report=res.report
                this.initChart()
              } else {
                // 不可能的情况
                this.$message({
                  message: '系统出了点状况，请联系管理员解决噢～',
                  type: 'error',
                  duration: 5 * 1000,
                  center: true,
                  showClose: true
                })
              }
            }).catch(err => {
              console.log('err: ' + err)

              if (err.code === 5104) {
                if (this.counter * this.queryTime <= this.limitTime) {
                  this.reTry(() => this.queryResult())
                } else {
                  console.log(
                      'Try queryResult() max times! But the task is still waiting'
                  )
                }
              } else {
                this.errorMessage(err)
              }
            })
      },

      initChart () {
        this.subTitle = this.templateLabel+'得分情况'
        let chart = echarts.init(document.getElementById('chart'))
        // 把配置和数据放这里
        chart.setOption({
          title: {
            text: this.templateLabel+'总得分： ' + this.totalScore.toFixed(2)+ '分',
            left:'center',
            top:'bottom',
          },
          tooltip : {
            trigger: 'axis',
            padding:10,
            formatter:function(params){
              var data = '';
              $.each(params,function (index,item) {
                data += item.name+':'+item.value+'&nbsp;万元 '+ '<br/>';
              });
              return ' ';
            }
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
            show: true,
            feature: {
              mark: { show: true },
              dataView: { show: true,
                readOnly: true,
                optionToContent: function (opt) {
                  var series = opt.series;
                  console.log(series[0].data[0].name[0]+"kkkkk")
                  var tdHeads = '<td  style="padding:0 10px">单项名称</td>';
                  for(var i=0;i<series[0].data[0].name.length;i++){
                    tdHeads += '<td style="padding: 0 10px">'+series[0].data[0].name[i]+'</td>';
                  }

                  // series[0].data.name.forEach(function (item) {
                  //   tdHeads += '<td style="padding: 0 10px">'+item+'</td>';
                  // });
                  var table = '<table border="1" style="margin-left:20px;border-collapse:collapse;font-size:14px;text-align:center"><tbody><tr>'+tdHeads+'</tr>';
                  var tdBodys = '';
                    for (var j = 0; j < series[0].data[0].value.length; j++) {
                        tdBodys += '<td>'+series[0].data[0].value[j]+'</td>';
                    }
                    table += '<tr><td>具体得分</td>'+ tdBodys +'</tr>';


                  table += '</tbody></table>';
                  return table;
                } },
              saveAsImage: { show: true }
            }
          },
          polar: [
            {
              indicator: [
                { text: '主旨：'+this.chart['主旨'].toFixed(2), max: 100 },
                { text: '细节：'+ this.chart['细节'].toFixed(2), max: 100 },
                { text: '音质：'+this.chart['音质'].toFixed(2), max: 100 },
                { text: '结构：'+ this.chart['结构'].toFixed(2), max: 100 },
                { text: '逻辑：'+  this.chart['逻辑'].toFixed(2), max: 100 }
              ]
            }
          ],
          calculable: true,
          series: [
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
              data: [
                {
                  value: [
                    this.chart['主旨'].toFixed(2),
                    this.chart['细节'].toFixed(2),
                    this.chart['音质'].toFixed(2),
                    this.chart['结构'].toFixed(2),
                    this.chart['逻辑'].toFixed(2)
                  ],
                  name: ['主旨','细节','音质','结构','逻辑']
                }
              ]
            }
          ]
        })
      },
      errorMessage (e) {
        try {
          if (e === 'timeout') {
            //                        this.$message('获取结果超时');
            this.errorTitle =
                '作答结果已记录，请稍作等待，在历史成绩中查看本次测试结果'
            clearInterval(this.timer)
            this.loading.close()
            return
          }
          let response = JSON.parse(e.responseText)
          console.log(response)
          if (response.needDisplay) {
            this.$message(response.tip)
            this.errorTitle = '处理错误，请重新测试'
          } else {
            this.errorTitle = '处理出错，请重新测试'
          }
        } catch (e) {
          this.errorTitle = '处理出错，请重新测试'
        } finally {
          clearInterval(this.timer)
          this.loading.close()
        }
      },
      reExercise () {
        this.$emit('reExercise')
      },
      logOff () {
        this.logout({
          vm: this,
          confirm: true
        })
      },

      reTry (func, arg) {
        this.counter++
        setTimeout(() => func(arg), this.queryTime)
      },
      goToDetail(){
        console.log(this.isDetail)
        console.log('kkkkkk')
        console.log("查看详细页面结果")
        this.isDetail=!this.isDetail;
      }
    }
  }
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
  
  .error-message {
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
    width: 450px;
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
