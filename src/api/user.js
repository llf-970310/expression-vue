import request from '@/plugin/axios'

const qs = require('qs')

/**
 * 通过token获取指定用户信息
 */
export function getInfo() {
    return request({
        url: '/auth/user/info',
        method: 'get'
    })
}