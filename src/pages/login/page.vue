<template>
  <div class="page-login">
    <div class="page-login--layer page-login--layer-area">
      <ul class="circles">
        <li v-for="n in 10" :key="n"></li>
      </ul>
    </div>
    <div
        class="page-login--layer page-login--layer-time"
        flex="main:center cross:center">
      {{time}}
    </div>
    <div class="page-login--layer">
      <div
          class="page-login--content"
          flex="dir:top main:justify cross:center box:justify">
        <div class="page-login--content-header">
          <!--<p class="page-login&#45;&#45;content-header-motto">-->
          <!--时间是一切财富中最宝贵的财富。 <span>—— 德奥弗拉斯多</span>-->
          <!--</p>-->
        </div>
        <div
            class="page-login--content-main"
            flex="dir:top main:center cross:center">
          <!-- logo -->
          <img class="page-login--logo" src="./image/logo.png">
          <!-- 表单 -->
          <div class="page-login--form">
            <el-card shadow="never">
              <el-form ref="loginForm" label-position="top" :rules="rules" :model="formLogin"
                       size="default"  @submit.native.prevent>
                <p align="center">表达力评测登录</p>
                <el-form-item prop="username">
                  <el-input type="text" v-model="formLogin.username" placeholder="手机/邮箱">
                    <i slot="prepend" class="fa fa-user-circle-o"></i>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input type="password" v-model="formLogin.password" placeholder="密码">
                    <i slot="prepend" class="fa fa-keyboard-o"></i>
                  </el-input>
                </el-form-item>
                <!--<el-form-item prop="code">-->
                <!--<el-input type="text" v-model="formLogin.code" placeholder="- - - -">-->
                <!--<template slot="prepend">验证码</template>-->
                <!--<template slot="append">-->
                <!--<img class="login-code" src="./image/login-code.png">-->
                <!--</template>-->
                <!--</el-input>-->
                <!--</el-form-item>-->
                <el-button size="default" @click="submit" type="primary"  native-type="submit" class="button-login">登录
                </el-button>
              </el-form>
            </el-card>
            <p class="page-login--options"
               flex="main:justify cross:center">
<!--              <span style="cursor: pointer" @click="wechat">微信登录</span>-->
              <span style="color: rgba(211,211,211,0.5)">微信登录</span>
              <span style="cursor: pointer" @click="toRegisterPage">注册用户</span>
            </p>
          </div>
        </div>
        <page-login-footer-copyright></page-login-footer-copyright>
      </div>
    </div>
    <!--<el-dialog title="注册" :visible.sync="dialogToggle"-->
    <!--center>-->
    <!--<el-form ref="registerForm" :model="registerData" label-width="80px" :rules="registerRules">-->
    <!--<el-form-item label="邮箱">-->
    <!--<el-input v-model="registerData.email"></el-input>-->
    <!--</el-form-item>-->
    <!--</el-form>-->
    <!--<div slot="footer" class="dialog-footer">-->
    <!--<el-button @click="dialogToggle = false">取 消</el-button>-->
    <!--<el-button type="primary" @click="doRegister">确 定</el-button>-->
    <!--</div>-->
    <!--</el-dialog>-->
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import { mapActions } from 'vuex'
  import PageLoginFooterCopyright from '../footer/page-login-footer-copyright'
  import md5 from 'blueimp-md5'

  export default {
    components: { PageLoginFooterCopyright },
    data () {
      return {
        timeInterval: null,
        time: dayjs().format('HH:mm:ss'),
        // 表单
        formLogin: {
          username: '',
          password: ''
          // code: ''
        },
        // 校验
        rules: {
          username: [{
            validator: (rule, value, callback) => {
              if (!value) {
                this.errorMsg='手机/邮箱不能为空'
                return callback(new Error('手机/邮箱不能为空'))
              }
              let reg = /^([^@]+@[^@]+\.[^@]+)$/

              let phone=/^1(3|4|5|6|7|8|9)\d{9}$/
              if(!phone.test(value)){
                //不能匹配手机号码
                if (!reg.test(value)) {
                  //不能匹配邮箱
                  this.errorMsg='手机/邮箱号码格式不正确'
                  return callback(new Error('邮箱/手机号码格式不正确'))
                }
              }
              return callback()
            },
            trigger: 'blur'
          }],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
          // code: [
          //   { required: true, message: '请输入验证码', trigger: 'blur' }
          // ]
        }
        // registerRules:{},
        // registerData: {},
        // dialogToggle: false
      }
    },
    mounted () {
      this.timeInterval = setInterval(() => {
        this.refreshTime()
      }, 1000)
    },
    beforeDestroy () {
      clearInterval(this.timeInterval)
    },
    methods: {
      ...mapActions('d2admin/account', [
        'login'
      ]),

      refreshTime () {
        this.time = dayjs().format('HH:mm:ss')
      },
      /**
       * @description 接收选择一个用户快速登录的事件
       * @param {Object} user 用户信息
       */
      handleUserBtnClick (user) {
        this.formLogin.username = user.username
        this.formLogin.password = user.password
        this.submit()
      },
      /**
       * @description 提交表单
       */
      // 提交登录信息
      submit () {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.login({
              vm: this,
              username: this.formLogin.username,
              password: this.formLogin.password
            }).then(() => {
              this.$router.push(this.$route.query.redirect || '/')
            }).catch(err => {
              console.log(err)

              if (err.code === 4301||err.code===4302) {
                this.$message({
                  message: err.msg,
                  type: 'error',
                  duration: 5 * 1000,
                  center: true,
                  showClose: true
                })
              }
            })
          } else {
            this.$message.error('手机号/邮箱,密码验证失败')
          }
        })
      },
      toRegisterPage () {
        this.$router.push('register')
      },
      wechat () {
        let redirectUrl = '/%23/wechat'
        // let redirectUrl = '/api/auth/wechat/login'
        location.href = 'https://open.weixin.qq.com/connect/qrconnect?' +
          'appid=wxd7bad9aab33bb581&' +
          'redirect_uri=https://www.parclabcn.com' + redirectUrl + '&' +
          'response_type=code&' +
          'scope=snsapi_login&' +
          'state=zidingyineirong#wechat_redirect'
      }
      // /**
      //  * @description 提交注册申请
      //  */
      // doRegister() {
      //     this.dialogToggle = false
      // }
    }
  }
