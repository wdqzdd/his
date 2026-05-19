<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();
type Row = { id: string; name: string; stockType: string; lotNo: string; warning: string; quantity: string; expiry: string; owner: string; status: string; nextAction: string };
const selectedId = ref('MW-001');
const handleDialogVisible = ref(false);
const closeDialogVisible = ref(false);
const rows: Row[] = [
  { id: 'MW-001', name: '血液灌流器', stockType: '高值耗材追溯', lotNo: 'HP260301', warning: '低库存', quantity: '18支', expiry: '2027-03-01', owner: '库管钱', status: '待处理', nextAction: '补货审批' },
  { id: 'MW-002', name: '透析管路', stockType: '效期库存', lotNo: 'LINE260118', warning: '近效期', quantity: '66套', expiry: '2026-06-18', owner: '库管赵', status: '处理中', nextAction: '优先消耗' },
  { id: 'MW-003', name: '无菌敷贴', stockType: '效期库存', lotNo: 'DRS260201', warning: '近效期', quantity: '34片', expiry: '2026-06-01', owner: '库管孙', status: '待处理', nextAction: '优先消耗' },
  { id: 'MW-004', name: '隔离治疗包', stockType: '隔离区库存', lotNo: 'ISO260510', warning: '低库存', quantity: '25包', expiry: '2027-05-10', owner: '库管钱', status: '待处理', nextAction: '隔离区补货' },
  { id: 'MW-005', name: '透析器', stockType: '批号库存', lotNo: 'DIAL260405', warning: '正常提醒', quantity: '240支', expiry: '2028-04-05', owner: '库管赵', status: '已关闭', nextAction: '正常消耗' },
  { id: 'MW-006', name: '动静脉穿刺针', stockType: '二级库库存', lotNo: 'AVN260320', warning: '二级库低库存', quantity: '42支', expiry: '2028-03-20', owner: '库管孙', status: '处理中', nextAction: '二级库补货' },
  { id: 'MW-007', name: '消毒湿巾', stockType: '感控库存', lotNo: 'WIP260201', warning: '感控库低库存', quantity: '6包', expiry: '2027-02-01', owner: '感控护士', status: '待处理', nextAction: '感控补货' },
  { id: 'MW-008', name: '透析液A液', stockType: '当前库存', lotNo: 'DFA260430', warning: '库位异常', quantity: '160桶', expiry: '2026-09-30', owner: '设备技师', status: '待复核', nextAction: '库位复核' },
  { id: 'MW-009', name: '透析液B粉', stockType: '当前库存', lotNo: 'DFB260430', warning: '库存过高', quantity: '80袋', expiry: '2026-09-30', owner: '库管赵', status: '处理中', nextAction: '调整采购' },
  { id: 'MW-010', name: '碘伏棉签', stockType: '批号库存', lotNo: 'IOD260422', warning: '批号待复核', quantity: '420包', expiry: '2027-04-22', owner: '库管钱', status: '待复核', nextAction: '质量复核' },
];
const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['material_stock_warning', 'material_replenishment_task', 'warning_handle_record'];
const metrics = computed(() => [{ label: '当前库存', value: rows.length, tone: 'blue' }, { label: '批号/效期', value: rows.filter((i) => i.stockType.includes('批号') || i.stockType.includes('效期')).length, tone: 'orange' }, { label: '高值追溯', value: rows.filter((i) => i.stockType === '高值耗材追溯').length, tone: 'red' }, { label: '低库存', value: rows.filter((i) => i.warning.includes('低库存')).length, tone: 'red' }, { label: '待处理', value: rows.filter((i) => i.status === '待处理').length, tone: 'orange' }]);
function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' { if (value === '已关闭') return 'success'; if (value.includes('低库存') || value === '待处理') return 'danger'; if (value.includes('近效期') || value.includes('待') || value === '处理中') return 'warning'; return 'info'; }
function selectRow(row: Row): void { selectedId.value = row.id; }
function submitAction(message: string): void { ElMessage.success(message); }
</script>

