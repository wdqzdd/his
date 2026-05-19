<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, Files, Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();
type Row = {
  code: string;
  name: string;
  category: string;
  standardCode: string;
  source: string;
  scope: string;
  version: string;
  status: string;
  owner: string;
  usedBy: string;
  nextAction: string;
};
const selectedCode = ref('DX-CKD5D');
const editDialogVisible = ref(false);
const reviewDialogVisible = ref(false);
const usageDrawerVisible = ref(false);
const rows: Row[] = [
  { code: 'DX-CKD5D', name: '慢性肾脏病5D期', category: '诊断字典', standardCode: 'ICD:N18.500', source: '国临版诊断', scope: '医生站/报表', version: '2026.05', status: '启用', owner: '医务科', usedBy: '医生诊断/报表', nextAction: '持续维护' },
  { code: 'DX-ANEMIA', name: '肾性贫血', category: '诊断字典', standardCode: 'ICD:D63.801', source: '医保版诊断', scope: '医嘱/疗效', version: '2026.05', status: '启用', owner: '医务科', usedBy: '医嘱/疗效分析', nextAction: '持续维护' },
  { code: 'DX-MBD', name: '矿物质骨病', category: '院内自定义诊断', standardCode: 'HD-DX-MBD', source: '院内专科', scope: '检验/CQI', version: '2026.05', status: '启用', owner: '医务科', usedBy: '检验趋势/CQI', nextAction: '持续维护' },
  { code: 'SURG-AVF', name: '动静脉内瘘成形术', category: '手术名称字典', standardCode: 'OP-39.2701', source: '手术编码', scope: '通路/手术申请', version: '2026.05', status: '启用', owner: '医务科', usedBy: '血管通路/病程', nextAction: '持续维护' },
  { code: 'STAGE-CKD5D', name: 'CKD 5D 分期', category: '疾病分级分期', standardCode: 'CKD-STAGE-5D', source: '专科分期', scope: '诊断/报表', version: '2026.05', status: '启用', owner: '质控办', usedBy: '医生诊断/统计', nextAction: '持续维护' },
  { code: 'ALG-HEP', name: '肝素过敏', category: '过敏类型字典', standardCode: 'ALG-HEPARIN', source: '院内字典', scope: '医嘱审核', version: '2026.05', status: '启用', owner: '药剂科', usedBy: '医嘱/药师审核', nextAction: '持续维护' },
  { code: 'INF-HBV', name: '乙肝隔离标识', category: '感染类型', standardCode: 'INF-HBV', source: '传染病类型字典', scope: '排班/感控', version: '2026.05', status: '启用', owner: '感控管理', usedBy: '排班分区/感控', nextAction: '持续维护' },
  { code: 'INF-HCV', name: '丙肝隔离标识', category: '感染类型', standardCode: 'INF-HCV', source: '传染病类型字典', scope: '排班/感控', version: '2026.05', status: '启用', owner: '感控管理', usedBy: '排班分区/感控', nextAction: '持续维护' },
  { code: 'INF-TB', name: '结核疑似隔离', category: '传染病类型字典', standardCode: 'INF-TB-SUS', source: '院感规则', scope: '导诊/感控', version: '草稿', status: '待复核', owner: '感控管理', usedBy: '感染筛查/上报', nextAction: '复核发布' },
  { code: 'ACCESS-AVF', name: '自体动静脉内瘘', category: '血管通路', standardCode: 'VA-AVF', source: '专科字典', scope: '通路/上机', version: '2026.05', status: '启用', owner: '通路团队', usedBy: '通路/上机核对', nextAction: '持续维护' },
  { code: 'ACCESS-CVC', name: '中心静脉导管', category: '血管通路', standardCode: 'VA-CVC', source: '专科字典', scope: '通路/感控', version: '2026.05', status: '启用', owner: '通路团队', usedBy: '通路/感染风险', nextAction: '持续维护' },
  { code: 'RISK-FALL', name: '跌倒风险', category: '护理风险', standardCode: 'RISK-FALL', source: '院内字典', scope: '护理评估', version: '草稿', status: '待复核', owner: '护理部', usedBy: '护理评估', nextAction: '复核发布' },
  { code: 'RISK-HYPOTENSION', name: '透中低血压风险', category: '治疗风险', standardCode: 'RISK-IDH', source: '血透专科', scope: '治疗监测', version: '2026.05', status: '启用', owner: '医务科', usedBy: '治疗监测/预警', nextAction: '持续维护' },
  { code: 'PAY-MEDICARE', name: '医保患者', category: '客户类型', standardCode: 'PAY-MI', source: '医保版', scope: '签约/费用', version: '2026.05', status: '启用', owner: '导诊台', usedBy: '签约/费用', nextAction: '持续维护' },
];
const currentRow = computed(() => rows.find((item) => item.code === selectedCode.value) ?? rows[0]);
const activeTables = ['base_dict', 'base_dict_item', 'base_diagnosis'];
const metrics = computed(() => [
  { label: '字典项', value: rows.length, tone: 'blue' },
  { label: '启用', value: rows.filter((item) => item.status === '启用').length, tone: 'green' },
  { label: '待复核', value: rows.filter((item) => item.status === '待复核').length, tone: 'orange' },
  { label: '诊断字典', value: rows.filter((item) => item.category === '诊断字典').length, tone: 'purple' },
]);
function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' { if (['启用', '持续维护'].includes(value)) return 'success'; if (value.includes('待') || value.includes('草稿') || value.includes('复核')) return 'warning'; return 'info'; }
function selectRow(row: Row): void { selectedCode.value = row.code; }
function submitAction(message: string): void { ElMessage.success(message); }
</script>

