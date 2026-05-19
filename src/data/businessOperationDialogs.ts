import type { PageContext } from '../types';
import type { ChronicFormField, ChronicPrototypePageSpec, ChronicTableRow } from './chronicPrototypePages';

export interface BusinessOperationDialogSpec {
  operationKey: string;
  title: string;
  description: string;
  targetStatus: string;
  submitText: string;
  mode: 'form' | 'review' | 'trace';
  fields: ChronicFormField[];
  closureChecks: Array<{ label: string; pass: boolean }>;
}

interface ResolveDialogInput {
  context: PageContext;
  page: ChronicPrototypePageSpec;
  row: ChronicTableRow;
  operationKey: string;
}

const reviewFields: ChronicFormField[] = [
  { label: '审核结论', prop: 'reviewResult', component: 'select', placeholder: '请选择审核结论', options: ['通过', '退回补充', '暂缓', '转上级复核'] },
  { label: '风险等级', prop: 'riskLevel', component: 'select', placeholder: '请选择风险等级', options: ['低', '中', '高', '危急'] },
  { label: '审核意见', prop: 'reviewComment', component: 'textarea', placeholder: '填写审核意见、退回原因、复核依据和后续要求' },
  { label: '电子签名', prop: 'signature', component: 'select', placeholder: '请选择签名方式', options: ['本人签名', '双人复核', '待补签', '无需签名'] },
];

const traceFields: ChronicFormField[] = [
  { label: '追溯范围', prop: 'traceScope', component: 'select', placeholder: '请选择追溯范围', options: ['当前单据', '患者全链路', '责任人操作', '状态变更', '上下游回写'] },
  { label: '追溯原因', prop: 'traceReason', component: 'textarea', placeholder: '填写查看追溯、审计调阅或问题定位原因' },
];

const specificFields: Record<string, ChronicFormField[]> = {
  'guide-patient:create': [
    { label: '患者姓名', prop: 'patientName', component: 'input', placeholder: '请输入患者姓名' },
    { label: '证件号码', prop: 'idNo', component: 'input', placeholder: '身份证/医保电子凭证/病案号' },
    { label: '联系电话', prop: 'mobile', component: 'input', placeholder: '患者本人或主要联系人电话' },
    { label: '医保类型', prop: 'insurance', component: 'select', placeholder: '请选择医保类型', options: ['职工医保', '居民医保', '异地医保', '自费', '商业保险'] },
    { label: '联系人', prop: 'contact', component: 'input', placeholder: '姓名/关系/电话' },
    { label: '建档说明', prop: 'remark', component: 'textarea', placeholder: '填写建档来源、资料缺项、服务诉求和风险提示' },
  ],
  'guide-contract:create': [
    { label: '服务包', prop: 'packageName', component: 'select', placeholder: '请选择服务包', options: ['规律血透服务包', '临时加透服务包', '通路管理服务包', '居家随访服务包'] },
    { label: '签约周期', prop: 'period', component: 'select', placeholder: '请选择周期', options: ['1个月', '3个月', '6个月', '12个月'] },
    { label: '生效日期', prop: 'startDate', component: 'date', placeholder: '请选择生效日期' },
    { label: '费用状态', prop: 'feeStatus', component: 'select', placeholder: '请选择费用状态', options: ['待缴费', '已预缴', '正常', '欠费', '待结算'] },
    { label: '知情文书', prop: 'consent', component: 'select', placeholder: '请选择签署状态', options: ['待签署', '患者已签', '家属代签', '已归档'] },
    { label: '签约说明', prop: 'remark', component: 'textarea', placeholder: '填写续约、解约、服务包变更或特殊约定' },
  ],
  'doctor-order:order': [
    { label: '医嘱类型', prop: 'orderType', component: 'select', placeholder: '请选择医嘱类型', options: ['长期医嘱', '临时医嘱', '血液净化专项', '检验医嘱', '护理医嘱'] },
    { label: '医嘱项目', prop: 'orderItem', component: 'input', placeholder: '请输入医嘱项目或引用组套' },
    { label: '剂量/用法', prop: 'usage', component: 'input', placeholder: '剂量、频次、执行时间' },
    { label: '执行计划', prop: 'plan', component: 'textarea', placeholder: '填写执行日期、责任角色、费用/药耗联动和注意事项' },
    { label: '风险校验', prop: 'risk', component: 'select', placeholder: '请选择校验结果', options: ['通过', '需药师审核', '需补同意书', '禁忌/冲突'] },
  ],
  'nurse-execute:execute': [
    { label: '核对项目', prop: 'checkItems', component: 'select', placeholder: '请选择核对项目', options: ['患者身份', '医嘱', '透析处方', '通路', '药耗', '设备'] },
    { label: '执行结果', prop: 'executeStatus', component: 'select', placeholder: '请选择执行结果', options: ['已执行', '暂缓执行', '异常执行', '拒绝执行', '转医生'] },
    { label: '双人核对', prop: 'doubleCheck', component: 'select', placeholder: '请选择核对状态', options: ['已双签', '待第二人签名', '无需双签'] },
    { label: '执行记录', prop: 'remark', component: 'textarea', placeholder: '填写执行时间、剂量、异常原因、勘误说明和签名记录' },
  ],
  'nurse-treatment:handle': [
    { label: '治疗环节', prop: 'sessionStep', component: 'select', placeholder: '请选择治疗环节', options: ['透前评估', '上机核对', '透中监测', '症状处理', '下机', '透后评估'] },
    { label: '生命体征', prop: 'vital', component: 'input', placeholder: '血压/脉搏/体重/超滤量' },
    { label: '处理结果', prop: 'result', component: 'select', placeholder: '请选择处理结果', options: ['正常', '待复核', '已处理', '转医生', '禁止归档'] },
    { label: '过程记录', prop: 'remark', component: 'textarea', placeholder: '填写参数、症状、处理措施、医嘱执行和归档缺项' },
  ],
  'system-user:account': [
    { label: '登录账号', prop: 'loginName', component: 'input', placeholder: '对应 sys_user.login_name' },
    { label: '员工/身份', prop: 'identity', component: 'input', placeholder: '员工、科室、工作身份' },
    { label: '工作站', prop: 'workstation', component: 'select', placeholder: '请选择工作站', options: ['医生站', '护士站', '导诊台', '系统管理', '基础数据中心'] },
    { label: '账号状态', prop: 'status', component: 'select', placeholder: '请选择账号状态', options: ['启用', '停用', '锁定', '待复核'] },
    { label: '变更说明', prop: 'remark', component: 'textarea', placeholder: '填写授权原因、数据范围和复核要求' },
  ],
  'base-order:draft': [
    { label: '基础项名称', prop: 'dictName', component: 'input', placeholder: '对应 base_order_item.order_item_name' },
    { label: '分类', prop: 'dictType', component: 'select', placeholder: '请选择分类', options: ['长期医嘱', '临时医嘱', '专项医嘱', '组套'] },
    { label: '费用/药耗', prop: 'chargeLink', component: 'select', placeholder: '请选择联动', options: ['药品消耗', '耗材消耗', '费用项目', '无费用'] },
    { label: '发布版本', prop: 'version', component: 'input', placeholder: '例如 V1.2' },
    { label: '变更说明', prop: 'remark', component: 'textarea', placeholder: '填写版本变更、引用影响和停用校验' },
  ],
  'rule-warning:handle': [
    { label: '规则名称', prop: 'ruleName', component: 'input', placeholder: '请输入预警规则名称' },
    { label: '触发条件', prop: 'condition', component: 'textarea', placeholder: '填写指标、阈值、时间窗和命中条件' },
    { label: '动作目标', prop: 'action', component: 'select', placeholder: '请选择动作', options: ['生成预警', '推送员工主页', '生成CQI', '禁止上机', '短信提醒'] },
    { label: '发布状态', prop: 'publishStatus', component: 'select', placeholder: '请选择状态', options: ['草稿', '待仿真', '待发布', '已启用'] },
  ],
};

