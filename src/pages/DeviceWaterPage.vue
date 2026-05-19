<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  CircleCheck,
  Connection,
  DataLine,
  FirstAidKit,
  Search,
  Tools,
  Warning,
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{
  context: PageContext;
}>();

type DeviceRow = {
  id: string;
  code: string;
  type: string;
  brandModel: string;
  zoneBed: string;
  bindStatus: string;
  runStatus: string;
  releaseStatus: string;
  inspection: string;
  disinfection: string;
  waterStatus: string;
  alert: string;
  repairStatus: string;
  nextAction: string;
};

type MetricRow = {
  time: string;
  device: string;
  metric: string;
  value: string;
  unit: string;
  status: string;
};

const sectionByMenu: Record<string, string> = {
  'device-home': 'devices',
  'device-bed': 'devices',
  'device-zone': 'devices',
  'device-bind': 'devices',
  'device-archive': 'devices',
  'device-record': 'records',
  'device-monitor': 'monitor',
  'device-water': 'water',
  'device-quality': 'quality',
};

const activeTab = ref(sectionByMenu[props.context.menuKey] ?? 'devices');
const selectedDeviceId = ref('DEV-001');
const archiveDialogVisible = ref(false);
const bindDialogVisible = ref(false);
const inspectDialogVisible = ref(false);
const repairDialogVisible = ref(false);
const disinfectionDialogVisible = ref(false);
const waterDialogVisible = ref(false);
const alertDrawerVisible = ref(false);

watch(
  () => props.context.menuKey,
  (menuKey) => {
    activeTab.value = sectionByMenu[menuKey] ?? 'devices';
  },
);

const devices = ref<DeviceRow[]>([
  { id: 'DEV-001', code: 'HD-08', type: '透析机', brandModel: 'Fresenius 5008S', zoneBed: 'A区08床', bindStatus: '已绑定', runStatus: '运行中', releaseStatus: '已放行', inspection: '已巡检', disinfection: '已消毒', waterStatus: '合格', alert: '无', repairStatus: '无', nextAction: '持续监测' },
  { id: 'DEV-002', code: 'HD-12', type: '透析机', brandModel: 'B.Braun Dialog+', zoneBed: 'A区12床', bindStatus: '已绑定', runStatus: '待机', releaseStatus: '待复核', inspection: '已巡检', disinfection: '待消毒', waterStatus: '合格', alert: '消毒缺项', repairStatus: '无', nextAction: '补消毒' },
  { id: 'DEV-003', code: 'HD-23', type: '透析机', brandModel: 'Nikkiso DBB-07', zoneBed: 'B区03床', bindStatus: '已绑定', runStatus: '停用', releaseStatus: '禁止上机', inspection: '异常', disinfection: '已消毒', waterStatus: '合格', alert: '压力传感异常', repairStatus: '维修中', nextAction: '维修复核' },
  { id: 'DEV-004', code: 'HD-27', type: '透析机', brandModel: 'Fresenius 4008S', zoneBed: 'B区07床', bindStatus: '已绑定', runStatus: '运行中', releaseStatus: '已放行', inspection: '已巡检', disinfection: '已消毒', waterStatus: '合格', alert: '无', repairStatus: '无', nextAction: '持续监测' },
  { id: 'DEV-005', code: 'HD-42', type: '透析机', brandModel: 'B.Braun Dialog+', zoneBed: 'C区02床', bindStatus: '已绑定', runStatus: '待机', releaseStatus: '待复核', inspection: '待巡检', disinfection: '已消毒', waterStatus: '合格', alert: '巡检缺项', repairStatus: '无', nextAction: '补巡检' },
  { id: 'DEV-006', code: 'ISO-01', type: '隔离透析机', brandModel: 'Fresenius 5008S', zoneBed: '隔离区01床', bindStatus: '已绑定', runStatus: '运行中', releaseStatus: '已放行', inspection: '已巡检', disinfection: '终末消毒待复核', waterStatus: '合格', alert: '隔离消毒复核', repairStatus: '无', nextAction: '终末复核' },
  { id: 'DEV-007', code: 'RO-A', type: '水处理系统', brandModel: 'DWA RO-2000', zoneBed: '水处理间', bindStatus: '系统设备', runStatus: '运行中', releaseStatus: '已放行', inspection: '已巡检', disinfection: '按计划', waterStatus: '电导率偏高', alert: '水质异常', repairStatus: '待处理', nextAction: '水质复测' },
  { id: 'DEV-008', code: 'MIX-01', type: '配液系统', brandModel: 'Baxter Mix', zoneBed: '配液间', bindStatus: '系统设备', runStatus: '运行中', releaseStatus: '已放行', inspection: '已巡检', disinfection: '已消毒', waterStatus: '合格', alert: '无', repairStatus: '无', nextAction: '持续监测' },
  { id: 'DEV-009', code: 'HD-31', type: '透析机', brandModel: 'Nikkiso DBB-07', zoneBed: 'B区11床', bindStatus: '已绑定', runStatus: '待机', releaseStatus: '已放行', inspection: '已巡检', disinfection: '已消毒', waterStatus: '合格', alert: '无', repairStatus: '无', nextAction: '可排班' },
  { id: 'DEV-010', code: 'HD-46', type: '透析机', brandModel: 'Fresenius 5008S', zoneBed: 'C区06床', bindStatus: '已绑定', runStatus: '运行中', releaseStatus: '已放行', inspection: '已巡检', disinfection: '已消毒', waterStatus: '合格', alert: '静脉压波动', repairStatus: '观察', nextAction: '参数复核' },
  { id: 'DEV-011', code: 'HD-10', type: '透析机', brandModel: 'B.Braun Dialog+', zoneBed: 'A区10床', bindStatus: '已绑定', runStatus: '待机', releaseStatus: '已放行', inspection: '已巡检', disinfection: '已消毒', waterStatus: '合格', alert: '无', repairStatus: '无', nextAction: '可排班' },
  { id: 'DEV-012', code: 'RO-B', type: '水处理系统', brandModel: 'DWA RO-1500', zoneBed: '备用水处理', bindStatus: '系统设备', runStatus: '待机', releaseStatus: '待复核', inspection: '待巡检', disinfection: '待消毒', waterStatus: '待检测', alert: '启用前复核', repairStatus: '无', nextAction: '启用前检测' },
]);

