<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  Bell,
  CircleCheck,
  DocumentChecked,
  EditPen,
  Message,
  Search,
  Warning,
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{
  context: PageContext;
}>();

type Tone = 'blue' | 'green' | 'orange' | 'red';

type EmployeeRow = {
  id: string;
  source: string;
  patient: string;
  title: string;
  priority: string;
  due: string;
  status: string;
  owner: string;
  next: string;
  group: string;
};

type DetailItem = {
  label: string;
  value: string;
  status: string;
  owner: string;
  next: string;
};

const processDrawerVisible = ref(false);
const messageDialogVisible = ref(false);
const signatureDialogVisible = ref(false);
const profileDrawerVisible = ref(false);
const traceDrawerVisible = ref(false);
const selectedRow = ref<EmployeeRow | null>(null);
const activeWorkLog = ref('today');
const activeDuty = ref('position');
const activeProfile = ref('basic');

const tableMap = {
  'employee-task': ['workflow_task', 'system_message', 'patient_assignment'],
  'employee-message': ['system_message', 'workflow_task', 'sys_user'],
  'employee-sign': ['electronic_signature', 'workflow_task', 'sys_audit_log'],
  'employee-warning': ['workflow_task', 'critical_value_record', 'quality_alert'],
  'employee-log': ['workflow_task', 'staff_work_log', 'sys_audit_log'],
  'employee-duty': ['patient_assignment', 'duty_schedule', 'care_team_member'],
  'employee-profile': ['staff_profile', 'electronic_signature', 'sys_work_identity', 'staff_certificate', 'staff_training_record', 'staff_research_record'],
} as Record<string, string[]>;

const allTaskRows: EmployeeRow[] = [
  { id: 'TASK-20260515-001', source: '医生站', patient: '王建国 / A08', title: '复核透析处方变更', priority: '高', due: '09:30', status: '待处理', owner: '张明', next: '打开医生站处方', group: '我的待办' },
  { id: 'TASK-20260515-002', source: '护士站', patient: '李秀兰 / B12', title: '下机记录退回补充', priority: '中', due: '10:00', status: '处理中', owner: '张明', next: '补充处理意见', group: '今日待办' },
  { id: 'TASK-20260515-003', source: '检验科工作站', patient: '赵明 / I03', title: '血钾危急值确认', priority: '高', due: '08:55', status: '逾期', owner: '张明', next: '签收并生成处置', group: '逾期提醒' },
  { id: 'TASK-20260515-004', source: '技师与设备站', patient: 'A区水处理', title: '水质电导率复核', priority: '高', due: '09:15', status: '待处理', owner: '许工', next: '复核设备记录', group: '我的异常提醒' },
  { id: 'TASK-20260515-005', source: '导诊台', patient: '陈志强 / 新签约', title: '主诊医生归属确认', priority: '中', due: '11:20', status: '待处理', owner: '张明', next: '确认患者归属', group: '我的审核' },
  { id: 'TASK-20260515-006', source: '治疗记录', patient: '陈志强 / B03', title: '治疗小结待归档', priority: '中', due: '12:00', status: '待签名', owner: '陈宁', next: '签名归档', group: '我的签名' },
  { id: 'TASK-20260515-007', source: '规则配置与质量改进', patient: '郭强 / C02', title: 'Kt/V不达标CQI复查', priority: '中', due: '本周五', status: '待复查', owner: '护士长', next: '提交复查结果', group: '本周待办' },
  { id: 'TASK-20260515-008', source: '科室看板', patient: '刘桂英 / C16', title: '缺席患者联系', priority: '中', due: '14:00', status: '待联系', owner: '导诊台', next: '电话确认并登记', group: '到期提醒' },
  { id: 'TASK-20260515-009', source: '药品耗材与费用管理', patient: '米多君 / LOT2605', title: '低库存补货确认', priority: '低', due: '16:00', status: '已完成', owner: '库房', next: '查看补货记录', group: '已完成任务' },
  { id: 'TASK-20260515-010', source: '医生站', patient: '马丽 / 急备01', title: '临时加透处方确认', priority: '高', due: '上机前', status: '待处理', owner: '刘主任', next: '确认处方', group: '我的任务' },
  { id: 'TASK-20260515-011', source: '护士站', patient: '潘德胜 / B15', title: '跌倒风险宣教签名', priority: '中', due: '本班次', status: '处理中', owner: '陆护士', next: '完成宣教签名', group: '今日待办' },
  { id: 'TASK-20260515-012', source: '感控管理', patient: '隔离区 / HD-33', title: '终末消毒复核', priority: '高', due: '下班前', status: '待复核', owner: '感控护士', next: '复核关闭', group: '我的预警' },
];

