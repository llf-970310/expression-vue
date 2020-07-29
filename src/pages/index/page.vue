<template>
  <d2-container :filename="filename" class="page">
    <el-row class="total_container">
      <el-col :span="4" :offset="3">
        <div class="image_container">
          <img  src="/image/theme/d2/logo/icon-only.png"></img>
        </div>
      </el-col>
      <el-col :span="12" :offset="1">
        <span style="color: #6A92E6; font-size:16pt;  font-weight: bold;"> 表达能力评测</span>
        <el-row>
          <div class="content_container">
            <div class="content_title">
              内容介绍
            </div>
            <el-row>
              <div class="data_container">
                <el-row> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; 拥有良好的表达力，对于任何人都是非常重要的核心软技能，既可以扩大人际沟通的范围，达成更好的沟通效果，还能够很好的传达自己的想法，获得认可和支持。</el-row>
                <el-row> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;但此前由于技术条件的制约，始终无法客观地评判一个人的表达能力，因此也无法定位一个人的表达水准，获得详细的技术指标，进行针对性的提升。</el-row>
                <el-row>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;而在这个测试中，第一将人工智能用于自然语言的评测，只需要很短的时间，你就可以知道自己表达力的整体水平，以及各项指标的详细分值，
                  既可以横向与周围人进行比较，也可以纵向定位自己在行业或人群中的整体表达水平，更可以就某个维度进行针对性的提高。</el-row>
              </div>
            </el-row>
            <el-row class="test_title">
                <i>快来测试一下吧！</i>
            </el-row>

          </div>
        </el-row>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>

export default {

  data () {
    return {
      filename: __filename
    }
  }
}
</script>

<style scoped>
  .total_container {
    margin-top: 80px;
  }

  .image_container{
    background-color:#F4FAFF;
    border-color:#E6E6EB;
    border-width: 1px;
    border-style:solid;
    text-align: center
  }

  .title{
    color: #6A92E6;
    font-size:15pt;
  }

  .content_container{
    width:100%;
    border-color:#E6E6EB;
    border-width: 1px;
    border-style:solid;
    margin-top: 40px;
  }

  .content_title{
    content:attr(title);
    background-color: white;
    position: absolute;
    left: 10%;
    transform:translateX(-50%);
    -webkit-transform:translate(-50%,-50%);
    padding:0 10px;
    font-size:14pt;
    font-weight: bold;
    color: #303133;
  }

  .data_container{
    margin:30px 20px 50px 20px;
    line-height: 30px;
  }

  .test_title{
    font-size: 15pt;
    font-weight: bold;
    text-align: center;
    margin-bottom: 45px;
  }

</style>


