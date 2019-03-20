import request from '@/plugin/axios'

const qs = require('qs')

export default {
    AccountLogin: function (data) {
        return request({
            url: '/auth/login',
            method: 'post',
            data: qs.stringify(data)
        })
    },
    AccountLogout: function () {
        return request({
            url: '/auth/logout',
            method: 'post'
        })
    }
}
