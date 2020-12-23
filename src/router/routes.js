import account from './modules/account'
import invitation from './modules/invitation'
import question from './modules/question'
import score from './modules/score'
import optimize_auto from './modules/optimize-auto'
import optimize_manual from './modules/optimize-manual'

import exercise from './modules/exercise'
import info from './modules/info'
import history from './modules/history'
import scheduled_tasks from './modules/scheduled-tasks'
import system_status from './modules/system-status'
import paper_template from './modules/paper-template'

import layoutHeaderAside from '@/layout/header-aside'

export const constantRouterMap = [
    {
        path: '/',
        redirect: {name: 'index'},
        component: layoutHeaderAside,
        children: [
            // 首页 必须 name:index
            {
                path: 'index',
                name: 'index',
                component: () => import('@/pages/index')
            },
            // 刷新页面 必须保留
            {
                path: 'refresh',
                name: 'refresh',
                hidden: true,
                // component:()=>import('system/function/addRoutes')
                component: {
                    beforeRouteEnter(to, from, next) {
                        console.log('页面刷新了');
                        next(vm => vm.$router.replace(from.fullPath))
                    },
                    render: h => h()
                }
            },
            // 页面重定向 必须保留
            {
                path: 'redirect/:route*',
                name: 'redirect',
                hidden: true,
                component: {
                    beforeRouteEnter(to, from, next) {
                        next(vm => vm.$router.replace(JSON.parse(from.params.route)))
                    },
                    render: h => h()
                }
            }
        ]
    },
]

export const asyncRouterMap = [
    account,
    invitation,
    question,
    score,
    optimize_auto,
    optimize_manual,

    exercise,
    info,
    history,
    scheduled_tasks,
    system_status,
    paper_template
]

/**
 * 在主框架内显示
 */
const frameIn = [
    ...constantRouterMap,
    ...asyncRouterMap
]

/**
 * 在主框架之外显示
 */
const frameOut = [
    // 登录
    {
        path: '/login',
        name: 'login',
        component: () => import('@/pages/login')
    }, {
        path: '/register',
        name: 'register',
        component: () => import('@/pages/register')
    }, {
        path: '/bind-wechat',
        name: 'bind-wechat',
        component: () => import ('@/pages/bind-wechat')
    }, {
        path: '/wechat',
        name: 'wechat',
        component: () => import('@/pages/wechat')
    }
]

/**
 * 错误页面
 */
// const errorPage = [
//     // 404
//     {
//         path: '*',
//         name: '404',
//         component: () => import('@/pages/error-page-404')
//     }
// ]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 默认可以访问到的
export const routes = [
    ...constantRouterMap,
    ...frameOut,
    // ...errorPage
]
