<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();

type BedRow = { id: string; bedNo: string; bedName: string; zone: string; nursingGroup: string; bedType: string; isolationType: string; device: string; status: string; owner: string; updateTime: string; nextAction: string };
const selectedId = ref('BED-001');
const bedDialogVisible = ref(false);
const statusDialogVisible = ref(false);
const traceDrawerVisible = ref(false);

const rows: BedRow[] = [
  { id: 'BED-001', bedNo: 'A01', bedName: 'A区1号机位', zone: 'A区', nursingGroup: '一组', bedType: '普通机位', isolationType: '无', device: 'HD-01', status: '启用', owner: '技师张强', updateTime: '2026-05-14 07:30', nextAction: '可排班' },
  { id: 'BED-002', bedNo: 'A08', bedName: 'A区8号机位', zone: 'A区', nursingGroup: '一组', bedType: '普通机位', isolationType: '无', device: 'HD-08', status: '启用', owner: '技师张强', updateTime: '2026-05-14 07:35', nextAction: '治疗中监测' },
  { id: 'BED-003', bedNo: 'A12', bedName: 'A区12号机位', zone: 'A区', nursingGroup: '二组', bedType: '普通机位', isolationType: '无', device: 'HD-12', status: '待复核', owner: '技师刘敏', updateTime: '2026-05-14 07:42', nextAction: '补消毒' },
  { id: 'BED-004', bedNo: 'B03', bedName: 'B区3号机位', zone: 'B区', nursingGroup: '二组', bedType: '普通机位', isolationType: '无', device: 'HD-23', status: '停用', owner: '技师王磊', updateTime: '2026-05-14 08:10', nextAction: '维修完成后启用' },
  { id: 'BED-005', bedNo: 'B07', bedName: 'B区7号机位', zone: 'B区', nursingGroup: '三组', bedType: '普通机位', isolationType: '无', device: 'HD-27', status: '启用', owner: '技师张强', updateTime: '2026-05-14 07:36', nextAction: '可排班' },
  { id: 'BED-006', bedNo: 'B11', bedName: 'B区11号机位', zone: 'B区', nursingGroup: '三组', bedType: '普通机位', isolationType: '无', device: 'HD-31', status: '启用', owner: '技师刘敏', updateTime: '2026-05-14 07:39', nextAction: '可排班' },
  { id: 'BED-007', bedNo: 'C02', bedName: 'C区2号备用机位', zone: 'C区', nursingGroup: '四组', bedType: '备用机位', isolationType: '无', device: 'HD-42', status: '待复核', owner: '技师刘敏', updateTime: '2026-05-14 08:03', nextAction: '补巡检' },
  { id: 'BED-008', bedNo: 'C06', bedName: 'C区6号急诊机位', zone: 'C区', nursingGroup: '四组', bedType: '急诊机位', isolationType: '无', device: 'HD-46', status: '启用', owner: '技师王磊', updateTime: '2026-05-14 07:50', nextAction: '参数复核' },
  { id: 'BED-009', bedNo: 'I01', bedName: '隔离区乙肝机位', zone: '隔离区', nursingGroup: '隔离组', bedType: '隔离机位', isolationType: '乙肝', device: 'ISO-01', status: '启用', owner: '技师王磊', updateTime: '2026-05-14 07:45', nextAction: '终末消毒复核' },
  { id: 'BED-010', bedNo: 'I02', bedName: '隔离区丙肝机位', zone: '隔离区', nursingGroup: '隔离组', bedType: '隔离机位', isolationType: '丙肝', device: 'ISO-02', status: '停用', owner: '技师赵丽', updateTime: '2026-05-13 18:20', nextAction: '隔离标识复核' },
];

const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['dialysis_bed', 'bed_zone', 'bed_isolation_rule', 'device_bed_binding'];
const metrics = computed(() => [
  { label: '机位数', value: rows.length, tone: 'blue' },
  { label: '启用', value: rows.filter((item) => item.status === '启用').length, tone: 'green' },
  { label: '待复核', value: rows.filter((item) => item.status === '待复核').length, tone: 'orange' },
  { label: '停用', value: rows.filter((item) => item.status === '停用').length, tone: 'red' },
  { label: '隔离机位', value: rows.filter((item) => item.zone === '隔离区').length, tone: 'orange' },
  { label: '备用/急诊', value: rows.filter((item) => ['备用机位', '急诊机位'].includes(item.bedType)).length, tone: 'blue' },
]);

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (['启用', '可排班', '无'].includes(value)) return 'success';
  if (['停用'].includes(value)) return 'danger';
  if (value.includes('待') || value.includes('隔离') || value.includes('复核') || value.includes('补')) return 'warning';
  return 'info';
}
function selectRow(row: BedRow): void { selectedId.value = row.id; }
function submitAction(message: string): void { ElMessage.success(message); }
</script>

