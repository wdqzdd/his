<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, Search, Tools, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();
type Row = { id: string; recordType: string; device: string; bed: string; result: string; issue: string; recorder: string; recordTime: string; reviewStatus: string; nextAction: string };
const selectedId = ref('REC-001');
const inspectDialogVisible = ref(false);
const repairDialogVisible = ref(false);
const disinfectDialogVisible = ref(false);
const lifecycleDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const rows: Row[] = [
  { id: 'REC-001', recordType: '晨间巡检', device: 'HD-08', bed: 'A08', result: '正常', issue: '无', recorder: '技师张强', recordTime: '2026-05-14 07:20', reviewStatus: '已复核', nextAction: '放行' },
  { id: 'REC-002', recordType: '消毒记录', device: 'HD-12', bed: 'A12', result: '缺项', issue: '未上传消毒批次', recorder: '技师刘敏', recordTime: '2026-05-14 07:35', reviewStatus: '待复核', nextAction: '补消毒' },
  { id: 'REC-003', recordType: '维修记录', device: 'HD-23', bed: 'B03', result: '维修中', issue: '压力传感异常', recorder: '技师王磊', recordTime: '2026-05-14 08:10', reviewStatus: '待验收', nextAction: '维修验收' },
  { id: 'REC-004', recordType: '使用记录', device: 'HD-27', bed: 'B07', result: '正常', issue: '下午班HD治疗4h', recorder: '技师张强', recordTime: '2026-05-14 07:22', reviewStatus: '已复核', nextAction: '治疗归档引用' },
  { id: 'REC-005', recordType: '报修记录', device: 'HD-42', bed: 'C02', result: '缺项', issue: '电源接地未确认', recorder: '技师刘敏', recordTime: '2026-05-14 07:50', reviewStatus: '待复核', nextAction: '补巡检' },
  { id: 'REC-006', recordType: '终末消毒', device: 'ISO-01', bed: 'I01', result: '待复核', issue: '隔离终末消毒', recorder: '技师王磊', recordTime: '2026-05-14 12:20', reviewStatus: '待复核', nextAction: '护士复核' },
  { id: 'REC-007', recordType: '水处理巡检', device: 'RO-A', bed: '水处理间', result: '异常', issue: '电导率偏高', recorder: '水处理技师赵丽', recordTime: '2026-05-14 09:10', reviewStatus: '待处理', nextAction: '水质复测' },
  { id: 'REC-008', recordType: '更换记录', device: 'MIX-01', bed: '配液间', result: '正常', issue: '更换浓度传感器', recorder: '技师张强', recordTime: '2026-05-14 07:15', reviewStatus: '已复核', nextAction: '放行' },
  { id: 'REC-009', recordType: '保养记录', device: 'HD-46', bed: 'C06', result: '观察', issue: '季度保养后静脉压波动', recorder: '技师王磊', recordTime: '2026-05-14 09:30', reviewStatus: '待复核', nextAction: '参数复核' },
  { id: 'REC-010', recordType: '启用前检测', device: 'RO-B', bed: '备用水处理', result: '待检测', issue: '备用系统启用', recorder: '水处理技师赵丽', recordTime: '2026-05-14 10:00', reviewStatus: '待复核', nextAction: '启用验收' },
];
const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['device_inspection', 'device_repair', 'device_disinfection', 'device_usage_record', 'device_maintenance_record', 'device_record_review'];
const metrics = computed(() => [
  { label: '管理记录', value: rows.length, tone: 'blue' },
  { label: '已复核', value: rows.filter((item) => item.reviewStatus === '已复核').length, tone: 'green' },
  { label: '待复核', value: rows.filter((item) => item.reviewStatus.includes('待')).length, tone: 'orange' },
  { label: '异常/维修', value: rows.filter((item) => item.result === '异常' || item.result === '维修中').length, tone: 'red' },
  { label: '消毒记录', value: rows.filter((item) => item.recordType.includes('消毒')).length, tone: 'blue' },
  { label: '使用/保养', value: rows.filter((item) => ['使用记录', '更换记录', '保养记录'].includes(item.recordType)).length, tone: 'green' },
]);
function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' { if (['正常', '已复核', '放行', '无'].includes(value)) return 'success'; if (['异常', '维修中'].includes(value)) return 'danger'; if (value.includes('待') || value.includes('缺项') || value.includes('观察') || value.includes('复核')) return 'warning'; return 'info'; }
function selectRow(row: Row): void { selectedId.value = row.id; }
function submitAction(message: string): void { ElMessage.success(message); }
</script>

