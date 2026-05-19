<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();
type Row = { id: string; resource: string; type: string; scope: string; total: string; available: string; risk: string; owner: string; status: string; nextAction: string };
const selectedId = ref('RES-001');
const resourceDialogVisible = ref(false);
const limitDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const rows: Row[] = [
  { id: 'RES-001', resource: '普通治疗区A', type: '机位资源', scope: 'A01-A16', total: '16机位', available: '15可用', risk: 'HD-12待消毒', owner: '设备组', status: '部分受限', nextAction: '调整排班' },
  { id: 'RES-002', resource: '普通治疗区B', type: '机位资源', scope: 'B01-B18', total: '18机位', available: '17可用', risk: 'HD-23维修', owner: '设备组', status: '部分受限', nextAction: '禁用B03' },
  { id: 'RES-003', resource: '普通治疗区C', type: '机位资源', scope: 'C01-C14', total: '14机位', available: '13可用', risk: '巡检待补', owner: '设备组', status: '待复核', nextAction: '补巡检' },
  { id: 'RES-004', resource: '乙肝隔离区', type: '隔离资源', scope: 'I01-I04', total: '4机位', available: '4可用', risk: '正常', owner: '感控管理', status: '可用', nextAction: '隔离排班' },
  { id: 'RES-005', resource: '丙肝隔离区', type: '隔离资源', scope: 'I05-I08', total: '4机位', available: '3可用', risk: 'I02停用', owner: '感控管理', status: '部分受限', nextAction: '替换机位' },
  { id: 'RES-006', resource: '急诊备用区', type: '备用资源', scope: 'E01-E04', total: '4机位', available: '3可用', risk: 'RO-B待启用', owner: '医务科', status: '待复核', nextAction: '设备复核' },
  { id: 'RES-007', resource: '水处理系统', type: '系统资源', scope: 'RO-A/RO-B', total: '2套', available: '1套可用', risk: 'RO-A电导率偏高', owner: '水处理技师赵丽', status: '风险', nextAction: '水质复测' },
  { id: 'RES-008', resource: '配液系统', type: '系统资源', scope: 'MIX-01', total: '1套', available: '1套可用', risk: '正常', owner: '技师张强', status: '可用', nextAction: '浓度复核' },
  { id: 'RES-009', resource: '医生值班池', type: '人员资源', scope: '主诊/总值班', total: '12人', available: '10人可用', risk: '2人培训', owner: '医务科', status: '可用', nextAction: '排班引用' },
  { id: 'RES-010', resource: '护理人力池', type: '人员资源', scope: '护士站', total: '46人', available: '42人可用', risk: '4人休假', owner: '护理部', status: '可用', nextAction: '护理组引用' },
];
const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['bed_station', 'bed_zone', 'device_archive', 'device_alert', 'staff_profile'];
const metrics = computed(() => [
  { label: '资源项', value: rows.length, tone: 'blue' },
  { label: '可用', value: rows.filter((item) => item.status === '可用').length, tone: 'green' },
  { label: '待复核/受限', value: rows.filter((item) => item.status.includes('复核') || item.status.includes('受限')).length, tone: 'orange' },
  { label: '风险', value: rows.filter((item) => item.status === '风险').length, tone: 'purple' },
]);
function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' { if (['可用', '正常', '排班引用'].includes(value)) return 'success'; if (value === '风险' || value.includes('偏高')) return 'danger'; if (value.includes('待') || value.includes('受限') || value.includes('维修') || value.includes('复核')) return 'warning'; return 'info'; }
function selectRow(row: Row): void { selectedId.value = row.id; }
function submitAction(message: string): void { ElMessage.success(message); }
</script>

