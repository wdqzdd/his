<script setup lang="ts">
import FunctionModulePage from './FunctionModulePage.vue';
import { commonColumns, makeRows, makeStats, makeTrace, traceColumns } from './functionPageHelpers';
import type { PageContext } from '../types';
defineProps<{ context: PageContext }>();
const rows = makeRows('EMP-DUTY', '分工分管', '个人分工', ['责任患者', '护理组', '设备分区', '质控项目'], '当前员工', ['调整分工', '交接确认', '查看负荷']);
const cfg = { title: '分工分管', subtitle: '查看当前员工负责的患者、护理组、设备分区、质控项目和研究项目，支持交接与调整。', flowText: '资源分配 -> 个人分管 -> 交接调整 -> 工作量统计', filters: [{ label: '日期', placeholder: '选择日期', type: 'date' as const }, { label: '分工类型', placeholder: '全部类型', type: 'select' as const, options: ['患者', '护理组', '设备', '质控', '研究'] }, { label: '关键字', placeholder: '患者、分区、项目' }], stats: makeStats('分工记录', rows), rows, columns: commonColumns, primaryAction: '调整分工', primaryDialogTitle: '分工调整', primaryFields: [{ label: '分工对象', model: 'target' }, { label: '接收人', model: 'receiver' }, { label: '调整原因', model: 'reason', type: 'textarea' as const }], reviewAction: '交接确认', reviewDialogTitle: '分工交接确认', reviewFields: [{ label: '交接结论', model: 'result', type: 'select' as const, options: ['确认接收', '退回调整'] }, { label: '交接备注', model: 'memo', type: 'textarea' as const }], traceTitle: '分工分管追溯', traceRows: makeTrace('EMP-DUTY', '分工分管'), traceColumns, closureTables: 'staff_assignment / patient_assignment / duty_handover_log', closureText: '输入人员排班、患者归属和资源分工；输出个人分管清单、交接记录和工作量统计。' };
</script>
<template><FunctionModulePage v-bind="cfg" /></template>
