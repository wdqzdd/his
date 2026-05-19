<script setup lang="ts">
import FunctionModulePage from './FunctionModulePage.vue';
import { commonColumns, makeRows, makeStats, makeTrace, traceColumns } from './functionPageHelpers';
import type { PageContext } from '../types';
defineProps<{ context: PageContext }>();
const rows = makeRows('EMP-TASK', '我的待办', '个人任务', ['医嘱复核', '预警处理', '签名审核', '记录补录'], '当前员工', ['进入业务页面', '提交处理', '转交协同']);
const cfg = { title: '我的待办', subtitle: '按当前身份汇总个人待处理任务，支持处理、转交、催办和回写原业务状态。', flowText: '业务生成 -> 个人待办 -> 处理回写 -> 审计关闭', filters: [{ label: '任务日期', placeholder: '选择日期', type: 'date' as const }, { label: '任务类型', placeholder: '全部类型', type: 'select' as const, options: ['审核', '执行', '预警', '签名', '补录'] }, { label: '关键字', placeholder: '患者、任务、来源' }], stats: makeStats('待办任务', rows), rows, columns: commonColumns, primaryAction: '处理待办', primaryDialogTitle: '待办处理', primaryFields: [{ label: '处理对象', model: 'target' }, { label: '处理结果', model: 'result', type: 'select' as const, options: ['完成', '退回', '转交'] }, { label: '处理说明', model: 'memo', type: 'textarea' as const }], reviewAction: '任务转交', reviewDialogTitle: '待办转交/复核', reviewFields: [{ label: '接收人', model: 'receiver' }, { label: '转交原因', model: 'reason', type: 'textarea' as const }], traceTitle: '个人待办追溯', traceRows: makeTrace('EMP-TASK', '我的待办'), traceColumns, closureTables: 'task_instance / task_handle_log / employee_todo', closureText: '输入各业务模块生成的任务；输出个人处理结果、转交记录、审计日志和原业务闭环状态。' };
</script>
<template><FunctionModulePage v-bind="cfg" /></template>
