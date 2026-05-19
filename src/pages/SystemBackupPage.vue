<script setup lang="ts">
import FunctionModulePage from './FunctionModulePage.vue';
import { commonColumns, makeRowsFromTargets, makeStats, makeTrace, traceColumns } from './functionPageHelpers';
import type { PageContext } from '../types';
defineProps<{ context: PageContext }>();
const targets = ['数据备份', '数据恢复', '备份策略', '备份日志', '数据校验'];
const rows = makeRowsFromTargets('SYS-BAK', '备份恢复', '备份恢复', targets, '系统管理员', ['执行数据备份', '提交恢复申请', '维护备份策略', '查看备份日志', '执行数据校验']);
const cfg = { title: '数据备份与恢复', subtitle: '管理数据备份、数据恢复、备份策略、备份日志和数据校验，恢复操作需高风险审批。', flowText: '备份策略 -> 数据备份 -> 日志校验 -> 恢复审批 -> 审计追踪', filters: [{ label: '备份日期', placeholder: '选择日期', type: 'date' as const }, { label: '任务类型', placeholder: '全部类型', type: 'select' as const, options: ['数据备份', '数据恢复', '备份策略', '备份日志', '数据校验'] }, { label: '状态', placeholder: '全部状态', type: 'select' as const, options: ['成功', '失败', '待审批', '校验中', '已关闭'] }, { label: '关键字', placeholder: '备份任务、恢复对象、结果、责任人' }], stats: makeStats('备份恢复项', rows), rows, columns: commonColumns, primaryAction: '新建备份/恢复', primaryDialogTitle: '新建备份或恢复任务', primaryFields: [{ label: '任务类型', model: 'type', type: 'select' as const, options: ['数据备份', '数据恢复', '备份策略', '数据校验'] }, { label: '备份范围', model: 'range' }, { label: '执行时间', model: 'time', type: 'date' as const }, { label: '校验方式', model: 'check' }, { label: '恢复点', model: 'restorePoint' }], reviewAction: '恢复审批', reviewDialogTitle: '数据恢复审批', reviewFields: [{ label: '恢复对象', model: 'target' }, { label: '校验结果', model: 'checkResult' }, { label: '审批结论', model: 'result', type: 'select' as const, options: ['同意恢复', '拒绝', '补充说明'] }, { label: '审批意见', model: 'memo', type: 'textarea' as const }], traceTitle: '备份恢复审计', traceRows: makeTrace('SYS-BAK', '数据备份与恢复'), traceColumns, closureTables: 'sys_backup_task / sys_restore_apply / sys_backup_policy / sys_backup_log / sys_data_check_log / sys_audit_log', closureText: '输入备份策略、备份计划和恢复申请；输出备份日志、数据校验、恢复审批、演练报告和审计轨迹。' };
</script>
<template><FunctionModulePage v-bind="cfg" /></template>
