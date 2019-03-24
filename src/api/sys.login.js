import request from '@/plugin/axios'

const qs = require('qs')

export function AccountLogin(data) {
  return request({
    url: '/login',
    method: 'post',
    data: qs.stringify(data)
  })
}
