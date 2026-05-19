import type { PageContext, Tone } from '../types';
import { getChronicPageDoc } from './chronicPageDocs';

export interface ChronicMetric {
  label: string;
  value: string;
  tone: Tone;
  hint: string;
}

export interface ChronicTableColumn {
  prop: string;
  label: string;
  minWidth?: number;
  width?: number;
}

export interface ChronicTableRow {
  id: string;
  [key: string]: string;
}

export interface ChronicWorkbenchSection {
  title: string;
  items: string[];
}

export interface ChronicPrototypePageSpec {
  title: string;
  subtitle: string;
  activeObject: string;
  sourceDocs: string[];
  filters: string[];
  actions: string[];
  metrics: ChronicMetric[];
  columns: ChronicTableColumn[];
  rows: ChronicTableRow[];
  sections: ChronicWorkbenchSection[];
  detailItems: Array<{ label: string; value: string }>;
  riskAlerts: string[];
  timeline: string[];
  upstream: string[];
  downstream: string[];
  primaryFlow: ChronicOperationStep[];
  rowOperations: ChronicRowOperation[];
  quickLinks: ChronicQuickLink[];
  formFields: ChronicFormField[];
  auditTrail: ChronicAuditItem[];
}

export interface ChronicOperationStep {
  key: string;
  label: string;
  desc: string;
  actionText: string;
}

export interface ChronicRowOperation {
  key: string;
  label: string;
  type: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  targetStatus: string;
  feedback: string;
}

export interface ChronicQuickLink {
  label: string;
  workspace: string;
  menuKey: string;
  desc: string;
}

export interface ChronicFormField {
  label: string;
  prop: string;
  component: 'input' | 'select' | 'date' | 'textarea';
  placeholder: string;
  options?: string[];
}

export interface ChronicAuditItem {
  title: string;
  desc: string;
  time: string;
}

const patientNames = ['王建国', '李秀兰', '陈志强', '赵敏', '周国平', '孙美娟', '刘海峰', '郑晓燕', '胡春梅', '马立新', '郭文清', '何雨晴'];
const diseases = ['糖尿病肾病', '高血压合并心衰', '慢阻肺', '脑卒中恢复期', '慢性肾病3期', '冠心病', '肿瘤康复', '老年多病共存'];
const teams = ['东区慢病团队', '南区居家病房组', '北区医护协同组', '远程随访团队'];
const owners = ['张医生 / 林护士', '吴医生 / 陈护士', '黄医生 / 赵护士', '许医生 / 周护士'];

type ChronicMenuSpecOverride = Partial<
  Pick<
    ChronicPrototypePageSpec,
    | 'title'
    | 'subtitle'
    | 'filters'
    | 'actions'
    | 'metrics'
    | 'columns'
    | 'rows'
    | 'detailItems'
    | 'riskAlerts'
    | 'timeline'
    | 'upstream'
    | 'downstream'
    | 'primaryFlow'
    | 'rowOperations'
    | 'quickLinks'
    | 'formFields'
    | 'auditTrail'
  >
>;

function makeRows(menuKey: string, rows: Array<Omit<ChronicTableRow, 'id'>>): ChronicTableRow[] {
  return rows.map((row, index) => ({
    id: `${menuKey}-${index + 1}`,
    ...row,
  }));
}

