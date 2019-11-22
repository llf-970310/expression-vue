<template>
  <d2-container :filename="filename">
    <el-row class="title-container">
      <span class="title">历史成绩</span>
      <span class="title-tip">(历史成绩的显示有所延迟，如果暂时没有，请稍后再来)</span>
    </el-row>

    <div v-loading="historyScoreLoading">
      <el-table
        v-if="historyScoreList"
        :data="historyScoreList"
        empty-text="该账号没有历史测试记录"
        border
        style="width: 100%"
      >
        <el-table-column prop="test_start_time" label="开始时间" width="170"></el-table-column>
        <el-table-column prop="score_info.音质" label="音质"></el-table-column>
        <el-table-column prop="score_info.结构" label="结构"></el-table-column>
        <el-table-column prop="score_info.逻辑" label="逻辑"></el-table-column>
        <el-table-column prop="score_info.细节" label="细节"></el-table-column>
        <el-table-column prop="score_info.主旨" label="主旨"></el-table-column>
        <el-table-column prop="score_info.total" label="总得分"></el-table-column>
      </el-table>
    </div>
  </d2-container>
</template>

<script>
import { showScore } from "@api/user";

export default {
  components: {},
  name: "userInfo",
  data() {
    return {
      filename: __filename,
      //历史答题加载等待
      historyScoreLoading: true,
      //所有历史答题成绩记录
      historyScoreList: []
    };
  },
  mounted() {
    this.initHistoryScore();
  },
  methods: {
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