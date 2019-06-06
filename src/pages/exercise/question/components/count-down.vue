<!--倒计时-->
<template>
  <div>

    <countdown ref="countdown" :time="timeToCount" @end="handleEnd">
      <template slot-scope="props">
        <p class="d2-text-center">剩余时间：{{ props.totalSeconds }} 秒</p>
        <!--timeToCount为ms单位，props.totalSeconds为秒单位-->
        <el-progress :show-text="false" :stroke-width="18" :percentage="props.totalSeconds / timeToCount * 100000"
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
      // 倒数计时的具体时间
      timeToCount: Number
    },
    components: {
      'countdown': VueCountdown
    },
    methods: {
      /**
       * 倒计时结束通知父组件
       */
      handleEnd() {
        console.log('countdown end')
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

</style>