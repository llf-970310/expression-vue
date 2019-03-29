import request from '@/plugin/axios'

const qs = require('qs');

export function getAllQuestions() {
  return request({
    url: '/admin/questions',
    method: 'get',
  });
}

/**
 * 获得某道题的得分原始数据
 * @param questionNum 题号
 */
export function getScoreData(questionNum) {
  return request({
    url: '/admin/get-score-data?questionNum=' + questionNum,
    method: 'get',
  });
}

/**
 * 获得某道题的关键词权重原始数据
 * @param questionNum 题号
 */
export function getWeightData(questionNum) {
  return request({
    url: '/admin/get-weight-data?questionNum=' + questionNum,
    method: 'get',
  });
}

/**
 * 更新某道题的权重
 * @param questionNum 题号
 * @param weight 权重数据
 */
export function updateWeight(questionNum, weight) {
  return request({
    url: '/admin/update-weight',
    method: 'post',
    data: qs.stringify({
      "questionNum": questionNum,
      "weight": JSON.stringify(weight)
    }),
  });
}

/**
 * 获得某道题最近的一次自动更新的 cost function 的数据
 * @param questionNum 题号
 */
export function getLastCostData(questionNum) {
  return request({
    url: '/admin/get-last-cost-data?questionNum=' + questionNum,
    method: 'get',
  });
}

/**
 * 开始某道题的自动优化，需要这道题处于未优化状态时才会成功操作
 * @param questionNum 题号
 * @param settings 优化设置
 */
export function startAutoOpt(questionNum, settings) {
  return request({
    url: '/admin/start-auto-optimize',
    method: 'post',
    data: qs.stringify({
      questionNum: questionNum,
      settings: JSON.stringify(settings),
    }),
  });
}

/**
 * 停止某道题的自动优化
 * @param questionNum 题号
 */
export function stopAutoOpt(questionNum) {
  return request({
    url: '/admin/stop-auto-optimize',
    method: 'post',
    data: qs.stringify({
      questionNum: questionNum,
    }),
  });
}

/**
 * 重新开始某道题的自动优化，需要某道题处于正在优化状态时才会操作成功
 * @param questionNum 题号
 */
export function refreshAutoOpt(questionNum) {
  return request({
    url: '/admin/refresh-auto-optimize',
    method: 'post',
    data: qs.stringify({
      questionNum: questionNum,
    }),
  });
}
