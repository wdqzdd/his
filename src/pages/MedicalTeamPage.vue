<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, Search, UserFilled } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();
type Row = { id: string; team: string; leader: string; specialty: string; members: string; patients: number; servicePackage: string; status: string; nextAction: string };
const selectedId = ref('TEAM-001');
const teamDialogVisible = ref(false);
const memberDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const rows: Row[] = [
  { id: 'TEAM-001', team: '血透长期随访团队', leader: '王主任', specialty: '维持性血液透析', members: '12人', patients: 326, servicePackage: '长期透析随访', status: '启用', nextAction: '签约分配' },
  { id: 'TEAM-002', team: '血管通路团队', leader: '李教授', specialty: '内瘘/导管/人工血管', members: '8人', patients: 98, servicePackage: '通路管理包', status: '启用', nextAction: '通路评估' },
  { id: 'TEAM-003', team: '营养与贫血团队', leader: '刘主任', specialty: '贫血营养管理', members: '7人', patients: 142, servicePackage: '营养评估包', status: '启用', nextAction: '评估任务' },
  { id: 'TEAM-004', team: '矿物质骨病团队', leader: '陈教授', specialty: 'CKD-MBD', members: '6人', patients: 116, servicePackage: '骨病随访包', status: '启用', nextAction: '检验追踪' },
  { id: 'TEAM-005', team: '感染与隔离团队', leader: '孙主任', specialty: '感染筛查与隔离', members: '6人', patients: 42, servicePackage: '感染管理包', status: '复核中', nextAction: '感控复核' },
  { id: 'TEAM-006', team: '心血管风险团队', leader: '周主任', specialty: '容量与心血管', members: '8人', patients: 88, servicePackage: '心血管随访', status: '启用', nextAction: '风险分层' },
  { id: 'TEAM-007', team: '居家随访团队', leader: '赵护士长', specialty: '居家病人随访', members: '10人', patients: 76, servicePackage: '居家管理包', status: '启用', nextAction: '居家任务' },
  { id: 'TEAM-008', team: 'GCP肾病研究团队', leader: '陈教授', specialty: '药物临床研究', members: '9人', patients: 12, servicePackage: '研究访视', status: '受控', nextAction: 'CRC协同' },
  { id: 'TEAM-009', team: '急诊加透团队', leader: '张明', specialty: '临时加透', members: '5人', patients: 20, servicePackage: '急诊加透', status: '待启用', nextAction: '值班确认' },
  { id: 'TEAM-010', team: '质控改进团队', leader: '刘主任', specialty: 'CQI与报表', members: '7人', patients: 0, servicePackage: '质控改进', status: '启用', nextAction: 'CQI项目' },
];
const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['care_team', 'care_team_member', 'staff_profile', 'patient_contract'];
const metrics = computed(() => [
  { label: '专家团队', value: rows.length, tone: 'blue' },
  { label: '启用', value: rows.filter((item) => item.status === '启用').length, tone: 'green' },
  { label: '复核/受控', value: rows.filter((item) => item.status !== '启用').length, tone: 'orange' },
  { label: '服务患者', value: rows.reduce((sum, item) => sum + item.patients, 0), tone: 'purple' },
]);
function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' { if (['启用', '签约分配'].includes(value)) return 'success'; if (value.includes('复核') || value.includes('受控') || value.includes('待') || value.includes('CRC')) return 'warning'; return 'info'; }
function selectRow(row: Row): void { selectedId.value = row.id; }
function submitAction(message: string): void { ElMessage.success(message); }
</script>

