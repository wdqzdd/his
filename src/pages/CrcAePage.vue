<script setup lang="ts">
import FunctionModulePage from './FunctionModulePage.vue';
import { makeStats, makeTrace, traceColumns } from './functionPageHelpers';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

const rows = [
  { id: 'CRC-AE-001', subjectNo: 'S-008', eventType: 'SAE记录', grade: '重度', relation: '可能相关', treatment: '暂停研究药物/住院观察', reportRecord: '申办方24h已上报', status: '待医学复核', owner: '研究医生王', nextAction: 'PI关联性判断' },
  { id: 'CRC-AE-002', subjectNo: 'S-003', eventType: 'AE记录', grade: '轻度', relation: '可能无关', treatment: '随访观察', reportRecord: '项目内记录', status: '处理中', owner: '研究护士吴', nextAction: '随访关闭' },
  { id: 'CRC-AE-003', subjectNo: 'S-002', eventType: 'AE记录', grade: '中度', relation: '相关', treatment: '调整给药时间', reportRecord: '申办方月报', status: '待复核', owner: '研究医生王', nextAction: '复核处理记录' },
  { id: 'CRC-AE-004', subjectNo: 'S-010', eventType: '退出相关AE', grade: '中度', relation: '无关', treatment: '退出访视记录', reportRecord: '伦理备案', status: '已关闭', owner: 'PI周主任', nextAction: '归档退出表' },
  { id: 'CRC-AE-005', subjectNo: 'S-014', eventType: '特殊事件', grade: '轻度', relation: '待判断', treatment: '补充病历资料', reportRecord: '待上报', status: '待处理', owner: 'CRC刘', nextAction: '研究医生判断' },
  { id: 'CRC-AE-006', subjectNo: 'S-015', eventType: 'AE记录', grade: '轻度', relation: '无关', treatment: '居家随访', reportRecord: '无需加急', status: '已完成', owner: '随访护士白', nextAction: '进入数据核查' },
  { id: 'CRC-AE-007', subjectNo: 'S-009', eventType: 'AE记录', grade: '中度', relation: '可能相关', treatment: '加做安全性检验', reportRecord: '申办方已接收', status: '关注', owner: '研究医生黄', nextAction: '复查检验' },
  { id: 'CRC-AE-008', subjectNo: 'S-013', eventType: '方案偏离伴随事件', grade: '轻度', relation: '无关', treatment: '记录偏离', reportRecord: '项目内记录', status: '已完成', owner: 'CRC郭', nextAction: '关闭偏离' },
  { id: 'CRC-AE-009', subjectNo: 'S-016', eventType: 'SAE记录', grade: '重度', relation: '待判断', treatment: '紧急处理/暂停入组', reportRecord: '待24h上报', status: '异常', owner: 'PI吴主任', nextAction: '立即上报' },
  { id: 'CRC-AE-010', subjectNo: 'S-005', eventType: 'AE记录', grade: '轻度', relation: '无关', treatment: '无需处理', reportRecord: '项目内记录', status: '已关闭', owner: 'CRC孙', nextAction: '归档' },
];

const columns = [
  { prop: 'subjectNo', label: '受试者编号', width: 120, fixed: 'left' as const },
  { prop: 'eventType', label: 'AE/SAE记录', minWidth: 150 },
  { prop: 'grade', label: '事件分级', width: 100, tag: true },
  { prop: 'relation', label: '关联性判断', minWidth: 130 },
  { prop: 'treatment', label: '处理记录', minWidth: 210 },
  { prop: 'reportRecord', label: '上报记录', minWidth: 160 },
  { prop: 'status', label: '状态', width: 110, tag: true },
  { prop: 'owner', label: '责任人', width: 120 },
  { prop: 'nextAction', label: '下一步', minWidth: 140 },
];

const cfg = {
  title: '不良事件',
  subtitle: '登记 AE记录、SAE记录、事件分级、关联性判断、处理记录和上报记录，形成医学复核闭环。',
  flowText: '事件发现 -> AE/SAE登记 -> 关联性判断 -> 上报/随访关闭',
  filters: [
    { label: '发生日期', placeholder: '选择日期', type: 'date' as const },
    { label: '事件类型', placeholder: '全部类型', type: 'select' as const, options: ['AE记录', 'SAE记录', '退出相关AE', '特殊事件'] },
    { label: '事件分级', placeholder: '全部分级', type: 'select' as const, options: ['轻度', '中度', '重度'] },
    { label: '关键字', placeholder: '受试者、事件、处理、上报' },
  ],
  stats: makeStats('AE/SAE记录', rows),
  rows,
  columns,
  primaryAction: '登记AE/SAE',
  primaryDialogTitle: '登记不良事件',
  primaryFields: [
    { label: '受试者编号', model: 'subjectNo' },
    { label: '事件类型', model: 'eventType', type: 'select' as const, options: ['AE记录', 'SAE记录', '特殊事件'] },
    { label: '事件分级', model: 'grade', type: 'select' as const, options: ['轻度', '中度', '重度'] },
    { label: '处理记录', model: 'treatment', type: 'textarea' as const },
    { label: '上报记录', model: 'reportRecord', type: 'textarea' as const, placeholder: '申办方、伦理、药监、项目内记录及时间' },
  ],
  reviewAction: '医学复核',
  reviewDialogTitle: 'AE/SAE医学复核',
  reviewFields: [
    { label: '关联性判断', model: 'relation', type: 'select' as const, options: ['相关', '可能相关', '可能无关', '无关', '待判断'] },
    { label: 'SAE上报结论', model: 'reportResult', type: 'select' as const, options: ['已上报', '无需上报', '补充资料', '升级处理'] },
    { label: '随访结局', model: 'outcome', type: 'textarea' as const },
  ],
  traceTitle: '不良事件审计',
  traceRows: makeTrace('CRC-AE', 'AE/SAE登记、分级、关联性判断、处理和上报'),
  traceColumns,
  closureTables: 'crc_ae_record / crc_sae_report / crc_ae_treatment / crc_medical_review / crc_sponsor_report',
  closureText: '输入访视表单、临床事件和研究药物状态；输出 AE/SAE记录、事件分级、关联性判断、处理记录、上报记录和随访关闭结果。',
};
</script>

<template><FunctionModulePage v-bind="cfg" /></template>
