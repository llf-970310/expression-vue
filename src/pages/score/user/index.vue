<template>
  <div>
    <!--按用户查看-->
    <el-row>
      <el-col :span="10" :offset="7">
        <el-form :inline="true" :model="userSearchForm" :rules="userSearchRules" ref="userSearchForm">
          <el-form-item label="用户邮箱" prop="userEmail">
            <el-input v-model.trim="userSearchForm.userEmail" placeholder="请输入用户邮箱"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchUser">查询用户</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>


  </div>
</template>

<script>
  export default {
    name: "score-user",
    data() {
      return {
        userSearchForm: {
          userEmail: ''
        },
        userSearchRules: {
          userEmail: [
            {required: true, message: '用户邮箱不可为空', trigger: 'blur'},
            {type: 'email', message: '请输入合法的用户邮箱', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      searchUser() {
        console.log('aaa---' + this.userSearchForm.userEmail)
        this.$refs['userSearchForm'].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>