<template>
  <section class="base-data-page">
    <el-card class="base-work-card" shadow="never">
      <template #header><div class="base-work-header"><div><h2>{{ props.context.menuTitle }}</h2><p>维护诊断编码、手术编码、分级分期、过敏、感染、传染病和通路等基础字典，统一供建档、诊疗、排班和报表引用。</p></div><div class="base-actions"><el-button type="primary" :icon="Files" @click="editDialogVisible = true">新增字典项</el-button><el-button :icon="CircleCheck" @click="reviewDialogVisible = true">复核发布</el-button><el-button @click="usageDrawerVisible = true">引用分析</el-button></div></div></template>
      <el-form class="base-filter" inline><el-form-item label="关键字"><el-input placeholder="编码、名称、ICD/手术编码、分类、来源或引用模块" clearable /></el-form-item><el-form-item label="分类"><el-select placeholder="全部分类" clearable><el-option label="诊断字典" value="诊断字典" /><el-option label="院内自定义诊断" value="院内自定义诊断" /><el-option label="手术名称字典" value="手术名称字典" /><el-option label="疾病分级分期" value="疾病分级分期" /><el-option label="过敏类型字典" value="过敏类型字典" /><el-option label="感染类型" value="感染类型" /><el-option label="传染病类型字典" value="传染病类型字典" /><el-option label="血管通路" value="血管通路" /></el-select></el-form-item><el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="启用" value="启用" /><el-option label="待复核" value="待复核" /></el-select></el-form-item><el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item></el-form>
      <div class="base-stat-grid"><el-card v-for="item in metrics" :key="item.label" :class="['base-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>
      <el-table :data="rows" border stripe highlight-current-row row-key="code" @row-click="selectRow"><el-table-column prop="code" label="编码" width="145" fixed="left" /><el-table-column prop="name" label="名称" min-width="155" /><el-table-column prop="category" label="分类" width="125" /><el-table-column prop="standardCode" label="标准/院内编码" width="135" /><el-table-column prop="source" label="来源版本" width="120" /><el-table-column prop="scope" label="适用范围" width="120" /><el-table-column prop="version" label="版本" width="95" /><el-table-column prop="status" label="状态" width="95"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column><el-table-column prop="owner" label="责任部门" width="105" /><el-table-column prop="usedBy" label="引用模块" min-width="145" /><el-table-column prop="nextAction" label="下一步" min-width="105" /><el-table-column label="操作" width="220" fixed="right"><template #default="{ row }"><el-button link type="primary" @click.stop="selectRow(row); editDialogVisible = true">维护</el-button><el-button link @click.stop="selectRow(row); reviewDialogVisible = true">复核</el-button><el-button link @click.stop="selectRow(row); usageDrawerVisible = true">引用</el-button></template></el-table-column></el-table>
    </el-card>    <el-dialog v-model="editDialogVisible" title="医疗字典项维护" width="680px"><el-form label-width="120px"><el-form-item label="编码"><el-input :model-value="currentRow.code" /></el-form-item><el-form-item label="名称"><el-input :model-value="currentRow.name" /></el-form-item><el-form-item label="分类"><el-input :model-value="currentRow.category" /></el-form-item><el-form-item label="标准编码"><el-input :model-value="currentRow.standardCode" placeholder="ICD、手术编码、医保编码或院内专科编码" /></el-form-item><el-form-item label="来源版本"><el-input :model-value="currentRow.source" placeholder="国临版、医保版、院内自定义或专科版本" /></el-form-item><el-form-item label="业务属性"><el-checkbox-group><el-checkbox label="可用于诊断" /><el-checkbox label="可用于手术/通路" /><el-checkbox label="影响排班" /><el-checkbox label="影响医嘱审核" /><el-checkbox label="进入报表" /></el-checkbox-group></el-form-item><el-form-item label="变更原因"><el-input type="textarea" :rows="3" placeholder="说明新增或调整原因、影响模块和兼容旧数据方式" /></el-form-item></el-form><template #footer><el-button @click="editDialogVisible = false">取消</el-button><el-button type="primary" @click="editDialogVisible = false; submitAction('医疗字典项已保存为待复核')">保存</el-button></template></el-dialog>
    <el-dialog v-model="reviewDialogVisible" title="字典项复核发布" width="580px"><el-form label-width="110px"><el-form-item label="字典项"><el-input :model-value="`${currentRow.code} / ${currentRow.name}`" disabled /></el-form-item><el-form-item label="复核结论"><el-radio-group model-value="publish"><el-radio-button label="publish">发布</el-radio-button><el-radio-button label="return">退回</el-radio-button><el-radio-button label="disable">停用</el-radio-button></el-radio-group></el-form-item><el-form-item label="复核意见"><el-input type="textarea" :rows="3" placeholder="记录编码唯一性、引用影响和复核意见" /></el-form-item></el-form><template #footer><el-button @click="reviewDialogVisible = false">取消</el-button><el-button type="primary" @click="reviewDialogVisible = false; submitAction('字典项复核结果已提交')">提交复核</el-button></template></el-dialog>
    <el-drawer v-model="usageDrawerVisible" title="字典引用分析" size="520px"><el-timeline><el-timeline-item timestamp="引用模块">当前项：{{ currentRow.name }}，引用：{{ currentRow.usedBy }}</el-timeline-item><el-timeline-item timestamp="发布校验" type="warning">发布前检查历史记录兼容和报表口径。</el-timeline-item><el-timeline-item timestamp="业务输出" type="success">同步诊疗、排班、感控和统计报表。</el-timeline-item></el-timeline></el-drawer>
  </section>
</template>
