<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  CircleCheck,
  Document,
  EditPen,
  FirstAidKit,
  Histogram,
  Search,
  Warning,
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{
  context: PageContext;
}>();

type ClinicalPatient = {
  id: string;
  name: string;
  sexAge: string;
  dialysisNo: string;
  schedule: string;
  bed: string;
  primaryDiagnosis: string;
  access: string;
  lastRecord: string;
  diagnosisStatus: string;
  assessmentStatus: string;
  consentStatus: string;
  labRisk: string;
  eventStatus: string;
  reportStatus: string;
  riskLevel: string;
  nextAction: string;
  doctor: string;
  nurse: string;
};

type LabRow = {
  item: string;
  value: string;
  ref: string;
  trend: string;
  status: string;
  time: string;
};

type TimelineRow = {
  time: string;
  title: string;
  content: string;
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
};

const sectionByMenu: Record<string, string> = {
  'doctor-home': 'patients',
  'doctor-my': 'patients',
  'doctor-record': 'record',
  'doctor-diagnosis': 'diagnosis',
  'doctor-common-assess': 'assessment',
  'doctor-special-assess': 'assessment',
  'doctor-lab': 'lab',
  'doctor-consent': 'consent',
  'doctor-report': 'report',
  'doctor-event': 'event',
};

const activeSection = ref(sectionByMenu[props.context.menuKey] ?? 'patients');
const recordDrawerVisible = ref(false);
const diagnosisDialogVisible = ref(false);
const assessmentDialogVisible = ref(false);
const consentDialogVisible = ref(false);
const eventDialogVisible = ref(false);
const reportDrawerVisible = ref(false);
const traceDrawerVisible = ref(false);
const selectedPatientId = ref('P202604001');

watch(
  () => props.context.menuKey,
  (menuKey) => {
    activeSection.value = sectionByMenu[menuKey] ?? 'patients';
  },
);

