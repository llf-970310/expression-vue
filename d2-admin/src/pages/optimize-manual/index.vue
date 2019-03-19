<template>
  <d2-container :filename="filename">
    <template slot="header">手动优化</template>
    手动优化 TODO
  </d2-container>
</template>

<script>
  export default {
    name: 'optimize-manual',
    data() {
      return {
        filename: __filename
      }
    }
  }
</script>
