<script setup lang="ts">
import ReportModuleView from './ReportModuleView.vue';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

const filters = [
  { label: '统计月份', placeholder: '选择月份', type: 'month' as const },
  { label: '质控类别', placeholder: '全部类别', type: 'select' as const, options: ['充分性', '护理质量', '文书质量', '通路质量', '设备质量'] },
  { label: '状态', placeholder: '全部状态', type: 'select' as const, options: ['达标', '关注', '异常'] },
  { label: '关键字', placeholder: '指标、CQI、责任人' },
];

const rows = [
  { id: 'QLT-RPT-001', metric: 'Kt/V 达标率', dimension: '维持透析患者', value: '88.2%', target: '>=90%', trend: '-2.8%', status: '异常', source: 'dialysis_session, efficacy_evaluation', owner: '医生站', drill: 46, nextAction: '生成CQI' },
  { id: 'QLT-RPT-002', metric: '透中低血压发生率', dimension: '本月治疗', value: '6.4%', target: '<=5%', trend: '+0.8%', status: '异常', source: 'dialysis_monitor, nursing_record', owner: '护士站', drill: 71, nextAction: '生成护理改进' },
  { id: 'QLT-RPT-003', metric: '治疗记录完整率', dimension: '归档审核', value: '94.2%', target: '>=98%', trend: '-2.1%', status: '异常', source: 'dialysis_archive', owner: '护士长', drill: 81, nextAction: '归档缺项改进' },
  { id: 'QLT-RPT-004', metric: '处方审核通过率', dimension: '医生医嘱', value: '97.6%', target: '>=98%', trend: '+0.2%', status: '关注', source: 'order_review_log', owner: '医生站', drill: 22, nextAction: '复核未通过原因' },
  { id: 'QLT-RPT-005', metric: '通路评估及时率', dimension: '30天评估', value: '92.8%', target: '>=95%', trend: '-1.3%', status: '关注', source: 'vascular_access_assess', owner: '通路小组', drill: 37, nextAction: '催办评估' },
  { id: 'QLT-RPT-006', metric: '危急值处置及时率', dimension: '检验危急值', value: '96.7%', target: '100%', trend: '+1.2%', status: '关注', source: 'warning_handle_log', owner: '检验科/医生站', drill: 6, nextAction: '催办未闭环' },
  { id: 'QLT-RPT-007', metric: '设备放行合格率', dimension: '上机前', value: '99.1%', target: '100%', trend: '+0.4%', status: '关注', source: 'device_release_check', owner: '技师站', drill: 5, nextAction: '复核异常设备' },
  { id: 'QLT-RPT-008', metric: 'CQI按期关闭率', dimension: '改进项目', value: '86.4%', target: '>=90%', trend: '+3.1%', status: '关注', source: 'cqi_project', owner: '质量管理组', drill: 9, nextAction: '催办复查' },
  { id: 'QLT-RPT-009', metric: '透析充分性复查率', dimension: 'Kt/V异常患者', value: '78.0%', target: '>=85%', trend: '-4.0%', status: '异常', source: 'effect_review_log', owner: '主诊医生', drill: 18, nextAction: '复查提醒' },
  { id: 'QLT-RPT-010', metric: '护理双人核对率', dimension: '高风险医嘱', value: '99.6%', target: '100%', trend: '+0.1%', status: '关注', source: 'nursing_double_check', owner: '护士站', drill: 4, nextAction: '补签核对' },
  { id: 'QLT-RPT-011', metric: '贫血管理', dimension: 'Hb+铁剂/ESA', value: '84.5%', target: '>=88%', trend: '-2.0%', status: '异常', source: 'lab_result, anemia_plan, medical_order', owner: '医生站', drill: 54, nextAction: '生成贫血管理CQI' },
  { id: 'QLT-RPT-012', metric: '容量管理', dimension: '干体重+透中低血压', value: '91.0%', target: '>=94%', trend: '-1.6%', status: '关注', source: 'volume_assessment, dialysis_monitor', owner: '医生站/护士站', drill: 39, nextAction: '复核容量评估' },
  { id: 'QLT-RPT-013', metric: '营养管理', dimension: 'Alb+nPCR+宣教', value: '89.2%', target: '>=90%', trend: '+0.4%', status: '关注', source: 'lab_result, nutrition_assessment, education_record', owner: '随访团队', drill: 33, nextAction: '安排营养宣教' },
  { id: 'QLT-RPT-014', metric: '骨矿物质管理', dimension: 'Ca/P/PTH', value: '78.6%', target: '>=85%', trend: '-3.5%', status: '异常', source: 'lab_result, ckdmdb_assessment', owner: '专科医生', drill: 62, nextAction: '调整用药与饮食' },
  { id: 'QLT-RPT-015', metric: '血管通路管理', dimension: '通路评估+事件', value: '92.8%', target: '>=95%', trend: '-1.3%', status: '关注', source: 'vascular_access_assess, vascular_access_event', owner: '通路小组', drill: 37, nextAction: '催办通路评估' },
  { id: 'QLT-RPT-016', metric: '质控KPI统计', dimension: '月度KPI', value: '14/18达标', target: '全部达标', trend: '+2项', status: '关注', source: 'report_metric_value, cqi_project', owner: '质量管理组', drill: 18, nextAction: '下钻未达标KPI' },
  { id: 'QLT-RPT-017', metric: '质量管理报告', dimension: '月报发布', value: '复核中', target: '每月10日前发布', trend: '提前1天', status: '关注', source: 'report_snapshot, quality_meeting_record', owner: '质量管理组', drill: 1, nextAction: '提交质量月报' },
];

