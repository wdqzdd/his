<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();

type Row = { id: string; name: string; stockType: string; lotNo: string; warning: string; quantity: string; expiry: string; owner: string; status: string; nextAction: string };
const selectedId = ref('DW-001');
const handleDialogVisible = ref(false);
const closeDialogVisible = ref(false);
const rows: Row[] = [
  { id: 'DW-001', name: '促红素注射液', stockType: '常规库存', lotNo: 'EPO260312', warning: '低库存', quantity: '88支', expiry: '2026-08-15', owner: '库管钱', status: '待处理', nextAction: '生成补货' },
  { id: 'DW-002', name: '左卡尼汀注射液', stockType: '批号库存', lotNo: 'LC260210', warning: '近效期', quantity: '52支', expiry: '2026-07-02', owner: '库管赵', status: '处理中', nextAction: '优先消耗' },
  { id: 'DW-003', name: '米多君片', stockType: '常规库存', lotNo: 'MID260030', warning: '低库存', quantity: '7盒', expiry: '2027-02-01', owner: '库管孙', status: '待处理', nextAction: '补货审批' },
  { id: 'DW-004', name: '骨化三醇胶丸', stockType: '效期库存', lotNo: 'CAL260012', warning: '近效期', quantity: '18盒', expiry: '2026-07-01', owner: '库管钱', status: '已关闭', nextAction: '持续监控' },
  { id: 'DW-005', name: '蔗糖铁注射液', stockType: '批号库存', lotNo: 'IRON260211', warning: '批号待复核', quantity: '86支', expiry: '2026-11-01', owner: '库管赵', status: '待复核', nextAction: '质量复核' },
  { id: 'DW-006', name: '碳酸镧咀嚼片', stockType: '常规库存', lotNo: 'LAN260105', warning: '库存过高', quantity: '80盒', expiry: '2027-01-01', owner: '库管孙', status: '处理中', nextAction: '调整采购' },
  { id: 'DW-007', name: '低分子肝素钙', stockType: '特殊药品库存', lotNo: 'LMWH260401', warning: '正常提醒', quantity: '326支', expiry: '2027-04-01', owner: '库管钱', status: '已关闭', nextAction: '双人复核消耗' },
  { id: 'DW-008', name: '恩替卡韦片', stockType: '隔离区库存', lotNo: 'ETV260207', warning: '隔离区低库存', quantity: '6盒', expiry: '2027-02-01', owner: '库管赵', status: '待处理', nextAction: '隔离补货' },
  { id: 'DW-009', name: '呋塞米片', stockType: '自备药库存', lotNo: 'FUR260118', warning: '盘点差异', quantity: '16瓶', expiry: '2027-01-18', owner: '库管孙', status: '待复核', nextAction: '患者自备药核对' },
  { id: 'DW-010', name: '司维拉姆片', stockType: '自备药库存', lotNo: 'SEV260410', warning: '近效期', quantity: '21盒', expiry: '2026-09-01', owner: '库管钱', status: '处理中', nextAction: '通知患者优先使用' },
];
const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['drug_stock_warning', 'drug_replenishment_task', 'drug_warning_handle'];
const metrics = computed(() => [{ label: '当前库存', value: rows.length, tone: 'blue' }, { label: '批号/效期', value: rows.filter((i) => i.stockType.includes('批号') || i.stockType.includes('效期')).length, tone: 'orange' }, { label: '自备药', value: rows.filter((i) => i.stockType === '自备药库存').length, tone: 'green' }, { label: '特殊药品', value: rows.filter((i) => i.stockType === '特殊药品库存').length, tone: 'red' }, { label: '待处理', value: rows.filter((i) => i.status === '待处理').length, tone: 'orange' }]);
function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' { if (value === '已关闭') return 'success'; if (value.includes('低库存') || value === '待处理') return 'danger'; if (value.includes('近效期') || value.includes('待') || value === '处理中') return 'warning'; return 'info'; }
function selectRow(row: Row): void { selectedId.value = row.id; }
function submitAction(message: string): void { ElMessage.success(message); }
</script>

