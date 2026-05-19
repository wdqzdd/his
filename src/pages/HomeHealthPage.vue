<script setup lang="ts">
import FunctionModulePage from './FunctionModulePage.vue';
import { commonColumns, makeRows, makeStats, makeTrace, traceColumns } from './functionPageHelpers';
import type { PageContext } from '../types';
defineProps<{ context: PageContext }>();
const rows = makeRows('HOME-HEALTH', '健康档案', '居家档案', ['检验结果', '检查结果', '医疗护理建议', '健康报告', '趋势图', '透析记录查看'], '主诊医生', ['查看档案', '申请解读', '查看趋势']);
const cfg = { title: '健康档案', subtitle: '患者端查看检验结果、检查结果、医疗护理建议、健康报告、趋势图和透析记录。', flowText: '临床归档 -> 健康档案 -> 患者查看 -> 异常反馈', filters: [{ label: '档案类型', placeholder: '全部类型', type: 'select' as const, options: ['检验结果', '检查结果', '医疗护理建议', '健康报告', '趋势图', '透析记录'] }, { label: '时间', placeholder: '选择月份', type: 'month' as const }, { label: '关键字', placeholder: '指标、报告、医生、建议' }], stats: makeStats('档案记录', rows), rows, columns: commonColumns, primaryAction: '补充档案', primaryDialogTitle: '健康档案补充', primaryFields: [{ label: '档案类型', model: 'type', type: 'select' as const, options: ['检验结果', '检查结果', '医疗护理建议', '健康报告', '透析记录'] }, { label: '补充内容', model: 'content', type: 'textarea' as const }], reviewAction: '申请解读', reviewDialogTitle: '健康档案解读申请', reviewFields: [{ label: '解读对象', model: 'target' }, { label: '疑问说明', model: 'memo', type: 'textarea' as const }], traceTitle: '健康档案追溯', traceRows: makeTrace('HOME-HEALTH', '健康档案'), traceColumns, closureTables: 'health_record / dialysis_archive / lab_result / exam_report / health_report', closureText: '输入治疗归档、检验检查、医疗护理建议和健康报告；输出患者端趋势查看、透析记录查看、解读申请和医护审核任务。' };
</script>
<template><FunctionModulePage v-bind="cfg" /></template>
