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

/**
 * 使用邀请码更新权限
 */
export function updatePrivilege (code) {
    return request({
        url: '/account/update-privilege/' + code,
        method: 'post'
    })
}

export function showScore (code) {
    return request({
        url: '/account/history-scores/'+code,
        method: 'get'
    })
}

export function showReport (code) {
    return request({
        url: '/account/history-report/'+code,
        method: 'get'
    })
}
