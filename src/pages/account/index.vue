<!--账户管理界面 TODO lyy-->
<template>
  <d2-container :filename="filename">
    <template slot="header">账户管理</template>
    <!--<el-input v-model="input" placeholder="ya"></el-input>-->
  </d2-container>
</template>

<script>
export default {
  name: 'account',
  data () {
    return {
      filename: __filename
    }
  }
}
</script>
