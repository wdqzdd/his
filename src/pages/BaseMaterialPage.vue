<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, Files, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();
type Row = {
  code: string;
  name: string;
  category: string;
  spec: string;
  manufacturer: string;
  registrationNo: string;
  lotControl: string;
  expireControl: string;
  highValue: string;
  chargeMode: string;
  status: string;
  owner: string;
  traceRule: string;
  nextAction: string;
};
const selectedCode = ref('MAT-DIALYZER-HF');
const editDialogVisible = ref(false);
const traceRuleDialogVisible = ref(false);
const usageDrawerVisible = ref(false);
const rows: Row[] = [
  { code: 'MAT-DIALYZER-HF', name: '高通量透析器', category: '透析器', spec: 'HF-1.6', manufacturer: '费森尤斯', registrationNo: '国械注进202431001', lotControl: '是', expireControl: '是', highValue: '是', chargeMode: '自动计费', status: '启用', owner: '药耗组', traceRule: 'UDI/批号追溯', nextAction: '持续维护' },
  { code: 'MAT-DIALYZER-LF', name: '低通量透析器', category: '透析器', spec: 'LF-1.4', manufacturer: '贝朗', registrationNo: '国械注进202431002', lotControl: '是', expireControl: '是', highValue: '是', chargeMode: '自动计费', status: '启用', owner: '药耗组', traceRule: 'UDI/批号追溯', nextAction: '持续维护' },
  { code: 'MAT-HF-FILTER', name: '血滤器', category: '血滤器', spec: 'HDF-1.8', manufacturer: '尼普洛', registrationNo: '国械注进202431003', lotControl: '是', expireControl: '是', highValue: '是', chargeMode: '自动计费', status: '启用', owner: '药耗组', traceRule: 'UDI/批号追溯', nextAction: '持续维护' },
  { code: 'MAT-HP-CARTRIDGE', name: '血液灌流器', category: '灌流器', spec: 'HA130', manufacturer: '健帆', registrationNo: '国械注准202431004', lotControl: '是', expireControl: '是', highValue: '是', chargeMode: '按次计费', status: '待复核', owner: '药耗组', traceRule: 'UDI/批号追溯', nextAction: '复核发布' },
  { code: 'MAT-BLOODLINE', name: '血液透析管路', category: '管路', spec: '成人型', manufacturer: '威高', registrationNo: '国械注准202431005', lotControl: '是', expireControl: '是', highValue: '否', chargeMode: '自动计费', status: '启用', owner: '药耗组', traceRule: '批号追溯', nextAction: '持续维护' },
  { code: 'MAT-NEEDLE16', name: '内瘘穿刺针16G', category: '穿刺针', spec: '16G', manufacturer: '贝朗', registrationNo: '国械注进202431006', lotControl: '是', expireControl: '是', highValue: '否', chargeMode: '按次计费', status: '启用', owner: '护理部', traceRule: '批号追溯', nextAction: '持续维护' },
  { code: 'MAT-NEEDLE17', name: '内瘘穿刺针17G', category: '穿刺针', spec: '17G', manufacturer: '贝朗', registrationNo: '国械注进202431007', lotControl: '是', expireControl: '是', highValue: '否', chargeMode: '按次计费', status: '启用', owner: '护理部', traceRule: '批号追溯', nextAction: '持续维护' },
  { code: 'MAT-CATH-KIT', name: '导管护理包', category: '消毒耗材', spec: '标准包', manufacturer: '院内组合', registrationNo: '组合包备案', lotControl: '是', expireControl: '是', highValue: '否', chargeMode: '按次计费', status: '启用', owner: '护理部', traceRule: '批号追溯', nextAction: '持续维护' },
  { code: 'MAT-ISO-KIT', name: '隔离治疗包', category: '消毒耗材', spec: '隔离包', manufacturer: '院内组合', registrationNo: '组合包备案', lotControl: '是', expireControl: '是', highValue: '否', chargeMode: '按次计费', status: '待复核', owner: '感控管理', traceRule: '批号/感控追溯', nextAction: '复核发布' },
  { code: 'MAT-DISINFECT', name: '消毒试纸', category: '消毒耗材', spec: '水质检测', manufacturer: '哈希', registrationNo: '耗材备案2026', lotControl: '是', expireControl: '是', highValue: '否', chargeMode: '科室消耗', status: '启用', owner: '设备科', traceRule: '批号追溯', nextAction: '持续维护' },
  { code: 'MAT-GCP-KIT', name: '研究标本采集包', category: 'GCP耗材', spec: '方案包', manufacturer: '中心药房', registrationNo: '方案备案', lotControl: '是', expireControl: '是', highValue: '否', chargeMode: '不计费', status: '受控', owner: 'CRC站', traceRule: '标本链追溯', nextAction: '研究授权' },
  { code: 'MAT-OLD-LINE', name: '旧版管路', category: '管路', spec: '旧规格', manufacturer: '历史厂家', registrationNo: '历史注册证', lotControl: '是', expireControl: '是', highValue: '否', chargeMode: '停用', status: '停用', owner: '药耗组', traceRule: '历史追溯', nextAction: '清理引用' },
];
const currentRow = computed(() => rows.find((item) => item.code === selectedCode.value) ?? rows[0]);
const activeTables = ['base_material', 'base_fee_item', 'stock_lot', 'material_trace_rule'];
const metrics = computed(() => [
  { label: '耗材项', value: rows.length, tone: 'blue' },
  { label: '启用', value: rows.filter((item) => item.status === '启用').length, tone: 'green' },
  { label: '待复核/受控', value: rows.filter((item) => item.status === '待复核' || item.status === '受控').length, tone: 'orange' },
  { label: '批号追溯', value: rows.filter((item) => item.traceRule.includes('批号')).length, tone: 'purple' },
]);
function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' { if (['启用', '持续维护'].includes(value)) return 'success'; if (value === '停用') return 'info'; if (value.includes('待') || value.includes('受控') || value.includes('复核') || value.includes('追溯') || value.includes('授权')) return 'warning'; return 'info'; }
function selectRow(row: Row): void { selectedCode.value = row.code; }
function submitAction(message: string): void { ElMessage.success(message); }
</script>

