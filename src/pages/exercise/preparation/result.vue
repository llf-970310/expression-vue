<template>
  <div>
    <!--播放录音音频-->
    <el-row type="flex" justify="center" class="vue-player">
      <el-col :span="10">
        <vue-plyr>
          <audio>
            <source :src="audioUrl" type="audio/wav"/>
          </audio>
        </vue-plyr>
      </el-col>
    </el-row>
    
    <el-row type="flex" justify="space-around">
      <el-col :span="8">
        <div style="float: right;">
          <p>是否能识别：
            <span v-if="analysisResult.canRcg">
                  <el-tag type="success" effect="dark">合格</el-tag>
                </span>
            <span v-else>
                  <el-tag type="danger" effect="dark">不合格</el-tag>
                </span>
          </p>
        </div>
      </el-col>
      <el-col :span="8">
        <p>识别声音质量：
          <span v-if="analysisResult.qualityIsOk">
                <el-tag type="success" effect="dark">合格</el-tag>
              </span>
          <span v-else>
                <el-tag type="danger" effect="dark">不合格</el-tag>
              </span>
        </p>
      </el-col>
    </el-row>
    <el-row class="d2-text-center">
      <p>{{analysisResult.msg}}</p>
      <el-button v-if="!analysisResult.canRcg || !analysisResult.qualityIsOk" type="danger" @click="$emit('fail')">
        重新测试
      </el-button>
      <el-row class="d2-text-center" v-else>
        <el-col :span="8" :offset="4">
          <el-select v-model="value" placeholder="请选择评测类型" value="" size="medium" clearable>
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
        value: ''
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
            let { tpl_id, name } = template
            this.examTemplate.push({
              value: tpl_id,
              label: name
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
  .button-choose {
    margin: 0.8rem 1.2rem 0 1.2rem;
  }
  
  .vue-player {
    margin-top: 1.0rem;
  }
</style>
