<template>
    <div class="detail-container">
        <el-image src="/image/result/result_background.jpg" fit="contain"/>
        <div class="detail-content">
            <div class="title">
                {{userName}}的表达力评测结果
            </div>
            <div class="card-container">
                <el-card>
                    <div class="total">
                        总分:{{totalScore}}
                    </div>
                    <div class="description">
                        表达力是一个人生活在社会中所必须的基础能力。它会对一个人的人际关系、情感质量、薪酬和职位产生巨大影响。在这样一个媒体碎片化，传播渠道极其丰富的时代
                        好的表达离对个人的加成，远超以往任何时代，可能一次好的表达，就能让你获得关注和瞩目，提升社会会地位，而一次糟糕的表达有可能会断送一个人的职业生涯，或者
                        在社交中所积累的良好形象。帮助你准确评判自我的表达能力，精准定位自我在人群中的表达水平，是这个测试的目的。有了准确的表达能力图谱，可以帮助你有的放矢地进行针对性
                        地提高，提升自己的竞争力。
                    </div>
                </el-card>
            </div>

            <div class="item-container">

                <el-tabs v-model="itemName" @tab-click="handleClick" :stretch="true">
                    <el-tab-pane label="音质" name="first">
                        <div class="item-description">
                            音质并非指你的声音是否好听，也跟你说话的口音没有太大关系。音质的意思，是声音的整体素质，包括你的语速、重音、停顿、节奏等等，是一个多重维度
                            综合作用的结果。在表达的时候，最基本的层次是确保对方能够听清你说的话，也就是说，一个人的说话方式不能让对方的理解产生障碍，在确保了这一点之后，其次
                            才是怎么能够让对方更好地理解你所表达的意思。好听的声音，是加分项，但并不是必然导致表达力好的因素。
                        </div>
                        <div class="item-result">
                            <div class="item-result-title">
                                评测结果：
                            </div>
                            <div v-for="(val,key,index) in report.音质" style="margin-top: 10px;margin-bottom: 10px">
                                <el-row>
                                    <span class="quality-index">
                                        0{{index+1}}
                                    </span>
                                    <span class="quality-key">
                                        {{key}}
                                    </span>
                                </el-row>
                                <div class="quality-val" v-if="val!=''">
                                    {{val}}
                                </div>
                                <div class="quality-val" v-else>
                                    无
                                </div>
                                <el-divider v-if="index!=3"></el-divider>
                            </div>

                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="主旨" name="second">
                        <div class="item-description">
                            主旨确定表达内容的方向。如果把一段谈话比作一次旅行，那么主只就是这次旅行的目的地，你希望通过表达，让对方没有歧义地理解某个核心的要点。
                            注意，表达时要点可以有很多个，但主旨只能有一个，否则就不称之为主旨了。我们常说一个人说不到点子上，往往意思是这个人讲话的时候丢失了主旨。
                            假如其他内容全部丢失，你只能让对方听到一句话，这句话涵盖了你所有其他想要表达的内容，唯有这句话不能丢失，这就是主旨。提炼并准确表达主旨，
                            能让对方感觉到你是个能抓住重点，提纲挈领的人。
                        </div>
                        <div class="item-result">
                            <div class="item-result-title">
                                评测结果：
                            </div>
                            <div class="item-result-content">
                                {{report.主旨}}
                            </div>
                        </div>

                    </el-tab-pane>
                    <el-tab-pane label="细节" name="third">
                        <div class="item-description">
                            细节决定听众对表达内容的清晰度。如果主旨是一次旅行的目的地，那么细节就是这次旅行中的景点。丰富的细节能够给听众创造良好且印象深刻的感受。
                            一次没有包含任何细节的表达，听众无法清晰的感知，会觉得枯燥。但太过丰富的细节又会造成听众的认知负担，产生模糊不清的印象。因此细节的传达需要有
                            挑选，有主次，有取舍，不能完全没有，也不能胡子眉毛一把抓。
                        </div>
                        <div class="item-result">
                            <div class="item-result-title">
                                评测结果：
                            </div>
                            <div class="item-result-content">
                                {{report.细节}}
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="结构" name="fourth">
                        <div class="item-description">
                            结构指的是内容各部分在表达中的位置安排。最容易理解的类比就是建筑。糟糕的结构不但对听众的理解会造成极大的负担，甚至会把一次表达索要传达的
                            内容彻底破坏，如同一栋建筑物的垮塌。好的表达结构，就是把所有的内容分门别类之后，把相同的或者相似的内容，安排在一起，并放在合适的位置上。
                            方便听众以整块内容未单位来理解所要表达的内容。在表达中，清晰的内容组织结构，能够让你的表达更清晰易懂，对方也能迅速地把握你要传递的重点信息。
                        </div>
                        <div class="item-result">
                            <div class="item-result-title">
                                评测结果：
                            </div>
                            <div class="item-result-content">
                                <div v-for="(item,index) in report.结构" class="item-result-array">{{index+1}}.{{item}}</div>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="逻辑" name="fifth">
                        <div class="item-description">
                            逻辑指的是串联内容的方式，要遵循基本的思维规则和规律。在分门别类组织好素材搭建合理的结构之后，就需要逻辑来吧素材清晰地串联起来，
                            还是拿建筑物打比方，逻辑就好像是通往建筑各个部分地通道。只有合理地连接方式，才能让进入建筑的人更容易进入不同的部分。在表达中，逻辑既可以通过
                            连词来体现，也通过内容之间正确出现的顺序来体现。拥有好的逻辑，可以让人感觉你是个头脑敏捷，思路清晰的人。在表达中，如果表达者能较号地利用逻辑能力
                            合理推导出自己的观点，这样的表达，观点会更有说服力。过程越充分，越容易被理解，观点被接受的可能性也越高。
                        </div>
                        <div class="item-result">
                            <div class="item-result-title">
                                评测结果：
                            </div>
                            <div class="item-result-content">
                                <div v-for="(item,index) in report.逻辑" class="item-result-array">{{index+1}}.{{item}}</div>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>

        </div>
    </div>
    
