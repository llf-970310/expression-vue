/**
 * 从列表中提取某属性并单独成列表
 * @param list 源列表
 * @param prop 要提取的属性名
 * @return 提取出的属性列表
 */
export function extractVariableAsList(list, prop) {
  return list.map((item) => {
    return item[prop]
  })
}

export function datetime2stdstr(datetime) {
  if (Object.prototype.toString.call(datetime) === '[object Date]') {
    return datetime.toISOString().replace('T', ' ').replace('Z', '');
  }
  return datetime
}

export function stdstr2localstr(stdstr) {
  const localDatetime = new Date(stdstr + ' UTC')
  const timeStr = localDatetime.toTimeString().substr(0,5)
  const dateStr = localDatetime.toLocaleDateString().replace(/\//g, '-')
  return dateStr + ' ' + timeStr
}
