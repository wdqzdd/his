<script setup lang="ts">
import FunctionModulePage from './FunctionModulePage.vue';
import { commonColumns, makeRowsFromTargets, makeStats, makeTrace, traceColumns } from './functionPageHelpers';
import type { PageContext } from '../types';
defineProps<{ context: PageContext }>();
const targets = ['性别字典', '状态字典', '操作类型字典', '消息类型字典', '文件类型字典', '菜单类型字典', '系统参数字典'];
const rows = makeRowsFromTargets('SYS-DICT', '系统字典', '字典管理', targets, '基础数据管理员', ['维护性别项', '维护状态项', '维护操作类型', '维护消息类型', '维护文件类型', '维护菜单类型', '维护参数分类']);
const cfg = { title: '系统字典管理', subtitle: '维护性别、状态、操作类型、消息类型、文件类型、菜单类型和系统参数字典，保证各业务页面口径一致。', flowText: '字典维护 -> 复核发布 -> 业务引用 -> 版本追踪', filters: [{ label: '字典类别', placeholder: '全部类别', type: 'select' as const, options: ['性别', '状态', '操作类型', '消息类型', '文件类型', '菜单类型', '系统参数'] }, { label: '状态', placeholder: '全部状态', type: 'select' as const, options: ['草稿', '待复核', '已发布', '已停用'] }, { label: '关键字', placeholder: '字典名称、编码、值' }], stats: makeStats('字典功能项', rows), rows, columns: commonColumns, primaryAction: '新增/维护字典', primaryDialogTitle: '维护系统字典', primaryFields: [{ label: '字典编码', model: 'code' }, { label: '字典名称', model: 'name' }, { label: '字典类别', model: 'type', type: 'select' as const, options: ['性别', '状态', '操作类型', '消息类型', '文件类型', '菜单类型', '系统参数'] }, { label: '字典值', model: 'value', type: 'textarea' as const }, { label: '引用模块', model: 'module', type: 'textarea' as const }], reviewAction: '发布复核', reviewDialogTitle: '字典发布复核', reviewFields: [{ label: '复核结论', model: 'result', type: 'select' as const, options: ['发布', '退回', '停用'] }, { label: '影响模块', model: 'module', type: 'textarea' as const }, { label: '版本说明', model: 'versionMemo', type: 'textarea' as const }], traceTitle: '系统字典审计', traceRows: makeTrace('SYS-DICT', '系统字典管理'), traceColumns, closureTables: 'sys_dict_type / sys_dict_item / sys_dict_version / sys_audit_log', closureText: '输入基础枚举、系统参数分类和编码；输出统一字典、版本发布、引用分析和业务页面标准口径。' };
</script>
<template><FunctionModulePage v-bind="cfg" /></template>
