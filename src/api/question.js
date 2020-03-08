import request from '@/plugin/axios'
import service from '@/plugin/axios'

const qs = require('qs')

/**
 * 获取预测试的音频数据
 * TODO GET
 */
export function getPrepareTestInfo() {
    return request({
        url: '/exam/get-test-wav-info',
        method: 'post',
    })
}

/**
 * 获取当次预测试应该上传的路径
 * @param test_id 此次预测试 ID
 * TODO GET
 */
export function getPrepareTestUploadPath(test_id) {
    return request({
        url: '/exam/get-test-wav-url',
        method: 'post',
        data: qs.stringify({
            test_id
        })
    })
}

/**
 * 通知服务器，预测试音频已上传成功
 * @param test_id 此次预测试 ID
 */
export function uploadPrepareTestSuccess(test_id) {
    return request({
        url: '/exam/upload-test-wav-success',
        method: 'post',
        data: qs.stringify({
            test_id
        })
    })
}

/**
 * 获取预测试音频已上传成功
 * @param test_id 此次预测试 ID
 */
export function getPrepareTestResult(test_id) {
    return request({
        url: '/exam/get_test_result',
        method: 'post',
        data: qs.stringify({
            test_id
        })
    })
}

/**
 * 检查是否有未完成的考试
 */
export function checkUnfinishedExam() {
    return request({
        url: '/exam/find-left-exam',
        method: 'post',
    })
}

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

export function uploadSuccess(nowQuestionNum) {
    return request({
        url: '/exam/upload-success',
        method: 'post',
        data: qs.stringify({
            nowQuestionNum: nowQuestionNum
        })
    })
}

/**
 * 获取测评结果数据
 */
export function getResult() {
    return request({
        url: '/exam/get-result',
        method: 'post'
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
                    console.log(res)
                })
                .catch(err => {
                    reject(err.data);
                    console.log(err)
                })
        });
    } else if (method === "delete") {
        return new Promise((resolve, reject) => {
            service.delete(url)
                .then(res => {
                    resolve(res.data);
                    console.log(res)
                })
                .catch(err => {
                    reject(err.data);
                    console.log(err)
                })
        });
    }
}
