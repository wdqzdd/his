<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, DataLine, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();

type Row = {
  id: string;
  area: string;
  device: string;
  bed: string;
  runStatus: string;
  releaseStatus: string;
  waterStatus: string;
  alert: string;
  owner: string;
  nextAction: string;
};

const selectedId = ref('DH-001');
const releaseDialogVisible = ref(false);
const alertDialogVisible = ref(false);
const traceDrawerVisible = ref(false);

const rows: Row[] = [
  { id: 'DH-001', area: 'A区', device: 'HD-08', bed: 'A08', runStatus: '运行中', releaseStatus: '已放行', waterStatus: '合格', alert: '无', owner: '技师张强', nextAction: '继续监测' },
  { id: 'DH-002', area: 'A区', device: 'HD-12', bed: 'A12', runStatus: '待机', releaseStatus: '待复核', waterStatus: '合格', alert: '消毒缺项', owner: '技师刘敏', nextAction: '补消毒记录' },
  { id: 'DH-003', area: 'B区', device: 'HD-23', bed: 'B03', runStatus: '停用', releaseStatus: '禁止上机', waterStatus: '合格', alert: '压力传感异常', owner: '技师王磊', nextAction: '维修复核' },
  { id: 'DH-004', area: 'B区', device: 'HD-27', bed: 'B07', runStatus: '运行中', releaseStatus: '已放行', waterStatus: '合格', alert: '无', owner: '技师张强', nextAction: '继续监测' },
  { id: 'DH-005', area: 'C区', device: 'HD-42', bed: 'C02', runStatus: '待机', releaseStatus: '待复核', waterStatus: '合格', alert: '巡检缺项', owner: '技师刘敏', nextAction: '补巡检' },
  { id: 'DH-006', area: '隔离区', device: 'ISO-01', bed: 'I01', runStatus: '运行中', releaseStatus: '已放行', waterStatus: '合格', alert: '隔离消毒复核', owner: '技师王磊', nextAction: '终末复核' },
  { id: 'DH-007', area: '水处理间', device: 'RO-A', bed: '系统设备', runStatus: '运行中', releaseStatus: '待复核', waterStatus: '电导率偏高', alert: '水质异常', owner: '水处理技师赵丽', nextAction: '水质复测' },
  { id: 'DH-008', area: '配液间', device: 'MIX-01', bed: '系统设备', runStatus: '运行中', releaseStatus: '已放行', waterStatus: '合格', alert: '无', owner: '技师张强', nextAction: '继续监测' },
  { id: 'DH-009', area: 'B区', device: 'HD-31', bed: 'B11', runStatus: '待机', releaseStatus: '已放行', waterStatus: '合格', alert: '无', owner: '技师刘敏', nextAction: '可排班' },
  { id: 'DH-010', area: 'C区', device: 'HD-46', bed: 'C06', runStatus: '运行中', releaseStatus: '已放行', waterStatus: '合格', alert: '静脉压波动', owner: '技师王磊', nextAction: '参数复核' },
];

const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['device_archive', 'device_bed_binding', 'device_release_log', 'device_alert', 'water_quality_record'];
const metrics = computed(() => [
  { label: '设备总数', value: rows.length, tone: 'blue' },
  { label: '已放行', value: rows.filter((item) => item.releaseStatus === '已放行').length, tone: 'green' },
  { label: '待复核', value: rows.filter((item) => item.releaseStatus === '待复核').length, tone: 'orange' },
  { label: '禁止上机', value: rows.filter((item) => item.releaseStatus === '禁止上机').length, tone: 'red' },
  { label: '水质异常', value: rows.filter((item) => item.waterStatus !== '合格').length, tone: 'red' },
]);

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (['运行中', '已放行', '合格', '无', '可排班'].includes(value)) return 'success';
  if (['禁止上机', '停用', '水质异常'].includes(value) || value.includes('异常')) return 'danger';
  if (value.includes('待') || value.includes('复核') || value.includes('缺项') || value.includes('波动') || value.includes('偏高')) return 'warning';
  return 'info';
}

function selectRow(row: Row): void {
  selectedId.value = row.id;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}
</script>

