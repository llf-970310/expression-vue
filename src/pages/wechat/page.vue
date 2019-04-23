<template>
</template>

<script>
    import {mapActions} from 'vuex'

    export default {
        mounted() {
            const code = this.$route.query.code
            // const state = this.$route.query.state //还应该有state参数，没用到
            if (!code) {
                this.$router.push(this.$route.query.redirect || '/')
            } else {
                this.loginWechat({
                    vm: this,
                    code: code
                }).then(() => {
                    this.$router.push(this.$route.query.redirect || '/')
                }).catch(() => {
                    this.$router.push({
                        name: '/login'
                    })
                })
            }
        },
        methods: {
            ...mapActions('d2admin/account', [
                'loginWechat'
            ]),
        }
    }
</script>