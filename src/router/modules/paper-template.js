import layoutHeaderAside from '@/layout/header-aside'

const meta = {auth: true}

export default {
    path: '/paper-template',
    name: 'paper-template',
    meta: {role: 'admin'},
    redirect: {name: 'admin-paper-template'},
    component: layoutHeaderAside,
    children: (pre => [
        {
            path: 'index',
            name: `${pre}paper-template`,
            component: () => import('@/pages/paper-template'),
            meta: {...meta, title: '试卷模板管理'}
        },
    ])('admin-')
}
