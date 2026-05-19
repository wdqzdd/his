<script setup lang="ts">
import FunctionModulePage from './FunctionModulePage.vue';
import { commonColumns, makeRows, makeStats, makeTrace, traceColumns } from './functionPageHelpers';
import type { PageContext } from '../types';
defineProps<{ context: PageContext }>();
const rows = makeRows('DOC-ACC', '医生通路评估', '血管通路', ['内瘘', '导管', '人工血管', '通路事件'], '主诊医生', ['建立通路', '启用评估', '废弃退出']);
const cfg = { title: '血管通路', subtitle: '医生侧维护血管通路建立、启用、评估、事件、废弃退出和处方引用状态。', flowText: '通路建立 -> 医生评估 -> 处方引用 -> 事件追踪', filters: [{ label: '评估日期', placeholder: '选择日期', type: 'date' as const }, { label: '通路类型', placeholder: '全部类型', type: 'select' as const, options: ['内瘘', '导管', '人工血管'] }, { label: '关键字', placeholder: '患者、通路、风险' }], stats: makeStats('通路记录', rows), rows, columns: commonColumns, primaryAction: '建立通路', primaryDialogTitle: '医生通路建档/评估', primaryFields: [{ label: '患者', model: 'patient' }, { label: '通路类型', model: 'type' }, { label: '医学评估', model: 'assessment', type: 'textarea' as const }], reviewAction: '启用复核', reviewDialogTitle: '通路启用复核', reviewFields: [{ label: '启用结论', model: 'result', type: 'select' as const, options: ['启用', '暂缓', '废弃'] }, { label: '复核意见', model: 'memo', type: 'textarea' as const }], traceTitle: '医生通路追溯', traceRows: makeTrace('DOC-ACC', '医生血管通路'), traceColumns, closureTables: 'vascular_access / access_assessment / dialysis_prescription', closureText: '输入患者通路资料和评估；输出可用通路、处方引用、风险状态和通路事件追踪。' };
</script>
<template><FunctionModulePage v-bind="cfg" /></template>
