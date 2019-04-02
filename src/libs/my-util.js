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