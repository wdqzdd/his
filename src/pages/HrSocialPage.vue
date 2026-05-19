<script setup lang="ts">
import { computed, ref } from 'vue';
import { Search, User } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();
type Row = { id: string; name: string; activity: string; category: string; socialPost: string; date: string; role: string; hours: string; reviewStatus: string; owner: string; nextAction: string };
const selectedId = ref('HSA-001');
const activityDialogVisible = ref(false);
const reviewDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const rows: Row[] = [
  { id: 'HSA-001', name: '刘主任', activity: '世界肾脏日义诊', category: '社会活动', socialPost: '肾脏病学会委员', date: '2026-03-14', role: '专家', hours: '4小时', reviewStatus: '已归档', owner: '医务科', nextAction: '持续维护' },
  { id: 'HSA-002', name: '赵护士', activity: '透析患者宣教会', category: '社会活动', socialPost: '护理学会会员', date: '2026-04-10', role: '讲师', hours: '2小时', reviewStatus: '已归档', owner: '护理部', nextAction: '持续维护' },
  { id: 'HSA-003', name: '王护士长', activity: '院感督导日', category: '社会任职', socialPost: '护理专委会委员', date: '2026-04-18', role: '督导', hours: '3小时', reviewStatus: '待复核', owner: '护理部', nextAction: '补活动记录' },
  { id: 'HSA-004', name: '陈技师', activity: '设备应急演练', category: '社会活动', socialPost: '工程设备质控成员', date: '2026-04-25', role: '演练负责人', hours: '3小时', reviewStatus: '已归档', owner: '设备科', nextAction: '持续维护' },
  { id: 'HSA-005', name: '周药师', activity: '用药安全讲座', category: '社会任职', socialPost: '药学会血透用药委员', date: '2026-05-06', role: '讲师', hours: '2小时', reviewStatus: '待复核', owner: '药剂科', nextAction: '上传签到' },
  { id: 'HSA-006', name: '孙检验师', activity: '危急值流程培训', category: '社会活动', socialPost: '检验质控联络员', date: '2026-05-08', role: '讲师', hours: '1.5小时', reviewStatus: '已归档', owner: '检验科', nextAction: '持续维护' },
  { id: 'HSA-007', name: '李导诊', activity: '患者满意度回访', category: '社会活动', socialPost: '志愿服务队成员', date: '2026-05-09', role: '执行人', hours: '4小时', reviewStatus: '进行中', owner: '导诊台', nextAction: '完成回访' },
  { id: 'HSA-008', name: '马感控', activity: '手卫生宣传周', category: '社会任职', socialPost: '院感质控专家', date: '2026-05-10', role: '负责人', hours: '6小时', reviewStatus: '进行中', owner: '院感科', nextAction: '统计结果' },
  { id: 'HSA-009', name: '吴医生', activity: '新员工病例讨论', category: '社会活动', socialPost: '青年医师小组', date: '2026-05-12', role: '参与', hours: '2小时', reviewStatus: '待复核', owner: '医务科', nextAction: '带教确认' },
  { id: 'HSA-010', name: '郑护士', activity: '通路护理宣教', category: '社会活动', socialPost: '通路护理宣教员', date: '2026-05-13', role: '讲师', hours: '2小时', reviewStatus: '已归档', owner: '护理部', nextAction: '持续维护' },
];
const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['staff_social_position', 'staff_social_activity', 'activity_review_log', 'staff_profile', 'training_credit_record'];
const metrics = computed(() => [
  { label: '活动记录', value: rows.length, tone: 'blue' },
  { label: '已归档', value: rows.filter((item) => item.reviewStatus === '已归档').length, tone: 'green' },
  { label: '待复核', value: rows.filter((item) => item.reviewStatus === '待复核').length, tone: 'orange' },
  { label: '进行中', value: rows.filter((item) => item.reviewStatus === '进行中').length, tone: 'orange' },
  { label: '社会任职', value: rows.filter((item) => item.category === '社会任职').length, tone: 'green' },
]);
function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' { if (['已归档', '持续维护'].includes(value)) return 'success'; if (value.includes('待') || value.includes('进行') || value.includes('补') || value.includes('上传')) return 'warning'; return 'info'; }
function selectRow(row: Row): void { selectedId.value = row.id; }
function submitAction(message: string): void { ElMessage.success(message); }
</script>

