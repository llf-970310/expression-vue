<!--邀请界面-->
<template>
    <d2-container :filename="filename">
        <template slot="header">邀请管理</template>
        <el-row>
            <el-col :span="8">
                <el-form ref="invitationForm" :model="formData" label-width="80px" :rules="rules">
                    <el-form-item label="开始时间" prop="vipStartTime">
                        <el-date-picker
                                :editable="false"
                                :clearable="true"
                                v-model="formData.vipStartTime"
                                type="datetime"
                                placeholder="选择时间"
                                align="right"
                                :picker-options="startTimeOptions">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="vipEndTime">
                        <el-date-picker
                                :editable="false"
                                :clearable="true"
                                v-model="formData.vipEndTime"
                                type="datetime"
                                placeholder="选择时间"
                                align="right"
                                :picker-options="endTimeOptions">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="可用人数" prop="availableTimes">
                        <el-input-number v-model="formData.availableTimes" :min="1"
                                         :disabled="true"></el-input-number>
                    </el-form-item>
                    <el-form-item label="测试次数" prop="remainingExamNum">
                        <el-input-number v-model="formData.remainingExamNum" :min="1"></el-input-number>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">创建邀请码</el-button>
                        <el-button @click="resetForm">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="16">
                <el-table v-loading="allInvitationsLoading"
                          :data="allInvitations"
                          ref="invitationTable"
                          border stripe highlight-current-row style="width: 100%">
                    <el-table-column
                            prop="code"
                            label="邀请码"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="creator"
                            label="创建者"
                            width="80">
                    </el-table-column>
                    <el-table-column
                            label="有效时间"
                            width="155">
                        <template slot-scope="scope">
                            <el-row class="d2-text-center">
                                <span>{{ scope.row['vip_start_time'] }} </span>
                                <br/>
                                <span>~</span>
                                <br/>
                                <span>{{ scope.row['vip_end_time'] }}</span>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="remaining_exam_num"
                            label="测试次数"
                            width="80">
                    </el-table-column>
                    <el-table-column
                            prop="activate_users"
                            label="已使用用户">
                    </el-table-column>
                    <el-table-column
                            prop="available_times"
                            label="剩余可用人数"
                            width="105">
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <!--<el-input v-model="input" placeholder="ya"></el-input>-->
    </d2-container>
</template>

<script>
    // import {mapActions} from 'vuex'
    import {getAllInvitations, createInvitation} from '@/api/manage.invitation'

    export default {
        name: 'invitation',
        data() {
            return {
                filename: __filename,
                formData: {
                    vipStartTime: '',
                    vipEndTime: '',
                    remainingExamNum: 3,
                    availableTimes: 1
                },
                startTimeOptions: {
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '明天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() + 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }]
                },
                endTimeOptions: {
                    shortcuts: [{
                        text: '一周后',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一个月后',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() + 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', date);
                        }
                    }]
                },
                rules: {
                    vipStartTime: [
                        {
                            validator: (rule, value, callback) => {
                                if (!value) {
                                    return callback(new Error('开始时间不能为空'))
                                } else {
                                    return callback()
                                }
                            },
                            trigger: 'blur'
                        }
                    ],
                    vipEndTime: [
                        {
                            validator: (rule, value, callback) => {
                                if (!value) {
                                    return callback(new Error('结束时间不能为空'))
                                }
                                if (value.getTime() < new Date().getTime() - 3600 * 1000 * 24) {
                                    return callback(new Error('结束时间不能早于今天'))
                                }
                                let st = this.formData.vipStartTime
                                if (st && st.getTime() >= value.getTime()) {
                                    return callback(new Error('结束时间不能早于开始时间'))
                                }
                                return callback()
                            }, trigger: 'blur'
                        }
                    ]
                },

                // 右侧的邀请数据
                allInvitationsLoading: true,
                allInvitations: {}
            }
        },
        mounted() {
            new Promise((resolve, reject) => {
                getAllInvitations().then(res => {
                    this.allInvitations = res.result
                    resolve()
                }).catch(err => {
                    console.log('err: ', err)
                    reject(err)
                })
            }).then(() => {
                this.allInvitationsLoading = false
            }).catch()
        },
        methods: {
            onSubmit() {
                this.$refs.invitationForm.validate((valid) => {
                    if (valid) {
                        let start = this.formData.vipStartTime.getTime() / 1000
                        let end = this.formData.vipEndTime.getTime() / 1000

                        createInvitation({
                            vipStartTime: start,
                            vipEndTime: end,
                            remainingExamNum: this.formData.remainingExamNum,
                            availableTimes: this.formData.availableTimes
                        }).then((response) => {
                            // 成功之后做的事情
                            this.$alert('邀请码：' + response['invitationCode'], '创建成功', {
                                confirmButtonText: '点击复制到粘贴板',
                                callback: action => {
                                    if (action === 'confirm') {
                                        this.$copyText(response['invitationCode'])
                                        this.$message({
                                            type: 'success',
                                            message: '已复制至粘贴板'
                                        })
                                    }
                                }
                            })
                            this.resetForm()
                            // this.$message({
                            //     message: '恭喜你，这是一条成功消息',
                            //     type: 'success'
                            // })
                            // 重定向对象不存在则返回顶层路径
                            // this.$router.push(this.$route.query.redirect || '/')
                        })
                    } else {
                        this.$message.error('表单校验失败')
                    }
                })
            },
            resetForm() {
                this.$refs['invitationForm'].resetFields()
            }
        }
    }
</script>

<style lang="scss">
    .el-row {
        margin-bottom: 20px;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .el-col {
        border-radius: 4px;
    }
</style>