const firstBatchMenuSpecs: Record<string, ChronicMenuSpecOverride> = {
  'guide-patient': {
    title: '患者中心',
    subtitle: '导诊台用于完成慢病居家住院式管理的患者建档、身份查重、联系人、医保、疾病标签和纳入前资料核验。',
    filters: ['姓名/证件/手机号', '建档状态', '医保类型', '风险等级'],
    actions: ['新增患者', '身份证读卡', '患者查重', '导入既往资料'],
    metrics: [
      { label: '今日新建', value: '12', tone: 'blue', hint: '导诊新增患者主档' },
      { label: '疑似重复', value: '3', tone: 'orange', hint: '姓名证件或手机号相似' },
      { label: '资料缺项', value: '8', tone: 'red', hint: '联系人、医保或同意书缺失' },
      { label: '可签约', value: '46', tone: 'green', hint: '资料已核验' },
    ],
    columns: [
      { prop: 'subject', label: '患者姓名', minWidth: 110 },
      { prop: 'idNo', label: '证件号', minWidth: 170 },
      { prop: 'mobile', label: '手机号', minWidth: 130 },
      { prop: 'disease', label: '慢病标签', minWidth: 150 },
      { prop: 'insurance', label: '医保类型', minWidth: 120 },
      { prop: 'status', label: '建档状态', minWidth: 120 },
      { prop: 'owner', label: '导诊责任人', minWidth: 120 },
      { prop: 'nextAction', label: '下一步', minWidth: 170 },
      { prop: 'time', label: '登记时间', width: 110 },
    ],
    rows: makeRows('guide-patient', [
      { subject: '王建国', idNo: '310101196805142019', mobile: '138****2019', disease: '糖尿病肾病', insurance: '职工医保', status: '资料待补全', owner: '导诊-沈洁', nextAction: '补录联系人与医保凭证', time: '08:20' },
      { subject: '李秀兰', idNo: '310105195911032226', mobile: '139****2226', disease: '高血压合并心衰', insurance: '居民医保', status: '疑似重复', owner: '导诊-沈洁', nextAction: '合并既往档案', time: '08:36' },
      { subject: '陈志强', idNo: '320112197402186511', mobile: '137****6511', disease: '慢阻肺', insurance: '异地医保', status: '待核验', owner: '导诊-黄莹', nextAction: '核验异地医保备案', time: '09:05' },
      { subject: '赵敏', idNo: '330106198812056028', mobile: '136****6028', disease: '脑卒中恢复期', insurance: '自费', status: '可签约', owner: '导诊-黄莹', nextAction: '进入签约服务包选择', time: '09:30' },
      { subject: '周国平', idNo: '310109196301097834', mobile: '135****7834', disease: '慢性肾病3期', insurance: '职工医保', status: '可签约', owner: '导诊-沈洁', nextAction: '确认随访名称', time: '10:12' },
      { subject: '孙美娟', idNo: '310115197711246613', mobile: '139****6613', disease: '冠心病', insurance: '居民医保', status: '资料待补全', owner: '导诊-黄莹', nextAction: '补传出院小结', time: '10:38' },
      { subject: '刘海峰', idNo: '320583196909168812', mobile: '138****8812', disease: '老年多病共存', insurance: '职工医保', status: '待核验', owner: '导诊-沈洁', nextAction: '完善紧急联系人', time: '11:04' },
      { subject: '郑晓燕', idNo: '310104198505203342', mobile: '137****3342', disease: '肿瘤康复', insurance: '商业保险', status: '可签约', owner: '导诊-黄莹', nextAction: '进入签约审核', time: '11:22' },
      { subject: '胡春梅', idNo: '310106196612178821', mobile: '136****8821', disease: '糖尿病足风险', insurance: '居民医保', status: '高风险待评估', owner: '导诊-沈洁', nextAction: '转医生纳入前评估', time: '13:10' },
      { subject: '马立新', idNo: '310107195803262416', mobile: '135****2416', disease: '心衰NYHA III', insurance: '职工医保', status: '可签约', owner: '导诊-黄莹', nextAction: '选择服务包', time: '14:05' },
    ]),
    primaryFlow: [
      { key: 'duplicate', label: '身份查重', desc: '按证件号、手机号、姓名生日组合查重，避免重复建档。', actionText: '患者查重' },
      { key: 'create', label: '新建主档', desc: '登记患者基本信息、慢病标签、医保类型和紧急联系人。', actionText: '新增患者' },
      { key: 'verify', label: '资料核验', desc: '核验身份证、医保、出院小结和知情材料完整性。', actionText: '提交核验' },
      { key: 'contract', label: '转签约', desc: '资料合格后进入签约续约解约页面选择服务关系。', actionText: '进入签约' },
    ],
    rowOperations: [
      { key: 'open', label: '编辑', type: 'primary', targetStatus: '资料待补全', feedback: '已打开患者主档编辑表单。' },
      { key: 'review', label: '核验', type: 'warning', targetStatus: '待核验', feedback: '已提交资料核验，导诊主管收到复核任务。' },
      { key: 'activate', label: '转签约', type: 'success', targetStatus: '可签约', feedback: '患者资料已通过，可进入签约服务包选择。' },
      { key: 'trace', label: '轨迹', type: 'info', targetStatus: '可签约', feedback: '已打开患者建档、查重、资料修改轨迹。' },
    ],
    formFields: [
      { label: '患者姓名', prop: 'patientName', component: 'input', placeholder: '请输入患者真实姓名' },
      { label: '证件号码', prop: 'idNo', component: 'input', placeholder: '身份证/护照/医保电子凭证' },
      { label: '联系电话', prop: 'mobile', component: 'input', placeholder: '患者本人手机号' },
      { label: '医保类型', prop: 'insurance', component: 'select', placeholder: '请选择医保类型', options: ['职工医保', '居民医保', '异地医保', '商业保险', '自费'] },
      { label: '慢病标签', prop: 'diseaseTag', component: 'select', placeholder: '请选择主要管理病种', options: diseases },
      { label: '紧急联系人', prop: 'contactName', component: 'input', placeholder: '姓名/关系/电话' },
      { label: '资料备注', prop: 'remark', component: 'textarea', placeholder: '填写出院来源、病史摘要、资料缺项说明' },
    ],
    quickLinks: [
      { label: '签约服务', workspace: '导诊台', menuKey: 'guide-contract', desc: '资料核验后进入签约、续约、解约办理' },
      { label: '归属分配', workspace: '导诊台', menuKey: 'guide-owner', desc: '签约后分配主诊医生和责任护士' },
      { label: '医生评估', workspace: '医生站', menuKey: 'doctor-my', desc: '高风险患者转医生纳入前评估' },
    ],
  },
  'guide-contract': {
    title: '签约续约解约',
    subtitle: '围绕居家住院式服务关系办理签约、续约、暂停、解约和服务包变更，输出患者在管状态。',
    filters: ['患者姓名/证件号', '签约状态', '服务包', '到期时间'],
    actions: ['新签约', '续约', '解约登记', '服务包变更'],
    metrics: [
      { label: '在管签约', value: '286', tone: 'blue', hint: '当前生效服务关系' },
      { label: '30天内到期', value: '22', tone: 'orange', hint: '需要续约提醒' },
      { label: '待审核', value: '9', tone: 'red', hint: '材料或费用待复核' },
      { label: '本月续约率', value: '93%', tone: 'green', hint: '到期患者续约比例' },
    ],
    columns: [
      { prop: 'subject', label: '患者', minWidth: 110 },
      { prop: 'packageName', label: '服务包', minWidth: 150 },
      { prop: 'startDate', label: '开始日期', width: 110 },
      { prop: 'endDate', label: '到期日期', width: 110 },
      { prop: 'status', label: '签约状态', minWidth: 120 },
      { prop: 'feeStatus', label: '费用状态', minWidth: 110 },
      { prop: 'owner', label: '经办人', minWidth: 120 },
      { prop: 'nextAction', label: '下一步', minWidth: 170 },
    ],
    rows: makeRows('guide-contract', [
      { subject: '赵敏', packageName: '脑卒中居家康复包', startDate: '2026-05-14', endDate: '2026-08-13', status: '待审核', feeStatus: '待缴费', owner: '导诊-黄莹', nextAction: '提交签约材料审核', disease: '脑卒中恢复期', time: '今日' },
      { subject: '周国平', packageName: '肾病稳定期管理包', startDate: '2026-04-01', endDate: '2026-06-30', status: '在管', feeStatus: '正常', owner: '导诊-沈洁', nextAction: '续约提醒', disease: '慢性肾病3期', time: '30天' },
      { subject: '马立新', packageName: '心衰强化随访包', startDate: '2026-05-10', endDate: '2026-08-09', status: '在管', feeStatus: '正常', owner: '导诊-黄莹', nextAction: '生成首次随访任务', disease: '心衰NYHA III', time: '今日' },
      { subject: '李秀兰', packageName: '高血压心衰共管包', startDate: '2026-02-12', endDate: '2026-05-20', status: '待续约', feeStatus: '正常', owner: '导诊-沈洁', nextAction: '联系家属续约', disease: '高血压合并心衰', time: '6天' },
      { subject: '郑晓燕', packageName: '肿瘤康复随访包', startDate: '2026-05-14', endDate: '2026-07-13', status: '待审核', feeStatus: '已预缴', owner: '导诊-黄莹', nextAction: '复核知情同意书', disease: '肿瘤康复', time: '今日' },
      { subject: '孙美娟', packageName: '冠心病居家管理包', startDate: '2026-03-01', endDate: '2026-05-31', status: '暂停服务', feeStatus: '欠费', owner: '导诊-沈洁', nextAction: '欠费提醒并暂停非紧急服务', disease: '冠心病', time: '17天' },
      { subject: '刘海峰', packageName: '老年多病共管包', startDate: '2026-05-01', endDate: '2026-07-31', status: '在管', feeStatus: '正常', owner: '导诊-黄莹', nextAction: '确认家庭医生协作', disease: '老年多病共存', time: '本周' },
      { subject: '胡春梅', packageName: '糖尿病足风险包', startDate: '2026-05-13', endDate: '2026-08-12', status: '医生评估中', feeStatus: '待缴费', owner: '导诊-沈洁', nextAction: '等待纳入前评估结论', disease: '糖尿病足风险', time: '明日' },
      { subject: '王建国', packageName: '糖尿病肾病管理包', startDate: '2026-04-15', endDate: '2026-07-14', status: '在管', feeStatus: '正常', owner: '导诊-黄莹', nextAction: '服务包升级评估', disease: '糖尿病肾病', time: '本月' },
      { subject: '陈志强', packageName: '慢阻肺居家随访包', startDate: '2026-03-20', endDate: '2026-06-19', status: '解约申请', feeStatus: '待结算', owner: '导诊-沈洁', nextAction: '登记解约原因并结算', disease: '慢阻肺', time: '待办' },
    ]),
    primaryFlow: [
      { key: 'sign', label: '新签约', desc: '选择服务包、签约周期、费用方式和知情同意书。', actionText: '发起签约' },
      { key: 'renew', label: '续约', desc: '读取原服务包，确认续约周期、优惠和责任团队。', actionText: '办理续约' },
      { key: 'suspend', label: '暂停/解约', desc: '登记暂停或解约原因、费用结算和服务终止日期。', actionText: '暂停/解约' },
      { key: 'effective', label: '生效归档', desc: '审核通过后输出在管状态，并生成首次随访任务。', actionText: '签约生效' },
    ],
    formFields: [
      { label: '服务包', prop: 'packageName', component: 'select', placeholder: '请选择服务包', options: ['糖尿病肾病管理包', '心衰强化随访包', '脑卒中居家康复包', '老年多病共管包'] },
      { label: '签约周期', prop: 'period', component: 'select', placeholder: '请选择周期', options: ['1个月', '3个月', '6个月', '12个月'] },
      { label: '生效日期', prop: 'startDate', component: 'date', placeholder: '请选择生效日期' },
      { label: '费用状态', prop: 'feeStatus', component: 'select', placeholder: '请选择', options: ['待缴费', '已预缴', '正常', '欠费', '待结算'] },
      { label: '签约文书', prop: 'documentStatus', component: 'select', placeholder: '请选择', options: ['待签署', '患者已签', '家属代签', '已归档'] },
      { label: '办理说明', prop: 'remark', component: 'textarea', placeholder: '填写续约、解约或服务包变更原因' },
    ],
    quickLinks: [
      { label: '患者建档', workspace: '导诊台', menuKey: 'guide-patient', desc: '返回患者主档补全资料' },
      { label: '责任分配', workspace: '导诊台', menuKey: 'guide-owner', desc: '签约生效后分配医护团队' },
      { label: '居家待办', workspace: '居家个人主页', menuKey: 'home-treatment', desc: '同步患者端服务任务' },
    ],
  },
  'guide-owner': {
    title: '归属与责任分配',
    subtitle: '为签约患者分配主诊医生、责任护士、专家团队、服务分层和共享协管范围，是后续医生护士工作站的数据来源。',
    filters: ['患者姓名', '责任医生', '责任护士', '分层等级'],
    actions: ['分配主责医护', '批量转组', '发起共享协管', '查看分配历史'],
    metrics: [
      { label: '待分配', value: '17', tone: 'orange', hint: '签约后未指定团队' },
      { label: '高危分层', value: '31', tone: 'red', hint: '需高级团队接管' },
      { label: '共享协管', value: '46', tone: 'blue', hint: '跨院区或家庭医生协作' },
      { label: '分配完成率', value: '94%', tone: 'green', hint: '本周签约患者' },
    ],
    columns: [
      { prop: 'subject', label: '患者', minWidth: 110 },
      { prop: 'riskLevel', label: '服务分层', minWidth: 110 },
      { prop: 'doctor', label: '主诊医生', minWidth: 120 },
      { prop: 'nurse', label: '责任护士', minWidth: 120 },
      { prop: 'teamName', label: '专家团队', minWidth: 150 },
      { prop: 'status', label: '分配状态', minWidth: 110 },
      { prop: 'nextAction', label: '下一步', minWidth: 180 },
      { prop: 'time', label: '生效时间', width: 110 },
    ],
    rows: makeRows('guide-owner', [
      { subject: '马立新', riskLevel: '高危', doctor: '张医生', nurse: '林护士', teamName: '心衰强化团队', status: '待医生确认', nextAction: '医生确认接管并制定计划', disease: '心衰NYHA III', owner: '导诊-黄莹', time: '今日' },
      { subject: '周国平', riskLevel: '中危', doctor: '吴医生', nurse: '陈护士', teamName: '肾病稳定期团队', status: '已生效', nextAction: '生成首次随访任务', disease: '慢性肾病3期', owner: '导诊-沈洁', time: '05-14' },
      { subject: '赵敏', riskLevel: '中危', doctor: '许医生', nurse: '周护士', teamName: '康复协同团队', status: '待护士确认', nextAction: '责任护士确认服务计划', disease: '脑卒中恢复期', owner: '导诊-黄莹', time: '05-14' },
      { subject: '胡春梅', riskLevel: '高危', doctor: '张医生', nurse: '赵护士', teamName: '糖尿病足风险团队', status: '共享协管中', nextAction: '邀请伤口专科协管', disease: '糖尿病足风险', owner: '导诊-沈洁', time: '05-13' },
      { subject: '刘海峰', riskLevel: '高危', doctor: '吴医生', nurse: '陈护士', teamName: '老年多病共管团队', status: '已生效', nextAction: '同步家庭医生', disease: '老年多病共存', owner: '导诊-黄莹', time: '05-12' },
      { subject: '郑晓燕', riskLevel: '中危', doctor: '许医生', nurse: '林护士', teamName: '肿瘤康复团队', status: '待分配', nextAction: '选择责任护士', disease: '肿瘤康复', owner: '导诊-沈洁', time: '待定' },
      { subject: '王建国', riskLevel: '中危', doctor: '张医生', nurse: '赵护士', teamName: '糖肾管理团队', status: '已生效', nextAction: '查看医生站患者列表', disease: '糖尿病肾病', owner: '导诊-黄莹', time: '05-10' },
      { subject: '李秀兰', riskLevel: '高危', doctor: '吴医生', nurse: '周护士', teamName: '心血管共管团队', status: '待医生确认', nextAction: '确认高危管理计划', disease: '高血压合并心衰', owner: '导诊-沈洁', time: '今日' },
      { subject: '陈志强', riskLevel: '中危', doctor: '许医生', nurse: '陈护士', teamName: '慢阻肺随访团队', status: '转组申请', nextAction: '审核转入远程随访团队', disease: '慢阻肺', owner: '导诊-黄莹', time: '05-15' },
      { subject: '孙美娟', riskLevel: '低危', doctor: '张医生', nurse: '林护士', teamName: '冠心病随访团队', status: '已生效', nextAction: '生成宣教任务', disease: '冠心病', owner: '导诊-沈洁', time: '05-14' },
    ]),
    primaryFlow: [
      { key: 'assign', label: '责任分配', desc: '为患者指定主诊医生、责任护士、专家团队和服务分层。', actionText: '分配医护' },
      { key: 'confirm', label: '接管确认', desc: '医生和护士确认接管，形成责任患者范围。', actionText: '提交确认' },
      { key: 'share', label: '共享协管', desc: '必要时开放协管团队、家庭医生或专科顾问访问范围。', actionText: '发起协管' },
      { key: 'effective', label: '生效同步', desc: '分配生效后同步医生站、护士站和员工主页。', actionText: '同步生效' },
    ],
    formFields: [
      { label: '主诊医生', prop: 'doctor', component: 'select', placeholder: '请选择主诊医生', options: ['张医生', '吴医生', '许医生', '黄医生'] },
      { label: '责任护士', prop: 'nurse', component: 'select', placeholder: '请选择责任护士', options: ['林护士', '陈护士', '赵护士', '周护士'] },
      { label: '专家团队', prop: 'teamName', component: 'select', placeholder: '请选择专家团队', options: teams },
      { label: '服务分层', prop: 'riskLevel', component: 'select', placeholder: '请选择服务分层', options: ['低危', '中危', '高危', '危急'] },
      { label: '共享范围', prop: 'shareScope', component: 'select', placeholder: '请选择共享范围', options: ['仅主责团队', '院内专科协管', '家庭医生协管', '跨院区协管'] },
      { label: '分配说明', prop: 'remark', component: 'textarea', placeholder: '填写分配原因、转组原因或协管说明' },
    ],
    quickLinks: [
      { label: '医生患者', workspace: '医生站', menuKey: 'doctor-my', desc: '查看医生责任患者是否同步' },
      { label: '护理患者', workspace: '护士站', menuKey: 'nurse-patient', desc: '查看护士责任患者和待办' },
      { label: '员工待办', workspace: '员工主页', menuKey: 'employee-task', desc: '接管确认任务进入个人待办' },
    ],
  },
  'home-treatment': {
    title: '居家待办与治疗',
    subtitle: '患者端首页优先呈现今日待办、用药/测量/评估/宣教任务，支持提交结果并等待医护审核。',
    filters: ['任务名称', '任务类型', '完成状态', '到期时间'],
    actions: ['提交今日任务', '联系责任护士', '申请延期', '查看医嘱说明'],
    metrics: [
      { label: '今日待办', value: '5', tone: 'blue', hint: '测量、用药、评估和宣教' },
      { label: '即将逾期', value: '2', tone: 'orange', hint: '4小时内到期' },
      { label: '异常待处理', value: '1', tone: 'red', hint: '提交后触发医护审核' },
      { label: '本周完成率', value: '86%', tone: 'green', hint: '患者自我管理依从性' },
    ],
    columns: [
      { prop: 'subject', label: '任务名称', minWidth: 150 },
      { prop: 'taskType', label: '任务类型', minWidth: 120 },
      { prop: 'requirement', label: '提交要求', minWidth: 190 },
      { prop: 'status', label: '状态', minWidth: 110 },
      { prop: 'owner', label: '审核人', minWidth: 130 },
      { prop: 'nextAction', label: '下一步', minWidth: 170 },
      { prop: 'time', label: '截止时间', width: 110 },
    ],
    rows: makeRows('home-treatment', [
      { subject: '晨间血压测量', taskType: '生命体征', requirement: '上传收缩压/舒张压/心率', status: '待提交', owner: '林护士', nextAction: '提交测量值', disease: '高血压合并心衰', time: '09:00' },
      { subject: '空腹血糖记录', taskType: '指标记录', requirement: '填写血糖并拍照上传', status: '已提交', owner: '赵护士', nextAction: '等待护士审核', disease: '糖尿病肾病', time: '09:30' },
      { subject: '利尿剂服药确认', taskType: '用药确认', requirement: '确认已服药及不适反应', status: '待提交', owner: '张医生', nextAction: '确认服药', disease: '心衰NYHA III', time: '10:00' },
      { subject: '脑卒中康复训练', taskType: '康复任务', requirement: '上传10分钟训练视频', status: '已退回', owner: '周护士', nextAction: '补传完整视频', disease: '脑卒中恢复期', time: '12:00' },
      { subject: '水肿自评', taskType: '病情评估', requirement: '填写下肢水肿和体重变化', status: '异常上报', owner: '吴医生', nextAction: '医生评估风险', disease: '慢性肾病3期', time: '13:00' },
      { subject: '低盐饮食宣教', taskType: '宣教学习', requirement: '阅读并确认学习', status: '已完成', owner: '陈护士', nextAction: '进入下次宣教', disease: '冠心病', time: '18:00' },
      { subject: '夜间血氧记录', taskType: '设备采集', requirement: '同步指夹血氧仪数据', status: '待同步', owner: '林护士', nextAction: '重新连接设备', disease: '慢阻肺', time: '21:00' },
      { subject: '疼痛评分', taskType: '症状评估', requirement: '填写NRS评分和部位', status: '待提交', owner: '许医生', nextAction: '提交症状评分', disease: '肿瘤康复', time: '20:00' },
      { subject: '跌倒风险问卷', taskType: '安全评估', requirement: '填写家庭环境风险', status: '已提交', owner: '周护士', nextAction: '等待复核', disease: '老年多病共存', time: '17:00' },
      { subject: '伤口照片上传', taskType: '图片随访', requirement: '上传足部伤口清晰照片', status: '异常待审', owner: '张医生', nextAction: '医生查看照片', disease: '糖尿病足风险', time: '15:00' },
    ]),
    primaryFlow: [
      { key: 'submit', label: '提交任务', desc: '患者按要求填写指标、上传图片或确认宣教学习。', actionText: '提交任务' },
      { key: 'supplement', label: '补充材料', desc: '被医护退回后补充照片、视频、数值或说明。', actionText: '补充提交' },
      { key: 'ask', label: '联系医护', desc: '任务异常或不理解医嘱时联系责任护士或医生。', actionText: '联系医护' },
      { key: 'archive', label: '归档到健康档案', desc: '审核通过后写入患者时间轴和健康档案。', actionText: '查看归档' },
    ],
    rowOperations: [
      { key: 'open', label: '填写', type: 'primary', targetStatus: '已提交', feedback: '患者任务已提交，等待责任医护审核。' },
      { key: 'review', label: '补充', type: 'warning', targetStatus: '已补充', feedback: '补充材料已提交。' },
      { key: 'activate', label: '确认', type: 'success', targetStatus: '已完成', feedback: '任务已确认完成并写入健康档案。' },
      { key: 'trace', label: '记录', type: 'info', targetStatus: '已完成', feedback: '已打开任务提交、审核和回写记录。' },
    ],
    formFields: [
      { label: '提交数值', prop: 'value', component: 'input', placeholder: '如血压、血糖、体重、血氧等' },
      { label: '症状描述', prop: 'symptom', component: 'textarea', placeholder: '填写不适症状、发生时间和诱因' },
      { label: '附件类型', prop: 'attachmentType', component: 'select', placeholder: '请选择', options: ['照片', '视频', '检验报告', '设备截图', '无需附件'] },
      { label: '是否异常', prop: 'abnormal', component: 'select', placeholder: '请选择', options: ['无异常', '轻微不适', '明显异常', '需要联系医生'] },
    ],
    quickLinks: [
      { label: '健康档案', workspace: '居家个人主页', menuKey: 'home-health', desc: '查看已归档的测量和评估记录' },
      { label: '报告上传', workspace: '居家个人主页', menuKey: 'home-upload', desc: '上传检验检查原始报告' },
      { label: '临床事件', workspace: '居家个人主页', menuKey: 'home-event', desc: '异常症状直接上报事件' },
    ],
  },
  'home-upload': {
    title: '检验检查上传',
    subtitle: '患者上传院外检验、影像、用药清单和出院小结，系统结构化后进入医生解读、智能诊断和预警。',
    filters: ['报告类型', '审核状态', '采样日期', '异常标记'],
    actions: ['上传报告', '补传原图', '撤回提交', '查看解读'],
    metrics: [
      { label: '待审核报告', value: '18', tone: 'orange', hint: '医生或护士待处理' },
      { label: '结构化成功', value: '92%', tone: 'green', hint: 'OCR/手工录入完成' },
      { label: '异常报告', value: '6', tone: 'red', hint: '触发预警或诊断线索' },
      { label: '本月上传', value: '147', tone: 'blue', hint: '患者端提交' },
    ],
    columns: [
      { prop: 'subject', label: '患者', minWidth: 110 },
      { prop: 'reportType', label: '报告类型', minWidth: 130 },
      { prop: 'sampleDate', label: '采样/检查日期', width: 130 },
      { prop: 'keyResult', label: '关键结果', minWidth: 170 },
      { prop: 'status', label: '审核状态', minWidth: 110 },
      { prop: 'owner', label: '解读医生', minWidth: 120 },
      { prop: 'nextAction', label: '下一步', minWidth: 180 },
    ],
    rows: makeRows('home-upload', [
      { subject: '王建国', reportType: '肾功能', sampleDate: '2026-05-12', keyResult: 'eGFR 42, Scr 168', status: '待医生解读', owner: '张医生', nextAction: '确认慢性肾病分期', disease: '慢性肾病3期', time: '05-12' },
      { subject: '李秀兰', reportType: '电解质', sampleDate: '2026-05-14', keyResult: 'K+ 6.1 mmol/L', status: '危急值待处理', owner: '吴医生', nextAction: '立即电话确认并处理', disease: '高钾风险', time: '今日' },
      { subject: '赵敏', reportType: '头颅CT', sampleDate: '2026-05-10', keyResult: '陈旧性梗死灶', status: '已归档', owner: '许医生', nextAction: '同步康复计划', disease: '脑卒中恢复期', time: '05-10' },
      { subject: '陈志强', reportType: '肺功能', sampleDate: '2026-05-08', keyResult: 'FEV1 48%', status: '待复核', owner: '许医生', nextAction: '复核结构化结果', disease: '慢阻肺', time: '05-08' },
      { subject: '孙美娟', reportType: '心电图', sampleDate: '2026-05-11', keyResult: 'ST-T改变', status: '待医生解读', owner: '张医生', nextAction: '评估胸痛风险', disease: '冠心病', time: '05-11' },
      { subject: '胡春梅', reportType: '伤口照片', sampleDate: '2026-05-14', keyResult: '足背红肿渗液', status: '异常待审', owner: '张医生', nextAction: '转临床事件', disease: '糖尿病足风险', time: '今日' },
      { subject: '刘海峰', reportType: '血常规', sampleDate: '2026-05-13', keyResult: 'Hb 91 g/L', status: '智能诊断命中', owner: '吴医生', nextAction: '确认贫血诊断', disease: '贫血', time: '05-13' },
      { subject: '郑晓燕', reportType: '肿瘤标志物', sampleDate: '2026-05-09', keyResult: 'CEA轻度升高', status: '待解读', owner: '许医生', nextAction: '结合病史评估', disease: '肿瘤康复', time: '05-09' },
      { subject: '马立新', reportType: 'BNP', sampleDate: '2026-05-14', keyResult: 'BNP 1280 pg/mL', status: '预警已生成', owner: '张医生', nextAction: '调整心衰管理方案', disease: '心衰', time: '今日' },
      { subject: '周国平', reportType: '尿常规', sampleDate: '2026-05-12', keyResult: '蛋白++', status: '已归档', owner: '吴医生', nextAction: '进入趋势分析', disease: '肾病', time: '05-12' },
    ]),
    formFields: [
      { label: '报告类型', prop: 'reportType', component: 'select', placeholder: '请选择报告类型', options: ['检验报告', '影像报告', '心电图', '用药清单', '出院小结', '伤口照片'] },
      { label: '采样日期', prop: 'sampleDate', component: 'date', placeholder: '请选择采样或检查日期' },
      { label: '关键结果', prop: 'keyResult', component: 'textarea', placeholder: '填写关键指标、异常项或报告结论' },
      { label: '原始附件', prop: 'attachment', component: 'select', placeholder: '请选择附件状态', options: ['已上传清晰原图', '需补传', '多页报告', '患者口述待核实'] },
      { label: '备注', prop: 'remark', component: 'textarea', placeholder: '填写报告来源医院、医生备注或患者说明' },
    ],
    quickLinks: [
      { label: '医生检验解读', workspace: '医生站', menuKey: 'doctor-lab', desc: '医生查看上传报告和趋势' },
      { label: '智能诊断', workspace: '医生站', menuKey: 'doctor-diagnosis', desc: '异常指标进入诊断确认' },
      { label: '预警处理', workspace: '医生站', menuKey: 'doctor-quality', desc: '危急值和异常报告进入预警' },
    ],
  },
  'home-event': {
    title: '临床事件',
    subtitle: '患者或家属上报跌倒、胸闷、呼吸困难、低血糖、伤口异常等事件，分级后推送医护处理。',
    filters: ['事件类型', '事件级别', '处理状态', '发生时间'],
    actions: ['上报事件', '联系医护', '补充照片', '查看处理结果'],
    metrics: [
      { label: '待分级', value: '7', tone: 'orange', hint: '新上报未确认级别' },
      { label: '高危事件', value: '3', tone: 'red', hint: '需医生立即处理' },
      { label: '处理中', value: '11', tone: 'blue', hint: '医护已接单' },
      { label: '关闭率', value: '88%', tone: 'green', hint: '近30天事件闭环' },
    ],
    columns: [
      { prop: 'subject', label: '患者', minWidth: 110 },
      { prop: 'eventType', label: '事件类型', minWidth: 130 },
      { prop: 'level', label: '级别', width: 90 },
      { prop: 'symptom', label: '症状描述', minWidth: 200 },
      { prop: 'status', label: '处理状态', minWidth: 110 },
      { prop: 'owner', label: '责任人', minWidth: 120 },
      { prop: 'nextAction', label: '下一步', minWidth: 180 },
      { prop: 'time', label: '发生时间', width: 110 },
    ],
    rows: makeRows('home-event', [
      { subject: '马立新', eventType: '胸闷气短', level: '高危', symptom: '夜间端坐呼吸，体重2天增2kg', status: '医生处理中', owner: '张医生', nextAction: '电话评估并调整医嘱', disease: '心衰', time: '07:40' },
      { subject: '胡春梅', eventType: '伤口异常', level: '高危', symptom: '足部伤口红肿渗液', status: '待分级', owner: '林护士', nextAction: '护士初筛并转医生', disease: '糖尿病足风险', time: '08:15' },
      { subject: '李秀兰', eventType: '头晕低血压', level: '中危', symptom: '血压92/58，伴头晕', status: '已分派', owner: '吴医生', nextAction: '复测血压并调整用药', disease: '高血压合并心衰', time: '09:20' },
      { subject: '赵敏', eventType: '跌倒', level: '中危', symptom: '卫生间滑倒，无意识丧失', status: '处理中', owner: '周护士', nextAction: '完善跌倒风险评估', disease: '脑卒中恢复期', time: '10:05' },
      { subject: '王建国', eventType: '低血糖', level: '中危', symptom: '餐前血糖3.4，出汗', status: '已关闭', owner: '张医生', nextAction: '已完成饮食和药物指导', disease: '糖尿病肾病', time: '昨日' },
      { subject: '陈志强', eventType: '呼吸困难', level: '高危', symptom: '活动后气促加重，SpO2 89%', status: '医生处理中', owner: '许医生', nextAction: '建议线下急诊评估', disease: '慢阻肺', time: '今日' },
      { subject: '刘海峰', eventType: '意识模糊', level: '高危', symptom: '家属描述短暂意识模糊', status: '已转急诊', owner: '吴医生', nextAction: '追踪急诊结果', disease: '老年多病共存', time: '06:30' },
      { subject: '孙美娟', eventType: '胸痛', level: '高危', symptom: '胸骨后压榨痛10分钟', status: '已分派', owner: '张医生', nextAction: '立即联系患者并建议急诊', disease: '冠心病', time: '08:55' },
      { subject: '郑晓燕', eventType: '发热', level: '中危', symptom: '体温38.2，乏力', status: '处理中', owner: '许医生', nextAction: '询问感染症状并安排复查', disease: '肿瘤康复', time: '11:10' },
      { subject: '周国平', eventType: '尿量减少', level: '中危', symptom: '24小时尿量约500ml', status: '待复查', owner: '吴医生', nextAction: '复查肾功能与电解质', disease: '慢性肾病3期', time: '昨日' },
    ]),
    primaryFlow: [
      { key: 'report', label: '事件上报', desc: '患者填写发生时间、症状、照片和紧急程度。', actionText: '上报事件' },
      { key: 'triage', label: '护士初筛', desc: '护士确认事件真实性和风险级别。', actionText: '初筛分级' },
      { key: 'doctor', label: '医生处理', desc: '医生给出处置意见、线下就医建议或医嘱调整。', actionText: '医生处理' },
      { key: 'close', label: '复查关闭', desc: '确认患者状态稳定后关闭事件并归档。', actionText: '关闭事件' },
    ],
    formFields: [
      { label: '事件类型', prop: 'eventType', component: 'select', placeholder: '请选择事件类型', options: ['胸痛', '呼吸困难', '跌倒', '低血糖', '伤口异常', '发热', '其他'] },
      { label: '发生时间', prop: 'eventTime', component: 'date', placeholder: '请选择发生时间' },
      { label: '紧急程度', prop: 'level', component: 'select', placeholder: '请选择', options: ['一般', '中危', '高危', '危急'] },
      { label: '症状描述', prop: 'symptom', component: 'textarea', placeholder: '请描述症状、持续时间、诱因和已采取措施' },
      { label: '附件情况', prop: 'attachment', component: 'select', placeholder: '请选择', options: ['无附件', '照片', '视频', '设备截图', '报告附件'] },
    ],
    quickLinks: [
      { label: '医生事件处理', workspace: '医生站', menuKey: 'doctor-event', desc: '医生查看并处理临床事件' },
      { label: '护士异常初筛', workspace: '护士站', menuKey: 'nurse-event', desc: '护士进行初筛和随访' },
      { label: '预警CQI', workspace: '规则配置与质量改进', menuKey: 'rule-warning', desc: '高危事件触发预警规则' },
    ],
  },
  'doctor-my': {
    title: '我的病人',
    subtitle: '医生工作台的责任患者列表，聚合签约归属、居家上传、评估异常、预警事件和待处理医嘱。',
    filters: ['患者姓名', '风险等级', '待办类型', '最近异常'],
    actions: ['打开患者360', '批量生成随访', '处理预警', '生成健康报告'],
    metrics: [
      { label: '责任患者', value: '74', tone: 'blue', hint: '归属分配生效' },
      { label: '待处理上传', value: '18', tone: 'orange', hint: '患者端报告待解读' },
      { label: '高危患者', value: '9', tone: 'red', hint: '近7天预警或事件' },
      { label: '报告待发布', value: '12', tone: 'green', hint: '健康报告草稿' },
    ],
    columns: [
      { prop: 'subject', label: '患者', minWidth: 110 },
      { prop: 'ageSex', label: '年龄/性别', width: 110 },
      { prop: 'disease', label: '主要诊断', minWidth: 160 },
      { prop: 'riskLevel', label: '风险等级', width: 110 },
      { prop: 'status', label: '当前状态', minWidth: 120 },
      { prop: 'lastEvent', label: '最近异常', minWidth: 170 },
      { prop: 'owner', label: '责任护士', minWidth: 120 },
      { prop: 'nextAction', label: '医生下一步', minWidth: 180 },
    ],
    rows: makeRows('doctor-my', [
      { subject: '马立新', ageSex: '68/男', disease: '心衰NYHA III', riskLevel: '高危', status: '预警待处理', lastEvent: 'BNP升高、夜间气促', owner: '林护士', nextAction: '调整利尿剂并电话随访', time: '今日' },
      { subject: '李秀兰', ageSex: '66/女', disease: '高血压合并心衰', riskLevel: '高危', status: '危急值待处理', lastEvent: '血钾6.1', owner: '周护士', nextAction: '立即联系并复查电解质', time: '今日' },
      { subject: '王建国', ageSex: '58/男', disease: '糖尿病肾病', riskLevel: '中危', status: '上传待解读', lastEvent: 'eGFR下降', owner: '赵护士', nextAction: '确认CKD分期', time: '05-13' },
      { subject: '胡春梅', ageSex: '59/女', disease: '糖尿病足风险', riskLevel: '高危', status: '事件处理中', lastEvent: '伤口红肿渗液', owner: '林护士', nextAction: '转伤口专科协管', time: '今日' },
      { subject: '陈志强', ageSex: '52/男', disease: '慢阻肺', riskLevel: '高危', status: '急诊建议', lastEvent: 'SpO2 89%', owner: '陈护士', nextAction: '追踪线下就诊结果', time: '今日' },
      { subject: '赵敏', ageSex: '37/女', disease: '脑卒中恢复期', riskLevel: '中危', status: '康复任务退回', lastEvent: '视频不完整', owner: '周护士', nextAction: '调整康复训练计划', time: '昨日' },
      { subject: '周国平', ageSex: '63/男', disease: '慢性肾病3期', riskLevel: '中危', status: '待复查', lastEvent: '尿量减少', owner: '陈护士', nextAction: '开立肾功能复查', time: '昨日' },
      { subject: '刘海峰', ageSex: '56/男', disease: '老年多病共存', riskLevel: '高危', status: '急诊追踪', lastEvent: '短暂意识模糊', owner: '赵护士', nextAction: '补录急诊结论', time: '今日' },
      { subject: '郑晓燕', ageSex: '41/女', disease: '肿瘤康复', riskLevel: '中危', status: '发热处理中', lastEvent: '体温38.2', owner: '林护士', nextAction: '评估感染风险', time: '今日' },
      { subject: '孙美娟', ageSex: '49/女', disease: '冠心病', riskLevel: '高危', status: '胸痛事件', lastEvent: '胸痛10分钟', owner: '周护士', nextAction: '建议急诊并追踪', time: '今日' },
    ]),
    primaryFlow: [
      { key: 'summary', label: '患者360', desc: '查看患者诊断、签约、居家上传、任务、事件和趋势。', actionText: '打开患者360' },
      { key: 'assess', label: '临床评估', desc: '结合居家数据、检验和事件做临床判断。', actionText: '填写评估' },
      { key: 'order', label: '医嘱/建议', desc: '下达复查、用药调整、随访和宣教要求。', actionText: '新开医嘱' },
      { key: 'report', label: '报告沟通', desc: '生成健康报告或电话沟通记录。', actionText: '生成报告' },
    ],
    formFields: [
      { label: '临床结论', prop: 'clinicalJudgement', component: 'textarea', placeholder: '填写综合判断、风险原因和处置方向' },
      { label: '处理类型', prop: 'handleType', component: 'select', placeholder: '请选择', options: ['诊断确认', '医嘱调整', '复查建议', '转诊建议', '健康报告'] },
      { label: '风险等级', prop: 'riskLevel', component: 'select', placeholder: '请选择', options: ['低危', '中危', '高危', '危急'] },
      { label: '复查日期', prop: 'reviewDate', component: 'date', placeholder: '请选择复查日期' },
      { label: '患者沟通', prop: 'communication', component: 'textarea', placeholder: '记录电话、视频或站内沟通内容' },
    ],
    quickLinks: [
      { label: '疾病诊断', workspace: '医生站', menuKey: 'doctor-diagnosis', desc: '确认智能诊断和正式诊断' },
      { label: '医嘱管理', workspace: '医生站', menuKey: 'doctor-order', desc: '下达复查、用药和随访医嘱' },
      { label: '护士执行', workspace: '护士站', menuKey: 'nurse-execute', desc: '医嘱下发后进入护士核对执行' },
    ],
  },
  'doctor-diagnosis': {
    title: '疾病诊断',
    subtitle: '医生确认智能诊断线索、维护正式诊断、记录证据来源和否认/忽略原因。',
    filters: ['患者/诊断', '线索来源', '确认状态', '风险等级'],
    actions: ['确认诊断', '否认线索', '新增诊断', '转工作任务'],
    metrics: [
      { label: '待确认线索', value: '21', tone: 'orange', hint: '规则自动识别' },
      { label: '高危诊断', value: '6', tone: 'red', hint: '需当日确认' },
      { label: '已确认', value: '48', tone: 'green', hint: '本月写入正式诊断' },
      { label: '规则命中率', value: '76%', tone: 'blue', hint: '智能诊断有效性' },
    ],
    columns: [
      { prop: 'subject', label: '患者', minWidth: 110 },
      { prop: 'diagnosisName', label: '建议诊断', minWidth: 160 },
      { prop: 'source', label: '证据来源', minWidth: 150 },
      { prop: 'evidence', label: '命中证据', minWidth: 190 },
      { prop: 'status', label: '确认状态', minWidth: 110 },
      { prop: 'owner', label: '确认医生', minWidth: 120 },
      { prop: 'nextAction', label: '下一步', minWidth: 180 },
    ],
    rows: makeRows('doctor-diagnosis', [
      { subject: '李秀兰', diagnosisName: '高钾血症', source: '患者上传检验', evidence: 'K+ 6.1 mmol/L', status: '待确认', owner: '吴医生', nextAction: '确认诊断并生成预警处理', disease: '高钾血症', time: '今日' },
      { subject: '刘海峰', diagnosisName: '肾性贫血', source: '血常规趋势', evidence: 'Hb 91 g/L 持续下降', status: '待确认', owner: '吴医生', nextAction: '结合肾功能确认', disease: '贫血', time: '05-13' },
      { subject: '马立新', diagnosisName: '心衰加重', source: 'BNP+症状', evidence: 'BNP 1280, 夜间气促', status: '已确认', owner: '张医生', nextAction: '调整医嘱并随访', disease: '心衰', time: '今日' },
      { subject: '胡春梅', diagnosisName: '糖尿病足感染风险', source: '伤口照片', evidence: '红肿渗液', status: '已转任务', owner: '张医生', nextAction: '伤口专科协管', disease: '糖尿病足风险', time: '今日' },
      { subject: '王建国', diagnosisName: 'CKD 3b期', source: '肾功能', evidence: 'eGFR 42', status: '待确认', owner: '张医生', nextAction: '确认分期并更新报告', disease: '慢性肾病', time: '05-12' },
      { subject: '陈志强', diagnosisName: '慢阻肺急性加重风险', source: '血氧+症状', evidence: 'SpO2 89%, 气促', status: '已确认', owner: '许医生', nextAction: '建议线下评估', disease: '慢阻肺', time: '今日' },
      { subject: '孙美娟', diagnosisName: '急性冠脉综合征风险', source: '胸痛事件', evidence: '压榨性胸痛10分钟', status: '待确认', owner: '张医生', nextAction: '急诊建议并追踪', disease: '冠心病', time: '今日' },
      { subject: '赵敏', diagnosisName: '跌倒高风险', source: '居家问卷', evidence: '卫生间滑倒', status: '已确认', owner: '许医生', nextAction: '调整康复宣教', disease: '脑卒中恢复期', time: '05-13' },
      { subject: '郑晓燕', diagnosisName: '感染风险', source: '发热事件', evidence: '体温38.2', status: '待确认', owner: '许医生', nextAction: '安排血常规复查', disease: '肿瘤康复', time: '今日' },
      { subject: '周国平', diagnosisName: '肾功能恶化风险', source: '症状+尿量', evidence: '尿量减少', status: '已忽略', owner: '吴医生', nextAction: '保留趋势观察', disease: '慢性肾病', time: '昨日' },
    ]),
    formFields: [
      { label: '确认结论', prop: 'confirmResult', component: 'select', placeholder: '请选择', options: ['确认正式诊断', '否认线索', '忽略观察', '转工作任务'] },
      { label: '诊断名称', prop: 'diagnosisName', component: 'input', placeholder: '请输入诊断名称' },
      { label: '诊断编码', prop: 'diagnosisCode', component: 'input', placeholder: 'ICD/院内诊断编码' },
      { label: '证据说明', prop: 'evidence', component: 'textarea', placeholder: '填写检验、评估、事件或居家上传证据' },
      { label: '否认原因', prop: 'denyReason', component: 'textarea', placeholder: '否认或忽略时必须填写原因' },
    ],
    quickLinks: [
      { label: '上传报告', workspace: '居家个人主页', menuKey: 'home-upload', desc: '查看患者上传原始报告' },
      { label: '医嘱管理', workspace: '医生站', menuKey: 'doctor-order', desc: '诊断确认后开立医嘱' },
      { label: '规则配置', workspace: '规则配置与质量改进', menuKey: 'rule-diagnosis', desc: '追溯智能诊断规则' },
    ],
  },
  'doctor-order': {
    title: '医嘱管理',
    subtitle: '医生根据诊断、评估和居家数据开立复查、用药、护理、宣教和随访医嘱，流转护士核对执行。',
    filters: ['患者姓名', '医嘱类型', '审核状态', '执行状态'],
    actions: ['新开医嘱', '引用组套', '提交审核', '停止医嘱'],
    metrics: [
      { label: '待审核医嘱', value: '16', tone: 'orange', hint: '提交后待护士/药师核对' },
      { label: '执行中', value: '43', tone: 'blue', hint: '护士或患者端执行' },
      { label: '退回修改', value: '5', tone: 'red', hint: '剂量、频次或依据不完整' },
      { label: '今日完成', value: '58', tone: 'green', hint: '已执行并回写' },
    ],
    columns: [
      { prop: 'subject', label: '患者', minWidth: 110 },
      { prop: 'orderName', label: '医嘱内容', minWidth: 190 },
      { prop: 'orderType', label: '医嘱类型', minWidth: 120 },
      { prop: 'frequency', label: '频次/期限', minWidth: 130 },
      { prop: 'status', label: '审核状态', minWidth: 110 },
      { prop: 'executeStatus', label: '执行状态', minWidth: 110 },
      { prop: 'owner', label: '执行角色', minWidth: 120 },
      { prop: 'nextAction', label: '下一步', minWidth: 180 },
    ],
    rows: makeRows('doctor-order', [
      { subject: '李秀兰', orderName: '复查电解质+心电图', orderType: '检验检查', frequency: '今日一次', status: '待审核', executeStatus: '待执行', owner: '林护士', nextAction: '护士联系患者复查', disease: '高钾血症', time: '今日' },
      { subject: '马立新', orderName: '调整利尿剂并记录体重', orderType: '用药+监测', frequency: '每日晨起', status: '已审核', executeStatus: '执行中', owner: '周护士', nextAction: '患者端确认服药和体重', disease: '心衰', time: '今日' },
      { subject: '王建国', orderName: '肾功能复查', orderType: '检验医嘱', frequency: '一周内', status: '草稿', executeStatus: '未下发', owner: '张医生', nextAction: '提交审核', disease: '慢性肾病', time: '05-20' },
      { subject: '胡春梅', orderName: '伤口照片每日上传', orderType: '护理医嘱', frequency: '每日一次', status: '已审核', executeStatus: '执行中', owner: '林护士', nextAction: '护士复核照片', disease: '糖尿病足风险', time: '每日' },
      { subject: '陈志强', orderName: '血氧监测和急诊建议', orderType: '监测+转诊', frequency: '持续3天', status: '已审核', executeStatus: '异常执行', owner: '陈护士', nextAction: '追踪线下就诊', disease: '慢阻肺', time: '今日' },
      { subject: '赵敏', orderName: '康复训练视频上传', orderType: '康复医嘱', frequency: '每周3次', status: '退回修改', executeStatus: '暂停', owner: '周护士', nextAction: '补充训练禁忌说明', disease: '脑卒中恢复期', time: '本周' },
      { subject: '孙美娟', orderName: '胸痛急诊评估', orderType: '转诊建议', frequency: '立即', status: '已审核', executeStatus: '执行中', owner: '林护士', nextAction: '电话追踪急诊结果', disease: '冠心病', time: '今日' },
      { subject: '郑晓燕', orderName: '发热复查血常规', orderType: '检验医嘱', frequency: '24小时内', status: '待审核', executeStatus: '待执行', owner: '陈护士', nextAction: '通知患者线下采血', disease: '感染风险', time: '明日' },
      { subject: '刘海峰', orderName: '认知状态随访', orderType: '随访医嘱', frequency: '每日电话', status: '已审核', executeStatus: '执行中', owner: '赵护士', nextAction: '记录家属反馈', disease: '老年多病共存', time: '每日' },
      { subject: '周国平', orderName: '记录24小时尿量', orderType: '居家监测', frequency: '连续3天', status: '已审核', executeStatus: '待执行', owner: '陈护士', nextAction: '患者端生成任务', disease: '慢性肾病', time: '今日' },
    ]),
    formFields: [
      { label: '医嘱类型', prop: 'orderType', component: 'select', placeholder: '请选择医嘱类型', options: ['用药医嘱', '检验医嘱', '检查医嘱', '护理医嘱', '宣教医嘱', '随访医嘱', '转诊建议'] },
      { label: '医嘱内容', prop: 'orderName', component: 'textarea', placeholder: '填写具体医嘱内容、剂量、监测项目或执行要求' },
      { label: '执行频次', prop: 'frequency', component: 'select', placeholder: '请选择频次', options: ['立即', '每日一次', '每周一次', '连续3天', '一周内', '按需'] },
      { label: '计划日期', prop: 'planDate', component: 'date', placeholder: '请选择计划执行日期' },
      { label: '执行角色', prop: 'executor', component: 'select', placeholder: '请选择执行角色', options: ['患者本人', '责任护士', '药师', '线下检验机构', '家庭医生'] },
      { label: '风险提示', prop: 'riskNote', component: 'textarea', placeholder: '填写禁忌、危急值、退回修改或注意事项' },
    ],
    quickLinks: [
      { label: '诊断依据', workspace: '医生站', menuKey: 'doctor-diagnosis', desc: '查看医嘱关联诊断' },
      { label: '护士执行', workspace: '护士站', menuKey: 'nurse-execute', desc: '医嘱提交后由护士核对执行' },
      { label: '患者任务', workspace: '居家个人主页', menuKey: 'home-treatment', desc: '居家监测医嘱生成患者端任务' },
    ],
  },
  'nurse-execute': {
    title: '核对和执行',
    subtitle: '护士核对医生医嘱、联系患者、记录执行结果、处理异常并回写医生站和患者时间轴。',
    filters: ['患者姓名', '医嘱类型', '执行状态', '异常等级'],
    actions: ['批量领取', '核对医嘱', '执行登记', '异常上报'],
    metrics: [
      { label: '待核对', value: '24', tone: 'orange', hint: '医生新下发医嘱' },
      { label: '执行中', value: '31', tone: 'blue', hint: '患者端或护士执行' },
      { label: '异常执行', value: '6', tone: 'red', hint: '需医生复核' },
      { label: '今日完成', value: '52', tone: 'green', hint: '已回写闭环' },
    ],
    columns: [
      { prop: 'subject', label: '患者', minWidth: 110 },
      { prop: 'orderName', label: '医嘱/任务', minWidth: 190 },
      { prop: 'orderType', label: '类型', minWidth: 110 },
      { prop: 'checkPoint', label: '核对重点', minWidth: 180 },
      { prop: 'status', label: '执行状态', minWidth: 110 },
      { prop: 'owner', label: '责任护士', minWidth: 120 },
      { prop: 'nextAction', label: '下一步', minWidth: 180 },
      { prop: 'time', label: '截止时间', width: 110 },
    ],
    rows: makeRows('nurse-execute', [
      { subject: '李秀兰', orderName: '复查电解质+心电图', orderType: '检验检查', checkPoint: '危急值复查时限', status: '待核对', owner: '林护士', nextAction: '电话联系患者今日复查', disease: '高钾血症', time: '12:00' },
      { subject: '马立新', orderName: '体重和利尿剂服药确认', orderType: '用药监测', checkPoint: '体重变化和低血压', status: '执行中', owner: '周护士', nextAction: '核对患者端提交', disease: '心衰', time: '18:00' },
      { subject: '胡春梅', orderName: '伤口照片每日上传', orderType: '图片随访', checkPoint: '照片清晰度和感染迹象', status: '异常执行', owner: '林护士', nextAction: '转医生查看伤口', disease: '糖尿病足风险', time: '今日' },
      { subject: '陈志强', orderName: '血氧监测', orderType: '设备采集', checkPoint: 'SpO2低于90%', status: '异常执行', owner: '陈护士', nextAction: '建议急诊并记录沟通', disease: '慢阻肺', time: '今日' },
      { subject: '赵敏', orderName: '康复训练视频补传', orderType: '康复任务', checkPoint: '视频完整性', status: '待患者补充', owner: '周护士', nextAction: '提醒补传', disease: '脑卒中恢复期', time: '20:00' },
      { subject: '周国平', orderName: '记录24小时尿量', orderType: '居家监测', checkPoint: '尿量低于800ml', status: '待执行', owner: '陈护士', nextAction: '指导记录方法', disease: '慢性肾病', time: '明日' },
      { subject: '孙美娟', orderName: '胸痛急诊追踪', orderType: '转诊追踪', checkPoint: '是否到院和心电图结果', status: '执行中', owner: '林护士', nextAction: '补录急诊反馈', disease: '冠心病', time: '今日' },
      { subject: '郑晓燕', orderName: '发热复查血常规', orderType: '检验提醒', checkPoint: '体温和感染症状', status: '待核对', owner: '陈护士', nextAction: '预约采血', disease: '肿瘤康复', time: '明日' },
      { subject: '刘海峰', orderName: '每日认知随访', orderType: '电话随访', checkPoint: '意识、跌倒、服药', status: '已完成', owner: '赵护士', nextAction: '等待明日任务', disease: '老年多病共存', time: '今日' },
      { subject: '王建国', orderName: '肾功能复查提醒', orderType: '检验提醒', checkPoint: '复查日期和报告上传', status: '待执行', owner: '赵护士', nextAction: '发送患者端提醒', disease: '慢性肾病', time: '05-20' },
    ]),
    primaryFlow: [
      { key: 'receive', label: '领取医嘱', desc: '护士领取待核对医嘱，确认患者和执行范围。', actionText: '领取核对' },
      { key: 'check', label: '核对执行', desc: '核对医嘱、患者身份、风险提示和执行要求。', actionText: '核对执行' },
      { key: 'feedback', label: '结果反馈', desc: '记录执行结果、患者反馈、附件和签名。', actionText: '登记结果' },
      { key: 'exception', label: '异常回流', desc: '异常执行转医生、预警或临床事件。', actionText: '异常上报' },
    ],
    formFields: [
      { label: '执行结论', prop: 'executeStatus', component: 'select', placeholder: '请选择', options: ['已执行', '患者未接听', '患者拒绝', '异常执行', '转医生处理'] },
      { label: '核对重点', prop: 'checkPoint', component: 'textarea', placeholder: '填写身份、医嘱、风险、附件核对情况' },
      { label: '患者反馈', prop: 'patientFeedback', component: 'textarea', placeholder: '记录电话/视频/患者端反馈' },
      { label: '下次跟进', prop: 'nextFollow', component: 'date', placeholder: '请选择下次跟进日期' },
      { label: '异常等级', prop: 'abnormalLevel', component: 'select', placeholder: '请选择', options: ['无异常', '一般异常', '高风险', '危急'] },
    ],
    quickLinks: [
      { label: '医生医嘱', workspace: '医生站', menuKey: 'doctor-order', desc: '查看原始医嘱和医生说明' },
      { label: '患者待办', workspace: '居家个人主页', menuKey: 'home-treatment', desc: '查看患者端任务提交情况' },
      { label: '临床事件', workspace: '医生站', menuKey: 'doctor-event', desc: '异常执行转医生事件处理' },
    ],
  },
};

