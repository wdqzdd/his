<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  CircleCheck,
  Connection,
  Cpu,
  DataLine,
  Refresh,
  Search,
  Warning,
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{
  context: PageContext;
}>();

type InterfaceRow = {
  id: string;
  category: string;
  name: string;
  protocol: string;
  direction: string;
  dataScope: string;
  endpoint: string;
  status: string;
  lastSync: string;
  successRate: string;
  failCount: number;
  owner: string;
  nextAction: string;
};

type DeviceLinkRow = {
  id: string;
  device: string;
  type: string;
  bindTarget: string;
  protocol: string;
  collectItem: string;
  status: string;
  lastValue: string;
  lastTime: string;
  alert: string;
};

const sectionByMenu: Record<string, string> = {
  'integration-overview': 'reception',
  'integration-hospital': 'hospital',
  'integration-reception': 'reception',
  'integration-dialysis': 'dialysis',
  'integration-sync': 'sync',
};

const activeTab = ref(sectionByMenu[props.context.menuKey] ?? 'hospital');
const selectedInterfaceId = ref('INT-001');
const configDialogVisible = ref(false);
const retryDialogVisible = ref(false);
const mappingDialogVisible = ref(false);
const logDrawerVisible = ref(false);

watch(
  () => props.context.menuKey,
  (menuKey) => {
    activeTab.value = sectionByMenu[menuKey] ?? 'hospital';
  },
);

const interfaces = ref<InterfaceRow[]>([
  { id: 'INT-001', category: '院内系统', name: 'HIS 患者信息接口', protocol: 'FHIR/REST', direction: '双向', dataScope: '患者主索引、身份、医保', endpoint: '/api/his/patient', status: '正常', lastSync: '2026-05-10 16:20', successRate: '99.3%', failCount: 1, owner: '接口管理员', nextAction: '持续监测' },
  { id: 'INT-013', category: '院内系统', name: 'HIS 就诊信息接口', protocol: 'FHIR Encounter', direction: '双向', dataScope: '门诊/住院就诊、就诊号、结算号', endpoint: '/api/his/encounter', status: '正常', lastSync: '2026-05-10 16:21', successRate: '99.0%', failCount: 1, owner: '接口管理员', nextAction: '核对就诊绑定' },
  { id: 'INT-002', category: '院内系统', name: 'LIS 检验结果', protocol: 'HL7 ORU', direction: '入站', dataScope: '检验申请、结果、危急值', endpoint: 'MLLP:2575', status: '正常', lastSync: '2026-05-10 16:18', successRate: '98.9%', failCount: 2, owner: '检验科', nextAction: '复核危急值' },
  { id: 'INT-003', category: '院内系统', name: 'PACS 影像报告', protocol: 'DICOMweb', direction: '入站', dataScope: '影像报告、链接', endpoint: '/dicomweb/studies', status: '关注', lastSync: '2026-05-10 15:50', successRate: '96.1%', failCount: 5, owner: '影像科', nextAction: '检查超时' },
  { id: 'INT-004', category: '院内系统', name: 'EMR 病历同步', protocol: 'FHIR DocumentReference', direction: '双向', dataScope: '病历、病程、签名', endpoint: '/api/emr/document', status: '正常', lastSync: '2026-05-10 16:05', successRate: '99.1%', failCount: 0, owner: '病案室', nextAction: '持续监测' },
  { id: 'INT-005', category: '药房物资', name: '药房发药接口', protocol: 'REST', direction: '出站', dataScope: '医嘱、发药、退药', endpoint: '/api/pharmacy/dispense', status: '异常', lastSync: '2026-05-10 14:02', successRate: '91.4%', failCount: 12, owner: '药房', nextAction: '重试失败队列' },
  { id: 'INT-006', category: '药房物资', name: '物资库存接口', protocol: 'REST', direction: '双向', dataScope: '耗材库存、批号、效期', endpoint: '/api/material/stock', status: '正常', lastSync: '2026-05-10 16:22', successRate: '99.0%', failCount: 1, owner: '物资科', nextAction: '持续监测' },
  { id: 'INT-007', category: '收费医保', name: '收费明细接口', protocol: 'REST', direction: '出站', dataScope: '费用、欠费、结算', endpoint: '/api/billing/items', status: '关注', lastSync: '2026-05-10 16:00', successRate: '97.2%', failCount: 4, owner: '收费处', nextAction: '核对失败费用' },
  { id: 'INT-008', category: '接诊设备', name: '体重秤联机', protocol: '串口/网关', direction: '入站', dataScope: '透前体重、透后体重', endpoint: 'GW-WEIGHT-01', status: '正常', lastSync: '2026-05-10 15:58', successRate: '99.8%', failCount: 0, owner: '导诊台', nextAction: '持续采集' },
  { id: 'INT-009', category: '接诊设备', name: '血压计联机', protocol: '蓝牙/网关', direction: '入站', dataScope: '血压、脉搏', endpoint: 'GW-BP-02', status: '正常', lastSync: '2026-05-10 15:59', successRate: '99.5%', failCount: 0, owner: '护士站', nextAction: '持续采集' },
  { id: 'INT-010', category: '身份识别', name: 'IC卡读卡器', protocol: 'USB HID', direction: '入站', dataScope: '卡号、患者身份', endpoint: 'CARD-A01', status: '正常', lastSync: '2026-05-10 16:10', successRate: '99.9%', failCount: 0, owner: '导诊台', nextAction: '持续采集' },
  { id: 'INT-011', category: '身份识别', name: '人脸识别终端', protocol: 'HTTP SDK', direction: '入站', dataScope: '签到、身份核验', endpoint: 'FACE-A02', status: '关注', lastSync: '2026-05-10 13:46', successRate: '95.6%', failCount: 7, owner: '导诊台', nextAction: '校准设备' },
  { id: 'INT-014', category: '接诊设备', name: '体温采集终端', protocol: '蓝牙/网关', direction: '入站', dataScope: '体温、采集时间、异常标记', endpoint: 'GW-TEMP-01', status: '正常', lastSync: '2026-05-10 16:12', successRate: '99.2%', failCount: 0, owner: '护士站', nextAction: '异常转感控提醒' },
  { id: 'INT-015', category: '接诊设备', name: '语音播报终端', protocol: 'MQTT/HTTP', direction: '出站', dataScope: '候诊叫号、机位提醒、播报回执', endpoint: 'VOICE-A01', status: '关注', lastSync: '2026-05-10 16:13', successRate: '96.8%', failCount: 4, owner: '导诊台', nextAction: '重试播报回执' },
  { id: 'INT-016', category: '接诊设备', name: '签到记录回写', protocol: 'REST', direction: '双向', dataScope: '签到时间、方式、班次、机位', endpoint: '/api/checkins/device', status: '正常', lastSync: '2026-05-10 16:14', successRate: '99.4%', failCount: 0, owner: '导诊台', nextAction: '生成治疗草稿' },
  { id: 'INT-012', category: '透析设备', name: '透析机联机采集', protocol: '设备网关/IHE PCD', direction: '入站', dataScope: '静脉压、动脉压、TMP、温度、电导率、超滤、报警', endpoint: 'HD-GW-01', status: '正常', lastSync: '2026-05-10 16:23', successRate: '98.5%', failCount: 3, owner: '技师与设备站', nextAction: '核对报警映射' },
]);

