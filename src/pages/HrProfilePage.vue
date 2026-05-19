<script setup lang="ts">
import { computed, ref } from 'vue';
import { Search, User } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();
type Row = {
  id: string;
  name: string;
  sex: string;
  phone: string;
  idNo: string;
  emergency: string;
  address: string;
  resumeStatus: string;
  practiceRecord: string;
  currentPost: string;
  profileStatus: string;
  owner: string;
  nextAction: string;
};
const selectedId = ref('HP-001');
const profileDialogVisible = ref(false);
const privacyDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const rows: Row[] = [
  { id: 'HP-001', name: '刘主任', sex: '男', phone: '13800010001', idNo: '已核验', emergency: '刘女士', address: '本市', resumeStatus: '已归档', practiceRecord: '医生执业有效', currentPost: '主诊医生/科室副主任', profileStatus: '完整', owner: '行政人事', nextAction: '持续维护' },
  { id: 'HP-002', name: '赵护士', sex: '女', phone: '13800010002', idNo: '已核验', emergency: '赵先生', address: '本市', resumeStatus: '已归档', practiceRecord: '护士执业有效', currentPost: '责任护士/A护理组', profileStatus: '完整', owner: '护理部', nextAction: '持续维护' },
  { id: 'HP-003', name: '王护士长', sex: '女', phone: '13800010003', idNo: '已核验', emergency: '王先生', address: '本市', resumeStatus: '已归档', practiceRecord: '护士执业有效', currentPost: '护士长/护理管理', profileStatus: '完整', owner: '护理部', nextAction: '持续维护' },
  { id: 'HP-004', name: '陈技师', sex: '男', phone: '13800010004', idNo: '已核验', emergency: '陈女士', address: '本市', resumeStatus: '已归档', practiceRecord: '设备岗位备案', currentPost: '设备技师/设备安全员', profileStatus: '完整', owner: '设备科', nextAction: '持续维护' },
  { id: 'HP-005', name: '周药师', sex: '女', phone: '13800010005', idNo: '已核验', emergency: '周先生', address: '本市', resumeStatus: '已归档', practiceRecord: '药师执业有效', currentPost: '药师/研究药物管理员', profileStatus: '完整', owner: '药剂科', nextAction: '持续维护' },
  { id: 'HP-006', name: '孙检验师', sex: '男', phone: '13800010006', idNo: '待核验', emergency: '孙女士', address: '本市', resumeStatus: '待补简历', practiceRecord: '检验资格待复核', currentPost: '检验技师/危急值联络员', profileStatus: '待补全', owner: '检验科', nextAction: '补身份证核验' },
  { id: 'HP-007', name: '李导诊', sex: '女', phone: '13800010007', idNo: '已核验', emergency: '李先生', address: '本市', resumeStatus: '已归档', practiceRecord: '服务岗位备案', currentPost: '导诊客服/服务专员', profileStatus: '完整', owner: '导诊台', nextAction: '持续维护' },
  { id: 'HP-008', name: '马感控', sex: '女', phone: '13800010008', idNo: '已核验', emergency: '马先生', address: '本市', resumeStatus: '已归档', practiceRecord: '感控岗位备案', currentPost: '感控专员/感控督导', profileStatus: '完整', owner: '院感科', nextAction: '持续维护' },
  { id: 'HP-009', name: '吴医生', sex: '男', phone: '13800010009', idNo: '待核验', emergency: '吴女士', address: '外市', resumeStatus: '待补简历', practiceRecord: '医生执业待转入', currentPost: '住院医师/试用', profileStatus: '待补全', owner: '医务科', nextAction: '补联系方式' },
  { id: 'HP-010', name: '郑护士', sex: '女', phone: '13800010010', idNo: '已核验', emergency: '郑先生', address: '本市', resumeStatus: '已归档', practiceRecord: '护士执业有效', currentPost: '穿刺护士/穿刺带教', profileStatus: '完整', owner: '护理部', nextAction: '持续维护' },
];
const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['staff_profile', 'staff_resume', 'staff_practice_record', 'staff_position_record', 'staff_contact', 'staff_privacy_audit', 'sys_audit_log'];
const metrics = computed(() => [
  { label: '基础资料', value: rows.length, tone: 'blue' },
  { label: '完整', value: rows.filter((item) => item.profileStatus === '完整').length, tone: 'green' },
  { label: '待补全', value: rows.filter((item) => item.profileStatus === '待补全').length, tone: 'orange' },
  { label: '待核验', value: rows.filter((item) => item.idNo === '待核验').length, tone: 'red' },
  { label: '执业待复核', value: rows.filter((item) => item.practiceRecord.includes('待')).length, tone: 'orange' },
]);
function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' { if (['完整', '已核验', '持续维护'].includes(value)) return 'success'; if (value.includes('待') || value.includes('补')) return 'warning'; return 'info'; }
function selectRow(row: Row): void { selectedId.value = row.id; }
function submitAction(message: string): void { ElMessage.success(message); }
</script>

