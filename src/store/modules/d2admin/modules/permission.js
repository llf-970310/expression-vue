import { asyncRouterMap, constantRouterMap } from '@/router/routes'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * 如无配置，则默认用户有权限
 */
function hasPermission(role, route) {
  // console.log('In function hasPermission: ' + route.path)
  if (route.meta && route.meta.role) {
    // console.log(role === route.meta.role)
    return role === route.meta.role
  } else {
    // console.log('true')
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 */
function filterAsyncRouter(asyncRouterMap, role) {
  return asyncRouterMap.filter(route => {
    if (hasPermission(role, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, role)
      }
      return true
    } else return false
  })
}

const permission = {
  namespaced: true,
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  getters: {
    addRouters: state => state.addRouters,
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit, dispatch }, role) {
      return new Promise(resolve => {
        const accessedRouters = filterAsyncRouter(asyncRouterMap, role)
        // console.log('accessedRouters')
        // console.log(accessedRouters)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
