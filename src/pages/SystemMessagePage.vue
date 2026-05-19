<script setup lang="ts">
import FunctionModulePage from './FunctionModulePage.vue';
import { commonColumns, makeRowsFromTargets, makeStats, makeTrace, traceColumns } from './functionPageHelpers';
import type { PageContext } from '../types';
defineProps<{ context: PageContext }>();
const targets = ['短信模板', '微信模板', '系统消息模板', '任务提醒模板', '预警通知模板', '模板启用 / 停用'];
const rows = makeRowsFromTargets('SYS-MSG', '消息模板', '模板管理', targets, '系统管理员', ['维护短信模板', '维护微信模板', '维护系统消息', '维护任务提醒', '维护预警通知', '启停模板']);
const cfg = { title: '消息模板管理', subtitle: '维护短信、微信、系统消息、任务提醒、预警通知模板及模板启停，支持变量、测试发送和发布复核。', flowText: '模板维护 -> 测试发送 -> 启停复核 -> 发布启用 -> 发送审计', filters: [{ label: '模板类型', placeholder: '全部类型', type: 'select' as const, options: ['短信', '微信', '系统消息', '任务提醒', '预警通知'] }, { label: '状态', placeholder: '全部状态', type: 'select' as const, options: ['草稿', '待复核', '已发布', '已停用'] }, { label: '关键字', placeholder: '模板名称、变量、场景、渠道' }], stats: makeStats('模板功能项', rows), rows, columns: commonColumns, primaryAction: '新增/维护模板', primaryDialogTitle: '维护消息模板', primaryFields: [{ label: '模板名称', model: 'name' }, { label: '模板类型', model: 'type', type: 'select' as const, options: ['短信', '微信', '系统消息', '任务提醒', '预警通知'] }, { label: '变量定义', model: 'vars' }, { label: '模板内容', model: 'content', type: 'textarea' as const }, { label: '启停状态', model: 'status', type: 'select' as const, options: ['启用', '停用', '待复核'] }], reviewAction: '模板复核', reviewDialogTitle: '消息模板复核', reviewFields: [{ label: '测试接收人', model: 'receiver' }, { label: '测试回执', model: 'testResult' }, { label: '复核结论', model: 'result', type: 'select' as const, options: ['发布', '退回', '停用'] }, { label: '意见', model: 'memo', type: 'textarea' as const }], traceTitle: '消息模板审计', traceRows: makeTrace('SYS-MSG', '消息模板管理'), traceColumns, closureTables: 'message_template / message_template_version / message_send_log / sys_audit_log', closureText: '输入消息模板、渠道和变量配置；输出短信/微信/系统消息/任务/预警提醒内容、测试回执、发布版本和发送审计。' };
</script>
<template><FunctionModulePage v-bind="cfg" /></template>
