import type { PageContext } from '../types';

export interface ChronicPageDoc {
  title: string;
  sourceDocs: string[];
  positioning: string;
  businessObjects: string[];
  coreActions: string[];
  keyFields: string[];
  statusFlow: string[];
  upstream: string[];
  downstream: string[];
  ruleLinks: string[];
  tables: string[];
  acceptance: string[];
}

interface ChronicDomainProfile {
  title: string;
  sourceDocs: string[];
  positioning: string;
  businessObjects: string[];
  coreActions: string[];
  keyFields: string[];
  statusFlow: string[];
  upstream: string[];
  downstream: string[];
  ruleLinks: string[];
  tables: string[];
  acceptance: string[];
}

const docs = {
  overview: '00-整理说明与功能总览.md',
  entry: '01-工作站入口角色权限与总体架构.md',
  patient: '02-患者居家住院式闭环.md',
  doctor: '03-医生工作站功能文档.md',
  nurse: '04-护士站功能文档.md',
  staff: '05-员工主页医务医事人事行政.md',
  master: '06-后端基础字典与主数据.md',
  diagnosis: '07-智能诊断自动识别确认.md',
  quality: '08-预警事件疗效分析CQI.md',
  task: '09-工作任务消息提醒数据流转.md',
  model: '10-数据模型接口与开发任务建议.md',
  coverage: '11-原始资料抽取覆盖清单.md',
};

