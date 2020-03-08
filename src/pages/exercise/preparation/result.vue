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

      <el-button v-if="analysisResult.canRcg && analysisResult.qualityIsOk" plain disabled
                 class="button-choose"
                 type="primary"
                 @click="$emit('ready')">专项练习
      </el-button>
      <el-button v-if="analysisResult.canRcg && analysisResult.qualityIsOk"
                 class="button-choose"
                 type="primary"
                 @click="$emit('ready')">正式测试
      </el-button>
      <el-button v-else
                 type="danger"
                 @click="$emit('fail')">重新测试
      </el-button>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "result-preparation",
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
