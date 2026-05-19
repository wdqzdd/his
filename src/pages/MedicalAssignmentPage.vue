<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, Operation, Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();

type AssignmentRow = { id: string; patient: string; doctor: string; nurse: string; groupName: string; bedIntent: string; patientType: string; status: string; owner: string; nextAction: string };
type OwnerStatRow = { id: string; ownerName: string; ownerType: string; wardOrTeam: string; assignedPatients: number; highRisk: number; weeklyTreatments: number; workload: string; status: string; nextAction: string };
type ChangeRow = { id: string; patient: string; changeScope: string; beforeValue: string; afterValue: string; reason: string; reviewer: string; changedAt: string; status: string; nextAction: string };

const activeTab = ref('all');
const selectedId = ref('ASN-001');
const assignDialogVisible = ref(false);
const transferDialogVisible = ref(false);
const traceDrawerVisible = ref(false);

const assignmentRows: AssignmentRow[] = [
  { id: 'ASN-001', patient: '王建国 / P20260510001', doctor: '张明', nurse: '周敏', groupName: 'A区一组', bedIntent: 'A08', patientType: '长期透析', status: '有效', owner: '导诊台', nextAction: '进入排班' },
  { id: 'ASN-002', patient: '李秀兰 / P20260510002', doctor: '陈宁', nurse: '赵琼', groupName: 'B区一组', bedIntent: 'B12', patientType: '导管患者', status: '待调整', owner: '医务科', nextAction: '责任护士变更' },
  { id: 'ASN-003', patient: '赵明 / P20260510003', doctor: '张明', nurse: '孙涵', groupName: '乙肝隔离组', bedIntent: 'I03', patientType: '乙肝隔离', status: '有效', owner: '感控管理', nextAction: '隔离排班' },
  { id: 'ASN-004', patient: '刘梦莹 / P20260510004', doctor: '王主任', nurse: '李洁', groupName: 'A区二组', bedIntent: 'A12', patientType: '新入组', status: '待复核', owner: '导诊台', nextAction: '医生确认' },
  { id: 'ASN-005', patient: '何雪 / P20260510005', doctor: '陈教授', nurse: '刘芳', groupName: 'C区一组', bedIntent: 'C02', patientType: '高磷血症', status: '有效', owner: '医生站', nextAction: '处方评估' },
  { id: 'ASN-006', patient: '马丽 / P20260510006', doctor: '孙主任', nurse: '孙涵', groupName: '乙肝隔离组', bedIntent: 'I01', patientType: '乙肝隔离', status: '有效', owner: '感控管理', nextAction: '隔离排班' },
  { id: 'ASN-007', patient: '周庆 / P20260510007', doctor: '刘主任', nurse: '王丽', groupName: 'B区二组', bedIntent: 'B08', patientType: '容量管理', status: '待调整', owner: '护理部', nextAction: '护理组调整' },
  { id: 'ASN-008', patient: '陈敏 / P20260510008', doctor: '李教授', nurse: '周敏', groupName: 'A区一组', bedIntent: 'A05', patientType: '通路风险', status: '有效', owner: '通路团队', nextAction: '通路评估' },
  { id: 'ASN-009', patient: '潘德胜 / P20260510009', doctor: '陈教授', nurse: '邓雪', groupName: '夜间一组', bedIntent: 'N02', patientType: 'GCP受试者', status: '受控', owner: 'CRC站', nextAction: '授权复核' },
  { id: 'ASN-010', patient: '郭强 / P20260510010', doctor: '周主任', nurse: '陈蕾', groupName: 'C区二组', bedIntent: 'C09', patientType: '心血管风险', status: '待复核', owner: '医务科', nextAction: '团队确认' },
  { id: 'ASN-011', patient: '韩梅 / P20260510011', doctor: '刘主任', nurse: '赵玲', groupName: 'D区一组', bedIntent: 'D02', patientType: '新收患者', status: '待排班', owner: '导诊台', nextAction: '排班排床' },
  { id: 'ASN-012', patient: '马强 / P20260510012', doctor: '张明', nurse: '赵玲', groupName: '夜间一组', bedIntent: 'N03', patientType: '夜间透析', status: '转组待复核', owner: '医务科', nextAction: '转组复核' },
];