const domainProfiles: Record<string, ChronicDomainProfile> = {
  entry: {
    title: '工作站入口与权限上下文',
    sourceDocs: [docs.entry, docs.model],
    positioning: '把当前登录身份、工作站、角色、数据范围和操作权限注入每个业务页面，保证慢病居家住院式管理按人、按岗位、按患者归属闭环运行。',
    businessObjects: ['登录账号', '工作身份', '工作站菜单', '角色权限', '审计日志'],
    coreActions: ['登录认证', '身份选择', '工作站切换', '菜单授权', '操作审计'],
    keyFields: ['login_name', 'work_identity_id', 'workstation_code', 'role_code', 'data_scope', 'audit_action'],
    statusFlow: ['账号: 启用 -> 锁定/停用', '身份: 未选择 -> 已选择 -> 已切换', '权限变更: 草稿 -> 待复核 -> 已生效'],
    upstream: ['系统用户', '组织机构', '岗位角色', '工作站菜单配置'],
    downstream: ['页面路由上下文', '患者数据范围', '按钮级权限', '审计追溯'],
    ruleLinks: ['未授权菜单不可见', '切换身份后患者范围与待办范围同步刷新', '关键操作写入审计日志'],
    tables: ['sys_user', 'sys_role', 'sys_permission', 'sys_work_identity', 'sys_menu', 'sys_audit_log'],
    acceptance: ['当前页能显示身份上下文', '未授权入口不展示', '切换工作站后菜单和数据范围变化', '所有高风险操作有审计入口'],
  },
  board: {
    title: '慢病运营看板',
    sourceDocs: [docs.overview, docs.quality, docs.task],
    positioning: '把患者居家待办、医生护士任务、预警事件、CQI 和服务进度汇总为运营入口，辅助团队发现未闭环事项。',
    businessObjects: ['患者服务队列', '异常预警', '工作任务', '随访进度', 'CQI项目'],
    coreActions: ['按院区/团队/病种筛选', '查看风险患者', '进入待办处理', '下钻任务来源', '查看闭环率'],
    keyFields: ['patient_id', 'contract_status', 'task_status', 'warning_level', 'owner_user_id', 'due_time'],
    statusFlow: ['任务: 待处理 -> 处理中 -> 已完成/逾期', '预警: 待确认 -> 已分派 -> 处理中 -> 已关闭'],
    upstream: ['患者签约', '居家上传', '医生评估', '护士随访', '规则引擎'],
    downstream: ['医生站处理', '护士站随访', '员工主页待办', '统计报表', 'CQI整改'],
    ruleLinks: ['逾期任务进入看板红色提醒', '高危患者按责任医生/护士聚合', 'CQI项目可从异常指标生成'],
    tables: ['patient_contract', 'home_task', 'warning_event', 'cqi_project', 'work_log'],
    acceptance: ['指标可下钻到原始患者或任务', '预警处理后看板状态刷新', 'CQI关闭后闭环率更新', '待办责任人清晰可见'],
  },
  patient: {
    title: '患者居家住院式闭环',
    sourceDocs: [docs.patient, docs.task, docs.model],
    positioning: '围绕患者建档、签约、居家数据、异常上报、时间轴和医护协同，形成居家住院式管理主链路。',
    businessObjects: ['患者主档', '签约服务', '随访名称', '居家任务', '上传报告', '临床事件'],
    coreActions: ['患者建档', '签约续约解约', '归属分配', '居家评估', '检验上传', '异常上报'],
    keyFields: ['patient_id', 'id_no', 'contract_status', 'followup_name', 'owner_doctor_id', 'owner_nurse_id', 'event_level'],
    statusFlow: ['签约: 申请中 -> 在管 -> 暂停/解约/退出', '居家任务: 待完成 -> 已提交 -> 待审核 -> 已归档'],
    upstream: ['患者身份信息', '医保联系人', '服务包', '专家团队', '医护归属'],
    downstream: ['医生审核', '护士随访', '智能诊断', '预警事件', '患者健康档案'],
    ruleLinks: ['未签约患者不能进入正式管理闭环', '异常上报可触发医生/护士待办', '居家上传报告进入医生解读和趋势分析'],
    tables: ['patient', 'patient_contact', 'patient_contract', 'patient_assignment', 'home_assessment', 'home_upload', 'clinical_event'],
    acceptance: ['患者页体现当前患者与签约状态', '服务关系有生效/暂停/解约状态', '居家提交内容能进入审核', '异常事件可追溯处理记录'],
  },
  doctor: {
    title: '医生工作站临床决策',
    sourceDocs: [docs.doctor, docs.diagnosis, docs.quality],
    positioning: '医生站负责责任患者的诊断确认、病情评估、医嘱管理、检验解读、预警处理和健康报告输出。',
    businessObjects: ['责任患者', '诊断', '病情评估', '医嘱', '检验检查', '健康报告', '预警事件'],
    coreActions: ['查看患者360', '确认智能诊断', '填写常见/专科评估', '开立医嘱', '处理预警', '生成健康报告'],
    keyFields: ['patient_id', 'diagnosis_code', 'assessment_result', 'order_type', 'order_status', 'warning_id', 'report_status'],
    statusFlow: ['智能诊断: 待确认 -> 已确认/已否认/已忽略/已转任务', '医嘱: 草稿 -> 已提交 -> 已审核 -> 执行中 -> 已完成'],
    upstream: ['患者归属', '居家评估', '上传报告', '检验结果', '护士初筛', '规则命中'],
    downstream: ['护士执行', '药品服务', '预警关闭', 'CQI立项', '患者端报告'],
    ruleLinks: ['智能诊断需医生确认才进入正式诊断', '危急值和高风险评估生成医生待办', '健康报告发布后进入患者端已读追踪'],
    tables: ['patient_diagnosis', 'clinical_assessment', 'medical_order', 'lab_result', 'smart_diagnosis_result', 'warning_event', 'health_report'],
    acceptance: ['诊断页能处理智能诊断建议', '医嘱页显示审核和执行状态', '检验异常能生成预警', '报告有草稿/审核/发布/归档状态'],
  },
  nurse: {
    title: '护士站随访与执行闭环',
    sourceDocs: [docs.nurse, docs.patient, docs.task],
    positioning: '护士站承接患者日常随访、护理评估、医嘱核对执行、宣教、异常初筛和回访闭环。',
    businessObjects: ['护理患者', '护理待办', '随访记录', '护理评估', '医嘱执行', '宣教任务', '异常初筛'],
    coreActions: ['查看护理患者', '处理护理待办', '核对执行医嘱', '填写护理评估', '记录宣教', '上报异常'],
    keyFields: ['patient_id', 'task_id', 'nurse_review_status', 'execute_status', 'education_status', 'handover_note'],
    statusFlow: ['护理任务: 待处理 -> 处理中 -> 已完成/逾期', '医嘱执行: 待核对 -> 已核对 -> 已执行/异常执行'],
    upstream: ['医生医嘱', '居家任务', '患者异常上报', '随访计划', '预警规则'],
    downstream: ['医生复核', '工作日志', '患者时间轴', '预警事件', '统计报表'],
    ruleLinks: ['护理异常可转医生待办', '宣教任务按方案自动生成', '执行异常必须填写原因并保留签名'],
    tables: ['nursing_task', 'nursing_assessment', 'medical_order_execution', 'education_record', 'work_log', 'warning_event'],
    acceptance: ['护理列表有患者、状态、责任人和下一步', '医嘱执行结果可追溯', '异常初筛可生成预警', '宣教完成后回写患者时间轴'],
  },
  staff: {
    title: '员工主页与行政协同',
    sourceDocs: [docs.staff, docs.task],
    positioning: '把医护、医务、人事和行政相关的待办、消息、日志、分工和人员资质统一聚合。',
    businessObjects: ['个人待办', '消息提醒', '工作日志', '专家团队', '人员档案', '培训证书'],
    coreActions: ['处理待办', '查看消息', '签名审核', '维护分工', '登记培训证书', '追踪工作日志'],
    keyFields: ['task_id', 'message_id', 'staff_id', 'team_id', 'certificate_status', 'audit_time'],
    statusFlow: ['待办: 待处理 -> 处理中 -> 已完成/逾期', '证书: 有效 -> 临期 -> 过期 -> 已续期'],
    upstream: ['业务模块任务', '消息规则', '排班分工', '培训记录', '资质证书'],
    downstream: ['原业务单据状态', '人员资格校验', '排班可用性', '审计追溯'],
    ruleLinks: ['任务完成必须回写来源单据', '证书过期影响排班和授权', '消息提醒按规则去重合并'],
    tables: ['task_center', 'message_center', 'work_log', 'staff_profile', 'staff_certificate', 'expert_team'],
    acceptance: ['个人主页能进入来源业务', '消息有已读/未读状态', '日志能回溯操作来源', '人员资质影响授权与排班'],
  },
  master: {
    title: '后端字典与主数据',
    sourceDocs: [docs.master, docs.model],
    positioning: '统一维护医嘱、检验、评估、诊断、药品、任务、统计和随访名称等基础口径，避免各页面各自写死。',
    businessObjects: ['医嘱字典', '检验标准化', '病情评估项', '诊断编码', '任务分类', '随访名称', '统计口径'],
    coreActions: ['新增基础项', '版本复核', '发布启用', '停用归档', '引用分析', '影响评估'],
    keyFields: ['dict_code', 'dict_name', 'version_no', 'status', 'effective_date', 'reference_count'],
    statusFlow: ['字典: 草稿 -> 待复核 -> 已启用 -> 已停用/已归档', '版本: 当前版 -> 修订版 -> 发布版'],
    upstream: ['业务规则要求', '临床模板', '院内标准', '接口标准'],
    downstream: ['医生医嘱', '护士评估', '检验标准化', '任务方案', '报表指标'],
    ruleLinks: ['已被引用的基础项停用需影响分析', '字典发布后规则和页面选项同步更新', '检验项目需映射院内编码'],
    tables: ['base_dictionary', 'order_item_dict', 'lab_item_dict', 'assessment_item_dict', 'diagnosis_dict', 'task_type_dict', 'followup_name_dict'],
    acceptance: ['基础项有复核发布流程', '页面选项引用统一字典', '停用前显示引用影响', '版本变更可追溯'],
  },
  diagnosis: {
    title: '智能诊断自动识别',
    sourceDocs: [docs.diagnosis, docs.master, docs.task],
    positioning: '根据检验、评估、居家上传和既往诊断自动识别诊断线索，并交由医生确认、否认、忽略或转任务。',
    businessObjects: ['智能诊断方案', '触发条件', '诊断组合', '识别结果', '医生确认记录'],
    coreActions: ['配置规则模板', '仿真规则', '查看命中证据', '确认/否认/忽略', '转工作任务'],
    keyFields: ['rule_id', 'source_type', 'trigger_condition', 'diagnosis_code', 'confidence_level', 'confirm_status'],
    statusFlow: ['方案: 草稿 -> 仿真通过 -> 已发布 -> 停用', '结果: 待确认 -> 已确认/已否认/已忽略/已转任务'],
    upstream: ['检验结果', '病情评估', '患者主档', '居家上传', '诊断字典'],
    downstream: ['正式诊断', '医生待办', '健康报告', '预警事件', 'CQI分析'],
    ruleLinks: ['识别结果不能直接变成正式诊断', '医生确认需记录证据和时间', '重复诊断线索按患者和规则合并'],
    tables: ['smart_diagnosis_rule', 'smart_diagnosis_condition', 'smart_diagnosis_result', 'patient_diagnosis', 'task_center'],
    acceptance: ['规则有触发条件和输出诊断', '命中结果展示证据', '医生确认后写入诊断', '否认/忽略原因可追溯'],
  },
  quality: {
    title: '预警事件、疗效分析与CQI',
    sourceDocs: [docs.quality, docs.task, docs.model],
    positioning: '把异常指标、危急值、事件、疗效偏差和持续改进项目串成可分派、可处理、可复查的质量闭环。',
    businessObjects: ['预警方案', '预警事件', '疗效指标', 'CQI项目', '整改措施', '复查记录'],
    coreActions: ['配置预警方案', '处理预警', '疗效判读', '生成CQI', '整改复查', '关闭归档'],
    keyFields: ['warning_id', 'warning_level', 'owner_id', 'handle_status', 'cqi_status', 'review_result'],
    statusFlow: ['预警: 待确认 -> 已分派 -> 处理中 -> 待复核 -> 已关闭', 'CQI: 识别 -> 立项 -> 整改 -> 复查 -> 关闭'],
    upstream: ['检验结果', '居家评估', '临床事件', '护理记录', '规则方案'],
    downstream: ['员工主页待办', '医生/护士处理', '统计报表', '规则优化', '患者时间轴'],
    ruleLinks: ['高级别预警必须指定责任人和期限', 'CQI复查不达标可重新整改', '预警关闭需保留处理证据'],
    tables: ['warning_rule', 'warning_event', 'warning_handle_record', 'effect_analysis_result', 'cqi_project', 'cqi_review'],
    acceptance: ['预警有级别、责任人、期限和状态', '处理记录可追溯', 'CQI有整改和复查', '关闭结果回到看板和报表'],
  },
  task: {
    title: '工作任务、消息提醒与数据流转',
    sourceDocs: [docs.task, docs.model],
    positioning: '按业务事件和专家方案生成任务、消息、工作日志和数据回写，保证跨角色协作不靠人工口头传递。',
    businessObjects: ['工作任务', '消息提醒', '工作日志', '任务方案', '数据流转记录'],
    coreActions: ['生成任务', '分派责任人', '提醒发送', '完成回写', '去重合并', '审计追踪'],
    keyFields: ['task_id', 'source_type', 'source_id', 'owner_id', 'due_time', 'message_channel', 'writeback_status'],
    statusFlow: ['任务: 待生成 -> 待处理 -> 处理中 -> 已完成/已取消/逾期', '消息: 待发送 -> 已发送 -> 已读/失败'],
    upstream: ['患者签约', '医生医嘱', '护理随访', '检验异常', '预警规则', 'CQI方案'],
    downstream: ['员工主页', '医生站', '护士站', '患者端提醒', '源单据状态'],
    ruleLinks: ['同源同类任务可合并', '任务完成需回写来源单据', '短信/APP提醒失败需重试或人工处理'],
    tables: ['task_scheme', 'task_center', 'message_rule', 'message_center', 'work_log', 'data_flow_log'],
    acceptance: ['任务显示来源和下一步', '完成后回写源业务', '消息有渠道和发送状态', '重复任务有合并策略'],
  },
  model: {
    title: '数据模型、接口与统计支撑',
    sourceDocs: [docs.model, docs.coverage],
    positioning: '把慢病业务对象沉淀为可接口化、可统计、可审计的数据模型，为报表、集成和后续开发排期提供依据。',
    businessObjects: ['领域模型', '接口通道', '数据表', '同步日志', '报表指标', '导出记录'],
    coreActions: ['维护接口映射', '查看同步日志', '指标计算', '下钻原始记录', '导出审计', '开发任务拆分'],
    keyFields: ['entity_id', 'source_system', 'sync_status', 'metric_code', 'snapshot_time', 'export_status'],
    statusFlow: ['同步: 待同步 -> 成功/失败/冲突 -> 人工处理', '报表: 计算中 -> 已生成 -> 已发布/已归档'],
    upstream: ['患者业务数据', '医护执行数据', '规则结果', '院内接口', '患者端数据'],
    downstream: ['管理报表', '院区对比', '接口告警', '数据导出', '开发任务排期'],
    ruleLinks: ['统计指标必须可回溯源记录', '接口失败进入重试和人工处理', '导出需记录范围、人员和用途'],
    tables: ['integration_channel', 'sync_log', 'report_metric', 'report_snapshot', 'export_log', 'audit_log'],
    acceptance: ['指标可下钻', '接口异常有日志', '导出有审计', '数据来源和字段映射清晰'],
  },
};

