<template>
  <div>

    <el-row class="d2-text-center index">
      <h3>温馨提示</h3>
    </el-row>

    <!--提示说明-->
    <div class="d2-text-center">
      <p>
        为了帮助您顺利完成表达能力测试，避免可能出现的因测试环境和测试设备引起的错误，<br/>
        请按照下面说明检查自己的测试环境和测试设备达到要求。
      </p>
    </div>

    <!--提示内容-->
    <div style="margin: 20px 50px 15px 50px">
      <el-row>
        <el-col :span="5" class="d2-text-center">
          <el-badge value="建议硬件"></el-badge>
        </el-col>
        <el-col :span="18">
          <el-button type="text" @click="pcChecking=true">电脑</el-button>
          （使用 Chrome 浏览器）
          <el-button type="text" @click="ipadChecking=true">、iPad</el-button>
          （使用 Safari 浏览器）。
        </el-col>
      </el-row>
      <br/>
      <el-row>
        <el-col :span="5" class="d2-text-center" style="vertical-align: center">
          <el-badge value="注意事项"></el-badge>
        </el-col>
        <el-col :span="18">
          1. 由于手机屏幕尺寸较小，可能对题目显示和作答带来不便，不建议您使用。<br/>
          2. 我们强烈建议您使用电脑端的 Chrome 浏览器，如果您仍选择使用 Safari 或 Firefox 请升级到最新版。<br/>
          3. 录音当中需要使用麦克风，iPad 自带耳机，AirPods 以及其他耳机自带麦克都可以满足需求。<br/>
          4. 测试过程中，请保持麦克风到嘴部 10-20 厘米的距离，过远的距离可能导致您的声音较小，不利于系统识别和分析，过近的距离则可能导致讲话时气流冲击麦克风形成较大噪音（喷麦），导致如录音失败。
        </el-col>
      </el-row>
    </div>


    <el-dialog title="PC"
               :visible.sync="pcChecking"
               width="70%">
      <el-row>
        您的电脑可以运行chrome浏览器，并且没有禁用 JavaScript 功能。如果您不了解是否禁用了 JavaScript 功能，您可以在
        Chrome 浏览器地址栏输入并访问 "
        <strong>
          chrome://settings/content/javascript
        </strong>
        "，
        启用 JavaScript 时您将看到如下状态：
        <el-image
            style="width: 100%; height: 30%"
            src="https://i.loli.net/2019/07/23/5d3716a183c9398547.png"
            fit="fit">
        </el-image>
        请确保您的 Chrome 浏览器版本不低于 52。
      </el-row>
      <el-row class="dialog-confirm">
        <el-button type="primary" @click="pcChecking = false">确 定</el-button>
      </el-row>
    </el-dialog>

    <el-dialog title="iPad"
               :visible.sync="ipadChecking"
               width="70%">
      <el-row>
        如果您使用 iPad 设备进行测试，请确保您的 iPad 操作系统在 iOS 12.3.0 以上，并且您需要使用 Safari 浏览器进行登录和测试。
      </el-row>
      <el-row class="dialog-confirm">
        <el-button type="primary" @click="ipadChecking = false">确 定</el-button>
      </el-row>
    </el-dialog>


    <div class="d2-text-center">
      <el-button round type="primary" @click="$emit('noticed')">开始测试</el-button>
      <el-button round @click="returnToHome">返回</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "notice",
    data() {
      return {
        pcChecking: false,
        ipadChecking: false,
      }
    },
    methods: {
      // 检查Chrome中JS的状态
      checkJS() {
        console.log('aaaa')
        window.open('chrome://settings/content/javascript', '_blank')
      },

      // 取消测试，返回首页
      returnToHome() {
        location.href = ''
      },
    }
  }
</script>

<style scoped>
  .dialog-confirm {
    text-align: right;
  }
</style>
