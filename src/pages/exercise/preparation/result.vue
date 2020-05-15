<template>
  <div>
    <!--播放录音音频-->
    <!--<el-row type="flex" justify="center" class="vue-player">-->
    <!--<el-col :span="10">-->
    <!--<vue-plyr>-->
    <!--<audio>-->
    <!--<source :src="audioUrl" type="audio/wav"/>-->
    <!--</audio>-->
    <!--</vue-plyr>-->
    <!--</el-col>-->
    <!--</el-row>-->
    
    <el-row type="flex" justify="space-around">
      <el-col :span="8">
        <div style="float: right;">
          <p>是否能识别：
            <span v-if="analysisResult.canRcg" class="success">合格</span>
            <span v-else class="danger">不合格</span>
          </p>
        </div>
      </el-col>
      <el-col :span="8">
        <p>识别声音质量：
          <span v-if="analysisResult.qualityIsOk" class="success">合格</span>
          <span v-else class="danger">不合格</span>
        </p>
      </el-col>
    </el-row>
    <el-row class="d2-text-center result-msg">
      <span>{{analysisResult.msg}}</span>
      <span class="notice" v-if="!analysisResult.canRcg || !analysisResult.qualityIsOk"  @click="envNotice = true">
        环境说明
      </span>
    </el-row>
    <el-dialog title="环境说明"
               :visible.sync="envNotice"
               width="70%">
      <el-row>
          1. 由于手机屏幕尺寸较小，可能对题目显示和作答带来不便，不建议您使用。<br/><br/>
          2. 建议您使用电脑端的 Chrome 浏览器，如果您仍选择使用 Safari 或 Firefox 请升级到最新版。<br/><br/>
          3. 录音当中需要使用麦克风，iPad 自带耳机，AirPods 以及其他耳机自带麦克都可以满足需求。<br/><br/>
          4. 测试过程中，请保持麦克风到嘴部 10-20 厘米的距离，过远的距离可能导致您的声音较小，不利于系统识别和分析，过近的距离则可能导致讲话时气流冲击麦克风形成较大噪音（喷麦），导致如录音失败。
      </el-row>
      <el-row class="dialog-confirm">
        <el-button type="primary" @click="envNotice = false">确 定</el-button>
      </el-row>
    </el-dialog>
    <el-row class="d2-text-center">
      <el-button v-if="!analysisResult.canRcg || !analysisResult.qualityIsOk" type="danger" @click="$emit('fail')">
        重新测试
      </el-button>
    </el-row>
    <el-row class="divider d2-text-center" v-if="analysisResult.canRcg && analysisResult.qualityIsOk"></el-row>
    <el-row class="d2-text-center" v-if="analysisResult.canRcg && analysisResult.qualityIsOk">
      <el-row>
        <div class="select-title">选择评测模板并开始评测</div>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="4">
          <el-select v-model="value" placeholder="评测模板" value="" size="medium" clearable>
            <el-option
                v-for="item in examTemplate"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="$emit('ready',value)" :disabled="value===''">开始评测</el-button>
        </el-col>
      </el-row>
    </el-row>
    <!--<el-row class="d2-text-center">-->
    <!--<p>{{analysisResult.msg}}</p>-->
    <!---->
    <!--<el-button v-if="analysisResult.canRcg && analysisResult.qualityIsOk" plain disabled-->
    <!--class="button-choose"-->
    <!--type="primary"-->
    <!--@click="$emit('ready')">专项练习-->
    <!--</el-button>-->
    <!--<el-button v-if="analysisResult.canRcg && analysisResult.qualityIsOk"-->
    <!--class="button-choose"-->
    <!--type="primary"-->
    <!--@click="$emit('ready')">正式测试-->
    <!--</el-button>-->
    <!--<el-button v-else-->
    <!--type="danger"-->
    <!--@click="$emit('fail')">重新测试-->
    <!--</el-button>-->
    <!--</el-row>-->
  </div>
</template>

<script>
  import { getPaperTemplates } from '@/api/manager.exam'

  export default {
    name: 'result-preparation',
    props: {
      // 预测试的结果对象
      analysisResult: {
        required: true,
        type: Object
      },

      // 预测试音频链接
      audioUrl: {
        required: true,
        type: String
      }
    },
    data () {
      return {
        examTemplate: [],
        value: '',
        envNotice : false
      }
    },
    mounted () {
      this.initPaperTemplate()
    },
    methods: {
      initPaperTemplate: function () {
        getPaperTemplates().then(res => {
          let { paperTemplates } = res
          paperTemplates.forEach(template => {
            this.examTemplate.push({
              value: template['tpl_id'],
              label: template['name']
            })
          })
        }).catch(err => {
          console.error(err)
        })
      }
    }
  }
</script>

<style scoped>
  .success {
    color: #67C23A;
  }
  
  .danger {
    color: #F56C6C;
  }
  
  .result-msg {
    margin: 10px 0 20px 0;
  }
  
  .divider {
    margin: 40px 0 30px 0;
    border-bottom: #e9e9eb 1px solid;
  }
  
  .select-title {
    margin: 0 0 20px 0;
  }
  
  .notice {
    cursor: pointer;
    font-size: 16px;
    color: #909399;
  }
  
  .notice:hover {
    color: #a6a9ad;
  }

  .dialog-confirm {
    margin: 20px 0 0 0;
    text-align: right;
  }
</style>
