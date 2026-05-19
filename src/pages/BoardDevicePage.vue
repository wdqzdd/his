<script setup lang="ts">
import FunctionModulePage from './FunctionModulePage.vue';
import { commonColumns, makeRows, makeStats, makeTrace, traceColumns } from './functionPageHelpers';
import type { PageContext } from '../types';
defineProps<{ context: PageContext }>();
const rows = makeRows('BOARD-DEV', '设备水质状态', '设备水质', ['透析机', '水处理RO', '机位绑定', '消毒记录'], '设备技师', ['复测水质', '维修派工', '上机放行']);
const cfg = {
  title: '设备与水质', subtitle: '展示设备运行、机位绑定、水处理参数、消毒记录和上机放行状态，异常时影响排班和治疗核对。',
  flowText: '巡检消毒 -> 水质监测 -> 异常处理 -> 上机放行',
  filters: [{ label: '日期', placeholder: '选择日期', type: 'date' as const }, { label: '设备类型', placeholder: '全部类型', type: 'select' as const, options: ['透析机', '水处理', '接诊设备'] }, { label: '状态', placeholder: '全部状态', type: 'select' as const, options: ['可用', '待复测', '维修', '停用'] }],
  stats: makeStats('设备水质项', rows), rows, columns: commonColumns,
  primaryAction: '设备复核', primaryDialogTitle: '设备水质复核', primaryFields: [{ label: '设备/机位', model: 'device' }, { label: '复核项目', model: 'item', type: 'select' as const, options: ['运行参数', '消毒记录', '水质指标', '机位绑定'] }, { label: '复核结果', model: 'result', type: 'textarea' as const }],
  reviewAction: '放行处理', reviewDialogTitle: '上机放行处理', reviewFields: [{ label: '放行结论', model: 'result', type: 'select' as const, options: ['允许上机', '待复测', '停用维修'] }, { label: '处理说明', model: 'memo', type: 'textarea' as const }],
  traceTitle: '设备水质追溯', traceRows: makeTrace('BOARD-DEV', '设备与水质'), traceColumns,
  closureTables: 'device_archive / water_quality_record / device_release_check',
  closureText: '输入设备档案、巡检、消毒、水质和维修记录；输出设备放行状态、异常预警、排班影响和追溯审计。',
};
</script>
<template><FunctionModulePage v-bind="cfg" /></template>
