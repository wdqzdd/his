<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, DataLine, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();
type Row = { id: string; qcItem: string; device: string; qcType: string; standard: string; result: string; status: string; owner: string; reviewTime: string; trainingStatus: string; reportMetric: string; nextAction: string };
const selectedId = ref('DQ-001');
const qcDialogVisible = ref(false);
const releaseDialogVisible = ref(false);
const maintenanceDialogVisible = ref(false);
const reportDrawerVisible = ref(false);
const trendDrawerVisible = ref(false);
const rows: Row[] = [
  { id: 'DQ-001', qcItem: '压力传感校准', device: 'HD-08', qcType: '设备性能验证', standard: '误差<5%', result: '合格', status: '已放行', owner: '技师张强', reviewTime: '2026-05-01', trainingStatus: '已培训', reportMetric: '合格率100%', nextAction: '下月复核' },
  { id: 'DQ-002', qcItem: '跨膜压报警测试', device: 'HD-12', qcType: '质量控制记录', standard: '报警有效', result: '待复核', status: '待复核', owner: '技师刘敏', reviewTime: '2026-05-14', trainingStatus: '待培训', reportMetric: '缺项1项', nextAction: '补测报警' },
  { id: 'DQ-003', qcItem: '压力传感校准', device: 'HD-23', qcType: '维修后质控', standard: '误差<5%', result: '不合格', status: '禁止上机', owner: '技师王磊', reviewTime: '2026-05-14', trainingStatus: '已培训', reportMetric: '异常1次', nextAction: '维修返工' },
  { id: 'DQ-004', qcItem: '消毒效果复核', device: 'HD-27', qcType: '质量控制记录', standard: '记录完整', result: '合格', status: '已放行', owner: '技师张强', reviewTime: '2026-05-12', trainingStatus: '已培训', reportMetric: '感控合格', nextAction: '归档' },
  { id: 'DQ-005', qcItem: '电源接地检测', device: 'HD-42', qcType: '预防性维护', standard: '接地正常', result: '缺项', status: '待复核', owner: '技师刘敏', reviewTime: '2026-05-14', trainingStatus: '待培训', reportMetric: '维护逾期', nextAction: '补质控' },
  { id: 'DQ-006', qcItem: '隔离终末消毒质控', device: 'ISO-01', qcType: '培训记录', standard: '终末记录完整', result: '待复核', status: '待复核', owner: '技师王磊', reviewTime: '2026-05-14', trainingStatus: '隔离流程复训', reportMetric: '复训待签', nextAction: '护士复核' },
  { id: 'DQ-007', qcItem: '电导率质控', device: 'RO-A', qcType: '水处理质控', standard: '<18 us/cm', result: '偏高', status: '禁止上机', owner: '水处理技师赵丽', reviewTime: '2026-05-14', trainingStatus: '已培训', reportMetric: '水质异常1次', nextAction: '水质复测' },
  { id: 'DQ-008', qcItem: '配液浓度质控', device: 'MIX-01', qcType: '设备性能验证', standard: '合格', result: '合格', status: '已放行', owner: '技师张强', reviewTime: '2026-05-14', trainingStatus: '已培训', reportMetric: '合格率100%', nextAction: '归档' },
  { id: 'DQ-009', qcItem: '血泵速度校准', device: 'HD-31', qcType: '预防性维护', standard: '误差<3%', result: '合格', status: '已放行', owner: '技师刘敏', reviewTime: '2026-04-30', trainingStatus: '已培训', reportMetric: '下季到期', nextAction: '下季复核' },
  { id: 'DQ-010', qcItem: '备用RO启用质控', device: 'RO-B', qcType: '设备质控报表', standard: '全项合格', result: '待检测', status: '待复核', owner: '水处理技师赵丽', reviewTime: '2026-05-14', trainingStatus: '启用前培训', reportMetric: '启用前待验收', nextAction: '启用验收' },
];
const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['device_quality_control', 'qc_review_log', 'device_release_log', 'preventive_maintenance', 'device_training_record', 'quality_trend_record'];
const metrics = computed(() => [
  { label: '质控项目', value: rows.length, tone: 'blue' },
  { label: '已放行', value: rows.filter((item) => item.status === '已放行').length, tone: 'green' },
  { label: '待复核', value: rows.filter((item) => item.status === '待复核').length, tone: 'orange' },
  { label: '禁止上机', value: rows.filter((item) => item.status === '禁止上机').length, tone: 'red' },
  { label: '水处理质控', value: rows.filter((item) => item.qcType.includes('水处理')).length, tone: 'blue' },
  { label: '预防维护', value: rows.filter((item) => item.qcType.includes('预防')).length, tone: 'green' },
]);
function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' { if (['合格', '已放行', '归档'].includes(value)) return 'success'; if (['不合格', '禁止上机'].includes(value)) return 'danger'; if (value.includes('待') || value.includes('缺项') || value.includes('偏') || value.includes('复核')) return 'warning'; return 'info'; }
function selectRow(row: Row): void { selectedId.value = row.id; }
function submitAction(message: string): void { ElMessage.success(message); }
</script>

