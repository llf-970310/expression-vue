import Vue from 'vue'
import VueRouter from 'vue-router'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import store from '@/store/index'

import util from '@/libs/util.js'

// 路由数据
import { routes } from './routes'

const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
    return VueRouterPush.call(this, location).catch(err => err)
}
const VueRouterReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace (location) {
    return VueRouterReplace.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

// 导出路由 在 main.js 里使用
const router = new VueRouter({
  routes
})

import { getInfo } from '@/api/manager.user'


//默认的路由规则
const constantRouterMap=[ {
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
}]

router.$addRoutes=(params)=>{
    router.matcher=new VueRouter({
        routes:constantRouterMap
    }).matcher
    router.addRoutes(params)//添加路由
}

/**
 * onReady方法可以看官方文档，不赘述了
 */

router.onReady(() => {
    const status = true // 判断用户已登录且已有权限
    if (status) {
        store.dispatch('getJurisdiction') // 请求动态路由
            .then(e => {
                router.addRoutes(e.list) // 添加动态路由,这里不必用$addRoutes，因为刷新后就没有上一次的动态路由，故不必清除
                router.push({
                    path: '*',
                    name: '404',
                    component: () => import('@/pages/error-page-404')
                })
            })
    }
})


/**
 * 路由拦截
 * 权限验证
 */
const whiteList = ['/login', '/register', '/bind-wechat', '/wechat']
getInfo().then(curUser => {
  const curRole = curUser.role
  // 更新路由
  store.dispatch('d2admin/permission/GenerateRoutes', curRole).then(() => { // 根据roles权限生成可访问的路由表
    // console.log('1234')
    // console.log(store.getters['d2admin/permission/addRouters'])

    router.addRoutes(store.getters['d2admin/permission/addRouters']) // 动态添加可访问路由表
    // console.log(router)
    // next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
  })
  // TODO 更新其他可能相关的前端信息
  store.dispatch('d2admin/user/setRole', curRole).then()
}).catch(error => {
  // 调用后端失败后需要重新登录
  util.cookies.set('uuid', null)
  NProgress.done()
})




router.beforeEach((to, from, next) => {
  // 进度条
  NProgress.start()
  // 关闭搜索面板
  store.commit('d2admin/search/set', false)

  const uuid = util.cookies.get('uuid')
    //是刷新
    console.log(from)
    console.log(to);
    //判断当前是否需要验证
    if (whiteList.indexOf(to.path) == -1) {
        //需要登录
        if (uuid && uuid !== 'null') {
            //已登录
            console.log('需要登录and已登录');
            next();
        }else{
            //未登录
            console.log('需要登录and未登录');
            next({
                name: 'login',
                query: {
                    redirect: to.fullPath
                }
            })
            NProgress.done()
        }
    }else{
        //不需要登录
        console.log('不需要登录')
        next();
        // if(to.name==='404'||to.name===null||to.name==undefined){
        //     next({
        //         path:to.path
        //     })
        // }else{
        //     next();
        // }

    }
  //   if (uuid && uuid !== 'null') {
  //   // 已登录
  //   // console.log('login')
  //   // console.log('uuid: ' + uuid)
  //   // console.log(typeof uuid)
  //   if (whiteList.indexOf(to.path) !== -1) {
  //     // 登录状态不进入白名单网站
  //     next({ path: '/' })
  //     NProgress.done()
  //   } else {
  //     // if (!store.getters['d2admin/permission/addRouters']) {
  //     // }
  //     next()
  //   }
  // } else {
  //   // console.log('not login')
  //   // 未登录
  //   if (whiteList.indexOf(to.path) !== -1) {
  //     // 可直接白名单的网址
  //     next()
  //   } else {
  //     next('/login')
  //     NProgress.done()
  //   }
  // }
})

// router.beforeResolve((to, from, next) => {
//   console.log('router.beforeResolve')
//   next()
// })

router.afterEach(to => {
  // console.log('router.afterEach')
  // 进度条
  NProgress.done()
  // 多页控制 打开新的页面
  store.dispatch('d2admin/page/open', to)
  // 更改标题
  util.title(to.meta.title)
})

export default router
