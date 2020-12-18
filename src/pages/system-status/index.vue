<!--定时任务管理界面-->
<template>
    <d2-container :filename="filename">
        <template slot="header">系统运行状态</template>
        <!--所有任务-->
        <div>
            <el-table :data="allComponents" border stripe highlight-current-row style="width: 100%">
                <el-table-column prop="name" label="系统组件" width="250"></el-table-column>
                <el-table-column prop="url" label="操作">
                    <template slot-scope="scope">
                        <el-link
                            icon="el-icon-s-tools"
                            :href="scope.row.url"
                            :underline="false"
                        >{{"Open " + scope.row.type}}</el-link>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </d2-container>
</template>

<script>
export default {
    name: "system-status",
    data() {
        return {
            filename: __filename,

            // 所有任务部分
            allComponents: [
                {
                    name: "服务器节点状态",
                    url:
                        "http://106.13.160.74:3000/d/rYdddlPWk/node-exporter-full?orgId=1&refresh=1m&var-job=api-node",
                    type: "Grafana"
                },
                {
                    name: "计算节点状态",
                    url:
                        "http://106.13.160.74:3000/d/rYdddlPWk/node-exporter-full?orgId=1&refresh=1m&var-job=analysis-node",
                    type: "Grafana"
                },
                {
                    name: "Redis 缓存状态",
                    url:
                        "http://106.13.160.74:3000/d/xDLNRKUWz/redis-dashboard-for-prometheus-redis-exporter-helm-stable-redis-ha?orgId=1&refresh=30s",
                    type: "Grafana"
                },
                {
                    name: "RabbitMQ 状态",
                    url:
                        "http://106.13.160.74:3000/d/4XT2IlTMz/rabbitmq-metrics?orgId=1&refresh=5s",
                    type: "Grafana"
                },
                {
                    name: "任务队列状态",
                    url: "http://106.13.160.74:50082/",
                    type: "Flower"
                }
            ]
        };
    },
    mounted: function() {},
    methods: {}
};
</script>
