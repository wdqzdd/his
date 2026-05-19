<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  CircleCheck,
  DocumentAdd,
  Files,
  Reading,
  Search,
  User,
  Warning,
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{
  context: PageContext;
}>();

type StaffRow = {
  id: string;
  name: string;
  role: string;
  department: string;
  workGroup: string;
  employment: string;
  dialysisCert: string;
  trainingStatus: string;
  gcpStatus: string;
  certificate: string;
  research: string;
  risk: string;
  nextAction: string;
};

type TrainingRow = {
  title: string;
  target: string;
  date: string;
  completion: string;
  passRate: string;
  status: string;
};

const sectionByMenu: Record<string, string> = {
  'hr-staff': 'staff',
  'hr-profile': 'profile',
  'hr-work': 'work',
  'hr-education': 'education',
  'hr-gcp': 'gcp',
  'hr-social': 'social',
  'hr-research': 'research',
  'hr-certificate': 'certificate',
};

const activeTab = ref(sectionByMenu[props.context.menuKey] ?? 'staff');
const selectedStaffId = ref('HR-001');
const profileDialogVisible = ref(false);
const trainingDialogVisible = ref(false);
const certificateDialogVisible = ref(false);
const authorizeDialogVisible = ref(false);
const traceDrawerVisible = ref(false);

watch(
  () => props.context.menuKey,
  (menuKey) => {
    activeTab.value = sectionByMenu[menuKey] ?? 'staff';
  },
);

const staffRows = ref<StaffRow[]>([
  { id: 'HR-001', name: '刘主任', role: '主诊医生', department: '血液净化中心', workGroup: '医生组', employment: '在岗', dialysisCert: '有效', trainingStatus: '已完成', gcpStatus: '已授权', certificate: '医师执业证有效', research: 'PI/分中心负责人', risk: '低', nextAction: '持续维护' },
  { id: 'HR-002', name: '赵护士', role: '责任护士', department: '血液净化中心', workGroup: 'A护理组', employment: '在岗', dialysisCert: '有效', trainingStatus: '已完成', gcpStatus: '未授权', certificate: '护士执业证有效', research: '无', risk: '低', nextAction: '持续维护' },
  { id: 'HR-003', name: '王护士长', role: '护士长', department: '血液净化中心', workGroup: '护理管理', employment: '在岗', dialysisCert: '有效', trainingStatus: '待复训', gcpStatus: '已授权', certificate: '护士执业证有效', research: 'Sub-I', risk: '中', nextAction: '安排复训' },
  { id: 'HR-004', name: '陈技师', role: '设备技师', department: '工程设备组', workGroup: '设备组', employment: '在岗', dialysisCert: '有效', trainingStatus: '已完成', gcpStatus: '未授权', certificate: '设备维护证有效', research: '设备支持', risk: '低', nextAction: '持续维护' },
  { id: 'HR-005', name: '周药师', role: '药师', department: '药房', workGroup: '药事组', employment: '在岗', dialysisCert: '不适用', trainingStatus: '已完成', gcpStatus: '已授权', certificate: '药师资格证有效', research: '研究药物管理员', risk: '低', nextAction: '持续维护' },
  { id: 'HR-006', name: '孙检验师', role: '检验技师', department: '检验科', workGroup: '检验组', employment: '在岗', dialysisCert: '不适用', trainingStatus: '待考试', gcpStatus: '未授权', certificate: '检验资格证有效', research: '标本处理', risk: '中', nextAction: '完成考试' },
  { id: 'HR-007', name: '李导诊', role: '导诊客服', department: '导诊客服组', workGroup: '导诊组', employment: '在岗', dialysisCert: '不适用', trainingStatus: '已完成', gcpStatus: '未授权', certificate: '服务培训有效', research: '受试者预约协助', risk: '低', nextAction: '持续维护' },
  { id: 'HR-008', name: '马感控', role: '感控专员', department: '院感科', workGroup: '感控组', employment: '在岗', dialysisCert: '有效', trainingStatus: '已完成', gcpStatus: '未授权', certificate: '院感培训有效', research: '感染事件审核', risk: '低', nextAction: '持续维护' },
  { id: 'HR-009', name: '吴医生', role: '住院医师', department: '血液净化中心', workGroup: '医生组', employment: '试用', dialysisCert: '待考核', trainingStatus: '待完成', gcpStatus: '未授权', certificate: '医师执业证有效', research: '无', risk: '高', nextAction: '限制独立排班' },
  { id: 'HR-010', name: '郑护士', role: '穿刺护士', department: '血液净化中心', workGroup: 'B护理组', employment: '在岗', dialysisCert: '即将到期', trainingStatus: '待复训', gcpStatus: '未授权', certificate: '护士执业证有效', research: '无', risk: '高', nextAction: '证书续期' },
  { id: 'HR-011', name: '钱CRC', role: 'CRC研究协调员', department: 'GCP中心', workGroup: 'CRC组', employment: '在岗', dialysisCert: '不适用', trainingStatus: '已完成', gcpStatus: '已授权', certificate: 'GCP证书有效', research: 'CRC', risk: '低', nextAction: '持续维护' },
  { id: 'HR-012', name: '何会计', role: '库房会计', department: '药耗管理组', workGroup: '药耗组', employment: '在岗', dialysisCert: '不适用', trainingStatus: '待完成', gcpStatus: '未授权', certificate: '财务权限有效', research: '无', risk: '中', nextAction: '完成药耗培训' },
]);