const deviceLinks = ref<DeviceLinkRow[]>([
  { id: 'DEVL-001', device: 'HD-08', type: '透析机', bindTarget: 'A区08床/王建国', protocol: 'HD-GW-01', collectItem: '血流量 250ml/min', status: '在线', lastValue: '静脉压 148mmHg', lastTime: '16:22', alert: '无' },
  { id: 'DEVL-002', device: 'HD-27', type: '透析机', bindTarget: 'B区07床/陈志强', protocol: 'HD-GW-01', collectItem: '动脉压 -180mmHg / TMP 52mmHg', status: '在线', lastValue: '超滤速率 0.42L/h', lastTime: '16:20', alert: '无' },
  { id: 'DEVL-003', device: 'HD-46', type: '透析机', bindTarget: 'C区06床/曹敏', protocol: 'HD-GW-01', collectItem: '静脉压 205mmHg', status: '关注', lastValue: '压力波动', lastTime: '16:10', alert: '压力关注' },
  { id: 'DEVL-004', device: 'WEIGHT-01', type: '体重秤', bindTarget: '导诊台1', protocol: 'GW-WEIGHT-01', collectItem: '体重', status: '在线', lastValue: '62.4kg', lastTime: '15:58', alert: '无' },
  { id: 'DEVL-005', device: 'BP-02', type: '血压计', bindTarget: 'A区入口', protocol: 'GW-BP-02', collectItem: '血压/脉搏', status: '在线', lastValue: '138/82mmHg', lastTime: '15:59', alert: '无' },
  { id: 'DEVL-006', device: 'FACE-A02', type: '人脸识别', bindTarget: '导诊签到', protocol: 'HTTP SDK', collectItem: '身份核验', status: '关注', lastValue: '失败7次', lastTime: '13:46', alert: '光照异常' },
  { id: 'DEVL-007', device: 'TEMP-01', type: '体温采集', bindTarget: 'A区入口', protocol: 'GW-TEMP-01', collectItem: '体温', status: '在线', lastValue: '36.7℃', lastTime: '16:12', alert: '无' },
  { id: 'DEVL-008', device: 'VOICE-A01', type: '语音播报', bindTarget: '导诊候诊区', protocol: 'MQTT/HTTP', collectItem: '播报回执', status: '关注', lastValue: '播报失败4次', lastTime: '16:13', alert: '回执超时' },
  { id: 'DEVL-009', device: 'CHECKIN-API', type: '签到记录', bindTarget: '导诊签到', protocol: 'REST', collectItem: '签到方式/班次/机位', status: '在线', lastValue: 'A08 上午班', lastTime: '16:14', alert: '无' },
  { id: 'DEVL-010', device: 'HD-08', type: '透析机', bindTarget: 'A区08床/王建国', protocol: 'HD-GW-01', collectItem: '透析液温度/电导率/超滤总量', status: '在线', lastValue: '36.5℃ / 13.8mS/cm / 1.2L', lastTime: '16:24', alert: '无' },
]);

