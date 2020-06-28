// 菜单 侧边栏
export default [
  {path: '/index', title: '首页', icon: 'home'},
  {
    title: '权限管理',
    icon: 'folder-o',
    role: 'admin',
    children: [
      {path: '/account', title: '账户管理'},
      {path: '/invitation', title: '邀请管理'},
    ]
  },
  {
    title: '题目管理',
    icon: 'folder-o',
    role: 'admin',
    children: [
      {path: '/question', title: '题目管理'},
      {path: '/score', title: '成绩管理'},
      {path: '/optimize-manual', title: '手动优化'},
      {path: '/optimize-auto', title: '自动优化'},
    ]
  },
  {
    title: '定时任务',
    icon: 'folder-o',
    role: 'admin',
    children: [
      {path: '/scheduled-tasks', title: '定时任务管理'},
    ]
  },

  {
    path: '/info', role: 'user', title: '我的信息',icon:'vcard-o'
  },
  {
    title: '评测中心',
    icon: 'inbox',
    role: 'user',
    children: [
      {path: '/exercise', title: '评测页',icon:'flask'},
      {path: '/history', title: '历史成绩',icon:'bar-chart'},
    ]
  },
  // {path: '/exercise', role: 'user', title: '表达力评测'}
  // {path:'/history',role:'user',title:'历史成绩'},
]
