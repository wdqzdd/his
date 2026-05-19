<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();
type Row = { id: string; sampleTime: string; point: string; metric: string; value: string; range: string; disinfectionStatus: string; status: string; reviewer: string; nextAction: string };
const selectedId = ref('WQ-001');
const recordDialogVisible = ref(false);
const retestDialogVisible = ref(false);
const disinfectDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const rows: Row[] = [
  { id: 'WQ-001', sampleTime: '2026-05-14 07:00', point: 'RO-A 产水口', metric: '电导率', value: '16.2 us/cm', range: '<18', disinfectionStatus: '已消毒', status: '合格', reviewer: '水处理技师赵丽', nextAction: '放行' },
  { id: 'WQ-002', sampleTime: '2026-05-14 07:05', point: 'RO-A 回水口', metric: '余氯', value: '0.02 mg/L', range: '<0.1', disinfectionStatus: '已消毒', status: '合格', reviewer: '水处理技师赵丽', nextAction: '放行' },
  { id: 'WQ-003', sampleTime: '2026-05-14 09:10', point: 'RO-A 产水口', metric: '电导率', value: '19.8 us/cm', range: '<18', disinfectionStatus: '待复核', status: '异常', reviewer: '水处理技师赵丽', nextAction: '复测并预警' },
  { id: 'WQ-004', sampleTime: '2026-05-14 09:20', point: 'A区末端', metric: '硬度', value: '0.03 mmol/L', range: '<0.05', disinfectionStatus: '已消毒', status: '合格', reviewer: '技师张强', nextAction: '继续监测' },
  { id: 'WQ-005', sampleTime: '2026-05-14 09:30', point: 'B区末端', metric: '细菌培养', value: '待报告', range: '阴性', disinfectionStatus: '培养待判', status: '待报告', reviewer: '检验科联动', nextAction: '等待结果' },
  { id: 'WQ-006', sampleTime: '2026-05-14 09:40', point: '隔离区末端', metric: '内毒素', value: '0.18 EU/ml', range: '<0.25', disinfectionStatus: '终末消毒', status: '合格', reviewer: '水处理技师赵丽', nextAction: '放行' },
  { id: 'WQ-007', sampleTime: '2026-05-14 10:00', point: 'RO-B 产水口', metric: '产水压力', value: '0.22 MPa', range: '0.25-0.35', disinfectionStatus: '启用前消毒', status: '偏低', reviewer: '水处理技师赵丽', nextAction: '启用前复测' },
  { id: 'WQ-008', sampleTime: '2026-05-14 10:10', point: '配液间', metric: '配液浓度', value: '合格', range: '合格', disinfectionStatus: '已消毒', status: '合格', reviewer: '技师张强', nextAction: '放行' },
  { id: 'WQ-009', sampleTime: '2026-05-14 10:30', point: 'C区末端', metric: 'pH', value: '7.2', range: '6.5-8.5', disinfectionStatus: '已消毒', status: '合格', reviewer: '技师刘敏', nextAction: '继续监测' },
  { id: 'WQ-010', sampleTime: '2026-05-14 10:45', point: 'RO-A 原水口', metric: '原水压力', value: '0.18 MPa', range: '0.15-0.35', disinfectionStatus: '按计划', status: '合格', reviewer: '水处理技师赵丽', nextAction: '继续监测' },
];
const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['water_quality_record', 'water_sample_point', 'water_retest_record', 'water_disinfection_record', 'device_alert'];
const metrics = computed(() => [
  { label: '水质记录', value: rows.length, tone: 'blue' },
  { label: '合格', value: rows.filter((item) => item.status === '合格').length, tone: 'green' },
  { label: '待报告', value: rows.filter((item) => item.status === '待报告').length, tone: 'orange' },
  { label: '异常/偏低', value: rows.filter((item) => item.status === '异常' || item.status === '偏低').length, tone: 'red' },
  { label: 'RO点位', value: rows.filter((item) => item.point.includes('RO')).length, tone: 'blue' },
  { label: '消毒待复核', value: rows.filter((item) => item.disinfectionStatus.includes('待') || item.disinfectionStatus.includes('培养')).length, tone: 'orange' },
]);
function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' { if (['合格', '放行', '继续监测'].includes(value)) return 'success'; if (value === '异常') return 'danger'; if (value.includes('待') || value.includes('偏') || value.includes('复测')) return 'warning'; return 'info'; }
function selectRow(row: Row): void { selectedId.value = row.id; }
function submitAction(message: string): void { ElMessage.success(message); }
</script>

