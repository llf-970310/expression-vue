import Vue from 'vue'
import VueRouter from 'vue-router'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import store from '@/store/index'

import util from '@/libs/util.js'

// 路由数据
import {routes} from './routes'

Vue.use(VueRouter)

// 导出路由 在 main.js 里使用
const router = new VueRouter({
    routes
})


import {getInfo} from '@/api/user'

/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach((to, from, next) => {
    // 进度条
    NProgress.start()
    // 关闭搜索面板
    store.commit('d2admin/search/set', false)
    // 验证当前路由所有的匹配中是否需要有登录验证的
    if (to.matched.some(r => r.meta.auth)) {
        const session = util.cookies.get('session')
        new Promise((resolve, reject) => {
            getInfo().then(curUser => {
                const curRole = curUser.role
                // 更新路由
                store.dispatch('d2admin/permission/GenerateRoutes', curRole).then(() => { // 根据roles权限生成可访问的路由表
                    router.addRoutes(store.getters['d2admin/permission/addRouters']) // 动态添加可访问路由表
                    // console.log(router)
                    next({...to, replace: true}) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                })
                // TODO 更新前端信息，比如name等
                store.dispatch('d2admin/user/setRole', curRole).then()
                resolve()
            }).catch(error => {
                reject(error)
                next({
                    name: 'login',
                    query: {
                        redirect: to.fullPath
                    }
                })
                NProgress.done()
            })
        }).then()
        next()
    } else {
        next()
    }
})

router.afterEach(to => {
    // 进度条
    NProgress.done()
    // 多页控制 打开新的页面
    store.dispatch('d2admin/page/open', to)
    // 更改标题
    util.title(to.meta.title)
})

export default router