<!--TODO 我的信息-->
<template>
  <d2-container :filename="filename">
    <template slot="header">我的信息</template>
    <el-row class="title-container">
      <span class="title">基本信息</span>
    </el-row>
    <div style="width: 50%">
      <el-form :model="form" ref="form" :rules="rules" label-width="80px" label-position="left">
        <el-form-item label="姓名" prop="name">
          <el-input id="name" v-model="form.name" :readonly="!isModifyName" ref="username" @change="userNameChange">
            <el-button slot="append" @click="changeName">{{ nameText }}</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="用户名" required>
          <el-input v-model="form.email" readonly></el-input>
        </el-form-item>
        <el-form-item label="密码" required>
          <el-input type="password" v-model="form.password" readonly>
            <el-button slot="append" @click="changePass">{{ passText }}</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass" v-if="isModifyPass">
          <el-input type="password" v-model="form.pass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass" v-if="isModifyPass">
          <el-input type="password" v-model="form.checkPass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="注册时间">
          <el-input v-model="form.register_time" readonly></el-input>
        </el-form-item>
        <el-form-item label="上次登录">
          <el-input v-model="form.last_login_time" readonly></el-input>
        </el-form-item>
        <el-form-item label="剩余次数">
          <el-input v-model="form.remaining_exam_num" readonly></el-input>
        </el-form-item>
        <el-form-item label="会员时间">
          <el-col :span="11">
            <el-form-item>
              <el-input v-model="form.vip_start_time" readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">&nbsp;——&nbsp;</el-col>
          <el-col :span="11">
            <el-form-item>
              <el-input v-model="form.vip_end_time" readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>

        </el-form-item>
        <el-form-item label="微信id" v-if="$store.state.isTesting==false">
          <el-input v-model="form.wx_id" readonly>
            <el-button slot="append" @click="releaseBind">{{ bindText }}</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="邀请码" v-if="$store.state.isTesting==false">
          <el-input v-model="invitationCode">
            <el-button slot="append" @click="updatePrivilege">更新权限</el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
          <!--          <el-button>取消</el-button>-->
        </el-form-item>
      </el-form>
    </div>
  </d2-container>
</template>

