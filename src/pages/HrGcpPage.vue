<script setup lang="ts">
import { computed, ref } from 'vue';
import { DocumentAdd, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();
type Row = { id: string; name: string; role: string; project: string; trainingPlan: string; training: string; certificate: string; authorization: string; status: string; owner: string; nextAction: string };
const selectedId = ref('HG-001');
const gcpDialogVisible = ref(false);
const authDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const rows: Row[] = [
  { id: 'HG-001', name: '刘主任', role: 'PI', project: 'HD-CKD-01', trainingPlan: '研究者年度计划', training: '已完成', certificate: 'GCP证书有效', authorization: '已授权', status: '可参与', owner: 'GCP中心', nextAction: '持续维护' },
  { id: 'HG-002', name: '王护士长', role: 'Sub-I', project: 'HD-CKD-01', trainingPlan: '复训计划', training: '待复训', certificate: 'GCP证书有效', authorization: '待复核', status: '受限', owner: 'GCP中心', nextAction: '安排复训' },
  { id: 'HG-003', name: '周药师', role: '研究药物管理员', project: 'HD-CKD-01', trainingPlan: '研究药物专项', training: '已完成', certificate: 'GCP证书有效', authorization: '已授权', status: '可参与', owner: '药剂科', nextAction: '药物台账' },
  { id: 'HG-004', name: '钱CRC', role: 'CRC', project: 'HD-CKD-01', trainingPlan: 'CRC访视计划', training: '已完成', certificate: 'GCP证书有效', authorization: '已授权', status: '可参与', owner: 'CRC站', nextAction: '访视协同' },
  { id: 'HG-005', name: '陈教授', role: '分中心负责人', project: 'HD-MBD-02', trainingPlan: '项目启动培训', training: '已完成', certificate: 'GCP证书有效', authorization: '已授权', status: '可参与', owner: 'GCP中心', nextAction: '项目筛选' },
  { id: 'HG-006', name: '赵护士', role: '研究护士', project: 'HD-MBD-02', trainingPlan: '研究护士准入', training: '待考试', certificate: 'GCP证书有效', authorization: '未授权', status: '待达标', owner: '护理部', nextAction: '完成考试' },
  { id: 'HG-007', name: '孙检验师', role: '标本处理', project: 'HD-CKD-01', trainingPlan: '标本链培训', training: '待考试', certificate: '待上传', authorization: '未授权', status: '待达标', owner: '检验科', nextAction: '上传证书' },
  { id: 'HG-008', name: '李导诊', role: '受试者预约协同', project: 'HD-CKD-01', trainingPlan: '受试者隐私培训', training: '已完成', certificate: '服务培训有效', authorization: '协同授权', status: '可协同', owner: '导诊台', nextAction: '预约协同' },
  { id: 'HG-009', name: '何会计', role: '费用协同', project: 'HD-MBD-02', trainingPlan: '研究费用培训', training: '待完成', certificate: '财务权限有效', authorization: '未授权', status: '受限', owner: '药耗管理组', nextAction: '完成培训' },
  { id: 'HG-010', name: '马感控', role: '安全事件审核', project: 'HD-CKD-01', trainingPlan: 'AE/SAE培训', training: '已完成', certificate: '院感培训有效', authorization: '协同授权', status: '可协同', owner: '院感科', nextAction: 'AE协同' },
];
const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['gcp_training_plan', 'staff_gcp_training', 'staff_certificate', 'staff_authorization', 'gcp_project_member', 'gcp_audit_log'];
const metrics = computed(() => [
  { label: 'GCP人员', value: rows.length, tone: 'blue' },
  { label: '已授权', value: rows.filter((item) => item.authorization === '已授权').length, tone: 'green' },
  { label: '待达标', value: rows.filter((item) => item.status === '待达标').length, tone: 'orange' },
  { label: '受限', value: rows.filter((item) => item.status === '受限').length, tone: 'red' },
  { label: '协同授权', value: rows.filter((item) => item.authorization === '协同授权').length, tone: 'green' },
]);
function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' { if (['已完成', '已授权', '可参与', '可协同'].includes(value) || value.includes('有效')) return 'success'; if (value === '受限') return 'danger'; if (value.includes('待') || value.includes('未') || value.includes('上传') || value.includes('复训')) return 'warning'; return 'info'; }
function selectRow(row: Row): void { selectedId.value = row.id; }
function submitAction(message: string): void { ElMessage.success(message); }
</script>

<template>
  <section class="hr-page">
    <el-card class="hr-work-card" shadow="never">
      <template #header><div class="hr-header"><div><h2>{{ props.context.menuTitle }}</h2><p>维护 GCP 培训、证书、项目角色和研究授权，授权结果决定 CRC 站和研究药物协同范围。</p></div><div class="hr-actions"><el-button type="primary" :icon="DocumentAdd" @click="gcpDialogVisible = true">GCP培训登记</el-button><el-button :icon="Warning" @click="authDialogVisible = true">研究授权</el-button><el-button @click="traceDrawerVisible = true">授权追溯</el-button></div></div></template>
      <el-form class="hr-filter" inline><el-form-item label="关键字"><el-input placeholder="姓名、项目、角色、授权状态" clearable /></el-form-item><el-form-item label="项目"><el-select placeholder="全部项目" clearable><el-option label="HD-CKD-01" value="HD-CKD-01" /><el-option label="HD-MBD-02" value="HD-MBD-02" /></el-select></el-form-item><el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="可参与" value="可参与" /><el-option label="待达标" value="待达标" /><el-option label="受限" value="受限" /></el-select></el-form-item><el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item></el-form>
      <div class="hr-stat-grid"><el-card v-for="item in metrics" :key="item.label" :class="['hr-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>
      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow"><el-table-column prop="name" label="姓名" width="95" fixed="left" /><el-table-column prop="role" label="研究角色" width="130" /><el-table-column prop="project" label="项目" width="115" /><el-table-column prop="trainingPlan" label="GCP培训计划" min-width="130" /><el-table-column prop="training" label="学习记录" width="95"><template #default="{ row }"><el-tag :type="tagType(row.training)" effect="plain">{{ row.training }}</el-tag></template></el-table-column><el-table-column prop="certificate" label="培训证书" min-width="130" /><el-table-column prop="authorization" label="授权" width="105"><template #default="{ row }"><el-tag :type="tagType(row.authorization)">{{ row.authorization }}</el-tag></template></el-table-column><el-table-column prop="status" label="状态" width="90"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column><el-table-column prop="owner" label="责任部门" width="110" /><el-table-column prop="nextAction" label="下一步" min-width="120" /><el-table-column label="操作" width="220" fixed="right"><template #default="{ row }"><el-button link type="primary" @click.stop="selectRow(row); gcpDialogVisible = true">培训</el-button><el-button link @click.stop="selectRow(row); authDialogVisible = true">授权</el-button><el-button link @click.stop="selectRow(row); traceDrawerVisible = true">追溯</el-button></template></el-table-column></el-table>
    </el-card>    <el-dialog v-model="gcpDialogVisible" title="GCP培训登记" width="640px"><el-form label-width="110px"><el-form-item label="人员"><el-input :model-value="currentRow.name" disabled /></el-form-item><el-form-item label="培训计划"><el-input :model-value="currentRow.trainingPlan" /></el-form-item><el-form-item label="学习记录"><el-radio-group model-value="done"><el-radio-button label="done">已完成</el-radio-button><el-radio-button label="exam">待考试</el-radio-button><el-radio-button label="retrain">待复训</el-radio-button></el-radio-group></el-form-item><el-form-item label="培训证书"><el-input placeholder="填写证书编号、有效期或上传状态" /></el-form-item><el-form-item label="说明"><el-input type="textarea" :rows="3" placeholder="记录培训计划、培训机构、证书有效期和补训要求" /></el-form-item></el-form><template #footer><el-button @click="gcpDialogVisible = false">取消</el-button><el-button type="primary" @click="gcpDialogVisible = false; submitAction('GCP培训记录已保存')">保存培训</el-button></template></el-dialog>
    <el-dialog v-model="authDialogVisible" title="研究项目授权" width="620px"><el-form label-width="110px"><el-form-item label="项目角色"><el-input :model-value="`${currentRow.project} / ${currentRow.role}`" disabled /></el-form-item><el-form-item label="授权范围"><el-checkbox-group><el-checkbox label="受控患者查看" /><el-checkbox label="访视录入" /><el-checkbox label="研究药物" /><el-checkbox label="标本链" /></el-checkbox-group></el-form-item><el-form-item label="授权结论"><el-radio-group model-value="grant"><el-radio-button label="grant">授权</el-radio-button><el-radio-button label="hold">暂缓</el-radio-button><el-radio-button label="revoke">撤销</el-radio-button></el-radio-group></el-form-item><el-form-item label="授权说明"><el-input type="textarea" :rows="3" placeholder="记录授权人、有效期、患者范围和审计要求" /></el-form-item></el-form><template #footer><el-button @click="authDialogVisible = false">取消</el-button><el-button type="primary" @click="authDialogVisible = false; submitAction('研究项目授权已更新')">提交授权</el-button></template></el-dialog>
    <el-drawer v-model="traceDrawerVisible" title="GCP授权追溯" size="520px"><el-timeline><el-timeline-item timestamp="培训记录">人员：{{ currentRow.name }}，培训：{{ currentRow.training }}</el-timeline-item><el-timeline-item timestamp="项目授权" type="warning">项目：{{ currentRow.project }}，授权：{{ currentRow.authorization }}</el-timeline-item><el-timeline-item timestamp="业务引用" type="success">同步 CRC 站和研究药物协同</el-timeline-item></el-timeline></el-drawer>
  </section>
</template>