function pageMetrics(labels: [string, string, Tone, string][]): ChronicMetric[] {
  return labels.map(([label, value, tone, hint]) => ({ label, value, tone, hint }));
}

function commonRows(
  menuKey: string,
  subjects: string[],
  itemName: string,
  statuses: string[],
  nextActions: string[],
  ownerList = owners,
): ChronicTableRow[] {
  return makeRows(
    menuKey,
    Array.from({ length: 10 }, (_, index) => ({
      subject: subjects[index % subjects.length],
      disease: diseases[index % diseases.length],
      itemName,
      status: statuses[index % statuses.length],
      owner: ownerList[index % ownerList.length],
      nextAction: nextActions[index % nextActions.length],
      time: `05-${String(14 + (index % 10)).padStart(2, '0')}`,
    })),
  );
}

function clinicalSpec(menuKey: string, title: string, itemName: string, formPurpose: string): ChronicMenuSpecOverride {
  return {
    title,
    subtitle: `${title}围绕医生责任患者展开，主流慢病系统会把患者摘要、病程、检验、评估、事件和医嘱入口放在同一工作台内，减少医生跨页查找。`,
    filters: ['责任患者', '风险等级', '处理状态', '更新时间'],
    actions: ['新增记录', '提交审核', '生成任务', '查看患者360'],
    metrics: pageMetrics([
      ['待处理', '18', 'orange', `${title}待医生处理`],
      ['高危患者', '7', 'red', '需优先打开患者360'],
      ['已完成', '64', 'green', '本周闭环记录'],
      ['责任患者', '74', 'blue', '当前医生管理范围'],
    ]),
    columns: [
      { prop: 'subject', label: '患者', minWidth: 110 },
      { prop: 'disease', label: '主要问题', minWidth: 150 },
      { prop: 'itemName', label: '业务事项', minWidth: 170 },
      { prop: 'status', label: '状态', minWidth: 110 },
      { prop: 'owner', label: '责任人', minWidth: 130 },
      { prop: 'nextAction', label: '下一步', minWidth: 190 },
      { prop: 'time', label: '更新时间', width: 110 },
    ],
    rows: commonRows(menuKey, patientNames, itemName, ['待填写', '待审核', '处理中', '已发布', '已归档'], ['打开患者360', '补充临床判断', '提交审核', '生成随访任务', '归档到病历']),
    primaryFlow: [
      { key: 'open', label: '打开患者360', desc: '查看患者签约、诊断、居家上传、检验趋势、任务和事件。', actionText: '患者360' },
      { key: 'create', label: `填写${title}`, desc: formPurpose, actionText: '新增记录' },
      { key: 'review', label: '提交审核', desc: '提交后进入复核、签名或下游执行。', actionText: '提交审核' },
      { key: 'archive', label: '归档回写', desc: '结果写入患者时间轴、健康报告、任务中心和统计口径。', actionText: '归档回写' },
    ],
    rowOperations: rowOperationsByDomain.doctor,
    formFields: [
      { label: '患者', prop: 'patientName', component: 'input', placeholder: '选择或输入责任患者' },
      { label: '业务类型', prop: 'itemType', component: 'select', placeholder: '请选择', options: ['病程记录', '检验解读', '评估结论', '知情同意', '健康报告', '临床事件'] },
      { label: '临床内容', prop: 'content', component: 'textarea', placeholder: formPurpose },
      { label: '风险等级', prop: 'riskLevel', component: 'select', placeholder: '请选择', options: ['低危', '中危', '高危', '危急'] },
      { label: '下次计划', prop: 'nextPlan', component: 'date', placeholder: '请选择计划日期' },
    ],
    quickLinks: [
      { label: '我的病人', workspace: '医生站', menuKey: 'doctor-my', desc: '返回责任患者列表' },
      { label: '医嘱管理', workspace: '医生站', menuKey: 'doctor-order', desc: '需要执行时下达医嘱' },
      { label: '护士执行', workspace: '护士站', menuKey: 'nurse-execute', desc: '下游护理核对执行' },
    ],
  };
}

