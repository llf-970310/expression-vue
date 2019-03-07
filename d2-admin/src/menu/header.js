// 菜单 顶栏
export default [
    {path: '/index', title: '首页', icon: 'home'},
    {
        title: '管理员功能',
        icon: 'folder-o',
        children: [
            {path: '/admin/page1', title: '功能 1'},
            {path: '/admin/page2', title: '功能 2'},
            {path: '/admin/page3', title: '功能 3'},
        ]
    }
]
