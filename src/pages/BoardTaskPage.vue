<script setup lang="ts">
import FunctionModulePage from './FunctionModulePage.vue';
import { commonColumns, makeRows, makeStats, makeTrace, traceColumns } from './functionPageHelpers';
import type { PageContext } from '../types';
defineProps<{ context: PageContext }>();
const rows = makeRows('BOARD-TASK', '跨角色待办', '待办汇总', ['医生待办', '护士待办', '技师待办', '导诊待办'], '科室秘书', ['催办责任人', '调整分派', '关闭任务']);
const cfg = {
  title: '待办汇总', subtitle: '汇总医生、护士、导诊、技师、检验、感控和费用待办，支持催办、改派、关闭追踪。',
  flowText: '业务触发 -> 员工待办 -> 处理反馈 -> 原业务回写',
  filters: [{ label: '任务日期', placeholder: '选择日期', type: 'date' as const }, { label: '角色', placeholder: '全部角色', type: 'select' as const, options: ['医生', '护士', '导诊', '技师', '检验', '感控'] }, { label: '状态', placeholder: '全部状态', type: 'select' as const, options: ['待处理', '处理中', '超时', '已关闭'] }],
  stats: makeStats('待办任务', rows), rows, columns: commonColumns,
  primaryAction: '新增待办', primaryDialogTitle: '新增跨角色待办', primaryFields: [{ label: '任务主题', model: 'title' }, { label: '责任角色', model: 'role', type: 'select' as const, options: ['医生', '护士', '导诊', '技师'] }, { label: '处理要求', model: 'requirement', type: 'textarea' as const }],
  reviewAction: '催办改派', reviewDialogTitle: '待办催办与改派', reviewFields: [{ label: '处理方式', model: 'method', type: 'select' as const, options: ['催办', '改派', '关闭', '升级'] }, { label: '接收人', model: 'receiver' }, { label: '说明', model: 'memo', type: 'textarea' as const }],
  traceTitle: '待办任务追溯', traceRows: makeTrace('BOARD-TASK', '待办汇总'), traceColumns,
  closureTables: 'task_instance / task_handle_log / employee_message',
  closureText: '输入各业务模块自动生成的任务；输出跨角色待办、催办改派记录、处理回写和任务关闭审计。',
};
</script>
<template><FunctionModulePage v-bind="cfg" /></template>
