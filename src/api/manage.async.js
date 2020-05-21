import request from '@/plugin/axios'

const qs = require('qs')

export function submitEdit(data) {
    return request({
        url: '/async/ap/update',
        method: 'post',
        data: qs.stringify(data)
    })
}
