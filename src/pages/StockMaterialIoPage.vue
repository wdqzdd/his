<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, DocumentAdd, Search, Tickets } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();
type Row = { id: string; name: string; spec: string; lotNo: string; udi: string; type: string; quantity: string; warehouse: string; supplier: string; status: string; operator: string; nextAction: string };
const selectedId = ref('MIO-001');
const ioDialogVisible = ref(false);
const reviewDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const rows: Row[] = [
  { id: 'MIO-001', name: '透析器', spec: 'FX80', lotNo: 'DIAL260405', udi: 'UDI-M-200001', type: '入库', quantity: '240支', warehouse: '耗材库', supplier: '费森尤斯', status: '待复核', operator: '库管赵', nextAction: '复核入库' },
  { id: 'MIO-002', name: '血液灌流器', spec: 'HA130', lotNo: 'HP260301', udi: 'UDI-M-200002', type: '出库', quantity: '18支', warehouse: '耗材库', supplier: '健帆', status: '已出库', operator: '库管钱', nextAction: '治疗消耗' },
  { id: 'MIO-003', name: '动静脉穿刺针', spec: '16G', lotNo: 'AVN260320', udi: 'UDI-M-200003', type: '调拨', quantity: '300支', warehouse: '耗材库->护士站二级库', supplier: '威高', status: '待签收', operator: '库管赵', nextAction: '护士站签收' },
  { id: 'MIO-004', name: '透析管路', spec: '成人标准', lotNo: 'LINE260118', udi: 'UDI-M-200004', type: '盘点', quantity: '66套', warehouse: '护士站二级库', supplier: '贝朗', status: '差异待核', operator: '库管钱', nextAction: '盘点复核' },
  { id: 'MIO-005', name: '碘伏棉签', spec: '10支/包', lotNo: 'IOD260422', udi: 'UDI-M-200005', type: '入库', quantity: '420包', warehouse: '护士站二级库', supplier: '稳健医疗', status: '已复核', operator: '库管孙', nextAction: '可消耗' },
  { id: 'MIO-006', name: '无菌敷贴', spec: '10cm*12cm', lotNo: 'DRS260201', udi: 'UDI-M-200006', type: '退库', quantity: '12片', warehouse: '护士站二级库', supplier: '3M', status: '待复核', operator: '库管赵', nextAction: '质量复核' },
  { id: 'MIO-007', name: '隔离治疗包', spec: '乙肝隔离', lotNo: 'ISO260510', udi: 'UDI-M-200007', type: '入库', quantity: '25包', warehouse: '隔离区库', supplier: '威高', status: '待复核', operator: '库管钱', nextAction: '隔离区签收' },
  { id: 'MIO-008', name: '透析液浓缩液A液', spec: '10L', lotNo: 'DFA260430', udi: 'UDI-M-200008', type: '调拨', quantity: '160桶', warehouse: '配液间', supplier: '百特', status: '已复核', operator: '库管孙', nextAction: '设备核对' },
  { id: 'MIO-009', name: '消毒湿巾', spec: '80片/包', lotNo: 'WIP260201', udi: 'UDI-M-200009', type: '入库', quantity: '60包', warehouse: '感控库', supplier: '稳健医疗', status: '待签收', operator: '库管钱', nextAction: '感控签收' },
  { id: 'MIO-010', name: '透析液B粉', spec: '650g', lotNo: 'DFB260430', udi: 'UDI-M-200010', type: '出库', quantity: '80袋', warehouse: '配液间', supplier: '百特', status: '已出库', operator: '库管赵', nextAction: '设备消耗' },
  { id: 'MIO-011', name: '血液灌流器', spec: 'HA130', lotNo: 'HP260219', udi: 'UDI-M-200011', type: '报损', quantity: '1支', warehouse: '耗材库', supplier: '健帆', status: '待复核', operator: '库管孙', nextAction: '高值耗材复核' },
  { id: 'MIO-012', name: '透析管路', spec: '成人标准', lotNo: 'LINE260118', udi: 'UDI-M-200004', type: '库存调整', quantity: '+8套', warehouse: '护士站二级库', supplier: '贝朗', status: '差异待核', operator: '库管钱', nextAction: '调整复核' },
];
const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['material_stock_lot', 'material_stock_transaction', 'udi_trace'];
const metrics = computed(() => [{ label: '流水总数', value: rows.length, tone: 'blue' }, { label: '待复核', value: rows.filter((i) => i.status === '待复核').length, tone: 'orange' }, { label: '待签收', value: rows.filter((i) => i.status === '待签收').length, tone: 'orange' }, { label: '已复核', value: rows.filter((i) => i.status === '已复核').length, tone: 'green' }, { label: '差异待核', value: rows.filter((i) => i.status === '差异待核').length, tone: 'red' }]);
function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' { if (value === '已复核' || value === '已出库') return 'success'; if (value === '待复核' || value === '待签收') return 'warning'; if (value === '差异待核') return 'danger'; return 'info'; }
function selectRow(row: Row): void { selectedId.value = row.id; }
function submitAction(message: string): void { ElMessage.success(message); }
</script>

