<!--题目管理界面-->
<template>
  <d2-container :filename="filename">
    <div class="top-spacer">
      <!--通过题号搜索-->
      <el-row>
        <el-col :span="7">
          <el-button-group>
            <el-button type="success" @click="handleNewQuestion" icon="el-icon-plus">新增题目</el-button>
            <el-button type="success" @click="handleNewQuestionFromPool">
              题库导入
              <i class="el-icon-refresh"></i>
            </el-button>
          </el-button-group>
        </el-col>
        <el-col :span="10">
          <el-form
            :inline="true"
            :model="questionSearchForm"
            :rules="questionSearchRules"
            ref="questionSearchForm"
          >
            <el-form-item label="搜索题目" prop="questionId">
              <el-input v-model.trim="questionSearchForm.questionId" placeholder="题目内容/编号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchQuestion">查询题目</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <!--该题目详情-->
      <div v-if="searchedQuestionId !== ''">
        <question-detail
          :question-id="searchedQuestionId"
          @modify="goToModifyQuestion"
          @back="goBackToAllQuestions"
        ></question-detail>
      </div>

      <!--新增/修改题目-->
      <div v-if="isEditableQuestion">
        <div v-if="modifiedQuestionId">
          <new-question
            :key="modifiedQuestionId"
            :modified-question-id="modifiedQuestionId"
            @back="goBackToQuestionDetail"
          ></new-question>
        </div>
        <div v-else>
          <!--增加key值区分，以保证新增题目/词库导入切换时不会复用-->
          <new-question
            :key="isNewFromPool"
            :new-from-pool="isNewFromPool"
            @back="goBackToAllQuestions"
          ></new-question>
        </div>
      </div>

      <!--所有题目-->
      <div v-show="showAllQuestions">
        <el-table
          v-loading="allQuestionsLoading"
          :data="allQuestions"
          ref="questionTable"
          @row-dblclick="searchQuestionByClick"
          border
          stripe
          highlight-current-row
          style="width: 100%"
          :default-sort="{prop: 'modify', order: 'descending'}"
        >
          <el-table-column prop="questionIndex" label="题号" width="50"></el-table-column>
          <el-table-column
            prop="type"
            label="类别"
            width="90"
            :filters="[{ text: '朗读题', value: '朗读题' }, { text: '转述题', value: '转述题' },{ text: '问答题', value: '问答题' }]"
            :filter-method="filterType"
          ></el-table-column>
          <el-table-column
            prop="label"
            label="标签"
            width="70"
            :filters="[{ text: '新闻', value: '新闻' }, { text: '科普', value: '科普' },{ text: '传记', value: '传记' },{ text: '社会', value: '社会' }]"
            :filter-method="filterLabel"
          ></el-table-column>
          <el-table-column prop="modify" label="修改紧急度" width="120" :sortable="true" :sort-method="modifySort">
            <template slot-scope="scope">
              <span v-if="scope.row.modify=='紧急'" style="color:#F56C6C">紧急</span>
              <span v-if="scope.row.modify=='一般'" style="color:#E6A23C">一般</span>
              <span v-if="scope.row.modify=='稳定'" style="color:#67C23A">稳定</span>
            </template>
          </el-table-column>
          <el-table-column prop="rawText" label="题目原文" show-overflow-tooltip></el-table-column>
          <!-- <el-table-column
              prop="keywords"
              label="keywords"
              width="200"
              show-overflow-tooltip>
          </el-table-column>
          <el-table-column
              prop="detailwords"
              label="detailwords"
              width="200"
              show-overflow-tooltip>
          </el-table-column>-->
          <!-- <el-table-column prop="upCount" label="被赞" width="50"></el-table-column>
          <el-table-column prop="downCount" label="被踩" width="50"></el-table-column>
          <el-table-column prop="usedTimes" label="已用" width="50"></el-table-column> -->
          <el-table-column prop="diff" label="难度" width="80" sortable></el-table-column>
          <el-table-column prop="level" label="级别" width="80" sortable></el-table-column>
        </el-table>

        <el-row class="d2-text-center pagination">
          <el-pagination
            @size-change="curSizePerPageChanged"
            @current-change="curPageChanged"
            :current-page.sync="curPage"
            :page-sizes="[10, 25, 50, 100, 200]"
            :page-size.sync="curSizePerPage"
            layout="prev, pager, next, total, sizes"
            :total="totalCount"
          ></el-pagination>
        </el-row>
      </div>
    </div>
  </d2-container>
</template>

<script>
import QuestionDetail from "./detail/index";
import NewQuestion from "./new/index";

import { validateQuestionId } from "@/libs/validator";
import { getAllQuestionsOfTypeTwo, getAllQuestions } from "@api/manager.question";

