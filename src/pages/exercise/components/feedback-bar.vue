<template>
    <div>
        <div class="feedback-left">
            <vue-star-plus v-model="upActive" color="#ff0000" class="i-star__component" @change="handleUpClick">
                <el-button slot="icon" class="i-star__text">{{ upActive ? '👍已点赞' : '这题不错' }}</el-button>
            </vue-star-plus>
        </div>
        <div class="feedback-middle">
            <vue-star-plus v-model="downActive" color="#ff0000" class="i-star__component" @change="handleDownClick">
                <el-button slot="icon" class="i-star__text">{{ downActive ? '👎已点踩' : '这题太差' }}</el-button>
            </vue-star-plus>
        </div>
        <div class="feedback-right">
            <vue-star-plus v-model="likeActive" color="#ff0000" class="i-star__component" @change="handleLikeClick">
                <el-button slot="icon" class="i-star__text">{{ likeActive ? '💖已喜欢' : '喜欢该题' }}</el-button>
            </vue-star-plus>
        </div>
    </div>
</template>

<script>
    export default {
        name: "feedback-bar",
        props: {
            questionDbId: String,
        },
        data() {
            return {
                upActive: false,
                downActive: false,
                likeActive: false,
            }
        },
        methods: {
            handleUpClick() {
                //do something
                if (this.upActive) {
                    console.log('up clicked');
                    this.downActive = false;
                } else {
                    console.log('up canceled')
                }
            },
            handleDownClick() {
                //do something
                if (this.downActive) {
                    console.log('down clicked');
                    this.upActive = false;
                } else {
                    console.log('down canceled')
                }
            },
            handleLikeClick() {
                //do something
                if (this.likeActive) {
                    console.log('liked')
                    console.log(this.questionDbId)
                } else {
                    console.log('unliked')
                }
            },
        }
    }
</script>

<style scoped>
    .feedback-left {
        position: absolute;
        width: 10%;
        left: 40%;
        -webkit-transform: translate(-50%, -50%);
        -moz-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        -o-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }

    .feedback-middle {
        position: absolute;
        width: 10%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        -moz-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        -o-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }

    .feedback-right {
        position: absolute;
        width: 10%;
        left: 60%;
        -webkit-transform: translate(-50%, -50%);
        -moz-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        -o-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }
</style>