const metricRows: MetricRow[] = [
  { time: '08:00', device: 'HD-08', metric: '静脉压', value: '148', unit: 'mmHg', status: '正常' },
  { time: '08:30', device: 'HD-27', metric: '跨膜压', value: '52', unit: 'mmHg', status: '正常' },
  { time: '09:00', device: 'HD-46', metric: '静脉压', value: '205', unit: 'mmHg', status: '关注' },
  { time: '09:10', device: 'RO-A', metric: '电导率', value: '19.8', unit: 'us/cm', status: '异常' },
  { time: '09:20', device: 'RO-A', metric: '余氯', value: '0.02', unit: 'mg/L', status: '正常' },
  { time: '09:30', device: 'MIX-01', metric: '配液浓度', value: '合格', unit: '', status: '正常' },
];

const selectedDevice = computed(() => devices.value.find((item) => item.id === selectedDeviceId.value) ?? devices.value[0]);

const metrics = computed(() => [
  { label: '设备总数', value: devices.value.length, tone: 'blue' },
  { label: '已放行', value: devices.value.filter((item) => item.releaseStatus === '已放行').length, tone: 'green' },
  { label: '待复核', value: devices.value.filter((item) => item.releaseStatus === '待复核').length, tone: 'orange' },
  { label: '禁止上机', value: devices.value.filter((item) => item.releaseStatus === '禁止上机').length, tone: 'red' },
  { label: '水质异常', value: devices.value.filter((item) => item.waterStatus.includes('偏') || item.waterStatus.includes('待')).length, tone: 'red' },
]);

const releaseChecks = computed(() => [
  { label: '设备绑定', value: selectedDevice.value.bindStatus, pass: selectedDevice.value.bindStatus === '已绑定' || selectedDevice.value.bindStatus === '系统设备' },
  { label: '巡检结果', value: selectedDevice.value.inspection, pass: selectedDevice.value.inspection === '已巡检' },
  { label: '消毒状态', value: selectedDevice.value.disinfection, pass: ['已消毒', '按计划'].includes(selectedDevice.value.disinfection) },
  { label: '水质状态', value: selectedDevice.value.waterStatus, pass: selectedDevice.value.waterStatus === '合格' },
  { label: '维修状态', value: selectedDevice.value.repairStatus, pass: selectedDevice.value.repairStatus === '无' },
  { label: '上机放行', value: selectedDevice.value.releaseStatus, pass: selectedDevice.value.releaseStatus === '已放行' },
]);

