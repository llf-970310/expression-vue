import layoutHeaderAside from '@/layout/header-aside'

const meta = {auth: true}

export default {
    path: '/user',
    name: 'user',
    meta,
    redirect: {name: 'user-page1'},
    component: layoutHeaderAside,
    children: (pre => [
        {
            path: 'page1',
            name: `${pre}page1`,
            component: () => import('@/pages/user/page1'),
            meta: {...meta, title: '我的信息'}
        },
        {
            path: 'page2',
            name: `${pre}page2`,
            component: () => import('@/pages/user/page2'),
            meta: {...meta, title: '做题'}
        },
    ])('user-')
}
