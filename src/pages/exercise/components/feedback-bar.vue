<template>
    <div>
<!--        <el-row>-->
<!--            <el-col :span="2" :offset="8">-->
<!--                <vue-star-plus v-model="upActive" color="#ff0000" class="i-star__component" @change="handleUpClick">-->
<!--                    <el-button slot="icon" class="i-star__text">{{ upActive ? '👍已点赞' : '这题不错' }}</el-button>-->
<!--                </vue-star-plus>-->
<!--            </el-col>-->
<!--            <el-col :span="2" :offset="11" >-->
<!--                <vue-star-plus v-model="downActive" color="#ff0000" class="i-star__component" @change="handleDownClick">-->
<!--                    <el-button slot="icon" class="i-star__text">{{ downActive ? '👎已点踩' : '这题太差' }}</el-button>-->
<!--                </vue-star-plus>-->
<!--            </el-col>-->
<!--            <el-col :span="2" :offset="14">-->
<!--                <vue-star-plus v-model="likeActive" color="#ff0000" class="i-star__component" @change="handleLikeClick">-->
<!--                    <el-button slot="icon" class="i-star__text">{{ likeActive ? '💖已喜欢' : '喜欢该题' }}</el-button>-->
<!--                </vue-star-plus>-->
<!--            </el-col>-->
<!--        </el-row>-->
        <div class="feedback-button left">
            <vue-star-plus v-model="upActive" color="#ff0000" class="i-star__component" @change="handleUpClick">
                <el-button slot="icon" class="i-star__text">{{ upActive ? '👍已点赞' : '这题不错' }}</el-button>
            </vue-star-plus>
        </div>
        <div class="feedback-button middle">
            <vue-star-plus v-model="downActive" color="#ff0000" class="i-star__component" @change="handleDownClick">
                <el-button slot="icon" class="i-star__text">{{ downActive ? '👎已点踩' : '这题太差' }}</el-button>
            </vue-star-plus>
        </div>
        <div class="feedback-button right">
            <vue-star-plus v-model="likeActive" color="#ff0000" class="i-star__component" @change="handleLikeClick">
                <el-button slot="icon" class="i-star__text">{{ likeActive ? '💖已喜欢' : '喜欢该题' }}</el-button>
            </vue-star-plus>
        </div>
    </div>
</template>

<script>
    import {feedback, FeedbackActions} from '@/api/manager.exam'

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
                if (this.upActive) {
                    //已经点赞
                    if (this.downActive) {
                        this.downActive = false;
                        feedback(FeedbackActions.downToUp, this.questionDbId);
                        console.log('down2up:', this.questionDbId);
                    } else {
                        feedback(FeedbackActions.up, this.questionDbId);
                        console.log('up:', this.questionDbId);
                    }
                } else {
                    feedback(FeedbackActions.cancelUp, this.questionDbId);
                    console.log('up canceled:', this.questionDbId);
                }
            },
            handleDownClick() {
                if (this.downActive) {
                    if (this.upActive) {
                        this.upActive = false;
                        feedback(FeedbackActions.upToDown, this.questionDbId);
                        console.log('up2down:', this.questionDbId);
                    } else {
                        console.log('down:', this.questionDbId);
                        feedback(FeedbackActions.down, this.questionDbId)
                    }
                } else {
                    feedback(FeedbackActions.cancelDown, this.questionDbId);
                    console.log('down canceled:', this.questionDbId);
                }
            },
            handleLikeClick() {
                // if (this.likeActive) {
                //     feedback(FeedbackActions.like, this.questionDbId);
                //     console.log('liked:', this.questionDbId);
                // } else {
                //     feedback(FeedbackActions.cancelLike, this.questionDbId);
                //     console.log('like canceled:', this.questionDbId);
                // }

                if (this.likeActive) {
                    if (this.downActive) {
                        this.likeActive=false;
                        this.$message({
                            showClose: true,
                            message: '可以先取消这道题的点踩，再表达对这道题的喜欢哦~',
                            type: 'warning'
                        });
                        return;
                    } else {
                        feedback(FeedbackActions.like, this.questionDbId);
                        console.log('liked:', this.questionDbId);
                    }
                } else {
                    feedback(FeedbackActions.cancelLike, this.questionDbId);
                    console.log('like canceled:', this.questionDbId);
                }
            },
        }
    }
</script>

<style scoped>
    .feedback-button {
        position: absolute;
        width: 7.5%;
        -webkit-transform: translateX(-50%);
        -moz-transform: translateX(-50%);
        -ms-transform: translateX(-50%);
        -o-transform: translateX(-50%);
        transform: translateX(-50%);
    }

    .left {
        left: 35%;
    }

    .middle {
        left: 50%;
    }

    .right {
        left: 65%;
    }
</style>
