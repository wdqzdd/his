<script setup lang="ts">
import FunctionModulePage from './FunctionModulePage.vue';
import { commonColumns, makeRows, makeStats, makeTrace, traceColumns } from './functionPageHelpers';
import type { PageContext } from '../types';
defineProps<{ context: PageContext }>();
const rows = makeRows('BOARD-WAR', '预警危急值', '风险事件', ['检验危急值', '透中低血压', '水质异常', '感控风险'], '值班医生', ['立即处理', '升级通知', '关闭复核']);
const cfg = {
  title: '预警与危急值', subtitle: '集中处理检验危急值、透中风险、设备水质、院感和费用风险，要求责任人处理和复核关闭。',
  flowText: '预警触发 -> 责任处理 -> 复核关闭 -> 看板消警',
  filters: [{ label: '日期', placeholder: '选择日期', type: 'date' as const }, { label: '级别', placeholder: '全部级别', type: 'select' as const, options: ['一级', '二级', '三级'] }, { label: '来源', placeholder: '全部来源', type: 'select' as const, options: ['检验', '治疗', '设备', '感控', '费用'] }],
  stats: makeStats('预警事件', rows), rows, columns: commonColumns,
  primaryAction: '登记处置', primaryDialogTitle: '预警处置登记', primaryFields: [{ label: '预警事件', model: 'event' }, { label: '处置措施', model: 'handle', type: 'textarea' as const }, { label: '通知对象', model: 'notify' }],
  reviewAction: '关闭复核', reviewDialogTitle: '预警关闭复核', reviewFields: [{ label: '复核结论', model: 'result', type: 'select' as const, options: ['通过关闭', '退回补充', '升级CQI'] }, { label: '复核意见', model: 'memo', type: 'textarea' as const }],
  traceTitle: '预警处理追溯', traceRows: makeTrace('BOARD-WAR', '预警与危急值'), traceColumns,
  closureTables: 'warning_event / warning_handle_log / critical_value_notice',
  closureText: '输入危急值、治疗异常、设备水质和感控事件；输出处置记录、复核关闭、员工待办和看板消警。',
};
</script>
<template><FunctionModulePage v-bind="cfg" /></template>
