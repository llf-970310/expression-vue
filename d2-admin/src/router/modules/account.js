import layoutHeaderAside from '@/layout/header-aside'

const meta = {auth: true}

export default {
  path: '/account',
  name: 'account',
  meta,
  redirect: {name: 'admin-account'},
  component: layoutHeaderAside,
  children: (pre => [
    {
      path: 'index',
      name: `${pre}account`,
      component: () => import('@/pages/account'),
      meta: {...meta, title: '账户管理'}
    },
  ])('admin-')
}
