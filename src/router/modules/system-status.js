import layoutHeaderAside from '@/layout/header-aside'

const meta = {auth: true}

export default {
    path: '/system-status',
    name: 'system-status',
    meta: {role: 'admin'},
    redirect: {name: 'admin-system-status'},
    component: layoutHeaderAside,
    children: (pre => [
        {
            path: 'index',
            name: `${pre}system-status`,
            component: () => import('@/pages/system-status'),
            meta: {...meta, title: '系统状态'}
        },
    ])('admin-')
}