const ownerStatRows: OwnerStatRow[] = [
  { id: 'OST-001', ownerName: '张明', ownerType: '医生分管人数统计', wardOrTeam: '血透中心 A/B区', assignedPatients: 82, highRisk: 9, weeklyTreatments: 196, workload: '偏高', status: '关注', nextAction: '分担患者' },
  { id: 'OST-002', ownerName: '陈宁', ownerType: '医生分管人数统计', wardOrTeam: '血透中心 C区', assignedPatients: 64, highRisk: 6, weeklyTreatments: 154, workload: '正常', status: '达标', nextAction: '持续分管' },
  { id: 'OST-003', ownerName: '刘主任', ownerType: '医生分管人数统计', wardOrTeam: '质控/新收', assignedPatients: 48, highRisk: 8, weeklyTreatments: 112, workload: '正常', status: '达标', nextAction: '新收复核' },
  { id: 'OST-004', ownerName: '周敏', ownerType: '护士分管人数统计', wardOrTeam: 'A区一组', assignedPatients: 72, highRisk: 7, weeklyTreatments: 168, workload: '正常', status: '达标', nextAction: '持续分管' },
  { id: 'OST-005', ownerName: '赵琼', ownerType: '护士分管人数统计', wardOrTeam: 'B区一组', assignedPatients: 61, highRisk: 5, weeklyTreatments: 142, workload: '正常', status: '达标', nextAction: '持续分管' },
  { id: 'OST-006', ownerName: '孙涵', ownerType: '护士分管人数统计', wardOrTeam: '乙肝隔离组', assignedPatients: 18, highRisk: 6, weeklyTreatments: 54, workload: '资质受限', status: '待复核', nextAction: '感控复核' },
  { id: 'OST-007', ownerName: 'A区一组', ownerType: '护理组分管人数统计', wardOrTeam: '普通A区', assignedPatients: 72, highRisk: 7, weeklyTreatments: 168, workload: '正常', status: '达标', nextAction: '排班引用' },
  { id: 'OST-008', ownerName: 'B区二组', ownerType: '护理组分管人数统计', wardOrTeam: '普通B区', assignedPatients: 55, highRisk: 8, weeklyTreatments: 128, workload: '偏高', status: '关注', nextAction: '调整责任护士' },
  { id: 'OST-009', ownerName: '夜间一组', ownerType: '护理组分管人数统计', wardOrTeam: '夜间透析区', assignedPatients: 30, highRisk: 5, weeklyTreatments: 70, workload: '偏高', status: '关注', nextAction: '增加夜班护士' },
  { id: 'OST-010', ownerName: '血管通路团队', ownerType: '医护工作量统计', wardOrTeam: '专家团队', assignedPatients: 98, highRisk: 24, weeklyTreatments: 18, workload: '会诊偏高', status: '关注', nextAction: '增加会诊时段' },
];

