<script setup lang="ts">
import FunctionModulePage from './FunctionModulePage.vue';
import { commonColumns, makeRows, makeStats, makeTrace, traceColumns } from './functionPageHelpers';
import type { PageContext } from '../types';
defineProps<{ context: PageContext }>();
const rows = makeRows('HOME-CTR', '签约服务', '居家签约', ['签约申请', '续约申请', '解约申请', '变更医护申请', '申请状态查看'], '导诊台', ['提交申请', '查看审核状态', '导诊复核']);
const cfg = { title: '签约续约解约', subtitle: '患者端提交签约申请、续约申请、解约申请、变更医护申请，并查看申请状态。', flowText: '患者申请 -> 导诊审核 -> 责任团队调整 -> 状态回写', filters: [{ label: '申请类型', placeholder: '全部类型', type: 'select' as const, options: ['签约申请', '续约申请', '解约申请', '变更医护申请'] }, { label: '申请状态', placeholder: '全部状态', type: 'select' as const, options: ['待提交', '审核中', '已通过', '已退回'] }, { label: '关键字', placeholder: '合同、服务、医护、审核' }], stats: makeStats('签约记录', rows), rows, columns: commonColumns, primaryAction: '签约/续约申请', primaryDialogTitle: '签约服务申请', primaryFields: [{ label: '申请类型', model: 'applyType', type: 'select' as const, options: ['签约申请', '续约申请', '变更医护申请'] }, { label: '服务包/医护', model: 'package' }, { label: '申请说明', model: 'memo', type: 'textarea' as const }], reviewAction: '解约申请', reviewDialogTitle: '签约解约申请', reviewFields: [{ label: '解约原因', model: 'reason', type: 'textarea' as const }, { label: '联系人确认', model: 'contact' }], traceTitle: '签约服务追溯', traceRows: makeTrace('HOME-CTR', '签约续约解约'), traceColumns, closureTables: 'patient_contract / service_package / home_contract_apply / assignment_change_log', closureText: '输入签约和服务包资料；输出签约、续约、解约、变更医护申请，生成导诊审核任务并回写签约状态。' };
</script>
<template><FunctionModulePage v-bind="cfg" /></template>
