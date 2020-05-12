import request from '@/plugin/axios'
import service from '@/plugin/axios'

// 上述不可合并成 import {request, service} ...

const qs = require('qs')

/**
 * 获取预测试的音频数据
 */
export function getPrepareTestInfo() {
    return request({
        url: '/exam/pretest-wav-info',
        method: 'get',
    })
}

/**
 * 获取当次预测试应该上传的路径
 * @param testId 此次预测试 ID
 */
export function getPrepareTestUploadPath(testId) {
    return request({
        url: '/exam/pretest-wav-url',
        method: 'get',
        params: { testId }
    })
}

/**
 * 通知服务器，预测试音频已上传成功
 * @param testId 此次预测试 ID
 */
export function uploadPrepareTestSuccess(testId) {
    return request({
        url: '/exam/pretest-analysis',
        method: 'post',
        data: qs.stringify({
            testId
        })
    })
}

/**
 * 获取预测试音频已上传成功
 * @param testId 此次预测试 ID
 */
export function getPrepareTestResult(testId) {
    return request({
        url: '/exam/pretest-result',
        method: 'get',
        params: { testId }
    })
}

/**
 * 检查是否有未完成的考试
 */
export function checkUnfinishedExam() {
    return request({
        url: '/exam/left',
        method: 'get',
    })
}

export function getPaperTemplates () {
    return request({
        url: '/exam/paper-templates',
        method: 'get',
    })
}

/**
 * 初始化考试
 */
export function initExam (paperTemplateID) {
    return request({
        url: 'exam/new/'+paperTemplateID,
        method: 'post',
    })
}

/**
 * 获取下一题
 * @param nowQuestionNum 获取第一题时为0
 */
export function nextQuestion(nowQuestionNum) {
    return request({
        url: '/exam/'+nowQuestionNum+'/next-question',
        method: 'get'
    })
}

/**
 * 获取当题回答应该上传的路径
 * @param nowQuestionNum 当前题号
 */
export function getUploadPath(nowQuestionNum) {
    return request({
        url: '/exam/' + nowQuestionNum + '/upload-url',
        method: 'get'
    })
}

/**
 * 上传成功回调
 * @param nowQuestionNum 当前题号
 */

export function uploadSuccess(nowQuestionNum) {
    return request({
        url: '/exam/' + nowQuestionNum + '/upload-success',
        method: 'post',
    })
}

/**
 * 获取测评结果数据
 */
export function getResult() {
    return request({
        url: '/exam/result',
        method: 'get'
    })
}

export const FeedbackActions = {
    "like": ["/like", "post"],
    "up": ["/up", "post"],
    "down": ["/down", "post"],
    "cancelLike": ["/like", "delete"],
    "cancelUp": ["/up", "delete"],
    "cancelDown": ["/down", "delete"],
    "upToDown": ["/up2down", "post"],
    "downToUp": ["/down2up", "post"],
};

/**
 * 创建feedback promise请求
 * @param feedbackAction
 * @param qDbId
 * @returns {Promise<function>}
 */
export function feedback(feedbackAction, qDbId) {
    let [action, method] = feedbackAction;
    let url = "/questions/" + qDbId + action;
    if (method === "post") {
        return new Promise((resolve, reject) => {
            service.post(url)
                .then(res => {
                    resolve(res.data);
                    // console.log(res)
                })
                .catch(err => {
                    reject(err.data);
                    // console.log(err)
                })
        });
    } else if (method === "delete") {
        return new Promise((resolve, reject) => {
            service.delete(url)
                .then(res => {
                    resolve(res.data);
                    // console.log(res)
                })
                .catch(err => {
                    reject(err.data);
                    // console.log(err)
                })
        });
    }
}
