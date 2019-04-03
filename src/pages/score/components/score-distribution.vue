<template>
  <div :style="{height: height, width: width}"></div>
</template>

<script>
  import echarts from "echarts"

  require('echarts/theme/macarons')

  export default {
    name: "score-distribution",
    props: {
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '300px'
      },

      title: {
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
      }
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
          title: {
            text: _this.title,
            x: 'center',
            y: 'top'
          },
          toolbox: {
            show: true,
            feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: false},
              magicType: {
                show: true,
                type: ['pie', 'funnel']
              },
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            data: _this.scorePartition,
            x: 'center',
            y: '30px'
          },
          calculable: true,
          series: [
            {
              name: _this.title,
              type: 'pie',
              radius: [15, 95],
              center: ['50%', '60%'],
              roseType: 'area',
              animationEasing: 'bounceInOut',
              animationDuration: 2300,
              data: _this.numByPartition
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