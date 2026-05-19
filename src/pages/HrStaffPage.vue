<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, Search, User, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();
type Row = {
  id: string;
  name: string;
  role: string;
  department: string;
  workGroup: string;
  employment: string;
  qualification: string;
  adminPost: string;
  processType: string;
  processStatus: string;
  processStep: string;
  risk: string;
  owner: string;
  nextAction: string;
};
const selectedId = ref('HS-001');
const staffDialogVisible = ref(false);
const statusDialogVisible = ref(false);
const processDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const rows: Row[] = [
  { id: 'HS-001', name: '刘主任', role: '主诊医生', department: '血液净化中心', workGroup: '医生组', employment: '在岗', qualification: '血透资质有效', adminPost: '科室副主任', processType: '聘任流程', processStatus: '已归档', processStep: '任职聘书归档', risk: '低', owner: '行政人事', nextAction: '持续维护' },
  { id: 'HS-002', name: '赵护士', role: '责任护士', department: '血液净化中心', workGroup: 'A护理组', employment: '在岗', qualification: '血透资质有效', adminPost: '无', processType: '入职记录', processStatus: '已归档', processStep: '合同归档', risk: '低', owner: '护理部', nextAction: '持续维护' },
  { id: 'HS-003', name: '王护士长', role: '护士长', department: '血液净化中心', workGroup: '护理管理', employment: '在岗', qualification: '血透资质有效', adminPost: '护理组长', processType: '晋升流程', processStatus: '待复核', processStep: '护理部复核', risk: '中', owner: '护理部', nextAction: '安排复训' },
  { id: 'HS-004', name: '陈技师', role: '设备技师', department: '工程设备组', workGroup: '设备组', employment: '在岗', qualification: '设备维护证有效', adminPost: '设备安全员', processType: '任职职务记录', processStatus: '已归档', processStep: '岗位授权生效', risk: '低', owner: '设备科', nextAction: '持续维护' },
  { id: 'HS-005', name: '周药师', role: '药师', department: '药房', workGroup: '药事组', employment: '在岗', qualification: '药师资格证有效', adminPost: '研究药物管理员', processType: '行政任职记录', processStatus: '已生效', processStep: 'GCP授权同步', risk: '低', owner: '药剂科', nextAction: '持续维护' },
  { id: 'HS-006', name: '孙检验师', role: '检验技师', department: '检验科', workGroup: '检验组', employment: '在岗', qualification: '检验资格证有效', adminPost: '危急值联络员', processType: '聘任流程', processStatus: '待材料', processStep: '补培训证明', risk: '中', owner: '检验科', nextAction: '完成考试' },
  { id: 'HS-007', name: '李导诊', role: '导诊客服', department: '导诊客服组', workGroup: '导诊组', employment: '在岗', qualification: '服务培训有效', adminPost: '服务专员', processType: '入职记录', processStatus: '已归档', processStep: '服务包权限开通', risk: '低', owner: '导诊台', nextAction: '持续维护' },
  { id: 'HS-008', name: '马感控', role: '感控专员', department: '院感科', workGroup: '感控组', employment: '在岗', qualification: '院感培训有效', adminPost: '感控督导', processType: '返聘记录', processStatus: '已生效', processStep: '返聘合同归档', risk: '低', owner: '院感科', nextAction: '持续维护' },
  { id: 'HS-009', name: '吴医生', role: '住院医师', department: '血液净化中心', workGroup: '医生组', employment: '试用', qualification: '待考核', adminPost: '无', processType: '入职记录', processStatus: '试用考核', processStep: '带教评价', risk: '高', owner: '医务科', nextAction: '限制独立排班' },
  { id: 'HS-010', name: '郑护士', role: '穿刺护士', department: '血液净化中心', workGroup: 'B护理组', employment: '在岗', qualification: '证书即将到期', adminPost: '穿刺带教', processType: '离任流程', processStatus: '待复核', processStep: '交接排班资格', risk: '高', owner: '护理部', nextAction: '证书续期' },
];
const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['staff_profile', 'staff_employment_record', 'staff_position_record', 'staff_process_record', 'staff_authorization', 'sys_work_identity'];
const metrics = computed(() => [
  { label: '员工人数', value: rows.length, tone: 'blue' },
  { label: '在岗', value: rows.filter((item) => item.employment === '在岗').length, tone: 'green' },
  { label: '试用/待考核', value: rows.filter((item) => item.employment === '试用' || item.qualification.includes('待')).length, tone: 'orange' },
  { label: '人事流程中', value: rows.filter((item) => item.processStatus !== '已归档').length, tone: 'orange' },
  { label: '高风险', value: rows.filter((item) => item.risk === '高').length, tone: 'red' },
]);
function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' { if (['在岗', '低', '已归档', '已生效'].includes(value) || value.includes('有效')) return 'success'; if (value === '高' || value.includes('限制') || value.includes('到期')) return 'danger'; if (value === '中' || value.includes('待') || value.includes('试用') || value.includes('复训') || value.includes('考核')) return 'warning'; return 'info'; }
function selectRow(row: Row): void { selectedId.value = row.id; }
function submitAction(message: string): void { ElMessage.success(message); }
</script>

