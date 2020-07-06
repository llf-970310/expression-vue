<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
  data(){
    return{
      isTesting:true
    }
  }
}
</script>

<style lang="scss">
@import 'assets/style/public-class.scss';
</style>
