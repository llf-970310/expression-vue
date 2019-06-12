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

      legend: {
        required: true,
        type: String
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
          dataZoom: [
            // 内置于坐标系中，可以在坐标系上通过鼠标拖拽、鼠标滚轮、手指滑动（触屏上）来缩放或漫游坐标系
            {
              type: 'inside',
              start: 0,
              end: 100
            },

            // 有单独的滑动条，用户在滑动条上进行缩放或漫游
            {
              type: 'slider',
              start: 0,
              end: 100,
              filterMode: 'empty',
              handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
              handleSize: '75%',
              handleStyle: {
                // 图形的颜色
                color: '#fff',
                // 图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
              }
            }],
          legend: {
            data: [this.legend, '区间比例']
          },
          xAxis: [
            {
              name: '区间',
              type: 'category',
              boundaryGap: true,
              data: _this.scorePartition
            },
          ],
          yAxis: [
            {
              type: 'value',
              scale: true,
              name: _this.legend,
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
              name: _this.legend,
              type: 'bar',
              data: _this.numByPartition,
              yAxisIndex: 0,
              large: true,
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