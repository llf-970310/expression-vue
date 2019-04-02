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

    <div v-if="searchedUserEmail">
      <!--指定查询-->
      <score-representation :title-distribution="titleDistribution"
                            :title-change="titleChange"
                            :variables="dates"
                            :variable-name="variableNameDate"
                            :questions="questions"
                            :main-score="mainScore"
                            :detail-score="detailScore"
                            :total-score="totalScore">
      </score-representation>

      <div class="d2-text-center">
        <el-button type="primary" @click="backToOverview">返回查看概况</el-button>
      </div>
    </div>
    <div v-else>
      <!--概况-->
      <score-representation :title-distribution="overviewTitleDistribution"
                            :title-change="overviewTitleChange"
                            :variables="questions"
                            :variable-name="variableNameUserEmail"
                            :questions="questions"
                            :main-score="mainScore"
                            :detail-score="detailScore"
                            :total-score="totalScore">
      </score-representation>
    </div>

  </div>
</template>

<script>
  import ScoreRepresentation from '../components/score-representation'

  export default {
    name: "score-user",
    components: {
      'score-representation': ScoreRepresentation
    },
    data() {
      return {
        // 搜索框部分
        userSearchForm: {
          userEmail: ''
        },
        userSearchRules: {
          userEmail: [
            {required: true, message: '用户邮箱不可为空', trigger: 'blur'},
            {type: 'email', message: '请输入合法的用户邮箱', trigger: 'blur'}
          ]
        },

        // 查看详情部分
        searchedUserEmail: '',

        // 概况图表标题
        overviewTitleDistribution: '各用户平均分的成绩分布情况',
        overviewTitleChange: '各用户平均分的成绩变化情况',

        // 成绩变化图x轴自变量
        variableNameUserEmail: '用户邮箱',
        variableNameDate: '日期',

        // 具体数据
        questions: [],
        dates: [],
        mainScore: [],
        detailScore: [],
        totalScore: [],
      }
    },
    computed: {
      titleDistribution() {
        return '用户' + this.searchedUserEmail + '的成绩分布情况'
      },

      titleChange() {
        return '用户' + this.searchedUserEmail + '的成绩变化情况'
      }
    },
    mounted() {
      this.initOverview()
    },
    watch: {
      searchedUserEmail: function (val, oldVal) {
        if (val === '') {
          this.initOverview()
        } else {
          this.initByUserEmail()
        }
      }
    },
    methods: {
      searchUser() {
        this.$refs['userSearchForm'].validate((valid) => {
          if (valid) {
            this.searchedUserEmail = this.userSearchForm.userEmail
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },

      backToOverview() {
        this.searchedUserEmail = ''
      },

      // 未指定具体的用户邮箱，查看总体情况
      initOverview() {
        console.log('user initOverview')
        this.questions = []
        this.mainScore = []
        this.detailScore = []
        this.totalScore = []

        for (let i = 0; i < 200; i++) {
          this.questions.push(i)
          this.mainScore.push(Math.floor(Math.random() * 100))
          this.detailScore.push(Math.floor(Math.random() * 100))
          this.totalScore.push(this.mainScore[i] * 0.7 + this.detailScore[i] * 0.3)
        }
      },

      // 通过用户邮箱具体查询
      initByUserEmail() {
        console.log('initByUserEmail')
        console.log(this.searchedUserEmail)
        this.dates = []
        this.mainScore = []
        this.detailScore = []
        this.totalScore = []

        let base = +new Date(2017, 9, 3);
        const oneDay = 24 * 3600 * 1000;
        for (let i = 0; i < 200; i++) {
          let now = new Date(base += oneDay);
          this.dates.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
          this.mainScore.push(Math.floor(Math.random() * 100))
          this.detailScore.push(Math.floor(Math.random() * 100))
          this.totalScore.push(this.mainScore[i] * 0.7 + this.detailScore[i] * 0.3)
        }
      },
    }
  }
</script>

<style scoped>

</style>