const trainingRows: TrainingRow[] = [
  { title: '血液净化 SOP 年度培训', target: '医生/护士/技师', date: '2026-05-20', completion: '38/45', passRate: '92%', status: '进行中' },
  { title: '院感与隔离透析培训', target: '全员', date: '2026-05-22', completion: '31/45', passRate: '待考试', status: '进行中' },
  { title: 'GCP研究者培训', target: '研究团队', date: '2026-05-18', completion: '8/12', passRate: '95%', status: '进行中' },
  { title: '设备水处理应急演练', target: '技师/护士长', date: '2026-05-28', completion: '待开始', passRate: '待考试', status: '待开始' },
];

const selectedStaff = computed(() => staffRows.value.find((item) => item.id === selectedStaffId.value) ?? staffRows.value[0]);

const metrics = computed(() => [
  { label: '在岗人员', value: staffRows.value.filter((item) => item.employment === '在岗').length, tone: 'blue' },
  { label: '资质风险', value: staffRows.value.filter((item) => item.risk === '高').length, tone: 'red' },
  { label: '待培训', value: staffRows.value.filter((item) => item.trainingStatus.includes('待')).length, tone: 'orange' },
  { label: 'GCP授权', value: staffRows.value.filter((item) => item.gcpStatus === '已授权').length, tone: 'green' },
  { label: '证书预警', value: staffRows.value.filter((item) => item.dialysisCert.includes('到期') || item.dialysisCert.includes('待')).length, tone: 'orange' },
]);

const closureChecks = computed(() => [
  { label: '在岗状态', value: selectedStaff.value.employment, pass: selectedStaff.value.employment === '在岗' },
  { label: '血透资质', value: selectedStaff.value.dialysisCert, pass: ['有效', '不适用'].includes(selectedStaff.value.dialysisCert) },
  { label: '培训状态', value: selectedStaff.value.trainingStatus, pass: selectedStaff.value.trainingStatus === '已完成' },
  { label: '证件状态', value: selectedStaff.value.certificate, pass: selectedStaff.value.certificate.includes('有效') },
  { label: 'GCP授权', value: selectedStaff.value.gcpStatus, pass: selectedStaff.value.gcpStatus === '已授权' || selectedStaff.value.research === '无' },
  { label: '岗位可用', value: selectedStaff.value.nextAction, pass: selectedStaff.value.risk !== '高' },
]);

const activeTables = ['staff_profile', 'staff_work_history', 'staff_training_record', 'staff_gcp_training', 'staff_certificate', 'staff_research_activity', 'staff_authorization'];

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (['在岗', '有效', '已完成', '已授权', '低'].includes(value) || value.includes('有效')) return 'success';
  if (['高'].includes(value) || value.includes('限制') || value.includes('到期')) return 'danger';
  if (value.includes('待') || value.includes('中') || value.includes('试用') || value === '中') return 'warning';
  return 'info';
}

function selectStaff(row: StaffRow): void {
  selectedStaffId.value = row.id;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}

function saveProfile(): void {
  profileDialogVisible.value = false;
  submitAction('员工资料已保存，权限和排班可引用最新岗位信息');
}

function saveTraining(): void {
  selectedStaff.value.trainingStatus = '已完成';
  trainingDialogVisible.value = false;
  submitAction('培训记录已保存，资质状态已重新计算');
}