export default {
  name: "question",
  components: {
    "question-detail": QuestionDetail,
    "new-question": NewQuestion
  },
  data() {
    return {
      filename: __filename,
      typeEnum: ["", "朗读题", "转述题", "问答题", "选择", "短文本英文阅读", "长文本英文阅读"],
      labelEnum: ["新闻", "科普", "传记", "社会"],
      modifyEnum: ["紧急", "一般", "稳定"],
      // 题目搜索部分
      questionSearchForm: {
        questionId: ""
      },
      questionSearchRules: {
        questionId: [
          { required: true, trigger: "blur", validator: validateQuestionId }
        ]
      },

      // 要查看的题目详情部分
      searchedQuestionId: "",

      // 新建/修改题目部分
      isEditableQuestion: false,
      isNewFromPool: false,
      modifiedQuestionId: "",

      // 题目加载动画
      allQuestionsLoading: true,
      // 所有题目部分
      allQuestions: [],
      // 总条数
      totalCount: 1,
      // 当前页数
      curPage: 1,
      // 每页条数
      curSizePerPage: 50
    };
  },
  computed: {
    showAllQuestions: function() {
      return this.searchedQuestionId === "" && !this.isEditableQuestion;
    }
  },
  mounted: function() {
    this.initQuestions();
  },
  methods: {
    initQuestions() {
      this.allQuestionsLoading = true;

      // console.log(this.curPage + "    " + this.curSizePerPage);
      new Promise((resolve, reject) => {
        getAllQuestions(this.curPage, this.curSizePerPage, null)
          .then(res => {
            // console.log(res);
            this.allQuestions = res.questions;
            // 前端桩数据，随机添加级别、修改紧急度、标签等
            this.allQuestions.forEach(question => {
              question.level = 1 + parseInt(Math.random() * 4); // 1-4
              question.type = this.typeEnum[question.type];
              question.label = this.labelEnum[1];
              question.modify = this.modifyEnum[parseInt(Math.random() * 3)];
              question.diff = parseInt(Math.random() * 3); // 0-2
            });
            this.totalCount = res.count;
            resolve();
          })
          .catch(err => {
            // console.log("err: ", err);
            reject(err);
          });
      })
        .then(() => {
          this.allQuestionsLoading = false;
        })
        .catch();
    },

    // 新建题目
    handleNewQuestion() {
      this.searchedQuestionId = "";
      this.isEditableQuestion = true;
      this.isNewFromPool = false;
      this.modifiedQuestionId = "";
    },
    // 词库导入
    handleNewQuestionFromPool() {
      this.searchedQuestionId = "";
      this.isEditableQuestion = true;
      this.isNewFromPool = true;
      this.modifiedQuestionId = "";
    },

    searchQuestion() {
      this.$refs["questionSearchForm"].validate(valid => {
        if (valid) {
          this.searchedQuestionId = parseInt(
            this.questionSearchForm.questionId
          );
          this.isEditableQuestion = false;
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },
    modifySort(a, b){
      // // console.log(this.modifyEnum.indexOf(a.modify))
      // // console.log(this.modifyEnum.indexOf(b.modify))
      return  this.modifyEnum.indexOf(b.modify)-this.modifyEnum.indexOf(a.modify)
    },
    filterType(value, row) {
      return value == row["type"];
    },
    filterLabel(value, row) {
      return (value = row["label"]);
    },
    searchQuestionByClick(currentRow) {
      if (currentRow) {
        this.questionSearchForm.questionId = currentRow.questionId;
        this.searchedQuestionId = currentRow.questionId;
        this.isEditableQuestion = false;

        // 重置已选中行，避免不能再点击
        // this.$refs.questionTable.setCurrentRow()
      }
    },

    // 去修改题目的界面
    goToModifyQuestion(questionId) {
      this.searchedQuestionId = "";
      this.isEditableQuestion = true;
      this.modifiedQuestionId = questionId;
    },

    // 返回显示所有题目的主界面
    goBackToAllQuestions(changeSucceeded) {
      this.searchedQuestionId = "";
      this.isEditableQuestion = false;
      this.modifiedQuestionId = "";

      // 成功改变之后，需要重新加载题目表格
      if (changeSucceeded) {
        this.initQuestions();
      }
    },

    // 返回显示当前修改题目的详情界面，通过questionId的变化自动重新加载组件
    goBackToQuestionDetail(questionId, changeSucceeded) {
      this.searchedQuestionId = questionId;
      this.isEditableQuestion = false;
      this.modifiedQuestionId = "";

      // 成功改变之后，需要重新加载题目表格
      if (changeSucceeded) this.initQuestions();
    },

    curPageChanged(val) {
      // // console.log(`当前页: ${val}`);
      this.initQuestions();
    },
    curSizePerPageChanged(val) {
      // // console.log(`每页 ${val} 条`);
      // 每页大小变化之后，总是回到第一页
      this.curPage = 1;
      this.initQuestions();
    }
  }
};
</script>

<style scoped>
.pagination {
  margin-top: 15px;
}

.top-spacer {
  margin-top: 0.4rem;
}
</style>
