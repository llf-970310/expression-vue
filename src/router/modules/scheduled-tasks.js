import layoutHeaderAside from '@/layout/header-aside'

const meta = {auth: true}

export default {
    path: '/scheduled-tasks',
    name: 'scheduled-tasks',
    meta: {role: 'admin'},
    redirect: {name: 'admin-scheduled-tasks'},
    component: layoutHeaderAside,
    children: (pre => [
        {
            path: 'index',
            name: `${pre}scheduled-tasks`,
            component: () => import('@/pages/scheduled-tasks'),
            meta: {...meta, title: '定时任务'}
        },
    ])('admin-')
}