const messageRows: EmployeeRow[] = [
  { id: 'MSG-001', source: '科室看板', patient: '今日上午班', title: 'A区 2 人待上机核对', priority: '中', due: '08:40', status: '未读', owner: '张明', next: '查看班次队列', group: '我的消息' },
  { id: 'MSG-002', source: '医务医事站', patient: '护理组排班', title: '周三隔离区护理组调整通知', priority: '低', due: '昨天', status: '已读', owner: '张明', next: '查看分工', group: '我的消息' },
  { id: 'MSG-003', source: '规则配置与质量改进', patient: 'Kt/V达标', title: '本周疗效预警规则已更新', priority: '中', due: '05-15', status: '未读', owner: '张明', next: '查看规则说明', group: '我的消息' },
  { id: 'MSG-004', source: '系统管理', patient: '账号安全', title: '签名证书将在90天后到期', priority: '中', due: '05-15', status: '未读', owner: '张明', next: '维护证书', group: '我的消息' },
  { id: 'MSG-005', source: '行政人事站', patient: 'GCP培训', title: '年度GCP复训已发布', priority: '低', due: '本周', status: '已读', owner: '张明', next: '报名培训', group: '我的消息' },
];

const signRows: EmployeeRow[] = [
  { id: 'SIGN-001', source: '医生站', patient: '王建国 / A08', title: '长期医嘱变更电子签名', priority: '高', due: '09:40', status: '待签名', owner: '张明', next: '签署医嘱', group: '我的签名' },
  { id: 'SIGN-002', source: '治疗记录', patient: '李秀兰 / B12', title: '透析记录单归档签名', priority: '中', due: '10:30', status: '待签名', owner: '张明', next: '审核后签名', group: '我的签名' },
  { id: 'SIGN-003', source: '检验科工作站', patient: '赵明 / I03', title: '危急值处理回执签名', priority: '高', due: '09:10', status: '待签名', owner: '张明', next: '签收回执', group: '我的签名' },
  { id: 'SIGN-004', source: '健康报告', patient: '陈志强 / B03', title: '月度健康报告归档签名', priority: '中', due: '今日', status: '待签名', owner: '陈宁', next: '签名归档', group: '我的签名' },
  { id: 'SIGN-005', source: '知情同意书', patient: '马丽 / 急备01', title: '临时加透知情同意确认', priority: '高', due: '上机前', status: '待签名', owner: '刘主任', next: '确认签署', group: '我的签名' },
];

const warningRows: EmployeeRow[] = [
  { id: 'WARN-001', source: '检验科工作站', patient: '赵明 / I03', title: '血钾 6.4 mmol/L 危急值', priority: '高', due: '08:55', status: '未闭环', owner: '张明', next: '记录处置并复查', group: '我的预警' },
  { id: 'WARN-002', source: '科室看板', patient: '吴海 / A10', title: '近 3 次透后血压偏低', priority: '中', due: '今日', status: '待评估', owner: '张明', next: '调整干体重评估', group: '我的预警' },
  { id: 'WARN-003', source: '技师与设备站', patient: 'HD-08', title: '设备维护到期未确认', priority: '中', due: '今日', status: '处理中', owner: '许工', next: '查看维护记录', group: '我的异常提醒' },
  { id: 'WARN-004', source: '感控管理', patient: '李秀兰 / B12', title: '导管出口红肿待复评', priority: '中', due: '24小时内', status: '待复核', owner: '护理组长', next: '提交通路复评', group: '我的预警' },
  { id: 'WARN-005', source: '药品耗材与费用管理', patient: '米多君片', title: '低库存影响透前用药', priority: '中', due: '今日', status: '待处理', owner: '药师', next: '补货或替代', group: '我的异常提醒' },
];

