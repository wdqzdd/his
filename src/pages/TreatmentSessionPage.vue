<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  CircleCheck,
  Clock,
  Connection,
  DocumentChecked,
  FirstAidKit,
  Monitor,
  Search,
  Warning,
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

defineProps<{
  context: PageContext;
}>();

type SessionRow = {
  id: string;
  patient: string;
  dialysisNo: string;
  shift: string;
  bed: string;
  device: string;
  mode: string;
  prescription: string;
  access: string;
  preStatus: string;
  machineCheck: string;
  chargeNurseCheck: string;
  treatmentStatus: string;
  monitorStatus: string;
  symptom: string;
  postStatus: string;
  archiveReady: string;
  risk: string;
  nextAction: string;
};

type VitalRow = {
  time: string;
  bp: string;
  pulse: string;
  venousPressure: string;
  tmp: string;
  uf: string;
  status: string;
};

const selectedSessionId = ref('TS-001');
const activeStep = ref(1);
const preDialogVisible = ref(false);
const machineDialogVisible = ref(false);
const startDialogVisible = ref(false);
const monitorDialogVisible = ref(false);
const symptomDialogVisible = ref(false);
const stopDialogVisible = ref(false);
const postDialogVisible = ref(false);
const traceDrawerVisible = ref(false);

