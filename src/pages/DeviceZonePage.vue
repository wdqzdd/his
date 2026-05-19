<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();
type Row = { id: string; zone: string; bedCount: number; available: number; isolationRule: string; waterLoop: string; owner: string; status: string; updateTime: string; nextAction: string };
const selectedId = ref('ZONE-001');
const zoneDialogVisible = ref(false);
const ruleDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const rows: Row[] = [
  { id: 'ZONE-001', zone: 'A区', bedCount: 16, available: 15, isolationRule: '普通透析', waterLoop: 'RO-A 一回路', owner: '技师张强', status: '启用', updateTime: '2026-05-14 07:20', nextAction: '开放排班' },
  { id: 'ZONE-002', zone: 'B区', bedCount: 18, available: 16, isolationRule: '普通透析', waterLoop: 'RO-A 二回路', owner: '技师刘敏', status: '启用', updateTime: '2026-05-14 07:25', nextAction: '开放排班' },
  { id: 'ZONE-003', zone: 'C区', bedCount: 14, available: 13, isolationRule: '普通透析', waterLoop: 'RO-A 三回路', owner: '技师王磊', status: '待复核', updateTime: '2026-05-14 07:40', nextAction: '巡检复核' },
  { id: 'ZONE-004', zone: '隔离区', bedCount: 6, available: 4, isolationRule: '乙肝/丙肝分区', waterLoop: '独立回路', owner: '技师赵丽', status: '启用', updateTime: '2026-05-14 07:35', nextAction: '终末消毒复核' },
  { id: 'ZONE-005', zone: '急诊加透区', bedCount: 4, available: 3, isolationRule: '临时加透', waterLoop: 'RO-B 备用回路', owner: '技师张强', status: '待启用', updateTime: '2026-05-13 18:00', nextAction: '启用前检测' },
  { id: 'ZONE-006', zone: '儿童透析区', bedCount: 2, available: 2, isolationRule: '低体重专用', waterLoop: 'RO-A 一回路', owner: '技师刘敏', status: '启用', updateTime: '2026-05-14 07:10', nextAction: '开放排班' },
  { id: 'ZONE-007', zone: '维修隔离区', bedCount: 2, available: 0, isolationRule: '维修停用', waterLoop: '关闭', owner: '技师王磊', status: '停用', updateTime: '2026-05-14 08:05', nextAction: '维修完成复核' },
  { id: 'ZONE-008', zone: '水处理间', bedCount: 0, available: 0, isolationRule: '系统设备', waterLoop: 'RO-A/RO-B', owner: '水处理技师赵丽', status: '启用', updateTime: '2026-05-14 07:00', nextAction: '水质监测' },
  { id: 'ZONE-009', zone: '配液间', bedCount: 0, available: 0, isolationRule: '系统设备', waterLoop: 'RO-A', owner: '技师张强', status: '启用', updateTime: '2026-05-14 07:05', nextAction: '配液浓度复核' },
  { id: 'ZONE-010', zone: '备用区', bedCount: 4, available: 2, isolationRule: '备用机位', waterLoop: 'RO-B', owner: '技师赵丽', status: '待复核', updateTime: '2026-05-13 17:30', nextAction: '分区复核' },
];
const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['bed_zone', 'zone_capacity_rule', 'zone_isolation_rule', 'water_loop_binding'];
const metrics = computed(() => [
  { label: '分区数', value: rows.length, tone: 'blue' },
  { label: '可用机位', value: rows.reduce((sum, item) => sum + item.available, 0), tone: 'green' },
  { label: '待复核', value: rows.filter((item) => item.status.includes('待')).length, tone: 'orange' },
  { label: '停用分区', value: rows.filter((item) => item.status === '停用').length, tone: 'red' },
  { label: '隔离规则', value: rows.filter((item) => item.isolationRule.includes('肝') || item.isolationRule.includes('隔离')).length, tone: 'orange' },
]);
function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' { if (['启用', '开放排班'].includes(value)) return 'success'; if (value === '停用' || value === '关闭') return 'danger'; if (value.includes('待') || value.includes('隔离') || value.includes('复核') || value.includes('备用')) return 'warning'; return 'info'; }
function selectRow(row: Row): void { selectedId.value = row.id; }
function submitAction(message: string): void { ElMessage.success(message); }
</script>

