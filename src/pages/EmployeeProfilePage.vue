<script setup lang="ts">
import FunctionModulePage from './FunctionModulePage.vue';
import { commonColumns, makeRows, makeStats, makeTrace, traceColumns } from './functionPageHelpers';
import type { PageContext } from '../types';
defineProps<{ context: PageContext }>();
const rows = makeRows('EMP-PRO', '员工资料', '个人资料', ['基本信息', '执业资质', '证书证件', '签名配置'], '当前员工', ['维护资料', '上传证书', '提交复核']);
const cfg = { title: '员工资料', subtitle: '维护当前员工基本信息、执业资质、证书证件、电子签名和联系方式，变更后需复核留痕。', flowText: '资料维护 -> 资质复核 -> 权限生效 -> 审计留痕', filters: [{ label: '资料类型', placeholder: '全部类型', type: 'select' as const, options: ['基本信息', '资质', '证书', '签名'] }, { label: '状态', placeholder: '全部状态', type: 'select' as const, options: ['有效', '待复核', '即将到期'] }, { label: '关键字', placeholder: '姓名、证书、岗位' }], stats: makeStats('资料项目', rows), rows, columns: commonColumns, primaryAction: '维护资料', primaryDialogTitle: '维护员工资料', primaryFields: [{ label: '资料项', model: 'item' }, { label: '新内容', model: 'content' }, { label: '变更说明', model: 'reason', type: 'textarea' as const }], reviewAction: '资料复核', reviewDialogTitle: '员工资料复核', reviewFields: [{ label: '复核结论', model: 'result', type: 'select' as const, options: ['通过', '退回', '停用资质'] }, { label: '复核意见', model: 'memo', type: 'textarea' as const }], traceTitle: '员工资料追溯', traceRows: makeTrace('EMP-PRO', '员工资料'), traceColumns, closureTables: 'staff_profile / staff_certificate / electronic_signature / sys_audit_log', closureText: '输入员工资料和资质证件变更；输出复核记录、岗位可用性、签名配置和审计日志。' };
</script>
<template><FunctionModulePage v-bind="cfg" /></template>
