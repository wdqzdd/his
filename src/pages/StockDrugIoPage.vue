<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, DocumentAdd, Search, Tickets } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();

type Row = {
  id: string;
  name: string;
  spec: string;
  lotNo: string;
  type: string;
  quantity: string;
  warehouse: string;
  supplier: string;
  status: string;
  operator: string;
  nextAction: string;
};

const selectedId = ref('DIO-001');
const ioDialogVisible = ref(false);
const reviewDialogVisible = ref(false);
const traceDrawerVisible = ref(false);

const rows: Row[] = [
  { id: 'DIO-001', name: '低分子肝素钙注射液', spec: '4100IU/支', lotNo: 'LMWH260401', type: '入库', quantity: '200支', warehouse: '透析药房', supplier: '华东医药', status: '待复核', operator: '库管赵', nextAction: '复核入库' },
  { id: 'DIO-002', name: '促红素注射液', spec: '4000IU/支', lotNo: 'EPO260312', type: '出库', quantity: '24支', warehouse: '透析药房', supplier: '国药控股', status: '已出库', operator: '库管钱', nextAction: '治疗消耗' },
  { id: 'DIO-003', name: '左卡尼汀注射液', spec: '1g/支', lotNo: 'LC260210', type: '调拨', quantity: '40支', warehouse: '中心库->透析药房', supplier: '上药控股', status: '待签收', operator: '库管赵', nextAction: '药房签收' },
  { id: 'DIO-004', name: '骨化三醇胶丸', spec: '0.25ug/粒', lotNo: 'CAL260501', type: '盘点', quantity: '1200粒', warehouse: '中心库', supplier: '国药控股', status: '已复核', operator: '库管钱', nextAction: '正常发放' },
  { id: 'DIO-005', name: '司维拉姆片', spec: '800mg*30片', lotNo: 'SEV260410', type: '退库', quantity: '5盒', warehouse: '透析药房', supplier: '上药控股', status: '待复核', operator: '库管孙', nextAction: '质量复核' },
  { id: 'DIO-006', name: '米多君片', spec: '2.5mg*20片', lotNo: 'MID260030', type: '入库', quantity: '30盒', warehouse: '透析药房', supplier: '国药控股', status: '待复核', operator: '库管赵', nextAction: '低库存补货' },
  { id: 'DIO-007', name: '蔗糖铁注射液', spec: '100mg/支', lotNo: 'IRON260211', type: '出库', quantity: '12支', warehouse: '透析药房', supplier: '华东医药', status: '已出库', operator: '库管钱', nextAction: '护士签收' },
  { id: 'DIO-008', name: '碳酸镧咀嚼片', spec: '500mg*20片', lotNo: 'LAN260105', type: '入库', quantity: '80盒', warehouse: '中心库', supplier: '上药控股', status: '已复核', operator: '库管孙', nextAction: '可发药' },
  { id: 'DIO-009', name: '呋塞米片', spec: '20mg*100片', lotNo: 'FUR260118', type: '盘点', quantity: '16瓶', warehouse: '透析药房', supplier: '国药控股', status: '差异待核', operator: '库管赵', nextAction: '盘点复核' },
  { id: 'DIO-010', name: '恩替卡韦片', spec: '0.5mg*7片', lotNo: 'ETV260207', type: '调拨', quantity: '20盒', warehouse: '中心库->隔离区药柜', supplier: '华东医药', status: '待签收', operator: '库管钱', nextAction: '隔离药柜签收' },
  { id: 'DIO-011', name: '蔗糖铁注射液', spec: '100mg/支', lotNo: 'IRON260101', type: '报损', quantity: '3支', warehouse: '透析药房', supplier: '华东医药', status: '待复核', operator: '库管孙', nextAction: '药师质量确认' },
  { id: 'DIO-012', name: '米多君片', spec: '2.5mg*20片', lotNo: 'MID260030', type: '库存调整', quantity: '+6盒', warehouse: '透析药房', supplier: '国药控股', status: '差异待核', operator: '库管赵', nextAction: '调整复核' },
];

const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['drug_stock_lot', 'drug_stock_transaction', 'drug_inventory_review'];
const metrics = computed(() => [
  { label: '流水总数', value: rows.length, tone: 'blue' },
  { label: '待复核', value: rows.filter((item) => item.status === '待复核').length, tone: 'orange' },
  { label: '待签收', value: rows.filter((item) => item.status === '待签收').length, tone: 'orange' },
  { label: '已复核', value: rows.filter((item) => item.status === '已复核').length, tone: 'green' },
  { label: '差异待核', value: rows.filter((item) => item.status === '差异待核').length, tone: 'red' },
]);

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value === '已复核' || value === '已出库') return 'success';
  if (value === '待复核' || value === '待签收') return 'warning';
  if (value === '差异待核') return 'danger';
  return 'info';
}
function selectRow(row: Row): void { selectedId.value = row.id; }
function submitAction(message: string): void { ElMessage.success(message); }
</script>

