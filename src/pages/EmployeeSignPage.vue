<script setup lang="ts">
import FunctionModulePage from './FunctionModulePage.vue';
import { commonColumns, makeRows, makeStats, makeTrace, traceColumns } from './functionPageHelpers';
import type { PageContext } from '../types';
defineProps<{ context: PageContext }>();
const rows = makeRows('EMP-SIGN', '签名审核', '电子签名', ['透析记录单', '知情同意书', '医嘱审核', '归档记录'], '当前员工', ['确认签名', '退回修改', '查看文书']);
const cfg = { title: '签名审核', subtitle: '集中处理医生、护士、患者和复核人的电子签名请求，确保文书归档前签名完整。', flowText: '文书提交 -> 签名确认 -> 复核归档 -> 审计留痕', filters: [{ label: '申请日期', placeholder: '选择日期', type: 'date' as const }, { label: '文书类型', placeholder: '全部类型', type: 'select' as const, options: ['治疗记录', '同意书', '医嘱', '报告'] }, { label: '关键字', placeholder: '患者、文书、申请人' }], stats: makeStats('签名请求', rows), rows, columns: commonColumns, primaryAction: '签名确认', primaryDialogTitle: '电子签名确认', primaryFields: [{ label: '签名文书', model: 'doc' }, { label: '签名密码', model: 'password' }, { label: '签名意见', model: 'memo', type: 'textarea' as const }], reviewAction: '退回修改', reviewDialogTitle: '签名退回/复核', reviewFields: [{ label: '处理结论', model: 'result', type: 'select' as const, options: ['签名通过', '退回修改', '转复核'] }, { label: '意见', model: 'memo', type: 'textarea' as const }], traceTitle: '签名审计追溯', traceRows: makeTrace('EMP-SIGN', '签名审核'), traceColumns, closureTables: 'electronic_signature / document_archive / audit_log', closureText: '输入文书签名请求；输出电子签名、退回意见、归档许可和签名审计轨迹。' };
</script>
<template><FunctionModulePage v-bind="cfg" /></template>
