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
            path: 'page1',
            name: `${pre}page1`,
            component: () => import('@/pages/admin/page1'),
            meta: {...meta, title: '页面 1'}
        },
        {
            path: 'page2',
            name: `${pre}page2`,
            component: () => import('@/pages/admin/page2'),
            meta: {...meta, title: '页面 2'}
        },
        {
            path: 'page3',
            name: `${pre}page3`,
            component: () => import('@/pages/admin/page3'),
            meta: {...meta, title: '页面 3'}
        },
    ])('admin-')
}