</template>

<script>

    import { getInfo} from '@api/manager.user';
    export default {
        name: "resultDetail",
        props:{
            totalScore:{
                type:Number,
                default:0
            },
            report:{
                type:Object,
                default(){
                    return {}
                }
            }
        },
        data(){
            return{
                userName:'helu',//用户名
                itemName:'first',//选中的小项name
            }
        },
        mounted(){
            new Promise((resolve, reject) => {
                getInfo().then(
                    res => {
                        this.userName = res.name;
                        resolve();
                    }
                ).catch(err => {
                    console.log('err: ', err);
                    reject(err)
                })
            }).then().catch();
        },
        methods:{
            handleClick(){

            }
        }
    }
</script>

<style scoped>
    .detail-container{
        top:50px;
        width:92%;
        left:4%;
        position: absolute;
    }

    .detail-content{
        z-index: 100;
        width:100%;
        top: 30px;
        position:absolute;
    }
    .title{
        width:100%;
        text-align: center;
        font-size: 40px;
    }

    .card-container{
        width:70%;
        margin-left:15%;
        margin-top:5%;
    }

    .total{
        width:100%;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        margin-top: 10px;
    }

    .description{
        width:94%;
        margin-left: 3%;
        margin-top:20px;
        margin-bottom: 15px;
        font-size: 16px;
        line-height: 23px;
    }

    .item-container{
        margin-top:30px;
        width:70%;
        margin-left:15%;
    }

    .item-description{
        margin-top:10px;
        font-size: 14px;
        line-height: 20px;
        width:90%;
        margin-left: 5%;
    }

    .item-result{
        margin-top: 20px;
        width:90%;
        margin-left: 5%;
        margin-bottom: 100px;
    }

    .item-result-title{
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 20px;
    }
    
    .item-result-content{
        font-size: 14px;
        margin-left: 5%;
        width:95%;

    }

    .quality-index{
        font-style: italic;
        color: #409EFF;
        font-size: 20px;
    }

    .quality-key{
        font-weight: bold;
        font-size: 16px;
        margin-left: 10px;
    }

    .quality-val{
        font-size: 14px;
        margin-top: 10px;
        margin-left: 35px;
    }

    .item-result-array{
        font-size: 14px;
        margin-top: 10px;
        line-height: 24px;
    }
</style>