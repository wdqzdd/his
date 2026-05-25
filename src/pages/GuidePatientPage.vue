<script setup lang="ts">
import { computed, ref } from 'vue';
import { Check, CircleCheck, DocumentAdd, Download, EditPen, Files, Message, Printer, Search, Upload, User, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{
  context: PageContext;
}>();

type PatientRecord = {
  no: string;
  name: string;
  sexAge: string;
  gender: string;
  age: string;
  idCard: string;
  phone: string;
  insurance: string;
  outpatientNo: string;
  followNo: string;
  customerType: string;
  followName: string;
  ckdStage: string;
  treatmentStatus: string;
  firstDialysis: string;
  hospitalDept: string;
  bodyHeight: string;
  education: string;
  profession: string;
  marriage: string;
  allergy: string;
  drugAllergy: string;
  remark: string;
  status: string;
  owner: string;
  updatedAt: string;
  nextAction: string;
};

type SupplementRecord = {
  category: string;
  content: string;
  status: string;
  owner: string;
  updatedAt: string;
  nextAction: string;
};

type ContactRecord = {
  name: string;
  relationship: string;
  fixedPhone: string;
  mobile: string;
  authorization: string;
  remark: string;
  status: string;
};

type AddressRecord = {
  region: string;
  detail: string;
  resident: string;
  usage: string;
  verifiedAt: string;
  status: string;
};

type HistoryFlag = {
  label: string;
  value: string;
  status: string;
  owner: string;
  updatedAt: string;
};

type ReplacementHistory = {
  mode: string;
  startedAt: string;
  hospital: string;
  access: string;
  frequency: string;
  status: string;
  nextAction: string;
};

type AttachmentRecord = {
  name: string;
  type: string;
  source: string;
  uploadedAt: string;
  status: string;
};

type TimelineStep = {
  time: string;
  title: string;
  desc: string;
  status: 'success' | 'warning' | 'info';
};

type DetailTab = {
  label: string;
  name: string;
  summary: string;
  input: string;
  output: string;
  next: string;
};

type PatientTabRow = {
  category: string;
  item: string;
  currentObject: string;
  status: string;
  owner: string;
  time: string;
  nextAction: string;
};

type ChangeRecordRow = {
  id: string;
  changeDate: string;
  eventType: string;
  originalStatus: string;
  changeStatus: string;
  changeReason: string;
  remark: string;
  createdAt: string;
  owner: string;
  status: string;
  nextAction: string;
};

type ChangeRecordFormState = {
  changeDate: string;
  eventType: string;
  originalStatus: string;
  changeStatus: string;
  changeReason: string;
  remark: string;
  nextChangeDate: string;
  owner: string;
  status: string;
};

type ChangeFilterState = {
  eventType: string;
  originalStatus: string;
  changeStatus: string;
  keyword: string;
};

type DryWeightTrendPoint = {
  date: string;
  time: string;
  value: number;
  source: string;
  note: string;
};

type DryWeightFormState = {
  evaluationDate: string;
  currentDryWeight: string;
  measuredWeight: string;
  preWeight: string;
  postWeight: string;
  ultrafiltration: string;
  preBp: string;
  postBp: string;
  symptom: string;
  volumeJudgement: string;
  adjustmentPlan: string;
  reviewDate: string;
  reviewer: string;
  remark: string;
};

type AdequacyRecord = {
  id: string;
  dialysisDate: string;
  ktv: string;
  urr: string;
  preBeta2: string;
  postBeta2: string;
  beta2Clearance: string;
  preUrea: string;
  postUrea: string;
  preCreatinine: string;
  postCreatinine: string;
  durationHour: string;
  durationMinute: string;
  preWeight: string;
  postWeight: string;
  ultrafiltration: string;
  status: string;
  owner: string;
  nextAction: string;
};

type AdequacyFormState = Omit<AdequacyRecord, 'id' | 'status' | 'owner' | 'nextAction'>;

type AccessReminderRow = {
  nodeName: string;
  remindTime: string;
  handled: string;
  handler: string;
  handledTime: string;
};

type AccessFormState = {
  surgeryName: string;
  surgeryDate: string;
  firstUseDate: string;
  side: '左' | '右' | '';
  accessType: string;
  status: '正常' | '未成熟' | '修复中' | '失去功能' | '';
  nonHospitalSurgery: boolean;
  registerSurgeryInfo: boolean;
  remark: string;
  puncturePlan: string;
  puncturePlanNote: string;
};

type AccessRecord = AccessFormState & {
  id: string;
  accessTitle: string;
  accessSummary: string;
  owner: string;
  updatedAt: string;
  nextAction: string;
  reminderCount: string;
  riskLevel: string;
  firstUseGap: string;
  surgeryGap: string;
  useDuration: string;
  createdTime: string;
  reminders: AccessReminderRow[];
};

type AccessSubTab = 'access' | 'repair' | 'complication' | 'follow';

type AccessTableRow = AccessRecord & {
  rowNo: string;
};

type RepairRecord = {
  id: string;
  surgeryName: string;
  accessName: string;
  problem: string;
  repairDate: string;
  surgeon: string;
  bUltrasoundDoctor: string;
  assistantDoctor: string;
  nurse: string;
  currentAvailable: boolean;
  availableDate: string;
  nonHospitalRepair: boolean;
  remark: string;
  createdAt: string;
  owner: string;
};

type RepairFormState = {
  surgeryName: string;
  accessName: string;
  problem: string;
  repairDate: string;
  surgeon: string;
  bUltrasoundDoctor: string;
  assistantDoctor: string;
  nurse: string;
  currentAvailable: boolean;
  availableDate: string;
  nonHospitalRepair: boolean;
  remark: string;
};

type IdentityBindingKind = 'card' | 'barcode' | 'face';

type IdentityBindingItem = {
  id: string;
  kind: IdentityBindingKind;
  title: string;
  value: string;
  useStatus: string;
  owner: string;
  createdAt: string;
  remark: string;
  nextAction: string;
  previewText?: string;
  source?: string;
  faces?: string[];
};

type IdentityBindingFormState = {
  cardNo: string;
  cardType: string;
  patientName: string;
  useStatus: string;
  createdAt: string;
  remark: string;
  barcodeContent: string;
  barcodeText: string;
  barcodeSpec: string;
  faceSource: string;
  faceExpire: string;
  faceDevice: string;
  faceStatus: string;
  faceRemark: string;
};

type OrderTabRow = {
  selected: boolean;
  orderSource: string;
  textMode: boolean;
  selfPay: boolean;
  category: string;
  itemName: string;
  dosage: string;
  dosageUnit: string;
  quantity: string;
  quantityUnit: string;
  usage: string;
  orderContent: string;
  drip: string;
  frequency: string;
  executePlan: string;
  status: string;
};

type DialysisPlanField = {
  label: string;
  value?: string;
  placeholder?: string;
  unit?: string;
  extraValue?: string;
  extraPlaceholder?: string;
  extraUnit?: string;
  type?: 'input' | 'select' | 'textarea' | 'checkbox' | 'date' | 'number';
  required?: boolean;
  span?: 'wide' | 'double';
  half?: boolean;
  addable?: boolean;
  options?: string[];
};

type DialysisPlanSection = {
  title: string;
  note?: string;
  checkLabel?: string;
  checked?: boolean;
  actionLabel?: string;
  columns?: 1 | 2 | 3;
  fields: DialysisPlanField[];
};

type DiagnosisRow = {
  id?: string;
  disease: string;
  doctor: string;
  confirmTime: string;
  closed: boolean;
  closeDoctor: string;
  closeTime: string;
  closeReason: string;
  remark: string;
  status: string;
};

type TempDialysisPlan = {
  id: string;
  name: string;
  startedAt: string;
  remaining: string;
  status: string;
  owner: string;
};

type DialysisRecordRow = {
  patient: string;
  dialysisDate: string;
  shift: string;
  source: string;
  bedNo: string;
  device: string;
  mode: string;
  duration: string;
  dialyzer: string;
  perfusion: string;
  access: string;
  anticoagulant: string;
  status: string;
};

type AnticoagulationRecord = {
  id: string;
  dialysisDate: string;
  shift: string;
  bedNo: string;
  anticoagulantName: string;
  firstDose: string;
  additionalDose: string;
  additionalTime: string;
  totalDose: string;
  adjustmentReason: string;
  adjuster: string;
  executionStatus: string;
  clottingLevel: string;
  bleedingRisk: string;
  linkedOrder: string;
  batchNo: string;
  nextSuggestion: string;
};

type AnticoagulationFormState = Omit<AnticoagulationRecord, 'id'>;

type VisitKind = 'outpatient' | 'inpatient';

type VisitRecordRow = {
  visitDate: string;
  visitNo: string;
  hisBedNo: string;
  hisRecordNo: string;
  department: string;
  source: string;
  createdAt: string;
  status: string;
};

type AnalysisMetricKey = 'weight' | 'idwg' | 'bp' | 'heart-rate' | 'blood-flow';

type AnalysisColumn = {
  prop: string;
  label: string;
  minWidth?: number;
  width?: number;
};

type AnalysisRow = {
  id: string;
  date: string;
  [key: string]: string;
};

type AnalysisMetricSpec = {
  label: string;
  columns: AnalysisColumn[];
  rows: AnalysisRow[];
};

type LabIndicatorRow = {
  name: string;
  result: string;
  normal: string;
  reference: string;
  trend: string;
  status: string;
};

type CombinedTreatmentRow = {
  id: string;
  treatmentDate: string;
  modes: string[];
  remark: string;
  status: string;
  owner: string;
  time: string;
  nextAction: string;
  linkedSource: string;
};

type CombinedTreatmentFormState = {
  treatmentDate: string;
  modes: string[];
  remark: string;
};

type LabReportRecord = {
  id: string;
  date: string;
  source: 'original' | 'system';
  title: string;
  examItem: string;
  specimen: string;
  applyDate: string;
  reportDate: string;
  lisCode: string;
  status: string;
  owner: string;
  note: string;
  indicators: LabIndicatorRow[];
};

type InventoryKind = 'drug' | 'material';

type InventoryRow = {
  id: string;
  kind: InventoryKind;
  warehouse: string;
  medicalRecordNo: string;
  selfPrepared: string;
  itemName: string;
  quantity: string;
  batchNo: string;
  expireDate: string;
  genericName: string;
  spec: string;
  formOrModel: string;
  usage: string;
  status: string;
  owner: string;
};

const activeTab = ref('basic');
const activeOrderTerm = ref<'long' | 'temp'>('long');
const activeDiagnosisTab = ref('main');
const activePlanMode = ref('HD方案');
const activePlanTerm = ref<'long' | 'temp'>('long');
const selectedTempPlanId = ref('');
const tempPlanFormVisible = ref(false);
const dryWeightDialogVisible = ref(false);
const longPlanEditing = ref(false);
const vascularAccessFieldCount = ref(1);
const recordDialogVisible = ref(false);
const createdPatientRows = ref<PatientRecord[]>([]);
const patientDrawerMode = ref<'create' | 'edit'>('create');
const patientDrawerVisible = ref(false);
const hisImportDialogVisible = ref(false);
const batchImportDialogVisible = ref(false);
const exportDialogVisible = ref(false);
const exportOptions = ref(['当前列表', '筛选结果']);
const combinedTreatmentDialogVisible = ref(false);
const combinedTreatmentDialogMode = ref<'create' | 'edit'>('create');
const combinedTreatmentEditingId = ref('');
const combinedTreatmentDateRange = ref<[string, string]>(['2026-02-21', '2026-05-21']);
const combinedTreatmentAppliedRange = ref<[string, string]>(['2026-02-21', '2026-05-21']);
const combinedTreatmentPage = ref(1);
const combinedTreatmentPageSize = ref(10);
const combinedTreatmentForm = ref<CombinedTreatmentFormState>({
  treatmentDate: '2026-05-21',
  modes: ['腹膜透析'],
  remark: '',
});
const anticoagulationDialogVisible = ref(false);
const anticoagulationDialogMode = ref<'create' | 'edit'>('create');
const selectedAnticoagulationId = ref('ANT-20260521-001');
const anticoagulationDateRange = ref<[string, string]>(['2026-04-21', '2026-05-21']);
const activeVisitKind = ref<VisitKind>('outpatient');
const visitDialogVisible = ref(false);
const activeEmrTab = ref('home');
const activeLabSource = ref<'original' | 'system'>('original');
const selectedLabReportId = ref('LAB-20260514-001');
const activeAnalysisMetric = ref<AnalysisMetricKey>('weight');
const analysisQueried = ref(false);
const analysisDateRange = ref<[string, string]>(['2026-04-21', '2026-05-21']);
const activeInventoryKind = ref<InventoryKind>('drug');
const inventoryDateRange = ref<[string, string]>(['2026-05-01', '2026-05-31']);
const changeRecordDialogVisible = ref(false);
const changeRecordDialogMode = ref<'create' | 'edit'>('create');
const selectedChangeRecordId = ref('change-001');
const changeFilter = ref<ChangeFilterState>({
  eventType: '',
  originalStatus: '',
  changeStatus: '',
  keyword: '',
});
const changeRecordForm = ref<ChangeRecordFormState>({
  changeDate: '2026-05-21',
  eventType: '主档变更',
  originalStatus: '放弃治疗',
  changeStatus: '血透',
  changeReason: '联系电话更新并补充患者端身份核验',
  remark: '同步患者中心、导诊台和责任护士消息',
  nextChangeDate: '2026-05-28',
  owner: '导诊王敏',
  status: '待复核',
});
const accessDialogVisible = ref(false);
const accessDialogMode = ref<'create' | 'edit'>('create');
const accessDialogSelectedId = ref('access-001');
const activeAccessSubTab = ref<AccessSubTab>('access');
const repairDialogVisible = ref(false);
const repairDialogMode = ref<'create' | 'edit'>('create');
const repairDialogSelectedId = ref('');
const repairDateRange = ref<[string, string]>(['2025-11-21', '2026-05-21']);
const repairProblemOptions = ref(['通路狭窄', '血栓形成', '感染/红肿', '流量不足', '导管堵塞', '穿刺困难', '其他']);
const accessForm = ref<AccessFormState>({
  surgeryName: '动静脉内瘘成形术',
  surgeryDate: '2026-05-21',
  firstUseDate: '2026-05-21',
  side: '左',
  accessType: '自体动静脉内瘘',
  status: '正常',
  nonHospitalSurgery: false,
  registerSurgeryInfo: false,
  remark: '',
  puncturePlan: '',
  puncturePlanNote: '',
});
const repairForm = ref<RepairFormState>({
  surgeryName: '',
  accessName: '',
  problem: '',
  repairDate: '',
  surgeon: '',
  bUltrasoundDoctor: '',
  assistantDoctor: '',
  nurse: '',
  currentAvailable: false,
  availableDate: '',
  nonHospitalRepair: false,
  remark: '',
});
const accessDialogReminderRows = ref<AccessReminderRow[]>([
  { nodeName: '首次使用复核', remindTime: '2026-05-24 08:00', handled: '否', handler: '', handledTime: '' },
  { nodeName: '30天成熟评估', remindTime: '2026-06-20 08:30', handled: '是', handler: '孙涛', handledTime: '2026-05-20 09:10' },
]);
const repairRecords = ref<RepairRecord[]>([]);
const changeRecordRows = ref<ChangeRecordRow[]>([
  {
    id: 'change-001',
    changeDate: '2026-05-21',
    eventType: '主档变更',
    originalStatus: '放弃治疗',
    changeStatus: '血透',
    changeReason: '联系电话更新并补充患者端身份核验',
    remark: '下次变更日期：2026-05-28',
    createdAt: '2026-05-20 16:20',
    owner: 'XX市第二附属医院',
    status: '待复核',
    nextAction: '复核后生效',
  },
  {
    id: 'change-002',
    changeDate: '2026-05-20',
    eventType: '归属变更',
    originalStatus: '血透',
    changeStatus: '放弃治疗',
    changeReason: '责任护士调整后需同步医生站与护士站',
    remark: '下次变更日期：2026-05-21',
    createdAt: '2026-05-20 16:20',
    owner: 'XX市第二附属医院',
    status: '已生效',
    nextAction: '同步责任团队',
  },
  {
    id: 'change-003',
    changeDate: '2026-03-26',
    eventType: '新入',
    originalStatus: '未签约',
    changeStatus: '血透',
    changeReason: '导诊建档后进入签约与随访名称维护',
    remark: '下次变更日期：2026-05-20',
    createdAt: '2026-03-26 09:17',
    owner: '裴瑶强',
    status: '已审计',
    nextAction: '继续追溯',
  },
]);
const accessRecords = ref<AccessRecord[]>([
  {
    id: 'access-001',
    surgeryName: '动静脉内瘘成形术',
    surgeryDate: '2025-11-18',
    firstUseDate: '2026-01-06',
    side: '左',
    accessType: '自体动静脉内瘘',
    status: '正常',
    nonHospitalSurgery: false,
    registerSurgeryInfo: true,
    remark: '成熟稳定，震颤可触及，透后压迫后无渗血。',
    puncturePlan: '左前臂内瘘 A/B 点轮换穿刺，避开术口 2cm，优先使用 15G 针。',
    puncturePlanNote: '每次上机前核对震颤、搏动和穿刺点皮肤完整性。',
    owner: '孙涛',
    updatedAt: '2026-05-21 10:18',
    nextAction: '上机核对',
    reminderCount: '2',
    riskLevel: '低风险',
    firstUseGap: '2026-03-26',
    surgeryGap: '2026-03-26',
    useDuration: '1月25天18小时40分钟',
    createdTime: '2026-03-26 09:18',
    accessTitle: '左前臂自体动静脉内瘘',
    accessSummary: '已成熟，震颤可触及',
    reminders: [
      { nodeName: '首次使用复核', remindTime: '2026-05-24 08:00', handled: '否', handler: '', handledTime: '' },
      { nodeName: '30天成熟评估', remindTime: '2026-06-20 08:30', handled: '是', handler: '孙涛', handledTime: '2026-05-20 09:10' },
    ],
  },
  {
    id: 'access-002',
    surgeryName: '中心静脉置管术',
    surgeryDate: '2026-04-07',
    firstUseDate: '2026-04-07',
    side: '右',
    accessType: '无隧道和涤纶套的透析导管',
    status: '修复中',
    nonHospitalSurgery: true,
    registerSurgeryInfo: true,
    remark: '外院置管后转入，出口护理纳入感控重点。',
    puncturePlan: '右颈内静脉导管双腔连接，透前先确认封管液抽吸顺畅。',
    puncturePlanNote: '每次治疗后记录导管连接和断开时间，联动感控管理。',
    owner: '周敏',
    updatedAt: '2026-05-21 09:54',
    nextAction: '导管护理复评',
    reminderCount: '3',
    riskLevel: '中风险',
    firstUseGap: '2026-04-07',
    surgeryGap: '2026-04-07',
    useDuration: '1月14天7小时12分钟',
    createdTime: '2026-04-07 14:02',
    accessTitle: '右颈内静脉导管',
    accessSummary: '修复中，需感控跟踪',
    reminders: [
      { nodeName: '出口感染复评', remindTime: '2026-05-22 08:20', handled: '否', handler: '', handledTime: '' },
      { nodeName: '导管连接核对', remindTime: '2026-05-21 14:00', handled: '是', handler: '周敏', handledTime: '2026-05-21 14:05' },
      { nodeName: '换药提醒', remindTime: '2026-05-24 08:00', handled: '否', handler: '', handledTime: '' },
    ],
  },
  {
    id: 'access-003',
    surgeryName: '人工血管移植术',
    surgeryDate: '2024-08-16',
    firstUseDate: '2024-10-08',
    side: '右',
    accessType: '移植物动静脉内瘘',
    status: '未成熟',
    nonHospitalSurgery: false,
    registerSurgeryInfo: true,
    remark: '触诊搏动尚可，通路流量边缘，建议充分性复评。',
    puncturePlan: '右前臂移植物动静脉内瘘优先单点试穿，逐次观察血肿和渗血。',
    puncturePlanNote: '未成熟阶段由医生复核后再进入常规穿刺。',
    owner: '张明',
    updatedAt: '2026-05-20 16:35',
    nextAction: '通路评估',
    reminderCount: '1',
    riskLevel: '观察',
    firstUseGap: '2024-10-08',
    surgeryGap: '2024-08-16',
    useDuration: '1年7月13天',
    createdTime: '2024-08-16 11:20',
    accessTitle: '右前臂移植物动静脉内瘘',
    accessSummary: '未成熟，流量边缘',
    reminders: [
      { nodeName: '30天成熟评估', remindTime: '2026-05-27 09:00', handled: '否', handler: '', handledTime: '' },
    ],
  },
  {
    id: 'access-004',
    surgeryName: '导管拔除术',
    surgeryDate: '2025-02-20',
    firstUseDate: '2025-02-20',
    side: '右',
    accessType: '带隧道和涤纶套的透析导管',
    status: '失去功能',
    nonHospitalSurgery: false,
    registerSurgeryInfo: false,
    remark: '历史通路已废弃，保留归档和事件追溯。',
    puncturePlan: '仅保留历史记录，不再用于穿刺。',
    puncturePlanNote: '用于治疗史和变更信息引用。',
    owner: '导诊台',
    updatedAt: '2026-05-18 17:20',
    nextAction: '归档追溯',
    reminderCount: '0',
    riskLevel: '已退出',
    firstUseGap: '2025-02-20',
    surgeryGap: '2025-02-20',
    useDuration: '已退出',
    createdTime: '2025-02-20 15:40',
    accessTitle: '历史导管通路',
    accessSummary: '已失去功能，保留档案',
    reminders: [],
  },
]);
const currentAccessRecord = computed(() => accessRecords.value.find((record) => record.id === accessDialogSelectedId.value) ?? accessRecords.value[0]);
const visibleChangeRecordRows = computed(() =>
  changeRecordRows.value.filter((row) =>
    (!changeFilter.value.eventType || row.eventType === changeFilter.value.eventType)
    && (!changeFilter.value.originalStatus || row.originalStatus === changeFilter.value.originalStatus)
    && (!changeFilter.value.changeStatus || row.changeStatus === changeFilter.value.changeStatus)
    && (!changeFilter.value.keyword || [row.changeDate, row.eventType, row.originalStatus, row.changeStatus, row.changeReason, row.remark, row.createdAt, row.owner, row.status].some((item) => item.includes(changeFilter.value.keyword))),
  ),
);
const currentChangeRecord = computed(() => visibleChangeRecordRows.value.find((row) => row.id === selectedChangeRecordId.value) ?? visibleChangeRecordRows.value[0] ?? changeRecordRows.value[0]);
const changeSummaryStats = computed(() => [
  { label: '记录总数', value: changeRecordRows.value.length, tone: 'blue' as const },
  { label: '待复核', value: changeRecordRows.value.filter((row) => row.status === '待复核').length, tone: 'orange' as const },
  { label: '已生效', value: changeRecordRows.value.filter((row) => row.status === '已生效').length, tone: 'green' as const },
  { label: '已审计', value: changeRecordRows.value.filter((row) => row.status === '已审计').length, tone: 'purple' as const },
]);
const identityBindingActiveTab = ref<IdentityBindingKind>('card');
const identityBindingDialogVisible = ref(false);
const identityBindingDialogMode = ref<'create' | 'edit'>('create');
const selectedIdentityBindingId = ref('identity-card-001');
const identityBindingForm = ref<IdentityBindingFormState>({
  cardNo: '0008844257',
  cardType: '透析卡',
  patientName: '曹登桂',
  useStatus: '使用中',
  createdAt: '2026-04-01 07:54',
  remark: '门诊签到和上机核对可用',
  barcodeContent: 'BAH_2026039',
  barcodeText: 'BAH_2026039',
  barcodeSpec: '80mm 竖版',
  faceSource: '接诊设备采集',
  faceExpire: '2026-11-21',
  faceDevice: '导诊台人脸终端 02',
  faceStatus: '已绑定',
  faceRemark: '已通过活体检测，可用于签到核验',
});
const identityBindingRecords = ref<IdentityBindingItem[]>([
  {
    id: 'identity-card-001',
    kind: 'card',
    title: '透析卡',
    value: '0008844257',
    useStatus: '使用中',
    owner: '导诊王敏',
    createdAt: '2026-04-01 07:54',
    remark: '门诊签到和上机核对可用',
    nextAction: '支持签到和出入机核对',
  },
  {
    id: 'identity-barcode-001',
    kind: 'barcode',
    title: '条形码',
    value: 'BAH_2026039',
    useStatus: '已绑定',
    owner: '导诊陈洁',
    createdAt: '2026-05-10 08:12',
    remark: '已打印到患者腕带和签到单',
    nextAction: '打印后同步签到终端',
    previewText: 'BAH_2026039',
  },
  {
    id: 'identity-face-001',
    kind: 'face',
    title: '人脸信息',
    value: 'WB-26051001',
    useStatus: '已绑定',
    owner: '导诊李倩',
    createdAt: '2026-05-10 09:22',
    remark: '3 张模板照片，已通过比对',
    nextAction: '可用于签到与患者端登录',
    source: '接诊设备',
    faces: ['正脸', '左侧脸', '右侧脸', '眨眼活体', '戴口罩复核'],
  },
]);
const currentIdentityBindingRecord = computed(
  () => identityBindingRecords.value.find((record) => record.id === selectedIdentityBindingId.value) ?? identityBindingRecords.value[0],
);
const accessTableRows = computed<AccessTableRow[]>(() =>
  accessRecords.value.map((record, index) => ({
    ...record,
    rowNo: String(index + 1),
  })),
);
const visibleRepairTableRows = computed(() =>
  repairRecords.value
    .filter((row) => {
      const [startDate, endDate] = repairDateRange.value;
      return (!startDate || row.repairDate >= startDate) && (!endDate || row.repairDate <= endDate);
    })
    .slice()
    .sort((a, b) => b.repairDate.localeCompare(a.repairDate)),
);
const visibleAccessTableRows = computed(() => {
  if (activeAccessSubTab.value === 'repair') {
    return accessTableRows.value.filter((row) => row.status === '修复中');
  }
  if (activeAccessSubTab.value === 'complication') {
    return accessTableRows.value.filter((row) => row.status !== '正常');
  }
  if (activeAccessSubTab.value === 'follow') {
    return accessTableRows.value.filter((row) => row.reminderCount !== '0');
  }
  return accessTableRows.value.filter((row) => row.status === '正常').slice(0, 1);
});
const dryWeightTrendRows = ref<DryWeightTrendPoint[]>([
  { date: '2026-03-26', time: '09:19', value: 70.0, source: '透后复评', note: '初始评估' },
  { date: '2026-04-02', time: '09:20', value: 70.4, source: '门诊复查', note: '轻度容量负荷' },
  { date: '2026-04-12', time: '09:21', value: 70.8, source: '血透前评估', note: '血压偏高' },
  { date: '2026-04-25', time: '09:20', value: 71.0, source: '治疗记录', note: '超滤后稳定' },
  { date: '2026-05-09', time: '09:18', value: 71.0, source: '专科评估', note: '复评维持' },
  { date: '2026-05-21', time: '18:12', value: 71.0, source: '当前状态', note: '待重新评估' },
]);
const dryWeightForm = ref<DryWeightFormState>({
  evaluationDate: '2026-05-21',
  currentDryWeight: '71.0',
  measuredWeight: '72.4',
  preWeight: '73.1',
  postWeight: '71.8',
  ultrafiltration: '2.4',
  preBp: '154/92',
  postBp: '132/80',
  symptom: '透后乏力轻度，双下肢水肿较前减轻',
  volumeJudgement: '容量轻度超负荷，建议下调干体重 0.5kg 并复评',
  adjustmentPlan: '本次建议干体重调整至 70.5kg，连续 3 次透后血压偏高后复查',
  reviewDate: '2026-05-28',
  reviewer: '张明',
  remark: '联动透析处方目标超滤，护士站上机前再次核对。',
});
const dryWeightChartMode = ref<'chart' | 'table'>('chart');
const dryWeightChartRange = ref(['2025-05-21', '2026-05-21']);
const adequacyDateRange = ref<[string, string]>(['2025-11-21', '2026-05-21']);
const adequacyAppliedRange = ref<[string, string]>(['2025-11-21', '2026-05-21']);
const adequacyDialogVisible = ref(false);
const adequacyDialogMode = ref<'create' | 'edit'>('create');
const adequacyEditingId = ref('');
const adequacyPage = ref(1);
const adequacyPageSize = ref(10);
const adequacyForm = ref<AdequacyFormState>({
  dialysisDate: '2026-05-21',
  ktv: '1.22',
  urr: '64',
  preBeta2: '29.6',
  postBeta2: '18.4',
  beta2Clearance: '37.8',
  preUrea: '23.4',
  postUrea: '8.4',
  preCreatinine: '905',
  postCreatinine: '512',
  durationHour: '4',
  durationMinute: '0',
  preWeight: '73.1',
  postWeight: '71.8',
  ultrafiltration: '1.3',
});
const labReports = ref<LabReportRecord[]>([
  {
    id: 'LAB-20260514-001',
    date: '2026-05-14',
    source: 'original',
    title: '生化检查',
    examItem: '生化检查',
    specimen: '血清',
    applyDate: '2026-05-14',
    reportDate: '2026-05-14',
    lisCode: 'LIS-20260514-1102',
    status: '已归档',
    owner: '检验科刘',
    note: 'LIS 原始报告已同步，可用于趋势分析和医生解读。',
    indicators: [
      { name: '前白蛋白', result: '0.18', normal: '正常', reference: '0.2-0.4', trend: 'up', status: '异常' },
      { name: '葡萄糖', result: '5.9', normal: '正常', reference: '3.89-6.11', trend: 'up', status: '异常' },
      { name: '总二氧化碳', result: '26', normal: '正常', reference: '22-29', trend: 'flat', status: '正常' },
      { name: '总胆红素', result: '18.2', normal: '正常', reference: '<20.5', trend: 'down', status: '正常' },
      { name: '直接胆红素', result: '6.1', normal: '正常', reference: '<6.8', trend: 'up', status: '正常' },
      { name: '间接胆红素', result: '11.4', normal: '正常', reference: '<15', trend: 'flat', status: '正常' },
      { name: '总蛋白', result: '68', normal: '正常', reference: '60-83', trend: 'down', status: '正常' },
      { name: '白蛋白', result: '36', normal: '正常', reference: '>=35', trend: 'flat', status: '正常' },
      { name: '球蛋白', result: '26', normal: '正常', reference: '25-35', trend: 'flat', status: '正常' },
      { name: '白球比例', result: '2.4', normal: '正常', reference: '1-2.5', trend: 'up', status: '正常' },
    ],
  },
  {
    id: 'LAB-20260514-002',
    date: '2026-05-14',
    source: 'system',
    title: '糖脂代谢',
    examItem: '糖脂代谢',
    specimen: '血清',
    applyDate: '2026-05-14',
    reportDate: '2026-05-14',
    lisCode: 'LIS-20260514-1138',
    status: '待复核',
    owner: '检验科主治',
    note: '结构化报告已发布，等待医生解读并记录判断。',
    indicators: [
      { name: '血糖肌酐', result: '5.7', normal: '正常', reference: '3.9-6.1', trend: 'up', status: '正常' },
      { name: '前白蛋白', result: '0.19', normal: '正常', reference: '0.2-0.4', trend: 'flat', status: '异常' },
      { name: '总二氧化碳', result: '28', normal: '正常', reference: '22-29', trend: 'up', status: '正常' },
      { name: '总胆红素', result: '20.5', normal: '正常', reference: '<20.5', trend: 'flat', status: '异常' },
    ],
  },
  {
    id: 'LAB-20260514-003',
    date: '2026-05-14',
    source: 'system',
    title: '血常规',
    examItem: '血常规',
    specimen: '血',
    applyDate: '2026-05-13',
    reportDate: '2026-05-14',
    lisCode: 'LIS-20260514-1190',
    status: '启用',
    owner: '检验科刘',
    note: '标准项目可直接引用到患者中心和医生站。',
    indicators: [
      { name: '血红蛋白', result: '92', normal: '健康', reference: '100-120', trend: 'down', status: '异常' },
      { name: '血清白蛋白', result: '38', normal: '健康', reference: '35-50', trend: 'flat', status: '正常' },
      { name: '白蛋白', result: '4.0', normal: '健康', reference: '3.5-5.5', trend: 'flat', status: '正常' },
      { name: '血钙', result: '1.62', normal: '健康', reference: '1.8-3.0', trend: 'down', status: '异常' },
    ],
  },
]);
const basicEditing = ref(false);
const contactDrawerVisible = ref(false);
const certificateDrawerVisible = ref(false);
const deathDialogVisible = ref(false);
const exitDialogVisible = ref(false);
const contractDialogVisible = ref(false);
const assignmentDialogVisible = ref(false);
const appointmentDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const selected = ref<PatientRecord | null>(null);

type BasicInfoForm = Pick<
  PatientRecord,
  | 'outpatientNo'
  | 'followNo'
  | 'name'
  | 'gender'
  | 'age'
  | 'idCard'
  | 'phone'
  | 'insurance'
  | 'firstDialysis'
  | 'hospitalDept'
  | 'education'
  | 'profession'
  | 'marriage'
  | 'bodyHeight'
  | 'allergy'
  | 'drugAllergy'
  | 'remark'
> & {
  nation: string;
  idType: string;
  insuranceNo: string;
  firstAdmission: string;
  latestAdmission: string;
  doctor: string;
  nurse: string;
  patientTags: string;
  attachments: string;
};

const seedRows: PatientRecord[] = [
  {
    no: 'P20260510001',
    name: '曹登桂',
    sexAge: '男 / 64岁',
    gender: '男',
    age: '64',
    idCard: '350421196203166010',
    phone: '138****6721',
    insurance: '城镇医保',
    outpatientNo: '2021100006',
    followNo: 'SFG-0001',
    customerType: '维持性血透',
    followName: '曹叔',
    ckdStage: '5期',
    treatmentStatus: '血透',
    firstDialysis: '2021-10-17',
    hospitalDept: '厦门市海沧医院 / 血液净化中心',
    bodyHeight: '167',
    education: '初中',
    profession: '退休',
    marriage: '已婚',
    allergy: '无',
    drugAllergy: '无',
    remark: '规律血液透析，责任团队稳定，资料齐全。',
    status: '在管',
    owner: '导诊王敏',
    updatedAt: '2026-05-10 08:42',
    nextAction: '进入归属分配',
  },
  {
    no: 'P20260510002',
    name: '陈德荣',
    sexAge: '男 / 58岁',
    gender: '男',
    age: '58',
    idCard: '320511196802044226',
    phone: '139****2860',
    insurance: '乡镇医保',
    outpatientNo: '2021100012',
    followNo: 'SFG-0002',
    customerType: '导管患者',
    followName: '陈叔',
    ckdStage: '5期',
    treatmentStatus: '血透',
    firstDialysis: '2022-01-14',
    hospitalDept: '总院 / 肾内科',
    bodyHeight: '171',
    education: '中专',
    profession: '务农',
    marriage: '已婚',
    allergy: '青霉素待确认',
    drugAllergy: '头孢类待确认',
    remark: '导管患者，需补充医保备案。',
    status: '资料待补',
    owner: '导诊王敏',
    updatedAt: '2026-05-10 09:15',
    nextAction: '补齐医保联系人',
  },
  {
    no: 'P20260510003',
    name: '陈惠芳',
    sexAge: '女 / 61岁',
    gender: '女',
    age: '61',
    idCard: '350212196401286011',
    phone: '137****6511',
    insurance: '城镇医保',
    outpatientNo: '2021100024',
    followNo: 'SFG-0003',
    customerType: '隔离透析',
    followName: '陈阿姨',
    ckdStage: '5期',
    treatmentStatus: '血透',
    firstDialysis: '2023-03-08',
    hospitalDept: '东院 / 隔离透析区',
    bodyHeight: '159',
    education: '初中',
    profession: '退休',
    marriage: '已婚',
    allergy: '无',
    drugAllergy: '无',
    remark: '乙肝隔离患者，隔离通道已标记。',
    status: '在管',
    owner: '导诊陈洁',
    updatedAt: '2026-05-10 10:05',
    nextAction: '隔离标识复核',
  },
  {
    no: 'P20260510004',
    name: '蔡金环',
    sexAge: '女 / 70岁',
    gender: '女',
    age: '70',
    idCard: '350104195503112418',
    phone: '136****6028',
    insurance: '城镇医保',
    outpatientNo: '2021100031',
    followNo: 'SFG-0004',
    customerType: '临时透析',
    followName: '蔡奶奶',
    ckdStage: '5期',
    treatmentStatus: '血透',
    firstDialysis: '2024-06-19',
    hospitalDept: '总院 / 急诊透析',
    bodyHeight: '162',
    education: '小学',
    profession: '退休',
    marriage: '丧偶',
    allergy: '头孢过敏',
    drugAllergy: '喹诺酮类',
    remark: '临时透析入组待签约，补齐家属授权。',
    status: '建档中',
    owner: '导诊李倩',
    updatedAt: '2026-05-10 10:40',
    nextAction: '提交签约草稿',
  },
  {
    no: 'P20260510005',
    name: '吴海',
    sexAge: '男 / 53岁',
    gender: '男',
    age: '53',
    idCard: '330618197203081833',
    phone: '137****4522',
    insurance: '职工医保',
    outpatientNo: '2021098818',
    followNo: 'SFG-0005',
    customerType: '高风险随访',
    followName: '吴先生',
    ckdStage: '4期',
    treatmentStatus: '腹透转血透',
    firstDialysis: '2020-09-03',
    hospitalDept: '总院 / 血液净化中心',
    bodyHeight: '168',
    education: '高中',
    profession: '司机',
    marriage: '已婚',
    allergy: '无',
    drugAllergy: '无',
    remark: '已解约待归档，需同步退出记录。',
    status: '退出待归档',
    owner: '导诊陈洁',
    updatedAt: '2026-05-09 16:20',
    nextAction: '退出原因归档',
  },
  {
    no: 'P20260510006',
    name: '周萍',
    sexAge: '女 / 49岁',
    gender: '女',
    age: '49',
    idCard: '330206197604210290',
    phone: '138****1092',
    insurance: '职工医保',
    outpatientNo: '2021100045',
    followNo: 'SFG-0006',
    customerType: '腹透转血透',
    followName: '周姐',
    ckdStage: '5期',
    treatmentStatus: '血透',
    firstDialysis: '2024-02-11',
    hospitalDept: '西院 / 血液净化中心',
    bodyHeight: '165',
    education: '高中',
    profession: '个体',
    marriage: '已婚',
    allergy: '造影剂过敏',
    drugAllergy: '青霉素',
    remark: '转入血透，需补充床位和护理组。',
    status: '资料待补',
    owner: '导诊李倩',
    updatedAt: '2026-05-10 11:20',
    nextAction: '补充病区床号',
  },
  {
    no: 'P20260510007',
    name: '郑军',
    sexAge: '男 / 60岁',
    gender: '男',
    age: '60',
    idCard: '350104196510227781',
    phone: '136****4587',
    insurance: '异地医保',
    outpatientNo: '2021100051',
    followNo: 'SFG-0007',
    customerType: '维持性血透',
    followName: '郑先生',
    ckdStage: '5期',
    treatmentStatus: '血透',
    firstDialysis: '2022-11-26',
    hospitalDept: '总院 / 血液净化中心',
    bodyHeight: '170',
    education: '大专',
    profession: '工程师',
    marriage: '已婚',
    allergy: '无',
    drugAllergy: '无',
    remark: '异地医保备案待核验。',
    status: '待确认',
    owner: '导诊王敏',
    updatedAt: '2026-05-10 13:05',
    nextAction: '医保备案核验',
  },
  {
    no: 'P20260510008',
    name: '韩梅',
    sexAge: '女 / 55岁',
    gender: '女',
    age: '55',
    idCard: '320118197005055582',
    phone: '139****6608',
    insurance: '居民医保',
    outpatientNo: '2021100062',
    followNo: 'SFG-0008',
    customerType: '维持性血透',
    followName: '韩女士',
    ckdStage: '5期',
    treatmentStatus: '血透',
    firstDialysis: '2021-08-18',
    hospitalDept: '东院 / 血液净化中心',
    bodyHeight: '160',
    education: '中专',
    profession: '退休',
    marriage: '已婚',
    allergy: '无',
    drugAllergy: '无',
    remark: '资料完整，等待签约后归属。',
    status: '在管',
    owner: '导诊陈洁',
    updatedAt: '2026-05-10 13:35',
    nextAction: '进入签约服务',
  },
  {
    no: 'P20260510009',
    name: '林建平',
    sexAge: '男 / 66岁',
    gender: '男',
    age: '66',
    idCard: '330391197905090081',
    phone: '137****2238',
    insurance: '职工医保',
    outpatientNo: '2021100074',
    followNo: 'SFG-0009',
    customerType: '导管患者',
    followName: '林先生',
    ckdStage: '5期',
    treatmentStatus: '血透',
    firstDialysis: '2020-12-30',
    hospitalDept: '总院 / 血液净化中心',
    bodyHeight: '173',
    education: '高中',
    profession: '司机',
    marriage: '已婚',
    allergy: '磺胺过敏',
    drugAllergy: '磺胺类',
    remark: '需同步感控和通路评估。',
    status: '资料待补',
    owner: '导诊王敏',
    updatedAt: '2026-05-10 14:10',
    nextAction: '补充联系人',
  },
  {
    no: 'P20260510010',
    name: '孙丽',
    sexAge: '女 / 39岁',
    gender: '女',
    age: '39',
    idCard: '341101198604107716',
    phone: '135****7716',
    insurance: '自费',
    outpatientNo: '2021100088',
    followNo: '待生成',
    customerType: '临时透析',
    followName: '孙女士',
    ckdStage: 'AKI',
    treatmentStatus: '血透',
    firstDialysis: '2026-05-08',
    hospitalDept: '总院 / 急诊透析',
    bodyHeight: '163',
    education: '本科',
    profession: '会计',
    marriage: '未婚',
    allergy: '无',
    drugAllergy: '无',
    remark: '急诊透析临时建档，等待身份核验。',
    status: '建档中',
    owner: '导诊李倩',
    updatedAt: '2026-05-10 15:00',
    nextAction: '身份核验',
  },
];

const rows = computed(() => [...createdPatientRows.value, ...seedRows]);

const supplementRows: SupplementRecord[] = [
  { category: '地址记录', content: '现住址：厦门市海沧区嵩屿街道；透析接送地址已核验', status: '已核验', owner: '导诊王敏', updatedAt: '2026-05-10 08:45', nextAction: '签约引用' },
  { category: '联系人/家属记录', content: '曹强 / 儿子 / 138****9011；授权接收危急值通知', status: '已授权', owner: '导诊王敏', updatedAt: '2026-05-10 08:48', nextAction: '同步患者端' },
  { category: '证件证书记录', content: '身份证、医保电子凭证、慢病备案证明', status: '待复核', owner: '导诊李倩', updatedAt: '2026-05-10 09:10', nextAction: '复核证件' },
  { category: '证件附件记录', content: '身份证正反面、医保备案截图、外院透析证明 3 份附件', status: '待归档', owner: '导诊陈洁', updatedAt: '2026-05-10 09:22', nextAction: '附件归档' },
  { category: '医保信息记录', content: '城镇医保；门慢备案有效期至 2027-05-09', status: '已核验', owner: '导诊王敏', updatedAt: '2026-05-10 09:30', nextAction: '费用规则引用' },
  { category: '死亡记录', content: '吴海 / P20260510005，死亡证明待补传，退出待归档', status: '待补证', owner: '医务张洁', updatedAt: '2026-05-09 16:30', nextAction: '死亡资料复核' },
];

const contactRows: ContactRecord[] = [
  { name: '曹强', relationship: '儿子', fixedPhone: '0592-****218', mobile: '138****9011', authorization: '危急值、欠费、治疗变更通知', remark: '主要照护人，已签署代通知授权', status: '已授权' },
  { name: '林秀云', relationship: '配偶', fixedPhone: '0592-****706', mobile: '139****2706', authorization: '日常排班和接送提醒', remark: '上午班接送联系人', status: '已核验' },
  { name: '曹敏', relationship: '女儿', fixedPhone: '-', mobile: '137****3362', authorization: '紧急备用联系人', remark: '外地工作，仅紧急联系', status: '备用' },
];

const addressRows: AddressRecord[] = [
  { region: '福建省厦门市海沧区', detail: '嵩屿街道海景东路 118 号 3 栋 602', resident: '是', usage: '现住址/透析接送', verifiedAt: '2026-05-10 08:45', status: '已核验' },
  { region: '福建省三明市沙县区', detail: '凤岗街道长富南路 26 号', resident: '否', usage: '户籍地址', verifiedAt: '2026-05-10 08:45', status: '已记录' },
  { region: '福建省厦门市思明区', detail: '厦禾路 988 号家属临时住处', resident: '否', usage: '临时陪护地址', verifiedAt: '2026-05-12 15:20', status: '待复核' },
];

const historyFlags: HistoryFlag[] = [
  { label: '有既往病史', value: '高血压 12 年，2 型糖尿病 8 年，冠心病 PCI 术后', status: '已确认', owner: '张明', updatedAt: '2026-05-10' },
  { label: '有肾脏病替代治疗史', value: '2021-10-17 起规律血液透析，每周三次', status: '已确认', owner: '导诊王敏', updatedAt: '2026-05-10' },
  { label: '有过敏史', value: '无明确药物过敏；造影剂使用前需二次确认', status: '关注', owner: '周敏', updatedAt: '2026-05-11' },
  { label: '有感染筛查记录', value: '乙肝/丙肝/HIV/梅毒筛查阴性，乙肝抗体低', status: '待复查', owner: '感控专员', updatedAt: '2026-05-12' },
];

const replacementHistoryRows: ReplacementHistory[] = [
  { mode: '血液透析 HD', startedAt: '2021-10-17', hospital: '厦门市海沧医院血液净化中心', access: '左前臂自体动静脉内瘘', frequency: '周一/三/五 上午班', status: '规律治疗', nextAction: '进入排班排床' },
  { mode: '临时中心静脉导管', startedAt: '2021-10-01', hospital: '外院肾内科', access: '右颈内静脉导管', frequency: '过渡期 2 周', status: '已拔管', nextAction: '保留历史通路' },
  { mode: '腹膜透析评估', startedAt: '2020-09-03', hospital: '总院肾内科', access: '未置管', frequency: '评估后未执行', status: '历史记录', nextAction: '医生站可追溯' },
];

const attachmentRows: AttachmentRecord[] = [
  { name: '身份证正反面', type: '证件附件', source: '读卡/拍照上传', uploadedAt: '2026-05-10 08:40', status: '已归档' },
  { name: '医保电子凭证截图', type: '医保附件', source: '患者端上传', uploadedAt: '2026-05-10 08:43', status: '已核验' },
  { name: '外院透析记录摘要', type: '外院资料', source: '导诊补传', uploadedAt: '2026-05-10 09:12', status: '待复核' },
  { name: '血液净化治疗知情同意书', type: '文书附件', source: '电子签署', uploadedAt: '2026-05-10 09:35', status: '已签署' },
];

const detailTabs: DetailTab[] = [
  { label: '基本信息', name: 'basic', summary: '患者主索引、身份、医保、联系人、签约和导诊建档资料。', input: '患者身份、证件附件、联系人、医保和导诊核验。', output: '患者主档、随访名称、签约准入和归属分配前置资料。', next: '资料完整后进入签约、归属分配和预约。' },
  { label: '诊断', name: 'diagnosis', summary: '维护主要诊断、原发病、病理、并发症、传染病、肿瘤、过敏和关闭记录。', input: '医生诊疗评估、既往病史、检验检查、外院病历和导诊采集病史。', output: '有效诊断、风险标记、关闭原因和处方/预约准入提示。', next: '输出给医生站医嘱处方、护士核对、感控和统计报表。' },
  { label: '血透方案', name: 'plan', summary: '展示当前透析模式、频次、班次、机位意向、处方参数和审核状态。', input: '归属分配、预约审核、血管通路和医生透析处方。', output: '治疗计划、处方参数、排班规则和上机核对要点。', next: '进入排班排床、护士核对和治疗记录。' },
  { label: '血透记录单', name: 'record', summary: '按治疗日期汇总透前、上机、透中、下机、透后评估和归档状态。', input: '当日排班、处方、医嘱执行、设备联机和护理记录。', output: '单次透析过程、记录单、签名和归档审核状态。', next: '输出给药耗费用、质控、报表和健康档案。' },
  { label: '就诊', name: 'visit', summary: '门诊、住院、急诊、随访和跨院协管就诊记录。', input: 'HIS/EMR 同步、导诊预约、医生评估和患者端申请。', output: '就诊事件、来源任务、责任医生和下一次随访计划。', next: '支撑电子病历、诊断、医嘱和报表追溯。' },
  { label: '电子病历', name: 'emr', summary: '病程记录、评估、知情同意、健康报告和文书归档。', input: '医生病历、护理记录、检验检查、治疗归档和患者签署。', output: '可追溯病历文书、签名、版本和归档状态。', next: '给医生站、护士站、患者端和审计查询引用。' },
  { label: '医嘱', name: 'orders', summary: '长期、临时、检验、检查、护理和血透专项医嘱状态。', input: '诊断、评估、通路、检验和基础医嘱目录。', output: '待审核/待执行医嘱、执行计划、停止和退回记录。', next: '进入护士核对执行、药房审方、药耗费用和治疗记录。' },
  { label: '通路', name: 'access', summary: '当前通路、备用通路、评估、穿刺、事件和退出。', input: '通路建立/置管资料、启用评估、治疗穿刺和事件记录。', output: '当前可用通路、风险状态、穿刺建议和通路时间轴。', next: '影响透析处方、上机核对、感控和预警。' },
  { label: '数据分析', name: 'analysis', summary: '按患者聚合治疗、检验、费用、预警、充分性和趋势指标。', input: '治疗记录、检验结果、费用、通路事件和规则预警。', output: '趋势结论、达标判定、预警线索和改进建议。', next: '输出给 CQI、医生评估、统计报表和患者健康报告。' },
  { label: '抗凝剂记录', name: 'anticoagulation', summary: '肝素、低分子肝素、无肝素、枸橼酸等抗凝方案与效果。', input: '透析处方、凝血风险、透中凝血事件和医嘱执行。', output: '抗凝用量、调整原因、滤器凝血和下次处方建议。', next: '联动医嘱处方、治疗记录、药品消耗和风险预警。' },
  { label: '干体重', name: 'dry-weight', summary: '干体重评估、调整、血压容量变化和医生确认。', input: '透前/透后体重、血压、超滤量、症状和医生评估。', output: '当前干体重、调整记录、容量风险和复评计划。', next: '影响透析处方目标超滤、预警和患者宣教。' },
  { label: '实验室', name: 'lab', summary: '检验医嘱、标本链、结果、危急值、达标判定和趋势。', input: '医生/护士检验医嘱、LIS 同步、标本采集和手工报告。', output: '标准化检验结果、危急值通知、趋势图和归档报告。', next: '回写医生评估、疗效预警、统计报表和患者端。' },
  { label: '影像', name: 'imaging', summary: 'PACS/外院影像、报告、附件、审核和医生解读。', input: '检查医嘱、PACS 接口、患者上传和外院报告。', output: '影像报告、附件、异常提示和临床解读记录。', next: '支撑诊断、通路手术、并发症处理和病历归档。' },
  { label: '账户', name: 'account', summary: '患者费用账户、医保结算、欠费提醒、患者端账号和授权。', input: '签约、收费接口、治疗费用、患者端注册和身份绑定。', output: '账户余额、欠费提醒、结算记录、患者端登录和授权状态。', next: '影响预约、治疗提醒、费用同步和患者端服务。' },
  { label: '库存', name: 'inventory', summary: '单患者治疗消耗、药品耗材批号、退费退库和追溯链。', input: '医嘱执行、治疗记录、库存批次、UDI 和费用字典。', output: '药耗消耗、库存流水、批号追溯和费用明细。', next: '进入库存预警、费用核对、报表和审计。' },
  { label: '血透充分性', name: 'adequacy', summary: 'Kt/V、URR、血流量、再循环、透析时长和复评计划。', input: '治疗参数、检验结果、血流方案、通路评估和充分性规则。', output: '充分性达标判定、复查任务、处方调整建议和 CQI 线索。', next: '回到医生处方、通路评估、质控和统计报表。' },
  { label: '合并治疗', name: 'combined-treatment', summary: 'HD、HDF、HP、CRRT、灌流、特殊净化和协同治疗记录。', input: '治疗申请、医生处方、设备状态、耗材库存和预约容量。', output: '合并治疗计划、执行记录、耗材消耗和风险提示。', next: '进入排班容量、护士执行、费用和治疗归档。' },
  { label: '身份绑定', name: 'identity-binding', summary: '身份证、医保、IC卡、人脸、腕带和患者端账号绑定。', input: '患者主档、证件附件、接诊设备、接口同步和患者端申请。', output: '身份核验结果、绑定记录、解绑追溯和签到可用状态。', next: '支撑签到、上机核对、患者端登录和接口同步。' },
  { label: '变更信息', name: 'change-info', summary: '患者主档、签约、归属、医保、通路和关键资料变更追溯。', input: '各模块修改申请、复核意见、电子签名和审计日志。', output: '变更前后值、复核状态、责任人和审计链。', next: '支撑医疗安全审计、权限追溯和报表口径修正。' },
];

const diagnosisTabs = [
  { label: '主要诊断', name: 'main' },
  { label: '原发病', name: 'primary' },
  { label: '病理', name: 'pathology' },
  { label: '并发症', name: 'complication' },
  { label: '传染病', name: 'infection' },
  { label: '肿瘤', name: 'tumor' },
  { label: '过敏', name: 'allergy' },
];

const emrTabs = [
  { label: '病历首页', name: 'home' },
  { label: '首次病程', name: 'first-course' },
  { label: '病程记录', name: 'course' },
  { label: '医疗文书', name: 'document' },
  { label: '随访记录', name: 'follow' },
  { label: '查房记录', name: 'round' },
  { label: '会诊记录', name: 'consultation' },
  { label: '医疗文书记录', name: 'document-record' },
];

const diagnosisDiseaseOptions = [
  '慢性肾脏病5期',
  '维持性血液透析状态',
  '肾性贫血',
  '糖尿病肾病',
  '高血压肾损害',
  '继发性甲状旁腺功能亢进',
  '容量负荷过重',
  '导管出口感染风险',
  '头孢类过敏',
  '造影剂过敏史',
];

const dialysisPlanModes = ['HD方案', 'HDF方案', 'HD+HP方案', 'CRRT方案'];
const vascularAccessOptions = ['左侧前臂自体动静脉内瘘', '右颈长期导管', '左上臂人工血管'];

const dialysisPlanSections: DialysisPlanSection[] = [
  {
    title: '方案信息',
    columns: 3,
    fields: [
      { label: '处方编号', value: 'XTFA_2026001329' },
      { label: '制定人', value: '聂强强', type: 'select', options: ['聂强强', '张明', '陈宁'] },
      { label: '制定日期', value: '2026-04-02', type: 'date' },
    ],
  },
  {
    title: '透析建议',
    columns: 1,
    fields: [
      { label: '', value: '', type: 'textarea', span: 'wide' },
    ],
  },
  {
    title: '血透通路',
    actionLabel: '新增',
    columns: 2,
    fields: [
      { label: '血管通路', value: '左侧前臂自体动静脉内瘘', type: 'select', options: vascularAccessOptions, required: true, addable: true },
    ],
  },
  {
    title: '治疗参数',
    columns: 3,
    fields: [
      { label: '治疗时长', value: '4', unit: '时', extraValue: '', extraUnit: '分', required: true },
      { label: '血流量', value: '240', unit: 'ml/min' },
      { label: '透析液流量', value: '500', unit: 'ml/min' },
      { label: '超滤曲线', value: '', placeholder: '超滤曲线', type: 'select', options: ['超滤曲线', '线性超滤', '阶梯超滤'], addable: true },
      { label: '钠曲线', value: '', placeholder: '钠曲线', type: 'select', options: ['钠曲线', '标准钠曲线', '低钠曲线'], unit: 'mmol/L', addable: true },
      { label: '冲液量', value: '', unit: 'ml' },
      { label: '分钟', value: '', unit: 'min' },
    ],
  },
  {
    title: '无透析液',
    checkLabel: '无透析液',
    checked: false,
    columns: 3,
    fields: [
      { label: '透析液名称', value: '透析A+B液', type: 'select', options: ['透析A+B液', '低钾钙透析液', '标准碳酸氢盐透析液'] },
      { label: '透析液电导率', value: '138', unit: 'ms/cm' },
      { label: '钠', value: '138', unit: 'mmol/L' },
      { label: '钙', value: '1.5', unit: 'mmol/L' },
      { label: '钾', value: '2', unit: 'mmol/L' },
      { label: '镁', value: '0.5', unit: 'mmol/L' },
      { label: '氯', value: '108.5', unit: 'mmol/L' },
      { label: '葡萄糖', value: '0', unit: 'mmol/L', type: 'number' },
      { label: '碳酸氢根', value: '3', unit: 'mmol/L' },
      { label: '醋酸根', value: '0', unit: 'mmol/L' },
      { label: '枸橼酸根', value: '0', unit: 'mmol/L' },
      { label: '含糖', value: '否', type: 'checkbox' },
      { label: '透析液温度', value: '37', unit: '℃' },
    ],
  },
  {
    title: '无抗凝剂',
    checkLabel: '无抗凝剂',
    checked: false,
    columns: 3,
    fields: [
      { label: '抗凝剂', value: '那屈肝素钙注射液,0.4ml:4100IU', type: 'select', options: ['那屈肝素钙注射液,0.4ml:4100IU', '低分子肝素钙', '普通肝素'], required: true },
      { label: '自备', value: '否', type: 'checkbox' },
      { label: '抗凝剂首剂', value: '', unit: 'IU' },
      { label: '追加速率', value: '', unit: 'IU' },
      { label: '追加时长', value: '', unit: '时', extraValue: '', extraUnit: '分' },
      { label: '追加总量', value: '', unit: 'IU' },
      { label: '使用总量', value: '3000', unit: 'IU' },
      { label: '泡管', value: '否', type: 'checkbox' },
    ],
  },
  {
    title: '耗材',
    columns: 3,
    fields: [
      { label: '透析器', value: '透析器HA230', type: 'select', options: ['透析器HA230', 'FX80 高通量', 'F16 常规'], required: true, extraValue: '1', extraUnit: '支' },
      { label: '血路管', value: '血路管002', type: 'select', options: ['血路管002', '成人标准管路', 'HDF管路'], required: true, extraValue: '1', extraUnit: '支' },
      { label: '穿刺针1', value: '', placeholder: '请选择穿刺针1', type: 'select', options: ['请选择穿刺针1', '内瘘穿刺针16G', '内瘘穿刺针17G'], extraValue: '', extraPlaceholder: '数量', extraUnit: '/' },
      { label: '穿刺针2', value: '', placeholder: '请选择穿刺针2', type: 'select', options: ['请选择穿刺针2', '内瘘穿刺针16G', '内瘘穿刺针17G'], extraValue: '', extraPlaceholder: '数量', extraUnit: '/' },
    ],
  },
];

const tempPlanOptions = [
  '何亚春202605191705HD临时方案',
  '曹登桂202605171030HD低钙临时方案',
  '陈秀兰202605151420HD补透临时方案',
];

const hdfTempPlanOptions: string[] = [];
const hdHpTempPlanOptions: string[] = [];
const crrtTempPlanOptions: string[] = [];

const tempPlanList: TempDialysisPlan[] = [
  {
    id: 'TMP-HD-202605191705',
    name: '何亚春202605191705HD临时方案',
    startedAt: '2026-05-19',
    remaining: '1次',
    status: '启用',
    owner: '聂强强',
  },
  {
    id: 'TMP-HD-202605171030',
    name: '曹登桂202605171030HD低钙临时方案',
    startedAt: '2026-05-17',
    remaining: '0次',
    status: '已停用',
    owner: '陈宁',
  },
];

const hdfTempPlanList: TempDialysisPlan[] = [];
const hdHpTempPlanList: TempDialysisPlan[] = [];
const crrtTempPlanList: TempDialysisPlan[] = [];

const tempDialysisPlanSections: DialysisPlanSection[] = [
  {
    title: '方案信息',
    columns: 3,
    fields: [
      { label: '处方编号', value: '', placeholder: '', span: 'double' },
      { label: '方案名称', value: '何亚春202605191705HD临时方案', span: 'double' },
      { label: '制定人', value: '', placeholder: '请选择制定人', type: 'select', options: ['聂强强', '张明', '陈宁'] },
      { label: '制定日期', value: '2026-05-19', type: 'date' },
      { label: '启用日期', value: '2026-05-19', type: 'date' },
      { label: '方案设定次数', value: '', type: 'number' },
      { label: '剩余使用次数', value: '/', placeholder: '', span: 'double' },
      { label: '已停用', value: '否', placeholder: '', span: 'double' },
      { label: '停用日期', value: '', placeholder: '请选择', type: 'date' },
      { label: '停用人', value: '', placeholder: '请选择停用人', type: 'select', options: ['聂强强', '张明', '陈宁'] },
    ],
  },
  ...dialysisPlanSections.slice(1),
];

const hdfDialysisPlanSections: DialysisPlanSection[] = [
  {
    title: '方案信息',
    columns: 3,
    fields: [
      { label: '处方编号', value: '' },
      { label: '制定人', value: '', placeholder: '请选择制定人', type: 'select', options: ['聂强强', '张明', '陈宁'] },
      { label: '制定日期', value: '2026-05-19', type: 'date' },
    ],
  },
  {
    title: '透析建议',
    columns: 1,
    fields: [
      { label: '', value: '', type: 'textarea', span: 'wide' },
    ],
  },
  {
    title: '血透通路',
    actionLabel: '新增',
    columns: 2,
    fields: [
      { label: '血管通路', value: '右侧前臂移植物动静脉内瘘', type: 'select', options: vascularAccessOptions, required: true, addable: true },
    ],
  },
  {
    title: '治疗参数',
    columns: 3,
    fields: [
      { label: '治疗时长', value: '', unit: '时', extraValue: '', extraUnit: '分', required: true },
      { label: '血流量', value: '', unit: 'ml/min' },
      { label: '透析液流量', value: '', unit: 'ml/min' },
      { label: '超滤曲线', value: '', placeholder: '超滤曲线', type: 'select', options: ['超滤曲线', '线性超滤', '阶梯超滤'], addable: true },
      { label: '钠曲线', value: '', placeholder: '钠曲线', type: 'select', options: ['钠曲线', '标准钠曲线', '低钠曲线'], unit: 'mmol/L', addable: true },
      { label: '冲液量', value: '', unit: 'ml' },
      { label: '分钟', value: '', unit: 'min' },
    ],
  },
  {
    title: '无透析液',
    checkLabel: '无透析液',
    checked: false,
    columns: 3,
    fields: [
      { label: '透析液名称', value: '', placeholder: '请选择透析液', type: 'select', options: ['透析A+B液', '低钾钙透析液', '标准碳酸氢盐透析液'] },
      { label: '透析液电导率', value: '', unit: 'ms/cm' },
      { label: '钠', value: '', unit: 'mmol/L' },
      { label: '钙', value: '', unit: 'mmol/L' },
      { label: '钾', value: '', unit: 'mmol/L' },
      { label: '镁', value: '', unit: 'mmol/L' },
      { label: '氯', value: '', unit: 'mmol/L' },
      { label: '葡萄糖', value: '', unit: 'mmol/L' },
      { label: '碳酸氢根', value: '', unit: 'mmol/L' },
      { label: '醋酸根', value: '', unit: 'mmol/L' },
      { label: '枸橼酸根', value: '', unit: 'mmol/L' },
      { label: '含糖', value: '否', type: 'checkbox' },
      { label: '透析液温度', value: '', unit: '℃' },
    ],
  },
  {
    title: '无抗凝剂',
    checkLabel: '无抗凝剂',
    checked: false,
    columns: 3,
    fields: [
      { label: '抗凝剂', value: '', placeholder: '请选择抗凝剂', type: 'select', options: ['那屈肝素钙注射液,0.4ml:4100IU', '低分子肝素钙', '普通肝素'], required: true },
      { label: '自备', value: '否', type: 'checkbox' },
      { label: '与血流量的配比', value: '', span: 'double' },
      { label: '给药速率', value: '', unit: 'ml/h' },
      { label: '泵前占比', value: '', unit: '%' },
      { label: '抗凝剂首剂', value: '', unit: '/' },
      { label: '追加速率', value: '', placeholder: '请选择', type: 'select', options: ['请选择', '每30分钟', '每60分钟'], extraValue: '', extraPlaceholder: '追加', extraUnit: '无' },
      { label: '追加时长', value: '', unit: '时', extraValue: '', extraUnit: '分' },
      { label: '泵后占比', value: '', unit: '%' },
      { label: '追加总量', value: '', unit: '' },
      { label: '使用总量', value: '', unit: '无' },
      { label: '泡管', value: '否', type: 'checkbox' },
    ],
  },
  {
    title: '置换液',
    columns: 3,
    fields: [
      { label: '置换方式', value: '', placeholder: '请选择置换方式', type: 'select', options: ['前稀释', '后稀释', '前后混合'] },
      { label: '置换液流量', value: '', unit: 'ml/min' },
      { label: '置换液总量', value: '', unit: 'L' },
    ],
  },
  {
    title: '耗材',
    columns: 3,
    fields: [
      { label: '透析器', value: '', placeholder: '请选择透析器', type: 'select', options: ['请选择透析器', 'FX80 高通量', 'HDF高通量滤器'], required: true, extraValue: '', extraPlaceholder: '数量', extraUnit: '/' },
      { label: '血路管', value: '', placeholder: '请选择血路管', type: 'select', options: ['请选择血路管', 'HDF管路', '成人标准管路'], required: true, extraValue: '', extraPlaceholder: '数量', extraUnit: '/' },
      { label: '穿刺针1', value: '', placeholder: '请选择穿刺针1', type: 'select', options: ['请选择穿刺针1', '内瘘穿刺针16G', '内瘘穿刺针17G'], extraValue: '', extraPlaceholder: '数量', extraUnit: '/' },
      { label: '穿刺针2', value: '', placeholder: '请选择穿刺针2', type: 'select', options: ['请选择穿刺针2', '内瘘穿刺针16G', '内瘘穿刺针17G'], extraValue: '', extraPlaceholder: '数量', extraUnit: '/' },
      { label: '补液管', value: '', placeholder: '请选择补液管', type: 'select', options: ['请选择补液管', 'HDF补液管', '在线置换液管'], required: true, extraValue: '', extraPlaceholder: '数量', extraUnit: '/' },
    ],
  },
];

const hdHpDialysisPlanSections: DialysisPlanSection[] = [
  {
    title: '方案信息',
    columns: 3,
    fields: [
      { label: '处方编号', value: '' },
      { label: '制定人', value: '', placeholder: '请选择制定人', type: 'select', options: ['聂强强', '张明', '陈宁'] },
      { label: '制定日期', value: '2026-05-19', type: 'date' },
    ],
  },
  {
    title: '透析建议',
    columns: 1,
    fields: [
      { label: '', value: '', type: 'textarea', span: 'wide' },
    ],
  },
  {
    title: '血透通路',
    actionLabel: '新增',
    columns: 2,
    fields: [
      { label: '血管通路', value: '右侧前臂移植物动静脉内瘘', type: 'select', options: vascularAccessOptions, required: true, addable: true },
    ],
  },
  {
    title: '治疗参数',
    columns: 3,
    fields: [
      { label: '治疗时长', value: '', unit: '时', extraValue: '', extraUnit: '分', required: true },
      { label: '血流量', value: '', unit: 'ml/min' },
      { label: '灌流时长', value: '', unit: '时', extraValue: '', extraUnit: '分' },
      { label: '灌流流量', value: '', unit: 'ml/min' },
      { label: '透析液流量', value: '', unit: 'ml/min' },
      { label: '超滤曲线', value: '', placeholder: '超滤曲线', type: 'select', options: ['超滤曲线', '线性超滤', '阶梯超滤'], unit: 'ml', addable: true },
      { label: '钠曲线', value: '', placeholder: '钠曲线', type: 'select', options: ['钠曲线', '标准钠曲线', '低钠曲线'], unit: 'mmol/L', addable: true },
      { label: '冲液量', value: '', unit: 'ml' },
      { label: '分钟', value: '', unit: 'min' },
    ],
  },
  {
    title: '无透析液',
    checkLabel: '无透析液',
    checked: false,
    columns: 3,
    fields: [
      { label: '透析液名称', value: '', placeholder: '请选择透析液', type: 'select', options: ['透析A+B液', '低钾钙透析液', '标准碳酸氢盐透析液'] },
      { label: '透析液电导率', value: '', unit: 'ms/cm' },
      { label: '钠', value: '', unit: 'mmol/L' },
      { label: '钙', value: '', unit: 'mmol/L' },
      { label: '钾', value: '', unit: 'mmol/L' },
      { label: '镁', value: '', unit: 'mmol/L' },
      { label: '氯', value: '', unit: 'mmol/L' },
      { label: '葡萄糖', value: '', unit: 'mmol/L' },
      { label: '碳酸氢根', value: '', unit: 'mmol/L' },
      { label: '醋酸根', value: '', unit: 'mmol/L' },
      { label: '枸橼酸根', value: '', unit: 'mmol/L' },
      { label: '含糖', value: '否', type: 'checkbox' },
      { label: '透析液温度', value: '', unit: '℃' },
    ],
  },
  {
    title: '无抗凝剂',
    checkLabel: '无抗凝剂',
    checked: false,
    columns: 3,
    fields: [
      { label: '抗凝剂', value: '', placeholder: '请选择抗凝剂', type: 'select', options: ['那屈肝素钙注射液,0.4ml:4100IU', '低分子肝素钙', '普通肝素'], required: true },
      { label: '自备', value: '否', type: 'checkbox' },
      { label: '与血流量的配比', value: '', span: 'double' },
      { label: '给药速率', value: '', unit: 'ml/h' },
      { label: '泵前占比', value: '', unit: '%' },
      { label: '抗凝剂首剂', value: '', unit: '/' },
      { label: '追加速率', value: '', placeholder: '请选择', type: 'select', options: ['请选择', '每30分钟', '每60分钟'], extraValue: '', extraPlaceholder: '追加', extraUnit: '无' },
      { label: '追加时长', value: '', unit: '时', extraValue: '', extraUnit: '分' },
      { label: '泵后占比', value: '', unit: '%' },
      { label: '追加总量', value: '', unit: '' },
      { label: '使用总量', value: '', unit: '无' },
      { label: '泡管', value: '否', type: 'checkbox' },
    ],
  },
  {
    title: '耗材',
    columns: 3,
    fields: [
      { label: '透析器', value: '', placeholder: '请选择透析器', type: 'select', options: ['请选择透析器', '透析器HA230', 'FX80 高通量'], required: true, extraValue: '', extraPlaceholder: '数量', extraUnit: '/' },
      { label: '血路管', value: '', placeholder: '请选择血路管', type: 'select', options: ['请选择血路管', '血路管002', '成人标准管路'], required: true, extraValue: '', extraPlaceholder: '数量', extraUnit: '/' },
      { label: '穿刺针1', value: '', placeholder: '请选择穿刺针1', type: 'select', options: ['请选择穿刺针1', '内瘘穿刺针16G', '内瘘穿刺针17G'], extraValue: '', extraPlaceholder: '数量', extraUnit: '/' },
      { label: '穿刺针2', value: '', placeholder: '请选择穿刺针2', type: 'select', options: ['请选择穿刺针2', '内瘘穿刺针16G', '内瘘穿刺针17G'], extraValue: '', extraPlaceholder: '数量', extraUnit: '/' },
      { label: '灌流器', value: '', placeholder: '请选择灌流器', type: 'select', options: ['请选择灌流器', 'HA130 血液灌流器', 'HA330-II 血液灌流器'], required: true, extraValue: '', extraPlaceholder: '数量', extraUnit: '/' },
    ],
  },
];

const crrtDialysisPlanSections: DialysisPlanSection[] = [
  {
    title: '方案信息',
    columns: 3,
    fields: [
      { label: '处方编号', value: '' },
      { label: '制定人', value: '', placeholder: '请选择制定人', type: 'select', options: ['聂强强', '张明', '陈宁'] },
      { label: '制定日期', value: '2026-05-19', type: 'date' },
    ],
  },
  {
    title: '透析建议',
    columns: 1,
    fields: [
      { label: '', value: '', type: 'textarea', span: 'wide' },
    ],
  },
  {
    title: '血透通路',
    actionLabel: '新增',
    columns: 2,
    fields: [
      { label: '血管通路', value: '右侧前臂移植物动静脉内瘘', type: 'select', options: vascularAccessOptions, required: true, addable: true },
    ],
  },
  {
    title: '治疗参数',
    columns: 3,
    fields: [
      { label: '治疗时长', value: '', unit: '时', extraValue: '', extraUnit: '分', required: true },
      { label: '血流量', value: '', unit: 'ml/min' },
      { label: '透析液流量', value: '', unit: 'ml/min' },
      { label: '超滤曲线', value: '', placeholder: '超滤曲线', type: 'select', options: ['超滤曲线', '线性超滤', '阶梯超滤'], unit: 'ml', addable: true },
      { label: '钠曲线', value: '', placeholder: '钠曲线', type: 'select', options: ['钠曲线', '标准钠曲线', '低钠曲线'], unit: 'mmol/L', addable: true },
      { label: '冲液量', value: '', unit: 'ml' },
      { label: '分钟', value: '', unit: 'min' },
    ],
  },
  {
    title: '无透析液',
    checkLabel: '无透析液',
    checked: false,
    columns: 3,
    fields: [
      { label: '透析液名称', value: '', placeholder: '请选择透析液', type: 'select', options: ['透析A+B液', '低钾钙透析液', '标准碳酸氢盐透析液'] },
      { label: '透析液电导率', value: '', unit: 'ms/cm' },
      { label: '钠', value: '', unit: 'mmol/L' },
      { label: '钙', value: '', unit: 'mmol/L' },
      { label: '钾', value: '', unit: 'mmol/L' },
      { label: '镁', value: '', unit: 'mmol/L' },
      { label: '氯', value: '', unit: 'mmol/L' },
      { label: '葡萄糖', value: '', unit: 'mmol/L' },
      { label: '碳酸氢根', value: '', unit: 'mmol/L' },
      { label: '醋酸根', value: '', unit: 'mmol/L' },
      { label: '枸橼酸根', value: '', unit: 'mmol/L' },
      { label: '含糖', value: '否', type: 'checkbox' },
      { label: '透析液温度', value: '', unit: '℃', type: 'number' },
    ],
  },
  {
    title: '无抗凝剂',
    checkLabel: '无抗凝剂',
    checked: false,
    columns: 3,
    fields: [
      { label: '抗凝剂', value: '', placeholder: '请选择抗凝剂', type: 'select', options: ['那屈肝素钙注射液,0.4ml:4100IU', '低分子肝素钙', '普通肝素'], required: true },
      { label: '自备', value: '否', type: 'checkbox' },
      { label: '与血流量的配比', value: '', span: 'double' },
      { label: '给药速率', value: '', unit: 'ml/h' },
      { label: '泵前占比', value: '', unit: '%' },
      { label: '抗凝剂首剂', value: '', unit: '/' },
      { label: '追加速率', value: '', placeholder: '请选择', type: 'select', options: ['请选择', '每30分钟', '每60分钟'], extraValue: '', extraPlaceholder: '追加', extraUnit: '无' },
      { label: '追加时长', value: '', unit: '时', extraValue: '', extraUnit: '分' },
      { label: '泵后占比', value: '', unit: '%' },
      { label: '追加总量', value: '', unit: '' },
      { label: '使用总量', value: '', unit: '无' },
      { label: '泡管', value: '否', type: 'checkbox' },
    ],
  },
  {
    title: '耗材',
    columns: 3,
    fields: [
      { label: '透析器', value: '', placeholder: '请选择透析器', type: 'select', options: ['请选择透析器', '透析器HA230', 'FX80 高通量'], required: true, extraValue: '', extraPlaceholder: '数量', extraUnit: '/' },
      { label: '血路管', value: '', placeholder: '请选择血路管', type: 'select', options: ['请选择血路管', '血路管002', '成人标准管路'], required: true, extraValue: '', extraPlaceholder: '数量', extraUnit: '/' },
      { label: '穿刺针1', value: '', placeholder: '请选择穿刺针1', type: 'select', options: ['请选择穿刺针1', '内瘘穿刺针16G', '内瘘穿刺针17G'], extraValue: '', extraPlaceholder: '数量', extraUnit: '/' },
      { label: '穿刺针2', value: '', placeholder: '请选择穿刺针2', type: 'select', options: ['请选择穿刺针2', '内瘘穿刺针16G', '内瘘穿刺针17G'], extraValue: '', extraPlaceholder: '数量', extraUnit: '/' },
    ],
  },
];

const hdfTempDialysisPlanSections: DialysisPlanSection[] = [
  {
    title: '方案信息',
    columns: 3,
    fields: [
      { label: '处方编号', value: '', placeholder: '' },
      { label: '方案名称', value: '何亚春202605191810HDF临时方案', span: 'double' },
      { label: '制定人', value: '', placeholder: '请选择制定人', type: 'select', options: ['聂强强', '张明', '陈宁'] },
      { label: '制定日期', value: '2026-05-19', type: 'date' },
      { label: '启用日期', value: '2026-05-19', type: 'date' },
      { label: '方案设定次数', value: '', type: 'number' },
      { label: '剩余使用次数', value: '/', placeholder: '' },
      { label: '已停用', value: '否', placeholder: '' },
      { label: '停用日期', value: '', placeholder: '请选择', type: 'date' },
      { label: '停用人', value: '', placeholder: '请选择停用人', type: 'select', options: ['聂强强', '张明', '陈宁'] },
    ],
  },
  ...hdfDialysisPlanSections.slice(1),
];

const hdHpTempDialysisPlanSections: DialysisPlanSection[] = [
  {
    title: '方案信息',
    columns: 3,
    fields: [
      { label: '处方编号', value: '', placeholder: '' },
      { label: '方案名称', value: '何亚春202605191835HD+HP临时方案', span: 'double' },
      { label: '制定人', value: '', placeholder: '请选择制定人', type: 'select', options: ['聂强强', '张明', '陈宁'] },
      { label: '制定日期', value: '2026-05-19', type: 'date' },
      { label: '启用日期', value: '2026-05-19', type: 'date' },
      { label: '方案设定次数', value: '', type: 'number' },
      { label: '剩余使用次数', value: '/', placeholder: '' },
      { label: '已停用', value: '否', placeholder: '' },
      { label: '停用日期', value: '', placeholder: '请选择', type: 'date' },
      { label: '停用人', value: '', placeholder: '请选择停用人', type: 'select', options: ['聂强强', '张明', '陈宁'] },
    ],
  },
  {
    title: '透析建议',
    columns: 1,
    fields: [
      { label: '', value: '', type: 'textarea', span: 'wide' },
    ],
  },
  {
    title: '血透通路',
    actionLabel: '新增',
    columns: 2,
    fields: [
      { label: '血管通路', value: '', placeholder: '请选择', type: 'select', options: vascularAccessOptions, required: true, addable: true },
    ],
  },
  ...hdHpDialysisPlanSections.slice(3),
];

const crrtTempDialysisPlanSections: DialysisPlanSection[] = [
  {
    title: '方案信息',
    columns: 3,
    fields: [
      { label: '处方编号', value: '', placeholder: '' },
      { label: '方案名称', value: '何亚春202605191848CRRT临时方案', span: 'double' },
      { label: '制定人', value: '', placeholder: '请选择制定人', type: 'select', options: ['聂强强', '张明', '陈宁'] },
      { label: '制定日期', value: '2026-05-19', type: 'date' },
      { label: '启用日期', value: '2026-05-19', type: 'date' },
      { label: '方案设定次数', value: '', type: 'number' },
      { label: '剩余使用次数', value: '/', placeholder: '' },
      { label: '已停用', value: '否', placeholder: '' },
      { label: '停用日期', value: '', placeholder: '请选择', type: 'date' },
      { label: '停用人', value: '', placeholder: '请选择停用人', type: 'select', options: ['聂强强', '张明', '陈宁'] },
    ],
  },
  {
    title: '透析建议',
    columns: 1,
    fields: [
      { label: '', value: '', type: 'textarea', span: 'wide' },
    ],
  },
  {
    title: '血透通路',
    actionLabel: '新增',
    columns: 2,
    fields: [
      { label: '血管通路', value: '', placeholder: '请选择', type: 'select', options: vascularAccessOptions, required: true, addable: true },
    ],
  },
  ...crrtDialysisPlanSections.slice(3),
];

const diagnosisRowsByTab: Record<string, DiagnosisRow[]> = {
  main: [
    { disease: '慢性肾脏病5期', doctor: '姜弱强', confirmTime: '2026-04-02', closed: false, closeDoctor: '', closeTime: '', closeReason: '', remark: '维持性血液透析，作为处方和排班准入主诊断。', status: '有效' },
    { disease: '维持性血液透析状态', doctor: '张明', confirmTime: '2026-04-02', closed: false, closeDoctor: '', closeTime: '', closeReason: '', remark: '每周三次，关联当前血透方案。', status: '有效' },
    { disease: '肾性贫血', doctor: '陈宁', confirmTime: '2026-04-12', closed: false, closeDoctor: '', closeTime: '', closeReason: '', remark: 'Hb 92 g/L，已生成贫血管理医嘱。', status: '观察' },
  ],
  primary: [
    { disease: '糖尿病肾病', doctor: '姜弱强', confirmTime: '2025-12-18', closed: false, closeDoctor: '', closeTime: '', closeReason: '', remark: '血糖和足部风险需随访。', status: '有效' },
    { disease: '高血压肾损害', doctor: '张明', confirmTime: '2025-12-18', closed: false, closeDoctor: '', closeTime: '', closeReason: '', remark: '透前血压偏高，联动干体重评估。', status: '有效' },
    { disease: '慢性肾小球肾炎待排', doctor: '陈宁', confirmTime: '2024-11-03', closed: true, closeDoctor: '姜弱强', closeTime: '2026-03-21', closeReason: '病理与随访证据不足', remark: '保留历史诊断，不再作为处方依据。', status: '已关闭' },
  ],
  pathology: [
    { disease: '糖尿病肾小球硬化', doctor: '姜弱强', confirmTime: '2025-08-10', closed: false, closeDoctor: '', closeTime: '', closeReason: '', remark: '外院病理摘要已上传。', status: '已归档' },
    { disease: '肾间质纤维化', doctor: '张明', confirmTime: '2025-08-10', closed: false, closeDoctor: '', closeTime: '', closeReason: '', remark: '病理附件待二次复核清晰度。', status: '待复核' },
    { disease: '免疫荧光 IgA 沉积', doctor: '陈宁', confirmTime: '2024-09-12', closed: true, closeDoctor: '张明', closeTime: '2026-02-16', closeReason: '与现病程相关性低', remark: '历史资料保留。', status: '已关闭' },
  ],
  complication: [
    { disease: '继发性甲状旁腺功能亢进', doctor: '陈宁', confirmTime: '2026-01-20', closed: false, closeDoctor: '', closeTime: '', closeReason: '', remark: 'PTH 520 pg/ml，需复查钙磷。', status: '有效' },
    { disease: '容量负荷过重', doctor: '张明', confirmTime: '2026-05-09', closed: false, closeDoctor: '', closeTime: '', closeReason: '', remark: '近3次透后血压偏高，干体重待评估。', status: '待处理' },
    { disease: '透析相关低血压', doctor: '姜弱强', confirmTime: '2026-03-22', closed: true, closeDoctor: '陈宁', closeTime: '2026-04-28', closeReason: '调整超滤后未再发生', remark: '关闭后继续趋势观察。', status: '已关闭' },
  ],
  infection: [
    { disease: '乙肝表面抗原阴性', doctor: '检验科刘', confirmTime: '2026-04-30', closed: false, closeDoctor: '', closeTime: '', closeReason: '', remark: '隔离分区无特殊要求。', status: '有效' },
    { disease: 'HCV抗体阴性', doctor: '检验科刘', confirmTime: '2026-04-30', closed: false, closeDoctor: '', closeTime: '', closeReason: '', remark: '下次筛查 2026-07-30。', status: '有效' },
    { disease: '导管出口感染风险', doctor: '孙涛', confirmTime: '2026-05-10', closed: false, closeDoctor: '', closeTime: '', closeReason: '', remark: '护士站已生成通路复评任务。', status: '观察' },
  ],
  tumor: [
    { disease: '肾囊肿术后', doctor: '张明', confirmTime: '2024-06-18', closed: false, closeDoctor: '', closeTime: '', closeReason: '', remark: '影像年度复查。', status: '随访' },
    { disease: '消化道肿瘤史否认', doctor: '陈宁', confirmTime: '2026-02-02', closed: false, closeDoctor: '', closeTime: '', closeReason: '', remark: '用于抗凝风险评估。', status: '有效' },
    { disease: '甲状腺结节', doctor: '姜弱强', confirmTime: '2025-10-12', closed: true, closeDoctor: '张明', closeTime: '2026-04-11', closeReason: '外院复查良性', remark: '保留报告附件。', status: '已关闭' },
  ],
  allergy: [
    { disease: '头孢类过敏', doctor: '导诊王敏', confirmTime: '2026-05-10', closed: false, closeDoctor: '', closeTime: '', closeReason: '', remark: '药房审方和护士执行强提醒。', status: '有效' },
    { disease: '造影剂过敏史', doctor: '陈宁', confirmTime: '2025-12-30', closed: false, closeDoctor: '', closeTime: '', closeReason: '', remark: '影像增强检查需医生复核。', status: '有效' },
    { disease: '青霉素过敏待确认', doctor: '导诊李倩', confirmTime: '2026-05-10', closed: true, closeDoctor: '张明', closeTime: '2026-05-12', closeReason: '家属补充无明确过敏史', remark: '关闭但保留导诊记录。', status: '已关闭' },
  ],
};

const tabRows: Record<string, PatientTabRow[]> = {
  plan: [
    { category: '透析处方', item: 'HD 4h / BFR 250ml/min / 透析液 500ml/min', currentObject: '周一三五 上午班 A08', status: '生效', owner: '张明', time: '2026-05-13', nextAction: '排班引用' },
    { category: '抗凝', item: '低分子肝素钙 4100AXaIU', currentObject: '当前方案', status: '待复核', owner: '陈宁', time: '2026-05-13', nextAction: '护士核对执行' },
    { category: '通路引用', item: '左前臂动静脉内瘘', currentObject: '使用中', status: '可用', owner: '孙涛', time: '2026-05-12', nextAction: '上机核对' },
  ],
  record: [
    { category: '治疗记录', item: '2026-05-15 上午班 A08', currentObject: '透前已评估，治疗中', status: '治疗中', owner: '周敏', time: '09:30', nextAction: '补记透中监测' },
    { category: '记录归档', item: '2026-05-13 HD记录单', currentObject: '医生/护士已签名', status: '已归档', owner: '陈宁', time: '2026-05-13', nextAction: '同步健康档案' },
    { category: '异常处理', item: '低血压 88/55mmHg', currentObject: '已补液并复测', status: '待医生确认', owner: '周敏', time: '2026-05-10', nextAction: '归档前确认' },
  ],
  visit: [
    { category: '门诊', item: '肾内门诊复查', currentObject: '血压和贫血管理', status: '已完成', owner: '张明', time: '2026-05-08', nextAction: '医嘱续开' },
    { category: '住院', item: '外院转入资料', currentObject: '出院小结已上传', status: '待复核', owner: '导诊王敏', time: '2026-05-09', nextAction: '同步电子病历' },
    { category: '随访', item: '透析后电话随访', currentObject: '头晕改善', status: '已记录', owner: '周敏', time: '2026-05-14', nextAction: '继续观察' },
  ],
  emr: [
    { category: '病程', item: '月度血透病程记录', currentObject: '贫血和容量评估', status: '待签名', owner: '张明', time: '2026-05-14', nextAction: '医生签名' },
    { category: '评估', item: '专科病情评估', currentObject: '充分性和干体重', status: '已提交', owner: '陈宁', time: '2026-05-13', nextAction: '生成建议' },
    { category: '知情同意', item: '血液透析治疗知情同意', currentObject: '患者端已签署', status: '已归档', owner: '导诊陈洁', time: '2026-05-10', nextAction: '预约准入通过' },
  ],
  orders: [
    { category: '长期医嘱', item: '碳酸镧咀嚼片 500mg tid', currentObject: 'CKD-MBD管理', status: '已审核', owner: '药师吴', time: '2026-05-13', nextAction: '护士执行宣教' },
    { category: '临时医嘱', item: '复查电解质+血常规', currentObject: '血钾/贫血复评', status: '待执行', owner: '周敏', time: '今日', nextAction: '采集送检' },
    { category: '血透专项', item: '下次透析目标超滤 2.2L', currentObject: '干体重调整', status: '待核对', owner: '陈宁', time: '2026-05-15', nextAction: '上机核对' },
  ],
  access: [
    { category: '当前通路', item: '左前臂动静脉内瘘', currentObject: '震颤可触及', status: '使用中', owner: '孙涛', time: '2026-05-12', nextAction: '穿刺点轮换' },
    { category: '通路评估', item: '通路流量 680ml/min', currentObject: '低于目标边缘', status: '观察', owner: '张明', time: '2026-05-10', nextAction: '充分性复评' },
    { category: '通路事件', item: '穿刺点渗血', currentObject: '压迫后缓解', status: '已处理', owner: '周敏', time: '2026-05-08', nextAction: '下次重点核对' },
    { category: '手术信息', item: '动静脉内瘘成形术', currentObject: '左侧 / 非本院手术', status: '正常', owner: '导诊台', time: '2026-05-21', nextAction: '登记手术信息' },
  ],
  analysis: [
    { category: '质量趋势', item: '近3月 Kt/V 1.28 -> 1.34 -> 1.22', currentObject: '低于目标', status: '关注', owner: '张明', time: '2026-05', nextAction: '生成CQI线索' },
    { category: '容量趋势', item: '透后血压偏高 3次', currentObject: '干体重或超滤策略', status: '待评估', owner: '陈宁', time: '近7天', nextAction: '调整干体重' },
    { category: '费用趋势', item: '本月费用 4280元', currentObject: '医保已同步', status: '正常', owner: '费用钱', time: '2026-05', nextAction: '月末核对' },
  ],
  anticoagulation: [
    { category: '抗凝方案', item: '低分子肝素钙 4100AXaIU 透前', currentObject: '当前处方', status: '生效', owner: '张明', time: '2026-05-13', nextAction: '护士执行' },
    { category: '凝血事件', item: '滤器 1级凝血', currentObject: '透中后段出现', status: '待复评', owner: '周敏', time: '2026-05-10', nextAction: '医生调整剂量' },
    { category: '出血风险', item: '穿刺点压迫延长', currentObject: '无活动性出血', status: '观察', owner: '孙涛', time: '2026-05-12', nextAction: '下次透前询问' },
  ],
  'dry-weight': [
    { category: '当前干体重', item: '62.5kg', currentObject: '近2周执行', status: '待评估', owner: '张明', time: '2026-05-14', nextAction: '结合血压调整' },
    { category: '调整记录', item: '63.0kg -> 62.5kg', currentObject: '水肿减轻', status: '已确认', owner: '陈宁', time: '2026-05-01', nextAction: '继续观察' },
    { category: '容量证据', item: '透前体重 65.1kg，目标超滤 2.4L', currentObject: '今日治疗', status: '上机核对', owner: '周敏', time: '今日', nextAction: '治疗记录引用' },
  ],
  lab: [
    { category: '检验结果', item: 'K+ 5.7 mmol/L，Hb 92 g/L', currentObject: '月度复查', status: '异常', owner: '检验科刘', time: '2026-05-14', nextAction: '医生解读' },
    { category: '危急值', item: '无当日危急值', currentObject: 'LIS同步', status: '已确认', owner: '张明', time: '今日', nextAction: '趋势观察' },
    { category: '标本链', item: '电解质/血常规', currentObject: '已采集已回报', status: '完整', owner: '周敏', time: '2026-05-14', nextAction: '归档报告' },
  ],
  imaging: [
    { category: '影像报告', item: '胸片：心影稍大', currentObject: 'PACS同步', status: '已归档', owner: '影像科李', time: '2026-05-06', nextAction: '医生解读' },
    { category: '通路超声', item: '内瘘流量偏低', currentObject: '外院报告', status: '待复核', owner: '孙涛', time: '2026-05-10', nextAction: '通路评估' },
    { category: '附件', item: '外院报告 2 张', currentObject: '患者上传', status: '待归档', owner: '导诊陈洁', time: '2026-05-11', nextAction: '补齐来源' },
  ],
  account: [
    { category: '费用账户', item: '余额 860元，欠费 0元', currentObject: '血透账户', status: '正常', owner: '费用钱', time: '今日', nextAction: '继续同步收费' },
    { category: '医保结算', item: '门慢备案有效至 2027-05-09', currentObject: '城镇医保', status: '已核验', owner: '导诊王敏', time: '2026-05-10', nextAction: '费用规则引用' },
    { category: '患者端账号', item: '手机号 138****6721', currentObject: '居家个人主页', status: '已启用', owner: '系统', time: '2026-05-10', nextAction: '接收提醒' },
  ],
  inventory: [
    { category: '药品消耗', item: '低分子肝素钙 LOT-LMWH260401', currentObject: '1支', status: '已扣减', owner: '药耗王', time: '2026-05-13', nextAction: '费用核对' },
    { category: '耗材消耗', item: '透析器 F16 / 管路 UDI-M-200004', currentObject: '1套', status: '已追溯', owner: '周敏', time: '2026-05-13', nextAction: '归档消耗' },
    { category: '退库', item: '未使用灌流器', currentObject: '临时改HD', status: '待复核', owner: '库管钱', time: '2026-05-10', nextAction: '退库签收' },
  ],
  adequacy: [
    { category: 'Kt/V', item: '1.22', currentObject: '低于 1.3', status: '未达标', owner: '张明', time: '2026-05', nextAction: '复查血流和通路' },
    { category: 'URR', item: '64%', currentObject: '低于 65%', status: '关注', owner: '陈宁', time: '2026-05', nextAction: '调整处方时长' },
    { category: '再循环', item: '疑似再循环 8%', currentObject: '通路流量偏低', status: '待确认', owner: '孙涛', time: '2026-05-10', nextAction: '通路超声复核' },
  ],
  'combined-treatment': [
    { category: 'HDF', item: '每月一次 HDF', currentObject: '容量和毒素管理', status: '已预约', owner: '导诊李倩', time: '2026-05-22', nextAction: '排班容量确认' },
    { category: 'HP', item: '血液灌流待评估', currentObject: '瘙痒/PTH偏高', status: '待医生确认', owner: '张明', time: '2026-05-15', nextAction: '处方审核' },
    { category: '特殊净化', item: 'CRRT备用方案', currentObject: '急诊预案', status: '备用', owner: '王主任', time: '2026-05', nextAction: '设备放行' },
  ],
  'identity-binding': [
    { category: '身份证', item: '350421196203166010', currentObject: '读卡核验', status: '已绑定', owner: '导诊王敏', time: '2026-05-10', nextAction: '签到引用' },
    { category: '人脸/腕带', item: '人脸模板+腕带码 WB-26051001', currentObject: '接诊设备', status: '已绑定', owner: '导诊陈洁', time: '2026-05-10', nextAction: '上机核对' },
    { category: 'IC卡', item: 'IC-HD-000621', currentObject: '患者卡', status: '已发卡', owner: '导诊李倩', time: '2026-05-10', nextAction: '刷卡签到' },
  ],
  'change-info': [
    { category: '主档变更', item: '联系电话更新', currentObject: '138****6721 -> 138****9910', status: '待复核', owner: '导诊王敏', time: '2026-05-15', nextAction: '复核后生效' },
    { category: '归属变更', item: '责任护士调整', currentObject: '赵玲 -> 周敏', status: '已生效', owner: '医务张洁', time: '2026-05-12', nextAction: '同步护士站' },
    { category: '处方变更', item: '目标超滤和抗凝剂量调整', currentObject: '医生签名', status: '已审计', owner: '张明', time: '2026-05-13', nextAction: '护士核对' },
  ],
};

const inventoryRows: InventoryRow[] = [
  { id: 'INV-D-001', kind: 'drug', warehouse: '血透药房', medicalRecordNo: 'MZ2026051001', selfPrepared: '否', itemName: '低分子肝素钙注射液', quantity: '1支', batchNo: 'LMWH260401', expireDate: '2026-12-31', genericName: '低分子肝素钙', spec: '0.4ml:4100AXaIU', formOrModel: '注射液', usage: '透前抗凝', status: '已扣减', owner: '药耗王' },
  { id: 'INV-D-002', kind: 'drug', warehouse: '血透药房', medicalRecordNo: 'MZ2026051001', selfPrepared: '否', itemName: '促红素注射液', quantity: '1支', batchNo: 'EPO260501', expireDate: '2027-03-20', genericName: '重组人促红素', spec: '4000IU/支', formOrModel: '注射液', usage: '贫血治疗', status: '待核对', owner: '药师吴' },
  { id: 'INV-D-003', kind: 'drug', warehouse: '患者自备药柜', medicalRecordNo: 'MZ2026051001', selfPrepared: '是', itemName: '碳酸镧咀嚼片', quantity: '7片', batchNo: 'LAN260228', expireDate: '2027-02-28', genericName: '碳酸镧', spec: '500mg*20片', formOrModel: '片剂', usage: '降磷治疗', status: '已追溯', owner: '责任护士周敏' },
  { id: 'INV-D-004', kind: 'drug', warehouse: '血透药房', medicalRecordNo: 'MZ2026051001', selfPrepared: '否', itemName: '蔗糖铁注射液', quantity: '1支', batchNo: 'IRON260318', expireDate: '2026-09-30', genericName: '蔗糖铁', spec: '100mg/5ml', formOrModel: '注射液', usage: '补铁治疗', status: '退库待复核', owner: '库管钱' },
  { id: 'INV-M-001', kind: 'material', warehouse: '血透耗材库', medicalRecordNo: 'MZ2026051001', selfPrepared: '否', itemName: '高通量透析器', quantity: '1支', batchNo: 'F16-260501', expireDate: '2028-05-01', genericName: '透析器', spec: 'F16 / 1.6m2', formOrModel: '高通量', usage: 'HD治疗', status: '已扣减', owner: '护士周敏' },
  { id: 'INV-M-002', kind: 'material', warehouse: '血透耗材库', medicalRecordNo: 'MZ2026051001', selfPrepared: '否', itemName: '成人血液透析管路', quantity: '1套', batchNo: 'LINE260428', expireDate: '2028-04-28', genericName: '血路管', spec: '成人标准型', formOrModel: 'A/V管路', usage: '上机连接', status: '已追溯', owner: '护士周敏' },
  { id: 'INV-M-003', kind: 'material', warehouse: '血透耗材库', medicalRecordNo: 'MZ2026051001', selfPrepared: '否', itemName: '内瘘穿刺针', quantity: '2支', batchNo: 'NEEDLE260330', expireDate: '2027-10-31', genericName: '穿刺针', spec: '16G', formOrModel: '锐针', usage: '内瘘穿刺', status: '已扣减', owner: '护士周敏' },
  { id: 'INV-M-004', kind: 'material', warehouse: '隔离耗材柜', medicalRecordNo: 'MZ2026051001', selfPrepared: '否', itemName: '血液灌流器', quantity: '1支', batchNo: 'HP260115', expireDate: '2027-01-15', genericName: '灌流器', spec: 'HA130', formOrModel: '树脂吸附', usage: '临时改HD未使用', status: '退库待复核', owner: '库管钱' },
];

const currentInventoryRows = computed(() => inventoryRows.filter((row) => row.kind === activeInventoryKind.value));

const adequacyRows = ref<AdequacyRecord[]>([
  {
    id: 'ADEQ-20260521-001',
    dialysisDate: '2026-05-21',
    ktv: '1.22',
    urr: '64',
    preBeta2: '29.6',
    postBeta2: '18.4',
    beta2Clearance: '37.8',
    preUrea: '23.4',
    postUrea: '8.4',
    preCreatinine: '905',
    postCreatinine: '512',
    durationHour: '4',
    durationMinute: '0',
    preWeight: '73.1',
    postWeight: '71.8',
    ultrafiltration: '1.3',
    status: '未达标',
    owner: '张明',
    nextAction: '复查血流和通路',
  },
  {
    id: 'ADEQ-20260514-001',
    dialysisDate: '2026-05-14',
    ktv: '1.34',
    urr: '68',
    preBeta2: '27.8',
    postBeta2: '16.2',
    beta2Clearance: '41.7',
    preUrea: '21.8',
    postUrea: '7.0',
    preCreatinine: '884',
    postCreatinine: '498',
    durationHour: '4',
    durationMinute: '0',
    preWeight: '72.8',
    postWeight: '71.4',
    ultrafiltration: '1.4',
    status: '达标',
    owner: '陈宁',
    nextAction: '维持当前处方',
  },
  {
    id: 'ADEQ-20260428-001',
    dialysisDate: '2026-04-28',
    ktv: '1.28',
    urr: '65',
    preBeta2: '28.5',
    postBeta2: '17.6',
    beta2Clearance: '38.2',
    preUrea: '22.6',
    postUrea: '7.9',
    preCreatinine: '892',
    postCreatinine: '506',
    durationHour: '4',
    durationMinute: '0',
    preWeight: '72.6',
    postWeight: '71.2',
    ultrafiltration: '1.4',
    status: '关注',
    owner: '张明',
    nextAction: '观察下月趋势',
  },
]);

const combinedTreatmentRows = ref<CombinedTreatmentRow[]>([
  {
    id: 'CT-20260522-001',
    treatmentDate: '2026-05-22',
    modes: ['HDF', '腹膜透析'],
    remark: '每月一次 HDF，联动容量和毒素控制；腹膜透析用于特殊协同评估。',
    status: '已预约',
    owner: '导诊李倩',
    time: '2026-05-21 14:10',
    nextAction: '排班容量确认',
    linkedSource: '治疗申请 + 医生处方',
  },
  {
    id: 'CT-20260515-001',
    treatmentDate: '2026-05-15',
    modes: ['HP'],
    remark: '血液灌流待评估，瘙痒与 PTH 偏高。',
    status: '待医生确认',
    owner: '张明',
    time: '2026-05-15 09:20',
    nextAction: '处方审核',
    linkedSource: '医生评估 + 检验结果',
  },
  {
    id: 'CT-20260512-001',
    treatmentDate: '2026-05-12',
    modes: ['CRRT', '特殊净化'],
    remark: '急诊备用方案，优先占用备用设备与隔离机位。',
    status: '备用',
    owner: '王主任',
    time: '2026-05-12 08:55',
    nextAction: '设备放行',
    linkedSource: '急诊预案 + 设备状态',
  },
  {
    id: 'CT-20260508-001',
    treatmentDate: '2026-05-08',
    modes: ['灌流'],
    remark: '按周追踪毒素清除与症状缓解。',
    status: '已执行',
    owner: '周敏',
    time: '2026-05-08 10:30',
    nextAction: '进入费用和归档',
    linkedSource: '执行记录 + 耗材消耗',
  },
]);

const current = computed(() => selected.value ?? rows.value[0]);
const currentLabReports = computed(() => labReports.value.filter((item) => item.source === activeLabSource.value));
const currentLabReport = computed(() => currentLabReports.value.find((item) => item.id === selectedLabReportId.value) ?? currentLabReports.value[0] ?? labReports.value[0]);

const dialysisRecordRows: DialysisRecordRow[] = [];

const currentCombinedTreatmentRows = computed(() =>
  combinedTreatmentRows.value.filter(
    (row) => row.treatmentDate >= combinedTreatmentAppliedRange.value[0] && row.treatmentDate <= combinedTreatmentAppliedRange.value[1],
  ),
);
const combinedTreatmentReservedCount = computed(() => currentCombinedTreatmentRows.value.filter((row) => row.status === '已预约').length);
const combinedTreatmentExecutedCount = computed(() => currentCombinedTreatmentRows.value.filter((row) => row.status === '已执行').length);
const combinedTreatmentPagedRows = computed(() => {
  const start = (combinedTreatmentPage.value - 1) * combinedTreatmentPageSize.value;
  return currentCombinedTreatmentRows.value.slice(start, start + combinedTreatmentPageSize.value);
});

const currentAdequacyRows = computed(() =>
  adequacyRows.value.filter((row) => row.dialysisDate >= adequacyAppliedRange.value[0] && row.dialysisDate <= adequacyAppliedRange.value[1]),
);
const adequacyPagedRows = computed(() => {
  const start = (adequacyPage.value - 1) * adequacyPageSize.value;
  return currentAdequacyRows.value.slice(start, start + adequacyPageSize.value);
});
const currentAdequacyRecord = computed(() => {
  const editingRow = adequacyRows.value.find((row) => row.id === adequacyEditingId.value);

  return editingRow ?? currentAdequacyRows.value[0] ?? adequacyRows.value[0];
});
const adequacyTargetSummary = computed(() => {
  const lowKtvCount = currentAdequacyRows.value.filter((row) => Number(row.ktv) < 1.2).length;
  const lowUrrCount = currentAdequacyRows.value.filter((row) => Number(row.urr) < 65).length;

  return {
    total: currentAdequacyRows.value.length,
    lowKtvCount,
    lowUrrCount,
    latestStatus: currentAdequacyRecord.value?.status ?? '待录入',
  };
});

const anticoagulationRecords = ref<AnticoagulationRecord[]>([
  {
    id: 'ANT-20260521-001',
    dialysisDate: '2026-05-21',
    shift: '上午班',
    bedNo: 'A08',
    anticoagulantName: '低分子肝素钙注射液 4100AXaIU',
    firstDose: '4100AXaIU',
    additionalDose: '0',
    additionalTime: '-',
    totalDose: '4100AXaIU',
    adjustmentReason: '沿用长期处方，透前无活动性出血',
    adjuster: '张明',
    executionStatus: '已执行',
    clottingLevel: '0级',
    bleedingRisk: '低',
    linkedOrder: 'MO-20260510-004',
    batchNo: 'LMWH260401',
    nextSuggestion: '下次继续原方案，护士站上机前核对穿刺点',
  },
  {
    id: 'ANT-20260519-001',
    dialysisDate: '2026-05-19',
    shift: '上午班',
    bedNo: 'A08',
    anticoagulantName: '低分子肝素钙注射液 4100AXaIU',
    firstDose: '4100AXaIU',
    additionalDose: '0',
    additionalTime: '-',
    totalDose: '4100AXaIU',
    adjustmentReason: '滤器通畅，维持原剂量',
    adjuster: '陈宁',
    executionStatus: '已归档',
    clottingLevel: '0级',
    bleedingRisk: '低',
    linkedOrder: 'RX-20260510-001',
    batchNo: 'LMWH260401',
    nextSuggestion: '持续观察透后压迫时间',
  },
  {
    id: 'ANT-20260517-001',
    dialysisDate: '2026-05-17',
    shift: '上午班',
    bedNo: 'A08',
    anticoagulantName: '普通肝素',
    firstDose: '2500IU',
    additionalDose: '500IU',
    additionalTime: '2小时后',
    totalDose: '3000IU',
    adjustmentReason: '透中后段滤器1级凝血，追加后血路通畅',
    adjuster: '周敏',
    executionStatus: '待医生复评',
    clottingLevel: '1级',
    bleedingRisk: '中',
    linkedOrder: 'MO-20260517-006',
    batchNo: 'HEP260318',
    nextSuggestion: '医生复评下次是否改回低分子肝素或调整首剂',
  },
  {
    id: 'ANT-20260515-001',
    dialysisDate: '2026-05-15',
    shift: '上午班',
    bedNo: 'A10',
    anticoagulantName: '无肝素',
    firstDose: '0',
    additionalDose: '0',
    additionalTime: '-',
    totalDose: '0',
    adjustmentReason: '穿刺点渗血后短期观察，改无肝素并加强冲洗',
    adjuster: '张明',
    executionStatus: '已归档',
    clottingLevel: '1级',
    bleedingRisk: '高',
    linkedOrder: 'RX-20260515-003',
    batchNo: '-',
    nextSuggestion: '出血风险下降后恢复低剂量抗凝',
  },
  {
    id: 'ANT-20260513-001',
    dialysisDate: '2026-05-13',
    shift: '上午班',
    bedNo: 'A08',
    anticoagulantName: '枸橼酸抗凝',
    firstDose: '4%枸橼酸 120ml',
    additionalDose: '80ml',
    additionalTime: '持续泵入',
    totalDose: '200ml',
    adjustmentReason: '凝血功能异常，按特殊净化方案执行',
    adjuster: '陈宁',
    executionStatus: '已归档',
    clottingLevel: '0级',
    bleedingRisk: '中',
    linkedOrder: 'RX-20260513-009',
    batchNo: 'CIT260221',
    nextSuggestion: '复查钙离子，必要时调整泵入速度',
  },
]);
const currentAnticoagulationRecord = computed(() => anticoagulationRecords.value.find((item) => item.id === selectedAnticoagulationId.value) ?? anticoagulationRecords.value[0]);
const anticoagulationForm = ref<AnticoagulationFormState>({
  dialysisDate: '2026-05-21',
  shift: '上午班',
  bedNo: 'A08',
  anticoagulantName: '低分子肝素钙注射液 4100AXaIU',
  firstDose: '4100AXaIU',
  additionalDose: '0',
  additionalTime: '-',
  totalDose: '4100AXaIU',
  adjustmentReason: '沿用长期处方，透前无活动性出血',
  adjuster: '张明',
  executionStatus: '待执行',
  clottingLevel: '0级',
  bleedingRisk: '低',
  linkedOrder: 'MO-20260510-004',
  batchNo: 'LMWH260401',
  nextSuggestion: '下次继续原方案，护士站上机前核对穿刺点',
});
const anticoagulationStats = computed(() => [
  { label: '记录数', value: anticoagulationRecords.value.length },
  { label: '本月调整', value: anticoagulationRecords.value.filter((item) => item.adjustmentReason.includes('调整') || item.adjustmentReason.includes('改')).length },
  { label: '凝血事件', value: anticoagulationRecords.value.filter((item) => item.clottingLevel !== '0级').length },
  { label: '高出血风险', value: anticoagulationRecords.value.filter((item) => item.bleedingRisk === '高').length },
]);

const analysisMetricSpecs: Record<AnalysisMetricKey, AnalysisMetricSpec> = {
  weight: {
    label: '体重',
    columns: [
      { prop: 'date', label: '透析日期', minWidth: 120 },
      { prop: 'dryWeight', label: '干体重', minWidth: 110 },
      { prop: 'preWeight', label: '透前体重', minWidth: 110 },
      { prop: 'postWeight', label: '透后体重', minWidth: 110 },
    ],
    rows: [
      { id: 'AN-W-001', date: '2026-05-21', dryWeight: '62.5kg', preWeight: '65.1kg', postWeight: '62.8kg' },
      { id: 'AN-W-002', date: '2026-05-19', dryWeight: '62.5kg', preWeight: '64.8kg', postWeight: '62.6kg' },
      { id: 'AN-W-003', date: '2026-05-17', dryWeight: '62.8kg', preWeight: '65.0kg', postWeight: '63.0kg' },
      { id: 'AN-W-004', date: '2026-05-15', dryWeight: '62.8kg', preWeight: '64.3kg', postWeight: '62.7kg' },
    ],
  },
  idwg: {
    label: 'IDWG',
    columns: [
      { prop: 'date', label: '透析日期', minWidth: 120 },
      { prop: 'dryWeight', label: '干体重', minWidth: 110 },
      { prop: 'idwgRate', label: 'IDWG%', minWidth: 110 },
      { prop: 'idwg', label: 'IDWG', minWidth: 110 },
    ],
    rows: [
      { id: 'AN-I-001', date: '2026-05-21', dryWeight: '62.5kg', idwgRate: '4.2%', idwg: '2.6kg' },
      { id: 'AN-I-002', date: '2026-05-19', dryWeight: '62.5kg', idwgRate: '3.7%', idwg: '2.3kg' },
      { id: 'AN-I-003', date: '2026-05-17', dryWeight: '62.8kg', idwgRate: '4.5%', idwg: '2.8kg' },
      { id: 'AN-I-004', date: '2026-05-15', dryWeight: '62.8kg', idwgRate: '3.0%', idwg: '1.9kg' },
    ],
  },
  bp: {
    label: '血压',
    columns: [
      { prop: 'date', label: '透析日期', minWidth: 120 },
      { prop: 'preSys', label: '透前收缩压', minWidth: 120 },
      { prop: 'preDia', label: '透前舒张压', minWidth: 120 },
      { prop: 'postSys', label: '透后收缩压', minWidth: 120 },
      { prop: 'postDia', label: '透后舒张压', minWidth: 120 },
    ],
    rows: [
      { id: 'AN-B-001', date: '2026-05-21', preSys: '196', preDia: '102', postSys: '142', postDia: '84' },
      { id: 'AN-B-002', date: '2026-05-19', preSys: '184', preDia: '98', postSys: '138', postDia: '82' },
      { id: 'AN-B-003', date: '2026-05-17', preSys: '176', preDia: '94', postSys: '136', postDia: '80' },
      { id: 'AN-B-004', date: '2026-05-15', preSys: '170', preDia: '92', postSys: '130', postDia: '78' },
    ],
  },
  'heart-rate': {
    label: '心率',
    columns: [
      { prop: 'date', label: '透析日期', minWidth: 160 },
      { prop: 'heartRate', label: '心率', minWidth: 240 },
    ],
    rows: [
      { id: 'AN-H-001', date: '2026-05-21', heartRate: '78 bpm' },
      { id: 'AN-H-002', date: '2026-05-19', heartRate: '81 bpm' },
      { id: 'AN-H-003', date: '2026-05-17', heartRate: '76 bpm' },
      { id: 'AN-H-004', date: '2026-05-15', heartRate: '79 bpm' },
    ],
  },
  'blood-flow': {
    label: '血流量',
    columns: [
      { prop: 'date', label: '透析日期', minWidth: 160 },
      { prop: 'bloodFlow', label: '血流量', minWidth: 240 },
    ],
    rows: [
      { id: 'AN-F-001', date: '2026-05-21', bloodFlow: '240 ml/min' },
      { id: 'AN-F-002', date: '2026-05-19', bloodFlow: '230 ml/min' },
      { id: 'AN-F-003', date: '2026-05-17', bloodFlow: '250 ml/min' },
      { id: 'AN-F-004', date: '2026-05-15', bloodFlow: '240 ml/min' },
    ],
  },
};
const analysisMetricTabs = Object.entries(analysisMetricSpecs).map(([name, spec]) => ({
  name: name as AnalysisMetricKey,
  label: spec.label,
}));
const currentAnalysisMetric = computed(() => analysisMetricSpecs[activeAnalysisMetric.value]);
const currentAnalysisRows = computed(() => (analysisQueried.value ? currentAnalysisMetric.value.rows : []));

const outpatientVisitRows: VisitRecordRow[] = [
  {
    visitDate: '2026-05-19',
    visitNo: '23',
    hisBedNo: '123',
    hisRecordNo: '23',
    department: '123',
    source: '人为录入',
    createdAt: '2026-05-19 20:47',
    status: '已记录',
  },
];

const inpatientVisitRows: VisitRecordRow[] = [
  {
    visitDate: '2026-05-16',
    visitNo: 'ZY20260516008',
    hisBedNo: 'A-08',
    hisRecordNo: 'HIS-260516-08',
    department: '肾内科血液净化中心',
    source: 'HIS同步',
    createdAt: '2026-05-16 09:20',
    status: '已同步',
  },
];

const makeBasicInfoForm = (patient: PatientRecord): BasicInfoForm => ({
  outpatientNo: patient.outpatientNo,
  followNo: patient.followNo,
  name: patient.name,
  gender: patient.gender,
  age: patient.age,
  nation: '汉族',
  idType: '中华人民共和国居民身份证',
  idCard: patient.idCard,
  phone: patient.phone,
  insurance: patient.insurance,
  insuranceNo: patient.followNo,
  firstDialysis: patient.firstDialysis,
  firstAdmission: patient.firstDialysis,
  latestAdmission: '2026-05-13',
  doctor: '暂未分配',
  nurse: '暂未分配',
  hospitalDept: patient.hospitalDept,
  education: patient.education,
  profession: patient.profession,
  marriage: patient.marriage,
  bodyHeight: patient.bodyHeight,
  allergy: patient.allergy,
  drugAllergy: patient.drugAllergy,
  patientTags: '暂无标签',
  remark: patient.remark,
  attachments: '身份证、医保凭证、外院透析资料',
});

function makeBlankBasicInfoForm(): BasicInfoForm {
  return {
    outpatientNo: '',
    followNo: '',
    name: '',
    gender: '男',
    age: '',
    nation: '汉族',
    idType: '中华人民共和国居民身份证',
    idCard: '',
    phone: '',
    insurance: '',
    insuranceNo: '',
    firstDialysis: '',
    firstAdmission: '',
    latestAdmission: '',
    doctor: '',
    nurse: '',
    hospitalDept: '血液净化中心',
    education: '',
    profession: '',
    marriage: '',
    bodyHeight: '',
    allergy: '',
    drugAllergy: '',
    patientTags: '',
    remark: '',
    attachments: '',
  };
}

function buildPatientFromBasicForm(form: BasicInfoForm, source: string): PatientRecord {
  return {
    no: form.followNo || `P${Date.now()}`,
    name: form.name,
    sexAge: `${form.gender} / ${form.age || '未填'}岁`,
    gender: form.gender,
    age: form.age || '0',
    idCard: form.idCard,
    phone: form.phone,
    insurance: form.insurance || '待补充',
    outpatientNo: form.outpatientNo || `OUT${Date.now()}`,
    followNo: form.followNo || `SFG-${String(rows.value.length + 1).padStart(4, '0')}`,
    customerType: '导诊建档',
    followName: form.name,
    ckdStage: '待评估',
    treatmentStatus: '建档中',
    firstDialysis: form.firstDialysis || '待补充',
    hospitalDept: form.hospitalDept || '血液净化中心',
    bodyHeight: form.bodyHeight || '待补充',
    education: form.education || '待补充',
    profession: form.profession || '待补充',
    marriage: form.marriage || '待补充',
    allergy: form.allergy || '无',
    drugAllergy: form.drugAllergy || '无',
    remark: `${form.remark || '导诊建档'}（来源：${source}）`,
    status: source === 'HIS关联导入' ? '资料待补' : '建档中',
    owner: current.value.owner,
    updatedAt: '2026-05-25 18:00',
    nextAction: source === 'HIS关联导入' ? '核验差异并签约' : '进入签约',
  };
}

const basicForm = ref<BasicInfoForm>(makeBasicInfoForm(seedRows[0]));

const diagnosisRows = ref<Record<string, DiagnosisRow[]>>(
  Object.fromEntries(
    Object.entries(diagnosisRowsByTab).map(([name, rows]) => [
      name,
      rows.map((row, index) => ({ ...row, id: `${name}-${index}` })),
    ]),
  ),
);
const editingDiagnosisIds = ref<Set<string>>(new Set());
const currentDiagnosisRows = computed(() => diagnosisRows.value[activeDiagnosisTab.value] ?? []);
const currentTab = computed(() => detailTabs.find((item) => item.name === activeTab.value) ?? detailTabs[0]);
const currentVisitRows = computed(() => (activeVisitKind.value === 'outpatient' ? outpatientVisitRows : inpatientVisitRows));
const latestVisit = computed(() => currentVisitRows.value[0]);
const orderRows = ref<Record<'long' | 'temp', OrderTabRow[]>>({
  long: [
    { selected: true, orderSource: '血透', textMode: false, selfPay: false, category: '耗材项目', itemName: '', dosage: '', dosageUnit: '', quantity: '3', quantityUnit: '', usage: '', orderContent: '3', drip: '', frequency: '', executePlan: '点击设置执行计划', status: '待审核' },
    { selected: false, orderSource: '药品', textMode: true, selfPay: false, category: '药品项目', itemName: '', dosage: '', dosageUnit: '', quantity: '', quantityUnit: '', usage: '', orderContent: '', drip: '', frequency: '', executePlan: '点击设置执行计划', status: '待执行' },
    { selected: true, orderSource: '血透', textMode: false, selfPay: false, category: '诊疗项目', itemName: '', dosage: '', dosageUnit: '', quantity: '2', quantityUnit: '', usage: '', orderContent: '2', drip: '', frequency: '', executePlan: '点击设置执行计划', status: '待执行' },
    { selected: false, orderSource: '药品', textMode: false, selfPay: true, category: '药品项目', itemName: '', dosage: '', dosageUnit: '', quantity: '1', quantityUnit: '', usage: '', orderContent: '1', drip: '', frequency: '', executePlan: '点击设置执行计划', status: '已停医嘱' },
  ],
  temp: [
    { selected: true, orderSource: '血透', textMode: false, selfPay: false, category: '药品项目', itemName: '', dosage: '', dosageUnit: '', quantity: '', quantityUnit: '', usage: '', orderContent: '', drip: '', frequency: '', executePlan: '点击设置执行计划', status: '待审核' },
  ],
});
const currentOrderRows = computed(() => orderRows.value[activeOrderTerm.value]);
const activeLongPlanSections = computed(() => {
  if (activePlanMode.value === 'HDF方案') return hdfDialysisPlanSections;
  if (activePlanMode.value === 'HD+HP方案') return hdHpDialysisPlanSections;
  if (activePlanMode.value === 'CRRT方案') return crrtDialysisPlanSections;
  return dialysisPlanSections;
});
const currentTempPlanOptions = computed(() => {
  if (activePlanMode.value === 'HDF方案') return hdfTempPlanOptions;
  if (activePlanMode.value === 'HD+HP方案') return hdHpTempPlanOptions;
  if (activePlanMode.value === 'CRRT方案') return crrtTempPlanOptions;
  return tempPlanOptions;
});
const currentTempPlanList = computed(() => {
  if (activePlanMode.value === 'HDF方案') return hdfTempPlanList;
  if (activePlanMode.value === 'HD+HP方案') return hdHpTempPlanList;
  if (activePlanMode.value === 'CRRT方案') return crrtTempPlanList;
  return tempPlanList;
});
const vascularAccessFields = computed<DialysisPlanField[]>(() =>
  Array.from({ length: vascularAccessFieldCount.value }, (_, index) => ({
    label: index === 0 ? '血管通路' : `血管通路${index + 1}`,
    value: index === 0
      ? (activePlanTerm.value === 'temp' ? '' : (['HDF方案', 'HD+HP方案', 'CRRT方案'].includes(activePlanMode.value) ? '右侧前臂移植物动静脉内瘘' : '左侧前臂自体动静脉内瘘'))
      : '',
    placeholder: '请选择血管通路',
    type: 'select',
    options: vascularAccessOptions,
    required: index === 0,
    addable: index === vascularAccessFieldCount.value - 1,
  })),
);
const expandAccessFields = (sections: DialysisPlanSection[]) =>
  sections.map((section) => (section.title === '血透通路' ? { ...section, fields: vascularAccessFields.value } : section));
const visibleDialysisPlanSections = computed(() => {
  if (activePlanTerm.value === 'temp' && tempPlanFormVisible.value) {
    if (activePlanMode.value === 'HDF方案') return expandAccessFields(hdfTempDialysisPlanSections);
    if (activePlanMode.value === 'HD+HP方案') return expandAccessFields(hdHpTempDialysisPlanSections);
    if (activePlanMode.value === 'CRRT方案') return expandAccessFields(crrtTempDialysisPlanSections);
    return expandAccessFields(tempDialysisPlanSections);
  }
  return expandAccessFields(activeLongPlanSections.value);
});

const timeline = computed<TimelineStep[]>(() => [
  {
    time: '2026-05-10 08:42',
    title: '完成患者建档',
    desc: `${current.value.name} 主档、身份证、电话和医保信息已录入`,
    status: 'success',
  },
  {
    time: '2026-05-10 09:00',
    title: '资料核验',
    desc: '联系人、证件附件和医保备案等待复核',
    status: current.value.status === '资料待补' ? 'warning' : 'info',
  },
  {
    time: '2026-05-10 09:40',
    title: '签约/归属/预约',
    desc: '通过后进入签约、责任分配和治疗预约闭环',
    status: current.value.status === '在管' ? 'success' : 'warning',
  },
]);

const activeTables = computed(() => {
  const tabMap: Record<string, string[]> = {
    basic: ['patient_master', 'patient_contact', 'patient_insurance', 'patient_contract', 'patient_follow_alias'],
    diagnosis: ['patient_diagnosis', 'base_diagnosis', 'medical_record', 'clinical_assessment', 'sys_audit_log'],
    plan: ['dialysis_prescription', 'patient_assignment', 'appointment', 'vascular_access', 'dialysis_schedule'],
    record: ['treatment_session', 'dialysis_record_sheet', 'treatment_parameter', 'archive_review', 'signature_record'],
    visit: ['clinical_encounter', 'service_request', 'appointment', 'medical_record'],
    emr: ['medical_record', 'patient_consent', 'health_report', 'record_version_history', 'signature_record'],
    orders: ['medical_order', 'medical_order_detail', 'order_review_log', 'order_execution_plan'],
    access: ['vascular_access', 'vascular_access_assessment', 'puncture_record', 'vascular_access_event'],
    analysis: ['treatment_session', 'lab_result_item', 'efficacy_evaluation', 'alert_event', 'report_metric_value'],
    anticoagulation: ['anticoagulation_record', 'dialysis_prescription', 'medical_order', 'order_execution', 'medication_consumption', 'alert_event'],
    'dry-weight': ['clinical_observation', 'pre_treatment_assessment', 'post_treatment_assessment', 'dialysis_prescription'],
    lab: ['lab_order', 'specimen_record', 'lab_report', 'lab_result_item', 'critical_value_record'],
    imaging: ['exam_order', 'pacs_report', 'lab_report_attachment', 'medical_record'],
    account: ['patient_account_balance', 'charge_detail', 'his_charge_sync', 'patient_portal_account'],
    inventory: ['stock_lot', 'stock_transaction', 'medication_consumption', 'material_consumption', 'charge_detail'],
    adequacy: ['lab_result_item', 'efficacy_evaluation', 'dialysis_prescription', 'vascular_access_assessment'],
    'combined-treatment': ['service_request', 'dialysis_prescription', 'treatment_session', 'material_consumption'],
    'identity-binding': ['patient_master', 'patient_portal_account', 'face_verify_record', 'checkin_record'],
    'change-info': ['sys_audit_log', 'assignment_change_log', 'record_version_history', 'execution_correction'],
  };

  return tabMap[activeTab.value] ?? tabMap.basic;
});

function tagType(status: string): 'success' | 'warning' | 'danger' | 'info' {
  if (['在管', '已核验', '已授权', '已签约', '审核通过', '已预约', '有效', '生效', '可用', '已归档', '已记录', '已审核', '已提交', '已处理', '已确认', '正常', '已扣减', '已追溯', '已绑定', '已发卡', '已审计', '完整', '达标'].includes(status)) return 'success';
  if (['待确认', '建档中', '资料待补', '待复核', '待补证', '待审核', '待执行', '待核对', '待评估', '待处理', '观察', '关注', '随访', '备用', '上机核对', '退库待复核'].includes(status)) return 'warning';
  if (['退出待归档', '已解约', '退回修改', '暂停', '异常', '未达标'].includes(status)) return 'danger';
  return 'info';
}

function selectRow(row: PatientRecord): void {
  selected.value = row;
  basicEditing.value = false;
  basicForm.value = makeBasicInfoForm(row);
}

function openCreatePatient(): void {
  patientDrawerMode.value = 'create';
  selected.value = null;
  basicEditing.value = true;
  basicForm.value = makeBlankBasicInfoForm();
  patientDrawerVisible.value = true;
}

function openEditPatient(row: PatientRecord = current.value): void {
  patientDrawerMode.value = 'edit';
  selected.value = row;
  basicEditing.value = true;
  basicForm.value = makeBasicInfoForm(row);
  patientDrawerVisible.value = true;
}

function toggleOrderTerm(term: 'long' | 'temp'): void {
  activeOrderTerm.value = term;
}

function switchAnalysisMetric(metric: AnalysisMetricKey): void {
  activeAnalysisMetric.value = metric;
}

function queryAnalysisMetric(): void {
  analysisQueried.value = true;
  submitAction(`${currentAnalysisMetric.value.label}趋势查询完成`);
}

function printAnalysisMetric(): void {
  submitAction(`${currentAnalysisMetric.value.label}分析页打印任务已生成`);
}

function formatCombinedModes(modes: string[]): string {
  return modes.join(' / ');
}

function openCombinedTreatmentDialog(mode: 'create' | 'edit', row?: CombinedTreatmentRow): void {
  combinedTreatmentDialogMode.value = mode;
  combinedTreatmentEditingId.value = row?.id ?? '';
  combinedTreatmentForm.value = {
    treatmentDate: row?.treatmentDate ?? combinedTreatmentDateRange.value[1],
    modes: row?.modes?.length ? [...row.modes] : ['腹膜透析'],
    remark: row?.remark ?? '',
  };
  combinedTreatmentDialogVisible.value = true;
}

function queryCombinedTreatment(): void {
  combinedTreatmentAppliedRange.value = [...combinedTreatmentDateRange.value];
  combinedTreatmentPage.value = 1;
  submitAction(`合并治疗已查询：${combinedTreatmentAppliedRange.value[0]} 至 ${combinedTreatmentAppliedRange.value[1]}`);
}

function resetCombinedTreatmentFilter(): void {
  combinedTreatmentDateRange.value = ['2026-02-21', '2026-05-21'];
  combinedTreatmentAppliedRange.value = ['2026-02-21', '2026-05-21'];
  combinedTreatmentPage.value = 1;
  submitAction('合并治疗筛选已重置');
}

function makeAdequacyForm(record?: AdequacyRecord): AdequacyFormState {
  const target = record ?? currentAdequacyRecord.value;

  return {
    dialysisDate: target?.dialysisDate ?? '2026-05-21',
    ktv: target?.ktv ?? '',
    urr: target?.urr ?? '',
    preBeta2: target?.preBeta2 ?? '',
    postBeta2: target?.postBeta2 ?? '',
    beta2Clearance: target?.beta2Clearance ?? '',
    preUrea: target?.preUrea ?? '',
    postUrea: target?.postUrea ?? '',
    preCreatinine: target?.preCreatinine ?? '',
    postCreatinine: target?.postCreatinine ?? '',
    durationHour: target?.durationHour ?? '',
    durationMinute: target?.durationMinute ?? '',
    preWeight: target?.preWeight ?? '',
    postWeight: target?.postWeight ?? '',
    ultrafiltration: target?.ultrafiltration ?? '',
  };
}

function getAdequacyStatus(record: Pick<AdequacyFormState, 'ktv' | 'urr'>): string {
  if (Number(record.ktv) < 1.2) return '未达标';
  if (Number(record.urr) < 65) return '关注';
  return '达标';
}

function queryAdequacy(): void {
  adequacyAppliedRange.value = [...adequacyDateRange.value];
  adequacyPage.value = 1;
  submitAction(`血透充分性已查询：${adequacyAppliedRange.value[0]} 至 ${adequacyAppliedRange.value[1]}`);
}

function openAdequacyDialog(mode: 'create' | 'edit', row?: AdequacyRecord): void {
  adequacyDialogMode.value = mode;
  adequacyEditingId.value = row?.id ?? '';
  adequacyForm.value = makeAdequacyForm(mode === 'edit' ? row : undefined);
  if (mode === 'create') {
    adequacyForm.value = {
      ...adequacyForm.value,
      dialysisDate: adequacyDateRange.value[1],
      ktv: '',
      urr: '',
      preUrea: '',
      postUrea: '',
      preCreatinine: '',
      postCreatinine: '',
    };
  }
  adequacyDialogVisible.value = true;
}

function saveAdequacyDialog(): void {
  const status = getAdequacyStatus(adequacyForm.value);
  const nextRecord: AdequacyRecord = {
    id:
      adequacyDialogMode.value === 'edit' && adequacyEditingId.value
        ? adequacyEditingId.value
        : `ADEQ-${adequacyForm.value.dialysisDate.replace(/-/g, '')}-${String(adequacyRows.value.length + 1).padStart(3, '0')}`,
    ...adequacyForm.value,
    status,
    owner: current.value.owner,
    nextAction: status === '达标' ? '维持当前处方' : '回写医生站处方调整和CQI复查',
  };

  if (adequacyDialogMode.value === 'edit' && adequacyEditingId.value) {
    adequacyRows.value = adequacyRows.value.map((row) => (row.id === adequacyEditingId.value ? nextRecord : row));
  } else {
    adequacyRows.value = [nextRecord, ...adequacyRows.value];
  }

  adequacyDialogVisible.value = false;
  adequacyPage.value = 1;
  submitAction('血透充分性记录已保存，已输出达标判定、复查任务和处方调整线索');
}

function saveCombinedTreatmentDialog(): void {
  const payload: CombinedTreatmentRow = {
    id:
      combinedTreatmentEditingId.value ||
      `CT-${combinedTreatmentForm.value.treatmentDate.replace(/-/g, '')}-${String(combinedTreatmentRows.value.length + 1).padStart(3, '0')}`,
    treatmentDate: combinedTreatmentForm.value.treatmentDate,
    modes: [...combinedTreatmentForm.value.modes],
    remark: combinedTreatmentForm.value.remark.trim(),
    status: combinedTreatmentDialogMode.value === 'edit' ? '已更新' : '已新增',
    owner: current.value.owner,
    time: '2026-05-21 18:40',
    nextAction: '进入排班容量、护士执行、费用和归档',
    linkedSource: '治疗申请 + 医生处方 + 设备状态',
  };

  if (combinedTreatmentDialogMode.value === 'edit' && combinedTreatmentEditingId.value) {
    combinedTreatmentRows.value = combinedTreatmentRows.value.map((row) => (row.id === combinedTreatmentEditingId.value ? payload : row));
  } else {
    combinedTreatmentRows.value = [payload, ...combinedTreatmentRows.value];
  }

  combinedTreatmentDialogVisible.value = false;
  combinedTreatmentPage.value = 1;
  submitAction('合并治疗记录已保存，已回写到排班容量和治疗闭环');
}

function makeAnticoagulationForm(record?: AnticoagulationRecord): AnticoagulationFormState {
  const target = record ?? currentAnticoagulationRecord.value;

  return {
    dialysisDate: target?.dialysisDate ?? '2026-05-21',
    shift: target?.shift ?? '上午班',
    bedNo: target?.bedNo ?? 'A08',
    anticoagulantName: target?.anticoagulantName ?? '低分子肝素钙注射液 4100AXaIU',
    firstDose: target?.firstDose ?? '',
    additionalDose: target?.additionalDose ?? '0',
    additionalTime: target?.additionalTime ?? '-',
    totalDose: target?.totalDose ?? '',
    adjustmentReason: target?.adjustmentReason ?? '',
    adjuster: target?.adjuster ?? current.value.owner,
    executionStatus: target?.executionStatus ?? '待执行',
    clottingLevel: target?.clottingLevel ?? '0级',
    bleedingRisk: target?.bleedingRisk ?? '低',
    linkedOrder: target?.linkedOrder ?? '',
    batchNo: target?.batchNo ?? '',
    nextSuggestion: target?.nextSuggestion ?? '',
  };
}

function openAnticoagulationDialog(mode: 'create' | 'edit', record?: AnticoagulationRecord): void {
  anticoagulationDialogMode.value = mode;
  if (record) selectedAnticoagulationId.value = record.id;
  anticoagulationForm.value = makeAnticoagulationForm(mode === 'edit' ? record : undefined);
  if (mode === 'create') {
    anticoagulationForm.value = {
      ...anticoagulationForm.value,
      dialysisDate: '2026-05-21',
      executionStatus: '待执行',
      adjustmentReason: '',
      nextSuggestion: '',
    };
  }
  anticoagulationDialogVisible.value = true;
}

function selectAnticoagulationRecord(row: AnticoagulationRecord): void {
  selectedAnticoagulationId.value = row.id;
}

function saveAnticoagulationRecord(): void {
  const nextRecord: AnticoagulationRecord = {
    id: anticoagulationDialogMode.value === 'edit' ? selectedAnticoagulationId.value : `ANT-${Date.now()}`,
    ...anticoagulationForm.value,
  };

  if (anticoagulationDialogMode.value === 'edit') {
    anticoagulationRecords.value = anticoagulationRecords.value.map((item) => (item.id === selectedAnticoagulationId.value ? nextRecord : item));
  } else {
    selectedAnticoagulationId.value = nextRecord.id;
    anticoagulationRecords.value = [nextRecord, ...anticoagulationRecords.value];
  }

  anticoagulationDialogVisible.value = false;
  submitAction('抗凝剂记录已保存，已回写医嘱执行、药耗消耗、治疗记录和风险预警');
}

function toggleBasicEdit(): void {
  if (!basicEditing.value) {
    basicForm.value = makeBasicInfoForm(current.value);
    basicEditing.value = true;
    return;
  }

  Object.assign(current.value, {
    outpatientNo: basicForm.value.outpatientNo,
    followNo: basicForm.value.followNo,
    name: basicForm.value.name,
    gender: basicForm.value.gender,
    age: basicForm.value.age,
    sexAge: `${basicForm.value.gender} / ${basicForm.value.age}岁`,
    idCard: basicForm.value.idCard,
    phone: basicForm.value.phone,
    insurance: basicForm.value.insurance,
    firstDialysis: basicForm.value.firstDialysis,
    hospitalDept: basicForm.value.hospitalDept,
    education: basicForm.value.education,
    profession: basicForm.value.profession,
    marriage: basicForm.value.marriage,
    bodyHeight: basicForm.value.bodyHeight,
    allergy: basicForm.value.allergy,
    drugAllergy: basicForm.value.drugAllergy,
    remark: basicForm.value.remark,
    updatedAt: '2026-05-19 10:30',
  });

  basicEditing.value = false;
  submitAction('基本信息已保存，患者主档同步更新');
}

function addDiagnosisRow(): void {
  const tab = activeDiagnosisTab.value;
  const rows = diagnosisRows.value[tab] ?? [];
  const newRow: DiagnosisRow = {
    id: `${tab}-${Date.now()}`,
    disease: '',
    doctor: '',
    confirmTime: '',
    closed: false,
    closeDoctor: '',
    closeTime: '',
    closeReason: '',
    remark: '',
    status: '草稿',
  };

  diagnosisRows.value = {
    ...diagnosisRows.value,
    [tab]: [...rows, newRow],
  };
  editingDiagnosisIds.value = new Set([...editingDiagnosisIds.value, newRow.id ?? '']);
  submitAction('已新增一行诊断草稿，可补全后保存');
}

function addVascularAccessField(): void {
  vascularAccessFieldCount.value += 1;
  submitAction('已新增血管通路下拉框，可继续选择备用或临时通路');
}

function addAccessReminderNode(): void {
  accessDialogReminderRows.value = [
    ...accessDialogReminderRows.value,
    {
      nodeName: '新增提醒节点',
      remindTime: '2026-05-21 12:00',
      handled: '否',
      handler: '',
      handledTime: '',
    },
  ];
  submitAction('已新增关键节点提醒，后续可补录处理人和处理时间');
}

function getEmptyAccessForm(): AccessFormState {
  return {
    surgeryName: '',
    surgeryDate: '2026-05-21',
    firstUseDate: '',
    side: '左',
    accessType: '自体动静脉内瘘',
    status: '正常',
    nonHospitalSurgery: false,
    registerSurgeryInfo: false,
    remark: '',
    puncturePlan: '',
    puncturePlanNote: '',
  };
}

function openAccessDialog(mode: 'create' | 'edit', record?: AccessRecord): void {
  accessDialogMode.value = mode;
  const target = record ?? currentAccessRecord.value;
  accessDialogSelectedId.value = target?.id ?? 'access-001';
  accessDialogReminderRows.value = target?.reminders.map((item) => ({ ...item })) ?? [];
  accessForm.value = target
    ? {
        surgeryName: target.surgeryName,
        surgeryDate: target.surgeryDate,
        firstUseDate: target.firstUseDate,
        side: target.side,
        accessType: target.accessType,
        status: target.status,
        nonHospitalSurgery: target.nonHospitalSurgery,
        registerSurgeryInfo: target.registerSurgeryInfo,
        remark: target.remark,
        puncturePlan: target.puncturePlan,
        puncturePlanNote: target.puncturePlanNote,
      }
    : getEmptyAccessForm();
  accessDialogVisible.value = true;
}

function getEmptyRepairForm(): RepairFormState {
  return {
    surgeryName: '',
    accessName: '',
    problem: '',
    repairDate: '2026-05-21',
    surgeon: '',
    bUltrasoundDoctor: '',
    assistantDoctor: '',
    nurse: '',
    currentAvailable: false,
    availableDate: '',
    nonHospitalRepair: false,
    remark: '',
  };
}

function openRepairDialog(mode: 'create' | 'edit', record?: RepairRecord): void {
  repairDialogMode.value = mode;
  const target = record ?? visibleRepairTableRows.value[0];
  repairDialogSelectedId.value = target?.id ?? '';
  repairForm.value = target
    ? {
        surgeryName: target.surgeryName,
        accessName: target.accessName,
        problem: target.problem,
        repairDate: target.repairDate,
        surgeon: target.surgeon,
        bUltrasoundDoctor: target.bUltrasoundDoctor,
        assistantDoctor: target.assistantDoctor,
        nurse: target.nurse,
        currentAvailable: target.currentAvailable,
        availableDate: target.availableDate,
        nonHospitalRepair: target.nonHospitalRepair,
        remark: target.remark,
      }
    : getEmptyRepairForm();
  repairDialogVisible.value = true;
}

function saveRepairDialog(): void {
  const nextAvailableDate = repairForm.value.currentAvailable
    ? repairForm.value.availableDate || repairForm.value.repairDate
    : repairForm.value.availableDate;
  const baseRow: RepairRecord = {
    id: repairDialogSelectedId.value || `repair-${Date.now()}`,
    surgeryName: repairForm.value.surgeryName || '通路修复',
    accessName: repairForm.value.accessName || currentAccessRecord.value.accessTitle,
    problem: repairForm.value.problem || '未填写',
    repairDate: repairForm.value.repairDate,
    surgeon: repairForm.value.surgeon || current.value.owner,
    bUltrasoundDoctor: repairForm.value.bUltrasoundDoctor || '待补充',
    assistantDoctor: repairForm.value.assistantDoctor || '待补充',
    nurse: repairForm.value.nurse || '待补充',
    currentAvailable: repairForm.value.currentAvailable,
    availableDate: nextAvailableDate,
    nonHospitalRepair: repairForm.value.nonHospitalRepair,
    remark: repairForm.value.remark,
    createdAt: '2026-05-21 18:30',
    owner: current.value.owner,
  };

  if (repairDialogMode.value === 'edit') {
    repairRecords.value = repairRecords.value.map((record) => (record.id === baseRow.id ? { ...record, ...baseRow } : record));
  } else {
    repairRecords.value = [baseRow, ...repairRecords.value];
    repairDialogSelectedId.value = baseRow.id;
  }

  repairDialogVisible.value = false;
  submitAction(`通路修复${repairDialogMode.value === 'edit' ? '更新' : '新增'}已保存，已同步到医生站、护士站和感控记录`);
}

function addRepairProblem(): void {
  const nextProblem = `问题${repairProblemOptions.value.length + 1}`;
  repairProblemOptions.value = [...repairProblemOptions.value, nextProblem];
  repairForm.value.problem = nextProblem;
  submitAction('已新增通路问题选项');
}

function saveAccessDialog(): void {
  const baseRecord = {
    surgeryName: accessForm.value.surgeryName,
    surgeryDate: accessForm.value.surgeryDate,
    firstUseDate: accessForm.value.firstUseDate,
    side: accessForm.value.side,
    accessType: accessForm.value.accessType,
    status: accessForm.value.status,
    nonHospitalSurgery: accessForm.value.nonHospitalSurgery,
    registerSurgeryInfo: accessForm.value.registerSurgeryInfo,
    remark: accessForm.value.remark,
    puncturePlan: accessForm.value.puncturePlan,
    puncturePlanNote: accessForm.value.puncturePlanNote,
    owner: current.value.owner,
    updatedAt: '2026-05-21 18:30',
    nextAction: accessForm.value.status === '失去功能' ? '归档追溯' : '上机核对',
    reminderCount: String(accessDialogReminderRows.value.length),
    riskLevel: accessForm.value.status === '正常' ? '低风险' : accessForm.value.status === '未成熟' ? '观察' : accessForm.value.status === '修复中' ? '中风险' : '已退出',
    firstUseGap: accessForm.value.firstUseDate || accessForm.value.surgeryDate,
    surgeryGap: accessForm.value.surgeryDate,
    useDuration: accessForm.value.firstUseDate ? '更新后待复核' : '待填写',
    createdTime: '2026-05-21 18:30',
    accessTitle: `${accessForm.value.side === '右' ? '右' : '左'}${accessForm.value.accessType ? `侧${accessForm.value.accessType}` : '侧通路'}`,
    accessSummary: accessForm.value.remark || accessForm.value.puncturePlanNote || '已更新通路信息',
    reminders: accessDialogReminderRows.value.map((item) => ({ ...item })),
  };

  if (accessDialogMode.value === 'edit') {
    accessRecords.value = accessRecords.value.map((record) =>
      record.id === accessDialogSelectedId.value ? { ...record, ...baseRecord, id: record.id } : record,
    );
  } else {
    const id = `access-${Date.now()}`;
    accessDialogSelectedId.value = id;
    accessRecords.value = [
      {
        id,
        ...baseRecord,
      },
      ...accessRecords.value,
    ];
  }

  accessDialogVisible.value = false;
  submitAction(`通路${accessDialogMode.value === 'edit' ? '更新' : '新增'}已保存，已同步到医生站、护士站和上机核对`);
}

function openAccessRecord(row: AccessRecord): void {
  openAccessDialog('edit', row);
}

function resetChangeRecordForm(): ChangeRecordFormState {
  return {
    changeDate: '2026-05-21',
    eventType: '主档变更',
    originalStatus: '放弃治疗',
    changeStatus: '血透',
    changeReason: '联系电话更新并补充患者端身份核验',
    remark: '同步患者中心、导诊台和责任护士消息',
    nextChangeDate: '2026-05-28',
    owner: '导诊王敏',
    status: '待复核',
  };
}

function openChangeRecordDialog(mode: 'create' | 'edit', row?: ChangeRecordRow): void {
  changeRecordDialogMode.value = mode;
  const target = row ?? currentChangeRecord.value;
  selectedChangeRecordId.value = target?.id ?? changeRecordRows.value[0]?.id ?? 'change-001';
  changeRecordForm.value = target
    ? {
        changeDate: target.changeDate,
        eventType: target.eventType,
        originalStatus: target.originalStatus,
        changeStatus: target.changeStatus,
        changeReason: target.changeReason,
        remark: target.remark,
        nextChangeDate: target.remark.match(/(\d{4}-\d{2}-\d{2})/)?.[1] ?? '2026-05-28',
        owner: target.owner,
        status: target.status,
      }
    : resetChangeRecordForm();
  changeRecordDialogVisible.value = true;
}

function saveChangeRecordDialog(): void {
  const nextChangeDateText = changeRecordForm.value.nextChangeDate ? `下次变更日期：${changeRecordForm.value.nextChangeDate}` : '下次变更日期：待补充';
  const baseRow: ChangeRecordRow = {
    id: selectedChangeRecordId.value || `change-${Date.now()}`,
    changeDate: changeRecordForm.value.changeDate,
    eventType: changeRecordForm.value.eventType,
    originalStatus: changeRecordForm.value.originalStatus,
    changeStatus: changeRecordForm.value.changeStatus,
    changeReason: changeRecordForm.value.changeReason,
    remark: changeRecordForm.value.remark ? `${changeRecordForm.value.remark}${changeRecordForm.value.remark.includes('下次变更日期') ? '' : `；${nextChangeDateText}`}` : nextChangeDateText,
    createdAt: '2026-05-21 18:30',
    owner: changeRecordForm.value.owner,
    status: changeRecordForm.value.status,
    nextAction: changeRecordForm.value.status === '已生效' ? '同步责任团队' : '复核后生效',
  };

  if (changeRecordDialogMode.value === 'edit') {
    changeRecordRows.value = changeRecordRows.value.map((row) => (row.id === baseRow.id ? { ...row, ...baseRow } : row));
  } else {
    changeRecordRows.value = [baseRow, ...changeRecordRows.value];
    selectedChangeRecordId.value = baseRow.id;
  }

  changeRecordDialogVisible.value = false;
  submitAction(`变更记录${changeRecordDialogMode.value === 'edit' ? '更新' : '新增'}已保存，已回写审计链`);
}

function deleteChangeRecord(row: ChangeRecordRow): void {
  changeRecordRows.value = changeRecordRows.value.filter((item) => item.id !== row.id);
  if (selectedChangeRecordId.value === row.id) {
    selectedChangeRecordId.value = changeRecordRows.value[0]?.id ?? '';
  }
  submitAction('变更记录已删除，已保留删除审计');
}

function selectChangeRecord(row: ChangeRecordRow): void {
  selectedChangeRecordId.value = row.id;
}

function switchAccessSubTab(tab: AccessSubTab): void {
  activeAccessSubTab.value = tab;
}

function switchIdentityBindingTab(tab: IdentityBindingKind): void {
  identityBindingActiveTab.value = tab;
  selectedIdentityBindingId.value =
    tab === 'card'
      ? 'identity-card-001'
      : tab === 'barcode'
        ? 'identity-barcode-001'
        : 'identity-face-001';
}

function openIdentityBindingDialog(kind: IdentityBindingKind, mode: 'create' | 'edit' = 'edit'): void {
  identityBindingActiveTab.value = kind;
  identityBindingDialogMode.value = mode;
  selectedIdentityBindingId.value =
    kind === 'card'
      ? 'identity-card-001'
      : kind === 'barcode'
        ? 'identity-barcode-001'
        : 'identity-face-001';
  identityBindingDialogVisible.value = true;
}

function saveIdentityBindingDialog(): void {
  const nextRecord: IdentityBindingItem =
    identityBindingActiveTab.value === 'card'
      ? {
          id: selectedIdentityBindingId.value,
          kind: 'card',
          title: '透析卡',
          value: identityBindingForm.value.cardNo,
          useStatus: identityBindingForm.value.useStatus,
          owner: current.value.owner,
          createdAt: identityBindingForm.value.createdAt,
          remark: identityBindingForm.value.remark,
          nextAction: '支持签到和出入机核对',
        }
      : identityBindingActiveTab.value === 'barcode'
        ? {
            id: selectedIdentityBindingId.value,
            kind: 'barcode',
            title: '条形码',
            value: identityBindingForm.value.barcodeContent,
            useStatus: '已绑定',
            owner: current.value.owner,
            createdAt: currentIdentityBindingRecord.value.createdAt,
            remark: identityBindingForm.value.barcodeSpec,
            nextAction: '打印后同步签到终端',
            previewText: identityBindingForm.value.barcodeText,
          }
        : {
            id: selectedIdentityBindingId.value,
            kind: 'face',
            title: '人脸信息',
            value: currentIdentityBindingRecord.value.value,
            useStatus: identityBindingForm.value.faceStatus,
            owner: current.value.owner,
            createdAt: currentIdentityBindingRecord.value.createdAt,
            remark: identityBindingForm.value.faceRemark,
            nextAction: '可用于签到与患者端登录',
            source: identityBindingForm.value.faceSource,
            faces: currentIdentityBindingRecord.value.faces ?? ['正脸', '左侧脸', '右侧脸', '眨眼活体', '戴口罩复核'],
          };

  identityBindingRecords.value = identityBindingRecords.value.map((record) => (record.id === nextRecord.id ? { ...record, ...nextRecord } : record));
  identityBindingDialogVisible.value = false;
  submitAction(`${nextRecord.title}${identityBindingDialogMode.value === 'edit' ? '已更新' : '已新增'}，已同步签到和患者端引用`);
}

function switchPlanMode(mode: string): void {
  activePlanMode.value = mode;
  vascularAccessFieldCount.value = 1;
  if (!['HD方案', 'HDF方案'].includes(mode)) {
    activePlanTerm.value = 'long';
    tempPlanFormVisible.value = false;
  }
  selectedTempPlanId.value = '';
}

function toggleLongPlanEdit(): void {
  if (!longPlanEditing.value) {
    longPlanEditing.value = true;
    return;
  }

  longPlanEditing.value = false;
  submitAction('长期血透方案已保存');
}

function cancelLongPlanEdit(): void {
  longPlanEditing.value = false;
  submitAction('已取消长期方案编辑');
}

function showTempPlanList(): void {
  activePlanTerm.value = 'temp';
  tempPlanFormVisible.value = false;
}

function showLongPlanForm(): void {
  activePlanTerm.value = 'long';
  tempPlanFormVisible.value = false;
}

function createTempPlan(): void {
  activePlanTerm.value = 'temp';
  if (activePlanMode.value === 'HDF方案') {
    selectedTempPlanId.value = '何亚春202605191810HDF临时方案';
  } else if (activePlanMode.value === 'HD+HP方案') {
    selectedTempPlanId.value = '何亚春202605191835HD+HP临时方案';
  } else if (activePlanMode.value === 'CRRT方案') {
    selectedTempPlanId.value = '何亚春202605191848CRRT临时方案';
  } else {
    selectedTempPlanId.value = tempPlanOptions[0];
  }
  tempPlanFormVisible.value = true;
  submitAction(`已进入新建${activePlanMode.value.replace('方案', '')}临时方案表单`);
}

function openTempPlan(planName?: string): void {
  activePlanTerm.value = 'temp';
  selectedTempPlanId.value = planName ?? currentTempPlanOptions.value[0] ?? '';
  tempPlanFormVisible.value = true;
}

function isDiagnosisEditing(row: DiagnosisRow): boolean {
  return Boolean(row.id && editingDiagnosisIds.value.has(row.id));
}

function toggleDiagnosisEdit(row: DiagnosisRow): void {
  if (!row.id) return;
  const nextIds = new Set(editingDiagnosisIds.value);

  if (nextIds.has(row.id)) {
    nextIds.delete(row.id);
    row.status = row.status === '草稿' ? '待复核' : row.status;
    submitAction('诊断行已保存，等待复核或同步医生站');
  } else {
    nextIds.add(row.id);
  }

  editingDiagnosisIds.value = nextIds;
}

function openPatient(row?: PatientRecord): void {
  if (row) {
    openEditPatient(row);
    return;
  }

  openCreatePatient();
}

function openContact(row?: PatientRecord): void {
  selected.value = row ?? current.value;
  contactDrawerVisible.value = true;
}

function openCertificate(row?: PatientRecord): void {
  selected.value = row ?? current.value;
  certificateDrawerVisible.value = true;
}

function openDeath(row?: PatientRecord): void {
  selected.value = row ?? current.value;
  deathDialogVisible.value = true;
}

function openExit(row?: PatientRecord): void {
  selected.value = row ?? current.value;
  exitDialogVisible.value = true;
}

function openContract(row?: PatientRecord): void {
  selected.value = row ?? current.value;
  contractDialogVisible.value = true;
}

function openAssignment(row?: PatientRecord): void {
  selected.value = row ?? current.value;
  assignmentDialogVisible.value = true;
}

function openAppointment(row?: PatientRecord): void {
  selected.value = row ?? current.value;
  appointmentDialogVisible.value = true;
}

function openTrace(row?: PatientRecord): void {
  selected.value = row ?? current.value;
  traceDrawerVisible.value = true;
}

function openDryWeightDialog(): void {
  dryWeightDialogVisible.value = true;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}

function savePatientDrawer(): void {
  const record = buildPatientFromBasicForm(basicForm.value, patientDrawerMode.value === 'create' ? '人工建档' : '导诊编辑');

  if (patientDrawerMode.value === 'create') {
    createdPatientRows.value = [record, ...createdPatientRows.value];
    selected.value = record;
  } else if (selected.value) {
    Object.assign(selected.value, record);
    basicForm.value = makeBasicInfoForm(selected.value);
  }

  patientDrawerVisible.value = false;
  basicEditing.value = false;
  submitAction(`${patientDrawerMode.value === 'create' ? '患者建档' : '患者主档更新'}已保存，后续可继续签约、HIS关联或归属分配`);
}

function openHisImport(): void {
  hisImportDialogVisible.value = true;
}

function openBatchImport(): void {
  batchImportDialogVisible.value = true;
}

function openExportDialog(): void {
  exportDialogVisible.value = true;
}

function importHisPatient(row: PatientRecord): void {
  const next = buildPatientFromBasicForm(makeBasicInfoForm(row), 'HIS关联导入');
  next.followNo = row.followNo;
  next.outpatientNo = row.outpatientNo;
  next.status = '资料待补';
  next.nextAction = '核验差异并签约';
  createdPatientRows.value = [next, ...createdPatientRows.value];
  selected.value = next;
  hisImportDialogVisible.value = false;
  submitAction('HIS患者已关联导入到患者中心，等待资料核验和签约');
}

function confirmBatchImport(): void {
  const nextRows = [
    buildPatientFromBasicForm(
      {
        ...makeBlankBasicInfoForm(),
        name: '批量导入患者',
        gender: '女',
        age: '57',
        idCard: '440103196805120024',
        phone: '13900001234',
        insurance: '职工医保',
        outpatientNo: `BULK-${Date.now()}`,
        followNo: `SFG-B${String(rows.value.length + 1).padStart(4, '0')}`,
        firstDialysis: '2026-05-25',
        hospitalDept: '血液净化中心',
        education: '中专',
        profession: '退休',
        marriage: '已婚',
        allergy: '无',
        drugAllergy: '无',
        patientTags: '批量导入',
        remark: 'Excel模板导入',
        attachments: '导入清单',
      },
      'Excel批量导入',
    ),
  ];

  createdPatientRows.value = [...nextRows, ...createdPatientRows.value];
  batchImportDialogVisible.value = false;
  submitAction('批量导入已完成，成功数据已进入患者中心，失败行可导出查看');
}
</script>

<template>
  <section class="guide-patient-page">
    <section class="guide-shell-card">
      <el-row :gutter="16" class="guide-workspace-grid">
        <el-col :xs="24" :lg="4" class="guide-left-column">
          <el-card class="guide-list-card" shadow="never">
            <template v-if="false" #header>
              <div class="guide-card-header">
                <div>
                  <strong>患者列表（139人）</strong>
                  <p>当前导诊待处理、在管和退出归档患者。</p>
                </div>
                <el-tag type="primary" effect="plain">导诊台</el-tag>
              </div>
            </template>

            <el-input class="guide-list-search" placeholder="搜索姓名、病案号、手机号" clearable>
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>

            <div class="guide-list">
              <button
                v-for="row in rows"
                :key="row.no"
                class="guide-list-item"
                :class="{ active: row.no === current.no }"
                type="button"
                @click="selectRow(row)"
              >
                <div class="guide-list-avatar">
                  <el-icon><User /></el-icon>
                </div>
                <div class="guide-list-body">
                  <div class="guide-list-head">
                    <strong>{{ row.name }}</strong>
                    <el-tag size="small" effect="plain" :type="row.customerType.includes('透') ? 'primary' : 'success'">
                      {{ row.customerType.includes('透') ? '血透' : row.customerType }}
                    </el-tag>
                  </div>
                  <div class="guide-list-meta">
                    <span>{{ row.sexAge }}</span>
                    <span>{{ row.insurance }}</span>
                  </div>
                </div>
              </button>
            </div>

            <div class="guide-pager">
              <el-pagination layout="prev, pager, next" :page-size="8" :total="139" />
              <span>共 139 人</span>
            </div>
          </el-card>
        </el-col>

        <el-col :xs="24" :lg="20" class="guide-right-column">
          <el-card class="guide-detail-card" shadow="never">
            <template #header>
              <div class="guide-patient-head">
                <div class="guide-patient-avatar">
                  <el-icon><User /></el-icon>
                </div>
                <div class="guide-patient-main">
                  <div class="guide-patient-title">
                    <strong>{{ current.name }}</strong>
                    <span>{{ current.age }}岁</span>
                    <span>{{ current.gender }}</span>
                  </div>
                  <div class="guide-patient-subtitle">
                    <span>病案号：{{ current.outpatientNo }}</span>
                    <span>血透号：{{ current.followNo }}</span>
                    <span>性别：{{ current.gender }}</span>
                    <span>年龄：{{ current.age }}岁</span>
                    <span>医保：{{ current.insurance }}</span>
                  </div>
                </div>
                <div class="guide-patient-actions">
                  <template v-if="activeTab === 'emr'">
                    <el-button color="#ed7b22" @click="openContract(current)">发卡</el-button>
                    <el-button type="primary" @click="submitAction('电子病历已提交归档，输出到审计和患者健康档案')">归档</el-button>
                  </template>
                  <template v-else>
                    <el-button :icon="Message" @click="openContact(current)">联系人</el-button>
                    <el-button :icon="Files" @click="openCertificate(current)">证件</el-button>
                    <el-button :icon="Warning" @click="openExit(current)">退出</el-button>
                    <el-button type="primary" :icon="Check" @click="openContract(current)">发卡</el-button>
                  </template>
                </div>
              </div>
            </template>

            <el-tabs v-model="activeTab" class="guide-tabs">
              <el-tab-pane v-for="tab in detailTabs" :key="tab.name" :label="tab.label" :name="tab.name">
                <template #label>
                  <span class="guide-tab-label">{{ tab.label }}</span>
                </template>

                <section v-if="tab.name === 'basic'" class="guide-basic-panel">
                  <div class="guide-basic-title">
                    <strong>基本信息</strong>
                    <el-button type="primary" :icon="basicEditing ? CircleCheck : EditPen" @click="toggleBasicEdit">
                      {{ basicEditing ? '保存' : '编辑' }}
                    </el-button>
                  </div>

                  <div class="guide-basic-grid">
                    <div class="guide-basic-form">
                      <div class="guide-form-grid">
                        <div class="guide-basic-avatar-box">
                          <div class="guide-avatar-frame">
                            <el-icon><User /></el-icon>
                          </div>
                          <el-button text>上传头像</el-button>
                        </div>
                        <div class="guide-form-item"><label>病案号</label><el-input v-model="basicForm.outpatientNo" :disabled="!basicEditing" /></div>
                        <div class="guide-form-item"><label>血透号</label><el-input v-model="basicForm.followNo" :disabled="!basicEditing" /></div>
                        <div class="guide-form-item"><label>患者姓名</label><el-input v-model="basicForm.name" :disabled="!basicEditing" /></div>
                        <div class="guide-form-item"><label>性别</label><el-select v-model="basicForm.gender" :disabled="!basicEditing"><el-option label="男" value="男" /><el-option label="女" value="女" /></el-select></div>
                        <div class="guide-form-item"><label>年龄</label><el-input v-model="basicForm.age" :disabled="!basicEditing" /></div>
                        <div class="guide-form-item"><label>民族</label><el-input v-model="basicForm.nation" :disabled="!basicEditing" /></div>
                        <div class="guide-form-item"><label>证件类型</label><el-select v-model="basicForm.idType" :disabled="!basicEditing"><el-option label="中华人民共和国居民身份证" value="中华人民共和国居民身份证" /></el-select></div>
                        <div class="guide-form-item"><label>证件号</label><el-input v-model="basicForm.idCard" :disabled="!basicEditing" /></div>
                        <div class="guide-form-item"><label>手机号码</label><el-input v-model="basicForm.phone" :disabled="!basicEditing" /></div>
                        <div class="guide-form-item"><label>医保类型</label><el-input v-model="basicForm.insurance" :disabled="!basicEditing" /></div>
                        <div class="guide-form-item"><label>医保卡号</label><el-input v-model="basicForm.insuranceNo" :disabled="!basicEditing" /></div>
                        <div class="guide-form-item"><label>医保状态</label><el-tag type="success" effect="plain">已认证</el-tag></div>
                        <div class="guide-form-item"><label>首次血透日期</label><el-input v-model="basicForm.firstDialysis" :disabled="!basicEditing" /></div>
                        <div class="guide-form-item"><label>首次入院日期</label><el-input v-model="basicForm.firstAdmission" :disabled="!basicEditing" /></div>
                        <div class="guide-form-item"><label>最近入院日期</label><el-input v-model="basicForm.latestAdmission" :disabled="!basicEditing" /></div>
                        <div class="guide-form-item"><label>CKD分期</label><el-tag type="danger" effect="plain">{{ current.ckdStage }}</el-tag></div>
                        <div class="guide-form-item"><label>治疗状态</label><el-tag type="primary" effect="plain">{{ current.treatmentStatus }}</el-tag></div>
                        <div class="guide-form-item"><label>签约状态</label><el-tag type="success" effect="plain">已签约</el-tag></div>
                        <div class="guide-form-item"><label>责任医生</label><el-input v-model="basicForm.doctor" :disabled="!basicEditing" /></div>
                        <div class="guide-form-item"><label>责任护士</label><el-input v-model="basicForm.nurse" :disabled="!basicEditing" /></div>
                        <div class="guide-form-item"><label>主诊科室</label><el-input v-model="basicForm.hospitalDept" :disabled="!basicEditing" /></div>
                        <div class="guide-form-item"><label>教育程度</label><el-input v-model="basicForm.education" :disabled="!basicEditing" /></div>
                        <div class="guide-form-item"><label>职业</label><el-input v-model="basicForm.profession" :disabled="!basicEditing" /></div>
                        <div class="guide-form-item"><label>婚姻状态</label><el-input v-model="basicForm.marriage" :disabled="!basicEditing" /></div>
                        <div class="guide-form-item"><label>身高(cm)</label><el-input v-model="basicForm.bodyHeight" :disabled="!basicEditing" /></div>
                        <div class="guide-form-item"><label>过敏史</label><el-input v-model="basicForm.allergy" :disabled="!basicEditing" /></div>
                        <div class="guide-form-item"><label>药物过敏</label><el-input v-model="basicForm.drugAllergy" :disabled="!basicEditing" /></div>
                        <div class="guide-form-item"><label>患者标签</label><el-input v-model="basicForm.patientTags" :disabled="!basicEditing" /></div>
                        <div class="guide-form-item"><label>病情备注</label><el-input v-model="basicForm.remark" type="textarea" :rows="2" :disabled="!basicEditing" /></div>
                        <div class="guide-form-item guide-form-item-wide"><label>附件</label><el-input v-model="basicForm.attachments" :disabled="!basicEditing" /></div>
                      </div>

                      <div class="guide-basic-section">
                        <div class="guide-section-title">
                          <strong>患者标签与资料完整性</strong>
                          <el-tag type="success" effect="plain">完整率 92%</el-tag>
                        </div>
                        <div class="guide-chip-row">
                          <el-tag type="primary" effect="plain">规律血透</el-tag>
                          <el-tag type="warning" effect="plain">医保备案待复核</el-tag>
                          <el-tag type="danger" effect="plain">CKD {{ current.ckdStage }}</el-tag>
                          <el-tag effect="plain">责任团队待确认</el-tag>
                        </div>
                      </div>

                      <div class="guide-basic-section">
                        <div class="guide-section-title">
                          <strong>联系人</strong>
                          <el-button link :icon="Message" @click="openContact(current)">维护联系人</el-button>
                        </div>
                        <el-table :data="contactRows" size="small" border>
                          <el-table-column prop="name" label="联系人" min-width="110" />
                          <el-table-column prop="relationship" label="与患者关系" min-width="110" />
                          <el-table-column prop="fixedPhone" label="固定号码" min-width="130" />
                          <el-table-column prop="mobile" label="手机号码" min-width="130" />
                          <el-table-column prop="authorization" label="授权范围" min-width="190" show-overflow-tooltip />
                          <el-table-column prop="remark" label="备注" min-width="180" show-overflow-tooltip />
                          <el-table-column label="状态" width="96">
                            <template #default="{ row }">
                              <el-tag :type="tagType(row.status)" effect="plain">{{ row.status }}</el-tag>
                            </template>
                          </el-table-column>
                        </el-table>
                      </div>

                      <div class="guide-basic-section">
                        <div class="guide-section-title">
                          <strong>常住地址</strong>
                          <el-tag effect="plain">用于接送、患者端和随访定位</el-tag>
                        </div>
                        <el-table :data="addressRows" size="small" border>
                          <el-table-column prop="region" label="省市区" min-width="180" />
                          <el-table-column prop="detail" label="详细地址" min-width="260" show-overflow-tooltip />
                          <el-table-column prop="resident" label="是否常住" width="100" />
                          <el-table-column prop="usage" label="用途" min-width="140" />
                          <el-table-column prop="verifiedAt" label="核验时间" min-width="150" />
                          <el-table-column label="状态" width="96">
                            <template #default="{ row }">
                              <el-tag :type="tagType(row.status)" effect="plain">{{ row.status }}</el-tag>
                            </template>
                          </el-table-column>
                        </el-table>
                      </div>

                      <div class="guide-basic-section">
                        <div class="guide-section-title">
                          <strong>病史与肾脏病替代治疗史</strong>
                          <el-tag type="warning" effect="plain">上机核对前必须可追溯</el-tag>
                        </div>
                        <div class="guide-history-grid">
                          <div v-for="item in historyFlags" :key="item.label" class="guide-history-card">
                            <div>
                              <el-checkbox :model-value="true" disabled>{{ item.label }}</el-checkbox>
                              <p>{{ item.value }}</p>
                            </div>
                            <div class="guide-history-meta">
                              <el-tag :type="tagType(item.status)" effect="plain">{{ item.status }}</el-tag>
                              <span>{{ item.owner }} / {{ item.updatedAt }}</span>
                            </div>
                          </div>
                        </div>
                        <el-table class="guide-nested-table" :data="replacementHistoryRows" size="small" border>
                          <el-table-column prop="mode" label="替代治疗方式" min-width="140" />
                          <el-table-column prop="startedAt" label="开始日期" width="120" />
                          <el-table-column prop="hospital" label="治疗机构" min-width="200" show-overflow-tooltip />
                          <el-table-column prop="access" label="通路/置管" min-width="170" />
                          <el-table-column prop="frequency" label="频次" min-width="150" />
                          <el-table-column prop="status" label="状态" width="110" />
                          <el-table-column prop="nextAction" label="下一环节" min-width="150" />
                        </el-table>
                      </div>

                      <div class="guide-basic-section">
                        <div class="guide-section-title">
                          <strong>附件</strong>
                          <el-button link :icon="Files" @click="openCertificate(current)">维护附件</el-button>
                        </div>
                        <el-table :data="attachmentRows" size="small" border>
                          <el-table-column prop="name" label="附件名称" min-width="180" />
                          <el-table-column prop="type" label="附件类型" min-width="120" />
                          <el-table-column prop="source" label="来源" min-width="130" />
                          <el-table-column prop="uploadedAt" label="上传时间" min-width="150" />
                          <el-table-column label="状态" width="110">
                            <template #default="{ row }">
                              <el-tag :type="tagType(row.status)" effect="plain">{{ row.status }}</el-tag>
                            </template>
                          </el-table-column>
                        </el-table>
                      </div>

                      <div class="guide-basic-section">
                        <div class="guide-section-title">
                          <strong>补充资料记录</strong>
                          <el-tag effect="plain">导诊建档输出到签约、归属和预约</el-tag>
                        </div>
                        <el-table :data="supplementRows" size="small" border>
                          <el-table-column prop="category" label="资料类型" min-width="140" />
                          <el-table-column prop="content" label="内容" min-width="260" show-overflow-tooltip />
                          <el-table-column label="状态" width="110">
                            <template #default="{ row }">
                              <el-tag :type="tagType(row.status)" effect="plain">{{ row.status }}</el-tag>
                            </template>
                          </el-table-column>
                          <el-table-column prop="owner" label="责任人" min-width="110" />
                          <el-table-column prop="updatedAt" label="更新时间" min-width="150" />
                          <el-table-column prop="nextAction" label="下一环节" min-width="150" />
                        </el-table>
                      </div>
                    </div>
                  </div>
                </section>

                <section v-else-if="tab.name === 'diagnosis'" class="guide-diagnosis-panel">
                  <el-tabs v-model="activeDiagnosisTab" class="guide-diagnosis-tabs">
                    <el-tab-pane v-for="item in diagnosisTabs" :key="item.name" :label="item.label" :name="item.name" />
                  </el-tabs>

                  <div class="guide-diagnosis-table">
                    <div class="guide-diagnosis-head">
                      <span>疾病</span>
                      <span>诊断医生</span>
                      <span>确诊时间</span>
                      <span>关闭</span>
                      <span>关闭医生</span>
                      <span>关闭时间</span>
                      <span>关闭原因</span>
                      <span>备注</span>
                      <span>状态</span>
                      <span class="guide-diagnosis-head-action">
                        <el-button link type="primary" :icon="DocumentAdd" @click="addDiagnosisRow">新增</el-button>
                      </span>
                    </div>
                    <div v-for="(row, index) in currentDiagnosisRows" :key="row.id ?? `${activeDiagnosisTab}-${row.disease}-${index}`" class="guide-diagnosis-row">
                      <el-select v-model="row.disease" :disabled="!isDiagnosisEditing(row)" filterable placeholder="请选择疾病">
                        <el-option
                          v-for="item in diagnosisDiseaseOptions"
                          :key="item"
                          :label="item"
                          :value="item"
                        />
                      </el-select>
                      <el-input v-model="row.doctor" :disabled="!isDiagnosisEditing(row)" placeholder="诊断医生" />
                      <el-date-picker v-model="row.confirmTime" :disabled="!isDiagnosisEditing(row)" type="date" value-format="YYYY-MM-DD" placeholder="确诊时间" />
                      <el-checkbox v-model="row.closed" :disabled="!isDiagnosisEditing(row)" />
                      <el-input v-model="row.closeDoctor" :disabled="!isDiagnosisEditing(row)" placeholder="关闭医生" />
                      <el-date-picker v-model="row.closeTime" :disabled="!isDiagnosisEditing(row)" type="date" value-format="YYYY-MM-DD" placeholder="关闭时间" />
                      <el-input v-model="row.closeReason" :disabled="!isDiagnosisEditing(row)" placeholder="关闭原因" />
                      <el-input v-model="row.remark" :disabled="!isDiagnosisEditing(row)" placeholder="备注" />
                      <el-tag :type="tagType(row.status)" effect="plain">{{ row.status }}</el-tag>
                      <div class="guide-row-actions">
                        <el-button link type="primary" @click="toggleDiagnosisEdit(row)">
                          {{ isDiagnosisEditing(row) ? '保存' : '编辑' }}
                        </el-button>
                        <el-button link type="danger" @click="submitAction('诊断行已标记删除，提交后写入审计')">删除</el-button>
                      </div>
                    </div>
                  </div>

                </section>

                <section v-else-if="tab.name === 'plan'" class="guide-dialysis-plan-panel">
                  <div class="guide-plan-toolbar">
                    <div class="guide-plan-frequency">
                      <label>处方频率：</label>
                      <el-input model-value="1周3次" />
                      <el-button link type="primary" :icon="EditPen">调整</el-button>
                    </div>
                    <div class="guide-plan-remark">
                      <label>备注：</label>
                      <el-input model-value="" placeholder="记录方案来源、特殊要求或复核意见" />
                    </div>
                  </div>

                  <el-tabs v-model="activePlanMode" class="guide-plan-mode-tabs" @tab-change="switchPlanMode">
                    <el-tab-pane v-for="mode in dialysisPlanModes" :key="mode" :label="mode" :name="mode" />
                  </el-tabs>

                  <div class="guide-plan-subtabs">
                    <el-radio-group :model-value="activePlanTerm">
                      <el-radio-button label="long" @click="showLongPlanForm">长期方案</el-radio-button>
                      <el-radio-button label="temp" @click="showTempPlanList">临时方案</el-radio-button>
                    </el-radio-group>
                    <template v-if="activePlanTerm === 'temp' && !tempPlanFormVisible">
                      <el-select
                        v-model="selectedTempPlanId"
                        class="guide-temp-plan-select"
                        filterable
                        clearable
                        :prefix-icon="Search"
                        placeholder="请选择临时方案"
                        @change="openTempPlan"
                      >
                        <el-option v-for="option in currentTempPlanOptions" :key="option" :label="option" :value="option" />
                      </el-select>
                      <el-button type="primary" plain :icon="DocumentAdd" @click="createTempPlan">新建临时处方</el-button>
                    </template>
                    <div class="guide-plan-inline-actions">
                      <template v-if="activePlanTerm === 'long'">
                        <template v-if="['HD+HP方案', 'CRRT方案'].includes(activePlanMode)">
                          <el-button @click="cancelLongPlanEdit">取消</el-button>
                          <el-button type="primary" @click="submitAction(`${activePlanMode}长期方案已完成，输出到排班排床和护士核对`)">完成</el-button>
                        </template>
                        <template v-else>
                          <el-button v-if="longPlanEditing" @click="cancelLongPlanEdit">取消</el-button>
                          <el-button type="primary" @click="toggleLongPlanEdit">{{ longPlanEditing ? '保存' : '编辑' }}</el-button>
                        </template>
                      </template>
                      <template v-else-if="tempPlanFormVisible">
                        <el-button>取消</el-button>
                        <el-button type="primary" @click="submitAction('血透方案已保存，输出到排班排床和护士核对')">完成</el-button>
                      </template>
                    </div>
                  </div>

                  <div v-if="activePlanTerm === 'temp' && !tempPlanFormVisible" class="guide-temp-plan-browser">
                    <div class="guide-temp-plan-list" v-if="currentTempPlanList.length">
                      <div v-for="plan in currentTempPlanList" :key="plan.id" class="guide-temp-plan-item" @click="openTempPlan(plan.name)">
                        <div>
                          <strong>{{ plan.name }}</strong>
                          <p>{{ plan.id }}；启用 {{ plan.startedAt }}；剩余 {{ plan.remaining }}；制定人 {{ plan.owner }}</p>
                        </div>
                        <el-tag :type="tagType(plan.status)" effect="plain">{{ plan.status }}</el-tag>
                      </div>
                    </div>
                    <div class="guide-temp-plan-empty" v-else>
                      <div class="guide-temp-empty-art">
                        <Files />
                        <Search />
                      </div>
                      <el-tag type="primary" effect="light">请选择临时方案</el-tag>
                    </div>
                  </div>

                  <div v-else class="guide-plan-form">
                    <section v-for="section in visibleDialysisPlanSections" :key="section.title" class="guide-plan-section">
                      <div class="guide-plan-section-head">
                        <div>
                          <strong>{{ section.title }}</strong>
                          <p v-if="section.note">{{ section.note }}</p>
                        </div>
                        <div class="guide-plan-section-tools">
                          <el-button v-if="section.actionLabel && section.title === '血透通路'" type="primary" @click="addVascularAccessField">{{ section.actionLabel }}</el-button>
                          <el-button v-else-if="section.actionLabel" type="primary">{{ section.actionLabel }}</el-button>
                          <el-checkbox v-if="section.checkLabel" :model-value="section.checked">{{ section.checkLabel }}</el-checkbox>
                        </div>
                      </div>

                      <div class="guide-plan-field-grid" :class="`columns-${section.columns ?? 3}`">
                        <div
                          v-for="field in section.fields"
                          :key="`${section.title}-${field.label}`"
                          class="guide-plan-field"
                          :class="{ required: field.required, wide: field.span === 'wide', double: field.span === 'double', checkbox: field.type === 'checkbox', half: field.half, compound: !!field.extraUnit, unlabeled: !field.label }"
                        >
                          <label v-if="field.label">{{ field.label }}</label>
                          <div class="guide-plan-control">
                            <el-select v-if="field.type === 'select'" :model-value="field.value" :placeholder="field.placeholder ?? `请选择${field.label}`">
                              <el-option v-for="option in field.options ?? []" :key="option" :label="option" :value="option" />
                            </el-select>
                            <el-date-picker
                              v-else-if="field.type === 'date'"
                              :model-value="field.value"
                              type="date"
                              value-format="YYYY-MM-DD"
                              placeholder="请选择日期"
                            />
                            <el-input
                              v-else-if="field.type === 'textarea'"
                              :model-value="field.value"
                              type="textarea"
                              :rows="section.title === '透析建议' ? 3 : 2"
                              :placeholder="field.placeholder ?? `请输入${field.label}`"
                            />
                            <el-checkbox v-else-if="field.type === 'checkbox'" :model-value="field.value === '是'">{{ field.value }}</el-checkbox>
                            <el-input v-else :model-value="field.value" :placeholder="field.placeholder ?? `请输入${field.label}`" :type="field.type === 'number' ? 'number' : 'text'" />
                            <el-button
                              v-if="field.addable"
                              class="guide-plan-add-button"
                              @click="section.title === '血透通路' ? addVascularAccessField() : submitAction(`${field.label || section.title}已新增可选项`)"
                            >
                              +
                            </el-button>
                            <span v-if="field.unit" class="guide-plan-unit">{{ field.unit }}</span>
                            <el-input
                              v-if="field.extraUnit"
                              class="guide-plan-extra-input"
                              :model-value="field.extraValue"
                              :placeholder="field.extraPlaceholder ?? ''"
                            />
                            <span v-if="field.extraUnit" class="guide-plan-unit">{{ field.extraUnit }}</span>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </section>

                <section v-else-if="tab.name === 'record'" class="guide-dialysis-record-panel">
                  <el-form class="guide-record-filter" inline label-width="74px">
                    <el-form-item label="透析方式">
                      <el-select placeholder="请选择" clearable>
                        <el-option label="HD" value="HD" />
                        <el-option label="HDF" value="HDF" />
                        <el-option label="HD+HP" value="HD+HP" />
                        <el-option label="CRRT" value="CRRT" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="透析日期" class="guide-record-date-item">
                      <el-date-picker
                        type="daterange"
                        start-placeholder="2026-05-11"
                        end-placeholder="2026-05-19"
                        range-separator="至"
                        value-format="YYYY-MM-DD"
                      />
                    </el-form-item>
                  </el-form>

                  <div class="guide-record-more">
                    <el-button link type="primary">⌄</el-button>
                  </div>

                  <div class="guide-record-actions">
                    <el-button type="primary" :icon="DocumentAdd" @click="recordDialogVisible = true">新增</el-button>
                    <el-button type="primary" plain :icon="Printer" @click="submitAction('血透记录单打印任务已生成')">打印</el-button>
                    <el-button type="primary" plain :icon="Printer" @click="submitAction('血透记录单列表打印任务已生成')">列表打印</el-button>
                    <el-button color="#d68031" :icon="Download" @click="submitAction('血透记录单导出任务已生成')">导出</el-button>
                  </div>

                  <el-table class="guide-record-table" :data="dialysisRecordRows" size="small" border>
                    <el-table-column type="selection" width="42" />
                    <el-table-column prop="patient" label="患者" min-width="92" />
                    <el-table-column prop="dialysisDate" label="透析日期" min-width="112" sortable />
                    <el-table-column prop="shift" label="班次" min-width="86" sortable />
                    <el-table-column prop="source" label="患者来源" min-width="104" />
                    <el-table-column prop="bedNo" label="床号" min-width="82" sortable />
                    <el-table-column prop="device" label="透析设备" min-width="120" />
                    <el-table-column prop="mode" label="透析方式" min-width="100" />
                    <el-table-column prop="duration" label="透析时长" min-width="96" />
                    <el-table-column prop="dialyzer" label="透析器" min-width="100" />
                    <el-table-column prop="perfusion" label="灌流器" min-width="100" />
                    <el-table-column prop="access" label="血管通路" min-width="120" />
                    <el-table-column prop="anticoagulant" label="抗凝" min-width="88" />
                    <el-table-column prop="status" label="状态" min-width="86" />
                    <el-table-column label="操作" width="96" fixed="right">
                      <template #default>
                        <el-button link type="primary">查看</el-button>
                      </template>
                    </el-table-column>
                    <template #empty>
                      <span class="guide-record-empty">暂无数据</span>
                    </template>
                  </el-table>

                  <div class="guide-record-pagination">
                    <span class="guide-record-page-arrow">‹</span>
                    <el-button link type="primary">1</el-button>
                    <span class="guide-record-page-arrow">›</span>
                    <span>共 0 条</span>
                    <el-select model-value="10" class="guide-record-page-size">
                      <el-option label="10条/页" value="10" />
                      <el-option label="20条/页" value="20" />
                      <el-option label="50条/页" value="50" />
                    </el-select>
                    <span>前往</span>
                    <el-input model-value="1" class="guide-record-page-input" />
                    <span>页</span>
                  </div>
                </section>

                <section v-else-if="tab.name === 'visit'" class="guide-visit-panel">
                  <div class="guide-visit-tabs">
                    <button type="button" :class="{ active: activeVisitKind === 'outpatient' }" @click="activeVisitKind = 'outpatient'">门诊</button>
                    <button type="button" :class="{ active: activeVisitKind === 'inpatient' }" @click="activeVisitKind = 'inpatient'">住院</button>
                  </div>

                  <section class="guide-visit-latest">
                    <div class="guide-visit-section-title">
                      <strong>最新{{ activeVisitKind === 'outpatient' ? '门诊' : '住院' }}</strong>
                    </div>
                    <div class="guide-visit-latest-row">
                      <span>{{ activeVisitKind === 'outpatient' ? '门诊日期' : '入院日期' }}：{{ latestVisit?.visitDate }}</span>
                      <span>{{ activeVisitKind === 'outpatient' ? '门诊号' : '住院号' }}：{{ latestVisit?.visitNo }}</span>
                    </div>
                  </section>

                  <section class="guide-visit-records">
                    <div class="guide-visit-section-title">
                      <strong>{{ activeVisitKind === 'outpatient' ? '门诊记录' : '住院记录' }}</strong>
                    </div>

                    <div class="guide-visit-toolbar">
                      <label>查询周期</label>
                      <el-date-picker
                        type="daterange"
                        start-placeholder="2025-11-19"
                        end-placeholder="2026-05-19"
                        range-separator="至"
                        value-format="YYYY-MM-DD"
                      />
                      <el-button type="primary" :icon="Search" @click="submitAction('就诊记录查询完成')">查询</el-button>
                      <el-button :icon="DocumentAdd" @click="visitDialogVisible = true">添加</el-button>
                    </div>

                    <el-table class="guide-visit-table" :data="currentVisitRows" size="small">
                      <el-table-column prop="visitDate" :label="activeVisitKind === 'outpatient' ? '门诊日期' : '入院日期'" min-width="132" />
                      <el-table-column prop="visitNo" :label="activeVisitKind === 'outpatient' ? '门诊号' : '住院号'" min-width="140" />
                      <el-table-column prop="hisBedNo" label="HIS床位号" min-width="140" />
                      <el-table-column prop="hisRecordNo" label="HIS病历号" min-width="140" />
                      <el-table-column prop="department" label="科室" min-width="160" />
                      <el-table-column prop="source" label="数据来源" min-width="130" />
                      <el-table-column prop="createdAt" label="创建时间" min-width="160" sortable />
                      <el-table-column label="操作" width="120" fixed="right">
                        <template #default>
                          <el-button link type="primary" @click="visitDialogVisible = true">编辑</el-button>
                          <el-button link type="primary" @click="submitAction('就诊记录已标记删除，提交后写入审计')">删除</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </section>
                </section>

                <section v-else-if="tab.name === 'emr'" class="guide-emr-panel">
                  <div class="guide-emr-subtabs">
                    <button
                      v-for="item in emrTabs"
                      :key="item.name"
                      type="button"
                      :class="{ active: activeEmrTab === item.name }"
                      @click="activeEmrTab = item.name"
                    >
                      {{ item.label }}
                    </button>
                    <el-button link type="primary" :icon="EditPen" @click="submitAction(`${emrTabs.find((item) => item.name === activeEmrTab)?.label ?? '电子病历'}进入编辑`)">编辑</el-button>
                  </div>

                  <div class="guide-emr-empty">
                    <div class="guide-emr-empty-art">
                      <div class="guide-emr-box-lid"></div>
                      <div class="guide-emr-box-body"></div>
                      <div class="guide-emr-box-side"></div>
                    </div>
                    <span>患者未写{{ emrTabs.find((item) => item.name === activeEmrTab)?.label ?? '病历首页' }}</span>
                  </div>
                </section>

                <section v-else-if="tab.name === 'orders'" class="guide-order-panel">
                  <div class="guide-order-toolbar">
                    <div class="guide-order-term-tabs">
                      <button type="button" :class="{ active: activeOrderTerm === 'long' }" @click="toggleOrderTerm('long')">长嘱</button>
                      <button type="button" :class="{ active: activeOrderTerm === 'temp' }" @click="toggleOrderTerm('temp')">临嘱</button>
                    </div>
                    <el-alert
                      v-if="activeOrderTerm === 'temp'"
                      class="guide-order-tip"
                      type="warning"
                      show-icon
                      :closable="false"
                      title="48小时前的临时医嘱不展示在表格内"
                    />
                    <div class="guide-order-actions">
                      <el-button :icon="Search">筛选</el-button>
                      <el-button :icon="Printer">打印</el-button>
                      <el-button type="primary" :icon="Files">组合</el-button>
                      <el-button :icon="Files">拆组</el-button>
                      <el-button type="warning" plain @click="submitAction('医嘱已停医嘱处理')">停医嘱</el-button>
                      <el-button type="danger" plain @click="submitAction('医嘱已删医嘱处理')">删医嘱</el-button>
                      <el-button type="primary" plain @click="submitAction('医嘱开立组套面板已打开')">开立组套</el-button>
                    </div>
                  </div>

                  <div class="guide-order-table-wrap">
                    <el-table :data="currentOrderRows" class="guide-order-table" border>
                      <el-table-column label="选择" width="56" fixed="left">
                        <template #default="{ row }">
                          <el-checkbox v-model="row.selected" />
                        </template>
                      </el-table-column>
                      <el-table-column label="血透" width="72">
                        <template #default="{ row }">
                          <el-radio v-model="row.orderSource" label="血透" />
                        </template>
                      </el-table-column>
                      <el-table-column label="文本" width="72">
                        <template #default="{ row }">
                          <el-radio v-model="row.textMode" :label="true" />
                        </template>
                      </el-table-column>
                      <el-table-column label="自备" width="72">
                        <template #default="{ row }">
                          <el-radio v-model="row.selfPay" :label="true" />
                        </template>
                      </el-table-column>
                      <el-table-column label="类别" min-width="140">
                        <template #default="{ row }">
                          <div class="guide-order-cell">
                            <el-select v-model="row.category" placeholder="请选择">
                              <el-option label="耗材项目" value="耗材项目" />
                              <el-option label="药品项目" value="药品项目" />
                              <el-option label="诊疗项目" value="诊疗项目" />
                              <el-option label="护理项目" value="护理项目" />
                            </el-select>
                            <el-button class="guide-order-plus" :icon="DocumentAdd" link @click="submitAction('已新增医嘱项目')">+</el-button>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column label="项目名称" min-width="160">
                        <template #default>
                          <div class="guide-order-error-dot" />
                        </template>
                      </el-table-column>
                      <el-table-column label="剂量" width="84">
                        <template #default="{ row }">
                          <el-input v-model="row.dosage" />
                        </template>
                      </el-table-column>
                      <el-table-column label="剂量单位" width="88">
                        <template #default="{ row }">
                          <el-input v-model="row.dosageUnit" />
                        </template>
                      </el-table-column>
                      <el-table-column label="数量" width="84">
                        <template #default="{ row }">
                          <el-input v-model="row.quantity" />
                        </template>
                      </el-table-column>
                      <el-table-column label="数量单位" width="88">
                        <template #default="{ row }">
                          <el-input v-model="row.quantityUnit" />
                        </template>
                      </el-table-column>
                      <el-table-column label="用法" width="84">
                        <template #default="{ row }">
                          <el-input v-model="row.usage" />
                        </template>
                      </el-table-column>
                      <el-table-column label="医嘱内容" min-width="180">
                        <template #default="{ row }">
                          <div class="guide-order-cell">
                            <el-input v-model="row.orderContent" />
                            <el-icon class="guide-order-error-icon"><Warning /></el-icon>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column label="嘱托" min-width="150">
                        <template #default="{ row }">
                          <el-input v-model="row.drip" />
                        </template>
                      </el-table-column>
                      <el-table-column label="频率" width="88">
                        <template #default="{ row }">
                          <el-input v-model="row.frequency" />
                        </template>
                      </el-table-column>
                      <el-table-column label="执行计划" min-width="130">
                        <template #default="{ row }">
                          <el-button link type="primary" @click="submitAction(`医嘱 ${row.category} 的执行计划已打开`)">{{ row.executePlan }}</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>

                  <div class="guide-order-footer">
                    <span>当前对象：{{ current.name }} / {{ current.no }}，{{ activeOrderTerm === 'long' ? '长嘱' : '临嘱' }}录入后进入审核、执行计划和护士核对闭环。</span>
                  </div>
                </section>
                <section v-else-if="tab.name === 'access'" class="guide-access-panel">
                  <div class="guide-access-topbar">
                    <div class="guide-access-subtabs">
                      <button type="button" :class="{ active: activeAccessSubTab === 'access' }" @click="switchAccessSubTab('access')">通路</button>
                      <button type="button" :class="{ active: activeAccessSubTab === 'repair' }" @click="switchAccessSubTab('repair')">修复</button>
                      <button type="button" :class="{ active: activeAccessSubTab === 'complication' }" @click="switchAccessSubTab('complication')">并发症</button>
                      <button type="button" :class="{ active: activeAccessSubTab === 'follow' }" @click="switchAccessSubTab('follow')">随访</button>
                    </div>
                    <el-button v-if="activeAccessSubTab === 'repair'" type="success" :icon="DocumentAdd" @click="openRepairDialog('create')">新建</el-button>
                    <el-button v-else type="primary" :icon="DocumentAdd" @click="openAccessDialog('create')">新建</el-button>
                  </div>

                  <template v-if="activeAccessSubTab === 'repair'">
                    <div class="guide-repair-filter">
                      <div class="guide-repair-date-field">
                        <label>手术日期</label>
                        <el-date-picker
                          v-model="repairDateRange"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="2025-11-21"
                          end-placeholder="2026-05-21"
                          value-format="YYYY-MM-DD"
                        />
                      </div>
                      <el-button type="primary" @click="submitAction('通路修复列表查询完成')">查询</el-button>
                    </div>

                    <el-table :data="visibleRepairTableRows" border class="guide-repair-table">
                      <el-table-column prop="accessName" label="血管通路" min-width="220" show-overflow-tooltip />
                      <el-table-column prop="problem" label="通路问题" min-width="220" show-overflow-tooltip />
                      <el-table-column prop="surgeon" label="手术医生" min-width="120" />
                      <el-table-column prop="repairDate" label="手术日期" min-width="120" />
                      <el-table-column label="是否可用" min-width="96">
                        <template #default="{ row }">
                          <el-tag :type="row.currentAvailable ? 'success' : 'info'" effect="plain">
                            {{ row.currentAvailable ? '是' : '否' }}
                          </el-tag>
                        </template>
                      </el-table-column>
                      <el-table-column prop="availableDate" label="可用日期" min-width="120" />
                      <el-table-column label="操作" width="120">
                        <template #default="{ row }">
                          <el-button link type="primary" @click.stop="openRepairDialog('edit', row)">编辑</el-button>
                        </template>
                      </el-table-column>
                      <template #empty>
                        <div class="guide-repair-empty">暂无数据</div>
                      </template>
                    </el-table>

                    <div class="guide-repair-pagination">
                      <span class="guide-access-page-arrow">‹</span>
                      <el-button link type="primary" :disabled="!visibleRepairTableRows.length">1</el-button>
                      <span class="guide-access-page-arrow">›</span>
                      <span>共 {{ visibleRepairTableRows.length }} 条</span>
                      <el-select model-value="10" class="guide-access-page-size">
                        <el-option label="10条/页" value="10" />
                        <el-option label="20条/页" value="20" />
                        <el-option label="50条/页" value="50" />
                      </el-select>
                      <span>前往</span>
                      <el-input model-value="1" class="guide-access-page-input" />
                      <span>页</span>
                    </div>
                  </template>

                  <template v-else>
                    <div class="guide-access-toolbar">
                      <div class="guide-access-toolbar-actions">
                        <el-button :icon="Printer">打印</el-button>
                        <el-button color="#ff8a1f" :icon="Download">导出</el-button>
                      </div>
                    </div>

                    <el-table :data="visibleAccessTableRows" border class="guide-access-table">
                      <el-table-column type="expand" width="46">
                        <template #default="{ row }">
                          <div class="guide-access-expand">
                            <div><span>备注</span><strong>{{ row.remark || '无' }}</strong></div>
                            <div><span>穿刺计划</span><strong>{{ row.puncturePlan }}</strong></div>
                            <div><span>关键提醒</span><strong>{{ row.reminders.map((item: AccessReminderRow) => item.nodeName).join(' / ') || '暂无' }}</strong></div>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="firstUseGap" label="首次使用日期" min-width="130" />
                      <el-table-column prop="surgeryGap" label="手术日期" min-width="120" />
                      <el-table-column prop="useDuration" label="手术距今(天)" min-width="120" />
                      <el-table-column prop="createdTime" label="置管时间(天)" min-width="120" />
                      <el-table-column label="血管通路" min-width="220">
                        <template #default="{ row }">
                          {{ row.accessTitle }}
                        </template>
                      </el-table-column>
                      <el-table-column prop="status" label="状态" min-width="92">
                        <template #default="{ row }">
                          <el-tag :type="tagType(row.status)" effect="plain">{{ row.status }}</el-tag>
                        </template>
                      </el-table-column>
                      <el-table-column prop="useDuration" label="使用时间" min-width="120" sortable />
                      <el-table-column prop="createdTime" label="创建时间" min-width="140" sortable />
                      <el-table-column label="操作" width="170" fixed="right">
                        <template #default="{ row }">
                          <div class="guide-access-row-actions">
                            <el-button link type="primary" @click.stop="openAccessDialog('edit', row)">编辑</el-button>
                            <el-button link type="primary" @click.stop="submitAction(`通路 ${row.accessTitle} 穿刺图已打开`)">穿刺图</el-button>
                            <el-dropdown trigger="click">
                              <el-button link type="primary">操作</el-button>
                              <template #dropdown>
                                <el-dropdown-menu>
                                  <el-dropdown-item @click="submitAction(`通路 ${row.accessTitle} 的修复记录已打开`)">修复</el-dropdown-item>
                                  <el-dropdown-item @click="submitAction(`通路 ${row.accessTitle} 的并发症记录已打开`)">并发症</el-dropdown-item>
                                  <el-dropdown-item @click="submitAction(`通路 ${row.accessTitle} 的随访记录已打开`)">随访</el-dropdown-item>
                                </el-dropdown-menu>
                              </template>
                            </el-dropdown>
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>

                    <div class="guide-access-pagination">
                      <span class="guide-access-page-arrow">‹</span>
                      <el-button link type="primary">1</el-button>
                      <span class="guide-access-page-arrow">›</span>
                      <span>共 {{ visibleAccessTableRows.length }} 条</span>
                      <el-select model-value="10" class="guide-access-page-size">
                        <el-option label="10条/页" value="10" />
                        <el-option label="20条/页" value="20" />
                        <el-option label="50条/页" value="50" />
                      </el-select>
                      <span>前往</span>
                      <el-input model-value="1" class="guide-access-page-input" />
                      <span>页</span>
                    </div>
                  </template>
                </section>
                <section v-else-if="tab.name === 'change-info'" class="guide-change-panel">
                  <div class="guide-change-toolbar">
                    <div>
                      <strong>变更记录</strong>
                      <p>维护患者主档、签约、归属、医保和通路等关键字段的变更前后值、复核结果和审计链。</p>
                    </div>
                    <div class="guide-change-actions">
                      <el-tag type="primary" effect="plain">{{ current.name }} / {{ current.no }}</el-tag>
                      <el-button type="primary" :icon="DocumentAdd" @click="openChangeRecordDialog('create')">新增记录</el-button>
                    </div>
                  </div>

                  <el-row :gutter="16" class="guide-change-summary-row">
                    <el-col v-for="stat in changeSummaryStats" :key="stat.label" :xs="12" :md="6">
                      <el-card class="guide-change-stat-card" :class="`tone-${stat.tone}`" shadow="never">
                        <span>{{ stat.label }}</span>
                        <strong>{{ stat.value }}</strong>
                      </el-card>
                    </el-col>
                  </el-row>

                  <div class="guide-change-filter">
                    <el-select v-model="changeFilter.eventType" placeholder="事件类型" clearable>
                      <el-option label="主档变更" value="主档变更" />
                      <el-option label="归属变更" value="归属变更" />
                      <el-option label="处方变更" value="处方变更" />
                      <el-option label="身份绑定" value="身份绑定" />
                      <el-option label="医保变更" value="医保变更" />
                      <el-option label="通路变更" value="通路变更" />
                      <el-option label="新入" value="新入" />
                    </el-select>
                    <el-select v-model="changeFilter.originalStatus" placeholder="原始状态" clearable>
                      <el-option label="放弃治疗" value="放弃治疗" />
                      <el-option label="血透" value="血透" />
                      <el-option label="未签约" value="未签约" />
                      <el-option label="待复核" value="待复核" />
                    </el-select>
                    <el-select v-model="changeFilter.changeStatus" placeholder="变更状态" clearable>
                      <el-option label="血透" value="血透" />
                      <el-option label="放弃治疗" value="放弃治疗" />
                      <el-option label="已生效" value="已生效" />
                      <el-option label="待复核" value="待复核" />
                      <el-option label="已审计" value="已审计" />
                    </el-select>
                    <el-input v-model="changeFilter.keyword" placeholder="搜索日期、原因、备注、操作者" clearable />
                    <el-button type="primary" :icon="Search" @click="submitAction('变更记录筛选已执行')">查询</el-button>
                  </div>

                  <el-row :gutter="16" class="guide-change-main">
                    <el-col :xs="24" :xl="16">
                      <el-card class="guide-change-card" shadow="never">
                        <template #header>
                          <div class="guide-change-card-header">
                            <div>
                              <strong>变更记录表</strong>
                              <p>状态变更通过前后状态标签表达，备注字段保留下次变更日期和补充说明。</p>
                            </div>
                            <el-tag type="success" effect="plain">{{ visibleChangeRecordRows.length }} 条</el-tag>
                          </div>
                        </template>

                        <el-table :data="visibleChangeRecordRows" class="guide-change-table" border size="small" @row-click="selectChangeRecord">
                          <el-table-column prop="changeDate" label="变更日期" min-width="110" />
                          <el-table-column prop="eventType" label="事件类型" min-width="110">
                            <template #default="{ row }">
                              <el-tag effect="plain" type="warning">{{ row.eventType }}</el-tag>
                            </template>
                          </el-table-column>
                          <el-table-column label="状态变更" min-width="170">
                            <template #default="{ row }">
                              <div class="guide-change-flow">
                                <el-tag effect="plain" type="info">{{ row.originalStatus }}</el-tag>
                                <span>→</span>
                                <el-tag effect="plain" type="primary">{{ row.changeStatus }}</el-tag>
                              </div>
                            </template>
                          </el-table-column>
                          <el-table-column prop="changeReason" label="变更原因" min-width="220" show-overflow-tooltip />
                          <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip />
                          <el-table-column prop="createdAt" label="创建时间" min-width="150" />
                          <el-table-column prop="owner" label="操作者" min-width="130" />
                          <el-table-column label="操作" width="160" fixed="right">
                            <template #default="{ row }">
                              <el-button link type="primary" @click.stop="openChangeRecordDialog('edit', row)">编辑</el-button>
                              <el-button link type="danger" @click.stop="deleteChangeRecord(row)">删除</el-button>
                            </template>
                          </el-table-column>
                        </el-table>
                      </el-card>
                    </el-col>

                    <el-col :xs="24" :xl="8">
                      <el-card class="guide-change-side-card" shadow="never">
                        <template #header>
                          <div class="guide-change-card-header">
                            <div>
                              <strong>当前详情</strong>
                              <p>展示当前选中记录的输入、输出和下一步处理。</p>
                            </div>
                          </div>
                        </template>

                        <div v-if="currentChangeRecord" class="guide-change-detail">
                          <div><span>患者</span><strong>{{ current.name }} / {{ current.no }}</strong></div>
                          <div><span>事件</span><strong>{{ currentChangeRecord.eventType }}</strong></div>
                          <div><span>原始状态</span><strong>{{ currentChangeRecord.originalStatus }}</strong></div>
                          <div><span>变更状态</span><strong>{{ currentChangeRecord.changeStatus }}</strong></div>
                          <div><span>责任人</span><strong>{{ currentChangeRecord.owner }}</strong></div>
                          <div><span>下一环节</span><strong>{{ currentChangeRecord.nextAction }}</strong></div>
                        </div>

                        <div class="guide-change-note">
                          <div><span>输入</span><strong>各模块修改申请、复核意见、电子签名和审计日志</strong></div>
                          <div><span>输出</span><strong>变更前后值、复核状态、责任人和审计链</strong></div>
                          <div><span>下一环节</span><strong>医疗安全审计、权限追溯和报表口径修正</strong></div>
                        </div>
                      </el-card>
                    </el-col>
                  </el-row>
                </section>
                <section v-else-if="tab.name === 'analysis'" class="guide-analysis-panel">
                  <div class="guide-analysis-tabs">
                    <button
                      v-for="metric in analysisMetricTabs"
                      :key="metric.name"
                      type="button"
                      :class="{ active: activeAnalysisMetric === metric.name }"
                      @click="switchAnalysisMetric(metric.name)"
                    >
                      {{ metric.label }}
                    </button>
                  </div>

                  <div class="guide-analysis-toolbar">
                    <div class="guide-analysis-date-range">
                      <el-date-picker
                        v-model="analysisDateRange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="2026-04-21"
                        end-placeholder="2026-05-21"
                        value-format="YYYY-MM-DD"
                      />
                      <el-button type="primary" :icon="Search" @click="queryAnalysisMetric">查询</el-button>
                    </div>
                    <el-button plain :icon="Printer" @click="printAnalysisMetric">打印</el-button>
                  </div>

                  <div class="guide-analysis-chart">
                    <div class="guide-analysis-zero">0</div>
                    <div class="guide-analysis-line"></div>
                  </div>

                  <el-table class="guide-analysis-table" :data="currentAnalysisRows" size="small" border>
                    <el-table-column
                      v-for="column in currentAnalysisMetric.columns"
                      :key="column.prop"
                      :prop="column.prop"
                      :label="column.label"
                      :min-width="column.minWidth"
                      :width="column.width"
                    />
                    <template #empty>
                      <div class="guide-analysis-empty">请选择时间范围后查询分析结果</div>
                    </template>
                  </el-table>
                </section>
                <section v-else-if="tab.name === 'anticoagulation'" class="guide-anticoagulation-panel">
                  <div class="guide-anticoagulation-toolbar">
                    <div>
                      <strong>抗凝剂记录</strong>
                      <p>按单次透析追踪抗凝剂首剂、追加、总量、调整原因和执行结果。</p>
                    </div>
                    <div class="guide-anticoagulation-actions">
                      <el-date-picker
                        v-model="anticoagulationDateRange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="2026-04-21"
                        end-placeholder="2026-05-21"
                        value-format="YYYY-MM-DD"
                      />
                      <el-button type="primary" :icon="Search" @click="submitAction('抗凝剂记录查询完成')">查询</el-button>
                      <el-button @click="anticoagulationDateRange = ['2026-04-21', '2026-05-21']">重置</el-button>
                      <el-button type="primary" plain :icon="DocumentAdd" @click="openAnticoagulationDialog('create')">新增</el-button>
                    </div>
                  </div>

                  <div class="guide-anticoagulation-stat-grid">
                    <div v-for="item in anticoagulationStats" :key="item.label" class="guide-anticoagulation-stat">
                      <span>{{ item.label }}</span>
                      <strong>{{ item.value }}</strong>
                    </div>
                  </div>

                  <el-table
                    class="guide-anticoagulation-table"
                    :data="anticoagulationRecords"
                    size="small"
                    border
                    highlight-current-row
                    @row-click="selectAnticoagulationRecord"
                  >
                    <el-table-column prop="dialysisDate" label="透析日期" min-width="112" sortable fixed="left" />
                    <el-table-column prop="anticoagulantName" label="抗凝剂名称" min-width="190" show-overflow-tooltip />
                    <el-table-column prop="firstDose" label="首剂" min-width="105" />
                    <el-table-column prop="additionalDose" label="追加" min-width="90" />
                    <el-table-column prop="additionalTime" label="追加时间" min-width="105" />
                    <el-table-column prop="totalDose" label="总量" min-width="105" />
                    <el-table-column prop="adjustmentReason" label="调整原因" min-width="220" show-overflow-tooltip />
                    <el-table-column prop="adjuster" label="调整人" min-width="92" />
                    <el-table-column prop="executionStatus" label="状态" min-width="110">
                      <template #default="{ row }">
                        <el-tag :type="tagType(row.executionStatus)" effect="plain">{{ row.executionStatus }}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column prop="clottingLevel" label="滤器凝血" min-width="95" />
                    <el-table-column prop="bleedingRisk" label="出血风险" min-width="95">
                      <template #default="{ row }">
                        <el-tag :type="row.bleedingRisk === '高' ? 'danger' : row.bleedingRisk === '中' ? 'warning' : 'success'" effect="plain">
                          {{ row.bleedingRisk }}
                        </el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column prop="linkedOrder" label="关联医嘱/处方" min-width="135" />
                    <el-table-column prop="batchNo" label="批号追溯" min-width="115" />
                    <el-table-column label="操作" width="170" fixed="right">
                      <template #default="{ row }">
                        <el-button link type="primary" @click.stop="openAnticoagulationDialog('edit', row)">编辑</el-button>
                        <el-button link type="primary" @click.stop="submitAction(`抗凝记录 ${row.id} 已进入药耗批号追溯`)">追溯</el-button>
                      </template>
                    </el-table-column>
                  </el-table>

                  <el-row :gutter="16" class="guide-anticoagulation-bottom">
                    <el-col :xs="24" :xl="15">
                      <el-card class="guide-anticoagulation-card" shadow="never">
                        <template #header>
                          <div class="guide-anticoagulation-card-header">
                            <strong>当前记录摘要</strong>
                            <el-tag type="primary" effect="plain">{{ current.name }} / {{ current.followNo }}</el-tag>
                          </div>
                        </template>
                        <div class="guide-anticoagulation-summary">
                          <div><span>治疗日期</span><strong>{{ currentAnticoagulationRecord.dialysisDate }} / {{ currentAnticoagulationRecord.shift }} / {{ currentAnticoagulationRecord.bedNo }}</strong></div>
                          <div><span>抗凝方案</span><strong>{{ currentAnticoagulationRecord.anticoagulantName }}，总量 {{ currentAnticoagulationRecord.totalDose }}</strong></div>
                          <div><span>执行结果</span><strong>{{ currentAnticoagulationRecord.executionStatus }}；滤器凝血 {{ currentAnticoagulationRecord.clottingLevel }}；出血风险 {{ currentAnticoagulationRecord.bleedingRisk }}</strong></div>
                          <div><span>下次建议</span><strong>{{ currentAnticoagulationRecord.nextSuggestion }}</strong></div>
                        </div>
                      </el-card>
                    </el-col>
                    <el-col :xs="24" :xl="9">
                      <div class="guide-dry-weight-note">
                        <div><span>输入</span><strong>透析处方、凝血风险、透中凝血事件和医嘱执行</strong></div>
                        <div><span>输出</span><strong>抗凝用量、调整原因、滤器凝血、药耗批号和下次处方建议</strong></div>
                        <div><span>下一环节</span><strong>医生处方复评、护士核对执行、药品消耗、费用和风险预警</strong></div>
                      </div>
                    </el-col>
                  </el-row>
                </section>
                <section v-else-if="tab.name === 'combined-treatment'" class="guide-combined-treatment-panel">
                  <div class="guide-combined-treatment-toolbar">
                    <div>
                      <strong>合并治疗</strong>
                      <p>围绕 HD、HDF、HP、CRRT、灌流、腹膜透析与特殊净化的合并记录，承接申请、处方、设备和耗材。</p>
                    </div>
                    <div class="guide-combined-treatment-actions">
                      <el-date-picker
                        v-model="combinedTreatmentDateRange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="YYYY-MM-DD"
                      />
                      <el-button type="primary" :icon="Search" @click="queryCombinedTreatment">查询</el-button>
                      <el-button @click="resetCombinedTreatmentFilter">重置</el-button>
                      <el-button type="primary" plain :icon="DocumentAdd" @click="openCombinedTreatmentDialog('create')">新增</el-button>
                    </div>
                  </div>

                  <div class="guide-combined-treatment-stat-grid">
                    <div class="guide-combined-treatment-stat">
                      <span>应用范围</span>
                      <strong>{{ combinedTreatmentAppliedRange[0] }} 至 {{ combinedTreatmentAppliedRange[1] }}</strong>
                    </div>
                    <div class="guide-combined-treatment-stat">
                      <span>记录总数</span>
                      <strong>{{ currentCombinedTreatmentRows.length }}</strong>
                    </div>
                    <div class="guide-combined-treatment-stat">
                      <span>已预约</span>
                      <strong>{{ combinedTreatmentReservedCount }}</strong>
                    </div>
                    <div class="guide-combined-treatment-stat">
                      <span>已执行</span>
                      <strong>{{ combinedTreatmentExecutedCount }}</strong>
                    </div>
                  </div>

                  <el-table
                    class="guide-combined-treatment-table"
                    :data="combinedTreatmentPagedRows"
                    size="small"
                    border
                    highlight-current-row
                  >
                    <el-table-column prop="treatmentDate" label="治疗日期" min-width="120" fixed="left" />
                    <el-table-column prop="modes" label="合并其它血液净化模式" min-width="220">
                      <template #default="{ row }">
                        <div class="guide-combined-treatment-modes">
                          <el-tag v-for="mode in row.modes" :key="mode" size="small" effect="plain">{{ mode }}</el-tag>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="remark" label="备注" min-width="260" show-overflow-tooltip />
                    <el-table-column prop="status" label="状态" width="110">
                      <template #default="{ row }">
                        <el-tag :type="tagType(row.status)" effect="plain">{{ row.status }}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column prop="owner" label="责任人" width="110" />
                    <el-table-column prop="time" label="更新时间" min-width="140" />
                    <el-table-column prop="nextAction" label="下一步" min-width="170" show-overflow-tooltip />
                    <el-table-column prop="linkedSource" label="来源" min-width="180" show-overflow-tooltip />
                    <el-table-column label="操作" width="160" fixed="right">
                      <template #default="{ row }">
                        <el-button link type="primary" @click.stop="openCombinedTreatmentDialog('edit', row)">编辑</el-button>
                        <el-button link type="primary" @click.stop="submitAction(`合并治疗记录 ${row.id} 已进入排班容量和费用闭环`)">追溯</el-button>
                      </template>
                    </el-table-column>
                  </el-table>

                  <div class="guide-combined-treatment-pager">
                    <el-pagination
                      v-model:current-page="combinedTreatmentPage"
                      v-model:page-size="combinedTreatmentPageSize"
                      layout="prev, pager, next, jumper, sizes, total"
                      :page-sizes="[10, 20, 50]"
                      :total="currentCombinedTreatmentRows.length"
                    />
                  </div>

                  <el-row :gutter="16" class="guide-combined-treatment-main">
                    <el-col :xs="24" :xl="15">
                      <el-card class="guide-combined-treatment-card" shadow="never">
                        <template #header>
                          <div class="guide-combined-treatment-card-header">
                            <strong>闭环摘要</strong>
                            <el-tag type="primary" effect="plain">{{ current.name }} / {{ current.followNo }}</el-tag>
                          </div>
                        </template>
                        <div class="guide-combined-treatment-summary">
                          <div><span>输入</span><strong>治疗申请、医生处方、设备状态、耗材库存和预约容量</strong></div>
                          <div><span>输出</span><strong>合并治疗计划、执行记录、耗材消耗和风险提示</strong></div>
                          <div><span>下一环节</span><strong>排班容量、护士执行、费用和治疗归档</strong></div>
                        </div>
                        <div class="guide-combined-treatment-flow">
                          <el-tag v-for="step in ['申请接入', '处方确认', '容量预约', '护士执行', '费用回写', '归档追溯']" :key="step" effect="plain">{{ step }}</el-tag>
                        </div>
                      </el-card>
                    </el-col>
                    <el-col :xs="24" :xl="9">
                      <div class="guide-dry-weight-note">
                        <div><span>来源</span><strong>治疗申请、医生处方、设备状态、耗材库存、预约容量</strong></div>
                        <div><span>输出</span><strong>合并治疗计划、执行记录、耗材消耗、风险提示</strong></div>
                        <div><span>闭环</span><strong>后续写入排班、护士执行、费用明细和治疗归档</strong></div>
                      </div>
                    </el-col>
                  </el-row>
                </section>
                <section v-else-if="tab.name === 'dry-weight'" class="guide-dry-weight-panel">
                  <div class="guide-dry-weight-hero">
                    <div class="guide-dry-weight-summary">
                      <div>
                        <p>当前干体重</p>
                        <strong>71 <span>kg</span></strong>
                        <span>近 2 周执行中，待重新评估</span>
                      </div>
                      <el-button type="primary" :icon="EditPen" @click="openDryWeightDialog">重新评估</el-button>
                    </div>
                    <div class="guide-dry-weight-metrics">
                      <div class="guide-dry-weight-metric">
                        <span>透前体重</span>
                        <strong>73.1 kg</strong>
                      </div>
                      <div class="guide-dry-weight-metric">
                        <span>透后体重</span>
                        <strong>71.8 kg</strong>
                      </div>
                      <div class="guide-dry-weight-metric">
                        <span>目标超滤</span>
                        <strong>2.4 L</strong>
                      </div>
                      <div class="guide-dry-weight-metric">
                        <span>风险判断</span>
                        <strong>容量轻度超负荷</strong>
                      </div>
                    </div>
                  </div>

                  <el-row :gutter="16" class="guide-dry-weight-main">
                    <el-col :xs="24" :xl="16">
                      <el-card class="guide-dry-weight-card" shadow="never">
                        <template #header>
                          <div class="guide-dry-weight-card-header">
                            <div>
                              <strong>变化记录</strong>
                              <p>记录透前/透后体重、血压、超滤量和复评结论，支持图表和表格两种查看方式。</p>
                            </div>
                            <div class="guide-dry-weight-toolbar">
                              <el-date-picker
                                v-model="dryWeightChartRange"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="YYYY-MM-DD"
                              />
                              <div class="guide-dry-weight-toggle">
                                <el-button :type="dryWeightChartMode === 'chart' ? 'primary' : ''" plain @click="dryWeightChartMode = 'chart'">图表模式</el-button>
                                <el-button :type="dryWeightChartMode === 'table' ? 'primary' : ''" plain @click="dryWeightChartMode = 'table'">表格模式</el-button>
                              </div>
                            </div>
                          </div>
                        </template>

                        <div v-if="dryWeightChartMode === 'chart'" class="guide-dry-weight-chart">
                          <div class="guide-dry-weight-chart-axis">
                            <span>70</span>
                            <span>60</span>
                            <span>50</span>
                            <span>40</span>
                            <span>30</span>
                            <span>20</span>
                            <span>10</span>
                            <span>0</span>
                          </div>
                          <div class="guide-dry-weight-chart-body">
                            <div class="guide-dry-weight-chart-line" />
                            <div class="guide-dry-weight-chart-fill" />
                            <div
                              v-for="(point, index) in dryWeightTrendRows"
                              :key="`${point.date}-${index}`"
                              class="guide-dry-weight-chart-point"
                              :style="{ left: `${(index / Math.max(dryWeightTrendRows.length - 1, 1)) * 100}%`, bottom: `${((point.value - 60) / 15) * 100}%` }"
                            >
                              <span>{{ point.value }}</span>
                            </div>
                          </div>
                          <div class="guide-dry-weight-chart-foot">
                            <span>{{ dryWeightTrendRows[0]?.date }} {{ dryWeightTrendRows[0]?.time }}</span>
                            <span>{{ dryWeightTrendRows[dryWeightTrendRows.length - 1]?.date }} {{ dryWeightTrendRows[dryWeightTrendRows.length - 1]?.time }}</span>
                          </div>
                        </div>

                        <el-table v-else :data="dryWeightTrendRows" border size="small" class="guide-dry-weight-table">
                          <el-table-column prop="date" label="日期" width="120" />
                          <el-table-column prop="time" label="时间" width="100" />
                          <el-table-column prop="value" label="体重(kg)" width="100" />
                          <el-table-column prop="source" label="来源" width="120" />
                          <el-table-column prop="note" label="备注" />
                        </el-table>
                      </el-card>
                    </el-col>

                    <el-col :xs="24" :xl="8">
                      <el-card class="guide-dry-weight-side-card" shadow="never">
                        <template #header>
                          <div class="guide-dry-weight-card-header">
                            <div>
                              <strong>当前状态</strong>
                              <p>用于医生站处方、护士站上机核对和患者宣教引用。</p>
                            </div>
                          </div>
                        </template>
                        <div class="guide-placeholder-list">
                          <div v-for="item in tabRows[tab.name] ?? []" :key="`${tab.name}-${item.category}-${item.item}`" class="guide-placeholder-item">
                            <span>{{ item.time }}</span>
                            <div>
                              <strong>{{ item.category }}：{{ item.item }}</strong>
                              <p>{{ item.currentObject }}；责任人 {{ item.owner }}；下一环节：{{ item.nextAction }}</p>
                            </div>
                            <el-tag :type="tagType(item.status)" effect="plain">{{ item.status }}</el-tag>
                          </div>
                        </div>

                        <div class="guide-dry-weight-note">
                          <div><span>输入</span><strong>透前/透后体重、血压、超滤量、症状和医生评估</strong></div>
                          <div><span>输出</span><strong>当前干体重、调整记录、容量风险和复评计划</strong></div>
                          <div><span>下一环节</span><strong>透析处方目标超滤、预警和患者宣教</strong></div>
                        </div>
                      </el-card>
                    </el-col>
                  </el-row>
                </section>
                <section v-else-if="tab.name === 'adequacy'" class="guide-adequacy-panel">
                  <div class="guide-adequacy-filter">
                    <span>血透日期</span>
                    <el-date-picker
                      v-model="adequacyDateRange"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      value-format="YYYY-MM-DD"
                    />
                    <el-button type="primary" @click="queryAdequacy">查询</el-button>
                  </div>

                  <div class="guide-adequacy-actions">
                    <el-button type="success" :icon="DocumentAdd" @click="openAdequacyDialog('create')">新增</el-button>
                    <el-button type="primary" @click="submitAction('血透充分性生成任务已进入医生站、质控和统计报表')">生成</el-button>
                  </div>

                  <el-table :data="adequacyPagedRows" border class="guide-adequacy-table">
                    <el-table-column prop="dialysisDate" label="血透日期" min-width="120" fixed="left" />
                    <el-table-column prop="ktv" label="尿素清除指数(Kt/V)" min-width="155" />
                    <el-table-column prop="urr" label="尿素下降率 (URR)" min-width="140">
                      <template #default="{ row }">{{ row.urr }}%</template>
                    </el-table-column>
                    <el-table-column prop="preBeta2" label="透前β2微球蛋白" min-width="150" />
                    <el-table-column prop="postBeta2" label="透后β2微球蛋白" min-width="150" />
                    <el-table-column prop="beta2Clearance" label="β2微球蛋白清除率" min-width="150">
                      <template #default="{ row }">{{ row.beta2Clearance }}%</template>
                    </el-table-column>
                    <el-table-column prop="preUrea" label="透前尿素" min-width="115" />
                    <el-table-column prop="postUrea" label="透后尿素" min-width="115" />
                    <el-table-column prop="preCreatinine" label="透前肌酐" min-width="115" />
                    <el-table-column prop="postCreatinine" label="透后肌酐" min-width="115" />
                    <el-table-column label="治疗时长" min-width="110">
                      <template #default="{ row }">{{ row.durationHour }}时{{ row.durationMinute }}分</template>
                    </el-table-column>
                    <el-table-column prop="preWeight" label="透前体重" min-width="105" />
                    <el-table-column prop="postWeight" label="透后体重" min-width="105" />
                    <el-table-column prop="ultrafiltration" label="超滤量" min-width="95" />
                    <el-table-column prop="status" label="状态" min-width="95">
                      <template #default="{ row }">
                        <el-tag :type="tagType(row.status)" effect="plain">{{ row.status }}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column prop="owner" label="责任人" min-width="95" />
                    <el-table-column label="操作" width="150" fixed="right">
                      <template #default="{ row }">
                        <el-button link type="primary" @click="openAdequacyDialog('edit', row)">编辑</el-button>
                        <el-button link type="primary" @click="submitAction(`血透充分性 ${row.dialysisDate} 已下钻到处方、通路和检验来源`)">追溯</el-button>
                      </template>
                    </el-table-column>
                  </el-table>

                  <div class="guide-adequacy-pager">
                    <el-pagination
                      v-model:current-page="adequacyPage"
                      v-model:page-size="adequacyPageSize"
                      layout="prev, pager, next, total, sizes, jumper"
                      :page-sizes="[10, 20, 50]"
                      :total="currentAdequacyRows.length"
                    />
                  </div>

                  <div class="guide-adequacy-closure">
                    <div>
                      <strong>输入</strong>
                      <span>治疗参数、透前/透后尿素肌酐、β2微球蛋白、体重和通路评估</span>
                    </div>
                    <div>
                      <strong>输出</strong>
                      <span>Kt/V、URR、达标判定、复查任务、处方调整建议和 CQI 线索</span>
                    </div>
                    <div>
                      <strong>下一环节</strong>
                      <span>回写医生处方、通路评估、护士核对、质控和统计报表</span>
                    </div>
                  </div>
                </section>
                <section v-else-if="tab.name === 'lab'" class="guide-lab-panel">
                  <el-row :gutter="16" class="guide-lab-layout">
                    <el-col :xs="24" :lg="5" class="guide-lab-left">
                      <el-card class="guide-lab-side-card" shadow="never">
                        <div class="guide-lab-filter-block">
                          <el-date-picker
                            type="daterange"
                            range-separator="至"
                            start-placeholder="2025-05-21"
                            end-placeholder="2026-05-21"
                            value-format="YYYY-MM-DD"
                          />
                        </div>
                        <div class="guide-lab-source-tabs">
                          <button type="button" :class="{ active: activeLabSource === 'original' }" @click="activeLabSource = 'original'">原报告</button>
                          <button type="button" :class="{ active: activeLabSource === 'system' }" @click="activeLabSource = 'system'">系统报告</button>
                        </div>
                        <div class="guide-lab-report-list">
                          <button
                            v-for="report in currentLabReports"
                            :key="report.id"
                            class="guide-lab-report-item"
                            :class="{ active: report.id === currentLabReport.id }"
                            type="button"
                            @click="selectedLabReportId = report.id"
                          >
                            <div class="guide-lab-report-head">
                              <span>{{ report.date }}</span>
                              <el-tag size="small" effect="plain" :type="report.source === 'original' ? 'primary' : 'success'">
                                {{ report.source === 'original' ? '透后' : '透前' }}
                              </el-tag>
                            </div>
                            <strong>{{ report.title }}</strong>
                          </button>
                        </div>
                      </el-card>
                    </el-col>

                    <el-col :xs="24" :lg="19" class="guide-lab-right">
                      <el-card class="guide-lab-main-card" shadow="never">
                        <template #header>
                          <div class="guide-lab-card-header">
                            <strong>实验室报告</strong>
                            <div class="guide-lab-actions">
                              <el-button text type="primary" :icon="DocumentAdd" @click="submitAction('实验室报告新增草稿已打开')">新增</el-button>
                              <el-button text type="primary" :icon="EditPen" @click="submitAction('实验室报告编辑表单已打开')">编辑</el-button>
                            </div>
                          </div>
                        </template>

                        <div class="guide-lab-info-grid">
                          <div class="guide-form-item"><label>检查项目</label><el-input :model-value="currentLabReport.examItem" /></div>
                          <div class="guide-form-item"><label>检查样本</label><el-input :model-value="currentLabReport.specimen" /></div>
                          <div class="guide-form-item"><label>申请日期</label><el-date-picker :model-value="currentLabReport.applyDate" type="date" value-format="YYYY-MM-DD" /></div>
                          <div class="guide-form-item"><label>报告日期</label><el-date-picker :model-value="currentLabReport.reportDate" type="date" value-format="YYYY-MM-DD" /></div>
                          <div class="guide-form-item"><label>LIS编码</label><el-input :model-value="currentLabReport.lisCode" /></div>
                          <div class="guide-form-item"><label>透后</label><el-switch :model-value="currentLabReport.source === 'original'" /></div>
                        </div>

                        <div class="guide-lab-note-row">
                          <span>当前对象：{{ current.name }} / {{ current.followNo }} / {{ currentLabReport.title }}</span>
                          <span>责任人：{{ currentLabReport.owner }}</span>
                          <span>状态：{{ currentLabReport.status }}</span>
                        </div>

                        <el-table :data="currentLabReport.indicators" class="guide-lab-table" border size="small">
                          <el-table-column prop="name" label="指标名称" min-width="160" fixed="left" />
                          <el-table-column prop="result" label="结果" width="110" />
                          <el-table-column prop="normal" label="是否正常" width="100">
                            <template #default="{ row }">
                              <el-tag :type="tagType(row.status)" effect="plain">{{ row.normal }}</el-tag>
                            </template>
                          </el-table-column>
                          <el-table-column prop="reference" label="参考范围" width="140" />
                          <el-table-column prop="trend" label="趋势" width="90" />
                        </el-table>

                        <div class="guide-lab-footer">
                          <div>
                            <strong>输入</strong>
                            <span>医生/护士检验医嘱、LIS 同步、标本采集和手工报告</span>
                          </div>
                          <div>
                            <strong>输出</strong>
                            <span>标准化检验结果、危急值通知、趋势图和归档报告</span>
                          </div>
                          <div>
                            <strong>下一环节</strong>
                            <span>回写医生评估、疗效预警、统计报表和患者端</span>
                          </div>
                        </div>
                      </el-card>
                    </el-col>
                  </el-row>
                </section>
                <section v-else-if="tab.name === 'inventory'" class="guide-inventory-panel">
                  <div class="guide-inventory-kind-tabs">
                    <button type="button" :class="{ active: activeInventoryKind === 'drug' }" @click="activeInventoryKind = 'drug'">药品</button>
                    <button type="button" :class="{ active: activeInventoryKind === 'material' }" @click="activeInventoryKind = 'material'">耗材</button>
                  </div>

                  <el-form class="guide-inventory-filter" inline label-width="72px">
                    <el-form-item :label="activeInventoryKind === 'drug' ? '药品' : '耗材'">
                      <el-select :placeholder="activeInventoryKind === 'drug' ? '请选择药品' : '请选择耗材'" clearable>
                        <el-option
                          v-for="row in currentInventoryRows"
                          :key="`item-${row.id}`"
                          :label="row.itemName"
                          :value="row.itemName"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="批次号">
                      <el-input placeholder="请输入批次号" clearable />
                    </el-form-item>
                    <el-form-item label="有效日期" class="guide-inventory-date-item">
                      <el-date-picker
                        v-model="inventoryDateRange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="截止时间"
                        value-format="YYYY-MM-DD"
                      />
                    </el-form-item>
                    <el-form-item label="库房">
                      <el-select placeholder="请选择库房" clearable>
                        <el-option v-for="row in currentInventoryRows" :key="`warehouse-${row.id}`" :label="row.warehouse" :value="row.warehouse" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="患者自备">
                      <el-select placeholder="请选择" clearable>
                        <el-option label="是" value="是" />
                        <el-option label="否" value="否" />
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" :icon="Search" @click="submitAction('库存查询完成，已按患者、批号、库房和自备状态筛选')">查询</el-button>
                      <el-button @click="submitAction('库存筛选条件已重置')">重置</el-button>
                    </el-form-item>
                  </el-form>

                  <el-table :data="currentInventoryRows" border size="small" class="guide-inventory-table">
                    <el-table-column prop="warehouse" label="库房" min-width="110" fixed="left" />
                    <el-table-column prop="medicalRecordNo" label="病案号" min-width="130" />
                    <el-table-column prop="selfPrepared" label="自备" width="76">
                      <template #default="{ row }">
                        <el-tag :type="row.selfPrepared === '是' ? 'warning' : 'info'" effect="plain">{{ row.selfPrepared }}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column :prop="'itemName'" :label="activeInventoryKind === 'drug' ? '药品' : '耗材'" min-width="170" />
                    <el-table-column prop="quantity" label="数量" width="90" />
                    <el-table-column prop="batchNo" label="批次号" min-width="130" />
                    <el-table-column prop="expireDate" label="有效日期" min-width="120" />
                    <el-table-column prop="genericName" label="通用名" min-width="140" />
                    <el-table-column prop="spec" label="规格" min-width="140" />
                    <el-table-column prop="formOrModel" :label="activeInventoryKind === 'drug' ? '剂型' : '型号'" min-width="110" />
                    <el-table-column prop="usage" label="用途" min-width="140" />
                    <el-table-column prop="status" label="状态" min-width="110">
                      <template #default="{ row }">
                        <el-tag :type="tagType(row.status)" effect="plain">{{ row.status }}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120" fixed="right">
                      <template #default="{ row }">
                        <el-button link type="primary" @click="submitAction(`${row.itemName} ${row.batchNo} 已打开批号追溯链`)">追溯</el-button>
                      </template>
                    </el-table-column>
                  </el-table>

                  <div class="guide-inventory-bottom">
                    <el-pagination layout="prev, pager, next, total, sizes, jumper" :page-sizes="[10, 20, 50]" :total="currentInventoryRows.length" :page-size="10" :current-page="1" />
                    <div class="guide-inventory-closure">
                      <div><span>输入</span><strong>医嘱执行、治疗记录、库存批次、UDI 和费用字典</strong></div>
                      <div><span>输出</span><strong>药耗消耗、库存流水、批号追溯和费用明细</strong></div>
                      <div><span>下一环节</span><strong>库存预警、费用核对、统计报表和审计追溯</strong></div>
                    </div>
                  </div>
                </section>
                <section v-else-if="tab.name === 'identity-binding'" class="guide-identity-panel">
                  <div class="guide-identity-toolbar">
                    <div>
                      <strong>身份绑定</strong>
                      <p>维护透析卡、条形码和人脸信息，供签到、上机核对和患者端登录引用。</p>
                    </div>
                    <div class="guide-identity-actions">
                      <el-tag type="primary" effect="plain">{{ current.name }} / {{ current.no }}</el-tag>
                      <el-button type="primary" :icon="DocumentAdd" @click="openIdentityBindingDialog(identityBindingActiveTab, 'create')">新增</el-button>
                    </div>
                  </div>

                  <div class="guide-identity-tabs">
                    <button type="button" :class="{ active: identityBindingActiveTab === 'card' }" @click="switchIdentityBindingTab('card')">透析卡</button>
                    <button type="button" :class="{ active: identityBindingActiveTab === 'barcode' }" @click="switchIdentityBindingTab('barcode')">条形码</button>
                    <button type="button" :class="{ active: identityBindingActiveTab === 'face' }" @click="switchIdentityBindingTab('face')">人脸信息</button>
                  </div>

                  <el-row :gutter="16" class="guide-identity-main">
                    <el-col :xs="24" :xl="15">
                      <el-card class="guide-identity-card" shadow="never">
                        <template #header>
                          <div class="guide-identity-card-header">
                            <div>
                              <strong>{{ identityBindingActiveTab === 'card' ? '透析卡列表' : identityBindingActiveTab === 'barcode' ? '条码打印' : '人脸采集' }}</strong>
                              <p>
                                {{
                                  identityBindingActiveTab === 'card'
                                    ? '展示卡号、启停状态、创建时间和解绑追溯。'
                                    : identityBindingActiveTab === 'barcode'
                                      ? '展示二维码和条形码预览，供打印和签到终端同步。'
                                      : '展示采集位、模板数量和比对状态。'
                                }}
                              </p>
                            </div>
                            <el-button
                              v-if="identityBindingActiveTab !== 'face'"
                              link
                              type="primary"
                              :icon="EditPen"
                              @click="openIdentityBindingDialog(identityBindingActiveTab, 'edit')"
                            >
                              编辑当前项
                            </el-button>
                          </div>
                        </template>

                        <el-table v-if="identityBindingActiveTab === 'card'" :data="identityBindingRecords.filter((item) => item.kind === 'card')" border size="small">
                          <el-table-column prop="value" label="卡号" min-width="120" />
                          <el-table-column prop="useStatus" label="使用状态" min-width="92">
                            <template #default="{ row }">
                              <el-tag :type="tagType(row.useStatus)" effect="plain">{{ row.useStatus }}</el-tag>
                            </template>
                          </el-table-column>
                          <el-table-column prop="remark" label="备注" min-width="180" />
                          <el-table-column prop="createdAt" label="创建时间" min-width="140" />
                          <el-table-column label="操作" width="140" fixed="right">
                            <template #default="{ row }">
                              <el-button link type="primary" @click="openIdentityBindingDialog('card', 'edit')">编辑</el-button>
                              <el-button link type="danger" @click="submitAction(`透析卡 ${row.value} 已解除绑定并写入追溯`)">解绑</el-button>
                            </template>
                          </el-table-column>
                        </el-table>

                        <div v-else-if="identityBindingActiveTab === 'barcode'" class="guide-identity-barcode-grid">
                          <div class="guide-identity-preview-card">
                            <div class="guide-identity-preview-title">二维码</div>
                            <div class="guide-identity-qr">
                              <div class="guide-identity-qr-mark" />
                              <div class="guide-identity-qr-core">
                                <span v-for="n in 16" :key="n" />
                              </div>
                              <div class="guide-identity-qr-mark" />
                              <div class="guide-identity-qr-mark guide-identity-qr-mark-bottom" />
                              <div class="guide-identity-qr-mark guide-identity-qr-mark-bottom" />
                            </div>
                            <el-button type="primary" plain :icon="Printer" @click="submitAction('二维码打印任务已生成')">打印</el-button>
                          </div>

                          <div class="guide-identity-preview-card">
                            <div class="guide-identity-preview-title">条形码</div>
                            <div class="guide-identity-barcode-art">
                              <div class="guide-identity-barcode-bars">
                                <span v-for="n in 28" :key="n" :class="{ thin: n % 4 === 0 || n % 5 === 0 }" />
                              </div>
                              <strong>{{ currentIdentityBindingRecord.previewText ?? currentIdentityBindingRecord.value }}</strong>
                            </div>
                            <div class="guide-identity-preview-actions">
                              <el-button type="primary" plain :icon="Printer" @click="submitAction('条形码打印任务已生成')">打印</el-button>
                              <el-button :icon="Download" @click="submitAction('条形码导出任务已生成')">导出</el-button>
                            </div>
                          </div>
                        </div>

                        <div v-else class="guide-identity-face-grid">
                          <div class="guide-identity-face-slot" v-for="face in currentIdentityBindingRecord.faces ?? ['正脸', '左侧脸', '右侧脸', '眨眼活体', '戴口罩复核']" :key="face">
                            <el-icon><DocumentAdd /></el-icon>
                            <span>{{ face }}</span>
                          </div>
                        </div>
                      </el-card>
                    </el-col>

                    <el-col :xs="24" :xl="9">
                      <el-card class="guide-identity-side-card" shadow="never">
                        <template #header>
                          <div class="guide-identity-card-header">
                            <strong>当前绑定摘要</strong>
                            <el-tag :type="tagType(currentIdentityBindingRecord.useStatus)" effect="plain">{{ currentIdentityBindingRecord.useStatus }}</el-tag>
                          </div>
                        </template>
                        <div class="guide-identity-side-summary">
                          <div><span>患者</span><strong>{{ current.name }} / {{ current.no }}</strong></div>
                          <div><span>对象</span><strong>{{ currentIdentityBindingRecord.title }}</strong></div>
                          <div><span>标识</span><strong>{{ currentIdentityBindingRecord.value }}</strong></div>
                          <div><span>责任人</span><strong>{{ currentIdentityBindingRecord.owner }}</strong></div>
                          <div><span>下一环节</span><strong>{{ currentIdentityBindingRecord.nextAction }}</strong></div>
                        </div>
                        <div class="guide-placeholder-list">
                          <div class="guide-placeholder-item">
                            <span>{{ currentIdentityBindingRecord.createdAt }}</span>
                            <div>
                              <strong>{{ currentIdentityBindingRecord.title }}</strong>
                              <p>{{ currentIdentityBindingRecord.remark }}</p>
                            </div>
                            <el-tag :type="tagType(currentIdentityBindingRecord.useStatus)" effect="plain">{{ currentIdentityBindingRecord.useStatus }}</el-tag>
                          </div>
                        </div>
                        <div class="guide-identity-check-list">
                          <div><span>输入</span><strong>患者主档、证件附件、接诊设备、接口同步和患者端申请</strong></div>
                          <div><span>输出</span><strong>身份核验结果、绑定记录、解绑追溯和签到可用状态</strong></div>
                          <div><span>下一环节</span><strong>签到、上机核对、患者端登录和接口同步</strong></div>
                        </div>
                      </el-card>
                    </el-col>
                  </el-row>
                </section>
                <section v-else class="guide-placeholder-panel">
                  <div class="guide-placeholder-title">
                    <div>
                      <strong>{{ tab.label }}</strong>
                      <p>{{ tab.summary }}</p>
                    </div>
                  </div>
                  <div class="guide-placeholder-list">
                    <div v-for="item in tabRows[tab.name] ?? []" :key="`${tab.name}-${item.category}-${item.item}`" class="guide-placeholder-item">
                      <span>{{ item.time }}</span>
                      <div>
                        <strong>{{ item.category }}：{{ item.item }}</strong>
                        <p>{{ item.currentObject }}；责任人 {{ item.owner }}；下一环节：{{ item.nextAction }}</p>
                      </div>
                      <el-tag :type="tagType(item.status)" effect="plain">{{ item.status }}</el-tag>
                    </div>
                  </div>
                </section>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <el-dialog v-model="recordDialogVisible" title="新增透析记录" width="960px" class="guide-record-dialog">
      <el-form class="guide-record-dialog-form" label-width="96px">
        <el-row :gutter="36">
          <el-col :span="12">
            <el-form-item label="透析日期" required>
              <el-date-picker model-value="2026-05-19" type="date" value-format="YYYY-MM-DD" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="患者" required>
              <el-select :model-value="current.name" placeholder="请选择患者">
                <el-option :label="current.name" :value="current.name" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班次" required>
              <el-select placeholder="请选择">
                <el-option label="上午班" value="上午班" />
                <el-option label="下午班" value="下午班" />
                <el-option label="夜间班" value="夜间班" />
                <el-option label="急诊班" value="急诊班" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="透析方式" required>
              <el-select placeholder="请选择">
                <el-option label="HD" value="HD" />
                <el-option label="HDF" value="HDF" />
                <el-option label="HD+HP" value="HD+HP" />
                <el-option label="CRRT" value="CRRT" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="床位" required>
              <el-select placeholder="请选择">
                <el-option label="A08" value="A08" />
                <el-option label="A10" value="A10" />
                <el-option label="B12" value="B12" />
                <el-option label="E02" value="E02" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排班备注">
              <div class="guide-record-remark-control">
                <el-select placeholder="请选择排班备注">
                  <el-option label="常规透析" value="常规透析" />
                  <el-option label="临时加透" value="临时加透" />
                  <el-option label="补透" value="补透" />
                  <el-option label="急诊透析" value="急诊透析" />
                </el-select>
                <el-button @click="submitAction('已新增排班备注选项')">+</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="recordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="recordDialogVisible = false; submitAction('新增透析记录已保存，输出到治疗记录和归档审核')">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="combinedTreatmentDialogVisible"
      :title="combinedTreatmentDialogMode === 'edit' ? '编辑合并治疗' : '新增合并治疗'"
      width="980px"
      class="guide-combined-treatment-dialog"
    >
      <el-row :gutter="20">
        <el-col :xs="24" :xl="16">
          <el-form class="guide-combined-treatment-form" label-width="104px">
            <el-form-item label="治疗日期" required>
              <el-date-picker v-model="combinedTreatmentForm.treatmentDate" type="date" value-format="YYYY-MM-DD" placeholder="请选择血透日期" />
            </el-form-item>
            <el-form-item label="合并模式" required>
              <el-checkbox-group v-model="combinedTreatmentForm.modes">
                <el-checkbox label="腹膜透析">腹膜透析</el-checkbox>
                <el-checkbox label="结肠透析">结肠透析</el-checkbox>
                <el-checkbox label="HDF">HDF</el-checkbox>
                <el-checkbox label="HP">HP</el-checkbox>
                <el-checkbox label="CRRT">CRRT</el-checkbox>
                <el-checkbox label="灌流">灌流</el-checkbox>
                <el-checkbox label="特殊净化">特殊净化</el-checkbox>
                <el-checkbox label="其它">其它</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="combinedTreatmentForm.remark" type="textarea" :rows="5" placeholder="请输入备注" />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :xs="24" :xl="8">
          <el-card class="guide-combined-treatment-side-card" shadow="never">
            <template #header>
              <div class="guide-combined-treatment-card-header">
                <strong>闭环提示</strong>
                <el-tag type="primary" effect="plain">{{ combinedTreatmentDialogMode === 'edit' ? '编辑中' : '新建中' }}</el-tag>
              </div>
            </template>
            <div class="guide-combined-treatment-summary">
              <div><span>患者</span><strong>{{ current.name }} / {{ current.no }}</strong></div>
              <div><span>责任人</span><strong>{{ current.owner }}</strong></div>
              <div><span>输入</span><strong>治疗申请、医生处方、设备状态、耗材库存和预约容量</strong></div>
              <div><span>输出</span><strong>合并治疗计划、执行记录、耗材消耗和风险提示</strong></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <template #footer>
        <el-button @click="combinedTreatmentDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCombinedTreatmentDialog">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="anticoagulationDialogVisible"
      :title="anticoagulationDialogMode === 'edit' ? '编辑抗凝剂记录' : '新增抗凝剂记录'"
      width="980px"
      class="guide-anticoagulation-dialog"
    >
      <el-row :gutter="20">
        <el-col :xs="24" :xl="16">
          <el-form class="guide-anticoagulation-form" label-width="118px">
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item label="透析日期" required>
                  <el-date-picker v-model="anticoagulationForm.dialysisDate" type="date" value-format="YYYY-MM-DD" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="班次机位">
                  <el-row :gutter="8">
                    <el-col :span="12">
                      <el-select v-model="anticoagulationForm.shift">
                        <el-option label="上午班" value="上午班" />
                        <el-option label="下午班" value="下午班" />
                        <el-option label="夜间班" value="夜间班" />
                        <el-option label="急诊班" value="急诊班" />
                      </el-select>
                    </el-col>
                    <el-col :span="12"><el-input v-model="anticoagulationForm.bedNo" placeholder="机位" /></el-col>
                  </el-row>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="抗凝剂名称" required>
                  <el-select v-model="anticoagulationForm.anticoagulantName" filterable>
                    <el-option label="低分子肝素钙注射液 4100AXaIU" value="低分子肝素钙注射液 4100AXaIU" />
                    <el-option label="那屈肝素钙注射液 0.4ml:4100IU" value="那屈肝素钙注射液 0.4ml:4100IU" />
                    <el-option label="普通肝素" value="普通肝素" />
                    <el-option label="无肝素" value="无肝素" />
                    <el-option label="枸橼酸抗凝" value="枸橼酸抗凝" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="关联医嘱/处方">
                  <el-input v-model="anticoagulationForm.linkedOrder" placeholder="医嘱号或处方号" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="首剂">
                  <el-input v-model="anticoagulationForm.firstDose" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="追加">
                  <el-input v-model="anticoagulationForm.additionalDose" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="追加时间">
                  <el-input v-model="anticoagulationForm.additionalTime" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="总量">
                  <el-input v-model="anticoagulationForm.totalDose" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="滤器凝血">
                  <el-select v-model="anticoagulationForm.clottingLevel">
                    <el-option label="0级" value="0级" />
                    <el-option label="1级" value="1级" />
                    <el-option label="2级" value="2级" />
                    <el-option label="3级" value="3级" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="出血风险">
                  <el-select v-model="anticoagulationForm.bleedingRisk">
                    <el-option label="低" value="低" />
                    <el-option label="中" value="中" />
                    <el-option label="高" value="高" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="调整人">
                  <el-input v-model="anticoagulationForm.adjuster" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="执行状态">
                  <el-select v-model="anticoagulationForm.executionStatus">
                    <el-option label="待执行" value="待执行" />
                    <el-option label="已执行" value="已执行" />
                    <el-option label="待医生复评" value="待医生复评" />
                    <el-option label="已归档" value="已归档" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="批号追溯">
                  <el-input v-model="anticoagulationForm.batchNo" placeholder="药品批号或无肝素填 -" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="调整原因">
                  <el-input v-model="anticoagulationForm.adjustmentReason" type="textarea" :rows="3" placeholder="记录出血风险、滤器凝血、医嘱变更、无肝素原因或追加原因" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="下次处方建议">
                  <el-input v-model="anticoagulationForm.nextSuggestion" type="textarea" :rows="2" placeholder="写明下次是否维持、减量、追加、无肝素或医生复评" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
        <el-col :xs="24" :xl="8">
          <el-card class="guide-anticoagulation-card" shadow="never">
            <template #header>
              <div class="guide-anticoagulation-card-header">
                <strong>闭环提示</strong>
                <el-tag type="primary" effect="plain">{{ current.name }}</el-tag>
              </div>
            </template>
            <div class="guide-dry-weight-note">
              <div><span>来源</span><strong>透析处方、抗凝医嘱、护士执行和药品批号</strong></div>
              <div><span>校验</span><strong>出血风险、凝血事件、双人核对和用量总和</strong></div>
              <div><span>回写</span><strong>治疗记录、药耗费用、医生复评任务和预警事件</strong></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <template #footer>
        <el-button @click="anticoagulationDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveAnticoagulationRecord">保存记录</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="dryWeightDialogVisible" title="干体重重新评估" width="960px" class="guide-dry-weight-dialog">
      <el-row :gutter="20">
        <el-col :xs="24" :xl="15">
          <el-form class="guide-dry-weight-form" label-width="120px">
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item label="评估日期">
                  <el-date-picker v-model="dryWeightForm.evaluationDate" type="date" value-format="YYYY-MM-DD" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="当前干体重">
                  <el-input v-model="dryWeightForm.currentDryWeight">
                    <template #append>kg</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="本次测得体重">
                  <el-input v-model="dryWeightForm.measuredWeight">
                    <template #append>kg</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="透前体重">
                  <el-input v-model="dryWeightForm.preWeight">
                    <template #append>kg</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="透后体重">
                  <el-input v-model="dryWeightForm.postWeight">
                    <template #append>kg</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="目标超滤">
                  <el-input v-model="dryWeightForm.ultrafiltration">
                    <template #append>L</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="透前血压">
                  <el-input v-model="dryWeightForm.preBp" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="透后血压">
                  <el-input v-model="dryWeightForm.postBp" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="症状与体征">
                  <el-input v-model="dryWeightForm.symptom" type="textarea" :rows="3" placeholder="填写水肿、头晕、乏力、胸闷、血压波动等" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="容量判断">
                  <el-input v-model="dryWeightForm.volumeJudgement" type="textarea" :rows="2" placeholder="判断是否容量负荷过重、容量不足或稳定" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="调整方案">
                  <el-input v-model="dryWeightForm.adjustmentPlan" type="textarea" :rows="2" placeholder="写明干体重调整值、超滤策略和复评要求" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="复评日期">
                  <el-date-picker v-model="dryWeightForm.reviewDate" type="date" value-format="YYYY-MM-DD" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="评估医生">
                  <el-input v-model="dryWeightForm.reviewer" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注">
                  <el-input v-model="dryWeightForm.remark" type="textarea" :rows="2" placeholder="补充护士站、患者宣教或处方联动说明" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
        <el-col :xs="24" :xl="9">
          <el-card class="guide-dry-weight-dialog-side" shadow="never">
            <template #header>
              <strong>闭环提示</strong>
            </template>
            <div class="guide-dry-weight-note">
              <div><span>输入</span><strong>透前/透后体重、血压、超滤量、症状和医生评估</strong></div>
              <div><span>输出</span><strong>当前干体重、调整记录、容量风险和复评计划</strong></div>
              <div><span>下一环节</span><strong>处方目标超滤、预警、患者宣教和护士上机核对</strong></div>
            </div>
            <el-alert
              type="info"
              show-icon
              :closable="false"
              title="评估结果会回写到医生站处方、护士站核对和患者中心趋势图。"
            />
          </el-card>
        </el-col>
      </el-row>
      <template #footer>
        <el-button @click="dryWeightDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="dryWeightDialogVisible = false; submitAction('干体重重新评估已保存，已回写处方目标超滤、预警和趋势记录')"
        >
          保存评估
        </el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="adequacyDialogVisible"
      :title="`${current.name}透析充分性`"
      width="960px"
      class="guide-adequacy-dialog"
    >
      <el-form class="guide-adequacy-dialog-form" label-width="82px">
        <div class="guide-adequacy-dialog-row">
          <el-form-item label="血透日期" required>
            <el-date-picker v-model="adequacyForm.dialysisDate" type="date" placeholder="请选择血透日期" value-format="YYYY-MM-DD" />
          </el-form-item>
          <el-form-item label="治疗时长">
            <el-input v-model="adequacyForm.durationHour">
              <template #append>时</template>
            </el-input>
            <el-input v-model="adequacyForm.durationMinute">
              <template #append>分</template>
            </el-input>
          </el-form-item>
        </div>

        <div class="guide-adequacy-dialog-section">
          <strong>尿素</strong>
          <div class="guide-adequacy-dialog-row">
            <el-form-item label="透前" required>
              <el-input v-model="adequacyForm.preUrea">
                <template #append>mmol/L</template>
              </el-input>
            </el-form-item>
            <el-form-item label="透后" required>
              <el-input v-model="adequacyForm.postUrea">
                <template #append>mmol/L</template>
              </el-input>
            </el-form-item>
          </div>
        </div>

        <div class="guide-adequacy-dialog-section">
          <strong>肌酐</strong>
          <div class="guide-adequacy-dialog-row">
            <el-form-item label="透前">
              <el-input v-model="adequacyForm.preCreatinine">
                <template #append>umol/L</template>
              </el-input>
            </el-form-item>
            <el-form-item label="透后">
              <el-input v-model="adequacyForm.postCreatinine">
                <template #append>umol/L</template>
              </el-input>
            </el-form-item>
          </div>
        </div>

        <div class="guide-adequacy-dialog-section">
          <strong>体重</strong>
          <div class="guide-adequacy-dialog-row">
            <el-form-item label="透前" required>
              <el-input v-model="adequacyForm.preWeight">
                <template #append>KG</template>
              </el-input>
            </el-form-item>
            <el-form-item label="透后" required>
              <el-input v-model="adequacyForm.postWeight">
                <template #append>KG</template>
              </el-input>
            </el-form-item>
            <el-form-item label="超滤量" required>
              <el-input v-model="adequacyForm.ultrafiltration">
                <template #append>KG</template>
              </el-input>
            </el-form-item>
          </div>
        </div>

        <div class="guide-adequacy-dialog-section">
          <strong>透析充分性</strong>
          <div class="guide-adequacy-dialog-row">
            <el-form-item label="URR" required>
              <el-input v-model="adequacyForm.urr">
                <template #append>%</template>
              </el-input>
            </el-form-item>
            <el-form-item label="Kt/V" required>
              <el-input v-model="adequacyForm.ktv" />
            </el-form-item>
          </div>
        </div>

        <div class="guide-adequacy-dialog-section">
          <strong>β2微球蛋白</strong>
          <div class="guide-adequacy-dialog-row">
            <el-form-item label="透前">
              <el-input v-model="adequacyForm.preBeta2" />
            </el-form-item>
            <el-form-item label="透后">
              <el-input v-model="adequacyForm.postBeta2" />
            </el-form-item>
            <el-form-item label="清除率">
              <el-input v-model="adequacyForm.beta2Clearance">
                <template #append>%</template>
              </el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>

      <div class="guide-adequacy-dialog-side">
        <div><span>患者</span><strong>{{ current.name }} / {{ current.followNo }}</strong></div>
        <div><span>本期记录</span><strong>{{ adequacyTargetSummary.total }} 条，Kt/V低值 {{ adequacyTargetSummary.lowKtvCount }} 条，URR低值 {{ adequacyTargetSummary.lowUrrCount }} 条</strong></div>
        <div><span>保存输出</span><strong>充分性达标判定、医生复查任务、处方调整建议和 CQI 线索</strong></div>
      </div>

      <template #footer>
        <el-button @click="adequacyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveAdequacyDialog">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="visitDialogVisible"
      :title="activeVisitKind === 'outpatient' ? '添加门诊记录' : '添加住院记录'"
      width="576px"
      class="guide-visit-dialog"
    >
      <el-form class="guide-visit-dialog-form" label-width="90px">
        <el-form-item :label="activeVisitKind === 'outpatient' ? '门诊日期' : '入院日期'" required>
          <el-date-picker model-value="2026-05-19" type="date" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item :label="activeVisitKind === 'outpatient' ? '门诊号' : '住院号'" required>
          <el-input :placeholder="activeVisitKind === 'outpatient' ? '请输入门诊号' : '请输入住院号'" />
        </el-form-item>
        <el-form-item label="HIS病历号">
          <el-input placeholder="请输入HIS病历号" />
        </el-form-item>
        <el-form-item label="HIS床位号">
          <el-input placeholder="请输入HIS床位号" />
        </el-form-item>
        <el-form-item label="科室">
          <el-input placeholder="请输入科室名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="visitDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="visitDialogVisible = false; submitAction('就诊记录已保存，输出到电子病历、诊断和医嘱追溯')">确定</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="changeRecordDialogVisible" :title="changeRecordDialogMode === 'edit' ? '编辑变更记录' : '新增变更记录'" size="760px">
      <el-form label-width="110px" class="guide-change-form">
        <el-form-item label="患者">
          <el-input :model-value="`${current.name} / ${current.no}`" disabled />
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="变更日期">
              <el-date-picker v-model="changeRecordForm.changeDate" type="date" value-format="YYYY-MM-DD" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下次变更">
              <el-date-picker v-model="changeRecordForm.nextChangeDate" type="date" value-format="YYYY-MM-DD" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="事件类型">
              <el-select v-model="changeRecordForm.eventType" placeholder="请选择事件类型">
                <el-option label="主档变更" value="主档变更" />
                <el-option label="归属变更" value="归属变更" />
                <el-option label="处方变更" value="处方变更" />
                <el-option label="身份绑定" value="身份绑定" />
                <el-option label="医保变更" value="医保变更" />
                <el-option label="通路变更" value="通路变更" />
                <el-option label="新入" value="新入" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原始状态">
              <el-input v-model="changeRecordForm.originalStatus" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="变更状态">
              <el-input v-model="changeRecordForm.changeStatus" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="责任人">
              <el-input v-model="changeRecordForm.owner" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="复核状态">
              <el-select v-model="changeRecordForm.status">
                <el-option label="待复核" value="待复核" />
                <el-option label="已生效" value="已生效" />
                <el-option label="已审计" value="已审计" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="变更原因">
              <el-input v-model="changeRecordForm.changeReason" type="textarea" :rows="3" placeholder="说明变更依据、复核意见和影响范围" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="changeRecordForm.remark" type="textarea" :rows="3" placeholder="补充下次变更日期、附件和审计说明" />
            </el-form-item>
          </el-col>
        </el-row>

        <div class="guide-change-note">
          <div><span>输入</span><strong>各模块修改申请、复核意见、电子签名和审计日志</strong></div>
          <div><span>输出</span><strong>变更前后值、复核状态、责任人和审计链</strong></div>
          <div><span>下一环节</span><strong>医疗安全审计、权限追溯和报表口径修正</strong></div>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="changeRecordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveChangeRecordDialog">保存</el-button>
      </template>
    </el-drawer>

    <el-drawer v-model="patientDrawerVisible" :title="patientDrawerMode === 'create' ? '新建患者' : '编辑患者基本信息'" size="860px">
      <el-alert
        type="info"
        show-icon
        :closable="false"
        title="此表单与患者中心的“基本信息” tab 同源，人工建档、HIS关联导入和批量导入最终都会沉淀到同一份患者主档。"
      />
      <el-form class="dialog-form" label-width="118px">
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="病案号" required><el-input v-model="basicForm.outpatientNo" placeholder="请输入病案号" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="血透号"><el-input v-model="basicForm.followNo" placeholder="系统自动生成或HIS带入" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="患者姓名" required><el-input v-model="basicForm.name" placeholder="请输入患者姓名" /></el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="性别">
              <el-select v-model="basicForm.gender" placeholder="请选择性别">
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12"><el-form-item label="年龄"><el-input v-model="basicForm.age" placeholder="请输入年龄" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="民族"><el-input v-model="basicForm.nation" placeholder="请输入民族" /></el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="证件类型">
              <el-select v-model="basicForm.idType" placeholder="请选择证件类型">
                <el-option label="中华人民共和国居民身份证" value="中华人民共和国居民身份证" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12"><el-form-item label="证件号" required><el-input v-model="basicForm.idCard" placeholder="请输入证件号" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="手机号" required><el-input v-model="basicForm.phone" placeholder="请输入手机号" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="医保类型"><el-input v-model="basicForm.insurance" placeholder="请输入医保类型" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="医保卡号"><el-input v-model="basicForm.insuranceNo" placeholder="请输入医保卡号" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="首次血透日期"><el-input v-model="basicForm.firstDialysis" placeholder="YYYY-MM-DD" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="首次入院日期"><el-input v-model="basicForm.firstAdmission" placeholder="YYYY-MM-DD" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="最近入院日期"><el-input v-model="basicForm.latestAdmission" placeholder="YYYY-MM-DD" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="责任医生"><el-input v-model="basicForm.doctor" placeholder="请输入责任医生" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="责任护士"><el-input v-model="basicForm.nurse" placeholder="请输入责任护士" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="主诊科室"><el-input v-model="basicForm.hospitalDept" placeholder="请输入主诊科室" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="教育程度"><el-input v-model="basicForm.education" placeholder="请输入教育程度" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="职业"><el-input v-model="basicForm.profession" placeholder="请输入职业" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="婚姻状态"><el-input v-model="basicForm.marriage" placeholder="请输入婚姻状态" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="身高(cm)"><el-input v-model="basicForm.bodyHeight" placeholder="请输入身高" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="过敏史"><el-input v-model="basicForm.allergy" placeholder="请输入过敏史" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="药物过敏"><el-input v-model="basicForm.drugAllergy" placeholder="请输入药物过敏" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="患者标签"><el-input v-model="basicForm.patientTags" placeholder="请输入患者标签" /></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="病情备注"><el-input v-model="basicForm.remark" type="textarea" :rows="3" placeholder="请输入病情备注" /></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="附件"><el-input v-model="basicForm.attachments" type="textarea" :rows="2" placeholder="身份证、医保凭证、外院透析资料等" /></el-form-item></el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="patientDrawerVisible = false">取消</el-button>
        <el-button type="primary" :icon="CircleCheck" @click="savePatientDrawer">保存主档</el-button>
      </template>
    </el-drawer>

    <el-dialog v-model="hisImportDialogVisible" title="HIS关联导入" width="900px">
      <el-form inline>
        <el-form-item label="姓名"><el-input placeholder="姓名" clearable /></el-form-item>
        <el-form-item label="证件号"><el-input placeholder="证件号" clearable /></el-form-item>
        <el-form-item label="门诊/住院号"><el-input placeholder="门诊号 / 住院号" clearable /></el-form-item>
        <el-form-item label="手机号"><el-input placeholder="手机号" clearable /></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询HIS</el-button></el-form-item>
      </el-form>
      <el-table :data="seedRows.slice(0, 4)" border stripe>
        <el-table-column prop="name" label="姓名" width="110" />
        <el-table-column prop="gender" label="性别" width="80" />
        <el-table-column prop="age" label="年龄" width="80" />
        <el-table-column prop="idCard" label="证件号" min-width="170" />
        <el-table-column prop="phone" label="手机号" min-width="130" />
        <el-table-column prop="outpatientNo" label="门诊号" width="120" />
        <el-table-column prop="hospitalDept" label="最近科室" min-width="180" />
        <el-table-column prop="status" label="匹配状态" width="110" />
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="importHisPatient(row)">关联导入</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="hisImportDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="batchImportDialogVisible" title="批量导入患者" width="760px">
      <el-alert type="info" show-icon :closable="false" title="支持Excel模板导入，导入结果分为成功、待复核和失败三类，失败行可导出。"></el-alert>
      <el-form label-width="110px" class="dialog-form">
        <el-form-item label="导入模板"><el-button :icon="Download">下载模板</el-button></el-form-item>
        <el-form-item label="上传文件"><el-upload :auto-upload="false" :limit="1" drag><el-icon><Upload /></el-icon><div class="el-upload__text">拖拽文件到这里或点击上传</div></el-upload></el-form-item>
        <el-form-item label="导入说明"><el-input type="textarea" :rows="4" model-value="姓名、性别、出生日期/年龄、证件号、手机号、医保类型、联系人、地址等字段均可从Excel批量导入。" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="batchImportDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmBatchImport">开始导入</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="exportDialogVisible" title="导出患者数据" width="640px">
      <el-checkbox-group v-model="exportOptions">
        <el-checkbox label="当前列表" />
        <el-checkbox label="筛选结果" />
        <el-checkbox label="待补全患者" />
        <el-checkbox label="导入失败明细" />
        <el-checkbox label="复核差异清单" />
      </el-checkbox-group>
      <template #footer>
        <el-button @click="exportDialogVisible = false">取消</el-button>
        <el-button type="primary" :icon="Download" @click="exportDialogVisible = false; submitAction(`患者导出任务已生成：${exportOptions.join('、') || '当前列表'}，结果将按权限脱敏导出`)">确认导出</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="contactDrawerVisible" title="联系人与医保维护" size="600px">
      <el-form label-width="112px">
        <el-form-item label="患者"><el-input :model-value="selected ? `${selected.name}（${selected.no}）` : ''" disabled /></el-form-item>
        <el-form-item label="主要联系人"><el-input placeholder="姓名 / 关系，例如 王强 / 儿子" /></el-form-item>
        <el-form-item label="联系人电话"><el-input placeholder="请输入联系人电话" /></el-form-item>
        <el-form-item label="家庭地址"><el-input placeholder="省市区、街道、门牌号" /></el-form-item>
        <el-form-item label="医保类型">
          <el-select :model-value="selected?.insurance" placeholder="请选择医保类型">
            <el-option label="城镇医保" value="城镇医保" />
            <el-option label="职工医保" value="职工医保" />
            <el-option label="居民医保" value="居民医保" />
            <el-option label="异地医保" value="异地医保" />
            <el-option label="自费" value="自费" />
          </el-select>
        </el-form-item>
        <el-form-item label="医保号/备案"><el-input placeholder="医保号、异地备案号或自费说明" /></el-form-item>
        <el-form-item label="审核说明"><el-input type="textarea" :rows="3" placeholder="记录证件核验、医保核验和资料来源" /></el-form-item>
      </el-form>
      <div class="drawer-actions">
        <el-button @click="contactDrawerVisible = false">取消</el-button>
        <el-button type="primary" @click="contactDrawerVisible = false; submitAction('联系人和医保资料已更新')">保存资料</el-button>
      </div>
    </el-drawer>

    <el-drawer v-model="certificateDrawerVisible" title="证件证书与附件记录" size="640px">
      <el-form label-width="118px">
        <el-form-item label="患者"><el-input :model-value="selected ? `${selected.name}（${selected.no}）` : ''" disabled /></el-form-item>
        <el-form-item label="证件类型">
          <el-checkbox-group model-value="id">
            <el-checkbox-button label="id">身份证</el-checkbox-button>
            <el-checkbox-button label="insurance">医保凭证</el-checkbox-button>
            <el-checkbox-button label="chronic">慢病备案</el-checkbox-button>
            <el-checkbox-button label="external">外院证明</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="附件清单"><el-input type="textarea" :rows="3" placeholder="身份证正反面、医保备案截图、外院透析记录、死亡证明等附件名称和份数" /></el-form-item>
        <el-form-item label="核验结果">
          <el-radio-group model-value="pending">
            <el-radio-button label="pass">通过</el-radio-button>
            <el-radio-button label="pending">待复核</el-radio-button>
            <el-radio-button label="return">退回补充</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="核验说明"><el-input type="textarea" :rows="3" placeholder="记录附件来源、缺失项、复核人和归档要求" /></el-form-item>
      </el-form>
      <div class="drawer-actions">
        <el-button @click="certificateDrawerVisible = false">取消</el-button>
        <el-button type="primary" @click="certificateDrawerVisible = false; submitAction('证件证书与附件记录已保存，等待复核归档')">保存记录</el-button>
      </div>
    </el-drawer>

    <el-drawer v-model="contractDialogVisible" title="签约/续约服务表单" size="700px">
      <el-form label-width="118px">
        <el-form-item label="患者"><el-input :model-value="selected ? `${selected.name}（${selected.no}）` : ''" disabled /></el-form-item>
        <el-form-item label="签约类型">
          <el-radio-group model-value="renew">
            <el-radio-button label="new">新签</el-radio-button>
            <el-radio-button label="renew">续约</el-radio-button>
            <el-radio-button label="change">服务包变更</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="随访名称"><el-input :model-value="selected?.followName" placeholder="用于患者端、宣教和随访提醒" /></el-form-item>
        <el-form-item label="客户/会员">
          <el-row :gutter="8">
            <el-col :span="12"><el-select :model-value="selected?.customerType" placeholder="客户类型"><el-option label="维持性血透" value="维持性血透" /><el-option label="导管患者" value="导管患者" /><el-option label="隔离透析" value="隔离透析" /><el-option label="临时透析" value="临时透析" /></el-select></el-col>
            <el-col :span="12"><el-select :model-value="'普通'" placeholder="会员等级"><el-option label="普通" value="普通" /><el-option label="银卡" value="银卡" /><el-option label="金卡" value="金卡" /><el-option label="专案" value="专案" /><el-option label="暂停" value="暂停" /></el-select></el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="主要诊断"><el-input :model-value="`${selected?.ckdStage}，${selected?.treatmentStatus}`" placeholder="主诊断、并发症诊断或签约病种" /></el-form-item>
        <el-form-item label="服务包">
          <el-select :model-value="'标准血透服务包'" placeholder="请选择服务包">
            <el-option label="标准血透服务包" value="标准血透服务包" />
            <el-option label="导管护理增强包" value="导管护理增强包" />
            <el-option label="隔离透析服务包" value="隔离透析服务包" />
            <el-option label="临时透析服务包" value="临时透析服务包" />
          </el-select>
        </el-form-item>
        <el-form-item label="签约医院科室"><el-input :model-value="selected?.hospitalDept" /></el-form-item>
        <el-form-item label="医生/护士">
          <el-row :gutter="8">
            <el-col :span="12">
              <el-select model-value="张明"><el-option label="张明" value="张明" /><el-option label="陈宁" value="陈宁" /><el-option label="刘主任" value="刘主任" /></el-select>
            </el-col>
            <el-col :span="12">
              <el-select model-value="周敏"><el-option label="周敏" value="周敏" /><el-option label="赵玲" value="赵玲" /><el-option label="孙涛" value="孙涛" /></el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="有效期"><el-date-picker type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" /></el-form-item>
        <el-form-item label="说明"><el-input type="textarea" :rows="3" placeholder="记录服务内容、续约原因、医保限制和特殊约定" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="contractDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="contractDialogVisible = false; submitAction('签约服务已保存，待复核后输出给归属分配')">保存签约</el-button>
      </template>
    </el-drawer>

    <el-drawer v-model="assignmentDialogVisible" title="责任团队与机位分配" size="700px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="患者">{{ selected?.name }}</el-descriptions-item>
        <el-descriptions-item label="签约状态">已签约 / 待复核</el-descriptions-item>
      </el-descriptions>
      <el-form class="dialog-form" label-width="118px">
        <el-form-item label="随访医院/科室">
          <el-row :gutter="8">
            <el-col :span="12"><el-select :model-value="'总院'"><el-option label="总院" value="总院" /><el-option label="东院" value="东院" /><el-option label="西院" value="西院" /></el-select></el-col>
            <el-col :span="12"><el-select :model-value="current.hospitalDept.split(' / ')[1] ?? '血液净化中心'"><el-option label="血液净化中心" value="血液净化中心" /><el-option label="肾内科" value="肾内科" /><el-option label="隔离透析区" value="隔离透析区" /></el-select></el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="专家团队"><el-select :model-value="'王主任团队'"><el-option label="王主任团队" value="王主任团队" /><el-option label="血管通路团队" value="血管通路团队" /><el-option label="隔离透析团队" value="隔离透析团队" /><el-option label="急诊透析团队" value="急诊透析团队" /></el-select></el-form-item>
        <el-form-item label="主诊/责任护士">
          <el-row :gutter="8">
            <el-col :span="12"><el-select :model-value="'张明'"><el-option label="张明" value="张明" /><el-option label="陈宁" value="陈宁" /><el-option label="刘主任" value="刘主任" /><el-option label="王主任" value="王主任" /></el-select></el-col>
            <el-col :span="12"><el-select :model-value="'周敏'"><el-option label="周敏" value="周敏" /><el-option label="赵玲" value="赵玲" /><el-option label="孙涛" value="孙涛" /></el-select></el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="护理组/机位">
          <el-cascader
            placeholder="请选择护理组和机位意向"
            :options="[
              { label: 'A区一组', value: 'A区一组', children: [{ label: 'A08', value: 'A08' }, { label: 'A10', value: 'A10' }] },
              { label: 'B区二组', value: 'B区二组', children: [{ label: 'B12', value: 'B12' }] },
              { label: '隔离组', value: '隔离组', children: [{ label: 'I03', value: 'I03' }] },
              { label: '急诊组', value: '急诊组', children: [{ label: 'E02', value: 'E02' }] },
            ]"
          />
        </el-form-item>
        <el-form-item label="共享协管">
          <el-checkbox-group model-value="doctor">
            <el-checkbox-button label="doctor">医生站</el-checkbox-button>
            <el-checkbox-button label="nurse">护士站</el-checkbox-button>
            <el-checkbox-button label="home">居家端</el-checkbox-button>
            <el-checkbox-button label="infection">感控</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="分配依据"><el-input type="textarea" :rows="3" placeholder="记录分配依据、隔离要求、患者偏好、资源限制和复核意见" /></el-form-item>
      </el-form>
      <div class="drawer-actions">
        <el-button @click="assignmentDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="assignmentDialogVisible = false; submitAction('责任归属已保存并同步到医生站、护士站')">保存分配</el-button>
      </div>
    </el-drawer>

    <el-drawer v-model="appointmentDialogVisible" title="治疗/随访申请" size="700px">
      <el-form label-width="118px">
        <el-form-item label="患者"><el-input :model-value="selected ? `${selected.name}（${selected.no}）` : ''" disabled /></el-form-item>
        <el-form-item label="责任归属"><el-input :model-value="selected?.hospitalDept" disabled /></el-form-item>
        <el-form-item label="申请类型">
          <el-select :model-value="'血液透析申请/预约'">
            <el-option label="血液透析申请/预约" value="血液透析申请/预约" />
            <el-option label="特殊血液净化申请/预约" value="特殊血液净化申请/预约" />
            <el-option label="深静脉穿刺申请/预约" value="深静脉穿刺申请/预约" />
            <el-option label="手术申请/预约" value="手术申请/预约" />
            <el-option label="随访申请/预约" value="随访申请/预约" />
          </el-select>
        </el-form-item>
        <el-form-item label="模式/项目">
          <el-select :model-value="'HD'">
            <el-option label="HD" value="HD" />
            <el-option label="HDF" value="HDF" />
            <el-option label="HP" value="HP" />
            <el-option label="HDF+HP" value="HDF+HP" />
            <el-option label="深静脉置管" value="CVC" />
            <el-option label="内瘘手术" value="AVF" />
            <el-option label="专家随访" value="follow" />
          </el-select>
        </el-form-item>
        <el-form-item label="频次/班次"><el-row :gutter="8"><el-col :span="12"><el-input :model-value="'每周一三五'" /></el-col><el-col :span="12"><el-input :model-value="'上午班 / A08'" /></el-col></el-row></el-form-item>
        <el-form-item label="首次预约"><el-date-picker type="date" :placeholder="current.firstDialysis" /></el-form-item>
        <el-form-item label="隔离要求">
          <el-select :model-value="'无特殊隔离'">
            <el-option label="无特殊隔离" value="无特殊隔离" />
            <el-option label="乙肝隔离" value="乙肝隔离" />
            <el-option label="导管护理" value="导管护理" />
            <el-option label="急诊评估" value="急诊评估" />
          </el-select>
        </el-form-item>
        <el-form-item label="申请依据"><el-input type="textarea" :rows="3" placeholder="医嘱依据、首透要求、病情风险、患者偏好和资料缺项" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="appointmentDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="appointmentDialogVisible = false; submitAction('治疗申请已提交，等待预约审核')">提交申请</el-button>
      </template>
    </el-drawer>

    <el-dialog v-model="deathDialogVisible" title="死亡记录登记" width="620px">
      <el-alert type="warning" show-icon :closable="false" title="死亡记录会联动退出、签约解约、预约取消、费用结清和统计口径。" />
      <el-form class="dialog-form" label-width="110px">
        <el-form-item label="患者"><el-input :model-value="selected ? `${selected.name}（${selected.no}）` : ''" disabled /></el-form-item>
        <el-form-item label="死亡日期"><el-date-picker type="date" placeholder="选择日期" /></el-form-item>
        <el-form-item label="证明来源">
          <el-select placeholder="请选择">
            <el-option label="院内死亡证明" value="hospital" />
            <el-option label="外院死亡证明" value="external" />
            <el-option label="家属告知待补证" value="family" />
          </el-select>
        </el-form-item>
        <el-form-item label="附件说明"><el-input type="textarea" :rows="3" placeholder="死亡证明、家属联系记录、费用结清和资料交接说明" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="deathDialogVisible = false">取消</el-button><el-button type="danger" @click="deathDialogVisible = false; submitAction('死亡记录已提交，联动生成退出和解约复核任务')">提交死亡记录</el-button></template>
    </el-dialog>

    <el-dialog v-model="exitDialogVisible" title="退出病员登记" width="580px">
      <el-alert type="warning" show-icon :closable="false" title="退出会影响预约、排班、费用、随访和在管患者统计，提交后需复核归档。" />
      <el-form class="dialog-form" label-width="108px">
        <el-form-item label="患者"><el-input :model-value="selected ? `${selected.name}（${selected.no}）` : ''" disabled /></el-form-item>
        <el-form-item label="退出原因">
          <el-select placeholder="请选择退出原因">
            <el-option label="转院" value="transfer" />
            <el-option label="停止透析" value="stop" />
            <el-option label="死亡" value="death" />
            <el-option label="失访" value="lost" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="退出日期"><el-date-picker type="date" placeholder="选择日期" /></el-form-item>
        <el-form-item label="交接事项"><el-input type="textarea" :rows="3" placeholder="记录未完成预约、欠费、药耗、资料归档和联系记录" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="exitDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="exitDialogVisible = false; submitAction('退出登记已提交，等待归档复核')">提交退出</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="患者主档追溯" size="520px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-10 08:30" type="primary">导诊创建患者主档：{{ selected?.name }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 08:42">补充联系人、医保、客户类型、院区科室和过敏史</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 09:00" type="success">资料核验通过，输出给签约续约解约页面</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 09:30">签约后进入责任归属和预约申请</el-timeline-item>
      </el-timeline>
    </el-drawer>

    <el-dialog
      v-model="accessDialogVisible"
      :title="accessDialogMode === 'edit' ? '编辑通路' : '新增通路'"
      width="1020px"
      class="guide-access-dialog"
    >
      <el-row :gutter="20">
        <el-col :xs="24" :xl="16">
          <el-form class="guide-access-dialog-form" label-width="104px">
            <div class="guide-access-dialog-section">
              <div class="guide-access-section-title">基本信息</div>
              <el-row :gutter="16" class="guide-access-grid">
                <el-col :xs="24" :md="12">
                  <div class="guide-form-item"><label>手术名称</label><el-select v-model="accessForm.surgeryName" placeholder="请选择手术名称" clearable><el-option label="动静脉内瘘成形术" value="动静脉内瘘成形术" /><el-option label="中心静脉置管术" value="中心静脉置管术" /><el-option label="人工血管移植术" value="人工血管移植术" /><el-option label="导管拔除术" value="导管拔除术" /><el-option label="其他" value="其他" /></el-select></div>
                </el-col>
                <el-col :xs="24" :md="12">
                  <div class="guide-form-item"><label>手术日期</label><el-date-picker v-model="accessForm.surgeryDate" type="date" value-format="YYYY-MM-DD" /></div>
                </el-col>
                <el-col :xs="24" :md="12">
                  <div class="guide-form-item"><label>首次使用日期</label><el-date-picker v-model="accessForm.firstUseDate" type="date" value-format="YYYY-MM-DD" /></div>
                </el-col>
                <el-col :xs="24" :md="12">
                  <div class="guide-form-item">
                    <label>通路位置</label>
                    <el-radio-group v-model="accessForm.side">
                      <el-radio-button label="左">左</el-radio-button>
                      <el-radio-button label="右">右</el-radio-button>
                    </el-radio-group>
                  </div>
                </el-col>
                <el-col :xs="24">
                  <div class="guide-form-item guide-form-item-wide">
                    <label>通路类型</label>
                    <el-radio-group v-model="accessForm.accessType" class="guide-access-radio-group">
                      <el-radio value="无隧道和涤纶套的透析导管">无隧道和涤纶套的透析导管</el-radio>
                      <el-radio value="带隧道和涤纶套的透析导管">带隧道和涤纶套的透析导管</el-radio>
                      <el-radio value="自体动静脉内瘘">自体动静脉内瘘</el-radio>
                      <el-radio value="移植物动静脉内瘘">移植物动静脉内瘘</el-radio>
                      <el-radio value="动静脉直接穿刺">动静脉直接穿刺</el-radio>
                      <el-radio value="其他">其他</el-radio>
                    </el-radio-group>
                  </div>
                </el-col>
                <el-col :xs="24">
                  <div class="guide-form-item guide-form-item-wide">
                    <label>状态</label>
                    <el-radio-group v-model="accessForm.status">
                      <el-radio-button label="正常">正常</el-radio-button>
                      <el-radio-button label="未成熟">未成熟</el-radio-button>
                      <el-radio-button label="修复中">修复中</el-radio-button>
                      <el-radio-button label="失去功能">失去功能</el-radio-button>
                    </el-radio-group>
                  </div>
                </el-col>
                <el-col :xs="24">
                  <div class="guide-access-inline-checks">
                    <el-checkbox v-model="accessForm.nonHospitalSurgery">非本院手术</el-checkbox>
                    <el-checkbox v-model="accessForm.registerSurgeryInfo">登记手术信息</el-checkbox>
                  </div>
                </el-col>
                <el-col :xs="24">
                  <div class="guide-form-item guide-form-item-wide">
                    <label>备注</label>
                    <el-input v-model="accessForm.remark" type="textarea" :rows="3" placeholder="记录手术来源、通路使用限制、感控提示和后续随访要求" />
                  </div>
                </el-col>
              </el-row>
            </div>

            <div class="guide-access-dialog-section">
              <div class="guide-access-section-title">穿刺计划</div>
              <el-row :gutter="16" class="guide-access-plan-grid">
                <el-col :xs="24" :md="6">
                  <div class="guide-access-upload-box">
                    <el-icon><DocumentAdd /></el-icon>
                    <span>上传穿刺计划</span>
                  </div>
                </el-col>
                <el-col :xs="24" :md="18">
                  <el-input
                    v-model="accessForm.puncturePlan"
                    type="textarea"
                    :rows="4"
                    placeholder="填写穿刺路线、左右侧轮换、导管连接、穿刺点轮换或特殊禁忌"
                  />
                </el-col>
              </el-row>
              <el-input
                v-model="accessForm.puncturePlanNote"
                class="guide-access-note-input"
                type="textarea"
                :rows="3"
                placeholder="补充穿刺计划说明、耗材要求、责任人和提醒事项"
              />
            </div>

            <div class="guide-access-dialog-section">
              <div class="guide-access-section-title">
                <span>关键节点提醒</span>
                <el-button link type="primary" :icon="CircleCheck" @click="addAccessReminderNode">新增节点</el-button>
              </div>
              <el-table :data="accessDialogReminderRows" border size="small" class="guide-access-reminder-table">
                <el-table-column prop="nodeName" label="节点名称" min-width="140" />
                <el-table-column prop="remindTime" label="提醒时间" min-width="150" />
                <el-table-column prop="handled" label="已处理" width="90" />
                <el-table-column prop="handler" label="处理人" min-width="110" />
                <el-table-column prop="handledTime" label="处理时间" min-width="150" />
              </el-table>
            </div>
          </el-form>
        </el-col>

        <el-col :xs="24" :xl="8">
          <el-card class="guide-access-side-card" shadow="never">
            <template #header>
              <div class="guide-access-card-header">
                <strong>闭环提示</strong>
                <el-tag type="primary" effect="plain">{{ accessDialogMode === 'edit' ? '编辑中' : '新建中' }}</el-tag>
              </div>
            </template>
            <div class="guide-access-side-summary">
              <div><span>患者</span><strong>{{ current.name }} / {{ current.no }}</strong></div>
              <div><span>当前通路</span><strong>{{ currentAccessRecord.accessTitle }}</strong></div>
              <div><span>风险</span><strong>{{ currentAccessRecord.riskLevel }}</strong></div>
              <div><span>下一环节</span><strong>医生处方、护士上机核对、感控与预警</strong></div>
            </div>
            <div class="guide-access-check-list">
              <div><span>输入</span><strong>手术名称、日期、位置、类型、状态和穿刺计划</strong></div>
              <div><span>输出</span><strong>通路主档、关键节点提醒和责任人闭环</strong></div>
              <div><span>下一环节</span><strong>医生处方、护士上机核对、感控和预警</strong></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <template #footer>
        <el-button @click="accessDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveAccessDialog">保存通路</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="repairDialogVisible"
      :title="`${current.name}通路修复`"
      width="1020px"
      class="guide-access-dialog"
    >
      <el-form class="guide-access-dialog-form guide-repair-dialog-form" label-width="96px">
        <el-row :gutter="16" class="guide-access-grid">
          <el-col :xs="24" :md="12">
            <div class="guide-form-item"><label>手术名称</label><el-select v-model="repairForm.surgeryName" placeholder="请选择手术名称" clearable><el-option label="通路修复" value="通路修复" /><el-option label="导管复通" value="导管复通" /><el-option label="血栓取出" value="血栓取出" /><el-option label="通路重建" value="通路重建" /><el-option label="其他" value="其他" /></el-select></div>
          </el-col>
          <el-col :xs="24" :md="12">
            <div class="guide-form-item"><label>血管通路</label><el-select v-model="repairForm.accessName" placeholder="请选择" clearable><el-option v-for="row in accessRecords" :key="row.id" :label="row.accessTitle" :value="row.accessTitle" /></el-select></div>
          </el-col>
          <el-col :xs="24">
            <div class="guide-form-item guide-form-item-wide">
              <label>通路问题</label>
              <div class="guide-repair-problem-field">
                <el-select v-model="repairForm.problem" placeholder="请选择通路问题" clearable>
                  <el-option v-for="option in repairProblemOptions" :key="option" :label="option" :value="option" />
                </el-select>
                <el-button :icon="DocumentAdd" @click="addRepairProblem" />
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :md="12">
            <div class="guide-form-item"><label>修复手术日期</label><el-date-picker v-model="repairForm.repairDate" type="date" value-format="YYYY-MM-DD" placeholder="请选择手术日期" /></div>
          </el-col>
          <el-col :xs="24" :md="12">
            <div class="guide-form-item"><label>手术医生</label><el-select v-model="repairForm.surgeon" placeholder="请选择" clearable><el-option label="王磊" value="王磊" /><el-option label="张明" value="张明" /><el-option label="孙涛" value="孙涛" /><el-option label="周敏" value="周敏" /></el-select></div>
          </el-col>
          <el-col :xs="24" :md="12">
            <div class="guide-form-item"><label>B超医生</label><el-select v-model="repairForm.bUltrasoundDoctor" placeholder="请选择" clearable><el-option label="刘楠" value="刘楠" /><el-option label="李倩" value="李倩" /><el-option label="陈洁" value="陈洁" /></el-select></div>
          </el-col>
          <el-col :xs="24" :md="12">
            <div class="guide-form-item"><label>手术助手</label><el-select v-model="repairForm.assistantDoctor" placeholder="请选择" clearable><el-option label="周敏" value="周敏" /><el-option label="陈洁" value="陈洁" /><el-option label="裴瑶强" value="裴瑶强" /></el-select></div>
          </el-col>
          <el-col :xs="24" :md="12">
            <div class="guide-form-item"><label>手术护士</label><el-select v-model="repairForm.nurse" placeholder="请选择" clearable><el-option label="陈洁" value="陈洁" /><el-option label="周敏" value="周敏" /><el-option label="李倩" value="李倩" /></el-select></div>
          </el-col>
          <el-col :xs="24" :md="12">
            <div class="guide-form-item">
              <label>当前可用</label>
              <el-switch v-model="repairForm.currentAvailable" />
            </div>
          </el-col>
          <el-col :xs="24" :md="12">
            <div class="guide-form-item"><label>预计可用日期</label><el-date-picker v-model="repairForm.availableDate" type="date" value-format="YYYY-MM-DD" placeholder="请选择预计可用日期" /></div>
          </el-col>
          <el-col :xs="24">
            <div class="guide-access-inline-checks guide-repair-inline-checks">
              <el-checkbox v-model="repairForm.nonHospitalRepair">非本院修复</el-checkbox>
            </div>
          </el-col>
          <el-col :xs="24">
            <div class="guide-form-item guide-form-item-wide">
              <label>备注</label>
              <el-input v-model="repairForm.remark" type="textarea" :rows="3" placeholder="记录修复来源、处理经过、感控提示和后续复评要求" />
            </div>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="repairDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRepairDialog">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="identityBindingDialogVisible"
      :title="identityBindingDialogMode === 'edit' ? '编辑身份绑定' : '新增身份绑定'"
      width="980px"
      class="guide-identity-dialog"
    >
      <el-row :gutter="20">
        <el-col :xs="24" :xl="16">
          <el-form class="guide-access-dialog-form" label-width="104px">
            <div v-if="identityBindingActiveTab === 'card'" class="guide-access-dialog-section">
              <div class="guide-access-section-title">透析卡</div>
              <el-row :gutter="16" class="guide-access-grid">
                <el-col :xs="24" :md="12"><div class="guide-form-item"><label>卡号</label><el-input v-model="identityBindingForm.cardNo" /></div></el-col>
                <el-col :xs="24" :md="12"><div class="guide-form-item"><label>卡类型</label><el-input v-model="identityBindingForm.cardType" /></div></el-col>
                <el-col :xs="24" :md="12"><div class="guide-form-item"><label>患者姓名</label><el-input v-model="identityBindingForm.patientName" /></div></el-col>
                <el-col :xs="24" :md="12"><div class="guide-form-item"><label>使用状态</label><el-select v-model="identityBindingForm.useStatus"><el-option label="使用中" value="使用中" /><el-option label="已停用" value="已停用" /><el-option label="已解绑" value="已解绑" /></el-select></div></el-col>
                <el-col :xs="24" :md="12"><div class="guide-form-item"><label>创建时间</label><el-date-picker v-model="identityBindingForm.createdAt" type="datetime" value-format="YYYY-MM-DD HH:mm" /></div></el-col>
                <el-col :xs="24"><div class="guide-form-item guide-form-item-wide"><label>备注</label><el-input v-model="identityBindingForm.remark" type="textarea" :rows="3" /></div></el-col>
              </el-row>
            </div>

            <div v-else-if="identityBindingActiveTab === 'barcode'" class="guide-access-dialog-section">
              <div class="guide-access-section-title">条形码</div>
              <el-row :gutter="16" class="guide-access-grid">
                <el-col :xs="24" :md="12"><div class="guide-form-item"><label>条码内容</label><el-input v-model="identityBindingForm.barcodeContent" /></div></el-col>
                <el-col :xs="24" :md="12"><div class="guide-form-item"><label>显示文本</label><el-input v-model="identityBindingForm.barcodeText" /></div></el-col>
                <el-col :xs="24" :md="12"><div class="guide-form-item"><label>打印规格</label><el-input v-model="identityBindingForm.barcodeSpec" /></div></el-col>
                <el-col :xs="24" :md="12"><div class="guide-form-item"><label>引用状态</label><el-select v-model="identityBindingForm.useStatus"><el-option label="已绑定" value="已绑定" /><el-option label="已打印" value="已打印" /><el-option label="待打印" value="待打印" /></el-select></div></el-col>
              </el-row>
            </div>

            <div v-else class="guide-access-dialog-section">
              <div class="guide-access-section-title">人脸信息</div>
              <el-row :gutter="16" class="guide-access-grid">
                <el-col :xs="24" :md="12"><div class="guide-form-item"><label>采集来源</label><el-input v-model="identityBindingForm.faceSource" /></div></el-col>
                <el-col :xs="24" :md="12"><div class="guide-form-item"><label>有效期</label><el-date-picker v-model="identityBindingForm.faceExpire" type="date" value-format="YYYY-MM-DD" /></div></el-col>
                <el-col :xs="24" :md="12"><div class="guide-form-item"><label>采集设备</label><el-input v-model="identityBindingForm.faceDevice" /></div></el-col>
                <el-col :xs="24" :md="12"><div class="guide-form-item"><label>状态</label><el-select v-model="identityBindingForm.faceStatus"><el-option label="已绑定" value="已绑定" /><el-option label="待采集" value="待采集" /><el-option label="已过期" value="已过期" /></el-select></div></el-col>
                <el-col :xs="24"><div class="guide-form-item guide-form-item-wide"><label>说明</label><el-input v-model="identityBindingForm.faceRemark" type="textarea" :rows="3" /></div></el-col>
              </el-row>
            </div>
          </el-form>
        </el-col>

        <el-col :xs="24" :xl="8">
          <el-card class="guide-access-side-card" shadow="never">
            <template #header>
              <div class="guide-access-card-header">
                <strong>闭环提示</strong>
                <el-tag type="primary" effect="plain">{{ identityBindingDialogMode === 'edit' ? '编辑中' : '新建中' }}</el-tag>
              </div>
            </template>
            <div class="guide-identity-side-summary">
              <div><span>患者</span><strong>{{ current.name }} / {{ current.no }}</strong></div>
              <div><span>当前对象</span><strong>{{ currentIdentityBindingRecord.title }}</strong></div>
              <div><span>当前标识</span><strong>{{ currentIdentityBindingRecord.value }}</strong></div>
              <div><span>下一环节</span><strong>签到、上机核对、患者端登录和接口同步</strong></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <template #footer>
        <el-button @click="identityBindingDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveIdentityBindingDialog">保存绑定</el-button>
      </template>
    </el-dialog>
  </section>
</template>