function nurseSpec(menuKey: string, title: string, itemName: string, formPurpose: string): ChronicMenuSpecOverride {
  return {
    title,
    subtitle: `${title}以责任护士的随访、核对、执行、宣教和异常初筛为主，页面要突出待办时限、患者反馈、异常升级和医生回流。`,
    filters: ['护理患者', '任务类型', '执行状态', '到期时间'],
    actions: ['领取任务', '批量提醒', '登记执行', '异常上报'],
    metrics: pageMetrics([
      ['待护理', '32', 'blue', '今日护理患者/任务'],
      ['即将逾期', '9', 'orange', '4小时内需完成'],
      ['异常上报', '5', 'red', '需转医生或预警'],
      ['完成率', '91%', 'green', '近7天闭环率'],
    ]),
    columns: [
      { prop: 'subject', label: '患者', minWidth: 110 },
      { prop: 'disease', label: '管理问题', minWidth: 150 },
      { prop: 'itemName', label: '护理事项', minWidth: 170 },
      { prop: 'status', label: '执行状态', minWidth: 110 },
      { prop: 'owner', label: '责任护士', minWidth: 130 },
      { prop: 'nextAction', label: '下一步', minWidth: 190 },
      { prop: 'time', label: '到期时间', width: 110 },
    ],
    rows: commonRows(menuKey, patientNames, itemName, ['待领取', '执行中', '待患者补充', '异常执行', '已完成'], ['领取任务', '电话随访', '登记护理记录', '转医生处理', '归档回写'], ['林护士', '陈护士', '赵护士', '周护士']),
    primaryFlow: primaryFlowsByDomain.nurse,
    rowOperations: rowOperationsByDomain.nurse,
    formFields: [
      { label: '护理事项', prop: 'nursingItem', component: 'select', placeholder: '请选择', options: ['电话随访', '护理评估', '医嘱核对', '宣教任务', '异常初筛', '护理记录'] },
      { label: '执行结果', prop: 'executeStatus', component: 'select', placeholder: '请选择', options: ['已执行', '患者未接听', '待患者补充', '异常执行', '转医生'] },
      { label: '患者反馈', prop: 'feedback', component: 'textarea', placeholder: formPurpose },
      { label: '下次跟进', prop: 'nextDate', component: 'date', placeholder: '请选择下次跟进日期' },
    ],
    quickLinks: quickLinksByDomain.nurse,
  };
}