<script>

  import md5 from 'blueimp-md5'
  import { mapActions } from 'vuex'
  import { getInfo, modifyInfo, untying, updatePrivilege} from '@api/manager.user';


  export default {
    components: {},
    name: "userInfo",
    data() {
//            let checkEmail = (rule, value, callback) => {
//                const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
//                if (!value) {
//                    return callback(new Error('邮箱不能为空'))
//                }
//                setTimeout(() => {
//                    if (mailReg.test(value)) {
//                        callback()
//                    } else {
//                        callback(new Error('请输入正确的邮箱格式'))
//                    }
//                }, 100)
//            };


      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.form.checkPass !== '') {
            this.$refs.form.validateField('checkPass');
          }
          this.passError=false;
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          this.passError=true;
          this.errorMsg='请输入再次确认密码'
          callback(new Error('请再次输入密码'))
        } else if (value !== this.form.pass) {
          this.passError=true;
          this.errorMsg='两次输入密码不一致!'
          callback(new Error('两次输入密码不一致!'))
        } else {
          this.passError=false;
          callback()
        }
      };
      return {
        filename: __filename,
        info: '',
        isModifyPass: false,
        isModifyName: false,

        nameText: '修改',
        passText: '修改',
        bindText: '解除绑定',
        invitationCode: '',
        isPassChanged:false,
        passError:false,
        errorMsg:'',

        form: {
          name: '',
          email: '',
          password: '',
          pass: '',
          checkPass: '',
          register_time: '',
          last_login_time: '',
          wx_id: '',
          remaining_exam_num: '',
          vip_start_time: '',
          vip_end_time: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入姓名', trigger: 'blur'},
          ],
          pass: [
            {validator: validatePass, trigger: 'blur'}
          ],
          checkPass: [
            {validator: validatePass2, trigger: 'blur'}
          ],
        },

        name: '',
        pass: '',
      }
    },
    mounted() {
      this.initInfo();
      // this.initHistoryScore();

    },
    methods: {

      ...mapActions('d2admin/account', ['logout']),
      //初始化个人信息数据
      initInfo() {
        new Promise((resolve, reject) => {
          getInfo().then(
            res => {
              this.info = res;
              this.form.name = res.name;
              this.form.email = res.email;
              this.form.password = res.password;
              this.form.pass = '';
              this.form.checkPass = '';
              this.form.register_time = res.register_time;
              this.form.remaining_exam_num = res.remaining_exam_num;
              this.form.last_login_time = res.last_login_time;
              this.form.wx_id = res.wx_id;
              this.form.vip_start_time = res.vip_start_time;
              this.form.vip_end_time = res.vip_end_time;
              resolve();
            }
          ).catch(err => {
            console.log('err: ', err);
            reject(err)
          })
        }).then(

        ).catch();
      },
      //修改姓名
      changeName() {
        if (this.isModifyName) {
          this.nameText = '修改';
          this.form.name = this.info.name;
        } else {
          this.nameText = '取消修改'
        }
        this.isModifyName = !this.isModifyName;
//                document.getElementById("name").focus();
        this.$refs.username.focus();
      },

      //当姓名修改好后
      userNameChange(){
        if(this.form.name.length>20){
          this.$message.error('修改后的用户名不能超过20个字符');
        }
      },
      //修改密码
      changePass() {
        if (this.isModifyPass) {
          this.passText = '修改';
          this.form.pass = '';
          this.form.checkPass = '';
        } else {
          this.passText = '取消修改'
        }
        this.isModifyPass = !this.isModifyPass
      },

      //解除微信绑定
      releaseBind() {
        if (this.form.wx_id === '') {
          this.$message({
            showClose: true,
            message: '您尚未绑定微信，无需解绑!',
            type: 'warning'
          });
        } else {
          this.$confirm('此操作将解除您当前账号与微信的绑定, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            new Promise((resolve, reject) => {
              untying().then(res => {
                this.$message({
                  showClose: true,
                  message: '解绑成功!',
                  type: 'success'
                });
                resolve()
              }).catch()
            }).then(() => {
              this.form.wx_id = ''
            }).catch();
          }).catch(() => {
          });
        }

      },

        //更新权限
        updatePrivilege() {
            if (this.invitationCode === '') {
                this.$message({
                    showClose: true,
                    message: '邀请码无效！',
                    type: 'warning'
                });
            } else {
                this.$confirm('该操作将覆盖您已有的权限, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    new Promise((resolve, reject) => {
                        updatePrivilege(this.invitationCode).then(res => {
                            this.$message({
                                showClose: true,
                                message: '更新成功!',
                                type: 'success'
                            });
                            resolve()
                        }).catch((err) => {
                            this.$message({
                                showClose: true,
                                message: err.msg,
                                type: 'warning'
                            });
                        })
                    }).then(() => {
                        this.invitationCode = ''
                    }).catch();
                }).catch(() => {
                });
            }
        },
      logOff () {
        this.logout({
          vm: this,
          confirm: false
        })
      },

      //保存修改
      save() {
        this.$confirm('您确定保存当前修改的信息吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {


          //如果当前的姓名与原来姓名一致且新密码为空，则表示没有修改动作
          if (this.form.name == this.info.name && this.form.pass == '') {
            this.$message({
              showClose: true,
              message: '您尚未作出任何修改!',
              type: 'warning'
            });

            return;
          } else {
            if (this.form.name != this.info.name) {
              //说明用户修改了用户名
              //判断新修改的姓名是不是包含空格
              if(this.form.name.indexOf(" ")!=-1){
                this.$message({
                  showClose: true,
                  message: '新修改的姓名不能包含空格',
                  type: 'warning'
                });
                return;
              }

            //判断新修改的姓名长度
              if(this.form.name.length>20){
                this.$message({
                  showClose: true,
                  message: '修改后的用户名不能超过20个字符',
                  type: 'warning'
                });
                return;
              }
              //判断新修改的姓名是不是空
              if(this.form.name==''){
                this.$message({
                  showClose: true,
                  message: '新修改的姓名不能为空',
                  type: 'warning'
                });
                return;
              }

              if (this.form.pass == '') {

              } else {
                //用户修改了密码
                this.isPassChanged=true;
                this.pass = this.form.pass;
              }
            } else {
              //用户修改了密码
              this.isPassChanged=true;
              this.pass = this.form.pass;
            }
            if(this.isPassChanged){
              //密码被修改了
              if(this.form.pass.length>18){
                //新的密码长度大于是18位
                this.$message({
                  showClose: true,
                  message: '新修改的密码不能超过18位!',
                  type: 'warning'
                });
                return;
              }

              //判断新修改的密码是不是空格
              if(this.form.pass==' '){
                this.$message({
                  showClose: true,
                  message: '新修改的密码不能是空格!',
                  type: 'warning'
                });
                return;
              }

              if(this.form.checkPass==''){
                this.$message({
                  showClose: true,
                  message: '请输入确认密码!',
                  type: 'warning'
                });
                return;
              }
            }


            //判断确认密码是否有错
            if(this.passError){
              this.$message({
                showClose: true,
                message: this.errorMsg,
                type: 'warning'
              });
              return;
            }

            new Promise((resolve, reject) => {
              modifyInfo({
                password: this.pass,
                name: this.form.name
              }).then(res => {
                // window.location.reload();
                this.isModifyName = false;
                this.isModifyPass = false;
                this.nameText = '修改';
                this.passText = '修改';
                this.initInfo();

                this.$store.dispatch('d2admin/user/set', {
                  name: this.form.name
                }, {root: true})

                this.$message({
                  message: '已成功保存！',
                  type: 'success',
                  center: true,
                  showClose: true,
                  duration: 5000
                });
                if(this.isPassChanged){
                  //密码被修改需要退出去重新登录
                  console.log("密码修改")
                  this.logOff();
                }

              }).catch();
            }).then().catch()
          }
        }).catch(() => {
        });
      }

    }
  }
</script>

<style scoped>
  .title-container {
    margin-bottom: 10px;
  }

  .title {
    font-size: 20px;
    font-weight: bold;
    cursor: default;
  }
</style>
