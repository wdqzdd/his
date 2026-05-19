<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  CircleCheck,
  DocumentAdd,
  Files,
  Histogram,
  Search,
  Warning,
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{
  context: PageContext;
}>();

type InfectionIssue = {
  id: string;
  checkType: string;
  target: string;
  zone: string;
  relatedPatient: string;
  relatedDevice: string;
  issueType: string;
  severity: string;
  checkTime: string;
  owner: string;
  rectificationStatus: string;
  reviewStatus: string;
  trainingLink: string;
  nextAction: string;
};

type TrainingRow = {
  title: string;
  date: string;
  trainer: string;
  attendance: string;
  passRate: string;
  status: string;
};

const sectionByMenu: Record<string, string> = {
  'infection-check': 'checks',
  'infection-register': 'issues',
  'infection-policy': 'policy',
  'infection-training': 'training',
  'infection-report': 'report',
};

const activeTab = ref(sectionByMenu[props.context.menuKey] ?? 'checks');
const selectedIssueId = ref('IC-001');
const checkDialogVisible = ref(false);
const rectifyDialogVisible = ref(false);
const reviewDialogVisible = ref(false);
const policyDialogVisible = ref(false);
const trainingDialogVisible = ref(false);
const traceDrawerVisible = ref(false);

watch(
  () => props.context.menuKey,
  (menuKey) => {
    activeTab.value = sectionByMenu[menuKey] ?? 'checks';
  },
);

const issues = ref<InfectionIssue[]>([
  { id: 'IC-001', checkType: '手卫生观察', target: '护士赵敏', zone: 'A区', relatedPatient: '王建国', relatedDevice: 'HD-08', issueType: '接触患者后未及时手消', severity: '中', checkTime: '2026-05-10 08:30', owner: '护士长', rectificationStatus: '待整改', reviewStatus: '未复核', trainingLink: '需培训', nextAction: '现场反馈' },
  { id: 'IC-002', checkType: '导管连接检查', target: '导管护理流程', zone: 'A区12床', relatedPatient: '李秀兰', relatedDevice: 'HD-12', issueType: '敷贴边缘翘起', severity: '中', checkTime: '2026-05-10 09:00', owner: '责任护士', rectificationStatus: '整改中', reviewStatus: '待复核', trainingLink: '已关联', nextAction: '复核导管出口' },
  { id: 'IC-003', checkType: '隔离透析检查', target: '乙肝隔离流程', zone: '隔离区', relatedPatient: '马丽', relatedDevice: 'ISO-01', issueType: '终末消毒记录待复核', severity: '高', checkTime: '2026-05-10 11:40', owner: '感控专员', rectificationStatus: '整改中', reviewStatus: '待复核', trainingLink: '需培训', nextAction: '复核消毒记录' },
  { id: 'IC-004', checkType: '内瘘穿刺检查', target: '穿刺拔针流程', zone: 'B区07床', relatedPatient: '陈志强', relatedDevice: 'HD-27', issueType: '压迫止血记录不完整', severity: '中', checkTime: '2026-05-10 12:20', owner: '护理组长', rectificationStatus: '待整改', reviewStatus: '未复核', trainingLink: '未关联', nextAction: '补记录' },
  { id: 'IC-005', checkType: '环境表面检查', target: '治疗车表面', zone: 'B区', relatedPatient: '-', relatedDevice: '-', issueType: '班次结束清洁签名缺失', severity: '低', checkTime: '2026-05-10 13:10', owner: '保洁主管', rectificationStatus: '已整改', reviewStatus: '已复核', trainingLink: '未关联', nextAction: '关闭' },
  { id: 'IC-006', checkType: '水处理间检查', target: '水处理间门禁', zone: '水处理间', relatedPatient: '-', relatedDevice: 'RO-A', issueType: '非授权人员进入记录', severity: '中', checkTime: '2026-05-10 14:00', owner: '设备技师', rectificationStatus: '待整改', reviewStatus: '未复核', trainingLink: '需培训', nextAction: '权限复核' },
  { id: 'IC-007', checkType: '医疗废物检查', target: '锐器盒', zone: 'C区', relatedPatient: '-', relatedDevice: '-', issueType: '锐器盒接近满载未更换', severity: '中', checkTime: '2026-05-10 15:10', owner: '责任护士', rectificationStatus: '已整改', reviewStatus: '待复核', trainingLink: '已关联', nextAction: '复核处置' },
  { id: 'IC-008', checkType: '传染病筛查', target: '新入患者筛查', zone: '导诊台', relatedPatient: '潘德胜', relatedDevice: '-', issueType: '感染四项报告待补', severity: '高', checkTime: '2026-05-10 16:20', owner: '导诊护士', rectificationStatus: '整改中', reviewStatus: '待复核', trainingLink: '未关联', nextAction: '补检验报告' },
  { id: 'IC-009', checkType: '设备消毒检查', target: '透析机外表消毒', zone: 'A区10床', relatedPatient: '曹敏', relatedDevice: 'HD-10', issueType: '消毒剂浓度记录缺项', severity: '中', checkTime: '2026-05-11 08:10', owner: '设备技师', rectificationStatus: '待整改', reviewStatus: '未复核', trainingLink: '需培训', nextAction: '补浓度记录' },
  { id: 'IC-010', checkType: '个人防护检查', target: '穿刺操作PPE', zone: 'B区11床', relatedPatient: '何雪', relatedDevice: 'HD-31', issueType: '护目镜佩戴不规范', severity: '低', checkTime: '2026-05-11 09:30', owner: '护理组长', rectificationStatus: '已整改', reviewStatus: '已复核', trainingLink: '已关联', nextAction: '关闭' },
  { id: 'IC-011', checkType: '导管断开检查', target: '下机导管封管', zone: 'C区02床', relatedPatient: '刘梅英', relatedDevice: 'HD-42', issueType: '封管记录与医嘱不一致', severity: '高', checkTime: '2026-05-11 20:30', owner: '医生/护士', rectificationStatus: '待整改', reviewStatus: '未复核', trainingLink: '需培训', nextAction: '医护联合复核' },
  { id: 'IC-012', checkType: '制度执行检查', target: '隔离物品专用', zone: '隔离区', relatedPatient: '马丽', relatedDevice: 'ISO-01', issueType: '隔离物品标签模糊', severity: '中', checkTime: '2026-05-12 10:00', owner: '感控专员', rectificationStatus: '已整改', reviewStatus: '待复核', trainingLink: '未关联', nextAction: '复核标签' },
]);

