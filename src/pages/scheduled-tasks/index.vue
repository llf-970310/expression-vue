<!--定时任务管理界面-->
<template>
  <d2-container :filename="filename">
    <template slot="header">定时任务管理</template>
    <!--所有任务-->
    <div>
      <el-table v-loading="allTasksLoading"
                :data="allTasks"
                ref="taskTable"
                border stripe highlight-current-row style="width: 100%">
        <el-table-column
            prop="id"
            label="任务ID"
            width="250">
        </el-table-column>
        <el-table-column label="描述信息">
          <template slot-scope="scope">
            <p> {{scope.row.desc}} </p>
            <p> {{"function: " + scope.row.func}} </p>
          </template>
        </el-table-column>
        <el-table-column
            prop="trigger"
            label="触发方式"
            width="80">
        </el-table-column>
        <el-table-column label="下次执行时间" width="300">
          <template slot-scope="scope">
            <p v-if="scope.row.next_run_time"> {{scope.row.next_run_time}} </p>
            <p v-else> 已禁用 </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button size="mini" type="danger"
                       v-if="scope.row.next_run_time"
                       @click="disableTask(scope.row.id)">禁用
            </el-button>
            <el-button size="mini" type="primary"
                       v-else
                       @click="enableTask(scope.row.id)">启用
            </el-button>
            <el-button size="mini" plain type="warning"
                       @click="showEditBox(scope.row)">编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="24" class="refresh-button">
          <el-button align="center" size="medium" type="success" plain
                     @click="getTasks">刷新
          </el-button>
        </el-col>
      </el-row>
      <el-dialog title="任务编辑" center
                 :visible.sync="isEditBoxShown"
                 :append-to-body='true'
                 :lock-scroll="true"
                 width="40%">
        <edit :task-config="this.taskConfigOriginal"
              @transferConfig="newConfigReceived">
        </edit>
      </el-dialog>
    </div>
  </d2-container>
</template>

<script>
    import {queryAllTasks, pauseTask, resumeTask} from '@api/manager.scheduler'
    import { submitEdit } from "@/api/manage.async";
    import Edit from "./edit";

    export default {
        name: "scheduled-tasks",
        components: {Edit},
        data() {
            return {
                filename: __filename,

                // 加载时动画
                allTasksLoading: true,

                // 所有任务部分
                allTasks: [],
                // 总条数
                totalCount: 1,
                // 编辑框
                isEditBoxShown: false,
                taskConfigOriginal: "",
            }
        },
        mounted: function () {
            this.getTasks()
        },
        methods: {
            getTasks() {
                this.allTasksLoading = true
                console.log(this.curPage + '    ' + this.curSizePerPage)
                new Promise((resolve, reject) => {
                    queryAllTasks().then(res => {
                        console.log(res)
                        this.allTasks = res
                        this.totalCount = res.length
                        resolve()
                    }).catch(err => {
                        console.log('err: ', err)
                        reject(err)
                    })
                }).then(() => {
                    this.allTasksLoading = false
                }).catch((err) => {
                    console.log('err: ', err)
                })
            },
            disableTask(taskId) {
                this.allTasksLoading = true
                new Promise((resolve, reject) => {
                    pauseTask(taskId).then(res => {
                        console.log(res)
                        resolve()
                    }).catch(err => {
                        console.log('err:', err)
                        reject(err)
                    })
                }).then(() => {
                    this.getTasks()
                }).catch()
            },
            enableTask(taskId) {
                this.allTasksLoading = true
                new Promise((resolve, reject) => {
                    resumeTask(taskId).then(res => {
                        console.log(res)
                        resolve()
                    }).catch(err => {
                        console.log('err:', err)
                        reject(err)
                    })
                }).then(() => {
                    this.getTasks()
                }).catch()
            },
            showEditBox(taskObj) {
                this.taskConfigOriginal = JSON.stringify(taskObj);
                this.isEditBoxShown = true;
            },
            newConfigReceived(confJson) {
                console.log(confJson);
                if (confJson !== null) {
                    let tmpObj = JSON.parse(confJson);
                    for (let i = 0; i < this.allTasks.length; i++) {
                        if (this.allTasks[i].id === tmpObj.id) {
                            this.allTasks.splice(i, 1, tmpObj);
                            break
                        }
                    }
                }
                this.isEditBoxShown = false;
                // 未向服务器提交，需服务器开放接口
                // submitEdit(confJson)
            }
        }
    }
</script>

<style scoped>
  .refresh-button {
    margin: 50px auto;
    text-align: center;
  }
</style>
