<script setup lang="ts">
import { computed, ref } from 'vue';
import { Files, Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();
type Row = { id: string; name: string; position: string; org: string; startDate: string; endDate: string; workType: string; dutyRecord: string; adminMeeting: string; verifyStatus: string; owner: string; nextAction: string };
const selectedId = ref('HW-001');
const workDialogVisible = ref(false);
const verifyDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const rows: Row[] = [
  { id: 'HW-001', name: '刘主任', position: '主诊医生', org: '血液净化中心', startDate: '2018-01-01', endDate: '至今', workType: '任职职务', dutyRecord: '主诊医生聘任', adminMeeting: '科务会2026-05', verifyStatus: '已核验', owner: '医务科', nextAction: '持续维护' },
  { id: 'HW-002', name: '赵护士', position: '责任护士', org: 'A护理组', startDate: '2020-03-01', endDate: '至今', workType: '入职离职', dutyRecord: '入职记录已归档', adminMeeting: '无', verifyStatus: '已核验', owner: '护理部', nextAction: '持续维护' },
  { id: 'HW-003', name: '王护士长', position: '护士长', org: '护理管理', startDate: '2016-05-01', endDate: '至今', workType: '行政任职', dutyRecord: '护理组长任职', adminMeeting: '护理行政会2026-04', verifyStatus: '已核验', owner: '护理部', nextAction: '持续维护' },
  { id: 'HW-004', name: '陈技师', position: '设备技师', org: '工程设备组', startDate: '2019-07-01', endDate: '至今', workType: '任职职务', dutyRecord: '设备安全员', adminMeeting: '设备质控会2026-05', verifyStatus: '已核验', owner: '设备科', nextAction: '持续维护' },
  { id: 'HW-005', name: '周药师', position: '药师', org: '药房', startDate: '2021-02-01', endDate: '至今', workType: '行政任职', dutyRecord: '研究药物管理员', adminMeeting: 'GCP启动会2026-05', verifyStatus: '已核验', owner: '药剂科', nextAction: '持续维护' },
  { id: 'HW-006', name: '孙检验师', position: '检验技师', org: '检验科', startDate: '2022-09-01', endDate: '至今', workType: '入职离职', dutyRecord: '检验岗位入职', adminMeeting: '危急值培训会', verifyStatus: '待核验', owner: '检验科', nextAction: '补工作证明' },
  { id: 'HW-007', name: '李导诊', position: '导诊客服', org: '导诊客服组', startDate: '2023-01-15', endDate: '至今', workType: '任职职务', dutyRecord: '服务专员', adminMeeting: '服务改进会2026-05', verifyStatus: '已核验', owner: '导诊台', nextAction: '持续维护' },
  { id: 'HW-008', name: '马感控', position: '感控专员', org: '院感科', startDate: '2020-11-01', endDate: '至今', workType: '行政任职', dutyRecord: '感控督导返聘', adminMeeting: '感控委员会2026-05', verifyStatus: '已核验', owner: '院感科', nextAction: '持续维护' },
  { id: 'HW-009', name: '吴医生', position: '住院医师', org: '血液净化中心', startDate: '2026-04-01', endDate: '至今', workType: '入职离职', dutyRecord: '试用入职', adminMeeting: '带教会议待补', verifyStatus: '待核验', owner: '医务科', nextAction: '试用期考核' },
  { id: 'HW-010', name: '郑护士', position: '穿刺护士', org: 'B护理组', startDate: '2019-10-01', endDate: '至今', workType: '行政任职', dutyRecord: '穿刺带教离任', adminMeeting: '护理交接会2026-05', verifyStatus: '已核验', owner: '护理部', nextAction: '证书续期' },
];
const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['staff_employment_record', 'staff_position_record', 'staff_admin_post_record', 'staff_admin_meeting', 'work_experience_verify', 'staff_authorization'];
const metrics = computed(() => [
  { label: '经历记录', value: rows.length, tone: 'blue' },
  { label: '已核验', value: rows.filter((item) => item.verifyStatus === '已核验').length, tone: 'green' },
  { label: '待核验', value: rows.filter((item) => item.verifyStatus === '待核验').length, tone: 'orange' },
  { label: '行政任职', value: rows.filter((item) => item.workType === '行政任职').length, tone: 'green' },
  { label: '需处理', value: rows.filter((item) => item.nextAction !== '持续维护').length, tone: 'red' },
]);
function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' { if (['已核验', '持续维护'].includes(value) || value.includes('血透')) return 'success'; if (value.includes('待') || value.includes('补') || value.includes('考核') || value.includes('续期')) return 'warning'; return 'info'; }
function selectRow(row: Row): void { selectedId.value = row.id; }
function submitAction(message: string): void { ElMessage.success(message); }
</script>

<template>
  <section class="hr-page">
    <el-card class="hr-work-card" shadow="never">
      <template #header><div class="hr-header"><div><h2>{{ props.context.menuTitle }}</h2><p>维护员工工作经历、血透相关经验和核验状态，用于岗位授权、排班资格和质控责任人范围判断。</p></div><div class="hr-actions"><el-button type="primary" :icon="Files" @click="workDialogVisible = true">新增经历</el-button><el-button @click="verifyDialogVisible = true">经历核验</el-button><el-button @click="traceDrawerVisible = true">经历追溯</el-button></div></div></template>
      <el-form class="hr-filter" inline><el-form-item label="关键字"><el-input placeholder="姓名、岗位、机构、会议、任职记录" clearable /></el-form-item><el-form-item label="记录类型"><el-select placeholder="全部类型" clearable><el-option label="入职离职" value="入职离职" /><el-option label="任职职务" value="任职职务" /><el-option label="行政任职" value="行政任职" /><el-option label="行政会议" value="行政会议" /></el-select></el-form-item><el-form-item label="核验"><el-select placeholder="全部状态" clearable><el-option label="已核验" value="已核验" /><el-option label="待核验" value="待核验" /></el-select></el-form-item><el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item></el-form>
      <div class="hr-stat-grid"><el-card v-for="item in metrics" :key="item.label" :class="['hr-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>
      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow"><el-table-column prop="name" label="姓名" width="95" fixed="left" /><el-table-column prop="position" label="岗位" width="120" /><el-table-column prop="org" label="工作机构/组别" min-width="140" /><el-table-column prop="startDate" label="开始日期" width="115" /><el-table-column prop="endDate" label="结束日期" width="90" /><el-table-column prop="workType" label="记录类型" width="105" /><el-table-column prop="dutyRecord" label="任职/入离职记录" min-width="135" /><el-table-column prop="adminMeeting" label="行政会议" min-width="130" /><el-table-column prop="verifyStatus" label="核验" width="95"><template #default="{ row }"><el-tag :type="tagType(row.verifyStatus)">{{ row.verifyStatus }}</el-tag></template></el-table-column><el-table-column prop="owner" label="责任部门" width="110" /><el-table-column prop="nextAction" label="下一步" min-width="120" /><el-table-column label="操作" width="220" fixed="right"><template #default="{ row }"><el-button link type="primary" @click.stop="selectRow(row); workDialogVisible = true">编辑</el-button><el-button link @click.stop="selectRow(row); verifyDialogVisible = true">核验</el-button><el-button link @click.stop="selectRow(row); traceDrawerVisible = true">追溯</el-button></template></el-table-column></el-table>
    </el-card>    <el-dialog v-model="workDialogVisible" title="工作经历维护" width="680px"><el-form label-width="110px"><el-form-item label="员工"><el-input :model-value="currentRow.name" disabled /></el-form-item><el-form-item label="记录类型"><el-select :model-value="currentRow.workType"><el-option label="入职离职" value="入职离职" /><el-option label="任职职务" value="任职职务" /><el-option label="行政任职" value="行政任职" /><el-option label="行政会议" value="行政会议" /></el-select></el-form-item><el-form-item label="岗位"><el-input :model-value="currentRow.position" /></el-form-item><el-form-item label="机构/组别"><el-input :model-value="currentRow.org" /></el-form-item><el-form-item label="任职记录"><el-input :model-value="currentRow.dutyRecord" /></el-form-item><el-form-item label="行政会议"><el-input :model-value="currentRow.adminMeeting" placeholder="会议名称、日期、纪要附件" /></el-form-item><el-form-item label="任职日期"><el-date-picker type="daterange" start-placeholder="开始" end-placeholder="结束" /></el-form-item><el-form-item label="经历说明"><el-input type="textarea" :rows="3" placeholder="记录岗位职责、会议决议、交接要求和证明材料" /></el-form-item></el-form><template #footer><el-button @click="workDialogVisible = false">取消</el-button><el-button type="primary" @click="workDialogVisible = false; submitAction('工作经历已保存')">保存经历</el-button></template></el-dialog>
    <el-dialog v-model="verifyDialogVisible" title="工作经历核验" width="580px"><el-form label-width="110px"><el-form-item label="经历"><el-input :model-value="`${currentRow.name} / ${currentRow.workType}`" disabled /></el-form-item><el-form-item label="核验结论"><el-radio-group model-value="pass"><el-radio-button label="pass">通过</el-radio-button><el-radio-button label="supplement">补材料</el-radio-button><el-radio-button label="reject">不通过</el-radio-button></el-radio-group></el-form-item><el-form-item label="核验意见"><el-input type="textarea" :rows="3" placeholder="记录核验材料、经验年限和授权影响" /></el-form-item></el-form><template #footer><el-button @click="verifyDialogVisible = false">取消</el-button><el-button type="primary" @click="verifyDialogVisible = false; submitAction('工作经历核验已保存')">提交核验</el-button></template></el-dialog>
    <el-drawer v-model="traceDrawerVisible" title="工作经历追溯" size="520px"><el-timeline><el-timeline-item timestamp="记录录入">员工：{{ currentRow.name }}，类型：{{ currentRow.workType }}</el-timeline-item><el-timeline-item timestamp="任职/会议">任职：{{ currentRow.dutyRecord }}；会议：{{ currentRow.adminMeeting }}</el-timeline-item><el-timeline-item timestamp="核验处理" type="warning">状态：{{ currentRow.verifyStatus }}，下一步：{{ currentRow.nextAction }}</el-timeline-item><el-timeline-item timestamp="业务引用" type="success">进入岗位授权和排班资格校验</el-timeline-item></el-timeline></el-drawer>
  </section>
</template>
