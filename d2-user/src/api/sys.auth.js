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
    }
}
