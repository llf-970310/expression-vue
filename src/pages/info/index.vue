<!--TODO 我的信息-->
<template>
  <d2-container :filename="filename">
    <template slot="header">我的信息</template>
    <div style="width: 50%">
      <el-form :model="form" ref="form" :rules="rules" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input id="name" v-model="form.name" :disabled="isModifyName"><el-button slot="append" @click="changeName">{{ nameText }}</el-button></el-input>
        </el-form-item>
        <el-form-item label="学号" prop="student_id">
          <el-input v-model.number="form.student_id" :disabled="isModifyId"><el-button slot="append" @click="changeId">{{ idText }}</el-button></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" :disabled="isModifyEmail"><el-button slot="append" @click="changeEmail">{{ emailText }}</el-button></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="form.password" disabled=""><el-button slot="append" @click="changePass">{{ passText }}</el-button></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass" v-if="isModifyPass">
          <el-input type="password" v-model="form.pass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass" v-if="isModifyPass">
          <el-input type="password" v-model="form.checkpass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="注册时间">
          <el-input v-model="form.register_time" disabled=""></el-input>
        </el-form-item>
        <el-form-item label="上次登录">
          <el-input v-model="form.last_login_time" disabled=""></el-input>
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
    export default {
        components: {
           },
        name: "userInfo",
        data() {

            const checkId = (rule, value, callback) => {
                const numberReg = /^1[3|4|5|7|8][0-9]{9}$/;
                if (!value) {
                    return callback(new Error('学号不能为空'))
                }
                setTimeout(() => {

                    if (!Number.isInteger(+value)) {
                        callback(new Error('请输入数字值'))
                    } else {
                        callback()
                    }
                }, 100)
            };

            const checkEmail = (rule, value, callback) => {
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

            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.form.checkPass !== '') {
                        this.$refs.form.validateField('checkPass');
                    }
                    callback();
                }
            };
            const validatePass2 = (rule, value, callback) => {
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
                isModifyPass: false,
                isModifyName:true,
                isModifyId:true,
                isModifyEmail: true,
                nameText:'修改',
                idText:'修改',
                emailText:'修改',
                passText: '修改',
                bindText:'解除绑定',
                form:{
                    name:'陈远志',
                    student_id:'151250021',
                    email:'lewis_0212@163.com',
                    password:'1234',
                    pass:'',
                    checkpass:'',
                    register_time:'2015-02-13',
                    last_login_time:'2015-02-16',
                    wx_id:'cyz827016291'
                },
                rules: {
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' },
                    ],
                    student_id: [
                        { required: true, message: '请输入学号', trigger: 'blur' },
                        { validator: checkId, trigger: 'blur'}
                    ],
                    email: [
                        {validator: checkEmail, trigger: 'blur'},
                        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
//                        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
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
        },
        methods: {
            changeName:function () {
                this.isModifyName = !this.isModifyName;
                if(this.isModifyName) {
                    this.nameText = '修改'
                } else {
                    this.nameText = '取消修改'
                }

                document.getElementById("name").focus();
            },
            changeId:function () {
                this.isModifyId = !this.isModifyId;
                if(this.isModifyId) {
                    this.idText = '修改'
                } else {
                    this.idText = '取消修改'
                }
            },
            changeEmail:function () {
                this.isModifyEmail = !this.isModifyEmail;
                if(this.isModifyEmail) {
                    this.emailText = '修改'
                } else {
                    this.emailText = '取消修改'
                }
            },
            //修改密码
            changePass:function () {
                if(this.isModifyPass) {
                    this.passText = '修改';
                    this.form.pass='';
                    this.form.checkpass='';
                } else {
                    this.passText = '取消修改'
                }
                this.isModifyPass = !this.isModifyPass
            },
            releaseBind:function () {

            },
            save:function () {

            },

        }
    }
</script>

<style scoped>

</style>