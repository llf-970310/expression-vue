<template>
  <div :style="{height: height, width: width}"></div>
</template>

<script>
  import echarts from "echarts"

  require('echarts/theme/macarons')

  export default {
    name: "score-change",
    props: {
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '300px'
      },

      // x轴自变量的数据
      variables: {
        required: true,
        type: Array
      },
      // x轴自变量的名称
      variableName: {
        required: true,
        type: String
      },

      // y轴
      mainScore: {
        required: true,
        type: Array
      },
      detailScore: {
        required: true,
        type: Array
      },
      totalScore: {
        required: true,
        type: Array
      }
    },
    data() {
      return {
        chart: null
      }
    },
    watch: {
      variables: function () {
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
            position: function (pt) {
              return [pt[0], '10%'];
            }
          },
          toolbox: {
            right: '15px',
            feature: {
              dataZoom: {
                yAxisIndex: false
              },
              magicType: {
                type: ['line', 'bar'],
                // type: ['line', 'bar', 'stack', 'tiled']
              },
              restore: {},
              saveAsImage: {}
            }
          },
          // legend: {},
          xAxis: {
            name: _this.variableName,
            type: 'category',
            boundaryGap: true,
            data: _this.variables
          },
          yAxis: {
            name: '分数',
            type: 'value',
            boundaryGap: [0.2, 0.2],
            min: 0,
            max: 100
          },
          legend: {
            data: ['主旨分', '细节分', '总分'],
            selected: {
              '主旨分': false,
              '细节分': false,
              '总分': true
            },
            x: 'center',
            y: '30px'
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
          series: [
            {
              name: '主旨分',
              type: 'line',
              // smooth: true,
              symbol: 'none',
              sampling: 'average',
              animationEasing: 'bounceInOut',
              animationDuration: 2300,
              data: _this.mainScore
            },
            {
              name: '细节分',
              type: 'line',
              // smooth: true,
              symbol: 'none',
              sampling: 'average',
              animationEasing: 'bounceInOut',
              animationDuration: 2300,
              data: _this.detailScore
            },
            {
              name: '总分',
              type: 'line',
              // smooth: true,
              itemStyle: {
                color: 'red'
              },
              symbol: 'none',
              sampling: 'average',
              animationEasing: 'bounceInOut',
              animationDuration: 2300,
              data: _this.totalScore
            }
          ]
        })

        this.$emit('ready')
      }
    }

  }
</script>

<style scoped>

</style>