<template>
  <section class="stock-fee-page">
    <el-card class="stock-work-card" shadow="never">
      <template #header><div class="stock-header"><div><h2>{{ props.context.menuTitle }}</h2><p>查看当前库存、批号库存、效期库存、自备药库存和特殊药品库存，处理低库存、近效期和批号异常。</p></div><div class="stock-actions"><el-button type="primary" :icon="Warning" @click="handleDialogVisible = true">处理预警</el-button><el-button :icon="CircleCheck" @click="closeDialogVisible = true">复核关闭</el-button></div></div></template>
      <el-form class="stock-filter" inline><el-form-item label="关键字"><el-input placeholder="药品、批号、预警、责任人" clearable /></el-form-item><el-form-item label="库存口径"><el-select placeholder="全部口径" clearable><el-option label="常规库存" value="常规库存" /><el-option label="批号库存" value="批号库存" /><el-option label="效期库存" value="效期库存" /><el-option label="自备药库存" value="自备药库存" /><el-option label="特殊药品库存" value="特殊药品库存" /></el-select></el-form-item><el-form-item label="预警类型"><el-select placeholder="全部类型" clearable><el-option label="低库存" value="低库存" /><el-option label="近效期" value="近效期" /><el-option label="盘点差异" value="盘点差异" /></el-select></el-form-item><el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="待处理" value="待处理" /><el-option label="处理中" value="处理中" /><el-option label="已关闭" value="已关闭" /></el-select></el-form-item><el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item></el-form>
      <div class="stock-stat-grid"><el-card v-for="item in metrics" :key="item.label" :class="['stock-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>
      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow"><el-table-column prop="name" label="药品" min-width="150" fixed="left" /><el-table-column prop="stockType" label="库存口径" width="120" /><el-table-column prop="lotNo" label="批号" width="120" /><el-table-column prop="warning" label="预警" width="120"><template #default="{ row }"><el-tag :type="tagType(row.warning)">{{ row.warning }}</el-tag></template></el-table-column><el-table-column prop="quantity" label="库存" width="90" /><el-table-column prop="expiry" label="效期" width="110" /><el-table-column prop="owner" label="责任人" width="100" /><el-table-column prop="status" label="状态" width="100"><template #default="{ row }"><el-tag :type="tagType(row.status)" effect="plain">{{ row.status }}</el-tag></template></el-table-column><el-table-column prop="nextAction" label="下一步" min-width="120" /></el-table>
    </el-card>    <el-dialog v-model="handleDialogVisible" title="药品库存预警处理" width="620px"><el-form label-width="100px"><el-form-item label="药品"><el-input :model-value="currentRow.name" disabled /></el-form-item><el-form-item label="处理方式"><el-select placeholder="请选择"><el-option label="生成补货" value="stock" /><el-option label="优先消耗" value="use" /><el-option label="停用批号" value="hold" /></el-select></el-form-item><el-form-item label="处理说明"><el-input type="textarea" :rows="3" placeholder="记录处理原因、责任人和复核要求" /></el-form-item></el-form><template #footer><el-button @click="handleDialogVisible = false">取消</el-button><el-button type="primary" @click="handleDialogVisible = false; submitAction('药品预警处理已保存')">提交处理</el-button></template></el-dialog>
    <el-dialog v-model="closeDialogVisible" title="预警复核关闭" width="560px"><el-form label-width="100px"><el-form-item label="预警"><el-input :model-value="currentRow.warning" disabled /></el-form-item><el-form-item label="复核结果"><el-radio-group model-value="close"><el-radio-button label="close">关闭</el-radio-button><el-radio-button label="follow">继续跟进</el-radio-button></el-radio-group></el-form-item><el-form-item label="复核意见"><el-input type="textarea" :rows="3" /></el-form-item></el-form><template #footer><el-button @click="closeDialogVisible = false">取消</el-button><el-button type="primary" @click="closeDialogVisible = false; submitAction('药品预警已复核关闭')">提交复核</el-button></template></el-dialog>
  </section>
</template>
