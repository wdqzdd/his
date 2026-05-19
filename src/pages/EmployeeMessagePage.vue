<script setup lang="ts">
import FunctionModulePage from './FunctionModulePage.vue';
import { commonColumns, makeRows, makeStats, makeTrace, traceColumns } from './functionPageHelpers';
import type { PageContext } from '../types';
defineProps<{ context: PageContext }>();
const rows = makeRows('EMP-MSG', '消息提醒', '消息中心', ['危急值通知', '医嘱到期', '归档催办', '培训提醒'], '当前员工', ['标记已读', '进入处理', '消息归档']);
const cfg = { title: '消息中心', subtitle: '接收站内信、系统提醒、电话升级记录和患者端回执，支持已读、归档和跳转处理。', flowText: '规则触发 -> 消息送达 -> 已读回执 -> 业务处理', filters: [{ label: '接收日期', placeholder: '选择日期', type: 'date' as const }, { label: '消息类型', placeholder: '全部类型', type: 'select' as const, options: ['危急值', '待办', '培训', '系统'] }, { label: '关键字', placeholder: '标题、来源、发送人' }], stats: makeStats('消息记录', rows), rows, columns: commonColumns, primaryAction: '发送消息', primaryDialogTitle: '发送站内消息', primaryFields: [{ label: '接收人', model: 'receiver' }, { label: '消息标题', model: 'title' }, { label: '消息内容', model: 'content', type: 'textarea' as const }], reviewAction: '消息处理', reviewDialogTitle: '消息处理与归档', reviewFields: [{ label: '处理方式', model: 'method', type: 'select' as const, options: ['标记已读', '进入业务', '归档'] }, { label: '备注', model: 'memo', type: 'textarea' as const }], traceTitle: '消息送达追溯', traceRows: makeTrace('EMP-MSG', '消息中心'), traceColumns, closureTables: 'employee_message / message_send_log / task_instance', closureText: '输入提醒规则和业务消息；输出员工消息回执、处理入口、归档状态和发送审计。' };
</script>
<template><FunctionModulePage v-bind="cfg" /></template>
