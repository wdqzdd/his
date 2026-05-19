<script setup lang="ts">
import FunctionModulePage from './FunctionModulePage.vue';
import { commonColumns, makeRows, makeStats, makeTrace, traceColumns } from './functionPageHelpers';
import type { PageContext } from '../types';
defineProps<{ context: PageContext }>();
const specialtyItems = ['血液净化前评估', '血液净化过程评估', '血液净化结束后评估', '血液净化相关急性并发症记录', '血液净化离室评估', '滤器和血路凝血记录', '透析充分性评估', '容量评估', '贫血评估', '营养评估', 'CKD-MBD评估', '内瘘评估', '静脉导管评估', '再循环评估'];
const rows = makeRows('DOC-SAS', '专科评估', '血透专科', specialtyItems, '专科医生', ['提交评估', '调整处方', '生成CQI', '复查通路']);
const cfg = { title: '专科病情评估', subtitle: '医生维护透前、透中、透后、离室、急性并发症、滤器血路凝血、充分性、容量、贫血、营养、CKD-MBD、内瘘、静脉导管和再循环评估。', flowText: '专科指标 -> 评估结论 -> 处方调整 -> 疗效追踪', filters: [{ label: '评估日期', placeholder: '选择日期', type: 'date' as const }, { label: '专科类型', placeholder: '全部类型', type: 'select' as const, options: specialtyItems }, { label: '关键字', placeholder: '患者、指标、结论' }], stats: makeStats('专科评估', rows), rows, columns: commonColumns, primaryAction: '新增评估', primaryDialogTitle: '专科病情评估表', primaryFields: [{ label: '患者', model: 'patient' }, { label: '专科指标', model: 'indicator', type: 'select' as const, options: specialtyItems }, { label: '评估结论', model: 'result', type: 'textarea' as const }, { label: '处方影响', model: 'rxEffect', type: 'textarea' as const }], reviewAction: '评估复核', reviewDialogTitle: '专科评估复核', reviewFields: [{ label: '处置建议', model: 'suggest', type: 'select' as const, options: ['调整处方', '复查检验', '复查通路', '生成CQI'] }, { label: '意见', model: 'memo', type: 'textarea' as const }], traceTitle: '专科评估追溯', traceRows: makeTrace('DOC-SAS', '专科病情评估'), traceColumns, closureTables: 'special_assessment / dialysis_prescription / cqi_project', closureText: '输入治疗、检验、通路和历史处方；输出专科评估、处方调整、疗效预警和CQI线索。' };
</script>
<template><FunctionModulePage v-bind="cfg" /></template>
