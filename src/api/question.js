import request from '@/plugin/axios'

const qs = require('qs')

/**
 * 获取下一题
 * TODO GET
 */
export function nextQuestion(nowQuestionNum) {
  return request({
    url: '/exam/next-question',
    method: 'post',
    data: qs.stringify({
      nowQuestionNum: nowQuestionNum
    })
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

/**
 * 获取测评结果数据
 */
export function getResult () {
    return request({
        url: '/exam/get-result',
        method: 'post'
    })
}