const sessions = ref<SessionRow[]>([
  { id: 'TS-001', patient: '王建国', dialysisNo: 'HD-00038', shift: '上午班', bed: 'A区08床', device: 'HD-08', mode: 'HD', prescription: '4.0h / BFR260 / UF2.1L', access: '左前臂自体内瘘', preStatus: '已完成', machineCheck: '待核对', chargeNurseCheck: '待主班核对', treatmentStatus: '待上机', monitorStatus: '未开始', symptom: '无', postStatus: '未完成', archiveReady: '否', risk: '低', nextAction: '上机核对' },
  { id: 'TS-002', patient: '李秀兰', dialysisNo: 'HD-00072', shift: '上午班', bed: 'A区12床', device: 'HD-12', mode: 'HD', prescription: '4.0h / BFR220 / UF1.8L', access: '右颈长期导管', preStatus: '待复核', machineCheck: '未核对', chargeNurseCheck: '待主班核对', treatmentStatus: '待上机', monitorStatus: '未开始', symptom: '导管出口红肿', postStatus: '未完成', archiveReady: '否', risk: '中', nextAction: '复核通路' },
  { id: 'TS-003', patient: '赵明', dialysisNo: 'HD-00116', shift: '下午班', bed: 'B区03床', device: 'HD-23', mode: 'HD', prescription: '4.5h / BFR280 / UF2.4L', access: '右前臂自体内瘘', preStatus: '暂停', machineCheck: '暂停', chargeNurseCheck: '暂停', treatmentStatus: '暂停', monitorStatus: '未开始', symptom: '高钾待处理', postStatus: '未完成', archiveReady: '否', risk: '高', nextAction: '等医生确认' },
  { id: 'TS-004', patient: '陈志强', dialysisNo: 'HD-00128', shift: '下午班', bed: 'B区07床', device: 'HD-27', mode: 'HD+HF', prescription: '4.0h / BFR260 / UF2.0L', access: '左上臂人工血管', preStatus: '已完成', machineCheck: '已核对', chargeNurseCheck: '已主班核对', treatmentStatus: '透析中', monitorStatus: '按时记录', symptom: '通路压力高', postStatus: '未完成', archiveReady: '否', risk: '中', nextAction: '记录症状处理' },
  { id: 'TS-005', patient: '刘梅英', dialysisNo: 'HD-00151', shift: '夜班', bed: 'C区02床', device: 'HD-42', mode: 'HD+HP', prescription: '4.0h / BFR200 / UF1.5L', access: '股静脉临时导管', preStatus: '未完成', machineCheck: '未核对', chargeNurseCheck: '未核对', treatmentStatus: '待上机', monitorStatus: '未开始', symptom: '专项同意待确认', postStatus: '未完成', archiveReady: '否', risk: '高', nextAction: '补透前评估' },
  { id: 'TS-006', patient: '孙海', dialysisNo: 'HD-00177', shift: '上午班', bed: 'A区05床', device: 'HD-05', mode: 'HD', prescription: '4.0h / BFR260 / UF2.2L', access: '左前臂自体内瘘', preStatus: '已完成', machineCheck: '已核对', chargeNurseCheck: '已主班核对', treatmentStatus: '透析中', monitorStatus: '按时记录', symptom: '无', postStatus: '未完成', archiveReady: '否', risk: '低', nextAction: '继续监测' },
  { id: 'TS-007', patient: '马丽', dialysisNo: 'HD-00203', shift: '上午班', bed: '隔离区01床', device: 'ISO-01', mode: '隔离HD', prescription: '4.0h / BFR250 / UF1.9L', access: '右前臂自体内瘘', preStatus: '已完成', machineCheck: '待核对', chargeNurseCheck: '待主班核对', treatmentStatus: '待上机', monitorStatus: '未开始', symptom: '隔离流程', postStatus: '未完成', archiveReady: '否', risk: '中', nextAction: '核对隔离物品' },
  { id: 'TS-008', patient: '周庆', dialysisNo: 'HD-00218', shift: '下午班', bed: 'A区16床', device: 'HD-16', mode: 'HD', prescription: '4.0h / BFR210 / UF≤2.0L', access: '右颈长期导管', preStatus: '已完成', machineCheck: '已核对', chargeNurseCheck: '已主班核对', treatmentStatus: '透析中', monitorStatus: '超时未记', symptom: '低血压风险', postStatus: '未完成', archiveReady: '否', risk: '高', nextAction: '补监测记录' },
  { id: 'TS-009', patient: '何雪', dialysisNo: 'HD-00246', shift: '下午班', bed: 'B区11床', device: 'HD-31', mode: 'HD', prescription: '4.0h / BFR260 / UF2.3L', access: '左前臂自体内瘘', preStatus: '已完成', machineCheck: '已核对', chargeNurseCheck: '已主班核对', treatmentStatus: '已下机', monitorStatus: '完整', symptom: '无', postStatus: '待评估', archiveReady: '否', risk: '中', nextAction: '完成透后评估' },
  { id: 'TS-010', patient: '郭强', dialysisNo: 'HD-00277', shift: '夜班', bed: 'C区06床', device: 'HD-46', mode: 'HD', prescription: '4.5h / BFR280 / UF2.5L', access: '左上臂人工血管', preStatus: '已完成', machineCheck: '已核对', chargeNurseCheck: '已主班核对', treatmentStatus: '透析中', monitorStatus: '按时记录', symptom: '肌痉挛', postStatus: '未完成', archiveReady: '否', risk: '高', nextAction: '记录症状处理' },
  { id: 'TS-011', patient: '曹敏', dialysisNo: 'HD-00291', shift: '上午班', bed: 'A区10床', device: 'HD-10', mode: 'HD', prescription: '4.0h / BFR260 / UF2.0L', access: '右前臂自体内瘘', preStatus: '已完成', machineCheck: '已核对', chargeNurseCheck: '已主班核对', treatmentStatus: '已下机', monitorStatus: '完整', symptom: '无', postStatus: '已完成', archiveReady: '是', risk: '低', nextAction: '进入归档审核' },
  { id: 'TS-012', patient: '潘德胜', dialysisNo: 'HD-00305', shift: '下午班', bed: 'B区15床', device: 'HD-35', mode: 'HD', prescription: '4.0h / BFR210 / UF1.7L', access: '右颈长期导管', preStatus: '已完成', machineCheck: '待核对', chargeNurseCheck: '待主班核对', treatmentStatus: '待上机', monitorStatus: '未开始', symptom: '跌倒风险', postStatus: '未完成', archiveReady: '否', risk: '中', nextAction: '上机核对' },
]);

const vitalRows: VitalRow[] = [
  { time: '08:35', bp: '142/82', pulse: '78', venousPressure: '145 mmHg', tmp: '42 mmHg', uf: '0.4L', status: '正常' },
  { time: '09:05', bp: '136/78', pulse: '80', venousPressure: '150 mmHg', tmp: '44 mmHg', uf: '0.8L', status: '正常' },
  { time: '09:35', bp: '128/76', pulse: '82', venousPressure: '158 mmHg', tmp: '46 mmHg', uf: '1.2L', status: '正常' },
  { time: '10:05', bp: '112/68', pulse: '88', venousPressure: '172 mmHg', tmp: '50 mmHg', uf: '1.5L', status: '关注' },
  { time: '10:35', bp: '118/70', pulse: '84', venousPressure: '164 mmHg', tmp: '48 mmHg', uf: '1.8L', status: '已处理' },
];

const selectedSession = computed(() => sessions.value.find((item) => item.id === selectedSessionId.value) ?? sessions.value[0]);

