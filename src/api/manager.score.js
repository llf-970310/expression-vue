import request from '@/plugin/axios'

const qs = require('qs')

/**
 * 查看所有题目的成绩情况
 */
export function getScoreOfQuestions() {
  return request({
    url: '/admin/score/question',
    method: 'get'
  })
}

/**
 * 查看某题目的成绩情况
 * @param id 题目ID
 */
export function getScoreOfSpecoficQuestion(id) {
  return request({
    url: '/admin/score/question/' + id,
    method: 'get'
  })
}

/**
 * 查看所有用户的成绩情况
 */
export function getScoreOfUsers() {
  return request({
    url: '/admin/score/user',
    method: 'get'
  })
}

/**
 * 查看某用户的成绩情况
 * @param userEmail  用户邮箱
 */
export function getScoreOfSpecoficUser(userEmail) {
  return request({
    url: '/admin/score/user/' + userEmail,
    method: 'get'
  })
}