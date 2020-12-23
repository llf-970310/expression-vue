<template>
    <d2-container>
        <template slot="header">试卷模板管理</template>
        <el-button type="success" @click="showDialog(null)" icon="el-icon-plus">新增试卷</el-button>

        <div style="margin-top: 1.5rem">
            <el-table
                v-loading="isLoading"
                :data="allTemplates"
                border
                stripe
                highlight-current-row
                style="width: 100%"
                :row-style="{height: '20px'}"
            >
                <el-table-column prop="name" label="试卷名称"></el-table-column>
                <el-table-column prop="duration" label="考试时长（秒）"></el-table-column>
                <el-table-column label="当前状态">
                    <template slot-scope="scope">
                        <p v-if="scope.row.is_deprecated">已禁用</p>
                        <p v-else>启用中</p>
                    </template>
                </el-table-column>
                <el-table-column label="题目数量">
                    <template slot-scope="scope">{{scope.row.questions.length}}</template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            plain
                            type="warning"
                            @click="showDialog(scope.row)"
                        >编辑</el-button>
                        <el-button
                            size="mini"
                            type="primary"
                            v-if="scope.row.is_deprecated"
                            @click="enableTemplate(scope.row.tpl_id)"
                        >启用</el-button>
                        <el-button
                            size="mini"
                            type="danger"
                            v-else
                            @click="disableTemplate(scope.row.tpl_id)"
                        >禁用</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-row>
                <el-col :span="24" class="refresh-button">
                    <el-button
                        align="center"
                        size="medium"
                        type="success"
                        plain
                        @click="getTemplates"
                    >刷新</el-button>
                </el-col>
            </el-row>

            <el-dialog
                title="试卷模板编辑"
                :visible.sync="dialogFormVisible"
                :append-to-body="true"
                :lock-scroll="true"
            >
                <el-form :model="form" label-width="120px">
                    <el-form-item label="试卷名称">
                        <el-input v-model="form.name" autocomplete="off" class="dialog-input"></el-input>
                    </el-form-item>
                    <el-form-item label="考试时长">
                        <el-input-number v-model="form.duration" :min="1" :max="10800"></el-input-number>
                    </el-form-item>
                    <el-form-item label="题目组成">
                        <div
                            v-for="(question, index) in form.questions"
                            :key="index"
                            style="margin-top: 10px"
                        >
                            <el-select
                                v-model="question.q_type"
                                placeholder="题目类型"
                                class="dialog-select"
                                @change="onQuestionTypeChange"
                            >
                                <el-option
                                    v-for="item in questionTypeOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                ></el-option>
                            </el-select>

                            <el-select
                                v-model="question.dbid"
                                style="margin-left: 20px;"
                                placeholder="选题策略"
                                class="dialog-select"
                                @change="onQuestionIdChange"
                            >
                                <el-option
                                    v-for="item in questionSelectOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                ></el-option>
                            </el-select>

                            <!-- <el-button type="danger">删除</el-button> -->
                            <el-button
                                type="danger"
                                icon="el-icon-delete"
                                circle
                                @click.prevent="removeQuestion(index)"
                                style="margin-left: 20px;"
                                size="mini"
                            ></el-button>
                        </div>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button @click="addQuestion">新增题目</el-button>
                    <el-button type="primary" @click="saveTemplate">确定</el-button>
                </div>

                <el-dialog
                    width="45%"
                    title="题目选择"
                    :visible.sync="innerDialogVisible"
                    append-to-body
                >
                    <el-table :data="allQuestions">
                        <el-table-column prop="questionIndex" label="题号" width="80"></el-table-column>
                        <el-table-column prop="rawText" label="题目原文" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="upCount" label="点赞" width="50"></el-table-column>
                        <el-table-column prop="downCount" label="点踩" width="50"></el-table-column>
                        <el-table-column prop="usedTimes" label="使用次数" width="80"></el-table-column>
                        <el-table-column label="操作" width="50">
                            <template slot-scope="scope">
                                <el-button
                                    size="mini"
                                    type="success"
                                    icon="el-icon-check"
                                    circle
                                    @click="selectQuestion(scope.row.questionId)"
                                ></el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <el-row class="d2-text-center pagination">
                        <el-pagination
                            @current-change="curPageChanged"
                            :current-page.sync="curPage"
                            layout="prev, pager, next"
                            :total="totalCount"
                        ></el-pagination>
                    </el-row>
                </el-dialog>
            </el-dialog>
        </div>
    </d2-container>
</template>

<script>
import {
    queryAllTemplates,
    disableTemplate,
    enableTemplate,
    saveTemplate
} from "@api/manager.template";
import { getAllQuestions } from "@api/manager.question";

const questionTypeOptions = [
    {
        value: 1,
        label: "阅读题"
    },
    {
        value: 2,
        label: "转述题"
    },
    {
        value: 3,
        label: "表达题"
    },
    {
        value: 4,
        label: "选择题"
    },
    {
        value: 5,
        label: "短文本阅读（英文）"
    },
    {
        value: 6,
        label: "长文本阅读（英文）"
    }
];

