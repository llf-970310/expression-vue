import util from '@/libs/util.js'
import api from '@/api/sys.auth'

export default {
    namespaced: true,
    actions: {
        /**
         * @description 登录
         * @param {Object} param context
         * @param {Object} param vm {Object} vue 实例
         * @param {Object} param username {String} 用户账号
         * @param {Object} param password {String} 密码
         * @param {Object} param route {Object} 登录成功后定向的路由对象 任何 vue-router 支持的格式
         */
        login({dispatch}, {vm, username, password}) {
            return new Promise((resolve, reject) => {
                // 开始请求登录接口
                api.accountLogin({
                    username,
                    password
                })
                    .then(async res => {
                        util.cookies.set('uuid', res.uuid)
                        // 设置 vuex 用户信息
                        await dispatch('d2admin/user/set', {
                            name: res.name
                        }, {root: true})
                        // 用户登录后从持久化数据加载一系列的设置
                        await dispatch('load')
                        // 结束
                        resolve()
                    })
                    .catch(err => {
                        console.log('err: ', err)
                        reject(err)
                    })
            })
        },
        /**
         *
         * @param dispatch
         * @param vm
         * @param code
         */
        loginWechat({dispatch}, {vm, code}) {
            return new Promise((resolve, reject) => {
                api.wechatLogin({
                    code
                })
                    .then(async res => {
                        if (res.uuid) {
                            util.cookies.set('uuid', res.uuid);
                            // 设置 vuex 用户信息
                            await dispatch('d2admin/user/set', {
                                name: res.name
                            }, {root: true});
                            // 用户登录后从持久化数据加载一系列的设置
                            await dispatch('load');
                            // 结束
                            resolve()
                        } else {
                            vm.$router.push({
                                name: 'bind-wechat',
                                query: {
                                    headimgurl: res.headimgurl,
                                    nickname: res.nickname
                                }
                            })
                        }
                    })
                    .catch(err => {
                        console.log('err: ', err);
                        reject(err)
                    })
            })
        },
        /**
         *
         * @param dispatch
         * @param vm
         * @param username
         * @param password
         */
        bindWeChat({dispatch}, {vm, username, password}) {
            return new Promise((resolve, reject) => {
                // 开始请求微信绑定接口
                api.wechatBind({
                    username,
                    password
                })
                    .then(async res => {
                        util.cookies.set('uuid', res.uuid);
                        // 设置 vuex 用户信息
                        await dispatch('d2admin/user/set', {
                            name: res.name
                        }, {root: true});
                        // 用户登录后从持久化数据加载一系列的设置
                        await dispatch('load');
                        // 结束
                        resolve()
                    })
                    .catch(err => {
                        console.log('err: ', err);
                        reject(err)
                    })
            })
        },
        /**
         * @description 注销用户并返回登录页面
         * @param {Object} param context
         * @param {Object} param vm {Object} vue 实例
         * @param {Object} param confirm {Boolean} 是否需要确认
         */
        logout({commit, dispatch}, {vm, confirm = false}) {
            /**
             * @description 注销
             */
            async function logout() {
                // 删除cookie
                util.cookies.remove('uuid')
                // 清空 vuex 用户信息
                await api.accountLogout()
                await dispatch('d2admin/user/set', {}, {root: true})
                // 跳转路由
                vm.$router.push({
                    name: 'login',
                })
            }

            // 判断是否需要确认
            if (confirm) {
                commit('d2admin/gray/set', true, {root: true})
                vm.$confirm('注销当前账户吗?  打开的标签页和用户设置将会被保存。', '确认操作', {
                    confirmButtonText: '确定注销',
                    cancelButtonText: '放弃',
                    type: 'warning'
                })
                    .then(() => {
                        commit('d2admin/gray/set', false, {root: true})
                        logout()
                    })
                    .catch(() => {
                        commit('d2admin/gray/set', false, {root: true})
                        vm.$message('放弃注销用户')
                    })
            } else {
                logout()
            }
        },
        /**
         * @description 用户登录后从持久化数据加载一系列的设置
         * @param {Object} state vuex state
         */
        load({commit, dispatch}) {
            return new Promise(async resolve => {
                // DB -> store 加载用户名
                await dispatch('d2admin/user/load', null, {root: true})
                // DB -> store 加载主题
                await dispatch('d2admin/theme/load', null, {root: true})
                // DB -> store 加载页面过渡效果设置
                await dispatch('d2admin/transition/load', null, {root: true})
                // DB -> store 持久化数据加载上次退出时的多页列表
                await dispatch('d2admin/page/openedLoad', null, {root: true})
                // DB -> store 持久化数据加载侧边栏折叠状态
                await dispatch('d2admin/menu/asideCollapseLoad', null, {root: true})
                // DB -> store 持久化数据加载全局尺寸
                await dispatch('d2admin/size/load', null, {root: true})
                // end
                resolve()
            })
        },
        /**
         * @description 注册用户
         */

        register({dispatch}, {vm, formData}) {
            return new Promise((resolve, reject) => {
                api.accountRegister(formData)
                    .then(async response => {
                        //注册完了之后干嘛……和登录完了差不多吧
                        util.cookies.set('uuid', response.uuid)
                        await dispatch('d2admin/user/set', {
                            name: response.name``
                        }, {root: true})
                        await dispatch('load')
                        resolve()
                    })
                    .catch(err => {
                        console.log('err: ', err)
                        reject(err)
                    })
            })
        }
    }
}
