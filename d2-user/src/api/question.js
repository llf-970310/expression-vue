import request from '@/plugin/axios'

const qs = require('qs')

export function getUploadUrl(nowQuestionNum) {
  console.log(qs.stringify({nowQuestionNum: nowQuestionNum}))

  return request({
    url: '/exam/get-upload-url',
    method: 'post',
    data: qs.stringify({
      nowQuestionNum: nowQuestionNum
    })
  })
}
