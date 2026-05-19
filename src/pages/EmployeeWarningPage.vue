<script setup lang="ts">
import FunctionModulePage from './FunctionModulePage.vue';
import { commonColumns, makeRows, makeStats, makeTrace, traceColumns } from './functionPageHelpers';
import type { PageContext } from '../types';
defineProps<{ context: PageContext }>();
const rows = makeRows('EMP-WAR', '个人预警', '预警处理', ['危急值', '低血压', '水质异常', '居家异常'], '当前员工', ['登记处置', '通知协同', '关闭复核']);
const cfg = { title: '预警处理', subtitle: '显示当前员工负责的危急值、治疗、设备、感控和居家异常预警，支持处置和关闭复核。', flowText: '预警分派 -> 个人处置 -> 复核关闭 -> 看板消警', filters: [{ label: '预警日期', placeholder: '选择日期', type: 'date' as const }, { label: '级别', placeholder: '全部级别', type: 'select' as const, options: ['一级', '二级', '三级'] }, { label: '关键字', placeholder: '患者、预警、来源' }], stats: makeStats('个人预警', rows), rows, columns: commonColumns, primaryAction: '登记处置', primaryDialogTitle: '个人预警处置', primaryFields: [{ label: '处置对象', model: 'target' }, { label: '处置措施', model: 'handle', type: 'textarea' as const }, { label: '通知对象', model: 'notify' }], reviewAction: '关闭复核', reviewDialogTitle: '预警关闭复核', reviewFields: [{ label: '复核结论', model: 'result', type: 'select' as const, options: ['关闭', '退回', '升级'] }, { label: '意见', model: 'memo', type: 'textarea' as const }], traceTitle: '个人预警追溯', traceRows: makeTrace('EMP-WAR', '预警处理'), traceColumns, closureTables: 'warning_event / warning_handle_log / employee_todo', closureText: '输入分派到个人的预警事件；输出处置记录、通知协同、复核关闭和看板状态回写。' };
</script>
<template><FunctionModulePage v-bind="cfg" /></template>