const questionSelectOptions = [
    {
        value: "specific",
        label: "指定题目"
    },
    {
        value: 0,
        label: "默认"
    },
    {
        value: 1,
        label: "随机"
    }
];

export default {
    name: "paper-template",
    data() {
        return {
            isLoading: true,
            allTemplates: [],

            allQuestions: [],
            allQuestionsLoading: false,
            // 总条数
            totalCount: 1,
            // 当前页数
            curPage: 1,
            // 每页条数
            curSizePerPage: 6,

            // 编辑框
            dialogFormVisible: false,
            innerDialogVisible: false,

            form: {
                id: "",
                name: "",
                duration: "",
                questions: []
            },
            curQuestionType: 1,
            questionTypeOptions: questionTypeOptions,
            questionSelectOptions: questionSelectOptions
        };
    },
    mounted: function() {
        this.getTemplates();
    },
    methods: {
        getTemplates() {
            this.isLoading = true;
            new Promise((resolve, reject) => {
                queryAllTemplates()
                    .then(res => {
                        console.log(res);
                        this.allTemplates = res.paperTemplates;
                        this.totalCount = this.allTemplates.length;
                        resolve();
                    })
                    .catch(err => {
                        console.log("err: ", err);
                        reject(err);
                    });
            })
                .then(() => {
                    this.isLoading = false;
                })
                .catch(err => {
                    console.log("err: ", err);
                });
        },
        disableTemplate(templateId) {
            this.isLoading = true;
            new Promise((resolve, reject) => {
                disableTemplate(templateId)
                    .then(res => {
                        console.log(res);
                        resolve();
                    })
                    .catch(err => {
                        this.$message({
                            message: err.msg,
                            type: "error",
                            duration: 3 * 1000,
                            center: true,
                            showClose: true
                        });
                        reject();
                    });
            })
                .then(() => {
                    this.getTemplates();
                })
                .catch();
        },
        enableTemplate(templateId) {
            this.isLoading = true;
            new Promise((resolve, reject) => {
                enableTemplate(templateId)
                    .then(res => {
                        console.log(res);
                        resolve();
                    })
                    .catch(err => {
                        this.$message({
                            message: err.msg,
                            type: "error",
                            duration: 3 * 1000,
                            center: true,
                            showClose: true
                        });
                        reject(err);
                    });
            })
                .then(() => {
                    this.getTemplates();
                })
                .catch();
        },
        showDialog(obj) {
            if (obj === null) {
                this.form.id = null;
                this.form.name = "";
                this.form.duration = 60;
                this.form.questions = [];
                this.dialogFormVisible = true;
            } else {
                this.form.id = obj.tpl_id;
                this.form.name = obj.name;
                this.form.duration = obj.duration;
                this.form.questions = JSON.parse(JSON.stringify(obj.questions));
                this.dialogFormVisible = true;
            }
        },
        addQuestion() {
            this.form.questions.push({});
        },
        removeQuestion(index) {
            if (index !== -1) {
                this.form.questions.splice(index, 1);
            }
        },
        selectQuestion(questionDbId) {
            this.innerDialogVisible = false;
            this.form.questions[
                this.form.questions.length - 1
            ].dbid = questionDbId;
            // console.log(this.form.questions);
        },
        saveTemplate() {
            this.dialogFormVisible = false;
            new Promise((resolve, reject) => {
                saveTemplate({
                    id: this.form.id,
                    name: this.form.name,
                    duration: this.form.duration,
                    questions: JSON.stringify(this.form.questions)
                })
                    .then(res => {
                        console.log(res);
                        resolve();
                    })
                    .catch(err => {
                        this.$message({
                            message: err.msg,
                            type: "error",
                            duration: 3 * 1000,
                            center: true,
                            showClose: true
                        });
                        reject();
                    });
            })
                .then(() => {
                    this.getTemplates();
                })
                .catch();
        },
        initQuestions() {
            this.allQuestionsLoading = true;
            new Promise((resolve, reject) => {
                getAllQuestions(
                    this.curPage,
                    this.curSizePerPage,
                    this.curQuestionType
                )
                    .then(res => {
                        // console.log(res);
                        this.allQuestions = res.questions;
                        this.totalCount = res.count;
                        resolve();
                    })
                    .catch(err => {
                        reject(err);
                    });
            })
                .then(() => {
                    this.allQuestionsLoading = false;
                })
                .catch();
        },
        onQuestionIdChange(curVal) {
            // 显示题目选择界面
            if (curVal === "specific") {
                this.innerDialogVisible = true;
                this.initQuestions();
            }
        },
        onQuestionTypeChange(curVal) {
            this.curQuestionType = curVal;
        },
        curPageChanged(val) {
            this.initQuestions();
        }
    }
};
</script>

<style scoped lang="scss">
.refresh-button {
    margin: 50px auto;
    text-align: center;
}

.dialog-input {
    width: 60%;
}

.dialog-select {
    width: 35%;
}
</style>