const activeTables = ['device_archive', 'device_bed_binding', 'device_inspection', 'device_repair', 'device_disinfection', 'device_metric_record', 'water_quality_record', 'device_alert'];

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (['已绑定', '系统设备', '运行中', '已放行', '已巡检', '已消毒', '按计划', '合格', '无', '正常', '可排班'].includes(value)) return 'success';
  if (['禁止上机', '异常', '维修中', '水质异常'].includes(value) || value.includes('偏高')) return 'danger';
  if (value.includes('待') || value.includes('复核') || value.includes('缺项') || value.includes('关注') || value.includes('观察')) return 'warning';
  return 'info';
}

function selectDevice(row: DeviceRow): void {
  selectedDeviceId.value = row.id;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}

function saveInspection(): void {
  selectedDevice.value.inspection = '已巡检';
  inspectDialogVisible.value = false;
  submitAction('巡检记录已保存，放行状态已重新计算');
}

function saveDisinfection(): void {
  selectedDevice.value.disinfection = '已消毒';
  disinfectionDialogVisible.value = false;
  submitAction('消毒记录已保存，可进入放行复核');
}

function closeAlert(): void {
  selectedDevice.value.alert = '无';
  selectedDevice.value.repairStatus = '无';
  selectedDevice.value.releaseStatus = releaseChecks.value.every((item) => item.pass || item.label === '上机放行') ? '已放行' : selectedDevice.value.releaseStatus;
  repairDialogVisible.value = false;
  submitAction('设备异常已处理并复核，排班和上机核对可引用放行状态');
}
</script>

