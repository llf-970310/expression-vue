<template>
  <d2-container :filename="filename">
    <el-row class="title-container">
      <span class="title">历史成绩</span>
      <span class="title-tip">(历史成绩的显示有所延迟，如果暂时没有，请稍后再来)</span>
      <el-select v-model="selectedTempId"
                 placeholder="选择评测模板"
                 value=""
                 size="medium"
                 clearable
                 style="float: right"
                 @change="tempChanged">
        <el-option
                v-for="item in examTemplate"
                :key="item.value"
                :label="item.label"
                :value="item.value">
        </el-option>
      </el-select>
    </el-row>

    <div v-loading="historyScoreLoading">
      <el-table
        v-if="historyScoreList"
        :data="historyScoreList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        empty-text="该账号没有历史测试记录"
        border
        style="width: 100%"
      >
        <el-table-column prop="test_start_time" label="开始时间" width="170"></el-table-column>
        <el-table-column prop="paper_tpl_id" label="模板类型" width="170"></el-table-column>
        <el-table-column prop="score_info.主旨" label="主旨"></el-table-column>
        <el-table-column prop="score_info.细节" label="细节"></el-table-column>
        <el-table-column prop="score_info.音质" label="音质"></el-table-column>
        <el-table-column prop="score_info.结构" label="结构"></el-table-column>
        <el-table-column prop="score_info.逻辑" label="逻辑"></el-table-column>
        <el-table-column prop="score_info.total" label="总得分"></el-table-column>
        <el-table-column  label="详细评价" >
          <template slot-scope="scope">
            <el-button
                    @click.native.prevent="EvaDetail(scope.$index)"
                    type="text"
                    size="small">
              查看报告
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination align='center'
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-sizes="[1,5,10,20]"
                     :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="historyScoreList.length"
                      style="margin-top: 10px">
      </el-pagination>

      <el-drawer  :visible.sync="evaDetailVisible"  :with-header="false" size="60%" @closed="drawerClosed">

        <result-detail :report="itemReport"
                       :total-score="itemTotal">
        </result-detail>
      </el-drawer>
    </div>
  </d2-container>

</template>

<script>
import { showScore } from "@api/manager.user";
import { getPaperTemplates } from '@/api/manager.exam'
import ResultDetail from "../exercise/question/resultDetail";
import {showReport} from "../../api/manager.user";

export default {
  components: {ResultDetail},
  name: "userInfo",
  data() {
    return {
      filename: __filename,
      //历史答题加载等待
      historyScoreLoading: true,
      //所有历史答题成绩记录
      historyScoreList: [],
      currentPage:1,
      pageSize:10,
      examTemplate:[],
      //选择了的模板
      selectedTempId: '0',
      //评价详情的弹出框是否可见
      evaDetailVisible:false,

      //选择查看详情的测试的总分
      itemTotal:0,
      //选择查看评价详情报告
      itemReport:{},
    };
  },
  mounted() {
    this.initPaperTemplate();
    this.initHistoryScore();
  },
  methods: {

    //获取所有的模板类型
    initPaperTemplate: function () {
      getPaperTemplates().then(res => {
        let { paperTemplates } = res
        this.examTemplate.push({
          value:'0',
          label:'全部'
        }),
        paperTemplates.forEach(template => {
          this.examTemplate.push({
            value: template['tpl_id'],
            label: template['name']
          })
        })
      }).catch(err => {
        console.error(err)
      })
    },
    //页面中的元素数量改变时
    handleSizeChange(val){
      this.currentPage=1;
      this.pageSize=val;
    },
    //跳转到特定页面
    handleCurrentChange(val){
      this.currentPage=val;
    },
    //初始化历史成绩表格数据
    initHistoryScore() {
      new Promise((resolve, reject) => {
        showScore('0')
          .then(res => {
            console.log(res);
            this.historyScoreList = res.history.reverse();
            console.log(this.historyScoreList);
            for(let score of this.historyScoreList){
              for(let template of this.examTemplate){
                if(template.value===score.paper_tpl_id){
                  score.paper_tpl_id=template.label;
                  break;
                }
              }
            }
            console.log('ppppp');
            console.log(this.historyScoreList);
            resolve();
          })
          .catch(err => {
            console.log("err: ", err);
            if (err.code === 4042) {
              // 用户暂无历史成绩
              resolve();
            } else {
              reject(err);
            }
          });
      })
        .then(() => {
          this.historyScoreLoading = false;
        })
        .catch();
    },

    //选择的模板改变时
    tempChanged() {
      console.log(this.selectedTempId)
      new Promise((resolve, reject) => {
        showScore(this.selectedTempId).then(res => {
                  console.log(res);
                  this.historyScoreList = res.history.reverse();
                  for(let score of this.historyScoreList){
                    for(let template of this.examTemplate){
                      if(template.value===score.paper_tpl_id){
                        score.paper_tpl_id=template.label;
                        break;
                      }
                    }
                  }
                  resolve();
                })
                .catch(err => {
                  console.log("err: ", err);
                  if (err.code === 4042) {
                    // 用户暂无历史成绩
                    this.historyScoreList=[];
                    resolve();
                  } else {
                    reject(err);
                  }
                });
            })
              .then(() => {
                this.historyScoreLoading = false;
              })
              .catch();
    },

    //查看评价详情
    EvaDetail(index){
      this.evaDetailVisible=true;
        let testId=this.historyScoreList[index].test_id;
        this.itemTotal=this.historyScoreList[index].score_info.total;
        showReport(testId).then(res => {
          this.itemReport=res.report

        //   console.log(res)
        // let status = res.msg
        //   console.log(status)
        // if (status === 'success') {
        //   console.log(res)
        //   // this.itemTotal = res.totalScore
        //
        //
        // } else {
        //   // 不可能的情况
        //   this.$message({
        //     message: '系统出了点状况，请联系管理员解决噢～',
        //     type: 'error',
        //     duration: 5 * 1000,
        //     center: true,
        //     showClose: true
        //   })
        // }
      }).catch(err => {
        console.log('err: ' + err)

        if (err.code === 5104) {
          if (this.counter * this.queryTime <= this.limitTime) {
            this.reTry(() => this.EvaDetail())
          } else {
            console.log(
                    'Try EvaDetail() max times! But the task is still waiting'
            )
          }
        } else {
          this.errorMessage(err)
        }
      })
    },

    //关闭评价详情窗口
    drawerClosed(){
      this.itemTotal=0;
      this.itemReport={};
    }
  }
};
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

.title-tip {
  font-size: 10px;
  padding: 6px;
  color: #909399;
}


</style>
<style >
  .el-drawer.rtl{
    overflow: scroll;
  }
</style>