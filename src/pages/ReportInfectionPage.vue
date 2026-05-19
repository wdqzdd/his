<script setup lang="ts">
import ReportModuleView from './ReportModuleView.vue';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

const filters = [
  { label: '统计月份', placeholder: '选择月份', type: 'month' as const },
  { label: '感控类别', placeholder: '全部类别', type: 'select' as const, options: ['手卫生', '通路操作', '隔离透析', '培训', '整改'] },
  { label: '状态', placeholder: '全部状态', type: 'select' as const, options: ['达标', '关注', '异常'] },
  { label: '关键字', placeholder: '检查项、责任人、分区' },
];

const rows = [
  { id: 'INF-RPT-001', metric: '手卫生依从率', dimension: '医生/护士/技师', value: '94.1%', target: '>=95%', trend: '-0.9%', status: '关注', source: 'infection_check, infection_training', owner: '感控管理', drill: 18, nextAction: '安排培训' },
  { id: 'INF-RPT-002', metric: '导管连接合格率', dimension: '导管患者', value: '97.2%', target: '>=98%', trend: '-0.4%', status: '关注', source: 'access_connect_check', owner: '护士站', drill: 11, nextAction: '现场督导' },
  { id: 'INF-RPT-003', metric: '内瘘穿刺合格率', dimension: '内瘘患者', value: '98.9%', target: '>=99%', trend: '+0.2%', status: '关注', source: 'puncture_check', owner: '护理组长', drill: 6, nextAction: '抽查穿刺记录' },
  { id: 'INF-RPT-004', metric: '隔离透析执行率', dimension: '隔离区', value: '100%', target: '100%', trend: '0', status: '达标', source: 'isolation_dialysis_record', owner: '感控护士', drill: 24, nextAction: '维持执行' },
  { id: 'INF-RPT-005', metric: '消毒记录完整率', dimension: '设备/环境', value: '96.5%', target: '>=98%', trend: '-1.0%', status: '异常', source: 'disinfection_record', owner: '技师站/护士站', drill: 33, nextAction: '补录消毒记录' },
  { id: 'INF-RPT-006', metric: '感染事件数', dimension: '本月', value: 4, target: '持续下降', trend: '+1', status: '异常', source: 'infection_event', owner: '感控负责人', drill: 4, nextAction: '生成RCA' },
  { id: 'INF-RPT-007', metric: '整改按期关闭率', dimension: '感控问题', value: '88.0%', target: '>=95%', trend: '-3.5%', status: '异常', source: 'infection_rectify', owner: '感控管理', drill: 9, nextAction: '催办整改复查' },
  { id: 'INF-RPT-008', metric: '制度学习完成率', dimension: '全员', value: '93.6%', target: '>=95%', trend: '+2.0%', status: '关注', source: 'infection_policy_study', owner: '感控管理', drill: 27, nextAction: '提醒未学习人员' },
  { id: 'INF-RPT-009', metric: '感控培训达标率', dimension: '季度培训', value: '91.4%', target: '>=95%', trend: '-1.7%', status: '异常', source: 'infection_training', owner: '行政人事站', drill: 31, nextAction: '补训安排' },
  { id: 'INF-RPT-010', metric: '隔离标记一致率', dimension: '排班+患者', value: '99.2%', target: '100%', trend: '+0.4%', status: '关注', source: 'patient_isolation, schedule_bed', owner: '导诊台/感控', drill: 3, nextAction: '核对标记' },
  { id: 'INF-RPT-011', metric: '传染病检验完成率', dimension: 'HBV/HCV/HIV/梅毒', value: '96.4%', target: '100%', trend: '-1.2%', status: '关注', source: 'lab_order, lab_result', owner: '检验科/感控管理', drill: 14, nextAction: '催办传染病筛查' },
  { id: 'INF-RPT-012', metric: 'HBV转阳率', dimension: '月度筛查', value: '0.26%', target: '0', trend: '+0.26%', status: '异常', source: 'infectious_screening_result', owner: '感控管理', drill: 1, nextAction: '启动HBV复核' },
  { id: 'INF-RPT-013', metric: 'HCV转阳率', dimension: '月度筛查', value: '0%', target: '0', trend: '0', status: '达标', source: 'infectious_screening_result', owner: '感控管理', drill: 0, nextAction: '维持筛查' },
  { id: 'INF-RPT-014', metric: 'HIV转阳率', dimension: '月度筛查', value: '0%', target: '0', trend: '0', status: '达标', source: 'infectious_screening_result', owner: '感控管理', drill: 0, nextAction: '维持筛查' },
  { id: 'INF-RPT-015', metric: '梅毒转阳率', dimension: '月度筛查', value: '0.26%', target: '0', trend: '+0.26%', status: '异常', source: 'infectious_screening_result', owner: '感控管理', drill: 1, nextAction: '启动梅毒复核' },
  { id: 'INF-RPT-016', metric: '导管感染率', dimension: '导管患者', value: '1.8%', target: '<=1%', trend: '+0.4%', status: '异常', source: 'vascular_access_event, infection_event', owner: '通路小组/感控管理', drill: 7, nextAction: '生成导管感染RCA' },
];

