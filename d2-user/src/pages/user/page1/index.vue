<template>
    <d2-container :filename="filename">
        <template slot="header">Page 1 header</template>
        Hello World
        <button @click="navigate">点我跳转</button>
    </d2-container>
</template>

<script>
export default {
    name: 'page1',
    data() {
        return {
            filename: __filename
        }
    },
    methods: {
        navigate: function () {
            this.$router.push('/user/page2')
        }
    }
}
</script>
