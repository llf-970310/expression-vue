/*
    Time       : 2019-03-21 14:56
    Author     : tangdaye
    Description: 管理部分的后台请求
*/

import invitationApi from '@/api/manage.invitation'

export default {
    namespaced: true,
    actions: {
        generateInvitation({dispatch}, {vm, formData}) {
            return new Promise((resolve, reject) => {
                    invitationApi.createInvitation(formData)
                        .then(async response => {
                            // 用一个 messagebox展示邀请码
                            vm.$alert('邀请码：' + response['invitationCode'], '创建成功', {
                                confirmButtonText: '点击复制到粘贴板',
                                callback: action => {
                                    if (action == 'confirm') {
                                        vm.$copyText(response['invitationCode'])
                                        vm.$message({
                                            type: 'success',
                                            message: '已复制至粘贴板'
                                        })
                                    }
                                    // if action
                                    // vm.$message({
                                    //     type: 'info',
                                    //     message: `action: ${ action }`
                                    // });
                                }
                            })
                            resolve()
                        })
                        .catch(err => {
                            console.log('err: ', err)
                            reject(err)
                        })
                }
            )
        }
    }
}