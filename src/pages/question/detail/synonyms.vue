<template>
  <div>
    <el-row class="synonyms-pairs">
      [
      <el-tag v-for="synonyms in synonymsPairs" :key="synonyms" type="info" class="synonyms">{{synonyms}}</el-tag>
      ]
    </el-row>
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
      return {}
    },
    mounted() {
      // console.log(this.synonymsPairs)
    }
  }
</script>

<style scoped>
  .synonyms-pairs {
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .synonyms {
    margin-left: 5px;
    margin-right: 5px;
  }
</style>