const changeRows: ChangeRow[] = [
  { id: 'ACH-001', patient: '李秀兰 / P20260510002', changeScope: '责任护士批量调整', beforeValue: '王丽', afterValue: '赵琼', reason: 'B区二组工作量偏高', reviewer: '医务张洁', changedAt: '2026-05-14 10:20', status: '待复核', nextAction: '护士长确认' },
  { id: 'ACH-002', patient: '刘梦莹 / P20260510004', changeScope: '主诊医生批量调整', beforeValue: '未分配', afterValue: '王主任', reason: '新收患者入组', reviewer: '导诊李娜', changedAt: '2026-05-14 11:00', status: '待复核', nextAction: '医生确认' },
  { id: 'ACH-003', patient: '周庆 / P20260510007', changeScope: '护理组批量调整', beforeValue: 'B区二组', afterValue: 'B区一组', reason: '容量管理患者集中随访', reviewer: '护理周敏', changedAt: '2026-05-13 15:30', status: '待调整', nextAction: '排班避让' },
  { id: 'ACH-004', patient: '潘德胜 / P20260510009', changeScope: '受控授权', beforeValue: '普通夜间组', afterValue: 'GCP受控夜间组', reason: '临床研究授权', reviewer: 'CRC陈教授', changedAt: '2026-05-12 16:40', status: '受控', nextAction: 'CRC复核' },
  { id: 'ACH-005', patient: '赵明 / P20260510003', changeScope: '机位意向调整', beforeValue: 'I02', afterValue: 'I03', reason: 'I02停用', reviewer: '感控孙主任', changedAt: '2026-05-14 17:10', status: '已生效', nextAction: '隔离排班' },
  { id: 'ACH-006', patient: '马强 / P20260510012', changeScope: '护理组批量调整', beforeValue: 'A区一组', afterValue: '夜间一组', reason: '夜间透析转组', reviewer: '医务张洁', changedAt: '2026-05-14 18:20', status: '转组待复核', nextAction: '夜班确认' },
];

const currentRow = computed(() => assignmentRows.find((item) => item.id === selectedId.value) ?? assignmentRows[0]);
const activeTables = ['patient_assignment', 'assignment_change_log', 'workflow_task', 'care_team_member'];
const doctorRows = computed(() => assignmentRows.filter((item) => ['张明', '陈宁', '刘主任', '王主任', '周主任'].includes(item.doctor)));
const nurseRows = computed(() => assignmentRows.filter((item) => item.nurse));
const groupRows = computed(() => assignmentRows.filter((item) => item.groupName));
const metrics = computed(() => [
  { label: '分工患者', value: assignmentRows.length, tone: 'blue' },
  { label: '有效', value: assignmentRows.filter((item) => item.status === '有效').length, tone: 'green' },
  { label: '待调整/复核', value: assignmentRows.filter((item) => item.status.includes('待') || item.status.includes('转组')).length, tone: 'orange' },
  { label: '工作量关注', value: ownerStatRows.filter((item) => item.status === '关注' || item.status === '待复核').length, tone: 'purple' },
]);

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (['有效', '达标', '已生效', '进入排班', '隔离排班'].includes(value)) return 'success';
  if (value.includes('关注') || value.includes('偏高')) return 'danger';
  if (value.includes('待') || value.includes('受控') || value.includes('调整') || value.includes('复核') || value.includes('转组')) return 'warning';
  return 'info';
}

function selectRow(row: AssignmentRow): void {
  selectedId.value = row.id;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}
</script>