const patients = ref<ClinicalPatient[]>([
  {
    id: 'P202604001',
    name: '王建国',
    sexAge: '男 / 62岁',
    dialysisNo: 'HD-00038',
    schedule: '05-10 上午班',
    bed: 'A区 08床',
    primaryDiagnosis: '终末期肾病 / 糖尿病肾病',
    access: '左前臂自体内瘘',
    lastRecord: '05-09 已签名',
    diagnosisStatus: '有效',
    assessmentStatus: '已完成',
    consentStatus: '已签署',
    labRisk: '达标',
    eventStatus: '无待处理',
    reportStatus: '可生成',
    riskLevel: '低',
    nextAction: '可进入处方',
    doctor: '医生',
    nurse: '赵护士',
  },
  {
    id: 'P202604002',
    name: '李秀兰',
    sexAge: '女 / 71岁',
    dialysisNo: 'HD-00072',
    schedule: '05-10 上午班',
    bed: 'A区 12床',
    primaryDiagnosis: '慢性肾衰竭5期 / 高血压',
    access: '右颈内静脉长期导管',
    lastRecord: '05-08 草稿',
    diagnosisStatus: '有效',
    assessmentStatus: '待复评',
    consentStatus: '已签署',
    labRisk: '白蛋白偏低',
    eventStatus: '导管出口红肿',
    reportStatus: '待补充',
    riskLevel: '中',
    nextAction: '先完成专科评估',
    doctor: '医生',
    nurse: '钱护士',
  },
  {
    id: 'P202604003',
    name: '赵明',
    sexAge: '男 / 45岁',
    dialysisNo: 'HD-00116',
    schedule: '05-10 下午班',
    bed: 'B区 03床',
    primaryDiagnosis: 'IgA肾病尿毒症期',
    access: '右前臂自体内瘘',
    lastRecord: '05-06 已归档',
    diagnosisStatus: '需补充',
    assessmentStatus: '已完成',
    consentStatus: '待签署',
    labRisk: '钾偏高',
    eventStatus: '危急值待处理',
    reportStatus: '不可生成',
    riskLevel: '高',
    nextAction: '处理危急值并补同意书',
    doctor: '医生',
    nurse: '孙护士',
  },
  {
    id: 'P202604004',
    name: '陈志强',
    sexAge: '男 / 58岁',
    dialysisNo: 'HD-00128',
    schedule: '05-10 下午班',
    bed: 'B区 07床',
    primaryDiagnosis: '多囊肾 / 维持性血透',
    access: '左上臂人工血管',
    lastRecord: '05-10 已签名',
    diagnosisStatus: '有效',
    assessmentStatus: '已完成',
    consentStatus: '已签署',
    labRisk: '磷偏高',
    eventStatus: '通路狭窄复查',
    reportStatus: '可生成',
    riskLevel: '中',
    nextAction: '复核通路事件',
    doctor: '医生',
    nurse: '周护士',
  },
  {
    id: 'P202604005',
    name: '刘梅英',
    sexAge: '女 / 66岁',
    dialysisNo: 'HD-00151',
    schedule: '05-10 夜班',
    bed: 'C区 02床',
    primaryDiagnosis: '狼疮性肾炎尿毒症期',
    access: '股静脉临时导管',
    lastRecord: '05-09 已签名',
    diagnosisStatus: '有效',
    assessmentStatus: '待完成',
    consentStatus: '待续签',
    labRisk: '血红蛋白低',
    eventStatus: '贫血随访',
    reportStatus: '待补充',
    riskLevel: '高',
    nextAction: '补评估与同意书',
    doctor: '医生',
    nurse: '吴护士',
  },
  {
    id: 'P202604006',
    name: '孙海',
    sexAge: '男 / 53岁',
    dialysisNo: 'HD-00177',
    schedule: '05-11 上午班',
    bed: 'A区 05床',
    primaryDiagnosis: '糖尿病肾病 / 冠心病',
    access: '左前臂自体内瘘',
    lastRecord: '05-07 已签名',
    diagnosisStatus: '有效',
    assessmentStatus: '已完成',
    consentStatus: '已签署',
    labRisk: '达标',
    eventStatus: '无待处理',
    reportStatus: '可生成',
    riskLevel: '低',
    nextAction: '处方复用',
    doctor: '医生',
    nurse: '郑护士',
  },
  {
    id: 'P202604007',
    name: '马丽',
    sexAge: '女 / 39岁',
    dialysisNo: 'HD-00203',
    schedule: '05-11 上午班',
    bed: '隔离区 01床',
    primaryDiagnosis: '慢性肾衰竭5期 / 乙肝携带',
    access: '右前臂自体内瘘',
    lastRecord: '05-08 已归档',
    diagnosisStatus: '有效',
    assessmentStatus: '已完成',
    consentStatus: '已签署',
    labRisk: '感染标志阳性',
    eventStatus: '隔离透析',
    reportStatus: '可生成',
    riskLevel: '中',
    nextAction: '确认隔离排班',
    doctor: '医生',
    nurse: '冯护士',
  },
  {
    id: 'P202604008',
    name: '周庆',
    sexAge: '男 / 74岁',
    dialysisNo: 'HD-00218',
    schedule: '05-11 下午班',
    bed: 'A区 16床',
    primaryDiagnosis: '高血压肾损害 / 心衰',
    access: '右颈内静脉长期导管',
    lastRecord: '05-09 已签名',
    diagnosisStatus: '有效',
    assessmentStatus: '待心功能评估',
    consentStatus: '已签署',
    labRisk: 'BNP高',
    eventStatus: '低血压事件',
    reportStatus: '待补充',
    riskLevel: '高',
    nextAction: '补心功能评估',
    doctor: '医生',
    nurse: '蒋护士',
  },
  {
    id: 'P202604009',
    name: '何雪',
    sexAge: '女 / 50岁',
    dialysisNo: 'HD-00246',
    schedule: '05-11 下午班',
    bed: 'B区 11床',
    primaryDiagnosis: '肾小球肾炎尿毒症期',
    access: '左前臂自体内瘘',
    lastRecord: '05-05 已归档',
    diagnosisStatus: '有效',
    assessmentStatus: '已完成',
    consentStatus: '已签署',
    labRisk: '钙磷乘积高',
    eventStatus: '用药调整',
    reportStatus: '可生成',
    riskLevel: '中',
    nextAction: '复查检验',
    doctor: '医生',
    nurse: '谢护士',
  },
  {
    id: 'P202604010',
    name: '郭强',
    sexAge: '男 / 61岁',
    dialysisNo: 'HD-00277',
    schedule: '05-11 夜班',
    bed: 'C区 06床',
    primaryDiagnosis: '梗阻性肾病 / 维持性血透',
    access: '左上臂人工血管',
    lastRecord: '05-04 草稿',
    diagnosisStatus: '需复核',
    assessmentStatus: '待完成',
    consentStatus: '已签署',
    labRisk: '尿素清除不足',
    eventStatus: 'Kt/V低',
    reportStatus: '不可生成',
    riskLevel: '高',
    nextAction: '补病程和疗效评估',
    doctor: '医生',
    nurse: '陆护士',
  },
  {
    id: 'P202604011',
    name: '曹敏',
    sexAge: '女 / 57岁',
    dialysisNo: 'HD-00291',
    schedule: '05-12 上午班',
    bed: 'A区 10床',
    primaryDiagnosis: '糖尿病肾病 / 继发甲旁亢',
    access: '右前臂自体内瘘',
    lastRecord: '05-09 已签名',
    diagnosisStatus: '有效',
    assessmentStatus: '已完成',
    consentStatus: '已签署',
    labRisk: 'PTH高',
    eventStatus: '用药随访',
    reportStatus: '可生成',
    riskLevel: '中',
    nextAction: '调整用药建议',
    doctor: '医生',
    nurse: '高护士',
  },
  {
    id: 'P202604012',
    name: '潘德胜',
    sexAge: '男 / 68岁',
    dialysisNo: 'HD-00305',
    schedule: '05-12 下午班',
    bed: 'B区 15床',
    primaryDiagnosis: '慢性肾衰竭5期 / 脑梗后',
    access: '右颈内静脉长期导管',
    lastRecord: '05-08 已签名',
    diagnosisStatus: '有效',
    assessmentStatus: '已完成',
    consentStatus: '待家属确认',
    labRisk: '达标',
    eventStatus: '跌倒风险',
    reportStatus: '待补充',
    riskLevel: '中',
    nextAction: '补家属签署',
    doctor: '医生',
    nurse: '唐护士',
  },
]);

