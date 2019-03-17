import layoutHeaderAside from '@/layout/header-aside'

const meta = {auth: true}

export default {
  path: '/exercise',
  name: 'exercise',
  meta,
  redirect: {name: 'user-exercise'},
  component: layoutHeaderAside,
  children: (pre => [
    {
      path: '',
      name: `${pre}exercise`,
      component: () => import('@/pages/exercise'),
      meta: {...meta, title: '表达力评测'}
    },
  ])('user-')
}