function taskSpec(menuKey: string, title: string, itemName: string): ChronicMenuSpecOverride {
  return {
    title,
    subtitle: `${title}用于汇总跨模块任务、消息、签名、日志和分工，市场主流设计会突出来源单据、到期时间、提醒渠道和回写状态。`,
    filters: ['来源模块', '责任人', '任务状态', '到期时间'],
    actions: ['批量处理', '发送提醒', '转派任务', '查看来源'],
    metrics: metricsByDomain.task,
    columns: [
      { prop: 'subject', label: '对象/员工', minWidth: 120 },
      { prop: 'itemName', label: '事项', minWidth: 170 },
      { prop: 'sourceModule', label: '来源模块', minWidth: 130 },
      { prop: 'status', label: '状态', minWidth: 110 },
      { prop: 'owner', label: '责任人', minWidth: 130 },
      { prop: 'nextAction', label: '下一步', minWidth: 190 },
      { prop: 'time', label: '到期/时间', width: 120 },
    ],
    rows: makeRows(
      menuKey,
      Array.from({ length: 10 }, (_, index) => ({
        subject: ['张医生', '林护士', '吴医生', '陈护士', '导诊-沈洁', '质控管理员', '患者-王建国'][index % 7],
        itemName,
        sourceModule: ['患者签约', '居家上传', '医嘱执行', '预警事件', 'CQI整改'][index % 5],
        status: ['待处理', '处理中', '即将逾期', '已完成', '已退回'][index % 5],
        owner: ['张医生', '林护士', '导诊-沈洁', '质控管理员'][index % 4],
        nextAction: ['打开来源单据', '完成并回写', '发送提醒', '转派责任人', '查看审计'][index % 5],
        disease: diseases[index % diseases.length],
        time: ['09:00', '11:30', '今日', '明日', '已完成'][index % 5],
      })),
    ),
    primaryFlow: primaryFlowsByDomain.task,
    rowOperations: fallbackRowOperations,
    formFields: [
      { label: '任务类型', prop: 'taskType', component: 'select', placeholder: '请选择', options: ['审核', '执行', '提醒', '复查', '签名', '消息'] },
      { label: '来源单据', prop: 'sourceNo', component: 'input', placeholder: '系统自动带出来源单据号' },
      { label: '责任人', prop: 'owner', component: 'select', placeholder: '请选择责任人', options: ['张医生', '林护士', '导诊-沈洁', '质控管理员'] },
      { label: '到期时间', prop: 'dueDate', component: 'date', placeholder: '请选择到期时间' },
      { label: '处理说明', prop: 'remark', component: 'textarea', placeholder: '填写处理、转派、退回或提醒说明' },
    ],
    quickLinks: [
      { label: '医生站', workspace: '医生站', menuKey: 'doctor-my', desc: '医生任务来源' },
      { label: '护士站', workspace: '护士站', menuKey: 'nurse-patient', desc: '护理任务来源' },
      { label: '规则配置', workspace: '规则配置与质量改进', menuKey: 'rule-task', desc: '任务自动生成规则' },
    ],
  };
}

function masterSpec(menuKey: string, title: string, category: string): ChronicMenuSpecOverride {
  return {
    title,
    subtitle: `${title}是慢病系统的主数据维护页，按市场主流后台设计，需要版本、状态、引用影响、复核发布和停用校验。`,
    filters: ['名称/编码', '分类', '版本状态', '引用状态'],
    actions: ['新增基础项', '批量导入', '提交复核', '引用分析'],
    metrics: metricsByDomain.master,
    columns: columnsByDomain.master,
    rows: commonRows(menuKey, [`${category}A`, `${category}B`, `${category}C`, `${category}D`, `${category}E`], category, ['草稿', '待复核', '已启用', '引用冲突', '已停用'], ['提交复核', '发布新版本', '查看引用影响', '停用前校验', '归档旧版本'], ['基础管理员', '医务复核', '质控管理员']),
    primaryFlow: primaryFlowsByDomain.master,
    rowOperations: fallbackRowOperations,
    formFields: formFieldsByDomain.master,
    quickLinks: quickLinksByDomain.master,
  };
}

function qualitySpec(menuKey: string, title: string, itemName: string): ChronicMenuSpecOverride {
  return {
    title,
    subtitle: `${title}用于配置、识别和闭环处理慢病管理中的预警、疗效偏差、CQI和质量问题，必须突出分级、责任、期限和复查。`,
    filters: ['方案/事件名称', '风险等级', '责任人', '闭环状态'],
    actions: ['新增方案', '仿真测试', '分派处理', '复查关闭'],
    metrics: metricsByDomain.quality,
    columns: columnsByDomain.quality,
    rows: commonRows(menuKey, ['高钾血症预警', '血压控制不达标', '心衰再入院风险', '上传报告逾期', 'CQI-随访完成率'], itemName, ['待确认', '已分派', '整改中', '待复查', '已关闭'], ['分派责任人', '填写处理记录', '生成CQI整改', '复查关闭', '优化规则'], ['张医生', '林护士', '质控管理员']),
    primaryFlow: primaryFlowsByDomain.quality,
    rowOperations: rowOperationsByDomain.quality,
    formFields: formFieldsByDomain.quality,
    quickLinks: quickLinksByDomain.quality,
  };
}

function guideSpec(menuKey: string, title: string, itemName: string): ChronicMenuSpecOverride {
  return {
    title,
    subtitle: `${title}属于患者接入与服务协调页面，真实慢病居家病房产品会围绕患者、服务关系、责任团队、预约申请和协管授权展开。`,
    filters: ['患者姓名', '办理状态', '责任团队', '计划时间'],
    actions: ['新增申请', '提交审核', '分派责任人', '查看追溯'],
    metrics: pageMetrics([
      ['待办理', '21', 'blue', `${title}待导诊处理`],
      ['待审核', '8', 'orange', '需主管或医生确认'],
      ['高风险', '4', 'red', '需优先分派团队'],
      ['已完成', '76', 'green', '本周闭环数量'],
    ]),
    columns: [
      { prop: 'subject', label: '患者', minWidth: 110 },
      { prop: 'disease', label: '管理病种', minWidth: 150 },
      { prop: 'itemName', label: '办理事项', minWidth: 170 },
      { prop: 'status', label: '状态', minWidth: 110 },
      { prop: 'owner', label: '经办/责任人', minWidth: 140 },
      { prop: 'nextAction', label: '下一步', minWidth: 190 },
      { prop: 'time', label: '计划时间', width: 110 },
    ],
    rows: commonRows(menuKey, patientNames, itemName, ['待办理', '待审核', '已分派', '需补充', '已完成'], ['补全资料', '提交医生审核', '通知患者确认', '生成下游任务', '查看追溯'], ['导诊-沈洁', '导诊-黄莹', '客服-周琳']),
    primaryFlow: primaryFlowsByDomain.patient,
    rowOperations: rowOperationsByDomain.patient,
    formFields: [
      { label: '患者', prop: 'patientName', component: 'input', placeholder: '选择患者或输入姓名/证件号' },
      { label: '办理类型', prop: 'itemType', component: 'select', placeholder: '请选择', options: ['预约申请', '随访名称', '知情同意', '共享协管', '排班计划', '服务变更'] },
      { label: '计划时间', prop: 'planDate', component: 'date', placeholder: '请选择计划时间' },
      { label: '责任团队', prop: 'team', component: 'select', placeholder: '请选择团队', options: teams },
      { label: '办理说明', prop: 'remark', component: 'textarea', placeholder: '填写患者诉求、审核意见或协管范围' },
    ],
    quickLinks: [
      { label: '患者中心', workspace: '导诊台', menuKey: 'guide-patient', desc: '查看患者主档和签约状态' },
      { label: '归属分配', workspace: '导诊台', menuKey: 'guide-owner', desc: '维护医生护士责任关系' },
      { label: '医生站', workspace: '医生站', menuKey: 'doctor-my', desc: '需要临床判断时转医生处理' },
    ],
  };
}

function homeSpec(menuKey: string, title: string, itemName: string): ChronicMenuSpecOverride {
  return {
    title,
    subtitle: `${title}是患者端居家病房页面，主流设计强调任务卡、提交状态、医护反馈、在线签署和健康档案归档。`,
    filters: ['内容类型', '提交状态', '审核状态', '更新时间'],
    actions: ['新增提交', '查看医护反馈', '联系团队', '下载/签署'],
    metrics: metricOf('home'),
    columns: [
      { prop: 'subject', label: '患者/事项', minWidth: 130 },
      { prop: 'disease', label: '健康问题', minWidth: 150 },
      { prop: 'itemName', label: '居家事项', minWidth: 170 },
      { prop: 'status', label: '状态', minWidth: 110 },
      { prop: 'owner', label: '医护团队', minWidth: 140 },
      { prop: 'nextAction', label: '下一步', minWidth: 190 },
      { prop: 'time', label: '时间', width: 110 },
    ],
    rows: commonRows(menuKey, patientNames, itemName, ['待提交', '待审核', '已退回', '已归档', '异常上报'], ['提交内容', '等待医护审核', '补充材料', '查看健康档案', '联系责任护士']),
    primaryFlow: primaryFlowsByDomain.patient,
    rowOperations: rowOperationsByDomain.patient,
    formFields: [
      { label: '事项类型', prop: 'itemType', component: 'select', placeholder: '请选择', options: ['健康档案', '评估问卷', '检验上传', '签约文书', '知情同意', '团队咨询'] },
      { label: '提交内容', prop: 'content', component: 'textarea', placeholder: '填写患者端提交内容、症状、问题或签署说明' },
      { label: '附件状态', prop: 'attachment', component: 'select', placeholder: '请选择', options: ['无附件', '照片', '报告', '视频', '电子签名'] },
      { label: '期望回复', prop: 'replyDate', component: 'date', placeholder: '请选择期望回复日期' },
    ],
    quickLinks: [
      { label: '居家待办', workspace: '居家个人主页', menuKey: 'home-treatment', desc: '返回患者待办任务' },
      { label: '检验上传', workspace: '居家个人主页', menuKey: 'home-upload', desc: '上传原始报告' },
      { label: '医生站', workspace: '医生站', menuKey: 'doctor-my', desc: '医护审核和反馈' },
    ],
  };
}

function adminSpec(menuKey: string, title: string, itemName: string): ChronicMenuSpecOverride {
  return {
    title,
    subtitle: `${title}支撑慢病居家病房的组织、团队、人员、资质、值班和资源配置，重点是可用性、资格校验和变更追溯。`,
    filters: ['人员/团队/资源', '状态', '资质/班次', '生效时间'],
    actions: ['新增维护', '批量调整', '提交复核', '查看追溯'],
    metrics: pageMetrics([
      ['有效配置', '128', 'blue', '当前可用人员/资源'],
      ['待复核', '14', 'orange', '变更后待确认'],
      ['资质预警', '6', 'red', '证书或授权临期'],
      ['本周调整', '32', 'green', '排班或分工调整'],
    ]),
    columns: [
      { prop: 'subject', label: '对象', minWidth: 130 },
      { prop: 'itemName', label: '管理事项', minWidth: 170 },
      { prop: 'disease', label: '适用范围', minWidth: 150 },
      { prop: 'status', label: '状态', minWidth: 110 },
      { prop: 'owner', label: '责任人', minWidth: 130 },
      { prop: 'nextAction', label: '下一步', minWidth: 190 },
      { prop: 'time', label: '生效/到期', width: 120 },
    ],
    rows: commonRows(menuKey, ['张医生', '林护士', '心衰团队', '肾病团队', '总院区慢病病区', '远程随访组'], itemName, ['启用', '待复核', '临期预警', '调整中', '已归档'], ['提交复核', '调整分工', '更新资质', '发布生效', '查看变更'], ['医务管理员', '人事专员', '科室主任']),
    primaryFlow: primaryFlowsByDomain.system,
    rowOperations: fallbackRowOperations,
    formFields: [
      { label: '对象名称', prop: 'name', component: 'input', placeholder: '人员、团队、资源或岗位名称' },
      { label: '管理类型', prop: 'type', component: 'select', placeholder: '请选择', options: ['值班排班', '护理组别', '专家团队', '人员资质', '岗位授权', '证件证书'] },
      { label: '生效日期', prop: 'effectiveDate', component: 'date', placeholder: '请选择生效日期' },
      { label: '状态说明', prop: 'remark', component: 'textarea', placeholder: '填写调整原因、资质校验或复核意见' },
    ],
    quickLinks: [
      { label: '员工主页', workspace: '员工主页', menuKey: 'employee-duty', desc: '查看个人分工和待办' },
      { label: '系统授权', workspace: '系统管理', menuKey: 'system-role', desc: '角色权限与工作身份' },
      { label: '导诊分配', workspace: '导诊台', menuKey: 'guide-owner', desc: '责任团队被患者归属引用' },
    ],
  };
}

function labSpec(menuKey: string, title: string, itemName: string): ChronicMenuSpecOverride {
  return {
    title,
    subtitle: `${title}服务于慢病居家报告和院内LIS结果闭环，强调标本、结果、危急值、复核、归档和医生解读。`,
    filters: ['患者/条码', '标本状态', '结果状态', '危急值'],
    actions: ['接收标本', '录入结果', '标记危急值', '复核归档'],
    metrics: pageMetrics([
      ['待接收', '18', 'orange', '标本或报告待处理'],
      ['危急值', '4', 'red', '需立即通知医生'],
      ['待复核', '12', 'blue', '结果待二次确认'],
      ['已归档', '96', 'green', '本周标准化结果'],
    ]),
    columns: [
      { prop: 'subject', label: '患者/标本', minWidth: 130 },
      { prop: 'itemName', label: '检验项目', minWidth: 160 },
      { prop: 'disease', label: '临床关联', minWidth: 150 },
      { prop: 'status', label: '结果状态', minWidth: 110 },
      { prop: 'owner', label: '检验/复核人', minWidth: 130 },
      { prop: 'nextAction', label: '下一步', minWidth: 190 },
      { prop: 'time', label: '采样/报告', width: 120 },
    ],
    rows: commonRows(menuKey, patientNames, itemName, ['待接收', '录入中', '危急值', '待复核', '已归档'], ['接收标本', '录入结构化结果', '通知责任医生', '复核报告', '进入趋势分析'], ['检验-李工', '检验-王工', '复核-周工']),
    primaryFlow: [
      { key: 'receive', label: '接收/上传', desc: '接收院内标本或患者端原始报告。', actionText: '接收报告' },
      { key: 'input', label: '结果录入', desc: '录入结构化指标、单位、参考范围和异常标记。', actionText: '录入结果' },
      { key: 'critical', label: '危急值通知', desc: '危急值立即推送责任医生并记录通知回执。', actionText: '通知医生' },
      { key: 'archive', label: '复核归档', desc: '结果复核后进入医生站、趋势和智能诊断。', actionText: '复核归档' },
    ],
    rowOperations: [
      { key: 'open', label: '录入', type: 'primary', targetStatus: '录入中', feedback: '已打开检验结果录入表单。' },
      { key: 'review', label: '复核', type: 'warning', targetStatus: '待复核', feedback: '结果已提交复核。' },
      { key: 'activate', label: '归档', type: 'success', targetStatus: '已归档', feedback: '检验结果已归档并同步医生站。' },
      { key: 'trace', label: '追溯', type: 'info', targetStatus: '已归档', feedback: '已打开标本、结果、通知和归档轨迹。' },
    ],
    formFields: [
      { label: '检验项目', prop: 'labItem', component: 'input', placeholder: '请输入检验项目或条码' },
      { label: '结果值', prop: 'resultValue', component: 'input', placeholder: '填写结果值和单位' },
      { label: '异常标记', prop: 'abnormalFlag', component: 'select', placeholder: '请选择', options: ['正常', '偏高', '偏低', '危急值', '待复核'] },
      { label: '报告日期', prop: 'reportDate', component: 'date', placeholder: '请选择报告日期' },
      { label: '结果说明', prop: 'remark', component: 'textarea', placeholder: '填写原始报告说明、通知记录或复核意见' },
    ],
    quickLinks: [
      { label: '医生解读', workspace: '医生站', menuKey: 'doctor-lab', desc: '归档后进入医生检验解读' },
      { label: '智能诊断', workspace: '医生站', menuKey: 'doctor-diagnosis', desc: '异常结果触发诊断线索' },
      { label: '预警处理', workspace: '医生站', menuKey: 'doctor-quality', desc: '危急值生成预警事件' },
    ],
  };
}

function operationSpec(menuKey: string, title: string, itemName: string, area: string): ChronicMenuSpecOverride {
  return {
    title,
    subtitle: `${title}是${area}支撑页，围绕申请、审核、执行、异常、库存/设备/接口/费用回写形成闭环。`,
    filters: ['对象名称', '业务状态', '责任人', '异常级别'],
    actions: ['新增记录', '审核确认', '执行处理', '追溯导出'],
    metrics: defaultMetrics,
    columns: [
      { prop: 'subject', label: '对象', minWidth: 130 },
      { prop: 'itemName', label: '业务事项', minWidth: 170 },
      { prop: 'disease', label: '关联范围', minWidth: 150 },
      { prop: 'status', label: '状态', minWidth: 110 },
      { prop: 'owner', label: '责任人', minWidth: 130 },
      { prop: 'nextAction', label: '下一步', minWidth: 190 },
      { prop: 'time', label: '时间', width: 110 },
    ],
    rows: commonRows(menuKey, ['王建国', '李秀兰', '设备A-001', '接口-HIS', '药品批号-P202605', '报表快照'], itemName, ['待处理', '审核中', '执行中', '异常', '已归档'], ['提交审核', '执行处理', '异常登记', '复核关闭', '导出追溯'], ['药师', '库管', '设备技师', '接口管理员', '统计员']),
    primaryFlow: fallbackFlow,
    rowOperations: fallbackRowOperations,
    formFields: [
      { label: '业务对象', prop: 'subject', component: 'input', placeholder: '请输入患者、药品、设备、接口或报表对象' },
      { label: '业务类型', prop: 'type', component: 'select', placeholder: '请选择', options: ['审核', '执行', '库存', '费用', '设备', '接口', '报表', '研究'] },
      { label: '处理日期', prop: 'date', component: 'date', placeholder: '请选择处理日期' },
      { label: '处理说明', prop: 'remark', component: 'textarea', placeholder: '填写审核意见、异常原因、执行结果或追溯说明' },
    ],
    quickLinks: [
      { label: '员工待办', workspace: '员工主页', menuKey: 'employee-task', desc: '异常或审核生成个人待办' },
      { label: '统计报表', workspace: '统计报表', menuKey: 'report-quality', desc: '闭环结果进入统计分析' },
      { label: '审计日志', workspace: '系统管理', menuKey: 'system-log', desc: '关键操作留痕' },
    ],
  };
}

