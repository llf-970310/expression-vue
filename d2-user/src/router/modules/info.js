import layoutHeaderAside from '@/layout/header-aside'

const meta = {auth: true}

export default {
  path: '/info',
  name: 'info',
  meta,
  redirect: {name: 'user-info'},
  component: layoutHeaderAside,
  children: (pre => [
    {
      path: '',
      name: `${pre}info`,
      component: () => import('@/pages/info'),
      meta: {...meta, title: '我的信息'}
    },
  ])('user-')
}
