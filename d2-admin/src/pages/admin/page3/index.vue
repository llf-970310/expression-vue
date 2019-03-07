<template>
    <d2-container :filename="filename">
        <template slot="header">Page 3 header</template>
        <span>Message: {{ msg }}</span>
    </d2-container>
</template>

<script>
    export default {
        name: 'page3',
        data() {
            return {
                filename: __filename,
                msg: '页面加载于 ' + new Date().toLocaleString()
            }
        },
    }
</script>
