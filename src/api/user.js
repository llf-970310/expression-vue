import request from '@/plugin/axios'

const qs = require('qs')

/**
 * 通过token获取指定用户信息
 */
export function getInfo(token) {
  return request({
    url: '/user/info?token=' + token,
    method: 'get'
  })
}