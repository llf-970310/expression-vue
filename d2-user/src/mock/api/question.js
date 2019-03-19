const defaultUploadUrl = {
  'code': 0,
  'mag': 'success',
  'data': {
    'fileLocation': 'BOS',
    'url': 'audio/2019h382/2371238912.wav'
  }
}

export default [
  {
    path: '/exam/get-upload-url',
    method: 'post',
    handle({body}) {
      const nowQuestionNum = body.nowQuestionNum
      let reg = /^[0-9]+$/
      console.log(reg.test(nowQuestionNum))
      if (reg.test(nowQuestionNum)) {
        return defaultUploadUrl
      } else {
        return {
          'code': 400,
          'msg': 'Bad Request'
        }
      }
    }
  }
]