const workspaceDomainMap: Record<string, string> = {
  科室看板: 'board',
  员工主页: 'staff',
  导诊台: 'patient',
  医生站: 'doctor',
  护士站: 'nurse',
  检验科工作站: 'model',
  药房站: 'model',
  药品耗材与费用管理: 'model',
  技师与设备站: 'model',
  医务医事站: 'staff',
  行政人事站: 'staff',
  居家个人主页: 'patient',
  基础数据中心: 'master',
  规则配置与质量改进: 'quality',
  统计报表: 'model',
  感控管理: 'quality',
  接口与设备集成管理: 'model',
  '药物临床研究 / CRC站': 'model',
  系统管理: 'entry',
};

const menuDomainOverrides: Record<string, string> = {
  'employee-task': 'task',
  'employee-message': 'task',
  'employee-log': 'task',
  'guide-schedule': 'patient',
  'doctor-diagnosis': 'diagnosis',
  'doctor-common-assess': 'diagnosis',
  'doctor-special-assess': 'diagnosis',
  'doctor-quality': 'quality',
  'nurse-quality': 'quality',
  'rule-diagnosis': 'diagnosis',
  'rule-task': 'task',
  'rule-message': 'task',
  'rule-flow': 'task',
  'rule-effect': 'quality',
  'rule-warning': 'quality',
  'rule-cqi': 'quality',
  'base-medical-dict': 'master',
  'base-order': 'master',
  'base-lab': 'master',
  'home-upload': 'patient',
  'home-event': 'quality',
  'home-common-assess': 'diagnosis',
  'home-special-assess': 'diagnosis',
  'lab-input': 'diagnosis',
  'lab-result': 'diagnosis',
  'lab-quality': 'quality',
  'report-quality': 'quality',
  'report-warning': 'quality',
  'infection-check': 'quality',
  'infection-register': 'quality',
  'infection-report': 'quality',
  'system-user': 'entry',
  'system-role': 'entry',
  'system-menu': 'entry',
  'system-log': 'entry',
};

