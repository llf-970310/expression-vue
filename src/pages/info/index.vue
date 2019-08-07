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
          <el-input id="name" v-model="form.name" :readonly="!isModifyName" ref="username">
            <el-button slot="append" @click="changeName">{{ nameText }}</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="邮箱" required>
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
        <el-form-item label="剩余题数">
          <el-input v-model="form.remaining_exam_num" readonly></el-input>
        </el-form-item>
        <el-form-item label="会员时间">
          <el-col :span="11">
            <el-form-item>
              <el-input v-model="form.vip_start_time" readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">&nbsp;&nbsp;&nbsp;——</el-col>
          <el-col :span="11">
            <el-form-item>
              <el-input v-model="form.vip_end_time" readonly style="width: 100%"></el-input>
            </el-form-item>
          </el-col>

        </el-form-item>
        <el-form-item label="微信id">
          <el-input v-model="form.wx_id" readonly>
            <el-button slot="append" @click="releaseBind">{{ bindText }}</el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-row class="title-container">
      <span class="title">历史成绩</span>
    </el-row>
    <div v-loading="historyScoreLoading">
      <el-table v-if="historyScoreList"
                :data="historyScoreList"
                empty-text="该账号没有历史测试记录"
                height="300"
                border
                style="width: 100%">
        <el-table-column
            prop="test_start_time"
            label="开始时间"
            width="155">
        </el-table-column>
        <!--        <el-table-column-->
        <!--            prop="paper_type"-->
        <!--            label="类型"-->
        <!--            width="50">-->
        <!--        </el-table-column>-->
        <el-table-column
            prop="score_info.音质"
            label="音质"
            width="60">
        </el-table-column>
        <el-table-column
            prop="score_info.结构"
            label="结构"
            width="60">
        </el-table-column>
        <el-table-column
            prop="score_info.逻辑"
            label="逻辑"
            width="60">
        </el-table-column>
        <el-table-column
            prop="score_info.细节"
            label="细节"
            width="60">
        </el-table-column>
        <el-table-column
            prop="score_info.主旨"
            label="主旨"
            width="60">
        </el-table-column>
        <el-table-column
            prop="score_info.total"
            label="总得分"
            width="70">
        </el-table-column>
        <!--        <el-table-column-->
        <!--            prop="all_analysed"-->
        <!--            label="是否分析"-->
        <!--            width="100">-->
        <!--          <template slot-scope="scope">-->
        <!--            <el-tag v-if="scope.row.all_analysed" type="success">已分析</el-tag>-->
        <!--            <el-tag v-else type="info">未分析</el-tag>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
      </el-table>

      <el-row>
        <p>
          历史成绩的显示可能会有所延迟，如果暂时没有，请三小时后再来查看哦～
        </p>
      </el-row>
    </div>
  </d2-container>
</template>

<script>
  import {getInfo} from '@api/user';
  import {modifyInfo} from '@api/user';
  import {untying} from '@api/user';
  import {showScore} from '@api/user';

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
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.form.pass) {
          callback(new Error('两次输入密码不一致!'))
        } else {
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


        //历史答题加载等待
        historyScoreLoading: true,
        //所有历史答题成绩记录
        historyScoreList: []
      }
    },
    mounted() {
      this.initInfo();
      this.initHistoryScore();

    },
    methods: {

      //初始化个人信息数据
      initInfo() {
        new Promise((resolve, reject) => {
          getInfo().then(
            res => {
              this.info = res;
              this.form.name = res.name;
              this.form.email = res.email;
              this.form.password = res.password;
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

      //初始化历史成绩表格数据
      initHistoryScore() {
        new Promise((resolve, reject) => {
          showScore().then(res => {
            console.log(res);
            this.historyScoreList = res.history;
            console.log(this.historyScoreList)
            resolve();
          }).catch(err => {
            console.log('err: ', err);

            if (err.code === 4042) {
              // 用户暂无历史成绩
              resolve()
            } else {
              reject(err)
            }
          })
        }).then(() => {
          this.historyScoreLoading = false
        }).catch();
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
          } else {
            if (this.form.name != this.info.name) {
              if (this.form.pass == '') {

              } else {
                this.pass = this.form.pass;
              }
            } else {
              this.pass = this.form.pass;
            }
            new Promise((resolve, reject) => {
              modifyInfo({
                password: this.pass,
                name: this.form.name
              }).then(res => {
                window.location.reload();
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
  }
</style>