<template>
  <div>
    <el-input
        type="textarea"
        placeholder="请确定你知道自己在干什么，否则请取消操作！"
        :rows="12"
        @input="changeValue"
        :value="tmpConfig">
    </el-input>
    <div class="action-button-bar">
      <el-button size="mini" plain type="success" class="action-button"
                 @click="editCancel">取消
      </el-button>
      <el-button size="mini" plain type="danger" class="action-button"
                 @click="editConfirm">提交
      </el-button>
    </div>
  </div>
</template>

<script>
    export default {
        name: "edit",
        props: {
            taskConfig: String,
        },
        watch: {
            taskConfig: {
                handler(newVal, oldVal) {
                    this.tmpConfig = this.taskConfig;
                }
            }
        },
        data() {
            return {
                tmpConfig: "",
            }
        },
        mounted() {
            this.tmpConfig = this.taskConfig
        },
        methods: {
            changeValue(val) {
                this.tmpConfig = val;
            },
            editCancel: function () {
                this.$emit('transferConfig', null)
            },
            editConfirm: function () {
                this.$emit('transferConfig', this.tmpConfig)
            }
        }
    }
</script>

<style scoped>
  .action-button-bar {
    margin-top: 30px;
    text-align: center;
  }

  .action-button {
    margin-left: 20px;
    margin-right: 20px;
  }
</style>
