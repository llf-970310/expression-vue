<template>
  <d2-container :filename="filename">
    <el-row class="title-container">
      <span class="title">历史成绩</span>
      <span class="title-tip">(历史成绩的显示有所延迟，如果暂时没有，请稍后再来)</span>
      <el-select v-model="selectedTemp"
                 placeholder="选择评测模板"
                 value=""
                 size="medium"
                 clearable
                 style="float: right"
                 @change="tempchanged">
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
        <el-table-column prop="score_info.主旨" label="主旨"></el-table-column>
        <el-table-column prop="score_info.细节" label="细节"></el-table-column>
        <el-table-column prop="score_info.音质" label="音质"></el-table-column>
        <el-table-column prop="score_info.结构" label="结构"></el-table-column>
        <el-table-column prop="score_info.逻辑" label="逻辑"></el-table-column>
        <el-table-column prop="score_info.total" label="总得分"></el-table-column>
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
    </div>
  </d2-container>

</template>

<script>
import { showScore } from "@api/manager.user";
import { getPaperTemplates } from '@/api/manager.exam'

export default {
  components: {},
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
      selectedTempId: 0,
    };
  },
  mounted() {
    this.initHistoryScore();
    this.initPaperTemplate();
  },
  methods: {

    //获取所有的模板类型
    initPaperTemplate: function () {
      getPaperTemplates().then(res => {
        let { paperTemplates } = res
        this.examTemplate.push({
          value:0,
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
        showScore()
          .then(res => {
            console.log(res);
            this.historyScoreList = res.history.reverse();
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
    tempChanged(){

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
