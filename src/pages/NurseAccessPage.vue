<script setup lang="ts">
import FunctionModulePage from './FunctionModulePage.vue';
import { commonColumns, makeRows, makeStats, makeTrace, traceColumns } from './functionPageHelpers';
import type { PageContext } from '../types';
defineProps<{ context: PageContext }>();
const rows = makeRows('NUR-ACC', '护理通路操作', '血管通路', ['穿刺记录', '导管连接', '拔针压迫', '通路异常'], '责任护士', ['记录穿刺', '连接核对', '上报事件']);
const cfg = { title: '血管通路', subtitle: '护士侧记录穿刺、导管连接/断开、拔针压迫、通路异常和上机核对结果。', flowText: '通路核对 -> 穿刺连接 -> 异常上报 -> 医生复核', filters: [{ label: '操作日期', placeholder: '选择日期', type: 'date' as const }, { label: '操作类型', placeholder: '全部类型', type: 'select' as const, options: ['穿刺', '连接', '拔针', '异常'] }, { label: '关键字', placeholder: '患者、机位、通路' }], stats: makeStats('通路操作', rows), rows, columns: commonColumns, primaryAction: '记录操作', primaryDialogTitle: '护理通路操作记录', primaryFields: [{ label: '患者', model: 'patient' }, { label: '操作类型', model: 'type' }, { label: '操作记录', model: 'record', type: 'textarea' as const }], reviewAction: '异常上报', reviewDialogTitle: '通路异常上报', reviewFields: [{ label: '异常类型', model: 'type', type: 'select' as const, options: ['渗血', '堵管', '震颤减弱', '感染线索'] }, { label: '处理说明', model: 'memo', type: 'textarea' as const }], traceTitle: '护理通路追溯', traceRows: makeTrace('NUR-ACC', '护理血管通路'), traceColumns, closureTables: 'access_puncture_record / catheter_connect_record / access_event', closureText: '输入当日治疗和通路档案；输出穿刺连接记录、异常事件、医生复核任务和治疗记录引用。' };
</script>
<template><FunctionModulePage v-bind="cfg" /></template>
