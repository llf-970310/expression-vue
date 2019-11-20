import layoutHeaderAside from '@/layout/header-aside'

const meta = {auth: true}

export default {
  path: '/history',
  name: 'history',
  meta: {role: 'user'},
  redirect: {name: 'user-history'},
  component: layoutHeaderAside,
  children: (pre => [
    {
      path: 'index',
      name: `${pre}history`,
      component: () => import('@/pages/history'),
      meta: {...meta, title: '历史成绩'}
    },
  ])('user-')
}
