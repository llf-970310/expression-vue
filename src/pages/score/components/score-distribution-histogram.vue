<template>
  <div :style="{height: height, width: width}"></div>
</template>

<script>
  import echarts from "echarts"

  require('echarts/theme/macarons')

  export default {
    name: "score-distribution-histogram",
    props: {
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '300px'
      },

      scorePartition: {
        required: true,
        type: Array
      },
      numByPartition: {
        required: true,
        type: Array
      },
      proportionByPartition: {
        required: true,
        type: Array
      },
    },
    data() {
      return {
        chart: null
      }
    },
    watch: {
      scorePartition: function () {
        this.initCharts()
      }
    },
    methods: {
      initCharts() {
        this.$emit('prepare')
        this.chart = echarts.init(this.$el, 'macarons');

        const _this = this
        // console.log('----------')
        // console.log(_this.numByPartition)
        // console.log(_this.proportionByPartition)
        this.chart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#283b56'
              }
            }
          },
          toolbox: {
            show: true,
            feature: {
              dataView: {readOnly: false},
              restore: {},
              saveAsImage: {}
            }
          },
          dataZoom: {
            show: false,
            start: 0,
            end: 100
          },
          legend: {
            data: ['区间人数', '区间比例']
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: true,
              data: _this.scorePartition
            },
          ],
          yAxis: [
            {
              type: 'value',
              scale: true,
              name: '人数',
              min: 0,
              minInterval: 1,
              boundaryGap: [0.2, 0.2],
              position: 'left',
            },
            {
              type: 'value',
              scale: true,
              name: '比例',
              max: 1,
              min: 0,
              boundaryGap: [0.2, 0.2],
              position: 'right',
            }
          ],
          series: [
            {
              name: '区间人数',
              type: 'bar',
              data: _this.numByPartition,
              yAxisIndex: 0,
            },
            {
              name: '区间比例',
              type: 'line',
              data: _this.proportionByPartition,
              yAxisIndex: 1,
            }
          ],
          animationEasing: 'bounceInOut',
          animationDuration: 2300,
        })

        this.$emit('ready')
      }
    }

  }
</script>

<style scoped>

</style>