<template>
  <section class="device-water-page">
    <el-card class="device-work-card" shadow="never">
      <template #header><div class="device-header"><div><h2>{{ props.context.menuTitle }}</h2><p>维护透析机位、隔离属性、可用状态和责任技师，供排班排床、设备绑定和上机核对引用。</p></div><div class="device-actions"><el-button type="primary" :icon="CircleCheck" @click="bedDialogVisible = true">维护机位</el-button><el-button :icon="Warning" @click="statusDialogVisible = true">状态调整</el-button><el-button @click="traceDrawerVisible = true">变更追溯</el-button></div></div></template>
      <el-form class="device-filter" inline><el-form-item label="关键字"><el-input placeholder="机位、分区、护理组、设备、责任人" clearable /></el-form-item><el-form-item label="分区"><el-select placeholder="全部分区" clearable><el-option label="A区" value="A区" /><el-option label="B区" value="B区" /><el-option label="C区" value="C区" /><el-option label="隔离区" value="隔离区" /></el-select></el-form-item><el-form-item label="机位类型"><el-select placeholder="全部类型" clearable><el-option label="普通机位" value="普通机位" /><el-option label="隔离机位" value="隔离机位" /><el-option label="备用机位" value="备用机位" /><el-option label="急诊机位" value="急诊机位" /></el-select></el-form-item><el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="启用" value="启用" /><el-option label="待复核" value="待复核" /><el-option label="停用" value="停用" /></el-select></el-form-item><el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item></el-form>
      <div class="device-stat-grid"><el-card v-for="item in metrics" :key="item.label" :class="['device-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>
      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow">
        <el-table-column prop="bedNo" label="机位" width="90" fixed="left" />
        <el-table-column prop="bedName" label="机位名称" min-width="135" />
        <el-table-column prop="zone" label="分区" width="90" />
        <el-table-column prop="nursingGroup" label="所属护理组" width="105" />
        <el-table-column prop="bedType" label="机位类型" width="110" />
        <el-table-column prop="isolationType" label="隔离属性" width="100"><template #default="{ row }"><el-tag :type="tagType(row.isolationType)" effect="plain">{{ row.isolationType }}</el-tag></template></el-table-column>
        <el-table-column prop="device" label="绑定设备" width="110" />
        <el-table-column prop="status" label="状态" width="100"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="owner" label="责任人" width="120" />
        <el-table-column prop="updateTime" label="更新时间" width="150" />
        <el-table-column prop="nextAction" label="下一步" min-width="130" />
        <el-table-column label="操作" width="210" fixed="right"><template #default="{ row }"><el-button link type="primary" @click.stop="selectRow(row); bedDialogVisible = true">维护</el-button><el-button link @click.stop="selectRow(row); statusDialogVisible = true">调整</el-button><el-button link @click.stop="selectRow(row); traceDrawerVisible = true">追溯</el-button></template></el-table-column>
      </el-table>
    </el-card>    <el-dialog v-model="bedDialogVisible" title="机位资料维护" width="660px"><el-form label-width="110px"><el-form-item label="机位编号"><el-input :model-value="currentRow.bedNo" /></el-form-item><el-form-item label="机位名称"><el-input :model-value="currentRow.bedName" /></el-form-item><el-form-item label="所属分区"><el-select :model-value="currentRow.zone"><el-option label="A区" value="A区" /><el-option label="B区" value="B区" /><el-option label="C区" value="C区" /><el-option label="隔离区" value="隔离区" /></el-select></el-form-item><el-form-item label="所属护理组"><el-select :model-value="currentRow.nursingGroup"><el-option label="一组" value="一组" /><el-option label="二组" value="二组" /><el-option label="三组" value="三组" /><el-option label="四组" value="四组" /><el-option label="隔离组" value="隔离组" /></el-select></el-form-item><el-form-item label="机位类型"><el-radio-group :model-value="currentRow.bedType"><el-radio-button label="普通机位">普通</el-radio-button><el-radio-button label="隔离机位">隔离</el-radio-button><el-radio-button label="备用机位">备用</el-radio-button><el-radio-button label="急诊机位">急诊</el-radio-button></el-radio-group></el-form-item><el-form-item label="隔离属性"><el-checkbox-group><el-checkbox label="乙肝" /><el-checkbox label="丙肝" /><el-checkbox label="HIV" /><el-checkbox label="无" /></el-checkbox-group></el-form-item><el-form-item label="维护说明"><el-input type="textarea" :rows="3" placeholder="记录机位用途、护理组归属、隔离规则和变更原因" /></el-form-item></el-form><template #footer><el-button @click="bedDialogVisible = false">取消</el-button><el-button type="primary" @click="bedDialogVisible = false; submitAction('机位资料已保存')">保存</el-button></template></el-dialog>
    <el-dialog v-model="statusDialogVisible" title="机位状态调整" width="580px"><el-form label-width="110px"><el-form-item label="机位"><el-input :model-value="`${currentRow.zone} / ${currentRow.bedNo}`" disabled /></el-form-item><el-form-item label="调整结果"><el-radio-group model-value="enable"><el-radio-button label="enable">启用</el-radio-button><el-radio-button label="review">待复核</el-radio-button><el-radio-button label="stop">停用</el-radio-button></el-radio-group></el-form-item><el-form-item label="原因"><el-input type="textarea" :rows="3" placeholder="说明停用、复核或恢复启用原因" /></el-form-item></el-form><template #footer><el-button @click="statusDialogVisible = false">取消</el-button><el-button type="primary" @click="statusDialogVisible = false; submitAction('机位状态已调整')">提交调整</el-button></template></el-dialog>
    <el-drawer v-model="traceDrawerVisible" title="机位变更追溯" size="520px"><el-timeline><el-timeline-item timestamp="2026-05-13">更新隔离标识和责任技师</el-timeline-item><el-timeline-item timestamp="2026-05-14" type="primary">排班前完成状态复核：{{ currentRow.bedNo }}</el-timeline-item><el-timeline-item timestamp="排班引用" type="success">可用状态写入排班排床</el-timeline-item></el-timeline></el-drawer>
  </section>
</template>
