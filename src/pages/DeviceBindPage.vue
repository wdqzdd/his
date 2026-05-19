<script setup lang="ts">
import { computed, ref } from 'vue';
import { Connection, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();
type Row = { id: string; device: string; model: string; bed: string; zone: string; bindType: string; waterSystem: string; effectiveDate: string; historyCount: number; status: string; owner: string; nextAction: string };
const selectedId = ref('BIND-001');
const bindDialogVisible = ref(false);
const unbindDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const rows: Row[] = [
  { id: 'BIND-001', device: 'HD-08', model: 'Fresenius 5008S', bed: 'A08', zone: 'A区', bindType: '固定绑定', waterSystem: 'RO-A一回路', effectiveDate: '2026-01-01', historyCount: 2, status: '生效', owner: '技师张强', nextAction: '排班可引用' },
  { id: 'BIND-002', device: 'HD-12', model: 'B.Braun Dialog+', bed: 'A12', zone: 'A区', bindType: '固定绑定', waterSystem: 'RO-A一回路', effectiveDate: '2026-01-01', historyCount: 1, status: '待复核', owner: '技师刘敏', nextAction: '复核绑定' },
  { id: 'BIND-003', device: 'HD-23', model: 'Nikkiso DBB-07', bed: 'B03', zone: 'B区', bindType: '固定绑定', waterSystem: 'RO-A二回路', effectiveDate: '2026-01-01', historyCount: 4, status: '暂停', owner: '技师王磊', nextAction: '维修后恢复' },
  { id: 'BIND-004', device: 'HD-27', model: 'Fresenius 4008S', bed: 'B07', zone: 'B区', bindType: '固定绑定', waterSystem: 'RO-A二回路', effectiveDate: '2026-01-01', historyCount: 1, status: '生效', owner: '技师张强', nextAction: '排班可引用' },
  { id: 'BIND-005', device: 'HD-42', model: 'B.Braun Dialog+', bed: 'C02', zone: 'C区', bindType: '固定绑定', waterSystem: 'RO-A三回路', effectiveDate: '2026-01-01', historyCount: 2, status: '待复核', owner: '技师刘敏', nextAction: '补巡检后复核' },
  { id: 'BIND-006', device: 'ISO-01', model: 'Fresenius 5008S', bed: 'I01', zone: '隔离区', bindType: '隔离绑定', waterSystem: '独立隔离回路', effectiveDate: '2026-02-01', historyCount: 3, status: '生效', owner: '技师王磊', nextAction: '终末消毒复核' },
  { id: 'BIND-007', device: 'RO-A', model: 'DWA RO-2000', bed: '水处理间', zone: '系统设备', bindType: '水处理关联', waterSystem: '主供水系统', effectiveDate: '2025-12-01', historyCount: 5, status: '生效', owner: '水处理技师赵丽', nextAction: '水质监测' },
  { id: 'BIND-008', device: 'MIX-01', model: 'Baxter Mix', bed: '配液间', zone: '系统设备', bindType: '系统绑定', waterSystem: 'RO-A一回路', effectiveDate: '2025-12-01', historyCount: 2, status: '生效', owner: '技师张强', nextAction: '浓度复核' },
  { id: 'BIND-009', device: 'HD-31', model: 'Nikkiso DBB-07', bed: 'B11', zone: 'B区', bindType: '固定绑定', waterSystem: 'RO-A二回路', effectiveDate: '2026-03-01', historyCount: 1, status: '生效', owner: '技师刘敏', nextAction: '排班可引用' },
  { id: 'BIND-010', device: 'RO-B', model: 'DWA RO-1500', bed: '备用水处理', zone: '系统设备', bindType: '水处理关联', waterSystem: '备用供水系统', effectiveDate: '2026-05-10', historyCount: 2, status: '待复核', owner: '水处理技师赵丽', nextAction: '启用前检测' },
];
const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['device_archive', 'dialysis_bed', 'device_bed_binding', 'binding_audit_log'];
const metrics = computed(() => [
  { label: '绑定记录', value: rows.length, tone: 'blue' },
  { label: '生效', value: rows.filter((item) => item.status === '生效').length, tone: 'green' },
  { label: '待复核', value: rows.filter((item) => item.status === '待复核').length, tone: 'orange' },
  { label: '暂停', value: rows.filter((item) => item.status === '暂停').length, tone: 'red' },
  { label: '系统设备', value: rows.filter((item) => item.zone === '系统设备').length, tone: 'blue' },
]);
function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' { if (['生效', '排班可引用'].includes(value)) return 'success'; if (value === '暂停') return 'danger'; if (value.includes('待') || value.includes('隔离') || value.includes('备用') || value.includes('复核')) return 'warning'; return 'info'; }
function selectRow(row: Row): void { selectedId.value = row.id; }
function submitAction(message: string): void { ElMessage.success(message); }
</script>

<template>
  <section class="device-water-page">
    <el-card class="device-work-card" shadow="never">
      <template #header><div class="device-header"><div><h2>{{ props.context.menuTitle }}</h2><p>维护设备与机位、系统设备位置的绑定关系，绑定状态直接决定排班和上机核对能否引用。</p></div><div class="device-actions"><el-button type="primary" :icon="Connection" @click="bindDialogVisible = true">新增绑定</el-button><el-button :icon="Warning" @click="unbindDialogVisible = true">解绑/暂停</el-button><el-button @click="traceDrawerVisible = true">绑定追溯</el-button></div></div></template>
      <el-form class="device-filter" inline><el-form-item label="关键字"><el-input placeholder="设备、机位、型号、供水系统、责任人" clearable /></el-form-item><el-form-item label="绑定类型"><el-select placeholder="全部类型" clearable><el-option label="固定绑定" value="固定绑定" /><el-option label="隔离绑定" value="隔离绑定" /><el-option label="系统绑定" value="系统绑定" /><el-option label="水处理关联" value="水处理关联" /></el-select></el-form-item><el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="生效" value="生效" /><el-option label="待复核" value="待复核" /><el-option label="暂停" value="暂停" /></el-select></el-form-item><el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item></el-form>
      <div class="device-stat-grid"><el-card v-for="item in metrics" :key="item.label" :class="['device-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>
      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow">
        <el-table-column prop="device" label="设备" width="100" fixed="left" />
        <el-table-column prop="model" label="型号" min-width="150" />
        <el-table-column prop="bed" label="机位/位置" width="120" />
        <el-table-column prop="zone" label="分区" width="100" />
        <el-table-column prop="bindType" label="绑定类型" width="110"><template #default="{ row }"><el-tag :type="tagType(row.bindType)" effect="plain">{{ row.bindType }}</el-tag></template></el-table-column>
        <el-table-column prop="waterSystem" label="水处理关联" min-width="130" />
        <el-table-column prop="effectiveDate" label="生效日期" width="120" />
        <el-table-column prop="historyCount" label="历史次数" width="90" />
        <el-table-column prop="status" label="状态" width="95"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="owner" label="责任人" width="130" />
        <el-table-column prop="nextAction" label="下一步" min-width="130" />
        <el-table-column label="操作" width="220" fixed="right"><template #default="{ row }"><el-button link type="primary" @click.stop="selectRow(row); bindDialogVisible = true">调整</el-button><el-button link type="warning" @click.stop="selectRow(row); unbindDialogVisible = true">解绑</el-button><el-button link @click.stop="selectRow(row); traceDrawerVisible = true">追溯</el-button></template></el-table-column>
      </el-table>
    </el-card>    <el-dialog v-model="bindDialogVisible" title="设备机位绑定" width="660px"><el-form label-width="110px"><el-form-item label="设备"><el-input :model-value="currentRow.device" /></el-form-item><el-form-item label="绑定机位"><el-input :model-value="currentRow.bed" /></el-form-item><el-form-item label="绑定类型"><el-radio-group :model-value="currentRow.bindType"><el-radio-button label="固定绑定">固定绑定</el-radio-button><el-radio-button label="隔离绑定">隔离绑定</el-radio-button><el-radio-button label="系统绑定">系统绑定</el-radio-button><el-radio-button label="水处理关联">水处理关联</el-radio-button></el-radio-group></el-form-item><el-form-item label="供水系统"><el-input :model-value="currentRow.waterSystem" placeholder="关联RO系统、供水回路或备用水处理" /></el-form-item><el-form-item label="当前状态"><el-select :model-value="currentRow.status"><el-option label="生效" value="生效" /><el-option label="待复核" value="待复核" /><el-option label="暂停" value="暂停" /></el-select></el-form-item><el-form-item label="生效日期"><el-date-picker type="date" placeholder="选择生效日期" /></el-form-item><el-form-item label="绑定说明"><el-input type="textarea" :rows="3" placeholder="记录绑定原因、水处理关联、设备位置和复核要求" /></el-form-item></el-form><template #footer><el-button @click="bindDialogVisible = false">取消</el-button><el-button type="primary" @click="bindDialogVisible = false; submitAction('设备绑定已提交复核')">提交绑定</el-button></template></el-dialog>
    <el-dialog v-model="unbindDialogVisible" title="解绑或暂停绑定" width="580px"><el-form label-width="110px"><el-form-item label="当前绑定"><el-input :model-value="`${currentRow.device} / ${currentRow.bed}`" disabled /></el-form-item><el-form-item label="处理结果"><el-radio-group model-value="pause"><el-radio-button label="pause">暂停</el-radio-button><el-radio-button label="unbind">解绑</el-radio-button><el-radio-button label="change">换绑</el-radio-button></el-radio-group></el-form-item><el-form-item label="原因"><el-input type="textarea" :rows="3" placeholder="说明维修、迁移、停用或隔离调整原因" /></el-form-item></el-form><template #footer><el-button @click="unbindDialogVisible = false">取消</el-button><el-button type="primary" @click="unbindDialogVisible = false; submitAction('绑定变更已记录')">保存变更</el-button></template></el-dialog>
    <el-drawer v-model="traceDrawerVisible" title="绑定历史记录" size="520px"><el-timeline><el-timeline-item timestamp="当前绑定" type="primary">{{ currentRow.device }} -> {{ currentRow.bed }}，{{ currentRow.status }}，供水：{{ currentRow.waterSystem }}</el-timeline-item><el-timeline-item timestamp="历史变更">累计 {{ currentRow.historyCount }} 次换绑/暂停/恢复记录，保留 before_json / after_json 审计。</el-timeline-item><el-timeline-item timestamp="2026-05-10" type="warning">设备状态变更触发绑定复核</el-timeline-item><el-timeline-item timestamp="2026-05-14" type="success">有效绑定同步至排班、巡检、水质影响范围和上机核对</el-timeline-item></el-timeline></el-drawer>
  </section>
</template>