const selectedInterface = computed(() => interfaces.value.find((item) => item.id === selectedInterfaceId.value) ?? interfaces.value[0]);

const metrics = computed(() => [
  { label: '接口总数', value: interfaces.value.length, tone: 'blue' },
  { label: '正常', value: interfaces.value.filter((item) => item.status === '正常').length, tone: 'green' },
  { label: '关注', value: interfaces.value.filter((item) => item.status === '关注').length, tone: 'orange' },
  { label: '异常', value: interfaces.value.filter((item) => item.status === '异常').length, tone: 'red' },
  { label: '失败队列', value: interfaces.value.reduce((sum, item) => sum + item.failCount, 0), tone: 'orange' },
]);

const closureChecks = computed(() => [
  { label: '协议', value: selectedInterface.value.protocol, pass: true },
  { label: '数据范围', value: selectedInterface.value.dataScope, pass: true },
  { label: '端点', value: selectedInterface.value.endpoint, pass: true },
  { label: '同步状态', value: selectedInterface.value.status, pass: selectedInterface.value.status === '正常' },
  { label: '成功率', value: selectedInterface.value.successRate, pass: Number.parseFloat(selectedInterface.value.successRate) >= 98 },
  { label: '失败队列', value: `${selectedInterface.value.failCount} 条`, pass: selectedInterface.value.failCount === 0 },
]);

const logRows = computed(() => [
  { time: '16:23', source: selectedInterface.value.name, event: '接收数据', entity: 'TX-20260510-142', result: '成功', retry: '无需重试' },
  { time: '16:18', source: 'LIS 检验结果', event: '危急值入库', entity: 'LAB-20260510-071', result: '成功', retry: '已通知医生' },
  { time: '14:02', source: '药房发药接口', event: '发药回执', entity: 'RX-20260510-022', result: '失败', retry: '待重试' },
  { time: '13:46', source: '人脸识别终端', event: '签到核验', entity: 'P-00203', result: '失败', retry: '人工核验' },
  { time: '13:50', source: '体温采集终端', event: '体温异常标记', entity: 'P-00208', result: '成功', retry: '转感控提醒' },
  { time: '13:55', source: '语音播报终端', event: '候诊播报回执', entity: 'VOICE-20260510-026', result: '失败', retry: '待重试' },
  { time: '14:10', source: '同步异常记录', event: '费用信息冲突', entity: 'FEE-20260510-019', result: '失败', retry: '人工处理' },
]);

const activeTables = ['integration_channel', 'integration_mapping', 'integration_sync_log', 'integration_retry_queue', 'device_gateway', 'device_collect_record'];

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (['正常', '在线', '成功', '无需重试', '已通知医生', '持续监测', '持续采集'].includes(value)) return 'success';
  if (['异常', '失败'].includes(value)) return 'danger';
  if (value.includes('关注') || value.includes('待') || value.includes('人工') || value.includes('重试') || value.includes('校准')) return 'warning';
  return 'info';
}

function selectInterface(row: InterfaceRow): void {
  selectedInterfaceId.value = row.id;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}

function saveConfig(): void {
  configDialogVisible.value = false;
  submitAction('接口配置已保存，连接测试通过后可启用');
}

function retryFailed(): void {
  selectedInterface.value.failCount = 0;
  selectedInterface.value.status = '正常';
  retryDialogVisible.value = false;
  submitAction('失败队列已重试，结果写入同步日志');
}