const trainingRows: TrainingRow[] = [
  { title: '血透中心手卫生专项培训', date: '2026-05-15', trainer: '感控专员', attendance: '42/45', passRate: '93%', status: '进行中' },
  { title: '导管连接与断开无菌操作', date: '2026-05-18', trainer: '护士长', attendance: '待签到', passRate: '待考试', status: '待开始' },
  { title: '隔离透析终末消毒流程', date: '2026-05-20', trainer: '感控专员', attendance: '待签到', passRate: '待考试', status: '待开始' },
  { title: '医疗废物与锐器盒处置', date: '2026-05-08', trainer: '院感科', attendance: '45/45', passRate: '98%', status: '已完成' },
];

const selectedIssue = computed(() => issues.value.find((item) => item.id === selectedIssueId.value) ?? issues.value[0]);

const metrics = computed(() => [
  { label: '检查问题', value: issues.value.length, tone: 'blue' },
  { label: '高风险', value: issues.value.filter((item) => item.severity === '高').length, tone: 'red' },
  { label: '待整改', value: issues.value.filter((item) => item.rectificationStatus.includes('待')).length, tone: 'orange' },
  { label: '待复核', value: issues.value.filter((item) => item.reviewStatus.includes('待') || item.reviewStatus === '未复核').length, tone: 'orange' },
  { label: '已关闭', value: issues.value.filter((item) => item.reviewStatus === '已复核').length, tone: 'green' },
]);

const closureChecks = computed(() => [
  { label: '关联对象', value: selectedIssue.value.relatedPatient !== '-' ? selectedIssue.value.relatedPatient : selectedIssue.value.relatedDevice, pass: true },
  { label: '责任人', value: selectedIssue.value.owner, pass: true },
  { label: '整改状态', value: selectedIssue.value.rectificationStatus, pass: selectedIssue.value.rectificationStatus === '已整改' },
  { label: '复核状态', value: selectedIssue.value.reviewStatus, pass: selectedIssue.value.reviewStatus === '已复核' },
  { label: '培训关联', value: selectedIssue.value.trainingLink, pass: selectedIssue.value.trainingLink !== '需培训' },
]);

