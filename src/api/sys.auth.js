import request from '@/plugin/axios'

const qs = require('qs')

export default {
    accountLogin: function (data) {
        return request({
            url: '/auth/login',
            method: 'post',
            data: qs.stringify(data)
        })
    },
    accountLogout: function () {
        return request({
            url: '/auth/logout',
            method: 'post'
        })
    },
    accountRegister: function (data) {
        return request({
            url: '/auth/register',
            method: 'post',
            data: qs.stringify(data)
        })
    },
    wechatLogin: function (data) {
        return request({
            url:'/auth/wechat/login',
            method: 'post',
            data: qs.stringify(data)
        })
    },
    wechatBind: function (data) {
        return request({
            url: '/auth/wechat/bind',
            method: 'post',
            data: qs.stringify(data)
        })
    },
}
