<script setup lang="ts">
import { computed, ref } from 'vue';
import { Files, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();
type Row = { id: string; name: string; certificate: string; certType: string; certNo: string; expireDate: string; status: string; owner: string; nextAction: string };
const selectedId = ref('HC-001');
const certDialogVisible = ref(false);
const renewDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const rows: Row[] = [
  { id: 'HC-001', name: '刘主任', certificate: '博士学历证书', certType: '学历证书', certNo: 'EDU-2026-001', expireDate: '长期', status: '有效', owner: '行政人事', nextAction: '持续维护' },
  { id: 'HC-002', name: '赵护士', certificate: '护理学学位证书', certType: '学位证书', certNo: 'DEG-2026-002', expireDate: '长期', status: '有效', owner: '护理部', nextAction: '持续维护' },
  { id: 'HC-003', name: '王护士长', certificate: '血透专科证书', certType: '职业资格证书', certNo: 'HDN-2026-003', expireDate: '2026-06-30', status: '临期', owner: '护理部', nextAction: '证书续期' },
  { id: 'HC-004', name: '陈技师', certificate: '医师执业证', certType: '执业证书', certNo: 'DOC-2026-004', expireDate: '2027-08-31', status: '有效', owner: '医务科', nextAction: '持续维护' },
  { id: 'HC-005', name: '周药师', certificate: '研究药物管理员聘书', certType: '任职聘书', certNo: 'APP-2026-005', expireDate: '2028-05-31', status: '有效', owner: '药剂科', nextAction: '持续维护' },
  { id: 'HC-006', name: '孙检验师', certificate: '中级检验师职称证书', certType: '职称证书', certNo: 'TITLE-2026-006', expireDate: '2026-07-15', status: '临期', owner: '检验科', nextAction: '证书续期' },
  { id: 'HC-007', name: '钱CRC', certificate: 'GCP培训证书', certType: '培训证书', certNo: 'GCP-2026-007', expireDate: '2027-03-31', status: '有效', owner: 'GCP中心', nextAction: '持续维护' },
  { id: 'HC-008', name: '马感控', certificate: '返聘用工合同', certType: '用工合同', certNo: 'LABOR-2026-008', expireDate: '2027-01-31', status: '有效', owner: '行政人事', nextAction: '持续维护' },
  { id: 'HC-009', name: '吴医生', certificate: '血透准入获奖证书', certType: '获奖证书', certNo: '待生成', expireDate: '待考核', status: '待取得', owner: '医务科', nextAction: '完成准入考核' },
  { id: 'HC-010', name: '郑护士', certificate: '优秀穿刺护士荣誉证书', certType: '荣誉证书', certNo: 'HONOR-2026-010', expireDate: '2026-05-30', status: '即将到期', owner: '护理部', nextAction: '证书续期' },
];
const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['staff_certificate', 'certificate_attachment', 'certificate_renewal_record', 'staff_authorization', 'certificate_audit_log'];
const metrics = computed(() => [
  { label: '证书记录', value: rows.length, tone: 'blue' },
  { label: '有效', value: rows.filter((item) => item.status === '有效').length, tone: 'green' },
  { label: '临期', value: rows.filter((item) => item.status === '临期').length, tone: 'orange' },
  { label: '即将到期/待取得', value: rows.filter((item) => item.status !== '有效' && item.status !== '临期').length, tone: 'red' },
  { label: '合同/聘书', value: rows.filter((item) => item.certType === '用工合同' || item.certType === '任职聘书').length, tone: 'green' },
]);
function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' { if (['有效', '持续维护'].includes(value)) return 'success'; if (value.includes('到期') || value.includes('待取得')) return 'danger'; if (value.includes('临期') || value.includes('续期') || value.includes('考核')) return 'warning'; return 'info'; }
function selectRow(row: Row): void { selectedId.value = row.id; }
function submitAction(message: string): void { ElMessage.success(message); }
</script>

<template>
  <section class="hr-page">
    <el-card class="hr-work-card" shadow="never">
      <template #header><div class="hr-header"><div><h2>{{ props.context.menuTitle }}</h2><p>维护执业证、专科证、岗位证和 GCP 证书，有效期影响岗位授权、排班资格和研究授权。</p></div><div class="hr-actions"><el-button type="primary" :icon="Files" @click="certDialogVisible = true">新增证书</el-button><el-button :icon="Warning" @click="renewDialogVisible = true">证书续期</el-button><el-button @click="traceDrawerVisible = true">证书追溯</el-button></div></div></template>
      <el-form class="hr-filter" inline><el-form-item label="关键字"><el-input placeholder="姓名、证书、编号、责任部门" clearable /></el-form-item><el-form-item label="证书类型"><el-select placeholder="全部类型" clearable><el-option label="学历证书" value="学历证书" /><el-option label="学位证书" value="学位证书" /><el-option label="职业资格证书" value="职业资格证书" /><el-option label="执业证书" value="执业证书" /><el-option label="任职聘书" value="任职聘书" /><el-option label="职称证书" value="职称证书" /><el-option label="培训证书" value="培训证书" /><el-option label="用工合同" value="用工合同" /><el-option label="获奖证书" value="获奖证书" /><el-option label="荣誉证书" value="荣誉证书" /></el-select></el-form-item><el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="有效" value="有效" /><el-option label="临期" value="临期" /><el-option label="即将到期" value="即将到期" /><el-option label="待取得" value="待取得" /></el-select></el-form-item><el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item></el-form>
      <div class="hr-stat-grid"><el-card v-for="item in metrics" :key="item.label" :class="['hr-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>
      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow"><el-table-column prop="name" label="姓名" width="95" fixed="left" /><el-table-column prop="certificate" label="证书" min-width="140" /><el-table-column prop="certType" label="类型" width="100" /><el-table-column prop="certNo" label="证书编号" width="130" /><el-table-column prop="expireDate" label="有效期至" width="115" /><el-table-column prop="status" label="状态" width="105"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column><el-table-column prop="owner" label="责任部门" width="110" /><el-table-column prop="nextAction" label="下一步" min-width="120" /><el-table-column label="操作" width="220" fixed="right"><template #default="{ row }"><el-button link type="primary" @click.stop="selectRow(row); certDialogVisible = true">维护</el-button><el-button link @click.stop="selectRow(row); renewDialogVisible = true">续期</el-button><el-button link @click.stop="selectRow(row); traceDrawerVisible = true">追溯</el-button></template></el-table-column></el-table>
    </el-card>    <el-dialog v-model="certDialogVisible" title="证件证书维护" width="660px"><el-form label-width="110px"><el-form-item label="员工"><el-input :model-value="currentRow.name" disabled /></el-form-item><el-form-item label="证书名称"><el-input :model-value="currentRow.certificate" /></el-form-item><el-form-item label="证书类型"><el-select :model-value="currentRow.certType"><el-option label="学历证书" value="学历证书" /><el-option label="学位证书" value="学位证书" /><el-option label="职业资格证书" value="职业资格证书" /><el-option label="执业证书" value="执业证书" /><el-option label="任职聘书" value="任职聘书" /><el-option label="职称证书" value="职称证书" /><el-option label="培训证书" value="培训证书" /><el-option label="用工合同" value="用工合同" /><el-option label="获奖证书" value="获奖证书" /><el-option label="荣誉证书" value="荣誉证书" /></el-select></el-form-item><el-form-item label="有效期"><el-date-picker type="date" placeholder="选择有效期" /></el-form-item><el-form-item label="说明"><el-input type="textarea" :rows="3" placeholder="记录证书编号、发证机构、附件、任职流程和授权影响" /></el-form-item></el-form><template #footer><el-button @click="certDialogVisible = false">取消</el-button><el-button type="primary" @click="certDialogVisible = false; submitAction('证件证书已保存')">保存证书</el-button></template></el-dialog>
    <el-dialog v-model="renewDialogVisible" title="证书续期复核" width="580px"><el-form label-width="110px"><el-form-item label="证书"><el-input :model-value="`${currentRow.name} / ${currentRow.certificate}`" disabled /></el-form-item><el-form-item label="续期结论"><el-radio-group model-value="renewed"><el-radio-button label="renewed">已续期</el-radio-button><el-radio-button label="pending">待材料</el-radio-button><el-radio-button label="limit">限制排班</el-radio-button></el-radio-group></el-form-item><el-form-item label="复核意见"><el-input type="textarea" :rows="3" placeholder="记录新有效期、材料缺项和权限/排班影响" /></el-form-item></el-form><template #footer><el-button @click="renewDialogVisible = false">取消</el-button><el-button type="primary" @click="renewDialogVisible = false; submitAction('证书续期复核已保存')">提交续期</el-button></template></el-dialog>
    <el-drawer v-model="traceDrawerVisible" title="证书追溯" size="520px"><el-timeline><el-timeline-item timestamp="证书登记">证书：{{ currentRow.certificate }}，有效期：{{ currentRow.expireDate }}</el-timeline-item><el-timeline-item timestamp="状态判定" type="warning">状态：{{ currentRow.status }}，下一步：{{ currentRow.nextAction }}</el-timeline-item><el-timeline-item timestamp="授权输出" type="success">同步排班资格、工作身份和员工主页提醒</el-timeline-item></el-timeline></el-drawer>
  </section>
</template>
