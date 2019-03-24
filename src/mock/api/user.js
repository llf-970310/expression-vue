const defaultUsers = [
  {
    'code': 0,
    'msg': 'success',
    'data': {
      'name': 'zhangsan',
      'role': 'user'
    }
  },
  {
    'code': 0,
    'msg': 'success',
    'data': {
      'name': 'lisi',
      'role': 'admin'
    }
  }
];

export default [
  {
    path: '/api/user/info.*',
    method: 'get',
    handle() {
      // let index = Math.floor(Math.random() * 2);
      let index = 1
      return defaultUsers[index]
    }
  }
]