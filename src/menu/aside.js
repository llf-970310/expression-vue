// 菜单 侧边栏
export default [
  {path: '/index', title: '首页', icon: 'home'},
  {
    title: '基本管理',
    icon: 'folder-o',
    role: 'admin',
    children: [
      {path: '/account', title: '账户管理'},
      {path: '/invitation', title: '邀请管理'},
      {path: '/question', title: '题目管理'},
      {path: '/score', title: '成绩管理'},
    ]
  },
  {
    title: '评分优化',
    icon: 'folder-o',
    role: 'admin',
    children: [
      {path: '/optimize-manual', title: '手动优化'},
      {path: '/optimize-auto', title: '自动优化'},
    ]
  },

  {
    path: '/info', role: 'user', title: '我的信息'
  },{
    path:'/history',role:'user',title:'历史成绩'
  },
  {
    path: '/exercise', role: 'user', title: '表达力评测'
  }
]
