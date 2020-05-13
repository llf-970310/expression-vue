import request from '@/plugin/axios'

const qs = require('qs')

/**
 * 通过token获取指定用户信息
 */
export function getInfo () {
    return request({
        url: '/account/info',
        method: 'get'
    })
}

/**
 *  修改用户信息
 */
export function modifyInfo (data) {
    // console.log(data)
    return request({
        url: '/account/update',
        method: 'post',
        data: qs.stringify(data)
    })
}

/**
 * 微信解绑
 */
export function untying () {
    return request({
        url: '/account/unbind-wx',
        method: 'post'
    })
}

export function showScore () {
    return request({
        url: '/account/history-scores',
        method: 'get'
    })
}
