import request from '@/plugin/axios'

const qs = require('qs')

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

/**
 * 获取下一题
 * TODO GET
 */
export function nextQuestion() {
  return request({
    url: '/exam/next-question',
    method: 'post'
  })
}

/**
 * 获取当题回答应该上传的路径
 * @param nowQuestionNum 当前题号
 * TODO GET
 */
export function getUploadPath(nowQuestionNum) {
  return request({
    url: '/exam/get-upload-url',
    method: 'post',
    data: qs.stringify({
      nowQuestionNum: nowQuestionNum
    })
  })
}