<template>
  <section class="device-water-page">
    <el-card class="device-work-card" shadow="never">
      <template #header><div class="device-header"><div><h2>{{ props.context.menuTitle }}</h2><p>管理设备性能验证、质量控制记录、预防性维护、培训记录、质控报表和异常统计，质控不合格设备不得进入排班和上机。</p></div><div class="device-actions"><el-button type="primary" :icon="Warning" @click="qcDialogVisible = true">记录质控</el-button><el-button :icon="CircleCheck" @click="releaseDialogVisible = true">复核放行</el-button><el-button @click="maintenanceDialogVisible = true">维护培训</el-button><el-button :icon="DataLine" @click="reportDrawerVisible = true">报表统计</el-button><el-button @click="trendDrawerVisible = true">趋势分析</el-button></div></div></template>
      <el-form class="device-filter" inline><el-form-item label="关键字"><el-input placeholder="质控项目、设备、责任人、结论" clearable /></el-form-item><el-form-item label="质控类型"><el-select placeholder="全部类型" clearable><el-option label="设备性能验证" value="设备性能验证" /><el-option label="质量控制记录" value="质量控制记录" /><el-option label="预防性维护" value="预防性维护" /><el-option label="培训记录" value="培训记录" /><el-option label="设备质控报表" value="设备质控报表" /><el-option label="水处理质控" value="水处理质控" /><el-option label="维修后质控" value="维修后质控" /></el-select></el-form-item><el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="已放行" value="已放行" /><el-option label="待复核" value="待复核" /><el-option label="禁止上机" value="禁止上机" /></el-select></el-form-item><el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item></el-form>
      <div class="device-stat-grid"><el-card v-for="item in metrics" :key="item.label" :class="['device-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>
      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow">
        <el-table-column prop="qcItem" label="质控项目" min-width="150" fixed="left" />
        <el-table-column prop="device" label="设备" width="100" />
        <el-table-column prop="qcType" label="质控类型" width="115" />
        <el-table-column prop="standard" label="标准" width="120" />
        <el-table-column prop="result" label="结果" width="100"><template #default="{ row }"><el-tag :type="tagType(row.result)">{{ row.result }}</el-tag></template></el-table-column>
        <el-table-column prop="status" label="放行状态" width="105"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="owner" label="责任人" width="130" />
        <el-table-column prop="reviewTime" label="复核日期" width="115" />
        <el-table-column prop="trainingStatus" label="培训记录" width="120"><template #default="{ row }"><el-tag :type="tagType(row.trainingStatus)" effect="plain">{{ row.trainingStatus }}</el-tag></template></el-table-column>
        <el-table-column prop="reportMetric" label="报表/异常统计" min-width="130" />
        <el-table-column prop="nextAction" label="下一步" min-width="130" />
        <el-table-column label="操作" width="280" fixed="right"><template #default="{ row }"><el-button link type="primary" @click.stop="selectRow(row); qcDialogVisible = true">质控</el-button><el-button link @click.stop="selectRow(row); releaseDialogVisible = true">放行</el-button><el-button link @click.stop="selectRow(row); maintenanceDialogVisible = true">维护</el-button><el-button link @click.stop="selectRow(row); trendDrawerVisible = true">趋势</el-button></template></el-table-column>
      </el-table>
    </el-card>    <el-dialog v-model="qcDialogVisible" title="设备质控记录" width="660px"><el-form label-width="110px"><el-form-item label="质控项目"><el-input :model-value="currentRow.qcItem" /></el-form-item><el-form-item label="质控类型"><el-select :model-value="currentRow.qcType"><el-option label="设备性能验证" value="设备性能验证" /><el-option label="质量控制记录" value="质量控制记录" /><el-option label="预防性维护" value="预防性维护" /><el-option label="培训记录" value="培训记录" /><el-option label="维修后质控" value="维修后质控" /><el-option label="水处理质控" value="水处理质控" /></el-select></el-form-item><el-form-item label="质控结果"><el-radio-group model-value="pass"><el-radio-button label="pass">合格</el-radio-button><el-radio-button label="review">待复核</el-radio-button><el-radio-button label="fail">不合格</el-radio-button></el-radio-group></el-form-item><el-form-item label="记录说明"><el-input type="textarea" :rows="3" placeholder="记录检测值、标准、偏差原因、预防性维护项目、培训要求和整改要求" /></el-form-item></el-form><template #footer><el-button @click="qcDialogVisible = false">取消</el-button><el-button type="primary" @click="qcDialogVisible = false; submitAction('设备质控记录已保存')">保存质控</el-button></template></el-dialog>
    <el-dialog v-model="releaseDialogVisible" title="质控复核放行" width="600px"><el-form label-width="110px"><el-form-item label="设备质控"><el-input :model-value="`${currentRow.device} / ${currentRow.qcItem}`" disabled /></el-form-item><el-form-item label="放行结论"><el-radio-group model-value="pass"><el-radio-button label="pass">放行</el-radio-button><el-radio-button label="hold">待复核</el-radio-button><el-radio-button label="block">禁止上机</el-radio-button></el-radio-group></el-form-item><el-form-item label="复核意见"><el-input type="textarea" :rows="3" placeholder="记录复核人、放行条件、整改要求和审计说明" /></el-form-item></el-form><template #footer><el-button @click="releaseDialogVisible = false">取消</el-button><el-button type="primary" @click="releaseDialogVisible = false; submitAction('质控放行结论已更新')">提交放行</el-button></template></el-dialog>
    <el-dialog v-model="maintenanceDialogVisible" title="预防性维护与培训" width="640px"><el-form label-width="110px"><el-form-item label="设备"><el-input :model-value="currentRow.device" disabled /></el-form-item><el-form-item label="维护计划"><el-select :model-value="currentRow.qcType"><el-option label="月度预防维护" value="月度预防维护" /><el-option label="季度性能验证" value="季度性能验证" /><el-option label="维修后再培训" value="维修后再培训" /><el-option label="隔离流程培训" value="隔离流程培训" /></el-select></el-form-item><el-form-item label="培训状态"><el-input :model-value="currentRow.trainingStatus" /></el-form-item><el-form-item label="维护说明"><el-input type="textarea" :rows="3" placeholder="记录维护项目、培训人员、签名、下次维护日期和未完成风险" /></el-form-item></el-form><template #footer><el-button @click="maintenanceDialogVisible = false">取消</el-button><el-button type="primary" @click="maintenanceDialogVisible = false; submitAction('预防维护与培训记录已保存')">保存记录</el-button></template></el-dialog>
    <el-drawer v-model="reportDrawerVisible" title="设备质控报表与异常统计" size="540px"><el-timeline><el-timeline-item timestamp="质控报表" type="primary">本期质控项目 {{ rows.length }} 项，已放行 {{ rows.filter((item) => item.status === '已放行').length }} 项，待复核 {{ rows.filter((item) => item.status === '待复核').length }} 项。</el-timeline-item><el-timeline-item timestamp="异常统计" type="warning">禁止上机 {{ rows.filter((item) => item.status === '禁止上机').length }} 台次，水处理异常 {{ rows.filter((item) => item.qcType.includes('水处理')).length }} 项。</el-timeline-item><el-timeline-item timestamp="输出闭环" type="success">报表指标可下钻到设备档案、维修记录、水质记录和CQI整改任务。</el-timeline-item></el-timeline></el-drawer>
    <el-drawer v-model="trendDrawerVisible" title="设备质控趋势" size="540px"><el-timeline><el-timeline-item timestamp="本次质控">项目：{{ currentRow.qcItem }}，结果：{{ currentRow.result }}</el-timeline-item><el-timeline-item timestamp="趋势判定" type="warning">连续异常会生成 CQI 整改和设备停用建议</el-timeline-item><el-timeline-item timestamp="闭环输出" type="success">放行状态同步排班、上机核对和统计报表</el-timeline-item></el-timeline></el-drawer>
  </section>
</template>
