// 菜单 侧边栏
export default [
    {
        path: '/index', title: '首页', icon: 'home'
    },
    {
        title: '管理员功能',
        icon: 'folder-o',
        children: [
            {
                path: '/admin/account',
                title: '账户管理'
            },
            {
                path: '/admin/question',
                title: '题目管理'
            },
            {
                path: '/admin/score',
                title: '成绩管理'
            }
        ]
    }
]
