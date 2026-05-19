<script setup lang="ts">
import FunctionModulePage from './FunctionModulePage.vue';
import { commonColumns, makeRows, makeStats, makeTrace, traceColumns } from './functionPageHelpers';
import type { PageContext } from '../types';
defineProps<{ context: PageContext }>();
const rows = makeRows('HOME-SAS', '居家专科评估', '血透专科自评', ['透析充分性症状', '通路观察', '干体重反馈', '营养状态'], '居家患者', ['提交专科评估', '上传通路照片', '等待医生审核']);
const cfg = { title: '专科病情评估', subtitle: '患者端提交血透专科评估、通路照片、干体重反馈和营养状态，供医护远程审核。', flowText: '专科自评 -> 资料上传 -> 医护审核 -> 计划调整', filters: [{ label: '评估日期', placeholder: '选择日期', type: 'date' as const }, { label: '专科类型', placeholder: '全部类型', type: 'select' as const, options: ['通路', '容量', '营养', '充分性'] }, { label: '关键字', placeholder: '通路、症状、审核' }], stats: makeStats('专科自评', rows), rows, columns: commonColumns, primaryAction: '提交评估', primaryDialogTitle: '居家专科病情评估', primaryFields: [{ label: '专科类型', model: 'type' }, { label: '观察结果', model: 'result' }, { label: '图片/说明', model: 'memo', type: 'textarea' as const }], reviewAction: '申请复核', reviewDialogTitle: '专科评估复核申请', reviewFields: [{ label: '复核对象', model: 'target' }, { label: '申请说明', model: 'memo', type: 'textarea' as const }], traceTitle: '居家专科评估追溯', traceRows: makeTrace('HOME-SAS', '居家专科病情评估'), traceColumns, closureTables: 'home_special_assessment / vascular_access / followup_record', closureText: '输入患者端专科自评和上传资料；输出医护审核任务、通路风险线索和随访计划调整。' };
</script>
<template><FunctionModulePage v-bind="cfg" /></template>
