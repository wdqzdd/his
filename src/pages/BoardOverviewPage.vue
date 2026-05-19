<script setup lang="ts">
import FunctionModulePage from './FunctionModulePage.vue';
import { commonColumns, makeRows, makeStats, makeTrace, traceColumns } from './functionPageHelpers';
import type { PageContext } from '../types';
defineProps<{ context: PageContext }>();
const rows = makeRows('BOARD-OV', '运营指标', '科室运行', ['总览指标', '治疗容量', '风险分布', '资源状态'], '科室主任', ['下钻运营明细', '生成日报', '推送负责人']);
const cfg = {
  title: '运营总览', subtitle: '查看科室治疗容量、在透患者、预警、待办、设备水质和库存费用的总体运行态势。',
  flowText: '业务数据 -> 看板汇总 -> 风险下钻 -> 责任处理',
  filters: [{ label: '日期', placeholder: '选择日期', type: 'date' as const }, { label: '院区', placeholder: '全部院区', type: 'select' as const, options: ['总院区', '东院区', '居家'] }, { label: '关键字', placeholder: '指标、责任人、风险' }],
  stats: makeStats('运营指标', rows), rows, columns: commonColumns,
  primaryAction: '生成日报', primaryDialogTitle: '生成运营日报', primaryFields: [{ label: '日报日期', model: 'date', type: 'date' as const }, { label: '统计范围', model: 'range', type: 'select' as const, options: ['全科', '分区', '院区'] }, { label: '重点说明', model: 'memo', type: 'textarea' as const }],
  reviewAction: '指标复核', reviewDialogTitle: '运营指标复核', reviewFields: [{ label: '复核指标', model: 'metric' }, { label: '复核结论', model: 'result', type: 'select' as const, options: ['通过', '退回重算', '生成改进'] }, { label: '意见', model: 'memo', type: 'textarea' as const }],
  traceTitle: '运营总览追溯', traceRows: makeTrace('BOARD-OV', '运营总览'), traceColumns,
  closureTables: 'schedule_bed / dialysis_session / warning_event / dashboard_snapshot',
  closureText: '输入排班、治疗、预警、设备、水质、库存和待办数据；输出科室运行态势、风险入口、日报快照和责任处理任务。',
};
</script>
<template><FunctionModulePage v-bind="cfg" /></template>