const labRows: LabRow[] = [
  { item: '血钾 K+', value: '5.9 mmol/L', ref: '3.5-5.5', trend: '上升', status: '危急关注', time: '2026-05-10 07:42' },
  { item: '血红蛋白 Hb', value: '89 g/L', ref: '100-120', trend: '下降', status: '异常', time: '2026-05-08 09:30' },
  { item: '白蛋白 Alb', value: '34 g/L', ref: '35-50', trend: '平稳', status: '偏低', time: '2026-05-08 09:30' },
  { item: '血磷 P', value: '2.05 mmol/L', ref: '0.81-1.45', trend: '上升', status: '异常', time: '2026-05-08 09:30' },
  { item: 'Kt/V', value: '1.18', ref: '>=1.20', trend: '下降', status: '未达标', time: '2026-05-03 11:20' },
];

const diagnosisRows = [
  { name: '终末期肾病', stage: '主诊断', since: '2024-06-18', active: '有效', source: '门诊诊断' },
  { name: '糖尿病肾病', stage: '原发病', since: '2024-06-18', active: '有效', source: '肾内科病历' },
  { name: '肾性贫血', stage: '并发症', since: '2025-02-11', active: '有效', source: '检验评估' },
  { name: '继发性甲状旁腺功能亢进', stage: '并发症', since: '2025-09-02', active: '观察', source: '专科评估' },
];

const assessmentRows = [
  { type: '透析充分性评估', conclusion: 'Kt/V达标边缘，建议结合体重增长调整处方', risk: '中', owner: '医生', time: '2026-05-08' },
  { type: '营养评估', conclusion: '白蛋白偏低，建议营养宣教并复查', risk: '中', owner: '营养护士', time: '2026-05-08' },
  { type: '血管通路评估', conclusion: '震颤良好，无明显感染征象', risk: '低', owner: '医生', time: '2026-05-09' },
  { type: '心血管风险评估', conclusion: '透中低血压风险，建议控制超滤量', risk: '高', owner: '医生', time: '2026-05-10' },
];

const timelineRows: TimelineRow[] = [
  { time: '2026-05-10 08:10', title: '打开医生站患者诊疗', content: '加载责任患者、排班、通路、检验、同意书和临床事件。', type: 'primary' },
  { time: '2026-05-10 08:16', title: '病程记录暂存', content: '记录透析间期体重增长、症状和处方调整依据。', type: 'info' },
  { time: '2026-05-10 08:22', title: '危急值确认', content: '血钾升高已生成临床事件，要求处方前处理。', type: 'warning' },
  { time: '2026-05-10 08:30', title: '处方准入检查', content: '诊断有效、评估完整、同意书有效时允许进入医嘱处方。', type: 'success' },
];

