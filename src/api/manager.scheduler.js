// 定时任务接口

import request from '@/plugin/axios'

// const qs = require('qs')

export function queryAllTasks() {
    return request({
        url: '/apscheduler/jobs',
        method: 'get',
        params: null
    })
}

export function pauseTask(taskId) {
    return request({
        url: '/apscheduler/jobs/' + taskId + '/pause',
        method: 'post',
    })
}

export function resumeTask(taskId) {
    return request({
        url: '/apscheduler/jobs/' + taskId + '/resume',
        method: 'post',
    })
}
