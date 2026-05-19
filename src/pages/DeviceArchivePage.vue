<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, FirstAidKit, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();
type Row = { id: string; device: string; type: string; model: string; serialNo: string; vendor: string; startDate: string; maintainCycle: string; status: string; owner: string; nextAction: string };
const selectedId = ref('DA-001');
const archiveDialogVisible = ref(false);
const maintainDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const rows: Row[] = [
  { id: 'DA-001', device: 'HD-08', type: '透析机', model: 'Fresenius 5008S', serialNo: 'FR-5008-0801', vendor: '费森尤斯', startDate: '2022-03-01', maintainCycle: '季度保养', status: '启用', owner: '技师张强', nextAction: '按期保养' },
  { id: 'DA-002', device: 'HD-12', type: '透析机', model: 'B.Braun Dialog+', serialNo: 'BB-DP-1202', vendor: '贝朗', startDate: '2021-11-10', maintainCycle: '季度保养', status: '启用', owner: '技师刘敏', nextAction: '消毒复核' },
  { id: 'DA-003', device: 'HD-23', type: '透析机', model: 'Nikkiso DBB-07', serialNo: 'NK-DBB-2303', vendor: '尼普洛', startDate: '2020-08-18', maintainCycle: '月度校准', status: '维修中', owner: '技师王磊', nextAction: '维修验收' },
  { id: 'DA-004', device: 'HD-27', type: '透析机', model: 'Fresenius 4008S', serialNo: 'FR-4008-2704', vendor: '费森尤斯', startDate: '2020-05-20', maintainCycle: '月度校准', status: '启用', owner: '技师张强', nextAction: '按期保养' },
  { id: 'DA-005', device: 'HD-42', type: '透析机', model: 'B.Braun Dialog+', serialNo: 'BB-DP-4205', vendor: '贝朗', startDate: '2023-01-15', maintainCycle: '季度保养', status: '待复核', owner: '技师刘敏', nextAction: '巡检补录' },
  { id: 'DA-006', device: 'ISO-01', type: '隔离透析机', model: 'Fresenius 5008S', serialNo: 'FR-ISO-0106', vendor: '费森尤斯', startDate: '2022-06-01', maintainCycle: '月度校准', status: '启用', owner: '技师王磊', nextAction: '终末消毒复核' },
  { id: 'DA-007', device: 'RO-A', type: '水处理系统', model: 'DWA RO-2000', serialNo: 'DWA-ROA-0707', vendor: 'DWA', startDate: '2019-09-01', maintainCycle: '月度保养', status: '待复核', owner: '水处理技师赵丽', nextAction: '水质复测' },
  { id: 'DA-008', device: 'MIX-01', type: '配液系统', model: 'Baxter Mix', serialNo: 'BX-MIX-0808', vendor: '百特', startDate: '2021-04-01', maintainCycle: '月度校准', status: '启用', owner: '技师张强', nextAction: '浓度复核' },
  { id: 'DA-009', device: 'HD-31', type: '透析机', model: 'Nikkiso DBB-07', serialNo: 'NK-DBB-3109', vendor: '尼普洛', startDate: '2022-10-10', maintainCycle: '季度保养', status: '启用', owner: '技师刘敏', nextAction: '按期保养' },
  { id: 'DA-010', device: 'RO-B', type: '水处理系统', model: 'DWA RO-1500', serialNo: 'DWA-ROB-1010', vendor: 'DWA', startDate: '2024-02-01', maintainCycle: '启用前检测', status: '待启用', owner: '水处理技师赵丽', nextAction: '启用验收' },
];
const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['device_archive', 'device_maintenance_plan', 'device_certificate', 'device_audit_log'];
const metrics = computed(() => [
  { label: '设备档案', value: rows.length, tone: 'blue' },
  { label: '启用', value: rows.filter((item) => item.status === '启用').length, tone: 'green' },
  { label: '待复核', value: rows.filter((item) => item.status.includes('待')).length, tone: 'orange' },
  { label: '维修中', value: rows.filter((item) => item.status === '维修中').length, tone: 'red' },
  { label: '水处理设备', value: rows.filter((item) => item.type.includes('水处理')).length, tone: 'blue' },
]);
function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' { if (['启用', '按期保养'].includes(value)) return 'success'; if (value === '维修中') return 'danger'; if (value.includes('待') || value.includes('复核') || value.includes('验收')) return 'warning'; return 'info'; }
function selectRow(row: Row): void { selectedId.value = row.id; }
function submitAction(message: string): void { ElMessage.success(message); }
</script>