<template>
  <section class="stock-fee-page">
    <el-card class="stock-work-card" shadow="never">
      <template #header>
        <div class="stock-header">
          <div><h2>{{ props.context.menuTitle }}</h2><p>登记药品入库、出库、退库、报损、调拨、盘点和库存调整，复核后更新批号库存与流水。</p></div>
          <div class="stock-actions"><el-button type="primary" :icon="DocumentAdd" @click="ioDialogVisible = true">出入库登记</el-button><el-button :icon="CircleCheck" @click="reviewDialogVisible = true">复核签收</el-button><el-button :icon="Tickets" @click="traceDrawerVisible = true">批号追溯</el-button></div>
        </div>
      </template>
      <el-form class="stock-filter" inline><el-form-item label="关键字"><el-input placeholder="药品、批号、供应商、库房" clearable /></el-form-item><el-form-item label="类型"><el-select placeholder="全部类型" clearable><el-option label="入库" value="入库" /><el-option label="出库" value="出库" /><el-option label="调拨" value="调拨" /><el-option label="退库" value="退库" /><el-option label="报损" value="报损" /><el-option label="盘点" value="盘点" /><el-option label="库存调整" value="库存调整" /></el-select></el-form-item><el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="待复核" value="待复核" /><el-option label="待签收" value="待签收" /><el-option label="已复核" value="已复核" /></el-select></el-form-item><el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item></el-form>
      <div class="stock-stat-grid"><el-card v-for="item in metrics" :key="item.label" :class="['stock-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>
      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow">
        <el-table-column prop="name" label="药品" min-width="160" fixed="left" />
        <el-table-column prop="spec" label="规格" width="120" />
        <el-table-column prop="lotNo" label="批号" width="120" />
        <el-table-column prop="type" label="类型" width="90" />
        <el-table-column prop="quantity" label="数量" width="90" />
        <el-table-column prop="warehouse" label="库房" min-width="150" />
        <el-table-column prop="supplier" label="供应商" width="110" />
        <el-table-column prop="status" label="状态" width="100"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="operator" label="经办人" width="100" />
        <el-table-column prop="nextAction" label="下一步" min-width="120" />
      </el-table>
    </el-card>    <el-dialog v-model="ioDialogVisible" title="药品出入库登记" width="640px"><el-form label-width="100px"><el-form-item label="药品"><el-input :model-value="currentRow.name" /></el-form-item><el-form-item label="批号"><el-input :model-value="currentRow.lotNo" /></el-form-item><el-form-item label="业务类型"><el-select :model-value="currentRow.type"><el-option label="入库" value="入库" /><el-option label="出库" value="出库" /><el-option label="调拨" value="调拨" /><el-option label="退库" value="退库" /><el-option label="报损" value="报损" /><el-option label="盘点" value="盘点" /><el-option label="库存调整" value="库存调整" /></el-select></el-form-item><el-form-item label="数量"><el-input :model-value="currentRow.quantity" /></el-form-item><el-form-item label="说明"><el-input type="textarea" :rows="3" placeholder="记录供应商、票据号、报损原因、盘点差异、库房位置和质量验收结果" /></el-form-item></el-form><template #footer><el-button @click="ioDialogVisible = false">取消</el-button><el-button type="primary" @click="ioDialogVisible = false; submitAction('药品出入库流水已保存')">保存登记</el-button></template></el-dialog>
    <el-dialog v-model="reviewDialogVisible" title="药品库存复核" width="580px"><el-form label-width="100px"><el-form-item label="流水"><el-input :model-value="currentRow.id" disabled /></el-form-item><el-form-item label="复核结果"><el-radio-group model-value="pass"><el-radio-button label="pass">通过</el-radio-button><el-radio-button label="return">退回</el-radio-button></el-radio-group></el-form-item><el-form-item label="复核意见"><el-input type="textarea" :rows="3" placeholder="填写验收差异、签收人和处理意见" /></el-form-item></el-form><template #footer><el-button @click="reviewDialogVisible = false">取消</el-button><el-button type="primary" @click="reviewDialogVisible = false; submitAction('药品库存复核已完成')">提交复核</el-button></template></el-dialog>
    <el-drawer v-model="traceDrawerVisible" title="药品批号追溯" size="520px"><el-timeline><el-timeline-item timestamp="2026-05-10 08:00" type="primary">登记批号：{{ currentRow.lotNo }}</el-timeline-item><el-timeline-item timestamp="2026-05-10 08:30">复核入库并更新库存</el-timeline-item><el-timeline-item timestamp="后续" type="success">治疗消耗、发药和费用均引用该批号</el-timeline-item></el-timeline></el-drawer>
  </section>
</template>
