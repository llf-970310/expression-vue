import layoutHeaderAside from '@/layout/header-aside'

const meta = {auth: true}

export default {
  path: '/info',
  name: 'info',
  meta: {role: 'user'},
  redirect: {name: 'user-info'},
  component: layoutHeaderAside,
  children: (pre => [
    {
      path: 'index',
      name: `${pre}info`,
      component: () => import('@/pages/info'),
      meta: {...meta, title: '我的信息'}
    },
  ])('user-')
}
