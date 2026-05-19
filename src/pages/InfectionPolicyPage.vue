<script setup lang="ts">
import FunctionModulePage from './FunctionModulePage.vue';
import { makeStats, makeTrace, traceColumns } from './functionPageHelpers';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

const rows = [
  { id: 'IC-POL-001', policyTitle: '血透中心手卫生管理制度', category: '制度查询', version: 'V2026.05', knowledgeTopic: '五个时刻/依从率', studyScope: '医生、护士、技师', studyRate: '96%', status: '已发布', owner: '院感科', time: '2026-05-01 09:00', nextAction: '追踪未学习人员' },
  { id: 'IC-POL-002', policyTitle: '透析导管皮肤出口护理SOP', category: '制度维护', version: 'V2026.04', knowledgeTopic: '出口评分/敷贴更换', studyScope: '护士', studyRate: '88%', status: '待复核', owner: '护士长', time: '2026-05-03 10:20', nextAction: '复核后发布学习' },
  { id: 'IC-POL-003', policyTitle: '透析导管连接无菌操作规范', category: '制度学习', version: 'V2026.03', knowledgeTopic: '无菌屏障/连接步骤', studyScope: '护士、医生', studyRate: '91%', status: '已发布', owner: '感控专员', time: '2026-05-05 14:00', nextAction: '关联导管操作培训' },
  { id: 'IC-POL-004', policyTitle: '透析导管断开与封管规范', category: '感控知识库', version: 'V2026.03', knowledgeTopic: '封管医嘱/异常勘误', studyScope: '护士', studyRate: '86%', status: '关注', owner: '护理组长', time: '2026-05-06 15:10', nextAction: '补充案例问答' },
  { id: 'IC-POL-005', policyTitle: '内瘘穿刺与拔针感控规范', category: '制度查询', version: 'V2026.02', knowledgeTopic: 'A/V端标识/压迫止血', studyScope: '护士', studyRate: '94%', status: '已发布', owner: '感控护士', time: '2026-05-07 08:30', nextAction: '月度复训抽考' },
  { id: 'IC-POL-006', policyTitle: '隔离透析与传染病筛查制度', category: '制度维护', version: 'V2026.05', knowledgeTopic: 'HBV/HCV/HIV/梅毒', studyScope: '全员', studyRate: '98%', status: '已发布', owner: '院感科', time: '2026-05-08 09:40', nextAction: '同步排班分区规则' },
  { id: 'IC-POL-007', policyTitle: '透析机终末消毒制度', category: '制度学习', version: 'V2026.01', knowledgeTopic: '消毒剂浓度/签名', studyScope: '技师、护士', studyRate: '84%', status: '待处理', owner: '设备技师', time: '2026-05-09 11:10', nextAction: '推送补学任务' },
  { id: 'IC-POL-008', policyTitle: '医疗废物与锐器盒处置知识库', category: '感控知识库', version: 'V2026.02', knowledgeTopic: '锐器盒更换/交接', studyScope: '护士、保洁', studyRate: '90%', status: '已发布', owner: '感控专员', time: '2026-05-10 13:30', nextAction: '纳入新员工培训' },
  { id: 'IC-POL-009', policyTitle: '水处理间感控门禁制度', category: '制度查询', version: 'V2026.04', knowledgeTopic: '授权进入/巡检记录', studyScope: '技师', studyRate: '100%', status: '已关闭', owner: '设备组长', time: '2026-05-11 16:00', nextAction: '按季度复审' },
  { id: 'IC-POL-010', policyTitle: '感控问题整改复核制度', category: '制度维护', version: '草稿', knowledgeTopic: '整改期限/复核关闭', studyScope: '感控专员、护士长', studyRate: '待发布', status: '草稿', owner: '院感科', time: '2026-05-12 10:30', nextAction: '提交制度复核' },
];

const columns = [
  { prop: 'policyTitle', label: '制度/知识库标题', minWidth: 210, fixed: 'left' as const },
  { prop: 'category', label: '功能类型', width: 115, tag: true },
  { prop: 'version', label: '版本', width: 95 },
  { prop: 'knowledgeTopic', label: '知识库主题', minWidth: 165 },
  { prop: 'studyScope', label: '学习范围', minWidth: 140 },
  { prop: 'studyRate', label: '学习完成率', width: 110 },
  { prop: 'status', label: '状态', width: 95, tag: true },
  { prop: 'owner', label: '责任人', width: 110 },
  { prop: 'time', label: '发布时间', minWidth: 145 },
  { prop: 'nextAction', label: '下一步', minWidth: 150 },
];

const cfg = {
  title: '感控制度',
  subtitle: '补齐制度查询、制度学习、制度维护和感控知识库，支持版本发布、签收追踪和知识问答维护。',
  flowText: '制度维护 -> 复核发布 -> 制度查询/学习 -> 知识库沉淀',
  filters: [
    { label: '制度类别', placeholder: '全部类别', type: 'select' as const, options: ['手卫生', '导管出口护理', '导管连接断开', '内瘘穿刺拔针', '隔离透析', '设备消毒', '医疗废物'] },
    { label: '功能类型', placeholder: '全部类型', type: 'select' as const, options: ['制度查询', '制度学习', '制度维护', '感控知识库'] },
    { label: '状态', placeholder: '全部状态', type: 'select' as const, options: ['草稿', '待复核', '已发布', '停用'] },
    { label: '关键字', placeholder: '制度名称、版本、知识库主题' },
  ],
  stats: makeStats('制度/知识库', rows),
  rows,
  columns,
  primaryAction: '新增制度',
  primaryDialogTitle: '维护感控制度/知识库',
  primaryFields: [
    { label: '功能类型', model: 'category', type: 'select' as const, options: ['制度查询', '制度学习', '制度维护', '感控知识库'] },
    { label: '制度名称', model: 'name' },
    { label: '版本号', model: 'version' },
    { label: '适用范围', model: 'scope' },
    { label: '知识库主题', model: 'topic' },
    { label: '制度内容', model: 'content', type: 'textarea' as const },
  ],
  reviewAction: '发布学习',
  reviewDialogTitle: '制度发布与学习推送',
  reviewFields: [
    { label: '发布范围', model: 'range', type: 'select' as const, options: ['全员', '医生', '护士', '技师', '保洁'] },
    { label: '学习截止日', model: 'dueDate', type: 'date' as const },
    { label: '是否考试', model: 'exam', type: 'select' as const, options: ['需要测试', '仅签收'] },
    { label: '复核意见', model: 'memo', type: 'textarea' as const },
  ],
  traceTitle: '感控制度追溯',
  traceRows: makeTrace('IC-POL', '感控制度'),
  traceColumns,
  closureTables: 'infection_policy / policy_version / policy_study_record / infection_knowledge_base',
  closureText: '输入制度文件、SOP、感控案例和整改经验；输出可查询制度、学习任务、签收测试记录、知识库条目和审计轨迹，回流培训与统计。',
};
</script>

<template><FunctionModulePage v-bind="cfg" /></template>