const dutySections: Record<string, DetailItem[]> = {
  position: [
    { label: '当前任职信息', value: '血液净化中心 / 主诊医生 / 上午班', status: '有效', owner: '医务医事站', next: '查看工作身份' },
    { label: '默认工作站', value: '医生站、员工主页、科室看板', status: '启用', owner: '系统管理', next: '切换工作站' },
    { label: '今日班次', value: '上午班 07:30-12:00', status: '已签到', owner: '医务医事站', next: '查看值班' },
  ],
  ward: [
    { label: '病区分工分管', value: 'A区一组，分管患者 36 人', status: '有效', owner: '张明', next: '查看患者列表' },
    { label: '重点患者', value: '危急值 1 人，透中风险 4 人', status: '关注', owner: '张明', next: '处理风险' },
    { label: '机位范围', value: 'A01-A18，隔离区 I01-I03 协管', status: '有效', owner: '护士长', next: '查看机位' },
  ],
  team: [
    { label: '专家团队分工分管', value: '通路管理团队 / 贫血管理团队', status: '有效', owner: '刘主任', next: '查看团队' },
    { label: '团队患者', value: '通路高危 8 人，贫血管理 12 人', status: '关注', owner: '张明', next: '生成随访任务' },
    { label: '团队协作', value: '护士、技师、药师协管各 1 组', status: '已发布', owner: '医务医事站', next: '查看协管' },
  ],
  admin: [
    { label: '行政任职', value: '质控小组成员 / GCP研究医师', status: '有效', owner: '行政人事站', next: '查看任职' },
    { label: '质控责任', value: '透析充分性、危急值闭环', status: '待复查', owner: '质控员', next: '打开CQI' },
    { label: '培训责任', value: '新员工带教 2 人', status: '进行中', owner: '护理教育', next: '查看培训' },
  ],
  patients: [
    { label: '分管患者查看', value: '在管 36 人，新收 2 人，退出 1 人', status: '有效', owner: '张明', next: '进入医生站' },
    { label: '待处理患者', value: '危急值 1 人，评估待完成 5 人', status: '待处理', owner: '张明', next: '处理患者' },
    { label: '今日治疗患者', value: '上午班 18 人，中午班 10 人', status: '治疗中', owner: '张明', next: '看治疗队列' },
  ],
};