<template>
  <section class="hr-page">
    <el-card class="hr-work-card" shadow="never">
      <template #header><div class="hr-header"><div><h2>{{ props.context.menuTitle }}</h2><p>维护员工身份、联系方式、紧急联系人和资料完整性，敏感信息访问进入审计。</p></div><div class="hr-actions"><el-button type="primary" :icon="User" @click="profileDialogVisible = true">维护基本信息</el-button><el-button @click="privacyDialogVisible = true">敏感信息授权</el-button><el-button @click="traceDrawerVisible = true">资料追溯</el-button></div></div></template>
      <el-form class="hr-filter" inline><el-form-item label="关键字"><el-input placeholder="姓名、电话、联系人、责任部门" clearable /></el-form-item><el-form-item label="资料状态"><el-select placeholder="全部状态" clearable><el-option label="完整" value="完整" /><el-option label="待补全" value="待补全" /></el-select></el-form-item><el-form-item label="身份核验"><el-select placeholder="全部" clearable><el-option label="已核验" value="已核验" /><el-option label="待核验" value="待核验" /></el-select></el-form-item><el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item></el-form>
      <div class="hr-stat-grid"><el-card v-for="item in metrics" :key="item.label" :class="['hr-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>
      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow"><el-table-column prop="name" label="姓名" width="95" fixed="left" /><el-table-column prop="sex" label="性别" width="70" /><el-table-column prop="phone" label="联系电话" width="125" /><el-table-column prop="idNo" label="身份核验" width="100"><template #default="{ row }"><el-tag :type="tagType(row.idNo)">{{ row.idNo }}</el-tag></template></el-table-column><el-table-column prop="resumeStatus" label="个人简历" width="100"><template #default="{ row }"><el-tag :type="tagType(row.resumeStatus)" effect="plain">{{ row.resumeStatus }}</el-tag></template></el-table-column><el-table-column prop="practiceRecord" label="医护执业记录" min-width="135"><template #default="{ row }"><el-tag :type="tagType(row.practiceRecord)" effect="plain">{{ row.practiceRecord }}</el-tag></template></el-table-column><el-table-column prop="currentPost" label="当前任职信息" min-width="150" /><el-table-column prop="emergency" label="紧急联系人" width="110" /><el-table-column prop="profileStatus" label="资料状态" width="100"><template #default="{ row }"><el-tag :type="tagType(row.profileStatus)">{{ row.profileStatus }}</el-tag></template></el-table-column><el-table-column prop="owner" label="责任部门" width="110" /><el-table-column prop="nextAction" label="下一步" min-width="120" /><el-table-column label="操作" width="220" fixed="right"><template #default="{ row }"><el-button link type="primary" @click.stop="selectRow(row); profileDialogVisible = true">维护</el-button><el-button link @click.stop="selectRow(row); privacyDialogVisible = true">授权</el-button><el-button link @click.stop="selectRow(row); traceDrawerVisible = true">追溯</el-button></template></el-table-column></el-table>
    </el-card>    <el-dialog v-model="profileDialogVisible" title="员工基本信息维护" width="720px"><el-form label-width="120px"><el-form-item label="姓名"><el-input :model-value="currentRow.name" /></el-form-item><el-form-item label="联系电话"><el-input :model-value="currentRow.phone" /></el-form-item><el-form-item label="紧急联系人"><el-input :model-value="currentRow.emergency" /></el-form-item><el-form-item label="个人简历"><el-input :model-value="currentRow.resumeStatus" placeholder="简历摘要、起止经历、附件状态" /></el-form-item><el-form-item label="执业记录"><el-input :model-value="currentRow.practiceRecord" placeholder="医生执业记录或护士执业记录" /></el-form-item><el-form-item label="当前任职"><el-input :model-value="currentRow.currentPost" placeholder="当前岗位、行政任职、护理组/专家团队任职" /></el-form-item><el-form-item label="身份核验"><el-radio-group model-value="verified"><el-radio-button label="verified">已核验</el-radio-button><el-radio-button label="pending">待核验</el-radio-button></el-radio-group></el-form-item><el-form-item label="维护说明"><el-input type="textarea" :rows="3" placeholder="记录资料来源、核验方式、执业记录来源和任职生效时间" /></el-form-item></el-form><template #footer><el-button @click="profileDialogVisible = false">取消</el-button><el-button type="primary" @click="profileDialogVisible = false; submitAction('员工基本信息已保存')">保存</el-button></template></el-dialog>
    <el-dialog v-model="privacyDialogVisible" title="敏感信息访问授权" width="580px"><el-form label-width="110px"><el-form-item label="员工"><el-input :model-value="currentRow.name" disabled /></el-form-item><el-form-item label="访问范围"><el-checkbox-group><el-checkbox label="身份证号" /><el-checkbox label="联系方式" /><el-checkbox label="住址" /><el-checkbox label="紧急联系人" /></el-checkbox-group></el-form-item><el-form-item label="授权原因"><el-input type="textarea" :rows="3" placeholder="记录访问目的、授权人和有效时间" /></el-form-item></el-form><template #footer><el-button @click="privacyDialogVisible = false">取消</el-button><el-button type="primary" @click="privacyDialogVisible = false; submitAction('敏感信息访问授权已记录')">提交授权</el-button></template></el-dialog>
    <el-drawer v-model="traceDrawerVisible" title="基本信息追溯" size="520px"><el-timeline><el-timeline-item timestamp="资料建档">员工：{{ currentRow.name }}</el-timeline-item><el-timeline-item timestamp="简历与执业" type="warning">简历：{{ currentRow.resumeStatus }}；执业：{{ currentRow.practiceRecord }}</el-timeline-item><el-timeline-item timestamp="当前任职">任职：{{ currentRow.currentPost }}</el-timeline-item><el-timeline-item timestamp="审计输出" type="success">敏感信息访问、执业核验和任职变更写入审计日志</el-timeline-item></el-timeline></el-drawer>
  </section>
</template>
