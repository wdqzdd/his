<script setup lang="ts">
import { computed, ref } from 'vue';
import { DataLine, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();
type Row = { id: string; time: string; device: string; bed: string; metric: string; value: string; range: string; source: string; stopRecord: string; status: string; owner: string; nextAction: string };
const selectedId = ref('MON-001');
const reviewDialogVisible = ref(false);
const alertDialogVisible = ref(false);
const stopDialogVisible = ref(false);
const trendDrawerVisible = ref(false);
const rows: Row[] = [
  { id: 'MON-001', time: '08:00', device: 'HD-08', bed: 'A08', metric: '静脉压', value: '148 mmHg', range: '80-180', source: '透析机联机', stopRecord: '无', status: '正常', owner: '技师张强', nextAction: '继续监测' },
  { id: 'MON-002', time: '08:20', device: 'HD-12', bed: 'A12', metric: '跨膜压', value: '56 mmHg', range: '20-80', source: '透析机联机', stopRecord: '无', status: '正常', owner: '技师刘敏', nextAction: '继续监测' },
  { id: 'MON-003', time: '08:40', device: 'HD-23', bed: 'B03', metric: '压力传感', value: '报警', range: '无报警', source: '透析机联机', stopRecord: '已停机', status: '异常', owner: '技师王磊', nextAction: '维修处理' },
  { id: 'MON-004', time: '09:00', device: 'HD-27', bed: 'B07', metric: '血泵速度', value: '250 ml/min', range: '180-300', source: '透析机联机', stopRecord: '无', status: '正常', owner: '技师张强', nextAction: '继续监测' },
  { id: 'MON-005', time: '09:10', device: 'RO-A', bed: '水处理间', metric: '电导率', value: '19.8 us/cm', range: '<18', source: '水处理采集', stopRecord: '分区临停', status: '偏高', owner: '水处理技师赵丽', nextAction: '水质复测' },
  { id: 'MON-006', time: '09:20', device: 'RO-A', bed: '水处理间', metric: '余氯', value: '0.02 mg/L', range: '<0.1', source: '水处理采集', stopRecord: '无', status: '正常', owner: '水处理技师赵丽', nextAction: '继续监测' },
  { id: 'MON-007', time: '09:30', device: 'MIX-01', bed: '配液间', metric: '配液浓度', value: '合格', range: '合格', source: '配液系统', stopRecord: '无', status: '正常', owner: '技师张强', nextAction: '放行' },
  { id: 'MON-008', time: '09:40', device: 'HD-46', bed: 'C06', metric: '静脉压', value: '205 mmHg', range: '80-180', source: '透析机联机', stopRecord: '观察停机', status: '关注', owner: '技师王磊', nextAction: '参数复核' },
  { id: 'MON-009', time: '10:00', device: 'ISO-01', bed: 'I01', metric: '报警状态', value: '无', range: '无报警', source: '透析机联机', stopRecord: '无', status: '正常', owner: '技师王磊', nextAction: '终末复核' },
  { id: 'MON-010', time: '10:20', device: 'RO-B', bed: '备用水处理', metric: '产水压力', value: '0.22 MPa', range: '0.25-0.35', source: '水处理采集', stopRecord: '启用前停机', status: '偏低', owner: '水处理技师赵丽', nextAction: '启用前复测' },
];
const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['device_metric_record', 'dialysis_machine_online_data', 'device_alert', 'metric_review_log'];
const metrics = computed(() => [
  { label: '监测点', value: rows.length, tone: 'blue' },
  { label: '正常', value: rows.filter((item) => item.status === '正常').length, tone: 'green' },
  { label: '关注', value: rows.filter((item) => item.status === '关注').length, tone: 'orange' },
  { label: '异常', value: rows.filter((item) => item.status === '异常' || item.status.includes('偏')).length, tone: 'red' },
  { label: '水处理指标', value: rows.filter((item) => item.device.includes('RO')).length, tone: 'blue' },
  { label: '停机记录', value: rows.filter((item) => item.stopRecord !== '无').length, tone: 'red' },
]);
function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' { if (['正常', '合格', '放行', '继续监测'].includes(value)) return 'success'; if (value === '异常' || value.includes('报警')) return 'danger'; if (value.includes('偏') || value.includes('关注') || value.includes('复核') || value.includes('复测')) return 'warning'; return 'info'; }
function selectRow(row: Row): void { selectedId.value = row.id; }
function submitAction(message: string): void { ElMessage.success(message); }
</script>

<template>
  <section class="device-water-page">
    <el-card class="device-work-card" shadow="never">
      <template #header><div class="device-header"><div><h2>{{ props.context.menuTitle }}</h2><p>查看透析机联机数据、水处理运行参数、停机记录和异常趋势，异常指标进入设备预警和上机阻断。</p></div><div class="device-actions"><el-button type="primary" :icon="DataLine" @click="reviewDialogVisible = true">参数复核</el-button><el-button :icon="Warning" @click="alertDialogVisible = true">生成预警</el-button><el-button @click="stopDialogVisible = true">停机记录</el-button><el-button @click="trendDrawerVisible = true">趋势追溯</el-button></div></div></template>
      <el-form class="device-filter" inline><el-form-item label="关键字"><el-input placeholder="设备、机位、指标、责任人" clearable /></el-form-item><el-form-item label="指标状态"><el-select placeholder="全部状态" clearable><el-option label="正常" value="正常" /><el-option label="关注" value="关注" /><el-option label="异常" value="异常" /><el-option label="偏高/偏低" value="偏" /></el-select></el-form-item><el-form-item label="时间"><el-date-picker type="date" placeholder="监测日期" /></el-form-item><el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item></el-form>
      <div class="device-stat-grid"><el-card v-for="item in metrics" :key="item.label" :class="['device-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>
      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow">
        <el-table-column prop="time" label="时间" width="90" fixed="left" />
        <el-table-column prop="device" label="设备" width="100" />
        <el-table-column prop="bed" label="机位/位置" width="120" />
        <el-table-column prop="metric" label="指标" min-width="120" />
        <el-table-column prop="value" label="采集值" width="120" />
        <el-table-column prop="range" label="参考范围" width="115" />
        <el-table-column prop="source" label="联机来源" width="115" />
        <el-table-column prop="stopRecord" label="停机记录" width="105"><template #default="{ row }"><el-tag :type="tagType(row.stopRecord)" effect="plain">{{ row.stopRecord }}</el-tag></template></el-table-column>
        <el-table-column prop="status" label="状态" width="95"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="owner" label="责任人" width="130" />
        <el-table-column prop="nextAction" label="下一步" min-width="130" />
        <el-table-column label="操作" width="260" fixed="right"><template #default="{ row }"><el-button link type="primary" @click.stop="selectRow(row); reviewDialogVisible = true">复核</el-button><el-button link type="warning" @click.stop="selectRow(row); alertDialogVisible = true">预警</el-button><el-button link @click.stop="selectRow(row); stopDialogVisible = true">停机</el-button><el-button link @click.stop="selectRow(row); trendDrawerVisible = true">趋势</el-button></template></el-table-column>
      </el-table>
    </el-card>    <el-dialog v-model="reviewDialogVisible" title="运行参数复核" width="620px"><el-form label-width="110px"><el-form-item label="指标"><el-input :model-value="`${currentRow.device} / ${currentRow.metric}`" disabled /></el-form-item><el-form-item label="复核结果"><el-radio-group model-value="normal"><el-radio-button label="normal">正常</el-radio-button><el-radio-button label="observe">继续观察</el-radio-button><el-radio-button label="block">阻断上机</el-radio-button></el-radio-group></el-form-item><el-form-item label="复核说明"><el-input type="textarea" :rows="3" placeholder="记录参数来源、复测值、处理意见和责任人" /></el-form-item></el-form><template #footer><el-button @click="reviewDialogVisible = false">取消</el-button><el-button type="primary" @click="reviewDialogVisible = false; submitAction('运行参数复核已保存')">提交复核</el-button></template></el-dialog>
    <el-dialog v-model="alertDialogVisible" title="运行异常预警" width="600px"><el-form label-width="110px"><el-form-item label="异常指标"><el-input :model-value="`${currentRow.metric}：${currentRow.value}`" disabled /></el-form-item><el-form-item label="预警等级"><el-select placeholder="请选择"><el-option label="一般" value="normal" /><el-option label="重要" value="important" /><el-option label="紧急阻断" value="urgent" /></el-select></el-form-item><el-form-item label="处理要求"><el-input type="textarea" :rows="3" placeholder="填写维修、水质复测、护士提醒或禁止上机要求" /></el-form-item></el-form><template #footer><el-button @click="alertDialogVisible = false">取消</el-button><el-button type="primary" @click="alertDialogVisible = false; submitAction('运行异常预警已生成')">生成预警</el-button></template></el-dialog>
    <el-dialog v-model="stopDialogVisible" title="停机记录登记" width="600px"><el-form label-width="110px"><el-form-item label="设备"><el-input :model-value="`${currentRow.device} / ${currentRow.bed}`" disabled /></el-form-item><el-form-item label="停机类型"><el-select :model-value="currentRow.stopRecord"><el-option label="故障停机" value="故障停机" /><el-option label="观察停机" value="观察停机" /><el-option label="水质阻断" value="水质阻断" /><el-option label="启用前停机" value="启用前停机" /></el-select></el-form-item><el-form-item label="影响范围"><el-input placeholder="填写影响班次、机位、患者或水处理分区" /></el-form-item><el-form-item label="处理记录"><el-input type="textarea" :rows="3" placeholder="记录停机时间、原因、替代机位、复核人和恢复条件" /></el-form-item></el-form><template #footer><el-button @click="stopDialogVisible = false">取消</el-button><el-button type="primary" @click="stopDialogVisible = false; submitAction('停机记录已保存并同步排班放行')">保存停机</el-button></template></el-dialog>
    <el-drawer v-model="trendDrawerVisible" title="运行趋势追溯" size="540px"><el-timeline><el-timeline-item timestamp="近3次采集">指标：{{ currentRow.metric }}，当前值：{{ currentRow.value }}</el-timeline-item><el-timeline-item timestamp="规则判定" type="warning">超出范围时生成设备预警和复核任务</el-timeline-item><el-timeline-item timestamp="闭环输出" type="success">复核结论影响设备放行状态</el-timeline-item></el-timeline></el-drawer>
  </section>
</template>
