/*
    Time       : 2019-03-21 15:05
    Author     : tangdaye
    Description: 验证码增删改查
*/

import request from '@/plugin/axios'

const qs = require('qs')

export function getAllInvitations() {
    return request({
        url: '/admin/accounts/invite',
        method: 'get'
    })
}

export function createInvitation(data) {
    return request({
        url: '/admin/accounts/invite',
        method: 'post',
        data: qs.stringify(data)
    })

}

