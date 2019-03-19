import request from '@/plugin/axios'

/**
 * 查看所有题目
 * @param page 页数，从 1 开始
 * @param size 每页大小
 */
export function getAllQuestions(page, size) {
  return request({
    url: '/questions?page=' + page + '&size=' + size,
    method: 'get'
  })
}

/**
 * 查看某题目的详情
 * @param id 题目ID
 */
export function getQuestion(id) {
  return request({
    url: '/question/' + id,
    method: 'get'
  })
}