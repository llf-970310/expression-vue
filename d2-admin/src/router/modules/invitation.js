import layoutHeaderAside from '@/layout/header-aside'

const meta = {auth: true}

export default {
  path: '/invitation',
  name: 'invitation',
  meta,
  redirect: {name: 'admin-invitation'},
  component: layoutHeaderAside,
  children: (pre => [
    {
      path: 'index',
      name: `${pre}invitation`,
      component: () => import('@/pages/invitation'),
      meta: {...meta, title: '邀请管理'}
    },
  ])('admin-')
}