const profileSections: Record<string, DetailItem[]> = {
  basic: [
    { label: '基本信息', value: '张明 / 主治医师 / 血液净化中心', status: '有效', owner: '行政人事站', next: '维护联系方式' },
    { label: '当前工作身份', value: '医生站 / 主诊医生', status: '启用', owner: '系统管理', next: '查看权限' },
    { label: '电子签章', value: '个人签章已绑定，最近使用 09:12', status: '启用', owner: '系统管理', next: '签章设置' },
  ],
  work: [
    { label: '工作经历', value: '肾内科 8 年，血液净化中心 5 年', status: '已归档', owner: '行政人事站', next: '查看经历' },
    { label: '任职记录', value: '主治医师 / 质控小组成员', status: '有效', owner: '行政人事站', next: '维护任职' },
    { label: '岗位可用性', value: '可排医生站、科室看板、CRC授权', status: '有效', owner: '系统管理', next: '查看授权' },
  ],
  education: [
    { label: '学习经历', value: '硕士 / 肾脏病学', status: '已归档', owner: '行政人事站', next: '查看学历' },
    { label: '培训记录', value: '血透质控培训 2026-04 已通过', status: '有效', owner: '行政人事站', next: '查看培训' },
    { label: '继续教育', value: '本年度学分 18 / 25', status: '关注', owner: '行政人事站', next: '补足学分' },
  ],
  research: [
    { label: '科研工作', value: '透析充分性研究 1 项，论文 2 篇', status: '进行中', owner: '科研秘书', next: '查看科研' },
    { label: '项目角色', value: 'CRC项目研究医师', status: '有效', owner: 'GCP中心', next: '查看项目' },
    { label: '数据导出权限', value: '仅授权患者脱敏数据', status: '受控', owner: '系统管理', next: '申请导出' },
  ],
  certificates: [
    { label: '证件证书', value: '医师执业证书 2029-12-31 到期', status: '有效', owner: '行政人事站', next: '上传证照' },
    { label: '职称证书', value: '主治医师证书已归档', status: '有效', owner: '行政人事站', next: '查看附件' },
    { label: '签名证书', value: '90 天后到期', status: '关注', owner: '系统管理', next: '续期申请' },
  ],
  gcp: [
    { label: 'GCP培训记录', value: '2026年度GCP复训待完成', status: '待完成', owner: 'GCP中心', next: '报名培训' },
    { label: '研究授权', value: 'HD-CKD-01 项目研究医师', status: '有效', owner: 'CRC站', next: '查看授权' },
    { label: '研究药物权限', value: '仅审核，不可发放', status: '受控', owner: '药房站', next: '查看限制' },
  ],
};

const workLogTabs = [
  { key: 'today', label: '今日待办' },
  { key: 'week', label: '本周待办' },
  { key: 'done', label: '已完成任务' },
  { key: 'due', label: '到期提醒' },
  { key: 'overdue', label: '逾期提醒' },
  { key: 'patients', label: '我的患者' },
  { key: 'audit', label: '我的审核' },
  { key: 'warning', label: '我的预警' },
  { key: 'sign', label: '我的签名' },
  { key: 'task', label: '我的任务' },
  { key: 'abnormal', label: '我的异常提醒' },
  { key: 'records', label: '工作任务记录' },
  { key: 'completion', label: '工作任务完成情况' },
];

const dutyTabs = [
  { key: 'position', label: '当前任职信息' },
  { key: 'ward', label: '病区分工分管' },
  { key: 'team', label: '专家团队分工分管' },
  { key: 'admin', label: '行政任职' },
  { key: 'patients', label: '分管患者查看' },
];

const profileTabs = [
  { key: 'basic', label: '基本信息' },
  { key: 'work', label: '工作经历' },
  { key: 'education', label: '学习/培训记录' },
  { key: 'research', label: '科研工作' },
  { key: 'certificates', label: '证件证书' },
  { key: 'gcp', label: 'GCP培训记录' },
];

const mode = computed(() => props.context.menuKey.replace('employee-', ''));

const workLogRows = computed(() => {
  if (activeWorkLog.value === 'week') return allTaskRows.filter((item) => ['本周待办', '我的任务', '我的审核'].includes(item.group));
  if (activeWorkLog.value === 'done') return allTaskRows.filter((item) => item.status === '已完成');
  if (activeWorkLog.value === 'due') return allTaskRows.filter((item) => ['到期提醒', '今日待办'].includes(item.group));
  if (activeWorkLog.value === 'overdue') return allTaskRows.filter((item) => item.status === '逾期');
  if (activeWorkLog.value === 'patients') return allTaskRows.filter((item) => ['我的待办', '今日待办', '我的任务'].includes(item.group));
  if (activeWorkLog.value === 'audit') return allTaskRows.filter((item) => item.group === '我的审核');
  if (activeWorkLog.value === 'warning') return warningRows;
  if (activeWorkLog.value === 'sign') return signRows;
  if (activeWorkLog.value === 'task') return allTaskRows.filter((item) => item.group === '我的任务');
  if (activeWorkLog.value === 'abnormal') return [...warningRows, ...allTaskRows].filter((item) => item.group === '我的异常提醒');
  if (activeWorkLog.value === 'records') return allTaskRows;
  if (activeWorkLog.value === 'completion') return allTaskRows.filter((item) => ['已完成', '处理中', '待处理'].includes(item.status));
  return allTaskRows.filter((item) => ['今日待办', '我的待办', '逾期提醒'].includes(item.group));
});

