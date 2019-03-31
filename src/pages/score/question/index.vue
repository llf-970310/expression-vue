<template>
  <div>
    <!--按题目查看-->
    <el-row>
      <el-col :span="10" :offset="7">
        <el-form :inline="true" :model="questionSearchForm" :rules="questionSearchRules" ref="questionSearchForm">
          <el-form-item label="题目编号" prop="questionId">
            <el-input v-model.trim="questionSearchForm.questionId" placeholder="请输入题目编号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchQuestion">查询题目</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>


  </div>
</template>

<script>
  export default {
    name: "score-question",
    data() {
      const validateQuestionId = (rule, value, callback) => {
        // console.log('value: ' + value)
        if (value === '') {
          return callback(new Error('题目编号不可为空'))
        }

        let reg = /^[0-9]+$/
        if (!reg.test(value)) {
          return callback(new Error('题目编号只包含数字'))
        } else {
          callback()
        }
      }
      return {
        questionSearchForm: {
          questionId: ''
        },
        questionSearchRules: {
          questionId: [{required: true, trigger: 'blur', validator: validateQuestionId}]
        },
        numberValidateForm: {
          age: ''
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