const stats = [
  { label: '感控指标', value: rows.length, tone: 'blue' as const },
  { label: '达标指标', value: rows.filter((item) => item.status === '达标').length, tone: 'green' as const },
  { label: '异常指标', value: rows.filter((item) => item.status === '异常').length, tone: 'red' as const },
  { label: '下钻记录', value: rows.reduce((sum, item) => sum + Number(item.drill), 0), tone: 'orange' as const },
  { label: '待整改', value: 9, tone: 'blue' as const },
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
  { object: '感控检查', code: 'IC-20260514-006', name: '手卫生抽查', source: 'infection_check', owner: '感控护士', status: '关注' },
  { object: '整改', code: 'RECT-202605-009', name: '消毒记录缺项', source: 'infection_rectify', owner: '技师站', status: '待复查' },
  { object: '事件', code: 'INF-EVT-004', name: '导管感染线索', source: 'infection_event', owner: '感控负责人', status: '异常' },
  { object: '培训', code: 'TRN-202605-012', name: '制度补训', source: 'infection_training', owner: '行政人事站', status: '待完成' },
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
    title="感控指标统计"
    subtitle="统计传染病检验完成率、HBV/HCV/HIV/梅毒转阳率、导管感染率、手卫生合格率、通路操作、隔离透析、消毒记录、培训和整改关闭情况。"
    flow-text="现场检查 -> 问题整改 -> 培训复查 -> 感控统计"
    :filters="filters"
    :stats="stats"
    :rows="rows"
    :columns="columns"
    :drill-rows="drillRows"
    :drill-columns="drillColumns"
    snapshot-title="生成感控统计快照"
    :snapshot-fields="[
      { label: '统计周期', model: 'period', type: 'date', placeholder: '选择日期' },
      { label: '感控范围', model: 'range', type: 'select', options: ['全部指标', '手卫生', '通路操作', '隔离透析', '培训整改'], placeholder: '选择范围' },
      { label: '统计口径', model: 'standard', type: 'textarea', placeholder: '说明检查、整改和培训达标口径' },
    ]"
    export-title="导出感控指标"
    :export-fields="[
      { label: '导出内容', model: 'content', type: 'select', options: ['汇总指标', '问题清单', '整改记录', '培训记录'], placeholder: '选择内容' },
      { label: '用途', model: 'usage', type: 'select', options: ['科室自查', '院感上报', '质控会议'], placeholder: '选择用途' },
    ]"
    improvement-title="生成感控整改任务"
    :improvement-fields="[
      { label: '问题类型', model: 'type', type: 'select', options: ['手卫生', '消毒缺项', '感染事件', '培训未达标', '隔离标记'], placeholder: '选择问题' },
      { label: '责任人', model: 'owner', placeholder: '感控护士/护士长/技师站' },
      { label: '整改要求', model: 'task', type: 'textarea', placeholder: '填写整改、复查和关闭标准' },
    ]"
    closure-tables="infection_check / infection_event / infection_rectify / infection_training"
    closure-text="输入感控检查、传染病筛查、通路操作、导管感染事件、消毒记录、隔离透析、培训和整改复查；输出感控指标快照、转阳复核、导管感染RCA、整改催办、培训补训和院感追溯明细。"
  />
</template>
