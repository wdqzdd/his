<script setup lang="ts">
import FunctionModulePage from './FunctionModulePage.vue';
import { commonColumns, makeRows, makeStats, makeTrace, traceColumns } from './functionPageHelpers';
import type { PageContext } from '../types';
defineProps<{ context: PageContext }>();
const rows = makeRows('HOME-CAS', '居家常见评估', '患者自评', ['血压', '体重', '症状', '用药依从'], '居家患者', ['提交自评', '上传图片', '等待审核']);
const cfg = { title: '常见病情评估', subtitle: '患者端提交血压、体重、症状、用药依从等常见评估，异常进入随访护士审核。', flowText: '患者自评 -> 异常识别 -> 护士审核 -> 医生复核', filters: [{ label: '评估日期', placeholder: '选择日期', type: 'date' as const }, { label: '评估类型', placeholder: '全部类型', type: 'select' as const, options: ['血压', '体重', '症状', '用药'] }, { label: '关键字', placeholder: '指标、症状、审核状态' }], stats: makeStats('自评记录', rows), rows, columns: commonColumns, primaryAction: '提交自评', primaryDialogTitle: '居家常见病情自评', primaryFields: [{ label: '评估类型', model: 'type' }, { label: '指标值', model: 'value' }, { label: '症状说明', model: 'memo', type: 'textarea' as const }], reviewAction: '提交审核', reviewDialogTitle: '常见评估审核申请', reviewFields: [{ label: '审核对象', model: 'target' }, { label: '补充说明', model: 'memo', type: 'textarea' as const }], traceTitle: '居家常见评估追溯', traceRows: makeTrace('HOME-CAS', '居家常见病情评估'), traceColumns, closureTables: 'home_common_assessment / home_review_task / warning_event', closureText: '输入患者端自评数据；输出居家评估记录、异常预警、随访审核和医生复核任务。' };
</script>
<template><FunctionModulePage v-bind="cfg" /></template>
