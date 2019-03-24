<!--成绩管理界面-->
<template>
  <d2-container :filename="filename">
    <template slot="header">成绩管理</template>

    <!--按题目查看-->
    <el-row>
      <el-col :span="10" :offset="7">
        <el-form :inline="true" :model="questionSearchForm" :rules="questionSearchRules" ref="questionSearchForm">
          <el-form-item label="题目编号" prop="questionId">
            <el-input v-model="questionSearchForm.questionId" placeholder="请输入题号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchQuestion">查询题目</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>
  export default {
    name: "score",
    data() {
      const validateQuestionId = (rule, value, callback) => {
        console.log('value: ' + value)
        let reg = /^[0-9]+$/
        if (!reg.test(value)) {
          return callback(new Error('题号只包含数字'))
        } else {
          callback()
        }
      }
      return {
        filename: __filename,
        questionSearchForm: {
          questionId: ''
        },
        questionSearchRules: {
          questionId: [{required: true, trigger: 'blur', validator: validateQuestionId}]
        }
      }
    },
    methods: {
      searchQuestion() {
        console.log('aaa---' + this.questionSearchForm.questionId)
        this.$refs['questionSearchForm'].validate((valid) => {
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