function saveMapping(): void {
  mappingDialogVisible.value = false;
  submitAction('字段映射已保存，新数据将按映射规则转换');
}
</script>

<template>
  <section class="integration-page">
    <el-card class="integration-work-card" shadow="never">
      <template #header>
        <div class="integration-header">
          <div>
            <h2>接口与设备集成管理</h2>
            <p>统一管理 HIS、LIS、PACS、EMR、药房、物资、收费、接诊设备和透析机联机，确保同步、采集、重试和审计可追溯。</p>
          </div>
          <div class="integration-actions">
            <el-button type="primary" :icon="Connection" @click="configDialogVisible = true">接口配置</el-button>
            <el-button :icon="Refresh" @click="retryDialogVisible = true">失败重试</el-button>
            <el-button :icon="DataLine" @click="mappingDialogVisible = true">字段映射</el-button>
            <el-button :icon="Cpu" @click="logDrawerVisible = true">同步日志</el-button>
          </div>
        </div>
      </template>

      <el-form class="integration-filter" inline>
        <el-form-item label="接口类别">
          <el-select placeholder="全部类别" clearable>
            <el-option label="院内系统" value="hospital" />
            <el-option label="药房物资" value="stock" />
            <el-option label="收费医保" value="fee" />
            <el-option label="接诊设备" value="reception" />
            <el-option label="透析设备" value="dialysis" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select placeholder="全部状态" clearable>
            <el-option label="正常" value="normal" />
            <el-option label="关注" value="watch" />
            <el-option label="异常" value="error" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键字">
          <el-input placeholder="接口、协议、端点、责任方" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>

      <div class="integration-stat-grid">
        <el-card v-for="item in metrics" :key="item.label" :class="['integration-stat-card', item.tone]" shadow="never">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </el-card>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :xl="16">
          <el-card class="integration-main-card" shadow="never">
            <template #header>
              <div class="integration-card-header">
                <div>
                  <strong>接口通道与同步状态</strong>
                  <p>示例数据不少于 10 条，覆盖院内系统、药房物资、收费和设备联机，异常可重试并追溯日志。</p>
                </div>
                <el-tag type="primary" effect="plain">配置 -> 映射 -> 同步/采集 -> 重试 -> 日志审计</el-tag>
              </div>
            </template>
            <el-table :data="interfaces" border stripe highlight-current-row row-key="id" @row-click="selectInterface">
              <el-table-column prop="category" label="类别" width="110" fixed="left" />
              <el-table-column prop="name" label="接口名称" min-width="155" />
              <el-table-column prop="protocol" label="协议" min-width="130" />
              <el-table-column prop="direction" label="方向" width="80" />
              <el-table-column prop="dataScope" label="数据范围" min-width="180" />
              <el-table-column prop="endpoint" label="端点/网关" min-width="150" />
              <el-table-column prop="status" label="状态" width="85">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.status)">{{ row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="lastSync" label="最后同步" min-width="150" />
              <el-table-column prop="successRate" label="成功率" width="95" />
              <el-table-column prop="failCount" label="失败" width="75" />
              <el-table-column prop="owner" label="责任方" min-width="120" />
              <el-table-column prop="nextAction" label="下一步" min-width="120" />
              <el-table-column label="操作" width="220" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click.stop="selectInterface(row); configDialogVisible = true">配置</el-button>
                  <el-button link @click.stop="selectInterface(row); mappingDialogVisible = true">映射</el-button>
                  <el-button link @click.stop="selectInterface(row); retryDialogVisible = true">重试</el-button>
                  <el-button link @click.stop="selectInterface(row); logDrawerVisible = true">日志</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>

        <el-col :xs="24" :xl="8">
          <el-card class="integration-side-card" shadow="never">
            <template #header>
              <div class="integration-card-header">
                <strong>当前接口闭环</strong>
                <el-tag :type="tagType(selectedInterface.status)">{{ selectedInterface.status }}</el-tag>
              </div>
            </template>
            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="接口">{{ selectedInterface.name }}</el-descriptions-item>
              <el-descriptions-item label="协议">{{ selectedInterface.protocol }}</el-descriptions-item>
              <el-descriptions-item label="范围">{{ selectedInterface.dataScope }}</el-descriptions-item>
              <el-descriptions-item label="责任">{{ selectedInterface.owner }}</el-descriptions-item>
            </el-descriptions>
            <div class="integration-check-list">
              <div v-for="item in closureChecks" :key="item.label" class="integration-check-row">
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
                <el-icon :class="{ pass: item.pass, block: !item.pass }">
                  <CircleCheck v-if="item.pass" />
                  <Warning v-else />
                </el-icon>
              </div>
            </div>
            <div class="integration-quick-actions">
              <el-button type="primary" @click="retryDialogVisible = true">重试失败</el-button>
              <el-button @click="logDrawerVisible = true">查看日志</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="integration-workspace-card" shadow="never">
      <template #header>
        <div class="integration-card-header">
          <div>
            <strong>设备联机采集与同步日志</strong>
            <p>接诊设备和透析机数据采集必须绑定患者、机位或治疗记录，采集异常进入日志和人工处理队列。</p>
          </div>
          <el-button type="primary" :icon="Cpu" @click="logDrawerVisible = true">查看采集日志</el-button>
        </div>
      </template>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="设备联机" name="reception">
          <el-table :data="deviceLinks" border stripe>
            <el-table-column prop="device" label="设备" width="110" />
            <el-table-column prop="type" label="类型" width="110" />
            <el-table-column prop="bindTarget" label="绑定对象" min-width="150" />
            <el-table-column prop="protocol" label="协议/网关" min-width="130" />
            <el-table-column prop="collectItem" label="采集项目" min-width="150" />
            <el-table-column prop="lastValue" label="最近值" min-width="140" />
            <el-table-column prop="lastTime" label="时间" width="80" />
            <el-table-column prop="status" label="状态" width="85">
              <template #default="{ row }">
                <el-tag :type="tagType(row.status)">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="alert" label="报警" width="110" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="同步日志" name="sync">
          <el-table :data="logRows" border stripe>
            <el-table-column prop="time" label="时间" width="90" />
            <el-table-column prop="source" label="来源" min-width="160" />
            <el-table-column prop="event" label="事件" min-width="130" />
            <el-table-column prop="entity" label="业务记录" min-width="150" />
            <el-table-column prop="result" label="结果" width="90">
              <template #default="{ row }">
                <el-tag :type="tagType(row.result)">{{ row.result }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="retry" label="处理" min-width="130" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog v-model="configDialogVisible" title="接口配置" width="700px">
      <el-form label-width="110px">
        <el-form-item label="接口名称">
          <el-input :model-value="selectedInterface.name" />
        </el-form-item>
        <el-form-item label="协议">
          <el-input :model-value="selectedInterface.protocol" />
        </el-form-item>
        <el-form-item label="端点/网关">
          <el-input :model-value="selectedInterface.endpoint" />
        </el-form-item>
        <el-form-item label="认证方式">
          <el-select model-value="token">
            <el-option label="Token" value="token" />
            <el-option label="证书" value="cert" />
            <el-option label="院内专线白名单" value="whitelist" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="configDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveConfig">保存并测试</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="mappingDialogVisible" title="字段映射" width="700px">
      <el-form label-width="110px">
        <el-form-item label="来源字段">
          <el-input placeholder="例如：patient_id, test_result, device_value" />
        </el-form-item>
        <el-form-item label="目标字段">
          <el-input placeholder="例如：patientId, resultValue, collectedValue" />
        </el-form-item>
        <el-form-item label="转换规则">
          <el-input type="textarea" :rows="3" placeholder="单位换算、字典映射、异常值标记和必填校验" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="mappingDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveMapping">保存映射</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="retryDialogVisible" title="失败队列重试" width="620px">
      <el-alert type="warning" show-icon :closable="false" title="重试前应确认字段映射、患者匹配、业务幂等和目标系统状态，避免重复计费或重复执行。" />
      <el-form class="dialog-form" label-width="110px">
        <el-form-item label="接口">
          <el-input :model-value="selectedInterface.name" />
        </el-form-item>
        <el-form-item label="失败条数">
          <el-input :model-value="`${selectedInterface.failCount} 条`" />
        </el-form-item>
        <el-form-item label="处理方式">
          <el-radio-group model-value="retry">
            <el-radio-button label="retry">自动重试</el-radio-button>
            <el-radio-button label="manual">人工处理</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="retryDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="retryFailed">确认重试</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="logDrawerVisible" title="接口同步与设备采集日志" size="650px">
      <el-table :data="logRows" border stripe>
        <el-table-column prop="time" label="时间" width="90" />
        <el-table-column prop="source" label="来源" min-width="170" />
        <el-table-column prop="event" label="事件" min-width="140" />
        <el-table-column prop="entity" label="业务记录" min-width="150" />
        <el-table-column prop="result" label="结果" width="90">
          <template #default="{ row }">
            <el-tag :type="tagType(row.result)">{{ row.result }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="retry" label="处理" min-width="130" />
      </el-table>
    </el-drawer>
  </section>
</template>
