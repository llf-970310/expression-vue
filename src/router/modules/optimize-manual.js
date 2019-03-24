import layoutHeaderAside from '@/layout/header-aside'

const meta = {auth: true}

export default {
  path: '/optimize-manual',
  name: 'optimize-manual',
  meta: {role: 'admin'},
  redirect: {name: 'admin-optimize-manual'},
  component: layoutHeaderAside,
  children: (pre => [
    {
      path: 'index',
      name: `${pre}optimize-manual`,
      component: () => import('@/pages/optimize-manual'),
      meta: {...meta, title: '手动优化'}
    },
  ])('admin-')
}