function isReviewOperation(operationKey: string, title: string): boolean {
  return ['review', 'confirm', 'audit', 'close', 'done', 'activate', 'archive'].some((key) => operationKey.includes(key)) || /审核|复核|确认|关闭|归档|生效/.test(title);
}

function isTraceOperation(operationKey: string, title: string): boolean {
  return operationKey.includes('trace') || operationKey.includes('log') || /追溯|轨迹|日志|审计/.test(title);
}

export function resolveBusinessOperationDialog(input: ResolveDialogInput): BusinessOperationDialogSpec {
  const flow = input.page.primaryFlow.find((item) => item.key === input.operationKey);
  const rowOperation = input.page.rowOperations.find((item) => item.key === input.operationKey);
  const title = flow?.label ?? rowOperation?.label ?? input.operationKey;
  const mode = isTraceOperation(input.operationKey, title) ? 'trace' : isReviewOperation(input.operationKey, title) ? 'review' : 'form';
  const targetStatus = rowOperation?.targetStatus ?? (mode === 'trace' ? input.row.status : mode === 'review' ? '待复核' : '处理中');
  const key = `${input.context.menuKey}:${input.operationKey}`;
  const fields = mode === 'trace' ? traceFields : mode === 'review' ? reviewFields : specificFields[key] ?? input.page.formFields;

  return {
    operationKey: input.operationKey,
    title,
    description: flow?.desc ?? rowOperation?.feedback ?? `${input.page.title}业务办理`,
    targetStatus,
    submitText: mode === 'trace' ? '完成调阅' : title,
    mode,
    fields,
    closureChecks: [
      { label: '当前业务对象已带入', pass: Boolean(input.row.subject) },
      { label: '状态和下一步明确', pass: Boolean(input.row.status && input.row.nextAction) },
      { label: '责任人可追溯', pass: Boolean(input.row.owner || input.context.role) },
      { label: '表单符合当前功能', pass: fields.length >= 2 },
      { label: '包含处理说明/审计原因', pass: fields.some((item) => item.component === 'textarea') },
    ],
  };
}
