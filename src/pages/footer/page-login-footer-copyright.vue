<template>
    <div class="page-login--content-footer">
        <div class="page-login--content-footer-help">
            <!-- <p class="page-login--content-footer-copyright">使用过程中的任何疑问，请直接联系汤大业</p>
            <p class="page-login--content-footer-copyright">手机/微信：18362926130</p>
            <p class="page-login--content-footer-copyright">QQ：1138833148</p> -->
        </div>
        <!--<p class="page-login&#45;&#45;content-footer-options">-->
        <!--<a href="#">帮助</a>-->
        <!--<a href="#">隐私</a>-->
        <!--<a href="#">条款</a>-->
        <!--</p>-->
        <p class="page-login--content-footer-copyright">
            Copyright
            <d2-icon name="copyright"/>
            2019 上海迷因网络科技有限公司
        </p>
    </div>
</template>

<script>
    export default {
        name: 'page-login-footer-copyright'
    }
</script>

<style scoped lang="scss">

    // footer
    .page-login--content-footer {
        padding: 1em 0;

        .page-login--content-footer-help {
            text-align: center;
            margin: 0 0 10px 0;
        }


        .page-login--content-footer-options {
            padding: 0px;
            margin: 0px;
            margin-bottom: 10px;
            font-size: 14px;
            text-align: center;

            a {
                color: $color-text-normal;
                margin: 0 1em;
            }
        }

        .page-login--content-footer-copyright {
            padding: 0px;
            margin: 0px;
            font-size: 12px;
            color: $color-text-normal;

            a {
                color: $color-text-normal;
            }
        }
    }

</style>
