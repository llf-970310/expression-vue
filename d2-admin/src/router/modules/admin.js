import layoutHeaderAside from '@/layout/header-aside'

const meta = {auth: true}

export default {
    path: '/admin',
    name: 'admin',
    meta,
    redirect: {name: 'admin-page1'},
    component: layoutHeaderAside,
    children: (pre => [
        {
            path: 'account',
            name: `${pre}account`,
            component: () => import('@/pages/admin/account'),
            meta: {...meta, title: '账户管理'}
        },
        {
            path: 'question',
            name: `${pre}question`,
            component: () => import('@/pages/admin/question'),
            meta: {...meta, title: '问题管理'}
        },
        {
            path: 'score',
            name: `${pre}score`,
            component: () => import('@/pages/admin/score'),
            meta: {...meta, title: '成绩管理'}
        }
    ])('admin-')
}
