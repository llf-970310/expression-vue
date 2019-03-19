<template>
  <d2-container :filename="filename">
    <template slot="header">自动优化</template>
    自动优化 TODO
  </d2-container>
</template>

<script>
  export default {
    name: 'optimize-auto',
    data() {
      return {
        filename: __filename
      }
    }
  }
</script>