<template>
  <section class="hr-page">
    <el-card class="hr-work-card" shadow="never">
          <template #header><div class="hr-header"><div><h2>{{ props.context.menuTitle }}</h2><p>维护员工入职、离职、退休、返聘、聘任、离任和晋升流程，输出给排班、权限和工作身份校验。</p></div><div class="hr-actions"><el-button type="primary" :icon="User" @click="staffDialogVisible = true">新增员工</el-button><el-button :icon="Warning" @click="statusDialogVisible = true">状态调整</el-button><el-button @click="processDialogVisible = true">流程办理</el-button><el-button :icon="CircleCheck" @click="traceDrawerVisible = true">人事追溯</el-button></div></div></template>
      <el-form class="hr-filter" inline><el-form-item label="关键字"><el-input placeholder="姓名、岗位、科室、工作组" clearable /></el-form-item><el-form-item label="在岗状态"><el-select placeholder="全部状态" clearable><el-option label="在岗" value="在岗" /><el-option label="试用" value="试用" /><el-option label="离岗" value="离岗" /></el-select></el-form-item><el-form-item label="风险"><el-select placeholder="全部风险" clearable><el-option label="高" value="高" /><el-option label="中" value="中" /><el-option label="低" value="低" /></el-select></el-form-item><el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item></el-form>
      <div class="hr-stat-grid"><el-card v-for="item in metrics" :key="item.label" :class="['hr-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>
      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow"><el-table-column prop="name" label="姓名" width="95" fixed="left" /><el-table-column prop="role" label="岗位角色" width="120" /><el-table-column prop="department" label="科室" min-width="130" /><el-table-column prop="workGroup" label="工作组" width="110" /><el-table-column prop="employment" label="状态" width="85"><template #default="{ row }"><el-tag :type="tagType(row.employment)">{{ row.employment }}</el-tag></template></el-table-column><el-table-column prop="adminPost" label="行政任职" width="120" /><el-table-column prop="processType" label="人事记录/流程" width="120" /><el-table-column prop="processStatus" label="流程状态" width="100"><template #default="{ row }"><el-tag :type="tagType(row.processStatus)">{{ row.processStatus }}</el-tag></template></el-table-column><el-table-column prop="processStep" label="当前环节" min-width="125" /><el-table-column prop="qualification" label="资质" min-width="140"><template #default="{ row }"><el-tag :type="tagType(row.qualification)" effect="plain">{{ row.qualification }}</el-tag></template></el-table-column><el-table-column prop="risk" label="风险" width="75"><template #default="{ row }"><el-tag :type="tagType(row.risk)" effect="plain">{{ row.risk }}</el-tag></template></el-table-column><el-table-column prop="owner" label="责任部门" width="110" /><el-table-column prop="nextAction" label="下一步" min-width="120" /><el-table-column label="操作" width="250" fixed="right"><template #default="{ row }"><el-button link type="primary" @click.stop="selectRow(row); staffDialogVisible = true">资料</el-button><el-button link @click.stop="selectRow(row); statusDialogVisible = true">状态</el-button><el-button link @click.stop="selectRow(row); processDialogVisible = true">流程</el-button><el-button link @click.stop="selectRow(row); traceDrawerVisible = true">追溯</el-button></template></el-table-column></el-table>
    </el-card>    <el-dialog v-model="staffDialogVisible" title="员工人事资料" width="640px"><el-form label-width="110px"><el-form-item label="姓名"><el-input :model-value="currentRow.name" /></el-form-item><el-form-item label="岗位角色"><el-input :model-value="currentRow.role" /></el-form-item><el-form-item label="科室/工作组"><el-input :model-value="`${currentRow.department} / ${currentRow.workGroup}`" /></el-form-item><el-form-item label="工作身份"><el-checkbox-group><el-checkbox label="医生站" /><el-checkbox label="护士站" /><el-checkbox label="技师站" /><el-checkbox label="管理端" /></el-checkbox-group></el-form-item><el-form-item label="维护说明"><el-input type="textarea" :rows="3" placeholder="记录入职、转岗、工作身份和权限影响" /></el-form-item></el-form><template #footer><el-button @click="staffDialogVisible = false">取消</el-button><el-button type="primary" @click="staffDialogVisible = false; submitAction('员工人事资料已保存')">保存</el-button></template></el-dialog>
    <el-dialog v-model="statusDialogVisible" title="员工状态调整" width="580px"><el-form label-width="110px"><el-form-item label="员工"><el-input :model-value="`${currentRow.name} / ${currentRow.role}`" disabled /></el-form-item><el-form-item label="调整结果"><el-radio-group model-value="active"><el-radio-button label="active">在岗</el-radio-button><el-radio-button label="trial">试用</el-radio-button><el-radio-button label="leave">离岗</el-radio-button></el-radio-group></el-form-item><el-form-item label="影响范围"><el-checkbox-group><el-checkbox label="排班限制" /><el-checkbox label="权限调整" /><el-checkbox label="待办转派" /></el-checkbox-group></el-form-item><el-form-item label="原因"><el-input type="textarea" :rows="3" placeholder="记录状态调整原因、生效日期和交接要求" /></el-form-item></el-form><template #footer><el-button @click="statusDialogVisible = false">取消</el-button><el-button type="primary" @click="statusDialogVisible = false; submitAction('员工状态已调整')">提交调整</el-button></template></el-dialog>
    <el-dialog v-model="processDialogVisible" title="人事流程办理" width="660px"><el-form label-width="110px"><el-form-item label="员工"><el-input :model-value="`${currentRow.name} / ${currentRow.role}`" disabled /></el-form-item><el-form-item label="流程类型"><el-select :model-value="currentRow.processType"><el-option label="入职记录" value="入职记录" /><el-option label="离职记录" value="离职记录" /><el-option label="退休记录" value="退休记录" /><el-option label="返聘记录" value="返聘记录" /><el-option label="聘任流程" value="聘任流程" /><el-option label="离任流程" value="离任流程" /><el-option label="晋升流程" value="晋升流程" /></el-select></el-form-item><el-form-item label="行政任职"><el-input :model-value="currentRow.adminPost" placeholder="科室主任、护理组长、GCP项目角色等" /></el-form-item><el-form-item label="办理结论"><el-radio-group model-value="approve"><el-radio-button label="approve">复核通过</el-radio-button><el-radio-button label="supplement">补材料</el-radio-button><el-radio-button label="reject">退回</el-radio-button></el-radio-group></el-form-item><el-form-item label="影响范围"><el-checkbox-group><el-checkbox label="工作身份" /><el-checkbox label="角色权限" /><el-checkbox label="值班排班" /><el-checkbox label="GCP授权" /><el-checkbox label="质控责任人" /></el-checkbox-group></el-form-item><el-form-item label="办理意见"><el-input type="textarea" :rows="3" placeholder="记录流程意见、任职/离任生效日期、交接要求和审计附件" /></el-form-item></el-form><template #footer><el-button @click="processDialogVisible = false">取消</el-button><el-button type="primary" @click="processDialogVisible = false; submitAction('人事流程已提交复核')">提交流程</el-button></template></el-dialog>
    <el-drawer v-model="traceDrawerVisible" title="人事变更追溯" size="520px"><el-timeline><el-timeline-item timestamp="建档">员工：{{ currentRow.name }}，岗位：{{ currentRow.role }}</el-timeline-item><el-timeline-item timestamp="人事流程" type="warning">{{ currentRow.processType }} / {{ currentRow.processStatus }}，环节：{{ currentRow.processStep }}</el-timeline-item><el-timeline-item timestamp="状态复核" type="warning">资质：{{ currentRow.qualification }}，风险：{{ currentRow.risk }}</el-timeline-item><el-timeline-item timestamp="业务引用" type="success">同步排班、权限、工作身份和质控责任人范围</el-timeline-item></el-timeline></el-drawer>
  </section>
</template>