function saveCertificate(): void {
  selectedStaff.value.dialysisCert = '有效';
  certificateDialogVisible.value = false;
  submitAction('证书已续期，排班限制已解除');
}

function authorizeGcp(): void {
  selectedStaff.value.gcpStatus = '已授权';
  authorizeDialogVisible.value = false;
  submitAction('GCP授权已更新，可进入研究项目权限范围');
}
</script>

<template>
  <section class="hr-page">
    <el-card class="hr-work-card" shadow="never">
      <template #header>
        <div class="hr-header">
          <div>
            <h2>行政人事站</h2>
            <p>维护员工人事、工作经历、培训、GCP、科研和证件证书，输出岗位资质、排班权限和研究授权。</p>
          </div>
          <div class="hr-actions">
            <el-button type="primary" :icon="User" @click="profileDialogVisible = true">维护资料</el-button>
            <el-button :icon="Reading" @click="trainingDialogVisible = true">培训记录</el-button>
            <el-button :icon="Files" @click="certificateDialogVisible = true">证书续期</el-button>
            <el-button :icon="DocumentAdd" @click="authorizeDialogVisible = true">GCP授权</el-button>
          </div>
        </div>
      </template>

      <el-form class="hr-filter" inline>
        <el-form-item label="关键字">
          <el-input placeholder="姓名、角色、科室、证书" clearable />
        </el-form-item>
        <el-form-item label="资质状态">
          <el-select placeholder="全部状态" clearable>
            <el-option label="有效" value="valid" />
            <el-option label="待考核" value="pending" />
            <el-option label="即将到期" value="expiring" />
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

      <div class="hr-stat-grid">
        <el-card v-for="item in metrics" :key="item.label" :class="['hr-stat-card', item.tone]" shadow="never">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </el-card>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :xl="16">
          <el-card class="hr-main-card" shadow="never">
            <template #header>
              <div class="hr-card-header">
                <div>
                  <strong>员工资质与岗位可用性</strong>
                  <p>示例数据不少于 10 条，资质状态应影响排班、工作身份、GCP权限、培训和质控闭环。</p>
                </div>
                <el-tag type="primary" effect="plain">人事资料 -> 培训证书 -> 授权 -> 排班/权限引用</el-tag>
              </div>
            </template>
            <el-table :data="staffRows" border stripe highlight-current-row row-key="id" @row-click="selectStaff">
              <el-table-column prop="name" label="姓名" width="95" fixed="left" />
              <el-table-column prop="role" label="角色" min-width="120" />
              <el-table-column prop="department" label="科室" min-width="130" />
              <el-table-column prop="workGroup" label="组别" width="110" />
              <el-table-column prop="employment" label="状态" width="85">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.employment)">{{ row.employment }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="dialysisCert" label="血透资质" width="110" />
              <el-table-column prop="trainingStatus" label="培训" width="95">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.trainingStatus)">{{ row.trainingStatus }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="gcpStatus" label="GCP" width="95" />
              <el-table-column prop="certificate" label="证件证书" min-width="145" />
              <el-table-column prop="research" label="科研/GCP角色" min-width="130" />
              <el-table-column prop="risk" label="风险" width="75">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.risk)" effect="plain">{{ row.risk }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="nextAction" label="下一步" min-width="120" />
              <el-table-column label="操作" width="230" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click.stop="selectStaff(row); profileDialogVisible = true">资料</el-button>
                  <el-button link @click.stop="selectStaff(row); trainingDialogVisible = true">培训</el-button>
                  <el-button link @click.stop="selectStaff(row); certificateDialogVisible = true">证书</el-button>
                  <el-button link @click.stop="selectStaff(row); traceDrawerVisible = true">追溯</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>

        <el-col :xs="24" :xl="8">
          <el-card class="hr-side-card" shadow="never">
            <template #header>
              <div class="hr-card-header">
                <strong>当前人员闭环</strong>
                <el-tag :type="tagType(selectedStaff.risk)">{{ selectedStaff.risk }}风险</el-tag>
              </div>
            </template>
            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="人员">{{ selectedStaff.name }} / {{ selectedStaff.role }}</el-descriptions-item>
              <el-descriptions-item label="科室">{{ selectedStaff.department }} / {{ selectedStaff.workGroup }}</el-descriptions-item>
              <el-descriptions-item label="证书">{{ selectedStaff.certificate }}</el-descriptions-item>
              <el-descriptions-item label="下一步">{{ selectedStaff.nextAction }}</el-descriptions-item>
            </el-descriptions>
            <div class="hr-check-list">
              <div v-for="item in closureChecks" :key="item.label" class="hr-check-row">
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
                <el-icon :class="{ pass: item.pass, block: !item.pass }">
                  <CircleCheck v-if="item.pass" />
                  <Warning v-else />
                </el-icon>
              </div>
            </div>
            <div class="hr-quick-actions">
              <el-button type="primary" @click="trainingDialogVisible = true">补培训</el-button>
              <el-button @click="certificateDialogVisible = true">证书续期</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="hr-workspace-card" shadow="never">
      <template #header>
        <div class="hr-card-header">
          <div>
            <strong>培训计划与授权</strong>
            <p>培训和证书结果要同步影响工作站身份、排班资格、GCP研究授权和质控整改责任人。</p>
          </div>
          <el-button type="primary" :icon="Reading" @click="trainingDialogVisible = true">新增培训</el-button>
        </div>
      </template>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="培训计划" name="education">
          <el-table :data="trainingRows" border stripe>
            <el-table-column prop="title" label="培训主题" min-width="190" />
            <el-table-column prop="target" label="对象" min-width="130" />
            <el-table-column prop="date" label="日期" width="115" />
            <el-table-column prop="completion" label="完成" width="110" />
            <el-table-column prop="passRate" label="通过率" width="110" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="tagType(row.status)">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="授权概览" name="gcp">
          <el-descriptions :column="3" border>
            <el-descriptions-item label="GCP授权">4人</el-descriptions-item>
            <el-descriptions-item label="排班受限">2人</el-descriptions-item>
            <el-descriptions-item label="证书预警">2人</el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog v-model="profileDialogVisible" title="员工资料维护" width="660px">
      <el-form label-width="110px">
        <el-form-item label="姓名">
          <el-input :model-value="selectedStaff.name" />
        </el-form-item>
        <el-form-item label="岗位角色">
          <el-input :model-value="selectedStaff.role" />
        </el-form-item>
        <el-form-item label="所属组别">
          <el-input :model-value="selectedStaff.workGroup" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="profileDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveProfile">保存资料</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="trainingDialogVisible" title="培训记录" width="660px">
      <el-form label-width="110px">
        <el-form-item label="培训主题">
          <el-select model-value="sop">
            <el-option label="血液净化 SOP 年度培训" value="sop" />
            <el-option label="院感与隔离透析培训" value="infection" />
            <el-option label="GCP研究者培训" value="gcp" />
          </el-select>
        </el-form-item>
        <el-form-item label="考试结果">
          <el-radio-group model-value="pass">
            <el-radio-button label="pass">通过</el-radio-button>
            <el-radio-button label="fail">未通过</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="trainingDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveTraining">保存培训</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="certificateDialogVisible" title="证书续期" width="620px">
      <el-form label-width="110px">
        <el-form-item label="证书类型">
          <el-input :model-value="selectedStaff.certificate" />
        </el-form-item>
        <el-form-item label="有效期至">
          <el-date-picker type="date" placeholder="选择日期" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="certificateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCertificate">保存证书</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="authorizeDialogVisible" title="GCP授权" width="620px">
      <el-form label-width="110px">
        <el-form-item label="授权角色">
          <el-select model-value="subi">
            <el-option label="PI" value="pi" />
            <el-option label="Sub-I" value="subi" />
            <el-option label="研究药物管理员" value="drug" />
            <el-option label="CRC" value="crc" />
          </el-select>
        </el-form-item>
        <el-form-item label="授权范围">
          <el-input type="textarea" :rows="3" placeholder="项目、中心、有效期和可操作模块" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="authorizeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="authorizeGcp">保存授权</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="人员资质追溯" size="580px">
      <el-timeline>
        <el-timeline-item timestamp="人事资料" type="primary">{{ selectedStaff.name }}，{{ selectedStaff.role }}，{{ selectedStaff.department }}</el-timeline-item>
        <el-timeline-item timestamp="培训证书" type="warning">培训：{{ selectedStaff.trainingStatus }}；证书：{{ selectedStaff.certificate }}</el-timeline-item>
        <el-timeline-item timestamp="授权" type="success">GCP：{{ selectedStaff.gcpStatus }}；血透资质：{{ selectedStaff.dialysisCert }}</el-timeline-item>
        <el-timeline-item timestamp="业务引用">排班、工作身份、研究项目和质控责任人引用该资质状态。</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