<template>
  <section class="stock-fee-page">
    <el-card class="stock-work-card" shadow="never">
      <template #header><div class="stock-header"><div><h2>{{ props.context.menuTitle }}</h2><p>查看当前库存、批号库存、效期库存和高值耗材追溯，处理低库存、近效期、库位异常和 UDI 复核。</p></div><div class="stock-actions"><el-button type="primary" :icon="Warning" @click="handleDialogVisible = true">处理预警</el-button><el-button :icon="CircleCheck" @click="closeDialogVisible = true">复核关闭</el-button></div></div></template>
      <el-form class="stock-filter" inline><el-form-item label="关键字"><el-input placeholder="耗材、批号、预警、责任人" clearable /></el-form-item><el-form-item label="库存口径"><el-select placeholder="全部口径" clearable><el-option label="当前库存" value="当前库存" /><el-option label="批号库存" value="批号库存" /><el-option label="效期库存" value="效期库存" /><el-option label="高值耗材追溯" value="高值耗材追溯" /><el-option label="二级库库存" value="二级库库存" /></el-select></el-form-item><el-form-item label="预警类型"><el-select placeholder="全部类型" clearable><el-option label="低库存" value="低库存" /><el-option label="近效期" value="近效期" /><el-option label="库位异常" value="库位异常" /></el-select></el-form-item><el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="待处理" value="待处理" /><el-option label="处理中" value="处理中" /><el-option label="已关闭" value="已关闭" /></el-select></el-form-item><el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item></el-form>
      <div class="stock-stat-grid"><el-card v-for="item in metrics" :key="item.label" :class="['stock-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>
      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow"><el-table-column prop="name" label="耗材" min-width="150" fixed="left" /><el-table-column prop="stockType" label="库存口径" width="130" /><el-table-column prop="lotNo" label="批号" width="120" /><el-table-column prop="warning" label="预警" width="120"><template #default="{ row }"><el-tag :type="tagType(row.warning)">{{ row.warning }}</el-tag></template></el-table-column><el-table-column prop="quantity" label="库存" width="90" /><el-table-column prop="expiry" label="效期" width="110" /><el-table-column prop="owner" label="责任人" width="100" /><el-table-column prop="status" label="状态" width="100"><template #default="{ row }"><el-tag :type="tagType(row.status)" effect="plain">{{ row.status }}</el-tag></template></el-table-column><el-table-column prop="nextAction" label="下一步" min-width="120" /></el-table>
    </el-card>    <el-dialog v-model="handleDialogVisible" title="耗材库存预警处理" width="620px"><el-form label-width="100px"><el-form-item label="耗材"><el-input :model-value="currentRow.name" disabled /></el-form-item><el-form-item label="处理方式"><el-select placeholder="请选择"><el-option label="生成补货" value="stock" /><el-option label="优先消耗" value="use" /><el-option label="停用批号" value="hold" /></el-select></el-form-item><el-form-item label="处理说明"><el-input type="textarea" :rows="3" placeholder="记录处理原因、责任人和复核要求" /></el-form-item></el-form><template #footer><el-button @click="handleDialogVisible = false">取消</el-button><el-button type="primary" @click="handleDialogVisible = false; submitAction('耗材预警处理已保存')">提交处理</el-button></template></el-dialog>
    <el-dialog v-model="closeDialogVisible" title="预警复核关闭" width="560px"><el-form label-width="100px"><el-form-item label="预警"><el-input :model-value="currentRow.warning" disabled /></el-form-item><el-form-item label="复核结果"><el-radio-group model-value="close"><el-radio-button label="close">关闭</el-radio-button><el-radio-button label="follow">继续跟进</el-radio-button></el-radio-group></el-form-item><el-form-item label="复核意见"><el-input type="textarea" :rows="3" /></el-form-item></el-form><template #footer><el-button @click="closeDialogVisible = false">取消</el-button><el-button type="primary" @click="closeDialogVisible = false; submitAction('耗材预警已复核关闭')">提交复核</el-button></template></el-dialog>
  </section>
</template>
