<script setup lang="ts">
import FunctionModulePage from './FunctionModulePage.vue';
import { commonColumns, makeRows, makeStats, makeTrace, traceColumns } from './functionPageHelpers';
import type { PageContext } from '../types';
defineProps<{ context: PageContext }>();
const rows = makeRows('EMP-LOG', '工作日志', '个人日志', ['治疗班次', '审核记录', '预警处理', '培训学习'], '当前员工', ['补充日志', '提交复核', '导出日志']);
const cfg = { title: '工作日志', subtitle: '记录当前员工的业务操作、签名、审核、预警处理和培训学习轨迹，支持补充说明和导出。', flowText: '业务操作 -> 自动日志 -> 人工补充 -> 审计导出', filters: [{ label: '日志日期', placeholder: '选择日期', type: 'date' as const }, { label: '日志类型', placeholder: '全部类型', type: 'select' as const, options: ['操作', '签名', '审核', '培训'] }, { label: '关键字', placeholder: '业务对象、模块、结果' }], stats: makeStats('日志记录', rows), rows, columns: commonColumns, primaryAction: '补充日志', primaryDialogTitle: '补充工作日志', primaryFields: [{ label: '日志主题', model: 'title' }, { label: '关联业务', model: 'biz' }, { label: '日志内容', model: 'content', type: 'textarea' as const }], reviewAction: '日志复核', reviewDialogTitle: '工作日志复核', reviewFields: [{ label: '复核结论', model: 'result', type: 'select' as const, options: ['通过', '退回补充'] }, { label: '复核意见', model: 'memo', type: 'textarea' as const }], traceTitle: '工作日志追溯', traceRows: makeTrace('EMP-LOG', '工作日志'), traceColumns, closureTables: 'employee_work_log / sys_audit_log', closureText: '输入员工业务操作和人工补充日志；输出个人工作记录、审计追踪和绩效统计依据。' };
</script>
<template><FunctionModulePage v-bind="cfg" /></template>