const activeTables = ['infection_check', 'infection_issue', 'infection_rectification', 'infection_policy', 'infection_training', 'infection_training_attendance'];

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (['已整改', '已复核', '已关联', '已完成', '低', '关闭'].includes(value)) return 'success';
  if (['高', '需培训'].includes(value) || value.includes('待整改')) return 'danger';
  if (value.includes('待') || value.includes('中') || value === '未复核' || value === '未关联' || value === '中') return 'warning';
  return 'info';
}

function selectIssue(row: InfectionIssue): void {
  selectedIssueId.value = row.id;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}

function createCheck(): void {
  checkDialogVisible.value = false;
  submitAction('感控检查已登记，发现问题将生成整改任务');
}

function rectifyIssue(): void {
  selectedIssue.value.rectificationStatus = '已整改';
  rectifyDialogVisible.value = false;
  submitAction('整改记录已保存，等待感控复核');
}

function reviewIssue(): void {
  selectedIssue.value.reviewStatus = '已复核';
  selectedIssue.value.trainingLink = selectedIssue.value.trainingLink === '需培训' ? '已关联' : selectedIssue.value.trainingLink;
  reviewDialogVisible.value = false;
  submitAction('复核完成，问题已关闭并进入统计');
}
</script>

<template>
  <section class="infection-page">
    <el-card class="infection-work-card" shadow="never">
      <template #header>
        <div class="infection-header">
          <div>
            <h2>感控管理</h2>
            <p>围绕血透中心手卫生、导管连接/断开、内瘘穿刺/拔针、隔离透析、设备环境消毒、整改复核和培训统计形成闭环。</p>
          </div>
          <div class="infection-actions">
            <el-button type="primary" :icon="DocumentAdd" @click="checkDialogVisible = true">新增检查</el-button>
            <el-button :icon="Warning" @click="rectifyDialogVisible = true">整改登记</el-button>
            <el-button :icon="CircleCheck" @click="reviewDialogVisible = true">复核关闭</el-button>
            <el-button :icon="Files" @click="policyDialogVisible = true">制度维护</el-button>
            <el-button :icon="Histogram" @click="trainingDialogVisible = true">培训</el-button>
          </div>
        </div>
      </template>

      <el-form class="infection-filter" inline>
        <el-form-item label="关键字">
          <el-input placeholder="患者、机位、设备、问题、责任人" clearable />
        </el-form-item>
        <el-form-item label="检查类型">
          <el-select placeholder="全部类型" clearable>
            <el-option label="手卫生" value="hand" />
            <el-option label="导管连接/断开" value="catheter" />
            <el-option label="内瘘穿刺/拔针" value="avf" />
            <el-option label="设备消毒" value="device" />
            <el-option label="隔离透析" value="isolation" />
          </el-select>
        </el-form-item>
        <el-form-item label="整改状态">
          <el-select placeholder="全部状态" clearable>
            <el-option label="待整改" value="pending" />
            <el-option label="整改中" value="doing" />
            <el-option label="已整改" value="done" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker type="date" placeholder="检查日期" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>

      <div class="infection-stat-grid">
        <el-card v-for="item in metrics" :key="item.label" :class="['infection-stat-card', item.tone]" shadow="never">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </el-card>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :xl="16">
          <el-card class="infection-main-card" shadow="never">
            <template #header>
              <div class="infection-card-header">
                <div>
                  <strong>感控检查与问题登记</strong>
                  <p>示例数据不少于 10 条，覆盖手卫生、导管、内瘘、隔离、环境、设备、水处理和传染病筛查。</p>
                </div>
                <el-tag type="primary" effect="plain">检查发现问题 -> 整改 -> 复核 -> 培训统计</el-tag>
              </div>
            </template>
            <el-table :data="issues" border stripe highlight-current-row row-key="id" @row-click="selectIssue">
              <el-table-column prop="checkType" label="检查类型" min-width="130" fixed="left" />
              <el-table-column prop="target" label="检查对象" min-width="140" />
              <el-table-column prop="zone" label="区域/机位" width="110" />
              <el-table-column prop="relatedPatient" label="关联患者" width="100" />
              <el-table-column prop="relatedDevice" label="关联设备" width="100" />
              <el-table-column prop="issueType" label="问题" min-width="190" />
              <el-table-column prop="severity" label="等级" width="80">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.severity)">{{ row.severity }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="checkTime" label="检查时间" min-width="150" />
              <el-table-column prop="owner" label="责任人" width="105" />
              <el-table-column prop="rectificationStatus" label="整改" width="105">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.rectificationStatus)">{{ row.rectificationStatus }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="reviewStatus" label="复核" width="100">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.reviewStatus)" effect="plain">{{ row.reviewStatus }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="trainingLink" label="培训" width="100" />
              <el-table-column prop="nextAction" label="下一步" min-width="120" />
              <el-table-column label="操作" width="230" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click.stop="selectIssue(row); rectifyDialogVisible = true">整改</el-button>
                  <el-button link @click.stop="selectIssue(row); reviewDialogVisible = true">复核</el-button>
                  <el-button link @click.stop="selectIssue(row); trainingDialogVisible = true">培训</el-button>
                  <el-button link @click.stop="selectIssue(row); traceDrawerVisible = true">追溯</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>

        <el-col :xs="24" :xl="8">
          <el-card class="infection-side-card" shadow="never">
            <template #header>
              <div class="infection-card-header">
                <strong>当前问题闭环检查</strong>
                <el-tag :type="tagType(selectedIssue.severity)">{{ selectedIssue.severity }}风险</el-tag>
              </div>
            </template>
            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="对象">{{ selectedIssue.target }} / {{ selectedIssue.zone }}</el-descriptions-item>
              <el-descriptions-item label="问题">{{ selectedIssue.issueType }}</el-descriptions-item>
              <el-descriptions-item label="关联">{{ selectedIssue.relatedPatient }} / {{ selectedIssue.relatedDevice }}</el-descriptions-item>
              <el-descriptions-item label="责任">{{ selectedIssue.owner }}</el-descriptions-item>
            </el-descriptions>
            <div class="infection-check-list">
              <div v-for="item in closureChecks" :key="item.label" class="infection-check-row">
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
                <el-icon :class="{ pass: item.pass, block: !item.pass }">
                  <CircleCheck v-if="item.pass" />
                  <Warning v-else />
                </el-icon>
              </div>
            </div>
            <div class="infection-quick-actions">
              <el-button type="primary" @click="rectifyDialogVisible = true">整改</el-button>
              <el-button @click="reviewDialogVisible = true">复核关闭</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="infection-workspace-card" shadow="never">
      <template #header>
        <div class="infection-card-header">
          <div>
            <strong>制度培训与统计</strong>
            <p>问题复发或高风险缺陷应关联制度学习和培训，培训签到与考试结果进入感控统计。</p>
          </div>
          <el-button type="primary" :icon="Histogram" @click="trainingDialogVisible = true">安排培训</el-button>
        </div>
      </template>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="培训计划" name="training">
          <el-table :data="trainingRows" border stripe>
            <el-table-column prop="title" label="培训主题" min-width="190" />
            <el-table-column prop="date" label="日期" width="115" />
            <el-table-column prop="trainer" label="讲师" width="110" />
            <el-table-column prop="attendance" label="签到" width="110" />
            <el-table-column prop="passRate" label="通过率" width="110" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="tagType(row.status)">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="制度文件" name="policy">
          <div class="infection-policy-grid">
            <el-card shadow="never" class="infection-policy-card">
              <strong>血透手卫生制度</strong>
              <p>覆盖接触患者前后、导管操作、穿刺拔针、环境清洁和手消用品配置。</p>
              <el-tag type="success">V2026.02</el-tag>
            </el-card>
            <el-card shadow="never" class="infection-policy-card">
              <strong>隔离透析管理制度</strong>
              <p>覆盖传染病筛查、分区分机、专用物品、终末消毒和标识。</p>
              <el-tag type="success">V2026.02</el-tag>
            </el-card>
            <el-card shadow="never" class="infection-policy-card">
              <strong>导管连接断开 SOP</strong>
              <p>覆盖无菌屏障、出口护理、封管记录和异常上报。</p>
              <el-tag type="warning">待复审</el-tag>
            </el-card>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog v-model="checkDialogVisible" title="新增感控检查" width="660px">
      <el-form label-width="110px">
        <el-form-item label="检查类型">
          <el-select model-value="hand">
            <el-option label="手卫生观察" value="hand" />
            <el-option label="导管连接/断开" value="catheter" />
            <el-option label="内瘘穿刺/拔针" value="avf" />
            <el-option label="隔离透析" value="isolation" />
            <el-option label="设备/环境消毒" value="disinfection" />
          </el-select>
        </el-form-item>
        <el-form-item label="检查对象">
          <el-input placeholder="人员、患者、机位、设备或区域" />
        </el-form-item>
        <el-form-item label="问题描述">
          <el-input type="textarea" :rows="3" placeholder="记录不合格项、证据、关联患者/设备和风险等级" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="checkDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="createCheck">保存检查</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="rectifyDialogVisible" title="整改登记" width="660px">
      <el-form label-width="110px">
        <el-form-item label="问题">
          <el-input :model-value="selectedIssue.issueType" />
        </el-form-item>
        <el-form-item label="整改措施">
          <el-input type="textarea" :rows="3" placeholder="记录现场整改、流程调整、补记录、补培训或设备处理" />
        </el-form-item>
        <el-form-item label="责任人">
          <el-input :model-value="selectedIssue.owner" />
        </el-form-item>
        <el-form-item label="完成日期">
          <el-date-picker type="date" placeholder="整改完成日期" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rectifyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="rectifyIssue">保存整改</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="reviewDialogVisible" title="整改复核" width="620px">
      <el-alert type="warning" show-icon :closable="false" title="高风险问题复核未通过时，应继续整改或升级为 CQI/院感事件。" />
      <el-form class="dialog-form" label-width="110px">
        <el-form-item label="复核结果">
          <el-radio-group model-value="pass">
            <el-radio-button label="pass">通过</el-radio-button>
            <el-radio-button label="continue">继续整改</el-radio-button>
            <el-radio-button label="cqi">转CQI</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="复核说明">
          <el-input type="textarea" :rows="3" placeholder="记录复核依据、现场照片、培训完成情况和是否关闭" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reviewDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="reviewIssue">复核关闭</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="policyDialogVisible" title="感控制度维护" width="620px">
      <el-form label-width="110px">
        <el-form-item label="制度名称">
          <el-input placeholder="例如：血透中心手卫生制度" />
        </el-form-item>
        <el-form-item label="版本号">
          <el-input placeholder="例如：V2026.02" />
        </el-form-item>
        <el-form-item label="生效日期">
          <el-date-picker type="date" placeholder="选择日期" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="policyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="policyDialogVisible = false; submitAction('感控制度已保存并通知学习')">保存制度</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="trainingDialogVisible" title="感控培训安排" width="660px">
      <el-form label-width="110px">
        <el-form-item label="培训主题">
          <el-input placeholder="手卫生、导管操作、隔离透析、医疗废物等" />
        </el-form-item>
        <el-form-item label="培训对象">
          <el-checkbox-group model-value="nurse">
            <el-checkbox-button label="doctor">医生</el-checkbox-button>
            <el-checkbox-button label="nurse">护士</el-checkbox-button>
            <el-checkbox-button label="technician">技师</el-checkbox-button>
            <el-checkbox-button label="cleaner">保洁</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="考试要求">
          <el-switch active-text="需要考试" inactive-text="仅签到" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="trainingDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="trainingDialogVisible = false; submitAction('培训计划已生成并推送到员工主页')">保存培训</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="感控事件追溯" size="560px">
      <el-timeline>
        <el-timeline-item timestamp="检查发现" type="primary">{{ selectedIssue.checkType }}：{{ selectedIssue.issueType }}</el-timeline-item>
        <el-timeline-item timestamp="关联对象" type="warning">患者 {{ selectedIssue.relatedPatient }}，设备 {{ selectedIssue.relatedDevice }}，区域 {{ selectedIssue.zone }}</el-timeline-item>
        <el-timeline-item timestamp="整改复核" type="success">整改：{{ selectedIssue.rectificationStatus }}；复核：{{ selectedIssue.reviewStatus }}</el-timeline-item>
        <el-timeline-item timestamp="改进">问题进入感控统计、培训计划和 CQI 分析。</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