<template>
  <section class="medical-affairs-page">
    <el-card class="medical-work-card" shadow="never">
      <template #header><div class="medical-work-header"><div><h2>{{ props.context.menuTitle }}</h2><p>维护随访专家团队、专业方向、成员和服务包，支撑导诊签约、患者归属和专科评估。</p></div><div class="medical-actions"><el-button type="primary" :icon="UserFilled" @click="teamDialogVisible = true">新增团队</el-button><el-button :icon="CircleCheck" @click="memberDialogVisible = true">成员授权</el-button><el-button @click="traceDrawerVisible = true">团队追溯</el-button></div></div></template>
      <el-form class="medical-filter" inline><el-form-item label="关键字"><el-input placeholder="团队、负责人、专业、服务包" clearable /></el-form-item><el-form-item label="专业方向"><el-select placeholder="全部方向" clearable><el-option label="维持性血液透析" value="维持性血液透析" /><el-option label="血管通路" value="血管通路" /><el-option label="药物临床研究" value="药物临床研究" /></el-select></el-form-item><el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="启用" value="启用" /><el-option label="复核中" value="复核中" /><el-option label="受控" value="受控" /></el-select></el-form-item><el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item></el-form>
      <div class="medical-stat-grid"><el-card v-for="item in metrics" :key="item.label" :class="['medical-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>
      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow"><el-table-column prop="team" label="团队" min-width="160" fixed="left" /><el-table-column prop="leader" label="负责人" width="100" /><el-table-column prop="specialty" label="专业方向" min-width="140" /><el-table-column prop="members" label="成员" width="85" /><el-table-column prop="patients" label="服务患者" width="100" /><el-table-column prop="servicePackage" label="服务包" width="130" /><el-table-column prop="status" label="状态" width="95"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column><el-table-column prop="nextAction" label="下一步" min-width="120" /><el-table-column label="操作" width="220" fixed="right"><template #default="{ row }"><el-button link type="primary" @click.stop="selectRow(row); teamDialogVisible = true">维护</el-button><el-button link @click.stop="selectRow(row); memberDialogVisible = true">成员</el-button><el-button link @click.stop="selectRow(row); traceDrawerVisible = true">追溯</el-button></template></el-table-column></el-table>
    </el-card>    <el-dialog v-model="teamDialogVisible" title="专家团队维护" width="620px"><el-form label-width="110px"><el-form-item label="团队名称"><el-input :model-value="currentRow.team" /></el-form-item><el-form-item label="负责人"><el-input :model-value="currentRow.leader" /></el-form-item><el-form-item label="专业方向"><el-input :model-value="currentRow.specialty" /></el-form-item><el-form-item label="服务包"><el-input :model-value="currentRow.servicePackage" /></el-form-item><el-form-item label="说明"><el-input type="textarea" :rows="3" placeholder="记录团队职责、服务范围和签约规则" /></el-form-item></el-form><template #footer><el-button @click="teamDialogVisible = false">取消</el-button><el-button type="primary" @click="teamDialogVisible = false; submitAction('专家团队已保存')">保存团队</el-button></template></el-dialog>
    <el-dialog v-model="memberDialogVisible" title="团队成员授权" width="600px"><el-form label-width="110px"><el-form-item label="团队"><el-input :model-value="currentRow.team" disabled /></el-form-item><el-form-item label="授权范围"><el-checkbox-group><el-checkbox label="医生站责任患者" /><el-checkbox label="随访任务" /><el-checkbox label="居家审核" /><el-checkbox label="CRC受控患者" /></el-checkbox-group></el-form-item><el-form-item label="授权说明"><el-input type="textarea" :rows="3" placeholder="记录成员、角色、患者范围和生效日期" /></el-form-item></el-form><template #footer><el-button @click="memberDialogVisible = false">取消</el-button><el-button type="primary" @click="memberDialogVisible = false; submitAction('团队成员授权已更新')">保存授权</el-button></template></el-dialog>
    <el-drawer v-model="traceDrawerVisible" title="团队维护追溯" size="520px"><el-timeline><el-timeline-item timestamp="团队建档">团队：{{ currentRow.team }}</el-timeline-item><el-timeline-item timestamp="成员授权" type="primary">授权范围与服务包同步</el-timeline-item><el-timeline-item timestamp="业务引用" type="success">导诊签约、医生站和居家主页可引用</el-timeline-item></el-timeline></el-drawer>
  </section>
</template>
