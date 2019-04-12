<!--TODO 我的信息-->
<template>
  <d2-container :filename="filename">
    <template slot="header">我的信息</template>
    <div style="width: 50%">
      <el-form :model="form" ref="form" :rules="rules" label-width="80px" label-position="left">
        <el-form-item label="姓名" prop="name">
          <el-input id="name" v-model="form.name" :disabled="!isModifyName"><el-button slot="append" @click="changeName">{{ nameText }}</el-button></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" required>
          <el-input v-model="form.email" disabled=""></el-input>
        </el-form-item>
        <el-form-item label="密码" required>
          <el-input type="password" v-model="form.password" disabled=""><el-button slot="append" @click="changePass">{{ passText }}</el-button></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass" v-if="isModifyPass">
          <el-input type="password" v-model="form.pass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass" v-if="isModifyPass">
          <el-input type="password" v-model="form.checkPass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="注册时间">
          <el-input v-model="form.register_time" disabled=""></el-input>
        </el-form-item>
        <el-form-item label="上次登录">
          <el-input v-model="form.last_login_time" disabled=""></el-input>
        </el-form-item>
        <el-form-item label="剩余题数">
          <el-input v-model="form.remaining_exam_num" disabled=""></el-input>
        </el-form-item>
        <el-form-item label="会员时间">
          <el-col :span="11">
            <el-form-item>
              <el-input v-model="form.vip_start_time" disabled="" style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">&nbsp;&nbsp;&nbsp;——</el-col>
          <el-col :span="11">
            <el-form-item>
              <el-input v-model="form.vip_end_time" disabled="" style="width: 100%"></el-input>
            </el-form-item>
          </el-col>

        </el-form-item>
        <el-form-item label="微信id">
          <el-input v-model="form.wx_id" disabled=""><el-button slot="append" @click="releaseBind">{{ bindText }}</el-button></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </d2-container>
</template>

<script>
  import {getInfo} from '@api/user';
  import {modifyInfo} from '@api/user';
  import {untying} from '@api/user';

    export default {
        components: {
           },
        name: "userInfo",
        data() {
            let checkEmail = (rule, value, callback) => {
                const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
                if (!value) {
                    return callback(new Error('邮箱不能为空'))
                }
                setTimeout(() => {
                    if (mailReg.test(value)) {
                        callback()
                    } else {
                        callback(new Error('请输入正确的邮箱格式'))
                    }
                }, 100)
            };

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
                info:'',
                isModifyPass: false,
                isModifyName:false,

                nameText:'修改',
                passText: '修改',
                bindText:'解除绑定',
                form:{
                    name:'',
                    email:'',
                    password:'',
                    pass:'',
                    checkPass:'',
                    register_time:'',
                    last_login_time:'',
                    wx_id:'',
                    remaining_exam_num:'',
                    vip_start_time:'',
                    vip_end_time:''
                },
                rules: {
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' },
                    ],
                    pass: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    checkPass: [
                        { validator: validatePass2, trigger: 'blur' }
                    ],
                }
            }
        },
        mounted() {
            this.initInfo();
        },
        methods: {
            initInfo() {
                new Promise((resolve, reject) => {
                    getInfo().then(
                        res => {
                            console.log(res);
                            this.info = res;
                            this.form.name = this.info.name || '',
                                this.form.email = this.info.email || '',
                                this.form.password = this.info.password ||'',
                                this.form.last_login_time = this.info.last_login_time || '',
                                this.form.register_time = this.info.register_time || '',
                                this.form.remaining_exam_num = this.info.remaining_exam_num || '',
                                this.form.wx_id = this.info.wx_id,
                                this.form.vip_start_time = this.info.vip_start_time||'',
                                this.form.vip_end_time = this.info.vip_end_time||''
                            resolve();
                        }
                    ).catch(err => {
                        console.log('err: ', err);
                        reject(err)
                    })
                }).then(

                ).catch();
            },
            changeName() {
                if(this.isModifyName) {
                    this.nameText = '修改';
                    this.form.name = this.info.name;
                } else {
                    this.nameText = '取消修改'
                }
                this.isModifyName = !this.isModifyName;
                document.getElementById("name").focus();
            },
            //修改密码
            changePass() {
                if(this.isModifyPass) {
                    this.passText = '修改';
                    this.form.pass='';
                    this.form.checkPass='';
                } else {
                    this.passText = '取消修改'
                }
                this.isModifyPass = !this.isModifyPass
            },
            releaseBind() {
                if(this.form.wx_id == '') {
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
                            untying().then( res => {
                                this.$message({
                                    showClose: true,
                                    message: '解绑成功!',
                                    type: 'success'
                                });
                            }).catch()
                        }).then().catch();
                    }).catch(() => {});
                }

            },
            save() {
                this.$confirm('您确定保存当前修改的信息吗？','提示',{
                    confirmButtonText: '确定',
                    cancelButtonText:'取消',
                    type: 'warning'
                }).then(() => {
                    let username = this.form.name;
                    let userpass = '';
                    if(this.form.name == this.info.name && this.form.pass == '') {
                        this.$message({
                            showClose: true,
                            message: '您尚未作出任何修改!',
                            type: 'warning'
                        });
                    } else {
                        if(this.form.name != this.info.name) {
                            if(this.form.pass) {
                                userpass = this.form.pass;
                            } else {
                                userpass = this.form.password;
                            }
                        } else {
                            userpass = this.form.pass;
                        }

                        new Promise((resolve, reject) => {
                            modifyInfo({password:userpass, name: username}).then( res => {
                                window.location.reload();
                            }).catch();
                        }).then().catch()
                    }
                })
            },

        }
    }
</script>

<style scoped>

</style>