<!--正常考试的倒计时-->
<template>
  <div>

    <!--倒计时只管剩余多久，进度条才关心总时间及比例-->
    <countdown ref="countdown" :time="timeToCountByMilliSec" @end="handleEnd">
      <template slot-scope="props">
        <span v-if="onlySeconds">{{leftTimeString}} {{ props.totalSeconds }} 秒</span>
        <span v-else>{{leftTimeString}} {{ props.minutes }} 分 {{ props.seconds }} 秒</span>
        <!--timeToCount为秒单位，countdown组件接受的time属性单位为ms，props.totalSeconds为秒单位-->
        <el-progress class="count-down-progress" v-if="showProgress" :show-text="false" :stroke-width="18" :percentage="props.totalSeconds / totalTime * 100"
                     status="exception"></el-progress>
      </template>
    </countdown>

  </div>
</template>

<script>
  import VueCountdown from '@chenfengyuan/vue-countdown'

  export default {
    name: "my-count-down",
    props: {
      // 倒数计时的具体时间，即现在倒计时多久
      timeToCount: {
        required: true,
        type: Number
      },
      // 倒数计时的总时间
      totalTime: {
        required: true,
        type: Number
      },

      // 只展现秒数
      onlySeconds: {
        required: false,
        type: Boolean,
        default: true
      },
      showProgress:{
        required: false,
        type: Boolean,
        default: true
      },
      leftTimeString:{
        required:false,
        type: String,
        default: "剩余时间"
      }
    },
    components: {
      'countdown': VueCountdown
    },
    computed: {
      timeToCountByMilliSec: function () {
        return this.timeToCount * 1000
      },
    },
    methods: {
      /**
       * 倒计时结束通知父组件
       */
      handleEnd() {
        console.log('countdown end');
        this.$emit('end')
      },

      /**
       * 停止倒计时
       */
      endCounting() {
        this.$refs.countdown.abort()
      }
    }
  };
</script>

<style scoped>
  .count-down-progress{
    margin: 20px 0 0 0;
  }
</style>
