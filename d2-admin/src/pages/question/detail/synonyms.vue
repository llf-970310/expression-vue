<template>
  <div>
    <el-row>-------------------------</el-row>
    <el-row>
      <el-col :span="4" v-for="synonyms in synonymsPairs" :key="synonyms">
        {{ synonyms }}
      </el-col>
    </el-row>
    <el-row>-------------------------</el-row>
  </div>
</template>

<script>
  export default {
    name: "synonyms",
    props: {
      // 一组同义词
      synonymsPairs: Array
    },
    data() {
      return {
        filename: __filename
      }
    },
    mounted() {
      console.log(this.synonymsPairs)
    }
  }
</script>

<style scoped>

</style>