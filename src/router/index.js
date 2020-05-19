import Vue from 'vue'
import VueRouter from 'vue-router'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import store from '@/store/index'

import util from '@/libs/util.js'

// 路由数据
import { routes } from './routes'

Vue.use(VueRouter)

// 导出路由 在 main.js 里使用
const router = new VueRouter({
  routes
})

import { getInfo } from '@/api/manager.user'

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
  if (uuid && uuid !== 'null') {
    // 已登录
    // console.log('login')
    // console.log('uuid: ' + uuid)
    // console.log(typeof uuid)
    if (whiteList.indexOf(to.path) !== -1) {
      // 登录状态不进入白名单网站
      next({ path: '/' })
      NProgress.done()
    } else {
      // if (!store.getters['d2admin/permission/addRouters']) {
      // }
      next()
    }
  } else {
    // console.log('not login')
    // 未登录
    if (whiteList.indexOf(to.path) !== -1) {
      // 可直接白名单的网址
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
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
