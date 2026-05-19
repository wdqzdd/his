<script setup lang="ts">
import FunctionModulePage from './FunctionModulePage.vue';
import { commonColumns, makeRows, makeStats, makeTrace, traceColumns } from './functionPageHelpers';
import type { PageContext } from '../types';
defineProps<{ context: PageContext }>();
const rows = makeRows('BOARD-TX', '今日透析队列', '治疗队列', ['第一班A区', '第二班B区', '隔离区', '临时加透'], '护士长', ['查看患者详情', '处理排班异常', '进入治疗记录']);
const cfg = {
  title: '今日透析', subtitle: '按日期、班次、分区查看今日治疗队列、签到、上机、透中、下机和归档状态。',
  flowText: '排班签到 -> 上机治疗 -> 下机评估 -> 归档审核',
  filters: [{ label: '治疗日期', placeholder: '选择日期', type: 'date' as const }, { label: '班次', placeholder: '全部班次', type: 'select' as const, options: ['第一班', '第二班', '第三班', '夜间班'] }, { label: '状态', placeholder: '全部状态', type: 'select' as const, options: ['待签到', '已上机', '透中', '已下机', '待归档'] }],
  stats: makeStats('治疗队列', rows), rows, columns: commonColumns,
  primaryAction: '调整队列', primaryDialogTitle: '今日治疗队列调整', primaryFields: [{ label: '患者', model: 'patient' }, { label: '班次机位', model: 'bed' }, { label: '调整原因', model: 'reason', type: 'textarea' as const }],
  reviewAction: '队列复核', reviewDialogTitle: '今日透析状态复核', reviewFields: [{ label: '复核项目', model: 'item', type: 'select' as const, options: ['签到', '上机', '下机', '归档'] }, { label: '处理结论', model: 'result' }, { label: '备注', model: 'memo', type: 'textarea' as const }],
  traceTitle: '今日透析追溯', traceRows: makeTrace('BOARD-TX', '今日透析'), traceColumns,
  closureTables: 'schedule_bed / dialysis_session / dialysis_archive',
  closureText: '输入排班、签到、处方、设备放行和治疗过程；输出今日治疗状态、异常排班处理和治疗记录入口。',
};
</script>
<template><FunctionModulePage v-bind="cfg" /></template>
