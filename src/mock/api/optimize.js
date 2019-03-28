const scoreData = {
  'main': [18.762, 24.803, 28.705, 31.686, 34.144, 36.263, 38.145, 39.851, 41.422, 42.886, 44.263, 45.570,
    46.817, 48.015, 49.172, 50.294, 51.385, 52.452, 53.498, 54.526, 55.540, 56.542, 57.536, 58.524,
    59.508, 60.492, 61.476, 62.464, 63.458, 64.460, 65.474, 66.502, 67.548, 68.615, 69.706, 70.828,
    71.985, 73.183, 74.430, 75.737, 77.114, 78.578, 80.149, 81.855, 83.737, 85.856, 88.314, 91.295,
    95.197, 100],
  'detail': [21.009, 25.842, 28.964, 31.349, 33.315, 35.011, 36.516, 37.881, 39.138, 40.309, 41.410, 42.456, 43.454,
    44.412, 45.338, 46.235, 47.108, 47.962, 48.798, 49.621, 50.432, 51.234, 52.029, 52.819, 53.607, 54.393,
    55.181, 55.971, 56.766, 57.568, 58.379, 59.202, 60.038, 60.892, 61.765, 62.662, 63.588, 64.546, 65.544,
    66.590, 67.691, 68.862, 70.119, 71.484, 72.989, 74.685, 76.651, 79.036, 82.158, 86.991],
  'total': [19.436, 25.115, 28.783, 31.585, 33.895, 35.888, 37.657, 39.260, 40.737, 42.113, 43.407, 44.635, 45.808,
    46.934, 48.022, 49.076, 50.102, 51.105, 52.088, 53.054, 54.007, 54.950, 55.884, 56.813, 57.738, 58.662,
    59.587, 60.516, 61.450, 62.393, 63.346, 64.312, 65.295, 66.298, 67.324, 68.378, 69.466, 70.592, 71.765,
    72.993, 74.287, 75.663, 77.140, 78.743, 80.512, 82.505, 84.815, 87.617, 91.285, 96.964],
};

const weightData = {
  mainWords: [['高铁', '高速铁路'], ['方式', '方法', '形式', '手段'], ['出行'], ['性价比', '受欢迎', '热门', '畅销', '出名'], ['速度', '速率'], ['舒适', '不适感'], ['正点', '准点', '误点'], ['成本', '效率', '费用', '效益', '价格']],
  mainWeight: [0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125],
  mainHitTimes: [10, 10, 10, 10, 10, 10, 10, 10],
  detailWords: [['40', '四十', '6', '六', '贵阳', '昆明', '桂林', '成都', '柳州', '南宁', '贵州', '遵义', '蒙自'], ['天气', '天候', '飞机', '直升机', '民航机', '起飞', '飞行中', '航空器'], ['电源', '电池', '电路', '开关', '控制器', '元件', '设备', '餐车', '无线', 'wifi'], ['运营', '营运', '运行'], ['专业'], ['管理', '监管', '行政']],
  detailWeight: [0.167, 0.167, 0.167, 0.167, 0.167, 0.167],
  detailHitTimes: [10, 10, 10, 10, 10, 10],
  allHitTimes: 50,
};

const costData = {
  "date": '2019-03-09',
  "finish": true,
  "costData": [{"itrTimes": 200, "cost": 13.6349}, {"itrTimes": 400, "cost": 12.9269}, {
    "itrTimes": 600,
    "cost": 12.2557
  }, {"itrTimes": 800, "cost": 11.6194}, {"itrTimes": 1000, "cost": 11.0161}, {
    "itrTimes": 1200,
    "cost": 10.4441
  }, {"itrTimes": 1400, "cost": 9.9018}, {"itrTimes": 1600, "cost": 9.3877}, {
    "itrTimes": 1800,
    "cost": 8.9003
  }, {"itrTimes": 2000, "cost": 8.4381}, {"itrTimes": 2200, "cost": 8}, {
    "itrTimes": 2400,
    "cost": 7.5846
  }, {"itrTimes": 2600, "cost": 7.1908}, {"itrTimes": 2800, "cost": 6.8174}, {
    "itrTimes": 3000,
    "cost": 6.4635
  }, {"itrTimes": 3200, "cost": 6.1279}, {"itrTimes": 3400, "cost": 5.8097}, {
    "itrTimes": 3600,
    "cost": 5.508
  }, {"itrTimes": 3800, "cost": 5.222}, {"itrTimes": 4000, "cost": 4.9509}, {
    "itrTimes": 4200,
    "cost": 4.6938
  }, {"itrTimes": 4400, "cost": 4.4501}, {"itrTimes": 4600, "cost": 4.2191}, {
    "itrTimes": 4800,
    "cost": 4
  }, {"itrTimes": 5000, "cost": 3.7923}, {"itrTimes": 5200, "cost": 3.5954}, {
    "itrTimes": 5400,
    "cost": 3.4087
  }, {"itrTimes": 5600, "cost": 3.2317}, {"itrTimes": 5800, "cost": 3.0639}, {
    "itrTimes": 6000,
    "cost": 2.9048
  }, {"itrTimes": 6200, "cost": 2.754}, {"itrTimes": 6400, "cost": 2.611}, {
    "itrTimes": 6600,
    "cost": 2.4755
  }, {"itrTimes": 6800, "cost": 2.3469}, {"itrTimes": 7000, "cost": 2.2251}, {
    "itrTimes": 7200,
    "cost": 2.1095
  }, {"itrTimes": 7400, "cost": 2}, {"itrTimes": 7600, "cost": 1.8962}, {
    "itrTimes": 7800,
    "cost": 1.7977
  }, {"itrTimes": 8000, "cost": 1.7044}, {"itrTimes": 8200, "cost": 1.6159}, {
    "itrTimes": 8400,
    "cost": 1.532
  }, {"itrTimes": 8600, "cost": 1.4524}, {"itrTimes": 8800, "cost": 1.377}, {
    "itrTimes": 9000,
    "cost": 1.3055
  }, {"itrTimes": 9200, "cost": 1.2377}, {"itrTimes": 9400, "cost": 1.1735}, {
    "itrTimes": 9600,
    "cost": 1.1125
  }, {"itrTimes": 9800, "cost": 1.0548}, {"itrTimes": 10000, "cost": 1}],
};

export default [
  {
    path: '/admin/get-score-data.*',
    method: 'get',
    handle() {
      return {'code': 0, 'msg': 'success', 'data': scoreData};
    }
  },
  {
    path: '/admin/get-weight-data.*',
    method: 'get',
    handle() {
      return {'code': 0, 'msg': 'success', 'data': weightData};
    }
  },
  {
    path: '/admin/update-weight',
    method: 'post',
    handle() {
      return {'code': 0, 'msg': 'success', 'data': weightData};
    }
  },
  {
    path: '/admin/get-last-cost-data.*',
    method: 'get',
    handle() {
      return {'code': 0, 'msg': 'success', 'data': costData};
    }
  },
  {
    path: '/admin/start-auto-optimize',
    method: 'post',
    handle() {
      return {'code': 0, 'msg': 'success', 'data': {}};
    }
  },
  {
    path: '/admin/stop-auto-optimize',
    method: 'post',
    handle() {
      return {'code': 0, 'msg': 'success', 'data': {}};
    }
  },
  {
    path: '/admin/refresh-auto-optimize',
    method: 'post',
    handle() {
      return {'code': 0, 'msg': 'success', 'data': {}};
    }
  },
];