const rows = computed(() => {
  if (mode.value === 'message') return messageRows;
  if (mode.value === 'sign') return signRows;
  if (mode.value === 'warning') return warningRows;
  if (mode.value === 'log') return workLogRows.value;
  if (mode.value === 'duty') return allTaskRows.filter((item) => ['我的待办', '我的任务', '我的审核'].includes(item.group));
  if (mode.value === 'profile') return allTaskRows.filter((item) => item.group === '我的签名');
  return allTaskRows;
});

const pageHint = computed(() => {
  const map: Record<string, string> = {
    task: '集中处理我的待办、今日待办、本周待办、到期逾期提醒、审核签名和异常提醒。',
    message: '接收工作站通知、规则变更、交班留言、系统提醒，并可生成后续待办。',
    sign: '处理医嘱、报告、治疗记录、危急值回执和归档文件的电子签名。',
    warning: '签收高风险患者、危急值、设备水质和院感预警，推动闭环处置。',
    log: '覆盖工作日志要求的待办、消息、患者、审核、预警、签名、任务记录和完成情况。',
    duty: '查看当前任职、病区分工、专家团队、行政任职和分管患者。',
    profile: '维护基本信息、工作经历、学习培训、科研、证件证书和GCP培训记录。',
  };
  return map[mode.value] ?? map.task;
});

const activeTables = computed(() => tableMap[props.context.menuKey] ?? tableMap['employee-task']);

const metrics = computed<Array<{ label: string; value: number; tone: Tone }>>(() => [
  { label: '我的待办', value: allTaskRows.filter((item) => item.status !== '已完成').length, tone: 'blue' },
  { label: '今日/本周', value: allTaskRows.filter((item) => ['今日待办', '本周待办'].includes(item.group)).length, tone: 'green' },
  { label: '到期逾期', value: allTaskRows.filter((item) => ['到期提醒', '逾期提醒'].includes(item.group) || item.status === '逾期').length, tone: 'red' },
  { label: '消息/签名', value: messageRows.filter((item) => item.status === '未读').length + signRows.filter((item) => item.status === '待签名').length, tone: 'orange' },
  { label: '审核预警', value: allTaskRows.filter((item) => item.group === '我的审核').length + warningRows.length, tone: 'red' },
  { label: '完成率', value: Math.round((allTaskRows.filter((item) => item.status === '已完成').length / allTaskRows.length) * 100), tone: 'green' },
]);

const primaryAction = computed(() => {
  if (mode.value === 'sign') return '批量签名';
  if (mode.value === 'message') return '全部已读';
  if (mode.value === 'warning') return '生成处置记录';
  if (mode.value === 'log') return '新增工作日志';
  if (mode.value === 'duty') return '申请调整';
  if (mode.value === 'profile') return '编辑资料';
  return '批量处理';
});

const dutyDetails = computed(() => dutySections[activeDuty.value] ?? dutySections.position);
const profileDetails = computed(() => profileSections[activeProfile.value] ?? profileSections.basic);

function rowTagType(row: EmployeeRow): 'success' | 'warning' | 'danger' | 'info' | 'primary' {
  if (['逾期', '未闭环'].includes(row.status) || row.priority === '高') return 'danger';
  if (['待处理', '处理中', '待签名', '待确认', '待评估', '待复核', '待联系', '待完成'].includes(row.status)) return 'warning';
  if (['已提交', '有效', '启用', '已读', '已发布', '已完成', '已归档'].includes(row.status)) return 'success';
  return 'info';
}

