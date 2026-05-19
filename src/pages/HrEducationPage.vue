<script setup lang="ts">
import { computed, ref } from 'vue';
import { Reading, Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();
type Row = { id: string; name: string; course: string; category: string; learningType: string; date: string; completion: string; score: string; status: string; owner: string; nextAction: string };
const selectedId = ref('HE-001');
const educationDialogVisible = ref(false);
const examDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const rows: Row[] = [
  { id: 'HE-001', name: '刘主任', course: '血液净化SOP年度培训', category: '专科培训', learningType: '培训进修', date: '2026-05-20', completion: '已完成', score: '96', status: '达标', owner: '医务科', nextAction: '持续维护' },
  { id: 'HE-002', name: '赵护士', course: '透析护理安全培训', category: '护理培训', learningType: '培训进修', date: '2026-05-20', completion: '已完成', score: '94', status: '达标', owner: '护理部', nextAction: '持续维护' },
  { id: 'HE-003', name: '王护士长', course: '院感与隔离透析培训', category: '感控培训', learningType: '培训进修', date: '2026-05-22', completion: '待复训', score: '待考试', status: '待达标', owner: '护理部', nextAction: '安排复训' },
  { id: 'HE-004', name: '陈技师', course: '设备水处理应急演练', category: '设备培训', learningType: '培训进修', date: '2026-05-28', completion: '待开始', score: '待考试', status: '待达标', owner: '设备科', nextAction: '参加演练' },
  { id: 'HE-005', name: '周药师', course: '透析用药适宜性培训', category: '药事培训', learningType: '学术会议', date: '2026-05-18', completion: '已完成', score: '92', status: '达标', owner: '药剂科', nextAction: '持续维护' },
  { id: 'HE-006', name: '孙检验师', course: '危急值上报培训', category: '检验培训', learningType: '培训进修', date: '2026-05-19', completion: '待考试', score: '待考试', status: '待达标', owner: '检验科', nextAction: '完成考试' },
  { id: 'HE-007', name: '李导诊', course: '患者接入与隐私培训', category: '服务培训', learningType: '学习经历', date: '2026-05-17', completion: '已完成', score: '90', status: '达标', owner: '导诊台', nextAction: '持续维护' },
  { id: 'HE-008', name: '马感控', course: '手卫生督导培训', category: '感控培训', learningType: '学术会议', date: '2026-05-16', completion: '已完成', score: '98', status: '达标', owner: '院感科', nextAction: '持续维护' },
  { id: 'HE-009', name: '吴医生', course: '新员工血透准入培训', category: '准入培训', learningType: '学习经历', date: '2026-05-24', completion: '待完成', score: '待考试', status: '限制排班', owner: '医务科', nextAction: '完成准入' },
  { id: 'HE-010', name: '郑护士', course: '血管通路穿刺复训', category: '护理培训', learningType: '培训进修', date: '2026-05-25', completion: '待复训', score: '待考试', status: '待达标', owner: '护理部', nextAction: '安排复训' },
];
const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['staff_education_record', 'staff_training_record', 'staff_academic_meeting', 'training_plan', 'training_exam_result', 'staff_authorization'];
const metrics = computed(() => [
  { label: '学习记录', value: rows.length, tone: 'blue' },
  { label: '达标', value: rows.filter((item) => item.status === '达标').length, tone: 'green' },
  { label: '待达标', value: rows.filter((item) => item.status === '待达标').length, tone: 'orange' },
  { label: '限制排班', value: rows.filter((item) => item.status === '限制排班').length, tone: 'red' },
  { label: '待考试', value: rows.filter((item) => item.score === '待考试').length, tone: 'orange' },
]);
function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' { if (['达标', '已完成', '持续维护'].includes(value)) return 'success'; if (value === '限制排班') return 'danger'; if (value.includes('待') || value.includes('复训') || value.includes('考试')) return 'warning'; return 'info'; }
function selectRow(row: Row): void { selectedId.value = row.id; }
function submitAction(message: string): void { ElMessage.success(message); }
</script>

<template>
  <section class="hr-page">
    <el-card class="hr-work-card" shadow="never">
      <template #header><div class="hr-header"><div><h2>{{ props.context.menuTitle }}</h2><p>管理员工学习培训、考试成绩和达标状态，未达标人员会影响排班资格、岗位授权和质量整改责任。</p></div><div class="hr-actions"><el-button type="primary" :icon="Reading" @click="educationDialogVisible = true">新增学习</el-button><el-button @click="examDialogVisible = true">考试登记</el-button><el-button @click="traceDrawerVisible = true">学习追溯</el-button></div></div></template>
      <el-form class="hr-filter" inline><el-form-item label="关键字"><el-input placeholder="姓名、课程、类别、责任部门" clearable /></el-form-item><el-form-item label="培训类别"><el-select placeholder="全部类别" clearable><el-option label="专科培训" value="专科培训" /><el-option label="护理培训" value="护理培训" /><el-option label="感控培训" value="感控培训" /><el-option label="设备培训" value="设备培训" /></el-select></el-form-item><el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="达标" value="达标" /><el-option label="待达标" value="待达标" /><el-option label="限制排班" value="限制排班" /></el-select></el-form-item><el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item></el-form>
      <div class="hr-stat-grid"><el-card v-for="item in metrics" :key="item.label" :class="['hr-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>
      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow"><el-table-column prop="name" label="姓名" width="95" fixed="left" /><el-table-column prop="course" label="课程/会议" min-width="170" /><el-table-column prop="learningType" label="学习类型" width="105" /><el-table-column prop="category" label="类别" width="105" /><el-table-column prop="date" label="日期" width="115" /><el-table-column prop="completion" label="完成情况" width="100"><template #default="{ row }"><el-tag :type="tagType(row.completion)" effect="plain">{{ row.completion }}</el-tag></template></el-table-column><el-table-column prop="score" label="成绩" width="90" /><el-table-column prop="status" label="状态" width="100"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column><el-table-column prop="owner" label="责任部门" width="110" /><el-table-column prop="nextAction" label="下一步" min-width="120" /><el-table-column label="操作" width="220" fixed="right"><template #default="{ row }"><el-button link type="primary" @click.stop="selectRow(row); educationDialogVisible = true">学习</el-button><el-button link @click.stop="selectRow(row); examDialogVisible = true">考试</el-button><el-button link @click.stop="selectRow(row); traceDrawerVisible = true">追溯</el-button></template></el-table-column></el-table>
    </el-card>    <el-dialog v-model="educationDialogVisible" title="学习经历维护" width="660px"><el-form label-width="110px"><el-form-item label="员工"><el-input :model-value="currentRow.name" disabled /></el-form-item><el-form-item label="学习类型"><el-select :model-value="currentRow.learningType"><el-option label="学习经历" value="学习经历" /><el-option label="培训进修" value="培训进修" /><el-option label="学术会议" value="学术会议" /></el-select></el-form-item><el-form-item label="课程/会议"><el-input :model-value="currentRow.course" /></el-form-item><el-form-item label="培训类别"><el-select :model-value="currentRow.category"><el-option label="专科培训" value="专科培训" /><el-option label="护理培训" value="护理培训" /><el-option label="感控培训" value="感控培训" /><el-option label="设备培训" value="设备培训" /><el-option label="学术会议" value="学术会议" /></el-select></el-form-item><el-form-item label="学习情况"><el-radio-group model-value="done"><el-radio-button label="done">已完成</el-radio-button><el-radio-button label="pending">待完成</el-radio-button><el-radio-button label="retrain">需复训</el-radio-button></el-radio-group></el-form-item><el-form-item label="说明"><el-input type="textarea" :rows="3" placeholder="记录学习方式、会议地点、课时、证明材料和补训要求" /></el-form-item></el-form><template #footer><el-button @click="educationDialogVisible = false">取消</el-button><el-button type="primary" @click="educationDialogVisible = false; submitAction('学习经历已保存')">保存学习</el-button></template></el-dialog>
    <el-dialog v-model="examDialogVisible" title="考试与达标登记" width="580px"><el-form label-width="110px"><el-form-item label="课程"><el-input :model-value="currentRow.course" disabled /></el-form-item><el-form-item label="成绩"><el-input placeholder="输入考试成绩或通过结论" /></el-form-item><el-form-item label="达标结论"><el-radio-group model-value="pass"><el-radio-button label="pass">达标</el-radio-button><el-radio-button label="retrain">复训</el-radio-button><el-radio-button label="limit">限制排班</el-radio-button></el-radio-group></el-form-item><el-form-item label="意见"><el-input type="textarea" :rows="3" placeholder="记录考试方式、阅卷人、达标标准和授权影响" /></el-form-item></el-form><template #footer><el-button @click="examDialogVisible = false">取消</el-button><el-button type="primary" @click="examDialogVisible = false; submitAction('考试达标结果已保存')">提交结果</el-button></template></el-dialog>
    <el-drawer v-model="traceDrawerVisible" title="学习培训追溯" size="520px"><el-timeline><el-timeline-item timestamp="培训计划">课程：{{ currentRow.course }}</el-timeline-item><el-timeline-item timestamp="学习考试" type="warning">完成：{{ currentRow.completion }}，成绩：{{ currentRow.score }}</el-timeline-item><el-timeline-item timestamp="业务输出" type="success">达标状态同步岗位授权和排班资格</el-timeline-item></el-timeline></el-drawer>
  </section>
</template>