const menuSpecifics: Record<
  string,
  Partial<
    Pick<
      ChronicPageDoc,
      'sourceDocs' | 'businessObjects' | 'coreActions' | 'keyFields' | 'statusFlow' | 'upstream' | 'downstream' | 'tables' | 'acceptance'
    >
  >
> = {
  'guide-patient': {
    businessObjects: ['患者主档', '联系人', '医保信息', '慢病随访信息'],
    coreActions: ['患者查重', '新增/修改患者', '维护联系人', '维护医保', '查看患者时间轴'],
    keyFields: ['patient_id', 'name', 'id_no', 'mobile', 'insurance_type', 'followup_name'],
    tables: ['patient', 'patient_contact', 'patient_insurance', 'patient_timeline'],
    acceptance: ['建档前查重', '患者主档有在管状态', '联系人和医保可维护', '变更写入时间轴'],
  },
  'guide-contract': {
    businessObjects: ['签约记录', '服务包', '解约记录', '续约记录'],
    coreActions: ['签约', '续约', '解约', '调整服务包', '查看签约文书'],
    statusFlow: ['签约: 申请中 -> 在管 -> 暂停/解约/退出'],
    tables: ['patient_contract', 'service_package', 'contract_document'],
    acceptance: ['未签约患者提示不能进入正式闭环', '续约/解约保留原因和签名', '服务包变更可追溯'],
  },
  'guide-owner': {
    businessObjects: ['主诊医生', '责任护士', '专家团队', '护理组', '共享协管关系'],
    coreActions: ['分配责任医生', '分配责任护士', '维护专家团队', '发起共享协管', '追溯分配历史'],
    tables: ['patient_assignment', 'expert_team', 'shared_care_relation'],
    acceptance: ['责任人变更有生效时间', '医生/护士站能看到责任患者', '共享协管有授权范围'],
  },
  'doctor-order': {
    businessObjects: ['长期医嘱', '临时医嘱', '医嘱组套', '执行计划'],
    coreActions: ['新开医嘱', '引用组套', '提交审核', '停止医嘱', '查看执行反馈'],
    statusFlow: ['医嘱: 草稿 -> 已提交 -> 已审核 -> 执行中 -> 已完成/已停止/已退回'],
    tables: ['medical_order', 'order_set', 'medical_order_execution'],
    acceptance: ['医嘱有审核和执行状态', '执行结果回写医生站', '高风险医嘱有提示'],
  },
  'doctor-report': {
    businessObjects: ['健康报告', '检验趋势', '治疗建议', '患者已读记录'],
    coreActions: ['生成报告', '编辑建议', '提交审核', '发布患者端', '查看已读'],
    statusFlow: ['报告: 草稿 -> 待审核 -> 已发布 -> 患者已读 -> 已归档'],
    tables: ['health_report', 'health_report_item', 'patient_read_log'],
    acceptance: ['报告引用诊断、检验、评估和医嘱', '发布后患者端可见', '已读状态可追踪'],
  },
  'doctor-event': {
    businessObjects: ['临床事件', '事件处理记录', '复核记录'],
    coreActions: ['登记事件', '分级', '处理', '转预警/CQI', '关闭'],
    statusFlow: ['事件: 新建 -> 已分派 -> 处理中 -> 待复核 -> 已关闭'],
    tables: ['clinical_event', 'event_handle_record', 'warning_event'],
    acceptance: ['事件有级别和责任人', '处理过程可追溯', '高风险事件进入预警'],
  },
  'nurse-execute': {
    businessObjects: ['待执行医嘱', '核对记录', '执行反馈', '异常原因'],
    coreActions: ['核对医嘱', '执行医嘱', '异常反馈', '签名确认', '回写医生站'],
    statusFlow: ['执行: 待核对 -> 已核对 -> 已执行/异常执行/拒绝执行'],
    tables: ['medical_order_execution', 'nursing_review', 'signature_record'],
    acceptance: ['执行前可查看医嘱来源', '异常必须填原因', '执行后写入工作日志'],
  },
  'home-upload': {
    businessObjects: ['患者上传报告', '附件', '识别结果', '医生审核任务'],
    coreActions: ['上传检验检查', 'OCR/结构化', '提交审核', '医生解读', '归档报告'],
    statusFlow: ['上传: 草稿 -> 已提交 -> 待审核 -> 已归档/退回补充'],
    tables: ['home_upload', 'lab_result', 'task_center'],
    acceptance: ['上传报告能进入医生审核', '异常结果可触发智能诊断', '退回补充有原因'],
  },
  'base-lab': {
    businessObjects: ['检验项目', '标本名称', '检测方法', '标准编码', '参考范围'],
    coreActions: ['维护检验项目', '配置标准化映射', '发布版本', '引用分析'],
    keyFields: ['lab_item_code', 'sample_type', 'method_code', 'standard_code', 'reference_range'],
    tables: ['lab_item_dict', 'sample_dict', 'lab_standard_mapping'],
    acceptance: ['院内项目能映射标准项目', '参考范围支持性别/年龄差异', '发布后用于智能诊断'],
  },
  'rule-diagnosis': {
    businessObjects: ['智能诊断规则', '触发条件', '输出诊断', '命中样例'],
    coreActions: ['新增规则', '配置条件', '仿真验证', '发布启用', '查看命中日志'],
    tables: ['smart_diagnosis_rule', 'smart_diagnosis_condition', 'smart_diagnosis_result'],
    acceptance: ['规则仿真通过后才能发布', '命中结果展示证据', '医生确认后写入诊断'],
  },
  'rule-warning': {
    businessObjects: ['预警方案', '分级规则', '通知对象', '处理期限'],
    coreActions: ['配置预警条件', '设置级别', '设置责任人', '发布规则', '查看触发日志'],
    tables: ['warning_rule', 'warning_event', 'warning_handle_record'],
    acceptance: ['高危预警必须有责任人和期限', '重复预警可合并', '关闭需处理证据'],
  },
  'rule-cqi': {
    businessObjects: ['CQI方案', '识别条件', '整改模板', '复查要求'],
    coreActions: ['配置CQI方案', '自动识别', '生成整改', '复查关闭', '统计改进效果'],
    tables: ['cqi_rule', 'cqi_project', 'cqi_action', 'cqi_review'],
    acceptance: ['CQI项目能从预警/疗效生成', '整改有期限和责任人', '复查不通过可再整改'],
  },
};

