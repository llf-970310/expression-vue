import request from '@/plugin/axios'

const qs = require('qs');


/**
 * 获得某道题的得分原始数据
 * @param questionNum 题号
 */
export function getScoreData(questionNum) {
  return request({
    url: '/admin/get-score-data/' + questionNum,
    method: 'get',
  });
}

/**
 * 获得某道题的关键词权重原始数据
 * @param questionNum 题号
 */
export function getWeightData(questionNum) {
  return request({
    url: '/admin/get-weight-data/' + questionNum,
    method: 'get',
  });
}

/**
 * 更新某道题的权重
 * @param questionNum 题号
 * @param mainWords 主旨词
 * @param mainWeight 主旨词权重
 * @param detailWords 细节词
 * @param detailWeight 细节词权重
 */
export function updateWeight(questionNum, mainWords, mainWeight, detailWords, detailWeight) {
  return request({
    url: '/admin/update-weight',
    method: 'post',
    data: qs.stringify({
      questionNum: questionNum,
      mainWeight: mainWeight,
      detailWeight: detailWeight,
    }),
  });
}

/**
 * 获得某道题最近的一次自动更新的 cost function 的数据
 * @param questionNum 题号
 */
export function getLastCostData(questionNum) {
  return request({
    url: '/admin/get-last-cost-data/' + questionNum,
    method: 'get',
  });
}

/**
 * 开始某道题的自动优化，需要这道题处于未优化状态时才会成功操作
 * @param questionNum 题号
 */
export function startAutoOpt(questionNum) {
  return request({
    url: '/admin/start-auto-optimize',
    method: 'post',
    data: qs.stringify({
      questionNum: questionNum,
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
