// 试卷模板管理接口

import request from '@/plugin/axios'

const qs = require('qs')

export function queryAllTemplates() {
    return request({
        url: '/admin/all-paper-templates',
        method: 'get',
        params: null
    })
}

export function disableTemplate(templateId) {
    return request({
        url: '/admin/paper-template/disable',
        method: 'post',
        data: qs.stringify({
            "id": templateId
        })
    })
}

export function enableTemplate(templateId) {
    return request({
        url: '/admin/paper-template/enable',
        method: 'post',
        data: qs.stringify({
            "id": templateId
        })
    })
}

export function saveTemplate(data) {
    return request({
        url: '/admin/paper-template',
        method: 'post',
        data: qs.stringify(data)
    })
}