<template>
  <section class="device-water-page">
    <el-card class="device-work-card" shadow="never">
      <template #header><div class="device-header"><div><h2>{{ props.context.menuTitle }}</h2><p>维护设备基础档案、序列号、厂商、启用日期、保养周期和证照状态，作为维修、质控和接口采集的基础。</p></div><div class="device-actions"><el-button type="primary" :icon="FirstAidKit" @click="archiveDialogVisible = true">新增档案</el-button><el-button :icon="Warning" @click="maintainDialogVisible = true">保养计划</el-button><el-button :icon="CircleCheck" @click="traceDrawerVisible = true">档案追溯</el-button></div></div></template>
      <el-form class="device-filter" inline><el-form-item label="关键字"><el-input placeholder="设备、型号、序列号、厂商" clearable /></el-form-item><el-form-item label="设备类型"><el-select placeholder="全部类型" clearable><el-option label="透析机" value="透析机" /><el-option label="水处理系统" value="水处理系统" /><el-option label="配液系统" value="配液系统" /></el-select></el-form-item><el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="启用" value="启用" /><el-option label="待复核" value="待复核" /><el-option label="维修中" value="维修中" /></el-select></el-form-item><el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item></el-form>
      <div class="device-stat-grid"><el-card v-for="item in metrics" :key="item.label" :class="['device-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>
      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow">
        <el-table-column prop="device" label="设备编号" width="100" fixed="left" />
        <el-table-column prop="type" label="类型" width="110" />
        <el-table-column prop="model" label="品牌型号" min-width="150" />
        <el-table-column prop="serialNo" label="序列号" min-width="140" />
        <el-table-column prop="vendor" label="厂商" width="100" />
        <el-table-column prop="startDate" label="启用日期" width="115" />
        <el-table-column prop="maintainCycle" label="保养周期" width="110" />
        <el-table-column prop="status" label="状态" width="95"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="owner" label="责任人" width="130" />
        <el-table-column prop="nextAction" label="下一步" min-width="120" />
        <el-table-column label="操作" width="220" fixed="right"><template #default="{ row }"><el-button link type="primary" @click.stop="selectRow(row); archiveDialogVisible = true">编辑</el-button><el-button link @click.stop="selectRow(row); maintainDialogVisible = true">保养</el-button><el-button link @click.stop="selectRow(row); traceDrawerVisible = true">追溯</el-button></template></el-table-column>
      </el-table>
    </el-card>    <el-dialog v-model="archiveDialogVisible" title="设备档案维护" width="660px"><el-form label-width="110px"><el-form-item label="设备编号"><el-input :model-value="currentRow.device" /></el-form-item><el-form-item label="设备类型"><el-select :model-value="currentRow.type"><el-option label="透析机" value="透析机" /><el-option label="水处理系统" value="水处理系统" /><el-option label="配液系统" value="配液系统" /></el-select></el-form-item><el-form-item label="品牌型号"><el-input :model-value="currentRow.model" /></el-form-item><el-form-item label="序列号"><el-input :model-value="currentRow.serialNo" /></el-form-item><el-form-item label="启用日期"><el-date-picker type="date" placeholder="选择启用日期" /></el-form-item><el-form-item label="档案说明"><el-input type="textarea" :rows="3" placeholder="记录证照、验收、质保和归档说明" /></el-form-item></el-form><template #footer><el-button @click="archiveDialogVisible = false">取消</el-button><el-button type="primary" @click="archiveDialogVisible = false; submitAction('设备档案已保存')">保存档案</el-button></template></el-dialog>
    <el-dialog v-model="maintainDialogVisible" title="保养计划维护" width="620px"><el-form label-width="110px"><el-form-item label="设备"><el-input :model-value="currentRow.device" disabled /></el-form-item><el-form-item label="保养周期"><el-select :model-value="currentRow.maintainCycle"><el-option label="月度校准" value="月度校准" /><el-option label="季度保养" value="季度保养" /><el-option label="启用前检测" value="启用前检测" /></el-select></el-form-item><el-form-item label="下次日期"><el-date-picker type="date" placeholder="选择下次保养日期" /></el-form-item><el-form-item label="保养项目"><el-input type="textarea" :rows="3" placeholder="记录校准、耗材更换、压力测试和水路检测项目" /></el-form-item></el-form><template #footer><el-button @click="maintainDialogVisible = false">取消</el-button><el-button type="primary" @click="maintainDialogVisible = false; submitAction('保养计划已更新')">保存计划</el-button></template></el-dialog>
    <el-drawer v-model="traceDrawerVisible" title="档案审计追溯" size="520px"><el-timeline><el-timeline-item timestamp="建档">录入设备基础资料：{{ currentRow.device }}</el-timeline-item><el-timeline-item timestamp="维保计划" type="primary">生成 {{ currentRow.maintainCycle }} 任务</el-timeline-item><el-timeline-item timestamp="业务引用" type="success">被绑定、巡检、维修和质控页面引用</el-timeline-item></el-timeline></el-drawer>
  </section>
</template>
