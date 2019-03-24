import layoutHeaderAside from '@/layout/header-aside'

const meta = {auth: true}

export default {
  path: '/optimize-auto',
  name: 'optimize-auto',
  meta: {role: 'admin'},
  redirect: {name: 'admin-optimize-auto'},
  component: layoutHeaderAside,
  children: (pre => [
    {
      path: 'index',
      name: `${pre}optimize-auto`,
      component: () => import('@/pages/optimize-auto'),
      meta: {...meta, title: '自动优化'}
    },
  ])('admin-')
}
