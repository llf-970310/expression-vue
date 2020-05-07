<!--朗读题-->
<template>
  <div v-html="text" style="text-align: justify">
  </div>
</template>

<script>
  export default {
    name: "read",
    props: {
      text: String
    }
  }
</script>

<style scoped>

</style>