const selectedPatient = computed(() => patients.value.find((item) => item.id === selectedPatientId.value) ?? patients.value[0]);

const metrics = computed(() => {
  const high = patients.value.filter((item) => item.riskLevel === '高').length;
  const missingAssessment = patients.value.filter((item) => item.assessmentStatus.includes('待')).length;
  const missingConsent = patients.value.filter((item) => item.consentStatus.includes('待')).length;
  const ready = patients.value.filter((item) => item.nextAction.includes('处方') || item.nextAction.includes('复用')).length;
  return [
    { label: '责任患者', value: patients.value.length, tone: 'blue' },
    { label: '高风险待处理', value: high, tone: 'red' },
    { label: '评估待完成', value: missingAssessment, tone: 'orange' },
    { label: '可进入处方', value: ready, tone: 'green' },
    { label: '同意书待补', value: missingConsent, tone: 'orange' },
  ];
});

const prescriptionGate = computed(() => [
  { label: '诊断', value: selectedPatient.value.diagnosisStatus, pass: selectedPatient.value.diagnosisStatus === '有效' },
  { label: '病情评估', value: selectedPatient.value.assessmentStatus, pass: selectedPatient.value.assessmentStatus === '已完成' },
  { label: '知情同意', value: selectedPatient.value.consentStatus, pass: selectedPatient.value.consentStatus === '已签署' },
  { label: '检验风险', value: selectedPatient.value.labRisk, pass: ['达标', '磷偏高', '白蛋白偏低'].includes(selectedPatient.value.labRisk) },
  { label: '临床事件', value: selectedPatient.value.eventStatus, pass: !selectedPatient.value.eventStatus.includes('待处理') },
]);

const canOpenPrescription = computed(() => prescriptionGate.value.every((item) => item.pass));

const activeTables = ['medical_record', 'patient_diagnosis', 'clinical_assessment', 'clinical_event', 'patient_consent', 'health_report'];

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (['有效', '已完成', '已签署', '达标', '无待处理', '可生成', '低'].includes(value)) return 'success';
  if (['高', '危急关注', '不可生成'].includes(value) || value.includes('待处理')) return 'danger';
  if (value.includes('待') || value.includes('偏') || value.includes('复核') || value.includes('异常') || value === '中') return 'warning';
  return 'info';
}

function selectPatient(row: ClinicalPatient): void {
  selectedPatientId.value = row.id;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}

function completeAssessment(): void {
  selectedPatient.value.assessmentStatus = '已完成';
  selectedPatient.value.riskLevel = selectedPatient.value.riskLevel === '高' ? '中' : selectedPatient.value.riskLevel;
  assessmentDialogVisible.value = false;
  submitAction('评估已保存，处方准入状态已重新计算');
}

function signConsent(): void {
  selectedPatient.value.consentStatus = '已签署';
  consentDialogVisible.value = false;
  submitAction('知情同意书已签署并写入患者档案');
}

function closeEvent(): void {
  selectedPatient.value.eventStatus = '已处理';
  eventDialogVisible.value = false;
  submitAction('临床事件已处理，预警状态同步关闭');
}
</script>