<template>
  <section class="device-water-page">
    <el-card class="device-work-card" shadow="never">
      <template #header>
        <div class="device-header">
          <div>
            <h2>{{ props.context.menuTitle }}</h2>
            <p>汇总设备运行、水质、消毒、维修和上机放行状态，异常会影响排班和护士上机核对。</p>
          </div>
          <div class="device-actions">
            <el-button type="primary" :icon="CircleCheck" @click="releaseDialogVisible = true">放行复核</el-button>
            <el-button :icon="Warning" @click="alertDialogVisible = true">异常处理</el-button>
            <el-button :icon="DataLine" @click="traceDrawerVisible = true">运行追溯</el-button>
          </div>
        </div>
      </template>

      <el-form class="device-filter" inline>
        <el-form-item label="关键字"><el-input placeholder="设备、机位、分区、责任人" clearable /></el-form-item>
        <el-form-item label="分区"><el-select placeholder="全部分区" clearable><el-option label="A区" value="A区" /><el-option label="B区" value="B区" /><el-option label="C区" value="C区" /><el-option label="隔离区" value="隔离区" /></el-select></el-form-item>
        <el-form-item label="放行状态"><el-select placeholder="全部状态" clearable><el-option label="已放行" value="已放行" /><el-option label="待复核" value="待复核" /><el-option label="禁止上机" value="禁止上机" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <div class="device-stat-grid">
        <el-card v-for="item in metrics" :key="item.label" :class="['device-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card>
      </div>

      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow">
        <el-table-column prop="area" label="分区" width="90" fixed="left" />
        <el-table-column prop="device" label="设备" width="100" />
        <el-table-column prop="bed" label="机位/位置" width="110" />
        <el-table-column prop="runStatus" label="运行" width="90"><template #default="{ row }"><el-tag :type="tagType(row.runStatus)">{{ row.runStatus }}</el-tag></template></el-table-column>
        <el-table-column prop="releaseStatus" label="放行" width="100"><template #default="{ row }"><el-tag :type="tagType(row.releaseStatus)">{{ row.releaseStatus }}</el-tag></template></el-table-column>
        <el-table-column prop="waterStatus" label="水质" width="110"><template #default="{ row }"><el-tag :type="tagType(row.waterStatus)" effect="plain">{{ row.waterStatus }}</el-tag></template></el-table-column>
        <el-table-column prop="alert" label="预警" min-width="130"><template #default="{ row }"><el-tag :type="tagType(row.alert)" effect="plain">{{ row.alert }}</el-tag></template></el-table-column>
        <el-table-column prop="owner" label="责任人" width="130" />
        <el-table-column prop="nextAction" label="下一步" min-width="120" />
        <el-table-column label="操作" width="210" fixed="right"><template #default="{ row }"><el-button link type="primary" @click.stop="selectRow(row); releaseDialogVisible = true">放行</el-button><el-button link type="warning" @click.stop="selectRow(row); alertDialogVisible = true">处理</el-button><el-button link @click.stop="selectRow(row); traceDrawerVisible = true">追溯</el-button></template></el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="releaseDialogVisible" title="设备放行复核" width="620px">
      <el-alert type="warning" show-icon :closable="false" title="放行前必须同时核对巡检、消毒、水质、维修和绑定状态。" />
      <el-form class="dialog-form" label-width="110px">
        <el-form-item label="设备机位"><el-input :model-value="`${currentRow.device} / ${currentRow.bed}`" disabled /></el-form-item>
        <el-form-item label="复核结论"><el-radio-group model-value="pass"><el-radio-button label="pass">允许上机</el-radio-button><el-radio-button label="review">继续复核</el-radio-button><el-radio-button label="block">禁止上机</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="复核意见"><el-input type="textarea" :rows="3" placeholder="记录巡检、消毒、水质和维修复核意见" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="releaseDialogVisible = false">取消</el-button><el-button type="primary" @click="releaseDialogVisible = false; submitAction('设备放行状态已更新')">提交复核</el-button></template>
    </el-dialog>

    <el-dialog v-model="alertDialogVisible" title="设备异常处理" width="620px">
      <el-form label-width="110px">
        <el-form-item label="异常对象"><el-input :model-value="`${currentRow.device} / ${currentRow.alert}`" disabled /></el-form-item>
        <el-form-item label="处理类型"><el-select placeholder="请选择"><el-option label="维修处理" value="repair" /><el-option label="水质复测" value="water" /><el-option label="补消毒记录" value="disinfection" /><el-option label="参数观察" value="monitor" /></el-select></el-form-item>
        <el-form-item label="处理记录"><el-input type="textarea" :rows="3" placeholder="记录原因、处理措施、复核人和下一步" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="alertDialogVisible = false">取消</el-button><el-button type="primary" @click="alertDialogVisible = false; submitAction('异常处理记录已保存')">保存处理</el-button></template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="设备运行追溯" size="520px">
      <el-timeline>
        <el-timeline-item timestamp="07:20" type="primary">完成晨间巡检：{{ currentRow.device }}</el-timeline-item>
        <el-timeline-item timestamp="07:40">核对机位绑定和消毒记录</el-timeline-item>
        <el-timeline-item timestamp="08:00" type="success">放行状态写入排班和上机核对</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