<template>
  <section class="medical-affairs-page">
    <el-card class="medical-work-card" shadow="never">
      <template #header><div class="medical-work-header"><div><h2>{{ props.context.menuTitle }}</h2><p>查看机位、隔离区、系统设备和人力资源的可用状态，为导诊预约、排班排床和上机放行提供统一口径。</p></div><div class="medical-actions"><el-button type="primary" :icon="CircleCheck" @click="resourceDialogVisible = true">资源维护</el-button><el-button :icon="Warning" @click="limitDialogVisible = true">限制处理</el-button><el-button @click="traceDrawerVisible = true">资源追溯</el-button></div></div></template>
      <el-form class="medical-filter" inline><el-form-item label="关键字"><el-input placeholder="资源、范围、风险、责任人" clearable /></el-form-item><el-form-item label="类型"><el-select placeholder="全部类型" clearable><el-option label="机位资源" value="机位资源" /><el-option label="隔离资源" value="隔离资源" /><el-option label="系统资源" value="系统资源" /><el-option label="人员资源" value="人员资源" /></el-select></el-form-item><el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="可用" value="可用" /><el-option label="部分受限" value="部分受限" /><el-option label="待复核" value="待复核" /><el-option label="风险" value="风险" /></el-select></el-form-item><el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item></el-form>
      <div class="medical-stat-grid"><el-card v-for="item in metrics" :key="item.label" :class="['medical-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>
      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow"><el-table-column prop="resource" label="资源对象" min-width="140" fixed="left" /><el-table-column prop="type" label="类型" width="105" /><el-table-column prop="scope" label="范围" width="130" /><el-table-column prop="total" label="总量" width="100" /><el-table-column prop="available" label="可用" width="100" /><el-table-column prop="risk" label="风险" min-width="140"><template #default="{ row }"><el-tag :type="tagType(row.risk)" effect="plain">{{ row.risk }}</el-tag></template></el-table-column><el-table-column prop="owner" label="责任人" width="130" /><el-table-column prop="status" label="状态" width="100"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column><el-table-column prop="nextAction" label="下一步" min-width="120" /><el-table-column label="操作" width="220" fixed="right"><template #default="{ row }"><el-button link type="primary" @click.stop="selectRow(row); resourceDialogVisible = true">维护</el-button><el-button link @click.stop="selectRow(row); limitDialogVisible = true">限制</el-button><el-button link @click.stop="selectRow(row); traceDrawerVisible = true">追溯</el-button></template></el-table-column></el-table>
    </el-card>    <el-dialog v-model="resourceDialogVisible" title="科室资源维护" width="620px"><el-form label-width="110px"><el-form-item label="资源对象"><el-input :model-value="currentRow.resource" /></el-form-item><el-form-item label="可用数量"><el-input :model-value="currentRow.available" /></el-form-item><el-form-item label="责任人"><el-input :model-value="currentRow.owner" /></el-form-item><el-form-item label="维护说明"><el-input type="textarea" :rows="3" placeholder="记录资源来源、可用范围和同步口径" /></el-form-item></el-form><template #footer><el-button @click="resourceDialogVisible = false">取消</el-button><el-button type="primary" @click="resourceDialogVisible = false; submitAction('科室资源已保存')">保存资源</el-button></template></el-dialog>
    <el-dialog v-model="limitDialogVisible" title="资源限制处理" width="600px"><el-form label-width="110px"><el-form-item label="资源风险"><el-input :model-value="`${currentRow.resource} / ${currentRow.risk}`" disabled /></el-form-item><el-form-item label="限制范围"><el-checkbox-group><el-checkbox label="预约审核" /><el-checkbox label="排班排床" /><el-checkbox label="上机核对" /><el-checkbox label="看板预警" /></el-checkbox-group></el-form-item><el-form-item label="处理说明"><el-input type="textarea" :rows="3" placeholder="说明限制原因、预计恢复时间和责任处理人" /></el-form-item></el-form><template #footer><el-button @click="limitDialogVisible = false">取消</el-button><el-button type="primary" @click="limitDialogVisible = false; submitAction('资源限制已更新')">提交限制</el-button></template></el-dialog>
    <el-drawer v-model="traceDrawerVisible" title="资源状态追溯" size="520px"><el-timeline><el-timeline-item timestamp="资源汇总">对象：{{ currentRow.resource }}</el-timeline-item><el-timeline-item timestamp="风险处理" type="warning">状态：{{ currentRow.status }}，下一步：{{ currentRow.nextAction }}</el-timeline-item><el-timeline-item timestamp="业务输出" type="success">同步导诊、排班、治疗和看板</el-timeline-item></el-timeline></el-drawer>
  </section>
</template>