<template>
  <section class="device-water-page">
    <el-card class="device-work-card" shadow="never">
      <template #header><div class="device-header"><div><h2>{{ props.context.menuTitle }}</h2><p>登记水处理采样点、指标结果、复测、消毒记录和放行结论，异常水质会阻断相关分区排班和上机核对。</p></div><div class="device-actions"><el-button type="primary" :icon="CircleCheck" @click="recordDialogVisible = true">水质登记</el-button><el-button :icon="Warning" @click="retestDialogVisible = true">异常复测</el-button><el-button @click="disinfectDialogVisible = true">水处理消毒</el-button><el-button @click="traceDrawerVisible = true">水质追溯</el-button></div></div></template>
      <el-form class="device-filter" inline><el-form-item label="关键字"><el-input placeholder="采样点、指标、复核人、状态" clearable /></el-form-item><el-form-item label="指标"><el-select placeholder="全部指标" clearable><el-option label="电导率" value="电导率" /><el-option label="余氯" value="余氯" /><el-option label="内毒素" value="内毒素" /><el-option label="细菌培养" value="细菌培养" /></el-select></el-form-item><el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="合格" value="合格" /><el-option label="待报告" value="待报告" /><el-option label="异常" value="异常" /></el-select></el-form-item><el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item></el-form>
      <div class="device-stat-grid"><el-card v-for="item in metrics" :key="item.label" :class="['device-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>
      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow">
        <el-table-column prop="sampleTime" label="采样时间" width="150" fixed="left" />
        <el-table-column prop="point" label="采样点" min-width="130" />
        <el-table-column prop="metric" label="指标" width="110" />
        <el-table-column prop="value" label="结果" width="120" />
        <el-table-column prop="range" label="范围" width="110" />
        <el-table-column prop="disinfectionStatus" label="消毒记录" width="115"><template #default="{ row }"><el-tag :type="tagType(row.disinfectionStatus)" effect="plain">{{ row.disinfectionStatus }}</el-tag></template></el-table-column>
        <el-table-column prop="status" label="状态" width="95"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="reviewer" label="复核人" width="130" />
        <el-table-column prop="nextAction" label="下一步" min-width="130" />
        <el-table-column label="操作" width="250" fixed="right"><template #default="{ row }"><el-button link type="primary" @click.stop="selectRow(row); recordDialogVisible = true">登记</el-button><el-button link type="warning" @click.stop="selectRow(row); retestDialogVisible = true">复测</el-button><el-button link @click.stop="selectRow(row); disinfectDialogVisible = true">消毒</el-button><el-button link @click.stop="selectRow(row); traceDrawerVisible = true">追溯</el-button></template></el-table-column>
      </el-table>
    </el-card>    <el-dialog v-model="recordDialogVisible" title="水质结果登记" width="620px"><el-form label-width="110px"><el-form-item label="采样点"><el-input :model-value="currentRow.point" /></el-form-item><el-form-item label="检测指标"><el-select :model-value="currentRow.metric"><el-option label="电导率" value="电导率" /><el-option label="余氯" value="余氯" /><el-option label="硬度" value="硬度" /><el-option label="内毒素" value="内毒素" /></el-select></el-form-item><el-form-item label="检测结果"><el-input :model-value="currentRow.value" /></el-form-item><el-form-item label="放行结论"><el-radio-group model-value="pass"><el-radio-button label="pass">合格放行</el-radio-button><el-radio-button label="retest">复测</el-radio-button><el-radio-button label="block">阻断上机</el-radio-button></el-radio-group></el-form-item><el-form-item label="说明"><el-input type="textarea" :rows="3" placeholder="记录采样批次、检测方法、影响分区和复核意见" /></el-form-item></el-form><template #footer><el-button @click="recordDialogVisible = false">取消</el-button><el-button type="primary" @click="recordDialogVisible = false; submitAction('水质结果已保存')">保存结果</el-button></template></el-dialog>
    <el-dialog v-model="retestDialogVisible" title="水质异常复测" width="600px"><el-form label-width="110px"><el-form-item label="异常指标"><el-input :model-value="`${currentRow.point} / ${currentRow.metric} / ${currentRow.value}`" disabled /></el-form-item><el-form-item label="影响范围"><el-checkbox-group><el-checkbox label="A区" /><el-checkbox label="B区" /><el-checkbox label="C区" /><el-checkbox label="隔离区" /></el-checkbox-group></el-form-item><el-form-item label="复测安排"><el-input type="textarea" :rows="3" placeholder="记录复测时间、责任人、临时阻断和通知要求" /></el-form-item></el-form><template #footer><el-button @click="retestDialogVisible = false">取消</el-button><el-button type="primary" @click="retestDialogVisible = false; submitAction('水质复测任务已生成')">生成复测</el-button></template></el-dialog>
    <el-dialog v-model="disinfectDialogVisible" title="水处理消毒记录" width="620px"><el-form label-width="110px"><el-form-item label="系统/点位"><el-input :model-value="currentRow.point" disabled /></el-form-item><el-form-item label="消毒方式"><el-select :model-value="currentRow.disinfectionStatus"><el-option label="热消毒" value="热消毒" /><el-option label="化学消毒" value="化学消毒" /><el-option label="终末消毒" value="终末消毒" /><el-option label="启用前消毒" value="启用前消毒" /></el-select></el-form-item><el-form-item label="批次与参数"><el-input placeholder="填写消毒液批号、浓度、温度、循环时间和操作者" /></el-form-item><el-form-item label="复核结论"><el-radio-group model-value="pass"><el-radio-button label="pass">合格放行</el-radio-button><el-radio-button label="review">待复核</el-radio-button><el-radio-button label="block">阻断上机</el-radio-button></el-radio-group></el-form-item></el-form><template #footer><el-button @click="disinfectDialogVisible = false">取消</el-button><el-button type="primary" @click="disinfectDialogVisible = false; submitAction('水处理消毒记录已保存')">保存消毒</el-button></template></el-dialog>
    <el-drawer v-model="traceDrawerVisible" title="水质记录追溯" size="520px"><el-timeline><el-timeline-item timestamp="采样登记">采样点：{{ currentRow.point }}，指标：{{ currentRow.metric }}</el-timeline-item><el-timeline-item timestamp="结果判定" type="warning">状态：{{ currentRow.status }}，下一步：{{ currentRow.nextAction }}</el-timeline-item><el-timeline-item timestamp="闭环输出" type="success">同步设备放行、分区排班和预警看板</el-timeline-item></el-timeline></el-drawer>
  </section>
</template>