let generatedMenuSpecsCache: Record<string, ChronicMenuSpecOverride> | undefined;

function getGeneratedMenuSpecs(): Record<string, ChronicMenuSpecOverride> {
  if (generatedMenuSpecsCache) {
    return generatedMenuSpecsCache;
  }

  generatedMenuSpecsCache = {
  'doctor-home': clinicalSpec('doctor-home', '医生工作台', '医生综合待办', '填写今日患者风险判断、待办处理意见和随访计划'),
  'doctor-log': clinicalSpec('doctor-log', '工作日志', '医生工作日志', '记录电话沟通、诊断确认、医嘱调整和报告解读过程'),
  'doctor-record': clinicalSpec('doctor-record', '病历病程', '病程记录', '填写病程变化、治疗反应、居家数据解读和处置计划'),
  'doctor-common-assess': clinicalSpec('doctor-common-assess', '常见病情评估', '常见病情评估', '填写症状、体征、依从性和生活方式风险评估'),
  'doctor-special-assess': clinicalSpec('doctor-special-assess', '专科病情评估', '专科病情评估', '填写专科指标、并发症风险和干预建议'),
  'doctor-access': clinicalSpec('doctor-access', '血管通路', '通路/管路与伤口评估', '填写通路、管路、伤口、居家设备相关风险评估和处置建议'),
  'doctor-lab': clinicalSpec('doctor-lab', '检验检查', '检验检查解读', '填写关键指标解读、异常判断、复查建议和医嘱关联'),
  'doctor-consent': clinicalSpec('doctor-consent', '知情同意书', '知情同意文书', '维护知情同意内容、签署状态、患者/家属确认和归档说明'),
  'doctor-report': clinicalSpec('doctor-report', '健康报告', '健康报告', '编辑患者阶段性健康报告、趋势结论和管理建议'),
  'doctor-apply': clinicalSpec('doctor-apply', '向他科申请预约', '他科协作申请', '填写申请科室、目的、病情摘要和期望时间'),
  'doctor-message': clinicalSpec('doctor-message', '留言板', '医患/医护留言', '记录留言内容、回复意见、已读状态和后续任务'),
  'doctor-event': clinicalSpec('doctor-event', '临床事件', '临床事件处理', '填写事件分级、医学处置、线下就医建议和复查关闭结论'),
  'doctor-quality': qualitySpec('doctor-quality', '疗效预警与CQI', '医生预警处理'),
  'doctor-share': clinicalSpec('doctor-share', '共享协管', '共享协管申请', '填写协管对象、授权范围、共享期限和协作要求'),

  'nurse-home': nurseSpec('nurse-home', '护士工作台', '护理综合待办', '填写今日护理任务、随访计划和异常提醒'),
  'nurse-patient': nurseSpec('nurse-patient', '护理患者', '护理患者随访', '记录患者联系情况、依从性、症状和护理建议'),
  'nurse-log': nurseSpec('nurse-log', '工作日志', '护士工作日志', '记录护理执行、宣教、异常初筛和患者沟通'),
  'nurse-check': nurseSpec('nurse-check', '护理审核', '护理审核', '核对医生医嘱、患者身份、执行条件和风险提示'),
  'nurse-record': nurseSpec('nurse-record', '护理记录', '护理记录', '填写生命体征、护理评估、患者反馈和签名'),
  'nurse-message': nurseSpec('nurse-message', '留言板', '护理留言', '记录患者留言、护士回复、转医生和已读状态'),
  'nurse-treatment': nurseSpec('nurse-treatment', '血液净化治疗记录', '居家治疗/随访记录', '记录居家治疗执行、指标、异常和下次计划'),
  'nurse-archive': nurseSpec('nurse-archive', '治疗记录归档审核', '记录归档审核', '复核治疗/随访记录完整性、签名和归档状态'),
  'nurse-access': nurseSpec('nurse-access', '血管通路', '通路/管路护理', '记录通路观察、感染风险、换药和异常上报'),
  'nurse-specimen': nurseSpec('nurse-specimen', '标本采集与送检', '标本采集送检', '登记采样提醒、采集状态、送检回执和异常'),
  'nurse-common-assess': nurseSpec('nurse-common-assess', '常见病情评估', '护理常见评估', '填写症状、用药、饮食、跌倒和居家环境评估'),
  'nurse-special-assess': nurseSpec('nurse-special-assess', '专科病情评估', '护理专科评估', '填写专科风险、并发症观察和转医生建议'),
  'nurse-lab': nurseSpec('nurse-lab', '检验检查查看', '检验检查查看', '查看报告、提醒复查、标记待医生解读'),
  'nurse-refund': nurseSpec('nurse-refund', '退药退费', '退药退费申请', '登记退药退费原因、医嘱关联和审核状态'),
  'nurse-education': nurseSpec('nurse-education', '随访与宣教', '随访宣教', '记录宣教主题、患者掌握情况和下次随访计划'),
  'nurse-event': nurseSpec('nurse-event', '临床事件', '护理异常初筛', '填写事件初筛、风险分级、转医生和患者安抚记录'),
  'nurse-quality': qualitySpec('nurse-quality', '疗效预警与CQI', '护理预警与CQI'),

  'employee-task': taskSpec('employee-task', '我的待办', '个人待办'),
  'employee-message': taskSpec('employee-message', '消息中心', '消息提醒'),
  'employee-sign': taskSpec('employee-sign', '签名审核', '电子签名审核'),
  'employee-warning': qualitySpec('employee-warning', '预警处理', '个人预警处理'),
  'employee-log': taskSpec('employee-log', '工作日志', '个人工作日志'),
  'employee-duty': taskSpec('employee-duty', '分工分管', '分工分管任务'),
  'employee-profile': taskSpec('employee-profile', '员工资料', '员工资料维护'),

  'base-medical-dict': masterSpec('base-medical-dict', '医疗基础字典', '医疗字典'),
  'base-order': masterSpec('base-order', '医嘱基础资料', '医嘱项目'),
  'base-drug': masterSpec('base-drug', '药品基础资料', '药品'),
  'base-material': masterSpec('base-material', '耗材基础资料', '耗材'),
  'base-fee': masterSpec('base-fee', '费用基础资料', '费用项目'),
  'base-lab': masterSpec('base-lab', '检验检查基础资料', '检验检查项目'),
  'base-dialysis': masterSpec('base-dialysis', '血液净化专科资料', '专科资料'),
  'base-template': masterSpec('base-template', '模板基础资料', '文书模板'),

  'rule-diagnosis': qualitySpec('rule-diagnosis', '智能诊断方案', '智能诊断规则'),
  'rule-task': taskSpec('rule-task', '工作任务方案', '任务生成方案'),
  'rule-message': taskSpec('rule-message', '消息提醒规则', '消息提醒规则'),
  'rule-effect': qualitySpec('rule-effect', '疗效分析方案', '疗效分析方案'),
  'rule-warning': qualitySpec('rule-warning', '预警事件方案', '预警事件方案'),
  'rule-cqi': qualitySpec('rule-cqi', 'CQI方案', 'CQI方案'),
  'rule-flow': taskSpec('rule-flow', '数据流转规则', '数据流转规则'),

  'guide-home': guideSpec('guide-home', '导诊工作台', '导诊接入事项'),
  'guide-follow-name': guideSpec('guide-follow-name', '随访名称管理', '随访名称维护'),
  'guide-appointment': guideSpec('guide-appointment', '申请和预约', '服务申请预约'),
  'guide-schedule': guideSpec('guide-schedule', '排班排床', '居家服务排班'),
  'guide-consent': guideSpec('guide-consent', '知情同意书查看', '知情同意文书'),
  'guide-share': guideSpec('guide-share', '共享协管', '共享协管授权'),

  'home-log': homeSpec('home-log', '工作日志', '患者端互动记录'),
  'home-team': homeSpec('home-team', '我的专家团队', '专家团队咨询'),
  'home-health': homeSpec('home-health', '健康档案', '健康档案记录'),
  'home-common-assess': homeSpec('home-common-assess', '常见病情评估', '常见病情问卷'),
  'home-special-assess': homeSpec('home-special-assess', '专科病情评估', '专科病情问卷'),
  'home-patient': homeSpec('home-patient', '患者基本信息', '患者资料维护'),
  'home-contract': homeSpec('home-contract', '签约续约解约', '患者端签约服务'),
  'home-consent': homeSpec('home-consent', '知情同意书', '在线知情同意'),

  'medical-duty': adminSpec('medical-duty', '值班排班', '医护值班排班'),
  'medical-nurse-group': adminSpec('medical-nurse-group', '护理组别管理', '护理组别配置'),
  'medical-resource': adminSpec('medical-resource', '科室资源查看', '科室资源'),
  'medical-team': adminSpec('medical-team', '随访专家团队维护', '专家团队维护'),
  'medical-dynamic': adminSpec('medical-dynamic', '人员与患者动态', '人员患者动态'),
  'medical-assignment': adminSpec('medical-assignment', '医护分工与分管患者', '医护分工'),

  'hr-staff': adminSpec('hr-staff', '员工人事管理', '员工人事档案'),
  'hr-profile': adminSpec('hr-profile', '员工基本信息', '员工基本信息'),
  'hr-work': adminSpec('hr-work', '工作经历', '工作经历'),
  'hr-education': adminSpec('hr-education', '学习经历', '学习培训'),
  'hr-gcp': adminSpec('hr-gcp', 'GCP培训学习', 'GCP培训授权'),
  'hr-social': adminSpec('hr-social', '社会活动', '社会活动记录'),
  'hr-research': adminSpec('hr-research', '科研工作', '科研工作记录'),
  'hr-certificate': adminSpec('hr-certificate', '证件证书', '证件证书预警'),

  'lab-log': labSpec('lab-log', '工作日志', '检验工作日志'),
  'lab-order': labSpec('lab-order', '检验医嘱', '检验医嘱'),
  'lab-specimen': labSpec('lab-specimen', '医学标本管理', '医学标本'),
  'lab-execute': labSpec('lab-execute', '核对和执行', '检验执行'),
  'lab-input': labSpec('lab-input', '录入检验结果', '检验结果录入'),
  'lab-result': labSpec('lab-result', '检验结果', '检验结果'),
  'lab-quality': labSpec('lab-quality', '检验质量管理', '检验质控'),

  'pharmacy-log': operationSpec('pharmacy-log', '工作日志', '药房工作日志', '药房'),
  'pharmacy-audit': operationSpec('pharmacy-audit', '药师审核', '药师审核', '药房'),
  'pharmacy-execute': operationSpec('pharmacy-execute', '药师核对和执行', '药师核对执行', '药房'),
  'pharmacy-dispense': operationSpec('pharmacy-dispense', '发药退药', '发药退药', '药房'),
  'pharmacy-drug': operationSpec('pharmacy-drug', '药品信息查看', '药品信息', '药房'),
  'pharmacy-gcp': operationSpec('pharmacy-gcp', 'GCP药物协同', 'GCP药物协同', '药房'),

  'stock-drug-io': operationSpec('stock-drug-io', '药品出入库管理', '药品出入库', '药耗费用'),
  'stock-drug-warning': operationSpec('stock-drug-warning', '药品库存与预警', '药品库存预警', '药耗费用'),
  'stock-drug-use': operationSpec('stock-drug-use', '药品使用与自动消耗', '药品自动消耗', '药耗费用'),
  'stock-material-io': operationSpec('stock-material-io', '耗材出入库管理', '耗材出入库', '药耗费用'),
  'stock-material-warning': operationSpec('stock-material-warning', '耗材库存与预警', '耗材库存预警', '药耗费用'),
  'stock-material-use': operationSpec('stock-material-use', '耗材使用与自动消耗', '耗材自动消耗', '药耗费用'),
  'stock-fee': operationSpec('stock-fee', '费用管理', '费用明细', '药耗费用'),

  'device-home': operationSpec('device-home', '设备工作台', '设备待办', '设备与联机'),
  'device-bed': operationSpec('device-bed', '机位基础资料', '机位资料', '设备与联机'),
  'device-zone': operationSpec('device-zone', '机位分区管理', '机位分区', '设备与联机'),
  'device-bind': operationSpec('device-bind', '设备与机位绑定', '设备绑定', '设备与联机'),
  'device-archive': operationSpec('device-archive', '设备档案', '设备档案', '设备与联机'),
  'device-record': operationSpec('device-record', '设备管理记录', '设备管理记录', '设备与联机'),
  'device-monitor': operationSpec('device-monitor', '运行监测', '运行监测', '设备与联机'),
  'device-water': operationSpec('device-water', '水处理管理', '水处理记录', '设备与联机'),
  'device-quality': operationSpec('device-quality', '设备质控', '设备质控', '设备与联机'),

  'infection-check': qualitySpec('infection-check', '感控检查', '感控检查'),
  'infection-register': qualitySpec('infection-register', '感控登记', '感控事件登记'),
  'infection-policy': masterSpec('infection-policy', '感控制度', '感控制度'),
  'infection-training': adminSpec('infection-training', '感控培训', '感控培训'),
  'infection-report': qualitySpec('infection-report', '感控统计', '感控统计'),

  'report-patient': operationSpec('report-patient', '患者统计', '患者统计指标', '统计报表'),
  'report-dialysis': operationSpec('report-dialysis', '透析统计', '治疗统计指标', '统计报表'),
  'report-bed': operationSpec('report-bed', '机位统计', '资源统计指标', '统计报表'),
  'report-lab': operationSpec('report-lab', '检验指标统计', '检验指标', '统计报表'),
  'report-quality': operationSpec('report-quality', '质控统计', '质控指标', '统计报表'),
  'report-infection': operationSpec('report-infection', '感控指标统计', '感控指标', '统计报表'),
  'report-warning': operationSpec('report-warning', '预警统计', '预警指标', '统计报表'),
  'report-fee': operationSpec('report-fee', '费用统计', '费用指标', '统计报表'),
  'report-campus': operationSpec('report-campus', '院区对比分析', '院区对比指标', '统计报表'),

  'integration-hospital': operationSpec('integration-hospital', '院内系统接口', '院内接口同步', '接口设备集成'),
  'integration-reception': operationSpec('integration-reception', '接诊设备联机', '接诊设备采集', '接口设备集成'),
  'integration-dialysis': operationSpec('integration-dialysis', '透析机联机', '设备联机采集', '接口设备集成'),
  'integration-sync': operationSpec('integration-sync', '数据同步管理', '数据同步日志', '接口设备集成'),

  'system-user': adminSpec('system-user', '用户管理', '用户账号'),
  'system-role': adminSpec('system-role', '角色权限管理', '角色权限'),
  'system-org': adminSpec('system-org', '组织机构管理', '组织机构'),
  'system-dict': masterSpec('system-dict', '系统字典管理', '系统字典'),
  'system-menu': adminSpec('system-menu', '菜单管理', '工作站菜单'),
  'system-message': taskSpec('system-message', '消息模板管理', '消息模板'),
  'system-log': operationSpec('system-log', '日志管理', '审计日志', '系统管理'),
  'system-param': masterSpec('system-param', '系统参数管理', '系统参数'),
  'system-backup': operationSpec('system-backup', '数据备份与恢复', '备份恢复', '系统管理'),
  'system-monitor': operationSpec('system-monitor', '系统监控', '系统监控', '系统管理'),

  'crc-project': operationSpec('crc-project', '项目管理', '研究项目', 'CRC研究'),
  'crc-screen': operationSpec('crc-screen', '受试者筛选', '受试者筛选', 'CRC研究'),
  'crc-soa': operationSpec('crc-soa', 'SoA访视日程', 'SoA访视', 'CRC研究'),
  'crc-visit': operationSpec('crc-visit', '访视表单', '访视表单', 'CRC研究'),
  'crc-ae': operationSpec('crc-ae', '不良事件', 'AE/SAE', 'CRC研究'),
  'crc-drug': operationSpec('crc-drug', '研究药物管理', '研究药物', 'CRC研究'),
  'crc-specimen': operationSpec('crc-specimen', '标本链管理', '标本链', 'CRC研究'),
  'crc-query': operationSpec('crc-query', '数据核查', '数据质疑', 'CRC研究'),
  'crc-audit': operationSpec('crc-audit', '审计追踪', '研究审计', 'CRC研究'),
  'crc-export': operationSpec('crc-export', '数据导出', '研究数据导出', 'CRC研究'),

  'board-home': operationSpec('board-home', '运营总览', '运营总览指标', '科室看板'),
  'board-today': operationSpec('board-today', '今日透析', '今日服务队列', '科室看板'),
  'board-warning': qualitySpec('board-warning', '预警与危急值', '预警危急值'),
  'board-task': taskSpec('board-task', '待办汇总', '跨角色待办'),
  'board-device': operationSpec('board-device', '设备与水质', '设备水质状态', '科室看板'),
  };

  return generatedMenuSpecsCache;
}

