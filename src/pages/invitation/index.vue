<!--邀请界面-->
<template>
  <d2-container :filename="filename">
    <div>
      <el-form ref="invitationForm" :model="formData" label-width="100px" :rules="rules" class="code-creator-form">
        <el-row type="flex" justify="space-around">
          <el-col :span="4"><div></div></el-col>
          <el-col :span="6">
            <el-form-item label="开始时间" prop="vipStartTime">
              <el-date-picker
                  :editable="false"
                  :clearable="true"
                  v-model="formData.vipStartTime"
                  type="datetime"
                  placeholder="选择时间"
                  align="right"
                  :picker-options="startTimeOptions"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="结束时间" prop="vipEndTime">
              <el-date-picker
                  :editable="false"
                  :clearable="true"
                  v-model="formData.vipEndTime"
                  type="datetime"
                  placeholder="选择时间"
                  align="right"
                  :picker-options="endTimeOptions"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8"><div></div></el-col>
        </el-row>
        <el-row type="flex" justify="space-around">
          <el-col :span="2"><div></div></el-col>
          <el-col :span="6">
            <el-form-item label="测试次数" prop="remainingExamNum">
              <el-input-number v-model="formData.remainingExamNum" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="邀请码个数" prop="codeNum">
              <el-input-number v-model="formData.codeNum" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="可用人数" prop="availableTimes">
              <el-input-number v-model="formData.availableTimes" :min="1" :disabled="true"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="6"><div></div></el-col>
        </el-row>
        <el-row>
          <el-col :span="18" class="code-creator-row">
            <el-form-item>
              <el-button type="primary" plain @click="onSubmit" class="code-creator-button">创建</el-button>
              <el-button type="primary" plain @click="resetForm" class="code-creator-button">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="dividor"></div>
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="searchCondition">
          <el-form-item>
            <el-input v-model="searchCondition.code" placeholder="邀请码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-date-picker
                :editable="false"
                :clearable="true"
                v-model="searchCondition.createTimeFrom"
                type="datetime"
                placeholder="创建时间（起）"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-date-picker
                :editable="false"
                :clearable="true"
                v-model="searchCondition.createTimeTo"
                type="datetime"
                placeholder="创建时间（末）"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-input v-model="searchCondition.availableTimes" placeholder="可用人数"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button round icon="el-icon-search" class="icon-button" @click="handleSearch"></el-button>
          </el-form-item>
          <el-form-item>
            <el-button round icon="el-icon-download" class="icon-button" @click="handleExport"></el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table
            v-loading="allInvitationsLoading"
            :data="allInvitations"
            :default-sort="{prop: 'create_time', order: 'descending'}"
            ref="invitationTable"
            border
            stripe
            highlight-current-row
            style="width: 100%"
        >
          <el-table-column prop="code" label="邀请码" width="160"></el-table-column>
          <el-table-column label="创建时间" width="160">
            <template slot-scope="scope">
              <span>{{ scope.row['create_time'] | stdtime2localtime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="有效时间" width="360">
            <template slot-scope="scope">
              <span>{{ scope.row['vip_start_time'] | stdtime2localtime }}</span>
              <span style="margin:0 5px">~</span>
              <span>{{ scope.row['vip_end_time'] | stdtime2localtime }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="remaining_exam_num" label="初始考试次数" width="120"></el-table-column>
          <el-table-column prop="available_times" label="剩余可用人数" width="120"></el-table-column>
          <el-table-column label="使用人" width="200" prop="activate_users">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row style="margin-top:10px">
      <el-col :span="24">
        <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagenation.currentPage"
            :page-sizes="pagenation.pageSizes"
            :page-size="pagenation.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagenation.total"
        ></el-pagination>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>
    import {queryInvitations, createInvitation} from "@/api/manage.invitation";
    import {datetime2stdstr, stdstr2localstr} from "@/libs/my-util";

    export default {
        name: "invitation",
        data() {
            return {
                filename: __filename,
                formData: {
                    vipStartTime: "",
                    vipEndTime: "",
                    remainingExamNum: 3,
                    codeNum: 1,
                    availableTimes: 1
                },
                startTimeOptions: {
                    shortcuts: [
                        {
                            text: "今天",
                            onClick(picker) {
                                picker.$emit("pick", new Date());
                            }
                        },
                        {
                            text: "明天",
                            onClick(picker) {
                                const date = new Date();
                                date.setTime(date.getTime() + 3600 * 1000 * 24);
                                picker.$emit("pick", date);
                            }
                        }
                    ]
                },
                endTimeOptions: {
                    shortcuts: [
                        {
                            text: "一周后",
                            onClick(picker) {
                                const date = new Date();
                                date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
                                picker.$emit("pick", date);
                            }
                        },
                        {
                            text: "一个月后",
                            onClick(picker) {
                                const date = new Date();
                                date.setTime(date.getTime() + 3600 * 1000 * 24 * 30);
                                picker.$emit("pick", date);
                            }
                        }
                    ]
                },
                rules: {
                    vipStartTime: [
                        {
                            validator: (rule, value, callback) => {
                                if (!value) {
                                    return callback(new Error("开始时间不能为空"));
                                } else {
                                    return callback();
                                }
                            },
                            trigger: "blur"
                        }
                    ],
                    vipEndTime: [
                        {
                            validator: (rule, value, callback) => {
                                if (!value) {
                                    return callback(new Error("结束时间不能为空"));
                                }
                                if (value.getTime() < new Date().getTime() - 3600 * 1000 * 24) {
                                    return callback(new Error("结束时间不能早于今天"));
                                }
                                let st = this.formData.vipStartTime;
                                if (st && st.getTime() >= value.getTime()) {
                                    return callback(new Error("结束时间不能早于开始时间"));
                                }
                                return callback();
                            },
                            trigger: "blur"
                        }
                    ]
                },

                // 表格部分
                searchCondition: {
                    code: "",
                    createTimeFrom: "",
                    createTimeTo: "",
                    availableTimes: ""
                },
                pagenation: {
                    currentPage: 1,
                    pageSizes: [10, 30, 50],
                    pageSize: 10,
                    total: 0
                },
                allInvitationsLoading: false,
                allInvitations: []
            };
        },
        mounted() {
            this.handleSearch();
        },
        methods: {
            onSubmit() {
                this.$refs.invitationForm.validate(valid => {
                    if (valid) {
                        let start = this.formData.vipStartTime.getTime() / 1000;
                        let end = this.formData.vipEndTime.getTime() / 1000;

                        createInvitation({
                            vipStartTime: start,
                            vipEndTime: end,
                            remainingExamNum: this.formData.remainingExamNum,
                            availableTimes: this.formData.availableTimes,
                            codeNum: this.formData.codeNum
                        }).then(response => {
                            // 成功之后做的事情
                            this.$alert(
                                "邀请码：</br>" + this.addLine(response["invitationCode"]),
                                "创建成功",
                                {
                                    dangerouslyUseHTMLString: true,
                                    confirmButtonText: "点击复制到粘贴板",
                                    callback: action => {
                                        if (action === "confirm") {
                                            this.$copyText(response["invitationCode"]);
                                            this.$message({
                                                type: "success",
                                                message: "已复制至粘贴板"
                                            });
                                        }
                                    }
                                }
                            );
                        });
                    } else {
                        this.$message.error("表单校验失败");
                    }
                });
            },
            resetForm() {
                this.formData = {
                    vipStartTime: "",
                    vipEndTime: "",
                    remainingExamNum: 3,
                    codeNum: 1,
                    availableTimes: 1
                };
                this.handleSearch();
            },
            addLine(arr) {
                let str = "";
                for (let i = 0; i < arr.length; i++) {
                    str += arr[i];
                    str += "</br>";
                }
                console.log(str);
                return str;
            },
            handleSizeChange(size) {
                this.pagenation.pageSize = size;
                this.handleSearch();
            },
            handleCurrentChange(page) {
                this.pagenation.currentPage = page;
                this.handleSearch();
            },
            handleSearch() {
                const {currentPage, pageSize} = this.pagenation;
                let start = datetime2stdstr(this.searchCondition.createTimeFrom);
                let end = datetime2stdstr(this.searchCondition.createTimeTo);
                // let start = '2019-11-20 00:00:00';
                // let end = '2019-11-22 00:00:00';
                let conditions = {};
                if (start) conditions["createTimeFrom"] = start;
                if (end) conditions["createTimeTo"] = end;
                if (this.searchCondition.code) {
                    conditions["code"] = this.searchCondition.code;
                }
                if (this.searchCondition.availableTimes) {
                    conditions["availableTimes"] = this.searchCondition.availableTimes;
                }
                const req = {conditions, currentPage, pageSize};
                queryInvitations(req).then(response => {
                    this.allInvitations = response["invitationCodes"];
                    this.pagenation.total = response["totalCount"];
                });
            },
            handleExport() {
            }
        },
        filters: {
            stdtime2localtime(str) {
                return stdstr2localstr(str)
            }
        }
    };
</script>

<style lang="scss">
  .icon-button {
    padding: 12px !important;
  }

  .dividor {
    margin: 0 5px 20px 5px;
    border-top: 1px solid #cfd7e5;
  }

  .code-creator-form {
    margin-top: 0.8rem;
  }

  .code-creator-row {
    text-align: center;
  }

  .code-creator-button {
    margin: 0.2rem 4rem 0.2rem 4rem;
  }
</style>
