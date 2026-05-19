<script setup lang="ts">
import FunctionModulePage from './FunctionModulePage.vue';
import { commonColumns, makeRows, makeStats, makeTrace, traceColumns } from './functionPageHelpers';
import type { PageContext } from '../types';
defineProps<{ context: PageContext }>();
const rows = makeRows('HOME-TEAM', '专家团队', '居家团队', ['专家团队', '首席专家', '主诊教授', '主治医师', '住院医师', '责任护士', '团队成员简介'], '随访团队', ['查看团队简介', '申请咨询', '调整联系人']);
const cfg = { title: '我的专家团队', subtitle: '展示专家团队、首席专家、主诊教授、主治医师、住院医师、责任护士和团队成员简介。', flowText: '签约归属 -> 团队层级展示 -> 咨询申请 -> 随访回写', filters: [{ label: '团队角色', placeholder: '全部角色', type: 'select' as const, options: ['首席专家', '主诊教授', '主治医师', '住院医师', '责任护士'] }, { label: '服务状态', placeholder: '全部状态', type: 'select' as const, options: ['服务中', '待回复', '已结束'] }, { label: '关键字', placeholder: '团队成员、简介、服务包' }], stats: makeStats('团队记录', rows), rows, columns: commonColumns, primaryAction: '申请咨询', primaryDialogTitle: '专家团队咨询申请', primaryFields: [{ label: '咨询对象', model: 'doctor', type: 'select' as const, options: ['首席专家', '主诊教授', '主治医师', '住院医师', '责任护士'] }, { label: '问题类型', model: 'type' }, { label: '问题描述', model: 'desc', type: 'textarea' as const }], reviewAction: '服务评价', reviewDialogTitle: '团队服务评价', reviewFields: [{ label: '满意度', model: 'rate', type: 'select' as const, options: ['满意', '一般', '不满意'] }, { label: '评价内容', model: 'memo', type: 'textarea' as const }], traceTitle: '专家团队追溯', traceRows: makeTrace('HOME-TEAM', '专家团队'), traceColumns, closureTables: 'care_team / care_team_member / patient_assignment / home_consult / followup_record', closureText: '输入签约归属和责任团队；输出患者端团队层级、成员简介、咨询任务和随访记录。' };
</script>
<template><FunctionModulePage v-bind="cfg" /></template>