function mergeUnique(...groups: Array<string[] | undefined>): string[] {
  return [...new Set(groups.flatMap((group) => group ?? []))];
}

function inferPageAdditions(context: PageContext): Pick<
  ChronicPageDoc,
  'businessObjects' | 'coreActions' | 'keyFields' | 'upstream' | 'downstream' | 'acceptance'
> {
  const page = context.menuTitle;
  const workspace = context.workspace;
  return {
    businessObjects: [`当前页面对象: ${page}`, `当前责任角色: ${context.role}`],
    coreActions: [
      `在「${page}」维护筛选、列表、详情、状态流转和追溯入口`,
      `按「${workspace}」的数据范围展示责任患者、任务或配置项`,
      '高风险记录提供处理、复核或审计入口',
    ],
    keyFields: ['record_id', 'status', 'owner_user_id', 'operate_time', 'next_action'],
    upstream: [`${workspace} 上游业务数据`, '登录身份与数据权限', '基础字典和规则方案'],
    downstream: [`${page}处理结果`, '员工主页待办/工作日志', '统计报表和审计记录'],
    acceptance: [
      `页面标题、筛选和列表围绕「${page}」真实业务对象展开`,
      '核心列表包含状态、责任人、时间、下一步操作和追溯入口',
      '提交、审核/核对、执行/处理、归档/关闭状态能在页面中体现',
    ],
  };
}

