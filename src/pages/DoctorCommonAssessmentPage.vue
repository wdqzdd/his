<script setup lang="ts">
import FunctionModulePage from './FunctionModulePage.vue';
import { commonColumns, makeRows, makeStats, makeTrace, traceColumns } from './functionPageHelpers';
import type { PageContext } from '../types';
defineProps<{ context: PageContext }>();
const assessmentItems = ['生命体征', '身高体重', '微量血糖', '24小时尿量', '一般情况评估', '体格检查', '家族史', '月经史', '饮酒史', '吸烟史', '药物滥用史', '工作状态', '生活自理能力', '睡眠状态', '疼痛评分', 'VTE风险评估', '出血风险评估', '量表评估', '期内次数统计'];
const rows = makeRows('DOC-CAS', '常见评估', '常见病情', assessmentItems, '主诊医生', ['提交评估', '生成建议', '进入处方', '生成预警']);
const cfg = { title: '常见病情评估', subtitle: '医生维护生命体征、身高体重、微量血糖、24小时尿量、体格检查、病史、生活方式、疼痛、VTE、出血风险、量表和期内次数统计。', flowText: '责任患者 -> 常见评估 -> 风险标记 -> 医嘱处方', filters: [{ label: '评估日期', placeholder: '选择日期', type: 'date' as const }, { label: '评估类型', placeholder: '全部类型', type: 'select' as const, options: assessmentItems }, { label: '关键字', placeholder: '患者、评估、风险' }], stats: makeStats('评估记录', rows), rows, columns: commonColumns, primaryAction: '新增评估', primaryDialogTitle: '常见病情评估表', primaryFields: [{ label: '患者', model: 'patient' }, { label: '评估类型', model: 'type', type: 'select' as const, options: assessmentItems }, { label: '评估结论', model: 'result', type: 'textarea' as const }, { label: '期内次数统计', model: 'countSummary', type: 'textarea' as const }], reviewAction: '评估复核', reviewDialogTitle: '常见评估复核', reviewFields: [{ label: '复核结论', model: 'result', type: 'select' as const, options: ['通过', '补充', '生成预警'] }, { label: '意见', model: 'memo', type: 'textarea' as const }], traceTitle: '常见评估追溯', traceRows: makeTrace('DOC-CAS', '常见病情评估'), traceColumns, closureTables: 'common_assessment / diagnosis_record / order_plan', closureText: '输入责任患者、病史、体征、生活方式、量表和检验；输出常见评估结论、风险标记、诊断和处方依据。' };
</script>
<template><FunctionModulePage v-bind="cfg" /></template>