const domainByWorkspace: Record<string, string> = {
  科室看板: 'board',
  员工主页: 'staff',
  导诊台: 'patient',
  医生站: 'doctor',
  护士站: 'nurse',
  检验科工作站: 'lab',
  药房站: 'pharmacy',
  药品耗材与费用管理: 'stock',
  技师与设备站: 'device',
  医务医事站: 'staff',
  行政人事站: 'staff',
  居家个人主页: 'home',
  基础数据中心: 'master',
  规则配置与质量改进: 'rule',
  统计报表: 'report',
  感控管理: 'quality',
  接口与设备集成管理: 'integration',
  '药物临床研究 / CRC站': 'research',
  系统管理: 'system',
};

const domainByMenu: Record<string, string> = {
  'doctor-diagnosis': 'diagnosis',
  'doctor-common-assess': 'diagnosis',
  'doctor-special-assess': 'diagnosis',
  'doctor-quality': 'quality',
  'nurse-quality': 'quality',
  'rule-diagnosis': 'diagnosis',
  'rule-task': 'task',
  'rule-message': 'task',
  'rule-flow': 'task',
  'rule-warning': 'quality',
  'rule-effect': 'quality',
  'rule-cqi': 'quality',
  'home-upload': 'home',
  'home-event': 'quality',
  'home-common-assess': 'diagnosis',
  'home-special-assess': 'diagnosis',
  'lab-input': 'diagnosis',
  'lab-result': 'diagnosis',
  'lab-quality': 'quality',
  'employee-task': 'task',
  'employee-message': 'task',
  'employee-log': 'task',
  'system-user': 'system',
  'system-role': 'system',
  'system-menu': 'system',
  'system-log': 'system',
};

const filterByDomain: Record<string, string[]> = {
  board: ['院区/团队', '患者状态', '预警级别', '任务到期'],
  patient: ['患者姓名/证件号', '签约状态', '责任团队', '风险等级'],
  doctor: ['责任患者', '诊断状态', '医嘱状态', '预警级别'],
  diagnosis: ['患者/规则名称', '识别来源', '确认状态', '证据类型'],
  nurse: ['护理患者', '任务状态', '计划日期', '异常等级'],
  home: ['居家患者', '提交类型', '审核状态', '异常等级'],
  staff: ['员工/团队', '任务类型', '处理状态', '到期时间'],
  task: ['任务来源', '责任人', '状态', '提醒渠道'],
  master: ['基础项名称', '分类', '版本状态', '引用状态'],
  rule: ['方案名称', '规则类型', '发布状态', '命中状态'],
  quality: ['事件类型', '风险等级', '责任人', '闭环状态'],
  report: ['指标分类', '统计周期', '院区/团队', '达标状态'],
  integration: ['系统/设备', '同步状态', '接口类型', '异常级别'],
  system: ['账号/角色', '组织机构', '启用状态', '复核状态'],
  lab: ['患者/检验项目', '标本状态', '结果状态', '危急值'],
  pharmacy: ['医嘱/药品', '审核状态', '库存状态', '用药风险'],
  stock: ['药耗名称', '库存状态', '效期状态', '批号追溯'],
  device: ['设备/终端', '联机状态', '巡检状态', '异常级别'],
  research: ['项目/受试者', '访视状态', '质疑状态', 'AE等级'],
};

const actionsByDomain: Record<string, string[]> = {
  board: ['进入待办', '处理预警', '生成CQI', '导出日报'],
  patient: ['新增患者', '签约建档', '分配团队', '发起随访'],
  doctor: ['诊断确认', '新开医嘱', '处理预警', '生成报告'],
  diagnosis: ['仿真规则', '确认诊断', '否认线索', '转工作任务'],
  nurse: ['领取任务', '护理评估', '核对执行', '异常上报'],
  home: ['提交评估', '上传报告', '上报异常', '在线签署'],
  staff: ['处理待办', '发送消息', '签名复核', '查看日志'],
  task: ['生成任务', '合并去重', '重发提醒', '回写来源'],
  master: ['新增基础项', '导入字典', '提交复核', '引用分析'],
  rule: ['新增方案', '仿真测试', '发布启用', '查看日志'],
  quality: ['处理事件', '分派责任人', '生成CQI', '复查关闭'],
  report: ['刷新指标', '下钻明细', '导出报表', '生成改进任务'],
  integration: ['同步重试', '字段映射', '人工处理', '查看日志'],
  system: ['新增账号', '批量授权', '提交复核', '审计追溯'],
  lab: ['接收标本', '录入结果', '标记危急值', '复核归档'],
  pharmacy: ['药师审核', '禁忌检查', '调配发药', '退回医生'],
  stock: ['入库登记', '消耗确认', '效期处理', '批号追溯'],
  device: ['设备巡检', '异常登记', '远程采集', '放行复核'],
  research: ['筛选受试者', '记录访视', '上报AE', '数据核查'],
};

const primaryFlowsByDomain: Record<string, ChronicOperationStep[]> = {
  patient: [
    { key: 'create', label: '建档/签约', desc: '补全患者身份、联系人、医保、服务包和随访名称。', actionText: '打开建档表单' },
    { key: 'assign', label: '归属分配', desc: '分配主诊医生、责任护士、专家团队和共享协管范围。', actionText: '分配责任团队' },
    { key: 'review', label: '审核纳入', desc: '审核签约材料、知情同意和居家管理适应性。', actionText: '提交审核' },
    { key: 'archive', label: '进入在管', desc: '生效后生成居家待办、随访计划和患者时间轴。', actionText: '生效归档' },
  ],
  doctor: [
    { key: 'assess', label: '诊疗评估', desc: '查看患者360、检验趋势、居家评估和临床事件。', actionText: '打开评估' },
    { key: 'order', label: '医嘱决策', desc: '确认诊断后开立医嘱、健康建议和随访要求。', actionText: '新开医嘱' },
    { key: 'warn', label: '风险处理', desc: '处理危急值、智能诊断线索和预警事件。', actionText: '处理预警' },
    { key: 'report', label: '报告发布', desc: '生成健康报告并发布到居家个人主页。', actionText: '发布报告' },
  ],
  diagnosis: [
    { key: 'simulate', label: '规则仿真', desc: '按检验、评估、居家上传数据验证触发条件。', actionText: '仿真规则' },
    { key: 'evidence', label: '证据查看', desc: '查看命中证据、历史趋势和诊断组合。', actionText: '查看证据' },
    { key: 'confirm', label: '医生确认', desc: '确认、否认、忽略或转为工作任务。', actionText: '确认诊断' },
    { key: 'writeback', label: '写入诊断', desc: '确认后生成正式诊断并进入患者时间轴。', actionText: '写入病历' },
  ],
  nurse: [
    { key: 'receive', label: '领取待办', desc: '从随访计划、医生医嘱和患者上报生成护理任务。', actionText: '领取任务' },
    { key: 'execute', label: '核对执行', desc: '核对医嘱、执行护理措施、登记宣教和评估。', actionText: '核对执行' },
    { key: 'exception', label: '异常上报', desc: '异常初筛后转医生、预警或CQI。', actionText: '异常上报' },
    { key: 'close', label: '护理闭环', desc: '完成签名，回写患者时间轴和工作日志。', actionText: '完成闭环' },
  ],
  quality: [
    { key: 'dispatch', label: '分派事件', desc: '确认预警级别、责任人、处理期限和通知渠道。', actionText: '分派责任人' },
    { key: 'handle', label: '处理记录', desc: '填写处置措施、附件、患者反馈和复核要求。', actionText: '填写处理' },
    { key: 'cqi', label: 'CQI整改', desc: '从高频问题或疗效异常生成持续改进项目。', actionText: '生成CQI' },
    { key: 'review', label: '复查关闭', desc: '复查达标后关闭，未达标重新整改。', actionText: '复查关闭' },
  ],
  master: [
    { key: 'draft', label: '维护基础项', desc: '新增或修订医嘱、检验、诊断、评估和任务字典。', actionText: '新增基础项' },
    { key: 'impact', label: '引用分析', desc: '检查被医生、护士、规则和报表引用的影响。', actionText: '引用分析' },
    { key: 'review', label: '复核发布', desc: '基础数据管理员提交复核并发布版本。', actionText: '提交复核' },
    { key: 'sync', label: '同步生效', desc: '同步到页面选项、规则条件和接口映射。', actionText: '发布生效' },
  ],
  task: [
    { key: 'trigger', label: '触发任务', desc: '从签约、评估、医嘱、预警和CQI生成任务。', actionText: '生成任务' },
    { key: 'merge', label: '去重合并', desc: '同源同类任务按患者、规则和时间窗合并。', actionText: '合并任务' },
    { key: 'remind', label: '消息提醒', desc: '按APP、短信、站内信发送提醒并记录回执。', actionText: '发送提醒' },
    { key: 'writeback', label: '源单回写', desc: '完成后回写来源业务状态和工作日志。', actionText: '回写来源' },
  ],
  system: [
    { key: 'account', label: '账号维护', desc: '维护员工账号、工作身份、角色和状态。', actionText: '新增账号' },
    { key: 'auth', label: '权限授权', desc: '配置工作站、菜单、按钮和数据范围。', actionText: '批量授权' },
    { key: 'review', label: '复核生效', desc: '权限变更提交复核后才生效。', actionText: '提交复核' },
    { key: 'audit', label: '审计追踪', desc: '登录、切换身份、授权和关键操作可追溯。', actionText: '查看审计' },
  ],
};

const fallbackFlow: ChronicOperationStep[] = [
  { key: 'create', label: '新建记录', desc: '登记当前页面业务对象和必要字段。', actionText: '新增记录' },
  { key: 'review', label: '审核确认', desc: '责任人确认业务内容、风险和完整性。', actionText: '提交审核' },
  { key: 'handle', label: '执行处理', desc: '完成当前业务动作并写入过程记录。', actionText: '执行处理' },
  { key: 'close', label: '归档关闭', desc: '沉淀时间轴、审计和统计口径。', actionText: '归档关闭' },
];

const rowOperationsByDomain: Record<string, ChronicRowOperation[]> = {
  patient: [
    { key: 'open', label: '建档', type: 'primary', targetStatus: '待签约', feedback: '已打开患者建档抽屉，补全主档、联系人和医保信息。' },
    { key: 'review', label: '审核', type: 'warning', targetStatus: '待审核', feedback: '签约材料已提交审核，导诊和责任团队将收到待办。' },
    { key: 'activate', label: '生效', type: 'success', targetStatus: '在管', feedback: '签约已生效，已生成居家随访任务和患者时间轴。' },
    { key: 'trace', label: '追溯', type: 'info', targetStatus: '在管', feedback: '已打开患者签约、归属、随访和上传记录追溯。' },
  ],
  doctor: [
    { key: 'assess', label: '评估', type: 'primary', targetStatus: '处理中', feedback: '已进入患者360评估，加载诊断、检验、居家上传和事件。' },
    { key: 'confirm', label: '确认', type: 'success', targetStatus: '已确认', feedback: '诊断/医嘱已确认，护士站和患者端待办同步更新。' },
    { key: 'reject', label: '退回', type: 'warning', targetStatus: '已退回', feedback: '已退回并要求补充材料，原因写入审计。' },
    { key: 'trace', label: '追溯', type: 'info', targetStatus: '处理中', feedback: '已打开医嘱、诊断、报告和预警处理链路。' },
  ],
  diagnosis: [
    { key: 'evidence', label: '证据', type: 'primary', targetStatus: '待确认', feedback: '已打开命中证据、规则条件和趋势图。' },
    { key: 'confirm', label: '确认', type: 'success', targetStatus: '已确认', feedback: '智能诊断已转正式诊断并写入病历。' },
    { key: 'deny', label: '否认', type: 'warning', targetStatus: '已否认', feedback: '已记录否认原因，规则命中保留审计。' },
    { key: 'task', label: '转任务', type: 'info', targetStatus: '已转任务', feedback: '已生成医生待办并关联原始识别结果。' },
  ],
  nurse: [
    { key: 'receive', label: '领取', type: 'primary', targetStatus: '处理中', feedback: '护理任务已领取，锁定当前责任护士。' },
    { key: 'execute', label: '执行', type: 'success', targetStatus: '已完成', feedback: '护理执行已完成，写入护理记录和患者时间轴。' },
    { key: 'exception', label: '异常', type: 'danger', targetStatus: '异常执行', feedback: '已登记异常原因并转医生/预警处理。' },
    { key: 'trace', label: '追溯', type: 'info', targetStatus: '处理中', feedback: '已打开护理任务来源、执行签名和回写记录。' },
  ],
  quality: [
    { key: 'dispatch', label: '分派', type: 'primary', targetStatus: '已分派', feedback: '预警已分派责任人并设置处理期限。' },
    { key: 'handle', label: '处理', type: 'warning', targetStatus: '整改中', feedback: '已保存处理记录，必要时生成CQI整改。' },
    { key: 'close', label: '关闭', type: 'success', targetStatus: '已关闭', feedback: '复查达标，预警/CQI已关闭并同步报表。' },
    { key: 'trace', label: '追溯', type: 'info', targetStatus: '待复查', feedback: '已打开来源指标、处理记录和复查轨迹。' },
  ],
};

const fallbackRowOperations: ChronicRowOperation[] = [
  { key: 'open', label: '办理', type: 'primary', targetStatus: '处理中', feedback: '已打开业务办理抽屉。' },
  { key: 'review', label: '审核', type: 'warning', targetStatus: '待复核', feedback: '已提交复核，责任人收到待办。' },
  { key: 'done', label: '完成', type: 'success', targetStatus: '已完成', feedback: '已完成处理并回写来源业务。' },
  { key: 'trace', label: '追溯', type: 'info', targetStatus: '处理中', feedback: '已打开审计和时间轴追溯。' },
];

const quickLinksByDomain: Record<string, ChronicQuickLink[]> = {
  patient: [
    { label: '医生审核', workspace: '医生站', menuKey: 'doctor-home', desc: '签约与居家数据进入医生审核' },
    { label: '护士随访', workspace: '护士站', menuKey: 'nurse-home', desc: '生成护理随访和宣教任务' },
    { label: '居家主页', workspace: '居家个人主页', menuKey: 'home-health', desc: '患者查看健康档案和待办' },
  ],
  doctor: [
    { label: '护士执行', workspace: '护士站', menuKey: 'nurse-execute', desc: '医嘱下发后进入护士核对执行' },
    { label: '智能诊断', workspace: '规则配置与质量改进', menuKey: 'rule-diagnosis', desc: '查看诊断规则来源' },
    { label: '健康报告', workspace: '居家个人主页', menuKey: 'home-health', desc: '报告发布到患者端' },
  ],
  nurse: [
    { label: '医生复核', workspace: '医生站', menuKey: 'doctor-event', desc: '异常初筛转医生处理' },
    { label: '患者待办', workspace: '居家个人主页', menuKey: 'home-treatment', desc: '宣教与随访同步患者端' },
    { label: '工作日志', workspace: '员工主页', menuKey: 'employee-log', desc: '执行结果写入个人日志' },
  ],
  quality: [
    { label: '员工待办', workspace: '员工主页', menuKey: 'employee-task', desc: '预警分派到责任人' },
    { label: '规则方案', workspace: '规则配置与质量改进', menuKey: 'rule-warning', desc: '调整预警触发条件' },
    { label: '统计报表', workspace: '统计报表', menuKey: 'report-quality', desc: '闭环结果进入质控统计' },
  ],
  master: [
    { label: '规则引用', workspace: '规则配置与质量改进', menuKey: 'rule-flow', desc: '发布后同步规则方案' },
    { label: '医生医嘱', workspace: '医生站', menuKey: 'doctor-order', desc: '医嘱字典被医生站引用' },
    { label: '检验标准', workspace: '检验科工作站', menuKey: 'lab-result', desc: '检验项目标准化引用' },
  ],
  system: [
    { label: '基础数据', workspace: '基础数据中心', menuKey: 'base-medical-dict', desc: '授权后维护主数据' },
    { label: '员工主页', workspace: '员工主页', menuKey: 'employee-task', desc: '权限影响个人任务入口' },
    { label: '审计日志', workspace: '系统管理', menuKey: 'system-log', desc: '查看登录与授权日志' },
  ],
};