<template>
  <section class="base-data-page">
    <el-card class="base-work-card" shadow="never">
      <template #header><div class="base-work-header"><div><h2>{{ props.context.menuTitle }}</h2><p>维护透析器、血滤器、灌流器、管路、穿刺针、消毒耗材和GCP耗材，统一厂家、注册证、批号、效期、高值和计费口径。</p></div><div class="base-actions"><el-button type="primary" :icon="Files" @click="editDialogVisible = true">新增耗材</el-button><el-button :icon="Warning" @click="traceRuleDialogVisible = true">追溯规则</el-button><el-button :icon="CircleCheck" @click="usageDrawerVisible = true">引用分析</el-button></div></div></template>
      <el-form class="base-filter" inline><el-form-item label="关键字"><el-input placeholder="耗材、分类、规格、厂家、注册证、追溯规则" clearable /></el-form-item><el-form-item label="分类"><el-select placeholder="全部分类" clearable><el-option label="透析器" value="透析器" /><el-option label="血滤器" value="血滤器" /><el-option label="灌流器" value="灌流器" /><el-option label="管路" value="管路" /><el-option label="穿刺针" value="穿刺针" /><el-option label="消毒耗材" value="消毒耗材" /><el-option label="GCP耗材" value="GCP耗材" /></el-select></el-form-item><el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="启用" value="启用" /><el-option label="待复核" value="待复核" /><el-option label="受控" value="受控" /><el-option label="停用" value="停用" /></el-select></el-form-item><el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item></el-form>
      <div class="base-stat-grid"><el-card v-for="item in metrics" :key="item.label" :class="['base-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>
      <el-table :data="rows" border stripe highlight-current-row row-key="code" @row-click="selectRow"><el-table-column prop="code" label="编码" width="145" fixed="left" /><el-table-column prop="name" label="耗材名称" min-width="145" /><el-table-column prop="category" label="分类" width="95" /><el-table-column prop="spec" label="规格" width="95" /><el-table-column prop="manufacturer" label="生产厂家" width="110" /><el-table-column prop="registrationNo" label="注册证号" width="140" /><el-table-column prop="lotControl" label="批号" width="70" /><el-table-column prop="expireControl" label="效期" width="70" /><el-table-column prop="highValue" label="高值" width="70" /><el-table-column prop="chargeMode" label="是否计费" width="100" /><el-table-column prop="status" label="状态" width="90"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column><el-table-column prop="traceRule" label="追溯规则" min-width="130"><template #default="{ row }"><el-tag :type="tagType(row.traceRule)" effect="plain">{{ row.traceRule }}</el-tag></template></el-table-column><el-table-column prop="nextAction" label="下一步" min-width="105" /><el-table-column label="操作" width="220" fixed="right"><template #default="{ row }"><el-button link type="primary" @click.stop="selectRow(row); editDialogVisible = true">维护</el-button><el-button link @click.stop="selectRow(row); traceRuleDialogVisible = true">追溯</el-button><el-button link @click.stop="selectRow(row); usageDrawerVisible = true">引用</el-button></template></el-table-column></el-table>
    </el-card>    <el-dialog v-model="editDialogVisible" title="耗材基础资料维护" width="720px"><el-form label-width="120px"><el-form-item label="耗材编码"><el-input :model-value="currentRow.code" /></el-form-item><el-form-item label="耗材名称"><el-input :model-value="currentRow.name" /></el-form-item><el-form-item label="规格型号"><el-input :model-value="currentRow.spec" /></el-form-item><el-form-item label="厂家/注册证"><el-input :model-value="`${currentRow.manufacturer} / ${currentRow.registrationNo}`" /></el-form-item><el-form-item label="批号/效期"><el-input :model-value="`批号:${currentRow.lotControl} / 效期:${currentRow.expireControl}`" /></el-form-item><el-form-item label="高值/计费"><el-input :model-value="`高值:${currentRow.highValue} / ${currentRow.chargeMode}`" /></el-form-item><el-form-item label="业务属性"><el-checkbox-group><el-checkbox label="治疗自动消耗" /><el-checkbox label="库存扣减" /><el-checkbox label="费用同步" /><el-checkbox label="批号管理" /><el-checkbox label="效期管理" /><el-checkbox label="高值追溯" /><el-checkbox label="隔离/GCP受控" /></el-checkbox-group></el-form-item><el-form-item label="说明"><el-input type="textarea" :rows="3" placeholder="记录耗材适用场景、注册证、计费和库存追溯影响" /></el-form-item></el-form><template #footer><el-button @click="editDialogVisible = false">取消</el-button><el-button type="primary" @click="editDialogVisible = false; submitAction('耗材资料已保存')">保存耗材</el-button></template></el-dialog>
    <el-dialog v-model="traceRuleDialogVisible" title="耗材追溯规则" width="600px"><el-form label-width="110px"><el-form-item label="耗材"><el-input :model-value="currentRow.name" disabled /></el-form-item><el-form-item label="追溯要求"><el-checkbox-group><el-checkbox label="UDI" /><el-checkbox label="批号" /><el-checkbox label="效期" /><el-checkbox label="患者治疗记录" /></el-checkbox-group></el-form-item><el-form-item label="追溯说明"><el-input type="textarea" :rows="3" placeholder="记录自动消耗、批号选择、感控和GCP链路要求" /></el-form-item></el-form><template #footer><el-button @click="traceRuleDialogVisible = false">取消</el-button><el-button type="primary" @click="traceRuleDialogVisible = false; submitAction('耗材追溯规则已更新')">保存规则</el-button></template></el-dialog>
    <el-drawer v-model="usageDrawerVisible" title="耗材引用分析" size="520px"><el-timeline><el-timeline-item timestamp="引用位置">耗材：{{ currentRow.name }}，规则：{{ currentRow.traceRule }}</el-timeline-item><el-timeline-item timestamp="引用范围" type="warning">治疗消耗、库存批号、费用和感控追溯均会引用。</el-timeline-item><el-timeline-item timestamp="业务同步" type="success">发布后同步治疗记录、药耗费用和统计报表。</el-timeline-item></el-timeline></el-drawer>
  </section>
</template>