<template>
  <section class="stock-fee-page">
    <el-card class="stock-work-card" shadow="never">
      <template #header><div class="stock-header"><div><h2>{{ props.context.menuTitle }}</h2><p>登记耗材入库、出库、退库、报损、调拨、盘点和库存调整，UDI 全程可追溯。</p></div><div class="stock-actions"><el-button type="primary" :icon="DocumentAdd" @click="ioDialogVisible = true">出入库登记</el-button><el-button :icon="CircleCheck" @click="reviewDialogVisible = true">复核签收</el-button><el-button :icon="Tickets" @click="traceDrawerVisible = true">UDI追溯</el-button></div></div></template>
      <el-form class="stock-filter" inline><el-form-item label="关键字"><el-input placeholder="耗材、UDI、批号、库房" clearable /></el-form-item><el-form-item label="类型"><el-select placeholder="全部类型" clearable><el-option label="入库" value="入库" /><el-option label="出库" value="出库" /><el-option label="调拨" value="调拨" /><el-option label="退库" value="退库" /><el-option label="报损" value="报损" /><el-option label="盘点" value="盘点" /><el-option label="库存调整" value="库存调整" /></el-select></el-form-item><el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="待复核" value="待复核" /><el-option label="待签收" value="待签收" /><el-option label="已复核" value="已复核" /></el-select></el-form-item><el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item></el-form>
      <div class="stock-stat-grid"><el-card v-for="item in metrics" :key="item.label" :class="['stock-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>
      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow"><el-table-column prop="name" label="耗材" min-width="150" fixed="left" /><el-table-column prop="spec" label="规格" width="110" /><el-table-column prop="lotNo" label="批号" width="120" /><el-table-column prop="udi" label="UDI" width="125" /><el-table-column prop="type" label="类型" width="80" /><el-table-column prop="quantity" label="数量" width="90" /><el-table-column prop="warehouse" label="库房" min-width="150" /><el-table-column prop="supplier" label="供应商" width="110" /><el-table-column prop="status" label="状态" width="100"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column><el-table-column prop="nextAction" label="下一步" min-width="120" /></el-table>
    </el-card>    <el-dialog v-model="ioDialogVisible" title="耗材出入库登记" width="640px"><el-form label-width="100px"><el-form-item label="耗材"><el-input :model-value="currentRow.name" /></el-form-item><el-form-item label="UDI"><el-input :model-value="currentRow.udi" /></el-form-item><el-form-item label="业务类型"><el-select :model-value="currentRow.type"><el-option label="入库" value="入库" /><el-option label="出库" value="出库" /><el-option label="调拨" value="调拨" /><el-option label="退库" value="退库" /><el-option label="报损" value="报损" /><el-option label="盘点" value="盘点" /><el-option label="库存调整" value="库存调整" /></el-select></el-form-item><el-form-item label="数量"><el-input :model-value="currentRow.quantity" /></el-form-item><el-form-item label="说明"><el-input type="textarea" :rows="3" placeholder="记录验收结果、报损原因、盘点差异、库位和UDI扫码信息" /></el-form-item></el-form><template #footer><el-button @click="ioDialogVisible = false">取消</el-button><el-button type="primary" @click="ioDialogVisible = false; submitAction('耗材出入库流水已保存')">保存登记</el-button></template></el-dialog>
    <el-dialog v-model="reviewDialogVisible" title="耗材库存复核" width="580px"><el-form label-width="100px"><el-form-item label="流水"><el-input :model-value="currentRow.id" disabled /></el-form-item><el-form-item label="复核结果"><el-radio-group model-value="pass"><el-radio-button label="pass">通过</el-radio-button><el-radio-button label="return">退回</el-radio-button></el-radio-group></el-form-item><el-form-item label="复核意见"><el-input type="textarea" :rows="3" /></el-form-item></el-form><template #footer><el-button @click="reviewDialogVisible = false">取消</el-button><el-button type="primary" @click="reviewDialogVisible = false; submitAction('耗材库存复核已完成')">提交复核</el-button></template></el-dialog>
    <el-drawer v-model="traceDrawerVisible" title="耗材UDI追溯" size="520px"><el-timeline><el-timeline-item timestamp="2026-05-10 08:00" type="primary">扫码入库：{{ currentRow.udi }}</el-timeline-item><el-timeline-item timestamp="2026-05-10 08:30">复核签收并更新库存</el-timeline-item><el-timeline-item timestamp="治疗时" type="success">上机核对引用该UDI</el-timeline-item></el-timeline></el-drawer>
  </section>
</template>
