export const validateQuestionId = (rule, value, callback) => {
  // console.log('value: ' + value)
  if (value === '') {
    return callback(new Error('题目编号不可为空'))
  }

  let reg = /^[0-9]+$/
  if (!reg.test(value)) {
    return callback(new Error('题目编号只包含数字'))
  } else {
    callback()
  }
}