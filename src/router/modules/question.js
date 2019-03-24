import layoutHeaderAside from '@/layout/header-aside'

const meta = {auth: true}

export default {
  path: '/question',
  name: 'question',
  meta,
  redirect: {name: 'admin-question'},
  component: layoutHeaderAside,
  children: (pre => [
    {
      path: 'index',
      name: `${pre}question`,
      component: () => import('@/pages/question'),
      meta: {...meta, title: '题目管理'}
    },
  ])('admin-')
}
