import layoutHeaderAside from '@/layout/header-aside'

const meta = {auth: true}

export default {
  path: '/score',
  name: 'score',
  meta,
  redirect: {name: 'admin-score'},
  component: layoutHeaderAside,
  children: (pre => [
    {
      path: '',
      name: `${pre}score`,
      component: () => import('@/pages/score'),
      meta: {...meta, title: '成绩管理'}
    },
  ])('admin-')
}