function detailTagType(status: string): 'success' | 'warning' | 'danger' | 'info' | 'primary' {
  if (['有效', '启用', '已归档', '已发布', '治疗中'].includes(status)) return 'success';
  if (['关注', '待复查', '进行中', '待完成', '待处理'].includes(status)) return 'warning';
  if (['受控'].includes(status)) return 'danger';
  return 'info';
}

function openProcess(row?: EmployeeRow): void {
  selectedRow.value = row ?? rows.value[0] ?? null;
  if (mode.value === 'profile') {
    profileDrawerVisible.value = true;
    return;
  }
  processDrawerVisible.value = true;
}

function openMessage(row: EmployeeRow): void {
  selectedRow.value = row;
  messageDialogVisible.value = true;
}

function openSignature(row: EmployeeRow): void {
  selectedRow.value = row;
  signatureDialogVisible.value = true;
}

function openTrace(row: EmployeeRow): void {
  selectedRow.value = row;
  traceDrawerVisible.value = true;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}
</script>

<template>
  <section class="employee-home-page">
    <el-card class="employee-work-card" shadow="never">
      <template #header>
        <div class="employee-work-header">
          <div>
            <h2>{{ context.menuTitle }}</h2>
            <p>{{ pageHint }}</p>
          </div>
          <div class="employee-actions">
            <el-button type="primary" :icon="CircleCheck" @click="openProcess()">{{ primaryAction }}</el-button>
            <el-button :icon="DocumentChecked" @click="openTrace(rows[0])">处理追溯</el-button>
            <el-button :icon="Bell" @click="submitAction('已刷新个人任务池')">刷新</el-button>
          </div>
        </div>
      </template>

      <el-form class="employee-filter" inline>
        <el-form-item label="日期">
          <el-date-picker type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="来源">
          <el-select placeholder="全部来源" clearable>
            <el-option label="医生站" value="doctor" />
            <el-option label="护士站" value="nurse" />
            <el-option label="检验科工作站" value="lab" />
            <el-option label="技师与设备站" value="device" />
            <el-option label="导诊台" value="guide" />
            <el-option label="感控管理" value="infection" />
          </el-select>
        </el-form-item>
        <el-form-item label="事项类型">
          <el-select placeholder="全部类型" clearable>
            <el-option label="我的待办" value="todo" />
            <el-option label="我的消息" value="message" />
            <el-option label="我的审核" value="audit" />
            <el-option label="我的预警" value="warning" />
            <el-option label="我的签名" value="sign" />
            <el-option label="异常提醒" value="abnormal" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select placeholder="全部状态" clearable>
            <el-option label="待处理" value="pending" />
            <el-option label="处理中" value="doing" />
            <el-option label="待签名" value="sign" />
            <el-option label="逾期" value="overdue" />
            <el-option label="已完成" value="done" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input placeholder="患者、事项、工作站或编号" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>

      <div class="employee-stat-grid">
        <el-card v-for="item in metrics" :key="item.label" :class="['employee-stat-card', item.tone]" shadow="never">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}<small v-if="item.label === '完成率'">%</small></strong>
        </el-card>
      </div>

      <el-card v-if="mode === 'log'" class="employee-section-card" shadow="never">
        <template #header>
          <div class="employee-card-header">
            <strong>工作日志功能项</strong>
            <el-tag effect="plain">覆盖 2.1 工作日志全部条目</el-tag>
          </div>
        </template>
        <el-segmented v-model="activeWorkLog" :options="workLogTabs" />
      </el-card>

      <el-card v-if="mode === 'duty'" class="employee-section-card" shadow="never">
        <template #header>
          <div class="employee-card-header">
            <strong>分工分管功能项</strong>
            <el-tag effect="plain">覆盖 2.2 分工分管全部条目</el-tag>
          </div>
        </template>
        <el-segmented v-model="activeDuty" :options="dutyTabs" />
        <el-table class="employee-detail-table" :data="dutyDetails" border stripe>
          <el-table-column prop="label" label="功能项" min-width="150" />
          <el-table-column prop="value" label="当前内容" min-width="220" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="detailTagType(row.status)">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="owner" label="来源/责任" width="130" />
          <el-table-column prop="next" label="下一步" min-width="140" />
        </el-table>
      </el-card>

      <el-card v-if="mode === 'profile'" class="employee-section-card" shadow="never">
        <template #header>
          <div class="employee-card-header">
            <strong>员工资料功能项</strong>
            <el-tag effect="plain">覆盖 2.3 员工资料全部条目</el-tag>
          </div>
        </template>
        <el-segmented v-model="activeProfile" :options="profileTabs" />
        <el-table class="employee-detail-table" :data="profileDetails" border stripe>
          <el-table-column prop="label" label="资料项" min-width="150" />
          <el-table-column prop="value" label="当前内容" min-width="240" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="detailTagType(row.status)">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="owner" label="来源/责任" width="130" />
          <el-table-column prop="next" label="下一步" min-width="140" />
        </el-table>
      </el-card>

      <el-row :gutter="16">
        <el-col :xs="24" :xl="17">
          <el-card class="employee-main-card" shadow="never">
            <template #header>
              <div class="employee-card-header">
                <div>
                  <strong>个人事项队列</strong>
                  <p>按到期时间、优先级、功能分类和业务来源排序，处理后回写原业务模块。</p>
                </div>
                <el-tag type="primary" effect="plain">当前身份：{{ context.role }}</el-tag>
              </div>
            </template>
            <el-table :data="rows" border stripe>
              <el-table-column prop="id" label="编号" min-width="145" />
              <el-table-column prop="group" label="功能分类" width="130" />
              <el-table-column prop="source" label="来源" width="130" />
              <el-table-column prop="patient" label="患者/对象" min-width="150" />
              <el-table-column prop="title" label="事项" min-width="220" />
              <el-table-column prop="priority" label="优先级" width="90">
                <template #default="{ row }">
                  <el-tag :type="row.priority === '高' ? 'danger' : row.priority === '中' ? 'warning' : 'info'" effect="plain">{{ row.priority }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="due" label="到期" width="100" />
              <el-table-column prop="status" label="状态" width="110">
                <template #default="{ row }">
                  <el-tag :type="rowTagType(row)">{{ row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="next" label="下一步" min-width="150" />
              <el-table-column label="操作" width="230" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click="openProcess(row)">处理</el-button>
                  <el-button v-if="mode === 'message'" link @click="openMessage(row)">详情</el-button>
                  <el-button v-else-if="mode === 'sign'" link @click="openSignature(row)">签名</el-button>
                  <el-button v-else link @click="openSignature(row)">签署</el-button>
                  <el-button link @click="openTrace(row)">追溯</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>

        <el-col :xs="24" :xl="7">
          <el-card class="employee-side-card" shadow="never">
            <template #header>
              <div class="employee-card-header compact">
                <strong>今日班次</strong>
                <el-tag type="success" effect="plain">上午班</el-tag>
              </div>
            </template>
            <div class="employee-duty-card">
              <div>
                <span>分管患者</span>
                <strong>36</strong>
                <small>重点关注 5 人</small>
              </div>
              <div>
                <span>待签任务</span>
                <strong>{{ signRows.length }}</strong>
                <small>含危急值 1 条</small>
              </div>
            </div>
            <el-timeline class="employee-timeline">
              <el-timeline-item timestamp="07:45">登录医生身份，进入员工主页</el-timeline-item>
              <el-timeline-item timestamp="08:10" type="warning">接收血钾危急值签收任务</el-timeline-item>
              <el-timeline-item timestamp="09:12" type="success">完成王建国处方签名</el-timeline-item>
            </el-timeline>
          </el-card>

          <el-card class="employee-side-card" shadow="never">
            <template #header>
              <strong>高风险关注</strong>
            </template>
            <div class="employee-risk-line danger">
              <el-icon><Warning /></el-icon>
              <span>危急值、设备水质异常、治疗退回和逾期待办必须保留签收、处理、复查和追溯记录。</span>
            </div>
            <div class="employee-risk-line">
              <el-icon><Message /></el-icon>
              <span>消息可生成后续待办，适合交班、复查电话和跨工作站协同。</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-drawer v-model="processDrawerVisible" title="处理个人事项" size="560px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="事项编号">{{ selectedRow?.id }}</el-descriptions-item>
        <el-descriptions-item label="功能分类">{{ selectedRow?.group }}</el-descriptions-item>
        <el-descriptions-item label="来源工作站">{{ selectedRow?.source }}</el-descriptions-item>
        <el-descriptions-item label="患者/对象">{{ selectedRow?.patient }}</el-descriptions-item>
        <el-descriptions-item label="处理事项">{{ selectedRow?.title }}</el-descriptions-item>
        <el-descriptions-item label="建议下一步">{{ selectedRow?.next }}</el-descriptions-item>
      </el-descriptions>
      <el-form class="dialog-form" label-width="96px">
        <el-form-item label="处理结果">
          <el-select model-value="done" placeholder="请选择结果">
            <el-option label="已处理" value="done" />
            <el-option label="转交他人" value="transfer" />
            <el-option label="退回补充" value="return" />
            <el-option label="生成复查任务" value="follow" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理意见">
          <el-input type="textarea" :rows="4" placeholder="记录处理依据、处置意见和后续要求" />
        </el-form-item>
      </el-form>
      <div class="drawer-actions">
        <el-button @click="processDrawerVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAction('事项处理结果已回写原业务')">提交处理</el-button>
      </div>
    </el-drawer>

    <el-dialog v-model="messageDialogVisible" title="消息详情" width="560px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="消息编号">{{ selectedRow?.id }}</el-descriptions-item>
        <el-descriptions-item label="来源">{{ selectedRow?.source }}</el-descriptions-item>
        <el-descriptions-item label="标题">{{ selectedRow?.title }}</el-descriptions-item>
        <el-descriptions-item label="处理建议">{{ selectedRow?.next }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="messageDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="submitAction('已根据消息生成后续待办')">生成待办</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="signatureDialogVisible" title="电子签名确认" width="560px">
      <el-alert type="warning" show-icon :closable="false" title="签名前请确认患者、业务对象、来源单据和处理意见一致。" />
      <el-form class="dialog-form" label-width="96px">
        <el-form-item label="签名对象">
          <el-input :model-value="selectedRow?.title" />
        </el-form-item>
        <el-form-item label="签名证书">
          <el-select model-value="cert">
            <el-option label="医生个人签章 / 有效" value="cert" />
          </el-select>
        </el-form-item>
        <el-form-item label="签名密码">
          <el-input type="password" placeholder="请输入签名密码" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="signatureDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAction('电子签名已完成并写入审计日志')">确认签名</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="profileDrawerVisible" title="员工资料维护" size="560px">
      <el-form label-width="110px">
        <el-form-item label="资料类别">
          <el-select v-model="activeProfile">
            <el-option v-for="item in profileTabs" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="资料内容">
          <el-input type="textarea" :rows="4" :model-value="profileDetails.map((item) => `${item.label}：${item.value}`).join('\n')" />
        </el-form-item>
        <el-form-item label="变更说明">
          <el-input type="textarea" :rows="3" placeholder="记录资料变更原因、附件和复核要求" />
        </el-form-item>
      </el-form>
      <div class="drawer-actions">
        <el-button @click="profileDrawerVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAction('员工资料变更已提交复核')">提交复核</el-button>
      </div>
    </el-drawer>

    <el-drawer v-model="traceDrawerVisible" title="处理追溯" size="520px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-15 08:10" type="primary">业务模块生成事项：{{ selectedRow?.title }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-15 08:12">推送到员工主页，接收人：{{ context.role }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-15 09:12" type="success">处理或签名后回写原业务并记录审计日志</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