<template>
  <section class="hr-page">
    <el-card class="hr-work-card" shadow="never">
      <template #header><div class="hr-header"><div><h2>{{ props.context.menuTitle }}</h2><p>记录义诊、宣教、院内督导和服务活动，作为培训学分、绩效和质控责任辅助依据。</p></div><div class="hr-actions"><el-button type="primary" :icon="User" @click="activityDialogVisible = true">新增活动</el-button><el-button @click="reviewDialogVisible = true">活动复核</el-button><el-button @click="traceDrawerVisible = true">活动追溯</el-button></div></div></template>
      <el-form class="hr-filter" inline><el-form-item label="关键字"><el-input placeholder="姓名、活动、类别、责任部门" clearable /></el-form-item><el-form-item label="活动类别"><el-select placeholder="全部类别" clearable><el-option label="公益义诊" value="公益义诊" /><el-option label="患者宣教" value="患者宣教" /><el-option label="院内活动" value="院内活动" /><el-option label="院感活动" value="院感活动" /></el-select></el-form-item><el-form-item label="复核"><el-select placeholder="全部状态" clearable><el-option label="已归档" value="已归档" /><el-option label="待复核" value="待复核" /><el-option label="进行中" value="进行中" /></el-select></el-form-item><el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item></el-form>
      <div class="hr-stat-grid"><el-card v-for="item in metrics" :key="item.label" :class="['hr-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>
      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow"><el-table-column prop="name" label="姓名" width="95" fixed="left" /><el-table-column prop="activity" label="活动" min-width="150" /><el-table-column prop="category" label="类别" width="100" /><el-table-column prop="socialPost" label="社会任职" min-width="130" /><el-table-column prop="date" label="日期" width="115" /><el-table-column prop="role" label="活动角色" width="110" /><el-table-column prop="hours" label="时长" width="80" /><el-table-column prop="reviewStatus" label="复核" width="95"><template #default="{ row }"><el-tag :type="tagType(row.reviewStatus)">{{ row.reviewStatus }}</el-tag></template></el-table-column><el-table-column prop="owner" label="责任部门" width="110" /><el-table-column prop="nextAction" label="下一步" min-width="120" /><el-table-column label="操作" width="220" fixed="right"><template #default="{ row }"><el-button link type="primary" @click.stop="selectRow(row); activityDialogVisible = true">活动</el-button><el-button link @click.stop="selectRow(row); reviewDialogVisible = true">复核</el-button><el-button link @click.stop="selectRow(row); traceDrawerVisible = true">追溯</el-button></template></el-table-column></el-table>
    </el-card>    <el-dialog v-model="activityDialogVisible" title="社会活动登记" width="640px"><el-form label-width="110px"><el-form-item label="人员"><el-input :model-value="currentRow.name" disabled /></el-form-item><el-form-item label="活动名称"><el-input :model-value="currentRow.activity" /></el-form-item><el-form-item label="类别"><el-select :model-value="currentRow.category"><el-option label="社会任职" value="社会任职" /><el-option label="社会活动" value="社会活动" /></el-select></el-form-item><el-form-item label="社会任职"><el-input :model-value="currentRow.socialPost" placeholder="学会、协会、质控组织任职" /></el-form-item><el-form-item label="活动说明"><el-input type="textarea" :rows="3" placeholder="记录活动地点、活动角色、任职证明、时长和佐证材料" /></el-form-item></el-form><template #footer><el-button @click="activityDialogVisible = false">取消</el-button><el-button type="primary" @click="activityDialogVisible = false; submitAction('社会活动已保存')">保存活动</el-button></template></el-dialog>
    <el-dialog v-model="reviewDialogVisible" title="社会活动复核" width="580px"><el-form label-width="110px"><el-form-item label="活动"><el-input :model-value="currentRow.activity" disabled /></el-form-item><el-form-item label="复核结论"><el-radio-group model-value="archive"><el-radio-button label="archive">归档</el-radio-button><el-radio-button label="supplement">补材料</el-radio-button><el-radio-button label="reject">退回</el-radio-button></el-radio-group></el-form-item><el-form-item label="复核意见"><el-input type="textarea" :rows="3" placeholder="记录签到、照片、时长和学分折算意见" /></el-form-item></el-form><template #footer><el-button @click="reviewDialogVisible = false">取消</el-button><el-button type="primary" @click="reviewDialogVisible = false; submitAction('社会活动复核已提交')">提交复核</el-button></template></el-dialog>
    <el-drawer v-model="traceDrawerVisible" title="社会活动追溯" size="520px"><el-timeline><el-timeline-item timestamp="活动登记">活动：{{ currentRow.activity }}</el-timeline-item><el-timeline-item timestamp="佐证复核" type="warning">复核：{{ currentRow.reviewStatus }}，下一步：{{ currentRow.nextAction }}</el-timeline-item><el-timeline-item timestamp="归档输出" type="success">写入学分、绩效和员工档案</el-timeline-item></el-timeline></el-drawer>
  </section>
</template>