export function getChronicPageDoc(context: PageContext): ChronicPageDoc {
  const domainKey = menuDomainOverrides[context.menuKey] ?? workspaceDomainMap[context.workspace] ?? 'model';
  const profile = domainProfiles[domainKey] ?? domainProfiles.model;
  const inferred = inferPageAdditions(context);
  const specific = menuSpecifics[context.menuKey] ?? {};

  return {
    title: `${context.menuTitle} - 慢病功能落地`,
    sourceDocs: mergeUnique(profile.sourceDocs, specific.sourceDocs),
    positioning: `${context.workspace} / ${context.menuTitle}: ${profile.positioning}`,
    businessObjects: mergeUnique(specific.businessObjects, inferred.businessObjects, profile.businessObjects).slice(0, 10),
    coreActions: mergeUnique(specific.coreActions, inferred.coreActions, profile.coreActions).slice(0, 10),
    keyFields: mergeUnique(specific.keyFields, inferred.keyFields, profile.keyFields).slice(0, 12),
    statusFlow: mergeUnique(specific.statusFlow, profile.statusFlow).slice(0, 8),
    upstream: mergeUnique(specific.upstream, inferred.upstream, profile.upstream).slice(0, 10),
    downstream: mergeUnique(specific.downstream, inferred.downstream, profile.downstream).slice(0, 10),
    ruleLinks: profile.ruleLinks,
    tables: mergeUnique(specific.tables, profile.tables).slice(0, 12),
    acceptance: mergeUnique(specific.acceptance, inferred.acceptance, profile.acceptance).slice(0, 10),
  };
}