</script>

<style lang="scss">
  .page-login {
    @extend %unable-select;
    $backgroundColor: #F0F2F5;
    // ---
    background-color: $backgroundColor;
    height: 100%;
    position: relative;
    // 层
    .page-login--layer {
      @extend %full;
      overflow: auto;
    }

    .page-login--layer-area {
      overflow: hidden;
    }

    // 时间
    .page-login--layer-time {
      font-size: 24em;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.03);
      overflow: hidden;
    }

    // 登陆页面控件的容器
    .page-login--content {
      height: 100%;
      min-height: 500px;
    }

    // header
    .page-login--content-header {
      padding: 1em 0;

      .page-login--content-header-motto {
        margin: 0px;
        padding: 0px;
        color: $color-text-normal;
        text-align: center;
        font-size: 12px;

        span {
          color: $color-text-sub;
        }
      }
    }

    // main
    .page-login--logo {
      width: 400px;
      margin-top: -2em;
    }

    // 登录表单
    .page-login--form {
      width: 280px;
      // 卡片
      .el-card {
        margin-bottom: 15px;
      }

      // 登录按钮
      .button-login {
        width: 100%;
      }

      // 输入框左边的图表区域缩窄
      .el-input-group__prepend {
        padding: 0px 14px;
      }

      .login-code {
        height: 40px - 2px;
        display: block;
        margin: 0px -20px;
        border-top-right-radius: 2px;
        border-bottom-right-radius: 2px;
      }

      // 登陆选项
      .page-login--options {
        margin: 0px;
        padding: 0px;
        font-size: 14px;
        color: $color-primary;
        margin-bottom: 15px;
        font-weight: bold;
      }

      .page-login--quick {
        width: 100%;
      }
    }

    // 快速选择用户面板
    .page-login--quick-user {
      @extend %flex-center-col;
      padding: 10px 0px;
      border-radius: 4px;

      &:hover {
        background-color: $color-bg;

        i {
          color: $color-text-normal;
        }

        span {
          color: $color-text-normal;
        }
      }

      i {
        font-size: 36px;
        color: $color-text-sub;
      }

      span {
        font-size: 12px;
        margin-top: 10px;
        color: $color-text-sub;
      }
    }

    .page-login--content-help {
      text-align: center;
      margin: 0 0 10px 0;
    }

    // 背景
    .circles {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;

      li {
        position: absolute;
        display: block;
        list-style: none;
        width: 20px;
        height: 20px;
        background: #FFF;
        animation: animate 25s linear infinite;
        bottom: -200px;
        @keyframes animate {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
            border-radius: 0;
          }
          100% {
            transform: translateY(-1000px) rotate(720deg);
            opacity: 0;
            border-radius: 50%;
          }
        }

        &:nth-child(1) {
          left: 15%;
          width: 80px;
          height: 80px;
          animation-delay: 0s;
        }

        &:nth-child(2) {
          left: 5%;
          width: 20px;
          height: 20px;
          animation-delay: 2s;
          animation-duration: 12s;
        }

        &:nth-child(3) {
          left: 70%;
          width: 20px;
          height: 20px;
          animation-delay: 4s;
        }

        &:nth-child(4) {
          left: 40%;
          width: 60px;
          height: 60px;
          animation-delay: 0s;
          animation-duration: 18s;
        }

        &:nth-child(5) {
          left: 65%;
          width: 20px;
          height: 20px;
          animation-delay: 0s;
        }

        &:nth-child(6) {
          left: 75%;
          width: 150px;
          height: 150px;
          animation-delay: 3s;
        }

        &:nth-child(7) {
          left: 35%;
          width: 200px;
          height: 200px;
          animation-delay: 7s;
        }

        &:nth-child(8) {
          left: 50%;
          width: 25px;
          height: 25px;
          animation-delay: 15s;
          animation-duration: 45s;
        }

        &:nth-child(9) {
          left: 20%;
          width: 15px;
          height: 15px;
          animation-delay: 2s;
          animation-duration: 35s;
        }

        &:nth-child(10) {
          left: 85%;
          width: 150px;
          height: 150px;
          animation-delay: 0s;
          animation-duration: 11s;
        }
      }
    }
  }
</style>
