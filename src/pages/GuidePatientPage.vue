<script setup lang="ts">
import { computed, ref } from 'vue';
import { Check, CircleCheck, DocumentAdd, Download, EditPen, Files, Message, Printer, Search, User, Warning } from '@element-plus/icons-vue';
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

const activeTab = ref('basic');
const activeDiagnosisTab = ref('main');
const activePlanMode = ref('HD方案');
const activePlanTerm = ref<'long' | 'temp'>('long');
const selectedTempPlanId = ref('');
const tempPlanFormVisible = ref(false);
const longPlanEditing = ref(false);
const vascularAccessFieldCount = ref(1);
const recordDialogVisible = ref(false);
const activeVisitKind = ref<VisitKind>('outpatient');
const visitDialogVisible = ref(false);
const activeEmrTab = ref('home');
const basicEditing = ref(false);
const patientDrawerVisible = ref(false);
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

const rows: PatientRecord[] = [
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

const current = computed(() => selected.value ?? rows[0]);

const dialysisRecordRows: DialysisRecordRow[] = [];

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

const basicForm = ref<BasicInfoForm>(makeBasicInfoForm(current.value));

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
    anticoagulation: ['dialysis_prescription', 'medical_order', 'order_execution', 'medication_consumption'],
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
  if (['待确认', '建档中', '资料待补', '待复核', '待补证', '待审核', '待执行', '待核对', '待评估', '待处理', '观察', '关注', '随访', '备用', '上机核对'].includes(status)) return 'warning';
  if (['退出待归档', '已解约', '退回修改', '暂停', '异常', '未达标'].includes(status)) return 'danger';
  return 'info';
}

function selectRow(row: PatientRecord): void {
  selected.value = row;
  basicEditing.value = false;
  basicForm.value = makeBasicInfoForm(row);
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
  selected.value = row ?? current.value;
  patientDrawerVisible.value = true;
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

function submitAction(message: string): void {
  ElMessage.success(message);
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

    <el-drawer v-model="patientDrawerVisible" title="新增/编辑患者主档" size="680px">
      <el-form label-width="116px">
        <el-form-item label="患者姓名"><el-input :model-value="selected?.name" placeholder="请输入患者姓名" /></el-form-item>
        <el-form-item label="性别年龄">
          <el-row :gutter="8">
            <el-col :span="12">
              <el-select :model-value="selected?.gender" placeholder="性别">
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
              </el-select>
            </el-col>
            <el-col :span="12"><el-input placeholder="年龄" :model-value="selected?.age" /></el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="证件号"><el-input :model-value="selected?.idCard" placeholder="请输入身份证或其他证件号" /></el-form-item>
        <el-form-item label="联系电话"><el-input :model-value="selected?.phone" placeholder="请输入联系电话" /></el-form-item>
        <el-form-item label="地址记录"><el-input placeholder="户籍地址、现住址、透析接送地址" /></el-form-item>
        <el-form-item label="门诊/住院号"><el-input :model-value="selected?.outpatientNo" placeholder="门诊号、住院号或外院来源号" /></el-form-item>
        <el-form-item label="客户类型">
          <el-select :model-value="selected?.customerType" placeholder="请选择客户类型">
            <el-option label="维持性血透" value="维持性血透" />
            <el-option label="导管患者" value="导管患者" />
            <el-option label="隔离透析" value="隔离透析" />
            <el-option label="临时透析" value="临时透析" />
          </el-select>
        </el-form-item>
        <el-form-item label="院区科室床位"><el-input :model-value="selected?.hospitalDept" placeholder="院区 / 科室 / 病区 / 床位" /></el-form-item>
        <el-form-item label="过敏及风险"><el-input type="textarea" :rows="3" :model-value="selected?.allergy" placeholder="过敏史、感染标识、导管状态、医保异常或沟通要求" /></el-form-item>
      </el-form>
      <div class="drawer-actions">
        <el-button @click="patientDrawerVisible = false">取消</el-button>
        <el-button type="primary" :icon="CircleCheck" @click="patientDrawerVisible = false; submitAction('患者主档已保存，等待资料核验或签约')">保存主档</el-button>
      </div>
    </el-drawer>

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
  </section>
</template>