<template>
  <section class="doctor-clinical-page">
    <el-card class="clinical-work-card" shadow="never">
      <template #header>
        <div class="clinical-header">
          <div>
            <h2>医生诊疗工作台</h2>
            <p>围绕责任患者完成病历、诊断、评估、检验、同意书、临床事件与健康报告，输出可进入医嘱处方的临床依据。</p>
          </div>
          <div class="clinical-actions">
            <el-button type="primary" :icon="EditPen" @click="recordDrawerVisible = true">新建病程</el-button>
            <el-button :icon="FirstAidKit" @click="diagnosisDialogVisible = true">维护诊断</el-button>
            <el-button :icon="CircleCheck" @click="assessmentDialogVisible = true">完成评估</el-button>
            <el-button :icon="Document" @click="consentDialogVisible = true">知情同意</el-button>
            <el-button :icon="Warning" @click="eventDialogVisible = true">登记事件</el-button>
          </div>
        </div>
      </template>

      <el-form class="clinical-filter" inline>
        <el-form-item label="患者">
          <el-input placeholder="姓名、透析号、床位" clearable />
        </el-form-item>
        <el-form-item label="治疗日期">
          <el-date-picker type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="责任范围">
          <el-select model-value="mine">
            <el-option label="我的患者" value="mine" />
            <el-option label="本组患者" value="team" />
            <el-option label="今日全部" value="today" />
          </el-select>
        </el-form-item>
        <el-form-item label="风险">
          <el-select placeholder="全部风险" clearable>
            <el-option label="高" value="high" />
            <el-option label="中" value="middle" />
            <el-option label="低" value="low" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>

      <div class="clinical-stat-grid">
        <el-card v-for="item in metrics" :key="item.label" :class="['clinical-stat-card', item.tone]" shadow="never">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </el-card>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :xl="14">
          <el-card class="clinical-main-card" shadow="never">
            <template #header>
              <div class="clinical-card-header">
                <div>
                  <strong>我的病人</strong>
                  <p>示例数据不少于 10 条，覆盖诊断、评估、同意书、检验风险和事件状态。</p>
                </div>
                <el-tag type="primary" effect="plain">{{ context.role }} / {{ context.department }}</el-tag>
              </div>
            </template>
            <el-table
              :data="patients"
              border
              stripe
              highlight-current-row
              row-key="id"
              @row-click="selectPatient"
            >
              <el-table-column prop="name" label="患者" width="95" fixed="left" />
              <el-table-column prop="sexAge" label="性别年龄" width="100" />
              <el-table-column prop="dialysisNo" label="透析号" width="115" />
              <el-table-column prop="schedule" label="排班" min-width="120" />
              <el-table-column prop="bed" label="机位" width="105" />
              <el-table-column prop="primaryDiagnosis" label="主要诊断" min-width="190" />
              <el-table-column prop="access" label="当前通路" min-width="150" />
              <el-table-column prop="diagnosisStatus" label="诊断" width="90">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.diagnosisStatus)">{{ row.diagnosisStatus }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="assessmentStatus" label="评估" width="110">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.assessmentStatus)" effect="plain">{{ row.assessmentStatus }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="consentStatus" label="同意书" width="110">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.consentStatus)" effect="plain">{{ row.consentStatus }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="labRisk" label="检验风险" min-width="120">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.labRisk)" effect="plain">{{ row.labRisk }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="riskLevel" label="风险" width="80">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.riskLevel)">{{ row.riskLevel }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="nextAction" label="下一步" min-width="150" />
              <el-table-column label="操作" width="230" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click.stop="selectPatient(row); recordDrawerVisible = true">病程</el-button>
                  <el-button link @click.stop="selectPatient(row); assessmentDialogVisible = true">评估</el-button>
                  <el-button link @click.stop="selectPatient(row); reportDrawerVisible = true">报告</el-button>
                  <el-button link @click.stop="selectPatient(row); traceDrawerVisible = true">追溯</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>

        <el-col :xs="24" :xl="10">
          <el-card class="clinical-side-card" shadow="never">
            <template #header>
              <div class="clinical-card-header">
                <strong>当前患者诊疗上下文</strong>
                <el-tag :type="tagType(selectedPatient.riskLevel)">{{ selectedPatient.riskLevel }}风险</el-tag>
              </div>
            </template>
            <el-descriptions :column="2" border size="small">
              <el-descriptions-item label="患者">{{ selectedPatient.name }} / {{ selectedPatient.sexAge }}</el-descriptions-item>
              <el-descriptions-item label="透析号">{{ selectedPatient.dialysisNo }}</el-descriptions-item>
              <el-descriptions-item label="排班">{{ selectedPatient.schedule }}</el-descriptions-item>
              <el-descriptions-item label="机位">{{ selectedPatient.bed }}</el-descriptions-item>
              <el-descriptions-item label="通路">{{ selectedPatient.access }}</el-descriptions-item>
              <el-descriptions-item label="责任护士">{{ selectedPatient.nurse }}</el-descriptions-item>
            </el-descriptions>

            <div class="prescription-gate">
              <div class="gate-title">
                <strong>处方准入检查</strong>
                <el-tag :type="canOpenPrescription ? 'success' : 'danger'">
                  {{ canOpenPrescription ? '允许进入医嘱处方' : '需补齐后再处方' }}
                </el-tag>
              </div>
              <div v-for="item in prescriptionGate" :key="item.label" class="gate-row">
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
                <el-icon :class="{ pass: item.pass, block: !item.pass }">
                  <CircleCheck v-if="item.pass" />
                  <Warning v-else />
                </el-icon>
              </div>
            </div>

            <div class="clinical-quick-actions">
              <el-button type="primary" :disabled="!canOpenPrescription" @click="submitAction('已进入医嘱与透析处方页面的前置检查结果')">
                进入医嘱处方
              </el-button>
              <el-button @click="traceDrawerVisible = true">查看时间轴</el-button>
              <el-button @click="eventDialogVisible = true">处理风险</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="clinical-workspace-card" shadow="never">
      <template #header>
        <div class="clinical-card-header">
          <div>
            <strong>诊疗工作区</strong>
            <p>左侧菜单路由打开时会自动定位对应功能，主要业务仍在当前页面直接操作。</p>
          </div>
          <el-tag effect="plain">{{ context.menuTitle }}</el-tag>
        </div>
      </template>
      <el-tabs v-model="activeSection" class="clinical-tabs">
        <el-tab-pane label="病历病程" name="record">
          <div class="clinical-panel-grid">
            <el-card shadow="never" class="clinical-panel">
              <strong>最近病程</strong>
              <p>透析间期体重增长 2.1kg，无发热胸闷。血压波动可控，建议本次关注血钾和超滤量。</p>
              <p>上次病程：{{ selectedPatient.lastRecord }}；记录类型：维持性血透随访病程。</p>
              <el-button type="primary" @click="recordDrawerVisible = true">编辑病程</el-button>
            </el-card>
            <el-card shadow="never" class="clinical-panel">
              <strong>病历质控</strong>
              <p>病程记录需包含症状、体征、检验检查、通路状态、处方调整依据和医师签名。</p>
              <el-alert type="warning" show-icon :closable="false" title="草稿病历不会进入处方依据，需签名后生效。" />
            </el-card>
          </div>
        </el-tab-pane>
        <el-tab-pane label="疾病诊断" name="diagnosis">
          <el-table :data="diagnosisRows" border stripe>
            <el-table-column prop="name" label="诊断名称" min-width="180" />
            <el-table-column prop="stage" label="诊断类型" width="110" />
            <el-table-column prop="since" label="开始日期" width="120" />
            <el-table-column prop="active" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="tagType(row.active)">{{ row.active }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="source" label="来源" min-width="140" />
            <el-table-column label="操作" width="160" fixed="right">
              <template #default>
                <el-button link type="primary" @click="diagnosisDialogVisible = true">编辑</el-button>
                <el-button link>停用</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="病情评估" name="assessment">
          <el-table :data="assessmentRows" border stripe>
            <el-table-column prop="type" label="评估类型" min-width="160" />
            <el-table-column prop="conclusion" label="结论" min-width="260" />
            <el-table-column prop="risk" label="风险" width="90">
              <template #default="{ row }">
                <el-tag :type="tagType(row.risk)">{{ row.risk }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="owner" label="责任人" width="100" />
            <el-table-column prop="time" label="时间" width="120" />
            <el-table-column label="操作" width="140">
              <template #default>
                <el-button link type="primary" @click="assessmentDialogVisible = true">复评</el-button>
                <el-button link>引用</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="检验检查" name="lab">
          <el-table :data="labRows" border stripe>
            <el-table-column prop="item" label="项目" min-width="140" />
            <el-table-column prop="value" label="结果" width="120" />
            <el-table-column prop="ref" label="参考范围" width="120" />
            <el-table-column prop="trend" label="趋势" width="90" />
            <el-table-column prop="status" label="判定" width="110">
              <template #default="{ row }">
                <el-tag :type="tagType(row.status)">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="time" label="报告时间" min-width="160" />
            <el-table-column label="操作" width="150">
              <template #default>
                <el-button link type="primary">看趋势</el-button>
                <el-button link @click="eventDialogVisible = true">转事件</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="知情同意" name="consent">
          <div class="consent-grid">
            <el-card shadow="never" class="consent-card">
              <strong>血液透析治疗知情同意书</strong>
              <el-tag :type="tagType(selectedPatient.consentStatus)">{{ selectedPatient.consentStatus }}</el-tag>
              <p>签署人：患者或授权家属；有效期：12个月；变更治疗方式或风险变化时需重新确认。</p>
              <el-button type="primary" @click="consentDialogVisible = true">签署/续签</el-button>
            </el-card>
            <el-card shadow="never" class="consent-card">
              <strong>血管通路相关告知</strong>
              <el-tag type="success">已签署</el-tag>
              <p>覆盖内瘘穿刺、导管连接、感染风险和异常处理。</p>
              <el-button>查看附件</el-button>
            </el-card>
            <el-card shadow="never" class="consent-card">
              <strong>特殊治疗告知</strong>
              <el-tag type="warning">按需签署</el-tag>
              <p>血液灌流、CRRT、隔离透析或研究协同时需要单独签署。</p>
              <el-button>新增告知</el-button>
            </el-card>
          </div>
        </el-tab-pane>
        <el-tab-pane label="临床事件" name="event">
          <div class="clinical-event-board">
            <el-alert type="warning" show-icon :closable="false" title="危急值、并发症、通路异常、院感风险和跌倒风险必须形成事件并跟踪关闭。" />
            <el-button type="primary" :icon="Warning" @click="eventDialogVisible = true">登记临床事件</el-button>
          </div>
          <el-timeline class="clinical-event-timeline">
            <el-timeline-item v-for="item in timelineRows" :key="item.time" :timestamp="item.time" :type="item.type">
              <strong>{{ item.title }}</strong>
              <p>{{ item.content }}</p>
            </el-timeline-item>
          </el-timeline>
        </el-tab-pane>
        <el-tab-pane label="健康报告" name="report">
          <div class="report-preview">
            <div>
              <strong>{{ selectedPatient.name }} 月度健康报告</strong>
              <p>报告汇总透析充分性、检验趋势、血管通路、并发症、营养状态和下月随访建议。</p>
            </div>
            <div class="report-score">
              <span>综合风险</span>
              <strong>{{ selectedPatient.riskLevel }}</strong>
            </div>
            <el-button type="primary" :icon="Histogram" @click="reportDrawerVisible = true">生成报告</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-drawer v-model="recordDrawerVisible" title="病历病程记录" size="620px">
      <el-form label-width="110px">
        <el-form-item label="患者">
          <el-input :model-value="`${selectedPatient.name} / ${selectedPatient.dialysisNo}`" />
        </el-form-item>
        <el-form-item label="记录类型">
          <el-select model-value="dialysis-progress">
            <el-option label="血透随访病程" value="dialysis-progress" />
            <el-option label="透析方案调整记录" value="prescription-adjust" />
            <el-option label="危急值处理记录" value="critical-value" />
            <el-option label="会诊/转诊记录" value="consult" />
          </el-select>
        </el-form-item>
        <el-form-item label="病程内容">
          <el-input type="textarea" :rows="7" placeholder="记录主诉、透析间期情况、体征、通路、检验结果、处理意见和处方依据" />
        </el-form-item>
        <el-form-item label="签名状态">
          <el-radio-group model-value="signed">
            <el-radio-button label="draft">暂存</el-radio-button>
            <el-radio-button label="signed">签名完成</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="drawer-actions">
        <el-button @click="recordDrawerVisible = false">取消</el-button>
        <el-button @click="submitAction('病程已暂存，可继续编辑')">暂存</el-button>
        <el-button type="primary" @click="submitAction('病程已签名，允许作为处方依据')">签名提交</el-button>
      </div>
    </el-drawer>

    <el-dialog v-model="diagnosisDialogVisible" title="疾病诊断维护" width="640px">
      <el-form label-width="110px">
        <el-form-item label="患者">
          <el-input :model-value="selectedPatient.name" />
        </el-form-item>
        <el-form-item label="诊断名称">
          <el-select model-value="esrd" filterable>
            <el-option label="终末期肾病" value="esrd" />
            <el-option label="糖尿病肾病" value="dn" />
            <el-option label="肾性贫血" value="anemia" />
            <el-option label="继发性甲旁亢" value="shpt" />
          </el-select>
        </el-form-item>
        <el-form-item label="诊断类型">
          <el-radio-group model-value="main">
            <el-radio-button label="main">主诊断</el-radio-button>
            <el-radio-button label="origin">原发病</el-radio-button>
            <el-radio-button label="complication">并发症</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="依据">
          <el-input type="textarea" :rows="3" placeholder="引用病历、检验检查、外院资料或专科评估结论" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="diagnosisDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="selectedPatient.diagnosisStatus = '有效'; diagnosisDialogVisible = false; submitAction('诊断已维护并进入处方准入检查')">保存诊断</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="assessmentDialogVisible" title="病情评估" width="680px">
      <el-form label-width="120px">
        <el-form-item label="评估类型">
          <el-select model-value="dialysis-adequacy">
            <el-option label="透析充分性评估" value="dialysis-adequacy" />
            <el-option label="营养评估" value="nutrition" />
            <el-option label="心血管风险评估" value="cardio" />
            <el-option label="血管通路评估" value="access" />
            <el-option label="感染风险评估" value="infection" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键观察">
          <el-input type="textarea" :rows="4" placeholder="记录血压、体重增长、症状、检验趋势、通路情况、并发症和处理建议" />
        </el-form-item>
        <el-form-item label="风险等级">
          <el-radio-group model-value="middle">
            <el-radio-button label="low">低</el-radio-button>
            <el-radio-button label="middle">中</el-radio-button>
            <el-radio-button label="high">高</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="结论">
          <el-input placeholder="例如：本次可透析，需限制超滤量并关注血钾" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="assessmentDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="completeAssessment">提交评估</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="consentDialogVisible" title="知情同意书签署" width="640px">
      <el-alert type="warning" show-icon :closable="false" title="同意书仅展示签署状态和附件入口；真实系统需对签署人身份、授权关系、签名时间和版本留痕。" />
      <el-form class="dialog-form" label-width="120px">
        <el-form-item label="同意书类型">
          <el-select model-value="dialysis">
            <el-option label="血液透析治疗知情同意书" value="dialysis" />
            <el-option label="血液灌流知情同意书" value="hp" />
            <el-option label="中心静脉导管置入知情同意书" value="catheter" />
            <el-option label="隔离透析告知书" value="isolation" />
          </el-select>
        </el-form-item>
        <el-form-item label="签署人">
          <el-input placeholder="患者本人或授权家属" />
        </el-form-item>
        <el-form-item label="有效期">
          <el-date-picker type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item label="附件">
          <el-button>上传扫描件</el-button>
          <el-button>调用电子签名</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="consentDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="signConsent">确认签署</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="eventDialogVisible" title="临床事件处理" width="660px">
      <el-form label-width="120px">
        <el-form-item label="事件类型">
          <el-select model-value="critical">
            <el-option label="危急值" value="critical" />
            <el-option label="透中并发症" value="complication" />
            <el-option label="通路异常" value="access" />
            <el-option label="感染风险" value="infection" />
            <el-option label="跌倒/压疮风险" value="nursing-risk" />
          </el-select>
        </el-form-item>
        <el-form-item label="严重程度">
          <el-radio-group model-value="high">
            <el-radio-button label="low">低</el-radio-button>
            <el-radio-button label="middle">中</el-radio-button>
            <el-radio-button label="high">高</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理记录">
          <el-input type="textarea" :rows="4" placeholder="记录通知时间、处理措施、复核结果、是否影响本次透析和后续随访" />
        </el-form-item>
        <el-form-item label="关闭状态">
          <el-switch active-text="已处理并关闭" inactive-text="继续跟踪" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="eventDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="closeEvent">保存处理</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="reportDrawerVisible" title="健康报告生成" size="560px">
      <div class="report-drawer">
        <strong>{{ selectedPatient.name }} 健康报告</strong>
        <p>报告周期：2026-04-10 至 2026-05-10</p>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="透析充分性">Kt/V 达标边缘，建议结合处方调整复查。</el-descriptions-item>
          <el-descriptions-item label="营养状态">白蛋白和血红蛋白需持续关注。</el-descriptions-item>
          <el-descriptions-item label="通路状态">{{ selectedPatient.access }}，当前事件：{{ selectedPatient.eventStatus }}</el-descriptions-item>
          <el-descriptions-item label="下月建议">复查血钾、磷、PTH，完善随访宣教。</el-descriptions-item>
        </el-descriptions>
        <div class="drawer-actions">
          <el-button @click="reportDrawerVisible = false">关闭</el-button>
          <el-button type="primary" @click="selectedPatient.reportStatus = '已归档'; submitAction('健康报告已生成并归档')">生成并归档</el-button>
        </div>
      </div>
    </el-drawer>

    <el-drawer v-model="traceDrawerVisible" title="诊疗时间轴" size="540px">
      <el-timeline>
        <el-timeline-item v-for="item in timelineRows" :key="item.time" :timestamp="item.time" :type="item.type">
          <strong>{{ item.title }}</strong>
          <p>{{ item.content }}</p>
        </el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
