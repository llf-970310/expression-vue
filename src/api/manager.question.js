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
 * 获取题库中题目
 */
export function getQuestionFromPool() {
  return request({
    url: '/admin/question-from-pool',
    method: 'get'
  })
}

/**
 * 新建一道题目
 * @param questionData 新题目数据
 * @param isNewFromPool 此新题是否来源于题库
 * @param idInPool 若题目来源于题库，则在题库中的ID
 */
export function newQuestion(questionData, isNewFromPool, idInPool) {
  // console.log(Array.isArray(questionData.keywords))
  // console.log((questionData.keywords))
  // console.log(JSON.stringify(questionData.keywords))
  // console.log(JSON.parse(JSON.stringify(questionData.keywords)))
  return request({
    url: '/admin/question',
    method: 'post',
    data: qs.stringify({
      data: {
        rawText: questionData.rawText,
        keywords: JSON.stringify(questionData.keywords),
        mainwords: JSON.stringify(questionData.mainwords),
        detailwords: JSON.stringify(questionData.detailwords)
      },
      isFromPool: isNewFromPool,
      idInPool
    })
  })
}

/**
 * 修改一道题目
 * @param questionData 修改后的题目数据
 * @param id 题目ID
 */
export function modifyQuestion(questionData, id) {
  return request({
    url: '/admin/question',
    method: 'put',
    data: qs.stringify({
      data: {
        rawText: questionData.rawText,
        keywords: JSON.stringify(questionData.keywords),
        mainwords: JSON.stringify(questionData.mainwords),
        detailwords: JSON.stringify(questionData.detailwords)
      },
      id
    })
  })
}