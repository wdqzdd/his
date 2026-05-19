<script setup lang="ts">
import FunctionModulePage from './FunctionModulePage.vue';
import { makeStats, makeTrace, traceColumns } from './functionPageHelpers';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

const rows = [
  { id: 'IC-RPT-001', metricName: '手卫生合格率', metricType: '合格率统计', dimension: '全科', currentValue: '92.6%', targetValue: '>=95%', trend: '下降2.1%', source: '手卫生检查 86条', status: '关注', owner: '感控专员', time: '2026-05', nextAction: '下钻不合格人员' },
  { id: 'IC-RPT-002', metricName: '导管出口护理合格率', metricType: '合格率统计', dimension: '导管患者', currentValue: '88.0%', targetValue: '>=95%', trend: '下降4.5%', source: '出口护理检查 25条', status: '异常', owner: '护士长', time: '2026-05', nextAction: '生成导管护理培训' },
  { id: 'IC-RPT-003', metricName: '导管连接不合格项', metricType: '不合格项统计', dimension: 'A区/C区', currentValue: '5项', targetValue: '<=2项', trend: '增加3项', source: '导管连接检查', status: '待处理', owner: '感控护士', time: '2026-05', nextAction: '下钻问题清单' },
  { id: 'IC-RPT-004', metricName: '导管断开封管异常', metricType: '不合格项统计', dimension: '夜班', currentValue: '3项', targetValue: '0项', trend: '持平', source: '导管断开检查', status: '待复核', owner: '主诊医生', time: '2026-05', nextAction: '复核医嘱一致性' },
  { id: 'IC-RPT-005', metricName: '内瘘穿刺合格率', metricType: '合格率统计', dimension: 'B区', currentValue: '97.4%', targetValue: '>=95%', trend: '上升1.8%', source: '内瘘穿刺检查 38条', status: '已完成', owner: '护理组长', time: '2026-05', nextAction: '归档月报' },
  { id: 'IC-RPT-006', metricName: '内瘘拔针记录完整率', metricType: '人员统计', dimension: '责任护士', currentValue: '90.2%', targetValue: '>=96%', trend: '下降3.0%', source: '拔针记录 41条', status: '关注', owner: '护理组长', time: '2026-05', nextAction: '按人员补训' },
  { id: 'IC-RPT-007', metricName: '感染筛查完成率', metricType: '科室统计', dimension: '导诊台', currentValue: '94.0%', targetValue: '100%', trend: '上升2.0%', source: '感染四项/LIS', status: '待处理', owner: '导诊护士', time: '2026-05', nextAction: '催办待回报患者' },
  { id: 'IC-RPT-008', metricName: '隔离透析制度执行率', metricType: '科室统计', dimension: '隔离区', currentValue: '98.8%', targetValue: '>=98%', trend: '稳定', source: '隔离透析检查', status: '已关闭', owner: '感控专员', time: '2026-05', nextAction: '纳入院区对比' },
  { id: 'IC-RPT-009', metricName: '培训达标率趋势', metricType: '趋势分析', dimension: '全员', currentValue: '93.0%', targetValue: '>=95%', trend: '连续2周下降', source: '培训签到/测试', status: '异常', owner: '院感科', time: '2026-05', nextAction: '生成补训计划' },
  { id: 'IC-RPT-010', metricName: '整改关闭率趋势', metricType: '趋势分析', dimension: '全科', currentValue: '86.5%', targetValue: '>=95%', trend: '下降5.6%', source: '整改复核记录', status: '异常', owner: '感控专员', time: '2026-05', nextAction: '升级CQI项目' },
];

const columns = [
  { prop: 'metricName', label: '指标名称', minWidth: 180, fixed: 'left' as const },
  { prop: 'metricType', label: '统计类型', minWidth: 125, tag: true },
  { prop: 'dimension', label: '统计维度', minWidth: 115 },
  { prop: 'currentValue', label: '当前值', width: 105 },
  { prop: 'targetValue', label: '目标值', width: 105 },
  { prop: 'trend', label: '趋势分析', minWidth: 125, tag: true },
  { prop: 'source', label: '来源记录', minWidth: 150 },
  { prop: 'status', label: '状态', width: 95, tag: true },
  { prop: 'owner', label: '责任人', width: 110 },
  { prop: 'time', label: '统计周期', width: 100 },
  { prop: 'nextAction', label: '下一步', minWidth: 150 },
];

const cfg = {
  title: '感控统计',
  subtitle: '补齐合格率统计、不合格项统计、人员统计、科室统计和趋势分析，并支持下钻原始检查/整改/培训记录。',
  flowText: '检查登记 -> 指标计算 -> 趋势分析 -> 下钻改进/CQI',
  filters: [
    { label: '统计月份', placeholder: '选择月份', type: 'month' as const },
    { label: '统计类型', placeholder: '全部类型', type: 'select' as const, options: ['合格率统计', '不合格项统计', '人员统计', '科室统计', '趋势分析'] },
    { label: '指标对象', placeholder: '全部对象', type: 'select' as const, options: ['手卫生', '导管出口护理', '导管连接', '导管断开', '内瘘穿刺', '内瘘拔针', '感染筛查', '培训', '整改'] },
    { label: '关键字', placeholder: '指标、人员、科室、来源记录' },
  ],
  stats: makeStats('感控指标', rows),
  rows,
  columns,
  primaryAction: '生成报表',
  primaryDialogTitle: '生成感控统计报表',
  primaryFields: [
    { label: '统计周期', model: 'period', type: 'date' as const },
    { label: '统计类型', model: 'metricType', type: 'select' as const, options: ['合格率统计', '不合格项统计', '人员统计', '科室统计', '趋势分析'] },
    { label: '报表范围', model: 'range' },
    { label: '口径说明', model: 'memo', type: 'textarea' as const },
  ],
  reviewAction: '下钻改进',
  reviewDialogTitle: '感控指标异常改进',
  reviewFields: [
    { label: '异常指标', model: 'metric' },
    { label: '下钻维度', model: 'drill', type: 'select' as const, options: ['原始检查记录', '不合格项明细', '人员明细', '科室明细', '培训记录', '整改复核记录'] },
    { label: '改进动作', model: 'task', type: 'select' as const, options: ['生成整改', '生成培训', '升级CQI', '推送员工待办'] },
    { label: '整改要求', model: 'memo', type: 'textarea' as const },
  ],
  traceTitle: '感控统计追溯',
  traceRows: makeTrace('IC-RPT', '感控统计'),
  traceColumns,
  closureTables: 'infection_check / infection_issue / infection_rectification / infection_training_attendance / report_metric_value',
  closureText: '输入检查、登记、整改、复核、培训签到测试和感染事件；输出合格率、不合格项、人员、科室与趋势指标，可下钻原始记录并生成整改、培训、CQI和统计报表。',
};
</script>

<template><FunctionModulePage v-bind="cfg" /></template>