const stats = [
  { label: '质控指标', value: rows.length, tone: 'blue' as const },
  { label: '异常指标', value: rows.filter((item) => item.status === '异常').length, tone: 'red' as const },
  { label: '关注指标', value: rows.filter((item) => item.status === '关注').length, tone: 'orange' as const },
  { label: '下钻记录', value: rows.reduce((sum, item) => sum + Number(item.drill), 0), tone: 'green' as const },
  { label: '待CQI', value: 6, tone: 'blue' as const },
];

const columns = [
  { prop: 'metric', label: '指标名称', minWidth: 170, fixed: 'left' as const },
  { prop: 'dimension', label: '统计维度', minWidth: 130 },
  { prop: 'value', label: '指标值', width: 100 },
  { prop: 'target', label: '目标', minWidth: 110 },
  { prop: 'trend', label: '趋势', width: 90 },
  { prop: 'status', label: '状态', width: 90, tag: true },
  { prop: 'source', label: '来源表', minWidth: 190 },
  { prop: 'owner', label: '责任方', minWidth: 130 },
  { prop: 'drill', label: '下钻数', width: 90 },
  { prop: 'nextAction', label: '下一步', minWidth: 150 },
];

const drillRows = [
  { object: '疗效记录', code: 'EFF-202605-008', name: 'Kt/V未达标', source: 'efficacy_evaluation', owner: '医生站', status: '异常' },
  { object: '护理事件', code: 'NUR-20260514-021', name: '透中低血压', source: 'nursing_record', owner: '护士长', status: '待复核' },
  { object: '归档记录', code: 'ARCH-20260514-041', name: '记录缺项', source: 'dialysis_archive', owner: '责任护士', status: '待补录' },
  { object: 'CQI项目', code: 'CQI-202605-003', name: '文书质量改进', source: 'cqi_project', owner: '质量管理组', status: '处理中' },
];
const drillColumns = [
  { prop: 'object', label: '对象', width: 100 },
  { prop: 'code', label: '编号', minWidth: 150 },
  { prop: 'name', label: '名称', minWidth: 150 },
  { prop: 'source', label: '来源', minWidth: 160 },
  { prop: 'owner', label: '责任人', width: 120 },
  { prop: 'status', label: '状态', width: 100, tag: true },
];
</script>

<template>
  <ReportModuleView
    title="质控统计"
    subtitle="汇总贫血、容量、营养、骨矿物质、透析充分性、血管通路、护理、文书、设备、质控KPI和质量管理报告，异常指标可直接生成改进任务。"
    flow-text="业务记录 -> 质控指标 -> 异常下钻 -> CQI改进"
    :filters="filters"
    :stats="stats"
    :rows="rows"
    :columns="columns"
    :drill-rows="drillRows"
    :drill-columns="drillColumns"
    snapshot-title="生成质控统计快照"
    :snapshot-fields="[
      { label: '统计周期', model: 'period', type: 'date', placeholder: '选择日期' },
      { label: '质控类别', model: 'category', type: 'select', options: ['全部', '疗效', '护理', '文书', '通路', '设备'], placeholder: '选择类别' },
      { label: '计算口径', model: 'standard', type: 'textarea', placeholder: '说明达标、异常和下钻口径' },
    ]"
    export-title="导出质控统计"
    :export-fields="[
      { label: '导出范围', model: 'range', type: 'select', options: ['汇总指标', '异常明细', 'CQI项目', '责任清单'], placeholder: '选择范围' },
      { label: '用途', model: 'usage', type: 'select', options: ['科室质控会', '院级上报', '内部追踪'], placeholder: '选择用途' },
    ]"
    improvement-title="生成质控改进任务"
    :improvement-fields="[
      { label: '改进类型', model: 'type', type: 'select', options: ['疗效CQI', '护理改进', '文书补录', '通路复查', '设备复测'], placeholder: '选择类型' },
      { label: '责任人', model: 'owner', placeholder: '质量管理组/护士长/医生站' },
      { label: '整改要求', model: 'task', type: 'textarea', placeholder: '填写整改、复查和关闭标准' },
    ]"
    closure-tables="report_metric_value / efficacy_evaluation / nursing_record / cqi_project"
    closure-text="输入治疗、医嘱、检验、护理、通路、设备、评估和 CQI 数据；输出贫血/容量/营养/骨矿物质/充分性/通路等质控快照、KPI未达标下钻、改进任务和质量管理报告。"
  />
</template>