<template>
  <section class="medical-affairs-page">
    <el-card class="medical-work-card" shadow="never">
      <template #header>
        <div class="medical-work-header">
          <div>
            <h2>{{ props.context.menuTitle }}</h2>
            <p>维护患者主诊医生、责任护士、护理组和机位意向，并统计医生、护士、护理组分管人数与工作量。</p>
          </div>
          <div class="medical-actions">
            <el-button type="primary" :icon="CircleCheck" @click="assignDialogVisible = true">分工维护</el-button>
            <el-button :icon="Operation" @click="transferDialogVisible = true">批量调整</el-button>
            <el-button @click="traceDrawerVisible = true">分工追溯</el-button>
          </div>
        </div>
      </template>

      <el-form class="medical-filter" inline>
        <el-form-item label="关键字"><el-input placeholder="患者、医生、护士、护理组" clearable /></el-form-item>
        <el-form-item label="分管视图"><el-select placeholder="全部视图" clearable><el-option label="医生分管患者列表" value="doctor" /><el-option label="护士分管患者列表" value="nurse" /><el-option label="护理组分管患者列表" value="group" /><el-option label="分管人数统计" value="stat" /><el-option label="工作量统计" value="workload" /></el-select></el-form-item>
        <el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="有效" value="有效" /><el-option label="待调整" value="待调整" /><el-option label="待复核" value="待复核" /><el-option label="受控" value="受控" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <div class="medical-stat-grid">
        <el-card v-for="item in metrics" :key="item.label" :class="['medical-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card>
      </div>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="全部分管关系" name="all">
          <el-table :data="assignmentRows" border stripe highlight-current-row row-key="id" @row-click="selectRow">
            <el-table-column prop="patient" label="患者" min-width="160" fixed="left" />
            <el-table-column prop="doctor" label="主诊医生" width="100" />
            <el-table-column prop="nurse" label="责任护士" width="100" />
            <el-table-column prop="groupName" label="护理组" width="120" />
            <el-table-column prop="bedIntent" label="机位意向" width="105" />
            <el-table-column prop="patientType" label="患者类型" width="120" />
            <el-table-column prop="status" label="状态" width="105"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
            <el-table-column prop="owner" label="来源/责任方" width="120" />
            <el-table-column prop="nextAction" label="下一步" min-width="120" />
            <el-table-column label="操作" width="220" fixed="right"><template #default="{ row }"><el-button link type="primary" @click.stop="selectRow(row); assignDialogVisible = true">维护</el-button><el-button link @click.stop="selectRow(row); transferDialogVisible = true">调整</el-button><el-button link @click.stop="selectRow(row); traceDrawerVisible = true">追溯</el-button></template></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="医生分管患者列表" name="doctor">
          <el-table :data="doctorRows" border stripe row-key="id">
            <el-table-column prop="doctor" label="主诊医生" width="100" fixed="left" />
            <el-table-column prop="patient" label="患者" min-width="160" />
            <el-table-column prop="patientType" label="患者类型" width="120" />
            <el-table-column prop="nurse" label="责任护士" width="100" />
            <el-table-column prop="groupName" label="护理组" width="120" />
            <el-table-column prop="status" label="状态" width="105"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
            <el-table-column prop="nextAction" label="下一步" min-width="120" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="护士分管患者列表" name="nurse">
          <el-table :data="nurseRows" border stripe row-key="id">
            <el-table-column prop="nurse" label="责任护士" width="100" fixed="left" />
            <el-table-column prop="patient" label="患者" min-width="160" />
            <el-table-column prop="patientType" label="患者类型" width="120" />
            <el-table-column prop="doctor" label="主诊医生" width="100" />
            <el-table-column prop="groupName" label="护理组" width="120" />
            <el-table-column prop="status" label="状态" width="105"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
            <el-table-column prop="nextAction" label="下一步" min-width="120" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="护理组分管患者列表" name="group">
          <el-table :data="groupRows" border stripe row-key="id">
            <el-table-column prop="groupName" label="护理组" width="120" fixed="left" />
            <el-table-column prop="patient" label="患者" min-width="160" />
            <el-table-column prop="doctor" label="主诊医生" width="100" />
            <el-table-column prop="nurse" label="责任护士" width="100" />
            <el-table-column prop="bedIntent" label="机位意向" width="105" />
            <el-table-column prop="status" label="状态" width="105"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
            <el-table-column prop="nextAction" label="下一步" min-width="120" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="医护分管人数统计" name="owner-stat">
          <el-table :data="ownerStatRows" border stripe row-key="id">
            <el-table-column prop="ownerName" label="对象" width="120" fixed="left" />
            <el-table-column prop="ownerType" label="统计类型" width="150" />
            <el-table-column prop="wardOrTeam" label="病区/团队" min-width="140" />
            <el-table-column prop="assignedPatients" label="分管患者" width="95" />
            <el-table-column prop="highRisk" label="高风险" width="85" />
            <el-table-column prop="weeklyTreatments" label="本周治疗/会诊" width="120" />
            <el-table-column prop="workload" label="工作量" width="110" />
            <el-table-column prop="status" label="状态" width="95"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
            <el-table-column prop="nextAction" label="下一步" min-width="130" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="医护工作量统计" name="workload">
          <el-table :data="ownerStatRows" border stripe row-key="id">
            <el-table-column prop="ownerName" label="对象" width="120" fixed="left" />
            <el-table-column prop="ownerType" label="统计口径" width="150" />
            <el-table-column prop="assignedPatients" label="分管患者" width="95" />
            <el-table-column prop="weeklyTreatments" label="本周治疗/会诊" width="120" />
            <el-table-column prop="highRisk" label="高风险患者" width="105" />
            <el-table-column prop="workload" label="负荷判定" width="110" />
            <el-table-column prop="status" label="状态" width="95"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
            <el-table-column prop="nextAction" label="下一步" min-width="130" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="患者分管关系变更记录" name="changes">
          <el-table :data="changeRows" border stripe row-key="id">
            <el-table-column prop="patient" label="患者" min-width="160" fixed="left" />
            <el-table-column prop="changeScope" label="变更范围" width="140" />
            <el-table-column prop="beforeValue" label="变更前" width="130" />
            <el-table-column prop="afterValue" label="变更后" width="130" />
            <el-table-column prop="reason" label="原因" min-width="150" />
            <el-table-column prop="reviewer" label="复核人" width="115" />
            <el-table-column prop="changedAt" label="时间" width="145" />
            <el-table-column prop="status" label="状态" width="105"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
            <el-table-column prop="nextAction" label="下一步" min-width="120" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog v-model="assignDialogVisible" title="医护分工维护" width="660px">
      <el-form label-width="110px">
        <el-form-item label="患者"><el-input :model-value="currentRow.patient" disabled /></el-form-item>
        <el-form-item label="主诊医生"><el-input :model-value="currentRow.doctor" /></el-form-item>
        <el-form-item label="责任护士"><el-input :model-value="currentRow.nurse" /></el-form-item>
        <el-form-item label="护理组"><el-input :model-value="currentRow.groupName" /></el-form-item>
        <el-form-item label="机位意向"><el-input :model-value="currentRow.bedIntent" /></el-form-item>
        <el-form-item label="维护说明"><el-input type="textarea" :rows="3" placeholder="记录分工依据、服务包、隔离限制、生效日期和下游引用" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="assignDialogVisible = false">取消</el-button><el-button type="primary" @click="assignDialogVisible = false; submitAction('医护分工已保存')">保存分工</el-button></template>
    </el-dialog>

    <el-dialog v-model="transferDialogVisible" title="批量调整分管关系" width="660px">
      <el-form label-width="110px">
        <el-form-item label="调整对象"><el-input :model-value="`${currentRow.patient} / ${currentRow.doctor} / ${currentRow.nurse}`" disabled /></el-form-item>
        <el-form-item label="调整范围"><el-checkbox-group><el-checkbox label="主诊医生批量调整" /><el-checkbox label="责任护士批量调整" /><el-checkbox label="护理组批量调整" /><el-checkbox label="机位意向调整" /></el-checkbox-group></el-form-item>
        <el-form-item label="影响预览"><el-input placeholder="预计影响患者 12 人、医生站 2 个责任患者列表、护士站 3 个护理清单" disabled /></el-form-item>
        <el-form-item label="调整原因"><el-input type="textarea" :rows="3" placeholder="记录换组、请假、隔离、GCP受控、工作量均衡或资源调整原因" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="transferDialogVisible = false">取消</el-button><el-button type="primary" @click="transferDialogVisible = false; submitAction('分管关系批量调整已提交复核')">提交调整</el-button></template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="医护分工追溯" size="560px">
      <el-timeline>
        <el-timeline-item timestamp="归属分配">患者：{{ currentRow.patient }}，主诊：{{ currentRow.doctor }}</el-timeline-item>
        <el-timeline-item timestamp="责任调整" type="warning">护理组：{{ currentRow.groupName }}，状态：{{ currentRow.status }}</el-timeline-item>
        <el-timeline-item timestamp="统计回写" type="primary">更新医生、护士、护理组分管人数和工作量统计</el-timeline-item>
        <el-timeline-item timestamp="业务输出" type="success">同步医生站、护士站、排班排床和统计报表</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