const formFieldsByDomain: Record<string, ChronicFormField[]> = {
  patient: [
    { label: '患者姓名', prop: 'patientName', component: 'input', placeholder: '请输入患者姓名' },
    { label: '证件号码', prop: 'idNo', component: 'input', placeholder: '请输入证件号码' },
    { label: '签约状态', prop: 'contractStatus', component: 'select', placeholder: '请选择', options: ['申请中', '在管', '暂停', '解约'] },
    { label: '责任团队', prop: 'team', component: 'select', placeholder: '请选择责任团队', options: teams },
    { label: '处理说明', prop: 'remark', component: 'textarea', placeholder: '填写建档、签约或分配说明' },
  ],
  doctor: [
    { label: '临床判断', prop: 'clinicalJudgement', component: 'textarea', placeholder: '填写诊断依据、医嘱调整或报告建议' },
    { label: '医嘱类型', prop: 'orderType', component: 'select', placeholder: '请选择', options: ['长期医嘱', '临时医嘱', '检验医嘱', '护理医嘱'] },
    { label: '风险级别', prop: 'riskLevel', component: 'select', placeholder: '请选择', options: ['一般', '关注', '高危', '危急'] },
    { label: '复查日期', prop: 'reviewDate', component: 'date', placeholder: '请选择复查日期' },
  ],
  diagnosis: [
    { label: '确认结论', prop: 'confirmResult', component: 'select', placeholder: '请选择', options: ['确认', '否认', '忽略', '转任务'] },
    { label: '证据说明', prop: 'evidence', component: 'textarea', placeholder: '填写检验、评估或居家上传证据' },
    { label: '诊断编码', prop: 'diagnosisCode', component: 'input', placeholder: '请输入诊断编码' },
  ],
  nurse: [
    { label: '护理措施', prop: 'nursingAction', component: 'textarea', placeholder: '填写随访、宣教、执行或异常处理内容' },
    { label: '执行状态', prop: 'executeStatus', component: 'select', placeholder: '请选择', options: ['已执行', '异常执行', '拒绝执行', '转医生'] },
    { label: '下次随访', prop: 'nextVisit', component: 'date', placeholder: '请选择下次随访日期' },
  ],
  quality: [
    { label: '责任人', prop: 'owner', component: 'select', placeholder: '请选择责任人', options: ['张医生', '林护士', '质控管理员', '团队负责人'] },
    { label: '处理期限', prop: 'dueDate', component: 'date', placeholder: '请选择期限' },
    { label: '处理措施', prop: 'handleMeasure', component: 'textarea', placeholder: '填写处置、整改或复查结果' },
  ],
  master: [
    { label: '基础项名称', prop: 'dictName', component: 'input', placeholder: '请输入基础项名称' },
    { label: '分类', prop: 'dictType', component: 'select', placeholder: '请选择分类', options: ['医嘱', '检验', '评估', '诊断', '任务'] },
    { label: '生效日期', prop: 'effectiveDate', component: 'date', placeholder: '请选择生效日期' },
    { label: '变更说明', prop: 'changeNote', component: 'textarea', placeholder: '填写版本变更和影响范围' },
  ],
};

const fallbackFormFields: ChronicFormField[] = [
  { label: '业务对象', prop: 'subject', component: 'input', placeholder: '请输入业务对象' },
  { label: '状态', prop: 'status', component: 'select', placeholder: '请选择状态', options: ['草稿', '待审核', '处理中', '已完成'] },
  { label: '处理说明', prop: 'remark', component: 'textarea', placeholder: '填写处理说明' },
];

const metricsByDomain: Record<string, ChronicMetric[]> = {
  patient: [
    { label: '在管患者', value: '286', tone: 'blue', hint: '签约生效且有责任团队' },
    { label: '待签约', value: '18', tone: 'orange', hint: '资料齐全待确认' },
    { label: '高风险', value: '23', tone: 'red', hint: '近7天异常或预警' },
    { label: '本周随访', value: '96', tone: 'green', hint: '计划内待完成' },
  ],
  doctor: [
    { label: '责任患者', value: '74', tone: 'blue', hint: '当前医生管理范围' },
    { label: '待确认诊断', value: '12', tone: 'orange', hint: '智能诊断待处理' },
    { label: '危急预警', value: '4', tone: 'red', hint: '需当日处理' },
    { label: '已发布报告', value: '31', tone: 'green', hint: '本月健康报告' },
  ],
  nurse: [
    { label: '护理待办', value: '42', tone: 'blue', hint: '今日需处理' },
    { label: '待随访', value: '19', tone: 'orange', hint: '计划内未完成' },
    { label: '异常初筛', value: '6', tone: 'red', hint: '需转医生确认' },
    { label: '已闭环', value: '88%', tone: 'green', hint: '近7天完成率' },
  ],
  quality: [
    { label: '待处理预警', value: '26', tone: 'red', hint: '含危急与超期' },
    { label: 'CQI进行中', value: '8', tone: 'orange', hint: '整改或复查阶段' },
    { label: '疗效异常', value: '17', tone: 'blue', hint: '规则命中未确认' },
    { label: '关闭率', value: '91%', tone: 'green', hint: '本月质量闭环' },
  ],
  master: [
    { label: '启用字典', value: '1,248', tone: 'blue', hint: '当前可引用' },
    { label: '待复核', value: '37', tone: 'orange', hint: '版本变更' },
    { label: '引用冲突', value: '5', tone: 'red', hint: '停用前需处理' },
    { label: '本月发布', value: '64', tone: 'green', hint: '新版本' },
  ],
  task: [
    { label: '待处理任务', value: '138', tone: 'blue', hint: '跨角色汇总' },
    { label: '即将逾期', value: '16', tone: 'orange', hint: '24小时内到期' },
    { label: '已逾期', value: '7', tone: 'red', hint: '需升级提醒' },
    { label: '回写成功', value: '96%', tone: 'green', hint: '源单据同步' },
  ],
};

const defaultMetrics: ChronicMetric[] = [
  { label: '待处理', value: '32', tone: 'blue', hint: '当前页面待办' },
  { label: '待复核', value: '11', tone: 'orange', hint: '需要审核确认' },
  { label: '高风险', value: '4', tone: 'red', hint: '需优先处理' },
  { label: '已闭环', value: '89%', tone: 'green', hint: '近7天完成率' },
];

const columnsByDomain: Record<string, ChronicTableColumn[]> = {
  patient: [
    { prop: 'subject', label: '患者', minWidth: 120 },
    { prop: 'disease', label: '管理病种', minWidth: 150 },
    { prop: 'status', label: '签约/任务状态', minWidth: 130 },
    { prop: 'owner', label: '责任团队', minWidth: 150 },
    { prop: 'nextAction', label: '下一步', minWidth: 160 },
    { prop: 'time', label: '计划时间', width: 110 },
  ],
  doctor: [
    { prop: 'subject', label: '责任患者', minWidth: 120 },
    { prop: 'disease', label: '诊断/问题', minWidth: 160 },
    { prop: 'status', label: '临床状态', minWidth: 120 },
    { prop: 'owner', label: '处理人', minWidth: 130 },
    { prop: 'nextAction', label: '医生下一步', minWidth: 170 },
    { prop: 'time', label: '更新时间', width: 110 },
  ],
  nurse: [
    { prop: 'subject', label: '护理患者', minWidth: 120 },
    { prop: 'disease', label: '护理事项', minWidth: 150 },
    { prop: 'status', label: '执行状态', minWidth: 120 },
    { prop: 'owner', label: '责任护士', minWidth: 130 },
    { prop: 'nextAction', label: '下一步', minWidth: 170 },
    { prop: 'time', label: '到期时间', width: 110 },
  ],
  master: [
    { prop: 'subject', label: '基础项', minWidth: 150 },
    { prop: 'disease', label: '分类/版本', minWidth: 150 },
    { prop: 'status', label: '状态', minWidth: 110 },
    { prop: 'owner', label: '维护人', minWidth: 130 },
    { prop: 'nextAction', label: '影响/下一步', minWidth: 190 },
    { prop: 'time', label: '生效日', width: 110 },
  ],
  quality: [
    { prop: 'subject', label: '事件/项目', minWidth: 150 },
    { prop: 'disease', label: '来源', minWidth: 150 },
    { prop: 'status', label: '闭环状态', minWidth: 120 },
    { prop: 'owner', label: '责任人', minWidth: 130 },
    { prop: 'nextAction', label: '处理要求', minWidth: 190 },
    { prop: 'time', label: '期限', width: 110 },
  ],
  system: [
    { prop: 'subject', label: '账号/权限对象', minWidth: 150 },
    { prop: 'disease', label: '组织/角色', minWidth: 150 },
    { prop: 'status', label: '状态', minWidth: 110 },
    { prop: 'owner', label: '管理员', minWidth: 130 },
    { prop: 'nextAction', label: '下一步', minWidth: 170 },
    { prop: 'time', label: '更新时间', width: 110 },
  ],
};

function domainOf(context: PageContext): string {
  return domainByMenu[context.menuKey] ?? domainByWorkspace[context.workspace] ?? 'patient';
}

function operationDomain(domain: string): string {
  if (domain === 'home') return 'patient';
  if (domain === 'staff') return 'task';
  if (domain === 'rule') return 'quality';
  if (domain === 'lab') return 'diagnosis';
  if (['pharmacy', 'stock', 'device', 'integration', 'report', 'research'].includes(domain)) return 'quality';
  return domain;
}

function metricOf(domain: string): ChronicMetric[] {
  if (domain === 'diagnosis') return metricsByDomain.doctor;
  if (domain === 'rule') return metricsByDomain.quality;
  if (domain === 'home') return metricsByDomain.patient;
  if (domain === 'staff') return metricsByDomain.task;
  return metricsByDomain[domain] ?? defaultMetrics;
}

function columnsOf(domain: string): ChronicTableColumn[] {
  if (domain === 'diagnosis') return columnsByDomain.doctor;
  if (domain === 'home') return columnsByDomain.patient;
  if (domain === 'staff' || domain === 'task') return columnsByDomain.nurse;
  if (domain === 'rule') return columnsByDomain.quality;
  return columnsByDomain[domain] ?? columnsByDomain.patient;
}

function rowStatus(domain: string, index: number): string {
  const statusMap: Record<string, string[]> = {
    patient: ['在管', '待签约', '待审核', '暂停服务', '已归档'],
    doctor: ['待确认', '待审核', '处理中', '已发布', '已归档'],
    diagnosis: ['待确认', '已确认', '已否认', '已忽略', '已转任务'],
    nurse: ['待处理', '执行中', '异常执行', '待复核', '已完成'],
    home: ['待提交', '待审核', '已退回', '已归档', '异常上报'],
    master: ['草稿', '待复核', '已启用', '引用冲突', '已停用'],
    quality: ['待确认', '已分派', '整改中', '待复查', '已关闭'],
    task: ['待处理', '处理中', '即将逾期', '已逾期', '已完成'],
    system: ['启用', '待复核', '锁定', '已生效', '已回滚'],
  };
  const list = statusMap[domain] ?? statusMap.patient;
  return list[index % list.length];
}

function nextAction(domain: string, title: string, index: number): string {
  const actions: Record<string, string[]> = {
    patient: ['补全签约资料', '分配主责医护', '审核居家申请', '生成随访任务'],
    doctor: ['确认诊断线索', '调整医嘱方案', '解读上传报告', '发布健康报告'],
    diagnosis: ['查看命中证据', '医生确认', '填写否认原因', '转随访任务'],
    nurse: ['完成电话随访', '核对执行医嘱', '记录护理评估', '异常转医生'],
    home: ['提交居家评估', '补传原始报告', '确认知情同意', '等待医护审核'],
    master: ['提交复核', '查看引用影响', '发布新版本', '停用前校验'],
    quality: ['分派责任人', '填写处理记录', '发起CQI整改', '复查关闭'],
    task: ['发送提醒', '合并重复任务', '回写源单据', '升级处理'],
    system: ['复核授权', '查看审计', '调整数据范围', '同步菜单'],
  };
  const list = actions[domain] ?? ['打开办理', '审核确认', '处理闭环', '查看追溯'];
  return `${title}: ${list[index % list.length]}`;
}

function rowsOf(context: PageContext, domain: string): ChronicTableRow[] {
  return Array.from({ length: 12 }, (_, index) => ({
    id: `${context.menuKey}-${index + 1}`,
    subject:
      domain === 'master'
        ? ['医嘱频次字典', '检验项目标准化', '诊断编码', '任务分类', '随访名称', '用药字典'][index % 6]
        : domain === 'system'
          ? ['张医生', '责任护士组', '慢病医生角色', '居家工作站菜单', '接口管理员'][index % 5]
          : domain === 'quality'
            ? ['高钾血症预警', '血压控制CQI', '居家跌倒事件', '报告逾期提醒', '疗效未达标'][index % 5]
            : patientNames[index % patientNames.length],
    disease: domain === 'master' ? `V${(index % 4) + 1}.0 / ${context.menuTitle}` : diseases[index % diseases.length],
    status: rowStatus(domain, index),
    owner: domain === 'patient' || domain === 'home' ? owners[index % owners.length] : teams[index % teams.length],
    nextAction: nextAction(domain, context.menuTitle, index),
    time: `05-${String(14 + (index % 12)).padStart(2, '0')}`,
  }));
}

function sectionsOf(context: PageContext, domain: string, coreActions: string[]): ChronicWorkbenchSection[] {
  return [
    {
      title: `${context.menuTitle}办理区`,
      items: coreActions.slice(0, 4),
    },
    {
      title: '审核与确认',
      items: ['提交后进入待复核', '责任人在线处理', '异常项必须填写原因', '电子签名和操作日志自动留痕'],
    },
    {
      title: '闭环追踪',
      items:
        domain === 'quality'
          ? ['处理记录回写预警事件', '整改措施生成CQI任务', '复查结果决定关闭或再整改', '指标同步统计报表']
          : ['处理结果回写来源业务', '生成患者时间轴', '同步员工主页待办', '沉淀统计报表和审计记录'],
    },
  ];
}

export function getChronicPrototypePage(context: PageContext): ChronicPrototypePageSpec {
  const doc = getChronicPageDoc(context);
  const domain = domainOf(context);
  const actions = actionsByDomain[domain] ?? actionsByDomain.patient;
  const filters = filterByDomain[domain] ?? filterByDomain.patient;
  const opDomain = operationDomain(domain);
  const baseSpec: ChronicPrototypePageSpec = {
    title: context.menuTitle,
    subtitle: doc.positioning,
    activeObject: `${context.workspace} / ${context.menuTitle}`,
    sourceDocs: doc.sourceDocs,
    filters,
    actions,
    metrics: metricOf(domain),
    columns: columnsOf(domain),
    rows: rowsOf(context, domain),
    sections: sectionsOf(context, domain, doc.coreActions),
    detailItems: [
      { label: '当前身份', value: context.role },
      { label: '所属范围', value: context.department },
      { label: '业务对象', value: doc.businessObjects.slice(0, 3).join('、') },
      { label: '关键字段', value: doc.keyFields.slice(0, 4).join(' / ') },
    ],
    riskAlerts: doc.ruleLinks.slice(0, 4),
    timeline: [...doc.upstream.slice(0, 2), ...doc.statusFlow.slice(0, 2), ...doc.downstream.slice(0, 2)],
    upstream: doc.upstream,
    downstream: doc.downstream,
    primaryFlow: primaryFlowsByDomain[opDomain] ?? fallbackFlow,
    rowOperations: rowOperationsByDomain[opDomain] ?? fallbackRowOperations,
    quickLinks: quickLinksByDomain[opDomain] ?? quickLinksByDomain.patient,
    formFields: formFieldsByDomain[opDomain] ?? fallbackFormFields,
    auditTrail: [
      { title: '创建/接收', desc: `${context.menuTitle}已从上游业务进入当前页面。`, time: '08:30' },
      { title: '提交处理', desc: '责任人完成表单补充并提交下一环节。', time: '09:15' },
      { title: '审核/核对', desc: '系统记录审核意见、电子签名和数据变更。', time: '10:20' },
      { title: '归档回写', desc: '结果回写患者时间轴、任务中心、报表和审计。', time: '11:05' },
    ],
  };

  const override = firstBatchMenuSpecs[context.menuKey] ?? getGeneratedMenuSpecs()[context.menuKey];
  if (!override) {
    return baseSpec;
  }

  return {
    ...baseSpec,
    ...override,
    activeObject: baseSpec.activeObject,
    sourceDocs: baseSpec.sourceDocs,
    detailItems: override.detailItems ?? [
      { label: '当前身份', value: context.role },
      { label: '所属范围', value: context.department },
      { label: '业务对象', value: (override.columns ?? baseSpec.columns).slice(0, 3).map((item) => item.label).join('、') },
      { label: '当前页面', value: override.title ?? context.menuTitle },
    ],
    riskAlerts: override.riskAlerts ?? baseSpec.riskAlerts,
    timeline: override.timeline ?? baseSpec.timeline,
    upstream: override.upstream ?? baseSpec.upstream,
    downstream: override.downstream ?? baseSpec.downstream,
    auditTrail: override.auditTrail ?? baseSpec.auditTrail,
  };
}