<template>
  <section class="device-water-page">
    <el-card class="device-work-card" shadow="never">
      <template #header>
        <div class="device-header">
          <div>
            <h2>技师与设备水质工作台</h2>
            <p>管理机位设备绑定、巡检维修、消毒、运行监测和水质参数，异常状态影响排班和上机放行。</p>
          </div>
          <div class="device-actions">
            <el-button type="primary" :icon="FirstAidKit" @click="archiveDialogVisible = true">设备档案</el-button>
            <el-button :icon="Connection" @click="bindDialogVisible = true">机位绑定</el-button>
            <el-button :icon="CircleCheck" @click="inspectDialogVisible = true">巡检</el-button>
            <el-button :icon="Tools" @click="repairDialogVisible = true">维修</el-button>
            <el-button :icon="Warning" @click="waterDialogVisible = true">水质记录</el-button>
          </div>
        </div>
      </template>

      <el-form class="device-filter" inline>
        <el-form-item label="关键字">
          <el-input placeholder="设备编号、机位、型号、水处理系统" clearable />
        </el-form-item>
        <el-form-item label="设备类型">
          <el-select placeholder="全部类型" clearable>
            <el-option label="透析机" value="dialysis" />
            <el-option label="水处理系统" value="ro" />
            <el-option label="配液系统" value="mix" />
          </el-select>
        </el-form-item>
        <el-form-item label="放行状态">
          <el-select placeholder="全部状态" clearable>
            <el-option label="已放行" value="pass" />
            <el-option label="待复核" value="review" />
            <el-option label="禁止上机" value="block" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker type="date" placeholder="业务日期" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>

      <div class="device-stat-grid">
        <el-card v-for="item in metrics" :key="item.label" :class="['device-stat-card', item.tone]" shadow="never">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </el-card>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :xl="16">
          <el-card class="device-main-card" shadow="never">
            <template #header>
              <div class="device-card-header">
                <div>
                  <strong>设备机位与放行状态</strong>
                  <p>示例数据不少于 10 条，覆盖透析机、水处理、配液、隔离设备、巡检、消毒、维修和水质状态。</p>
                </div>
                <el-tag type="primary" effect="plain">设备状态影响排班与上机核对</el-tag>
              </div>
            </template>
            <el-table :data="devices" border stripe highlight-current-row row-key="id" @row-click="selectDevice">
              <el-table-column prop="code" label="设备编号" width="95" fixed="left" />
              <el-table-column prop="type" label="类型" width="110" />
              <el-table-column prop="brandModel" label="品牌型号" min-width="160" />
              <el-table-column prop="zoneBed" label="位置/机位" min-width="130" />
              <el-table-column prop="bindStatus" label="绑定" width="95" />
              <el-table-column prop="runStatus" label="运行" width="95">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.runStatus)">{{ row.runStatus }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="releaseStatus" label="放行" width="105">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.releaseStatus)">{{ row.releaseStatus }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="inspection" label="巡检" width="100" />
              <el-table-column prop="disinfection" label="消毒" min-width="120" />
              <el-table-column prop="waterStatus" label="水质" width="110">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.waterStatus)" effect="plain">{{ row.waterStatus }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="alert" label="预警" min-width="130">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.alert)" effect="plain">{{ row.alert }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="repairStatus" label="维修" width="100" />
              <el-table-column prop="nextAction" label="下一步" min-width="130" />
              <el-table-column label="操作" width="260" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click.stop="selectDevice(row); inspectDialogVisible = true">巡检</el-button>
                  <el-button link @click.stop="selectDevice(row); disinfectionDialogVisible = true">消毒</el-button>
                  <el-button link @click.stop="selectDevice(row); repairDialogVisible = true">维修</el-button>
                  <el-button link @click.stop="selectDevice(row); waterDialogVisible = true">水质</el-button>
                  <el-button link @click.stop="selectDevice(row); alertDrawerVisible = true">追溯</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>

        <el-col :xs="24" :xl="8">
          <el-card class="device-side-card" shadow="never">
            <template #header>
              <div class="device-card-header">
                <strong>当前设备放行检查</strong>
                <el-tag :type="tagType(selectedDevice.releaseStatus)">{{ selectedDevice.releaseStatus }}</el-tag>
              </div>
            </template>
            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="设备">{{ selectedDevice.code }} / {{ selectedDevice.type }}</el-descriptions-item>
              <el-descriptions-item label="型号">{{ selectedDevice.brandModel }}</el-descriptions-item>
              <el-descriptions-item label="位置">{{ selectedDevice.zoneBed }}</el-descriptions-item>
              <el-descriptions-item label="预警">{{ selectedDevice.alert }}</el-descriptions-item>
            </el-descriptions>
            <div class="device-check-list">
              <div v-for="item in releaseChecks" :key="item.label" class="device-check-row">
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
                <el-icon :class="{ pass: item.pass, block: !item.pass }">
                  <CircleCheck v-if="item.pass" />
                  <Warning v-else />
                </el-icon>
              </div>
            </div>
            <div class="device-quick-actions">
              <el-button type="primary" :disabled="releaseChecks.some((item) => !item.pass)" @click="submitAction('设备已放行，可用于排班和上机核对')">放行</el-button>
              <el-button @click="repairDialogVisible = true">处理异常</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="device-workspace-card" shadow="never">
      <template #header>
        <div class="device-card-header">
          <div>
            <strong>运行监测与水质趋势</strong>
            <p>设备参数和水质结果异常时生成预警，未复核设备不得被排班或上机核对放行。</p>
          </div>
          <el-button type="primary" :icon="DataLine" @click="alertDrawerVisible = true">查看趋势</el-button>
        </div>
      </template>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="运行参数" name="monitor">
          <el-table :data="metricRows" border stripe>
            <el-table-column prop="time" label="时间" width="90" />
            <el-table-column prop="device" label="设备" width="100" />
            <el-table-column prop="metric" label="指标" min-width="130" />
            <el-table-column prop="value" label="值" width="90" />
            <el-table-column prop="unit" label="单位" width="90" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="tagType(row.status)">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="质控处理" name="quality">
          <div class="device-quality-grid">
            <el-card shadow="never" class="device-quality-card">
              <strong>设备异常</strong>
              <p>设备故障、压力异常、报警和维修结果必须形成维修闭环并复核放行。</p>
              <el-button :icon="Tools" @click="repairDialogVisible = true">维修登记</el-button>
            </el-card>
            <el-card shadow="never" class="device-quality-card">
              <strong>水质异常</strong>
              <p>电导率、余氯、硬度、细菌内毒素等异常进入看板预警和上机阻断。</p>
              <el-button :icon="Warning" @click="waterDialogVisible = true">水质复测</el-button>
            </el-card>
            <el-card shadow="never" class="device-quality-card">
              <strong>消毒追溯</strong>
              <p>透析机、隔离机位、水处理和配液系统消毒记录影响归档和感控统计。</p>
              <el-button :icon="CircleCheck" @click="disinfectionDialogVisible = true">补消毒</el-button>
            </el-card>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog v-model="archiveDialogVisible" title="设备档案维护" width="640px">
      <el-form label-width="110px">
        <el-form-item label="设备编号">
          <el-input :model-value="selectedDevice.code" />
        </el-form-item>
        <el-form-item label="设备类型">
          <el-input :model-value="selectedDevice.type" />
        </el-form-item>
        <el-form-item label="品牌型号">
          <el-input :model-value="selectedDevice.brandModel" />
        </el-form-item>
        <el-form-item label="启用状态">
          <el-switch active-text="启用" inactive-text="停用" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="archiveDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="archiveDialogVisible = false; submitAction('设备档案已保存')">保存档案</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="bindDialogVisible" title="设备与机位绑定" width="620px">
      <el-form label-width="110px">
        <el-form-item label="设备">
          <el-input :model-value="selectedDevice.code" />
        </el-form-item>
        <el-form-item label="机位">
          <el-input :model-value="selectedDevice.zoneBed" />
        </el-form-item>
        <el-form-item label="绑定状态">
          <el-radio-group model-value="bind">
            <el-radio-button label="bind">绑定</el-radio-button>
            <el-radio-button label="unbind">解绑</el-radio-button>
            <el-radio-button label="pause">暂停</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="bindDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="bindDialogVisible = false; submitAction('设备机位绑定已更新，排班可引用')">保存绑定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="inspectDialogVisible" title="设备巡检" width="640px">
      <el-form label-width="110px">
        <el-form-item label="巡检类型">
          <el-select model-value="daily">
            <el-option label="日常巡检" value="daily" />
            <el-option label="上机前巡检" value="before" />
            <el-option label="维修后复核" value="repair" />
          </el-select>
        </el-form-item>
        <el-form-item label="巡检结果">
          <el-radio-group model-value="pass">
            <el-radio-button label="pass">合格</el-radio-button>
            <el-radio-button label="review">待复核</el-radio-button>
            <el-radio-button label="fail">异常</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="记录">
          <el-input type="textarea" :rows="3" placeholder="记录压力、报警、管路、透析液、传感器和外观状态" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="inspectDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveInspection">保存巡检</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="repairDialogVisible" title="维修与异常处理" width="660px">
      <el-alert type="warning" show-icon :closable="false" title="维修未复核通过前，设备不得用于排班和上机核对。" />
      <el-form class="dialog-form" label-width="110px">
        <el-form-item label="故障描述">
          <el-input :model-value="selectedDevice.alert" />
        </el-form-item>
        <el-form-item label="处理结果">
          <el-radio-group model-value="done">
            <el-radio-button label="done">已修复</el-radio-button>
            <el-radio-button label="observe">观察</el-radio-button>
            <el-radio-button label="block">停用</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="维修记录">
          <el-input type="textarea" :rows="3" placeholder="记录维修措施、更换部件、复核结果和放行意见" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="repairDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="closeAlert">处理完成</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="disinfectionDialogVisible" title="设备消毒记录" width="640px">
      <el-form label-width="110px">
        <el-form-item label="消毒对象">
          <el-input :model-value="selectedDevice.code" />
        </el-form-item>
        <el-form-item label="消毒方式">
          <el-select model-value="heat">
            <el-option label="热消毒" value="heat" />
            <el-option label="化学消毒" value="chemical" />
            <el-option label="终末消毒" value="terminal" />
          </el-select>
        </el-form-item>
        <el-form-item label="结果">
          <el-radio-group model-value="pass">
            <el-radio-button label="pass">合格</el-radio-button>
            <el-radio-button label="review">待复核</el-radio-button>
            <el-radio-button label="fail">不合格</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="disinfectionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveDisinfection">保存消毒</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="waterDialogVisible" title="水质记录与复测" width="660px">
      <el-form label-width="110px">
        <el-form-item label="系统">
          <el-input :model-value="selectedDevice.code" />
        </el-form-item>
        <el-form-item label="检测项目">
          <el-select model-value="conductivity">
            <el-option label="电导率" value="conductivity" />
            <el-option label="余氯" value="chlorine" />
            <el-option label="硬度" value="hardness" />
            <el-option label="细菌/内毒素" value="endotoxin" />
          </el-select>
        </el-form-item>
        <el-form-item label="结果">
          <el-input placeholder="数值、单位和判定结果" />
        </el-form-item>
        <el-form-item label="处理意见">
          <el-input type="textarea" :rows="3" placeholder="异常复测、停用、通知护士站或恢复放行" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="waterDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="selectedDevice.waterStatus = '合格'; waterDialogVisible = false; submitAction('水质记录已保存，异常状态已复核')">保存水质</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="alertDrawerVisible" title="设备水质追溯" size="560px">
      <el-timeline>
        <el-timeline-item timestamp="08:00" type="primary">设备 {{ selectedDevice.code }} 巡检：{{ selectedDevice.inspection }}</el-timeline-item>
        <el-timeline-item timestamp="08:10" type="success">消毒状态：{{ selectedDevice.disinfection }}</el-timeline-item>
        <el-timeline-item timestamp="09:10" type="warning">水质/设备预警：{{ selectedDevice.alert }} / {{ selectedDevice.waterStatus }}</el-timeline-item>
        <el-timeline-item timestamp="后续">处理结果影响科室看板、排班排床和上机核对放行。</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
