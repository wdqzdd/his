<script setup lang="ts">
import FunctionModulePage from './FunctionModulePage.vue';
import { commonColumns, makeRowsFromTargets, makeStats, makeTrace, traceColumns } from './functionPageHelpers';
import type { PageContext } from '../types';
defineProps<{ context: PageContext }>();
const targets = ['系统菜单维护', '工作站菜单维护', '菜单排序', '菜单启用 / 停用', '菜单图标配置', '菜单权限绑定'];
const rows = makeRowsFromTargets('SYS-MENU', '菜单管理', '入口配置', targets, '系统管理员', ['维护系统菜单', '维护工作站菜单', '调整排序', '启停菜单', '配置图标', '绑定权限']);
const cfg = { title: '菜单管理', subtitle: '维护系统菜单、工作站菜单、排序、启停、图标和权限绑定，确保入口、路由和授权一致。', flowText: '菜单配置 -> 排序图标 -> 权限绑定 -> 角色授权 -> 工作站生效', filters: [{ label: '菜单范围', placeholder: '全部范围', type: 'select' as const, options: ['系统菜单', '工作站菜单'] }, { label: '工作站', placeholder: '全部工作站', type: 'select' as const, options: ['医生站', '护士站', '导诊台', '系统管理', 'CRC站'] }, { label: '状态', placeholder: '全部状态', type: 'select' as const, options: ['启用', '停用', '待复核'] }, { label: '关键字', placeholder: '菜单、路由、权限码、图标' }], stats: makeStats('菜单功能项', rows), rows, columns: commonColumns, primaryAction: '新增/维护菜单', primaryDialogTitle: '维护系统与工作站菜单', primaryFields: [{ label: '菜单名称', model: 'name' }, { label: '菜单范围', model: 'scope', type: 'select' as const, options: ['系统菜单', '工作站菜单'] }, { label: '路由Key', model: 'route' }, { label: '排序号', model: 'sortNo' }, { label: '菜单图标', model: 'icon' }, { label: '权限码', model: 'perm' }], reviewAction: '菜单复核', reviewDialogTitle: '菜单发布复核', reviewFields: [{ label: '复核结论', model: 'result', type: 'select' as const, options: ['发布', '退回', '停用'] }, { label: '影响角色', model: 'roles', type: 'textarea' as const }, { label: '入口影响', model: 'impact', type: 'textarea' as const }], traceTitle: '菜单管理审计', traceRows: makeTrace('SYS-MENU', '菜单管理'), traceColumns, closureTables: 'sys_menu / sys_menu_sort / sys_menu_icon / sys_permission / sys_role_menu / station_menu', closureText: '输入系统菜单、工作站功能和路由配置；输出菜单入口、排序图标、角色授权、按钮权限和路由上下文。' };
</script>
<template><FunctionModulePage v-bind="cfg" /></template>