const metrics = computed(() => [
  { label: '当日治疗', value: sessions.value.length, tone: 'blue' },
  { label: '透析中', value: sessions.value.filter((item) => item.treatmentStatus === '透析中').length, tone: 'green' },
  { label: '待上机', value: sessions.value.filter((item) => item.treatmentStatus === '待上机').length, tone: 'orange' },
  { label: '高风险', value: sessions.value.filter((item) => item.risk === '高').length, tone: 'red' },
  { label: '可归档', value: sessions.value.filter((item) => item.archiveReady === '是').length, tone: 'green' },
]);

const closureChecks = computed(() => [
  { label: '透前评估', value: selectedSession.value.preStatus, pass: selectedSession.value.preStatus === '已完成' },
  { label: '上机核对', value: selectedSession.value.machineCheck, pass: selectedSession.value.machineCheck === '已核对' },
  { label: '主班核对', value: selectedSession.value.chargeNurseCheck, pass: selectedSession.value.chargeNurseCheck === '已主班核对' },
  { label: '治疗状态', value: selectedSession.value.treatmentStatus, pass: ['透析中', '已下机'].includes(selectedSession.value.treatmentStatus) },
  { label: '透中监测', value: selectedSession.value.monitorStatus, pass: ['按时记录', '完整'].includes(selectedSession.value.monitorStatus) },
  { label: '透后评估', value: selectedSession.value.postStatus, pass: selectedSession.value.postStatus === '已完成' },
]);

const activeTables = [
  'treatment_session',
  'pre_treatment_assessment',
  'machine_check_record',
  'charge_nurse_check_record',
  'treatment_parameter',
  'treatment_vital_sign',
  'treatment_symptom_event',
  'post_treatment_assessment',
];

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (['已完成', '已核对', '透析中', '按时记录', '完整', '已下机', '是', '正常', '已处理', '低'].includes(value)) return 'success';
  if (['暂停', '高', '超时未记'].includes(value) || value.includes('待处理')) return 'danger';
  if (value.includes('待') || value.includes('未') || value === '中' || value !== '无') return 'warning';
  return 'info';
}

function selectSession(row: SessionRow): void {
  selectedSessionId.value = row.id;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}

function completePre(): void {
  selectedSession.value.preStatus = '已完成';
  preDialogVisible.value = false;
  submitAction('透前评估已完成，可进入上机核对');
}

function completeMachineCheck(): void {
  selectedSession.value.machineCheck = '已核对';
  selectedSession.value.chargeNurseCheck = '已主班核对';
  machineDialogVisible.value = false;
  submitAction('上机核对与主班核对已通过，处方、通路和设备状态已确认');
}

function startTreatment(): void {
  selectedSession.value.treatmentStatus = '透析中';
  selectedSession.value.monitorStatus = '按时记录';
  activeStep.value = 3;
  startDialogVisible.value = false;
  submitAction('患者已上机，治疗监测开始');
}

function stopTreatment(): void {
  selectedSession.value.treatmentStatus = '已下机';
  selectedSession.value.postStatus = '待评估';
  activeStep.value = 5;
  stopDialogVisible.value = false;
  submitAction('患者已下机，请完成透后评估');
}

function completePost(): void {
  selectedSession.value.postStatus = '已完成';
  selectedSession.value.archiveReady = closureChecks.value.every((item) => item.pass) ? '是' : selectedSession.value.archiveReady;
  postDialogVisible.value = false;
  submitAction('透后评估已完成，符合条件后进入归档审核');
}
</script>

