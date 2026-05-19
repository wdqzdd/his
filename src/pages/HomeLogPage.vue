<script setup lang="ts">
import FunctionModulePage from './FunctionModulePage.vue';
import { commonColumns, makeRows, makeStats, makeTrace, traceColumns } from './functionPageHelpers';
import type { PageContext } from '../types';
defineProps<{ context: PageContext }>();
const rows = makeRows('HOME-LOG', '工作日志', '居家任务日志', ['今日待办', '工作任务', '到期提醒', '逾期提醒', '完成情况'], '居家患者', ['处理今日待办', '补充任务说明', '查看完成情况']);
const cfg = { title: '工作日志', subtitle: '展示今日待办、工作任务、到期提醒、逾期提醒和完成情况，患者处理后回流医护审核。', flowText: '任务下发 -> 患者处理 -> 到期/逾期提醒 -> 完成情况回写', filters: [{ label: '日期', placeholder: '选择日期', type: 'date' as const }, { label: '日志类型', placeholder: '全部类型', type: 'select' as const, options: ['今日待办', '工作任务', '到期提醒', '逾期提醒', '完成情况'] }, { label: '关键字', placeholder: '报告、事件、医护、任务' }], stats: makeStats('工作日志', rows), rows, columns: commonColumns, primaryAction: '处理待办', primaryDialogTitle: '处理居家工作任务', primaryFields: [{ label: '任务类型', model: 'type', type: 'select' as const, options: ['今日待办', '工作任务', '到期提醒', '逾期提醒'] }, { label: '处理内容', model: 'content', type: 'textarea' as const }], reviewAction: '提交完成情况', reviewDialogTitle: '完成情况提交审核', reviewFields: [{ label: '审核对象', model: 'target' }, { label: '完成说明', model: 'memo', type: 'textarea' as const }], traceTitle: '工作日志追溯', traceRows: makeTrace('HOME-LOG', '工作日志'), traceColumns, closureTables: 'home_task / home_operation_log / home_review_task', closureText: '输入医护下发任务、到期/逾期提醒和患者处理结果；输出完成情况、审核任务和健康档案回写。' };
</script>
<template><FunctionModulePage v-bind="cfg" /></template>
