const defaultQuestion = {
  'code': 0,
  'msg': 'success',
  'data': {
    'lastQuestion': false,
    'questionContent': "高铁是现在是最受欢迎的出行方式。首先，高铁速度快，比如说，以前从贵阳到北京，要用40个小时左右，但现在高铁只需要6个小时，大大减少了路途时间。其次，高铁正点率高，因为高铁受天气条件影响较小，通常都可以准时发车，按时到达。最后，高铁环境舒适，高铁坐席宽敞，运行时速度平稳，没有噪音，餐车环境整洁，配有电源插座和无线网络，乘坐高铁很少会造成不适感，对于不习惯坐飞机出行的人士，高铁是更理想的选择。但高铁的建设，前期投资非常巨大，对设备技术、制作工艺要求都很高，后期的管理运营也需要更专业的人员来完成。",
    'questionInfo': {
      'detail': '声音质量测试。点击 “显示题目” 按钮后请先熟悉屏幕上的文字，然后按下 “开始回答” 按钮朗读该段文字。',
      'tip': '为了保证测试准确性，请选择安静环境，并对准麦克风。'
    },
    'questionLimitTime': 60,
    'questionNumber': 1,
    'questionType': 1,
    'readLimitTime': 5
  }
}

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
    path: '/exam/next-question',
    method: 'post',
    handle() {
      return defaultQuestion
    }
  },
  {
    path: '/exam/get-upload-url',
    method: 'post',
    handle({body}) {
      const nowQuestionNum = body.nowQuestionNum

      let reg = /^[0-9]+$/
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