<template>
  <section class="treatment-session-page">
    <el-card class="treatment-work-card" shadow="never">
      <template #header>
        <div class="treatment-header">
          <div>
            <h2>血液净化治疗记录</h2>
            <p>从当日排班和已核对医嘱进入单次治疗，完成透前评估、上机核对、透中监测、症状处理、下机和透后评估。</p>
          </div>
          <div class="treatment-actions">
            <el-button type="primary" :icon="FirstAidKit" @click="preDialogVisible = true">透前评估</el-button>
            <el-button :icon="Connection" @click="machineDialogVisible = true">上机核对</el-button>
            <el-button :icon="CircleCheck" @click="startDialogVisible = true">患者上机</el-button>
            <el-button :icon="Monitor" @click="monitorDialogVisible = true">记录监测</el-button>
            <el-button :icon="Warning" @click="symptomDialogVisible = true">症状处理</el-button>
            <el-button :icon="DocumentChecked" @click="postDialogVisible = true">透后评估</el-button>
          </div>
        </div>
      </template>

      <el-form class="treatment-filter" inline>
        <el-form-item label="患者">
          <el-input placeholder="姓名、透析号、床位、设备" clearable />
        </el-form-item>
        <el-form-item label="班次">
          <el-select placeholder="全部班次" clearable>
            <el-option label="上午班" value="am" />
            <el-option label="下午班" value="pm" />
            <el-option label="夜班" value="night" />
          </el-select>
        </el-form-item>
        <el-form-item label="治疗状态">
          <el-select placeholder="全部状态" clearable>
            <el-option label="待上机" value="ready" />
            <el-option label="透析中" value="running" />
            <el-option label="已下机" value="off" />
            <el-option label="暂停" value="hold" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker type="date" placeholder="治疗日期" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>

      <div class="treatment-stat-grid">
        <el-card v-for="item in metrics" :key="item.label" :class="['treatment-stat-card', item.tone]" shadow="never">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </el-card>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :xl="16">
          <el-card class="treatment-main-card" shadow="never">
            <template #header>
              <div class="treatment-card-header">
                <div>
                  <strong>当日治疗列表</strong>
                  <p>示例数据不少于 10 条，覆盖待上机、透析中、已下机、暂停、监测缺项和可归档状态。</p>
                </div>
                <el-tag type="primary" effect="plain">排班 -> 医嘱执行 -> 治疗记录</el-tag>
              </div>
            </template>
            <el-table :data="sessions" border stripe highlight-current-row row-key="id" @row-click="selectSession">
              <el-table-column prop="patient" label="患者" width="95" fixed="left" />
              <el-table-column prop="dialysisNo" label="透析号" width="115" />
              <el-table-column prop="shift" label="班次" width="90" />
              <el-table-column prop="bed" label="机位" width="105" />
              <el-table-column prop="device" label="设备" width="95" />
              <el-table-column prop="mode" label="模式" width="90" />
              <el-table-column prop="prescription" label="处方参数" min-width="180" />
              <el-table-column prop="access" label="通路" min-width="150" />
              <el-table-column prop="preStatus" label="透前" width="95">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.preStatus)">{{ row.preStatus }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="machineCheck" label="上机核对" width="105">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.machineCheck)" effect="plain">{{ row.machineCheck }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="chargeNurseCheck" label="主班核对" width="110">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.chargeNurseCheck)" effect="plain">{{ row.chargeNurseCheck }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="treatmentStatus" label="治疗" width="95">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.treatmentStatus)">{{ row.treatmentStatus }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="monitorStatus" label="监测" width="100">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.monitorStatus)" effect="plain">{{ row.monitorStatus }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="symptom" label="症状/事件" min-width="130">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.symptom)" effect="plain">{{ row.symptom }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="postStatus" label="透后" width="95" />
              <el-table-column prop="archiveReady" label="可归档" width="90">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.archiveReady)">{{ row.archiveReady }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="nextAction" label="下一步" min-width="130" />
              <el-table-column label="操作" width="270" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click.stop="selectSession(row); preDialogVisible = true">透前</el-button>
                  <el-button link @click.stop="selectSession(row); machineDialogVisible = true">核对</el-button>
                  <el-button link @click.stop="selectSession(row); monitorDialogVisible = true">监测</el-button>
                  <el-button link @click.stop="selectSession(row); stopDialogVisible = true">下机</el-button>
                  <el-button link @click.stop="selectSession(row); traceDrawerVisible = true">追溯</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>

        <el-col :xs="24" :xl="8">
          <el-card class="treatment-side-card" shadow="never">
            <template #header>
              <div class="treatment-card-header">
                <strong>当前治疗闭环检查</strong>
                <el-tag :type="tagType(selectedSession.risk)">{{ selectedSession.risk }}风险</el-tag>
              </div>
            </template>
            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="患者">{{ selectedSession.patient }} / {{ selectedSession.dialysisNo }}</el-descriptions-item>
              <el-descriptions-item label="机位设备">{{ selectedSession.bed }} / {{ selectedSession.device }}</el-descriptions-item>
              <el-descriptions-item label="处方">{{ selectedSession.prescription }}</el-descriptions-item>
              <el-descriptions-item label="通路">{{ selectedSession.access }}</el-descriptions-item>
            </el-descriptions>
            <div class="treatment-check-list">
              <div v-for="item in closureChecks" :key="item.label" class="treatment-check-row">
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
                <el-icon :class="{ pass: item.pass, block: !item.pass }">
                  <CircleCheck v-if="item.pass" />
                  <Warning v-else />
                </el-icon>
              </div>
            </div>
            <div class="treatment-quick-actions">
              <el-button type="primary" :disabled="closureChecks.some((item) => !item.pass)" @click="submitAction('治疗过程完整，可进入归档审核')">
                进入归档审核
              </el-button>
              <el-button @click="symptomDialogVisible = true">登记症状</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="treatment-workspace-card" shadow="never">
      <template #header>
        <div class="treatment-card-header">
          <div>
            <strong>治疗过程记录</strong>
            <p>按步骤记录透前、上机、透中、症状、下机和透后，任何缺项都会阻断归档。</p>
          </div>
          <el-tag type="primary" effect="plain">{{ selectedSession.patient }} / {{ selectedSession.bed }}</el-tag>
        </div>
      </template>
      <el-steps :active="activeStep" finish-status="success" simple class="treatment-steps">
        <el-step title="透前评估" />
        <el-step title="上机核对" />
        <el-step title="透析中" />
        <el-step title="症状处理" />
        <el-step title="下机评估" />
      </el-steps>
      <el-row :gutter="16" class="treatment-detail-row">
        <el-col :xs="24" :xl="15">
          <el-card shadow="never" class="treatment-detail-card">
            <template #header>
              <strong>透中监测</strong>
            </template>
            <el-table :data="vitalRows" border stripe>
              <el-table-column prop="time" label="时间" width="90" />
              <el-table-column prop="bp" label="血压" width="105" />
              <el-table-column prop="pulse" label="脉搏" width="90" />
              <el-table-column prop="venousPressure" label="静脉压" width="130" />
              <el-table-column prop="tmp" label="跨膜压" width="110" />
              <el-table-column prop="uf" label="累计超滤" width="110" />
              <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.status)">{{ row.status }}</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :xs="24" :xl="9">
          <el-card shadow="never" class="treatment-detail-card">
            <template #header>
              <strong>关键提醒</strong>
            </template>
            <div class="treatment-alert-list">
              <div>
                <el-icon><Clock /></el-icon>
                <span>透中生命体征和设备参数需按规则间隔记录。</span>
              </div>
              <div>
                <el-icon><Warning /></el-icon>
                <span>低血压、肌痉挛、通路压力异常必须登记症状事件。</span>
              </div>
              <div>
                <el-icon><DocumentChecked /></el-icon>
                <span>下机后需完成透后评估，才能进入小结和归档。</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-dialog v-model="preDialogVisible" title="透前评估" width="660px">
      <el-form label-width="110px">
        <el-form-item label="患者">
          <el-input :model-value="`${selectedSession.patient} / ${selectedSession.bed}`" />
        </el-form-item>
        <el-form-item label="透前体重">
          <el-input placeholder="kg" />
        </el-form-item>
        <el-form-item label="血压/体温">
          <el-input placeholder="例如 142/82 mmHg，36.6℃" />
        </el-form-item>
        <el-form-item label="通路状态">
          <el-select model-value="ok">
            <el-option label="可用" value="ok" />
            <el-option label="需复核" value="review" />
            <el-option label="不可用" value="block" />
          </el-select>
        </el-form-item>
        <el-form-item label="风险提示">
          <el-input type="textarea" :rows="3" placeholder="记录跌倒、低血压、感染、导管、通路、危急值等风险" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="preDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="completePre">完成透前评估</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="machineDialogVisible" title="上机核对" width="660px">
      <el-alert type="warning" show-icon :closable="false" title="上机核对必须确认患者、机位、设备、处方、抗凝、通路和医嘱执行计划。" />
      <el-form class="dialog-form" label-width="110px">
        <el-form-item label="设备状态">
          <el-radio-group model-value="pass">
            <el-radio-button label="pass">可用</el-radio-button>
            <el-radio-button label="hold">待复核</el-radio-button>
            <el-radio-button label="block">不可用</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="核对项目">
          <el-checkbox-group model-value="patient">
            <el-checkbox-button label="patient">患者身份</el-checkbox-button>
            <el-checkbox-button label="rx">处方</el-checkbox-button>
            <el-checkbox-button label="access">通路</el-checkbox-button>
            <el-checkbox-button label="device">设备</el-checkbox-button>
            <el-checkbox-button label="orders">医嘱</el-checkbox-button>
            <el-checkbox-button label="charge">主班复核</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="核对说明">
          <el-input type="textarea" :rows="3" placeholder="记录双人核对人、主班护士、异常项和放行意见" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="machineDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="completeMachineCheck">核对通过</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="startDialogVisible" title="患者上机" width="560px">
      <el-form label-width="110px">
        <el-form-item label="上机时间">
          <el-date-picker type="datetime" placeholder="选择上机时间" />
        </el-form-item>
        <el-form-item label="穿刺/连接">
          <el-input placeholder="记录穿刺方式、导管连接和初始血流量" />
        </el-form-item>
        <el-form-item label="初始参数">
          <el-input :model-value="selectedSession.prescription" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="startDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="startTreatment">确认上机</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="monitorDialogVisible" title="透中监测记录" width="640px">
      <el-form label-width="110px">
        <el-form-item label="记录时间">
          <el-date-picker type="datetime" placeholder="选择记录时间" />
        </el-form-item>
        <el-form-item label="生命体征">
          <el-input placeholder="血压、脉搏、体温" />
        </el-form-item>
        <el-form-item label="设备参数">
          <el-input placeholder="血流量、静脉压、跨膜压、超滤量" />
        </el-form-item>
        <el-form-item label="状态说明">
          <el-input type="textarea" :rows="3" placeholder="异常参数、处理措施、患者反应" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="monitorDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="selectedSession.monitorStatus = '按时记录'; monitorDialogVisible = false; submitAction('透中监测已记录')">保存监测</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="symptomDialogVisible" title="症状与并发症处理" width="640px">
      <el-form label-width="110px">
        <el-form-item label="症状类型">
          <el-select model-value="hypotension">
            <el-option label="低血压" value="hypotension" />
            <el-option label="肌痉挛" value="cramp" />
            <el-option label="通路压力异常" value="access-pressure" />
            <el-option label="过敏/发热" value="allergy" />
          </el-select>
        </el-form-item>
        <el-form-item label="严重程度">
          <el-radio-group model-value="middle">
            <el-radio-button label="low">低</el-radio-button>
            <el-radio-button label="middle">中</el-radio-button>
            <el-radio-button label="high">高</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理措施">
          <el-input type="textarea" :rows="3" placeholder="记录暂停超滤、补液、通知医生、调整处方或提前下机等措施" />
        </el-form-item>
        <el-form-item label="处理结果">
          <el-input placeholder="症状缓解、继续观察、提前下机、转医生处理等" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="symptomDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="selectedSession.symptom = '已处理'; symptomDialogVisible = false; submitAction('症状事件已写入治疗记录和预警追踪')">保存处理</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="stopDialogVisible" title="下机记录" width="560px">
      <el-form label-width="110px">
        <el-form-item label="下机时间">
          <el-date-picker type="datetime" placeholder="选择下机时间" />
        </el-form-item>
        <el-form-item label="实际超滤">
          <el-input placeholder="L" />
        </el-form-item>
        <el-form-item label="下机情况">
          <el-input type="textarea" :rows="3" placeholder="记录回血、止血、通路情况、患者离机状态" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="stopDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="stopTreatment">确认下机</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="postDialogVisible" title="透后评估" width="640px">
      <el-form label-width="110px">
        <el-form-item label="透后体重">
          <el-input placeholder="kg" />
        </el-form-item>
        <el-form-item label="透后血压">
          <el-input placeholder="例如 128/76 mmHg" />
        </el-form-item>
        <el-form-item label="通路止血">
          <el-radio-group model-value="normal">
            <el-radio-button label="normal">正常</el-radio-button>
            <el-radio-button label="bleed">渗血</el-radio-button>
            <el-radio-button label="review">需复查</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="离室状态">
          <el-input type="textarea" :rows="3" placeholder="记录症状、宣教、随访建议和是否可离室" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="postDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="completePost">完成透后评估</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="治疗过程时间轴" size="540px">
      <el-timeline>
        <el-timeline-item timestamp="08:05" type="primary">排班、处方、通路和医嘱执行计划已加载。</el-timeline-item>
        <el-timeline-item timestamp="08:20" type="success">透前评估：{{ selectedSession.preStatus }}。</el-timeline-item>
        <el-timeline-item timestamp="08:28" type="warning">上机核对：{{ selectedSession.machineCheck }}，设备：{{ selectedSession.device }}。</el-timeline-item>
        <el-timeline-item timestamp="治疗中">监测状态：{{ selectedSession.monitorStatus }}；症状：{{ selectedSession.symptom }}。</el-timeline-item>
        <el-timeline-item timestamp="后续">完整治疗过程进入 Task 14 小结、签名、审核和归档。</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
