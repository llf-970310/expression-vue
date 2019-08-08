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

    <div v-loading="dataLoading">
      <div v-if="searchedUserEmail">
        <!--指定查询-->
        <score-representation :title-distribution="titleDistributionSpecific"
                              :title-change="titleChangeSpecific"
                              :distribution-partition-adjustable="false"
                              distribution-legend="平均分数"
                              :distribution-variables="distributionVariables"
                              distribution-variable-name="题号"
                              :distribution-data="distributionData"
                              :variables="dates"
                              :variable='variable'
                              variable-name="日期"
                              :score-data="scoreData">
        </score-representation>

        <div class="d2-text-center">
          <el-button type="primary" @click="backToOverview" class="back">返回查看概况</el-button>
        </div>
      </div>
      <div v-else>
        <!--概况-->
        <score-representation title-distribution="各用户的平均分分布情况"
                              title-change="各用户的平均分变化情况"
                              distribution-legend="区间人数"
                              :distribution-variables="distributionVariables"
                              distribution-variable-name="区间"
                              :distribution-data="distributionData"
                              :variables="users"
                              :variable='variable'
                              variable-name="用户邮箱"
                              :score-data="scoreData"
                              @distributionPartitionSizeChanged="handleDistributionDataOriginByPartition">
        </score-representation>
      </div>
    </div>

  </div>
</template>

<script>
  import ScoreRepresentation from '../components/score-representation'

  import {extractVariableAsList} from '@/libs/my-util'
  import {getScoreOfUsers, getScoreOfSpecoficUser} from '@/api/manager.score'

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

        // 数据加载动画
        dataLoading: true,

        // 查看详情部分
        searchedUserEmail: '',

        // 成绩分布图的x轴变量
        distributionVariables: [],
        // 保存分布图需要的所有原始数据，减少网络IO
        distributionDataOrigin: [],
        // 分布图所需要的真实数据
        distributionData: {
          num: [],
          proportion: [],
        },

        // 成绩变化图x轴自变量
        variable: '',

        // 具体数据
        scoreData: [],
        users: [],
        dates: [],
      }
    },
    computed: {
      titleDistributionSpecific() {
        return `用户 ${this.searchedUserEmail} 的成绩分布情况`
      },

      titleChangeSpecific() {
        return `用户 ${this.searchedUserEmail} 的成绩变化情况`
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
        this.dataLoading = true;
        console.log('user initOverview')
        new Promise((resolve, reject) => {
          getScoreOfUsers().then(res => {
            const result = res.result
            this.distributionDataOrigin = extractVariableAsList(result, 'totalScore')
            this.scoreData = result

            this.variable = 'userEmail'
            this.users = extractVariableAsList(result, this.variable)
            // console.log(this.users)

            resolve()
          }).catch(err => {
            console.log('err: ', err)
            reject(err)
          })
        }).then(() => {
          this.handleDistributionDataOriginByPartition()
          this.dataLoading = false;
        }).catch()
      },

      // 通过用户邮箱具体查询
      initByUserEmail() {
        this.dataLoading = true;
        console.log('initByUserEmail')
        console.log(this.searchedUserEmail)
        new Promise((resolve, reject) => {
          getScoreOfSpecoficUser(this.searchedUserEmail).then(res => {
            this.distributionDataOrigin = res.allResult
            this.scoreData = res.resultByDate

            this.variable = 'date'
            this.dates = extractVariableAsList(this.scoreData, this.variable)
            // console.log(this.dates)

            resolve()
          }).catch(err => {
            console.log('err: ', err)

            // TODO fjj User_not_exist = {'code': 4302, 'msg': '用户不存在'}

            reject(err)
          })
        }).then(() => {
          this.handleDistributionDataOriginByQuestionId()
          this.dataLoading = false;
        }).catch()
      },

      // 对x轴为分数区间的分布图的原始数据进行处理
      handleDistributionDataOriginByPartition(partitionSize = 2) {
        let partitionNum = Math.ceil(100.0 / partitionSize);

        // 初始化分区（X轴）
        this.distributionVariables = [];
        for (let i = 0; i < partitionNum; i++) {
          let max = (i + 1) * partitionSize;
          this.distributionVariables.push(`${i * partitionSize} - ${max > 100 ? 100 : max}`)
        }

        // 初始化该分区人数（Y1轴）
        this.distributionData.num = Array(partitionNum).fill(0);
        for (let i = 0; i < this.distributionDataOrigin.length; i++) {
          let n = Math.floor(this.distributionDataOrigin[i] / partitionSize);
          this.distributionData.num[n]++
        }

        // 初始化该分区人数比例（Y2轴）
        this.distributionData.proportion = []
        for (let i = 0; i < this.distributionData.num.length; i++) {
          let curScoreNum = this.distributionData.num[i];
          this.distributionData.proportion.push(curScoreNum / this.distributionDataOrigin.length)
        }
      },

      // 对x轴为题号的分布图的原始数据进行处理
      handleDistributionDataOriginByQuestionId() {
        this.distributionVariables = [];
        this.distributionData.num = [];
        let allTotalScore = 0;
        for (let i = 0; i < this.distributionDataOrigin.length; i++) {
          let curData = this.distributionDataOrigin[i]
          // 初始化x轴
          this.distributionVariables.push(curData.questionId)

          // 初始化该题号分数（y1轴）
          this.distributionData.num.push(curData.totalScore)
          allTotalScore += parseInt(curData.totalScore)
        }

        // 初始化该题号分数的比例（y2轴）
        this.distributionData.proportion = [];
        for (let i = 0; i < this.distributionData.num.length; i++) {
          let curScoreNum = this.distributionData.num[i];
          this.distributionData.proportion.push(allTotalScore > 0 ? curScoreNum / allTotalScore : 0)
        }
      }
    }
  }
</script>

<style scoped>
  .back {
    margin-top: 15px;
  }
</style>