<template>
  <section class="device-water-page">
    <el-card class="device-work-card" shadow="never">
      <template #header><div class="device-header"><div><h2>{{ props.context.menuTitle }}</h2><p>维护分区容量、隔离规则、水路绑定和责任技师，支撑排班容量、隔离透析和水质影响范围判断。</p></div><div class="device-actions"><el-button type="primary" :icon="CircleCheck" @click="zoneDialogVisible = true">分区维护</el-button><el-button :icon="Warning" @click="ruleDialogVisible = true">隔离规则</el-button><el-button @click="traceDrawerVisible = true">规则追溯</el-button></div></div></template>
      <el-form class="device-filter" inline><el-form-item label="关键字"><el-input placeholder="分区、回路、规则、责任人" clearable /></el-form-item><el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="启用" value="启用" /><el-option label="待复核" value="待复核" /><el-option label="停用" value="停用" /></el-select></el-form-item><el-form-item label="隔离规则"><el-select placeholder="全部规则" clearable><el-option label="普通透析" value="普通透析" /><el-option label="乙肝/丙肝分区" value="乙肝/丙肝分区" /><el-option label="系统设备" value="系统设备" /></el-select></el-form-item><el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item></el-form>
      <div class="device-stat-grid"><el-card v-for="item in metrics" :key="item.label" :class="['device-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>
      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow">
        <el-table-column prop="zone" label="分区" width="120" fixed="left" />
        <el-table-column prop="bedCount" label="机位数" width="90" />
        <el-table-column prop="available" label="可用" width="80" />
        <el-table-column prop="isolationRule" label="隔离规则" min-width="140"><template #default="{ row }"><el-tag :type="tagType(row.isolationRule)" effect="plain">{{ row.isolationRule }}</el-tag></template></el-table-column>
        <el-table-column prop="waterLoop" label="水路回路" min-width="130" />
        <el-table-column prop="owner" label="责任人" width="130" />
        <el-table-column prop="status" label="状态" width="95"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="150" />
        <el-table-column prop="nextAction" label="下一步" min-width="130" />
        <el-table-column label="操作" width="210" fixed="right"><template #default="{ row }"><el-button link type="primary" @click.stop="selectRow(row); zoneDialogVisible = true">维护</el-button><el-button link @click.stop="selectRow(row); ruleDialogVisible = true">规则</el-button><el-button link @click.stop="selectRow(row); traceDrawerVisible = true">追溯</el-button></template></el-table-column>
      </el-table>
    </el-card>    <el-dialog v-model="zoneDialogVisible" title="分区资料维护" width="620px"><el-form label-width="110px"><el-form-item label="分区名称"><el-input :model-value="currentRow.zone" /></el-form-item><el-form-item label="机位容量"><el-input-number :model-value="currentRow.bedCount" :min="0" /></el-form-item><el-form-item label="水路回路"><el-input :model-value="currentRow.waterLoop" /></el-form-item><el-form-item label="责任技师"><el-input :model-value="currentRow.owner" /></el-form-item><el-form-item label="维护说明"><el-input type="textarea" :rows="3" placeholder="记录分区容量、水路绑定和调整原因" /></el-form-item></el-form><template #footer><el-button @click="zoneDialogVisible = false">取消</el-button><el-button type="primary" @click="zoneDialogVisible = false; submitAction('分区资料已保存')">保存分区</el-button></template></el-dialog>
    <el-dialog v-model="ruleDialogVisible" title="隔离与排班规则" width="620px"><el-form label-width="110px"><el-form-item label="分区"><el-input :model-value="currentRow.zone" disabled /></el-form-item><el-form-item label="隔离规则"><el-select :model-value="currentRow.isolationRule"><el-option label="普通透析" value="普通透析" /><el-option label="乙肝/丙肝分区" value="乙肝/丙肝分区" /><el-option label="临时加透" value="临时加透" /><el-option label="系统设备" value="系统设备" /></el-select></el-form-item><el-form-item label="排班限制"><el-checkbox-group><el-checkbox label="阻止不匹配患者" /><el-checkbox label="要求终末消毒" /><el-checkbox label="水质异常时冻结" /></el-checkbox-group></el-form-item><el-form-item label="规则说明"><el-input type="textarea" :rows="3" placeholder="说明隔离、容量、终末消毒和复核要求" /></el-form-item></el-form><template #footer><el-button @click="ruleDialogVisible = false">取消</el-button><el-button type="primary" @click="ruleDialogVisible = false; submitAction('分区隔离规则已更新')">保存规则</el-button></template></el-dialog>
    <el-drawer v-model="traceDrawerVisible" title="分区规则追溯" size="520px"><el-timeline><el-timeline-item timestamp="2026-05-01">更新隔离区终末消毒规则</el-timeline-item><el-timeline-item timestamp="2026-05-10" type="warning">RO-B 备用回路启用前检测</el-timeline-item><el-timeline-item timestamp="2026-05-14" type="success">规则同步至排班和感控页面</el-timeline-item></el-timeline></el-drawer>
  </section>
</template>