<template>
  <section class="device-water-page">
    <el-card class="device-work-card" shadow="never">
      <template #header><div class="device-header"><div><h2>{{ props.context.menuTitle }}</h2><p>登记使用、巡检、报修、维修、更换、消毒、保养和启用检测记录，异常必须处理、复核并回写放行状态。</p></div><div class="device-actions"><el-button type="primary" :icon="CircleCheck" @click="inspectDialogVisible = true">巡检登记</el-button><el-button :icon="Tools" @click="repairDialogVisible = true">报修维修</el-button><el-button :icon="Warning" @click="disinfectDialogVisible = true">消毒登记</el-button><el-button @click="lifecycleDialogVisible = true">使用/保养</el-button></div></div></template>
      <el-form class="device-filter" inline><el-form-item label="关键字"><el-input placeholder="设备、机位、问题、记录人" clearable /></el-form-item><el-form-item label="记录类型"><el-select placeholder="全部类型" clearable><el-option label="使用记录" value="使用记录" /><el-option label="晨间巡检" value="晨间巡检" /><el-option label="报修记录" value="报修记录" /><el-option label="维修记录" value="维修记录" /><el-option label="更换记录" value="更换记录" /><el-option label="消毒记录" value="消毒记录" /><el-option label="保养记录" value="保养记录" /><el-option label="水处理巡检" value="水处理巡检" /></el-select></el-form-item><el-form-item label="复核"><el-select placeholder="全部状态" clearable><el-option label="已复核" value="已复核" /><el-option label="待复核" value="待复核" /><el-option label="待处理" value="待处理" /></el-select></el-form-item><el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item></el-form>
      <div class="device-stat-grid"><el-card v-for="item in metrics" :key="item.label" :class="['device-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>
      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow">
        <el-table-column prop="recordType" label="记录类型" width="115" fixed="left" />
        <el-table-column prop="device" label="设备" width="100" />
        <el-table-column prop="bed" label="机位/位置" width="120" />
        <el-table-column prop="result" label="结果" width="100"><template #default="{ row }"><el-tag :type="tagType(row.result)">{{ row.result }}</el-tag></template></el-table-column>
        <el-table-column prop="issue" label="问题说明" min-width="150"><template #default="{ row }"><el-tag :type="tagType(row.issue)" effect="plain">{{ row.issue }}</el-tag></template></el-table-column>
        <el-table-column prop="recorder" label="记录人" width="130" />
        <el-table-column prop="recordTime" label="记录时间" width="150" />
        <el-table-column prop="reviewStatus" label="复核" width="100"><template #default="{ row }"><el-tag :type="tagType(row.reviewStatus)">{{ row.reviewStatus }}</el-tag></template></el-table-column>
        <el-table-column prop="nextAction" label="下一步" min-width="130" />
        <el-table-column label="操作" width="280" fixed="right"><template #default="{ row }"><el-button link type="primary" @click.stop="selectRow(row); inspectDialogVisible = true">巡检</el-button><el-button link @click.stop="selectRow(row); repairDialogVisible = true">维修</el-button><el-button link @click.stop="selectRow(row); lifecycleDialogVisible = true">保养</el-button><el-button link @click.stop="selectRow(row); traceDrawerVisible = true">追溯</el-button></template></el-table-column>
      </el-table>
    </el-card>    <el-dialog v-model="inspectDialogVisible" title="巡检登记" width="620px"><el-form label-width="110px"><el-form-item label="设备"><el-input :model-value="currentRow.device" disabled /></el-form-item><el-form-item label="巡检项目"><el-checkbox-group><el-checkbox label="外观" /><el-checkbox label="电源接地" /><el-checkbox label="压力传感" /><el-checkbox label="报警测试" /></el-checkbox-group></el-form-item><el-form-item label="巡检结果"><el-radio-group model-value="normal"><el-radio-button label="normal">正常</el-radio-button><el-radio-button label="miss">缺项</el-radio-button><el-radio-button label="abnormal">异常</el-radio-button></el-radio-group></el-form-item><el-form-item label="记录说明"><el-input type="textarea" :rows="3" placeholder="记录巡检结果、缺项原因和复核要求" /></el-form-item></el-form><template #footer><el-button @click="inspectDialogVisible = false">取消</el-button><el-button type="primary" @click="inspectDialogVisible = false; submitAction('巡检记录已保存')">保存巡检</el-button></template></el-dialog>
    <el-dialog v-model="repairDialogVisible" title="维修登记与验收" width="620px"><el-form label-width="110px"><el-form-item label="设备问题"><el-input :model-value="`${currentRow.device} / ${currentRow.issue}`" disabled /></el-form-item><el-form-item label="维修阶段"><el-radio-group model-value="repair"><el-radio-button label="repair">维修中</el-radio-button><el-radio-button label="accept">验收</el-radio-button><el-radio-button label="close">关闭</el-radio-button></el-radio-group></el-form-item><el-form-item label="维修记录"><el-input type="textarea" :rows="3" placeholder="记录故障原因、更换部件、验收结果和放行意见" /></el-form-item></el-form><template #footer><el-button @click="repairDialogVisible = false">取消</el-button><el-button type="primary" @click="repairDialogVisible = false; submitAction('维修记录已提交')">提交维修</el-button></template></el-dialog>
    <el-dialog v-model="disinfectDialogVisible" title="消毒登记" width="600px"><el-form label-width="110px"><el-form-item label="设备"><el-input :model-value="currentRow.device" disabled /></el-form-item><el-form-item label="消毒类型"><el-select placeholder="请选择"><el-option label="晨间消毒" value="morning" /><el-option label="终末消毒" value="final" /><el-option label="隔离终末消毒" value="isolation" /></el-select></el-form-item><el-form-item label="批次与方法"><el-input placeholder="填写消毒液批号、浓度、作用时间和操作者" /></el-form-item></el-form><template #footer><el-button @click="disinfectDialogVisible = false">取消</el-button><el-button type="primary" @click="disinfectDialogVisible = false; submitAction('消毒记录已保存')">保存消毒</el-button></template></el-dialog>
    <el-dialog v-model="lifecycleDialogVisible" title="使用/更换/保养记录" width="640px"><el-form label-width="110px"><el-form-item label="设备"><el-input :model-value="currentRow.device" disabled /></el-form-item><el-form-item label="记录类型"><el-select :model-value="currentRow.recordType"><el-option label="使用记录" value="使用记录" /><el-option label="更换记录" value="更换记录" /><el-option label="保养记录" value="保养记录" /><el-option label="启用前检测" value="启用前检测" /></el-select></el-form-item><el-form-item label="关联对象"><el-input :model-value="currentRow.bed" placeholder="机位、治疗记录或部件批次" /></el-form-item><el-form-item label="记录内容"><el-input type="textarea" :rows="3" placeholder="记录使用时长、治疗关联、保养项目、更换部件批号、下次保养日期和复核要求" /></el-form-item></el-form><template #footer><el-button @click="lifecycleDialogVisible = false">取消</el-button><el-button type="primary" @click="lifecycleDialogVisible = false; submitAction('设备生命周期记录已保存')">保存记录</el-button></template></el-dialog>
    <el-drawer v-model="traceDrawerVisible" title="管理记录追溯" size="520px"><el-timeline><el-timeline-item timestamp="记录生成">登记：{{ currentRow.recordType }} / {{ currentRow.device }}</el-timeline-item><el-timeline-item timestamp="复核处理" type="primary">复核状态：{{ currentRow.reviewStatus }}</el-timeline-item><el-timeline-item timestamp="输出引用" type="success">回写设备放行和治疗归档</el-timeline-item></el-timeline></el-drawer>
  </section>
</template>
