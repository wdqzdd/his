export const commonColumns = [
  { prop: 'item', label: '业务对象', minWidth: 160, fixed: 'left' as const },
  { prop: 'category', label: '业务分类', minWidth: 120 },
  { prop: 'target', label: '当前对象', minWidth: 150 },
  { prop: 'status', label: '状态', width: 95, tag: true },
  { prop: 'owner', label: '责任人', minWidth: 120 },
  { prop: 'time', label: '时间', minWidth: 140 },
  { prop: 'nextAction', label: '下一步', minWidth: 150 },
];

export const traceColumns = [
  { prop: 'time', label: '时间', width: 150 },
  { prop: 'node', label: '节点', minWidth: 130 },
  { prop: 'operator', label: '操作人', width: 110 },
  { prop: 'content', label: '内容', minWidth: 190 },
  { prop: 'status', label: '状态', width: 100, tag: true },
];

export function makeRows(prefix: string, item: string, category: string, targets: string[], owner: string, actions: string[]) {
  const statuses = ['待处理', '处理中', '待复核', '已完成', '异常', '关注', '已关闭', '草稿', '已发布', '待归档'];
  return Array.from({ length: 10 }, (_, index) => ({
    id: `${prefix}-${String(index + 1).padStart(3, '0')}`,
    item: `${item}${index + 1}`,
    category,
    target: targets[index % targets.length],
    status: statuses[index % statuses.length],
    owner,
    time: `2026-05-${String(14 - (index % 5)).padStart(2, '0')} ${String(8 + (index % 9)).padStart(2, '0')}:30`,
    nextAction: actions[index % actions.length],
  }));
}

export function makeRowsFromTargets(prefix: string, item: string, category: string, targets: string[], owner: string, actions: string[]) {
  const statuses = ['待处理', '处理中', '待复核', '已完成', '异常', '关注', '已关闭', '草稿', '已发布', '待归档'];
  return targets.map((target, index) => ({
    id: `${prefix}-${String(index + 1).padStart(3, '0')}`,
    item: `${item}${index + 1}`,
    category,
    target,
    status: statuses[index % statuses.length],
    owner,
    time: `2026-05-${String(14 - (index % 5)).padStart(2, '0')} ${String(8 + (index % 9)).padStart(2, '0')}:30`,
    nextAction: actions[index % actions.length],
  }));
}

export function makeStats(totalLabel: string, rows: Array<Record<string, unknown>>) {
  return [
    { label: totalLabel, value: rows.length, tone: 'blue' as const },
    { label: '待处理', value: rows.filter((item) => String(item.status ?? '').includes('待')).length, tone: 'orange' as const },
    { label: '异常', value: rows.filter((item) => item.status === '异常').length, tone: 'red' as const },
    { label: '已完成', value: rows.filter((item) => String(item.status ?? '').includes('已')).length, tone: 'green' as const },
    { label: '追溯记录', value: rows.length * 3, tone: 'blue' as const },
  ];
}

export function makeTrace(prefix: string, title: string) {
  return [
    { time: '2026-05-14 08:30', node: '新建/采集', operator: '系统/责任人', content: `${title}创建业务记录`, status: '成功' },
    { time: '2026-05-14 10:20', node: '处理', operator: '责任人', content: `${title}完成处理并提交`, status: '处理中' },
    { time: '2026-05-14 11:40', node: '复核', operator: '复核人', content: `${title}进入复核队列 ${prefix}`, status: '待复核' },
    { time: '2026-05-14 13:10', node: '关闭', operator: '质控员', content: `${title}写入闭环和审计`, status: '已关闭' },
  ];
}
