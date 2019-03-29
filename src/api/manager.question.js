import request from '@/plugin/axios'

const qs = require('qs')

/**
 * 查看所有题目
 * @param page 页数，从 1 开始
 * @param size 每页大小
 */
export function getAllQuestions(page, size) {
  return request({
    url: '/admin/questions?page=' + page + '&size=' + size,
    method: 'get'
  })
}

/**
 * 查看某题目的详情
 * @param id 题目ID
 */
export function getQuestion(id) {
  return request({
    url: '/admin/question/' + id,
    method: 'get'
  })
}

/**
 * 新建一道题目
 * @param data 题目
 */
export function newQuestion(data) {
  return request({
    url: '/admin/question',
    method: 'post'
  })
}

/**
 * 修改一道题目
 * @param data 题目
 */
export function modifyQuestion(data) {
  return request({
    url: '/admin/question',
    method: 'put'
  })
}