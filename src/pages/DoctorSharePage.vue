<script setup lang="ts">
import { ref } from 'vue';
import { CircleCheck, Document, Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

type ShareRow = {
  id: string;
  patient: string;
  primaryTeam: string;
  sharedTeam: string;
  scope: string;
  callRecord: string;
  reason: string;
  status: string;
  owner: string;
  nextAction: string;
};

const editDialogVisible = ref(false);
const reviewDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const selected = ref<ShareRow | null>(null);

const rows: ShareRow[] = [
  { id: 'SH-001', patient: '李秀兰 / HD-00072', primaryTeam: '血管通路团队', sharedTeam: '感控小组', scope: '通路记录、感控事件、宣教任务', callRecord: '呼叫医护记录：感控护士已接听', reason: '导管感染风险', status: '协管中', owner: '陈宁', nextAction: '感控复核' },
  { id: 'SH-002', patient: '赵明 / HD-00116', primaryTeam: '隔离透析团队', sharedTeam: '感控小组', scope: '隔离标识、透析记录、感控检查', callRecord: '呼叫医护记录：隔离护士处理中', reason: '乙肝隔离管理', status: '协管中', owner: '张明', nextAction: '隔离预约' },
  { id: 'SH-003', patient: '陈志强 / HD-00128', primaryTeam: '急诊透析团队', sharedTeam: '医务医事', scope: '签约草稿、知情同意、急诊记录', callRecord: '呼叫医护记录：医务值班待确认', reason: '临时透析准入审核', status: '待确认', owner: '刘主任', nextAction: '补录资料' },
  { id: 'SH-004', patient: '周萍 / HD-00147', primaryTeam: '腹透转血透团队', sharedTeam: '血管通路团队', scope: '通路评估、检查报告、医生病程', callRecord: '呼叫医护记录：通路医生已响应', reason: '转血透通路评估', status: '协管中', owner: '陈宁', nextAction: '通路评估' },
  { id: 'SH-005', patient: '郑军 / HD-00299', primaryTeam: '王主任团队', sharedTeam: '医保协同组', scope: '医保资料、费用提醒、签约状态', callRecord: '呼叫医护记录：导诊医保专员处理中', reason: '异地医保备案', status: '待复核', owner: '王主任', nextAction: '备案核验' },
  { id: 'SH-006', patient: '韩梅 / HD-00203', primaryTeam: '刘主任团队', sharedTeam: '护士宣教组', scope: '居家任务、宣教完成、知情同意', callRecord: '呼叫医护记录：责任护士已接收', reason: '新患者宣教', status: '协管中', owner: '赵玲', nextAction: '宣教跟进' },
  { id: 'SH-007', patient: '林建平 / HD-00266', primaryTeam: '导管护理团队', sharedTeam: '感控小组', scope: '临床事件、通路记录、感控整改', callRecord: '呼叫医护记录：感控复查已排班', reason: '导管感染预警', status: '协管中', owner: '感控护士', nextAction: '预警复查' },
  { id: 'SH-008', patient: '孙丽 / HD-00305', primaryTeam: '急诊透析团队', sharedTeam: '导诊台', scope: '患者主档、同意书、临时申请', callRecord: '呼叫医护记录：导诊台待核验', reason: '身份资料补齐', status: '待确认', owner: '李倩', nextAction: '身份核验' },
  { id: 'SH-009', patient: '马强 / HD-00311', primaryTeam: '夜间透析团队', sharedTeam: '医务医事', scope: '排班、机位、责任分配', callRecord: '呼叫医护记录：夜班医生待回复', reason: '夜间班转组', status: '待停止', owner: '张明', nextAction: '停止复核' },
  { id: 'SH-010', patient: '王建国 / HD-00038', primaryTeam: '王主任团队', sharedTeam: '营养师团队', scope: '检验趋势、饮食任务、健康档案', callRecord: '呼叫医护记录：营养师已回复', reason: '血磷偏高饮食干预', status: '协管中', owner: '刘主任', nextAction: '营养随访' },
];

const activeTables = ['share_collaboration', 'patient_assignment', 'sys_permission_scope', 'sys_audit_log'];

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value === '协管中') return 'success';
  if (value.includes('待停止')) return 'danger';
  if (value.includes('待')) return 'warning';
  return 'info';
}

function openEdit(row?: ShareRow): void {
  selected.value = row ?? rows[0];
  editDialogVisible.value = true;
}

function openReview(row: ShareRow): void {
  selected.value = row;
  reviewDialogVisible.value = true;
}

function openTrace(row: ShareRow): void {
  selected.value = row;
  traceDrawerVisible.value = true;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}
</script>

<template>
  <section class="doctor-clinical-page">
    <el-card class="clinical-work-card" shadow="never">
      <template #header><div class="clinical-header"><div><h2>{{ context.menuTitle }}</h2><p>为患者开通跨团队协管，限定数据范围、协管时限和责任人，支持医生站到其他团队的数据协同。</p></div><div class="clinical-actions"><el-button type="primary" :icon="Document" @click="openEdit()">新增协管</el-button><el-button :icon="CircleCheck" @click="openReview(rows[0])">复核权限</el-button></div></div></template>
      <el-form class="clinical-filter" inline><el-form-item label="关键字"><el-input placeholder="患者、主责团队、协管团队" clearable /></el-form-item><el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="待确认" value="待确认" /><el-option label="待复核" value="待复核" /><el-option label="协管中" value="协管中" /><el-option label="待停止" value="待停止" /></el-select></el-form-item><el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item></el-form>
      <el-table :data="rows" border stripe><el-table-column prop="id" label="协管号" width="105" fixed="left" /><el-table-column prop="patient" label="患者" min-width="155" /><el-table-column prop="primaryTeam" label="主责团队" min-width="135" /><el-table-column prop="sharedTeam" label="协管团队" min-width="135" /><el-table-column prop="scope" label="共享患者记录/数据范围" min-width="220" /><el-table-column prop="callRecord" label="呼叫医护记录" min-width="190" /><el-table-column prop="reason" label="协管原因" min-width="170" /><el-table-column prop="status" label="状态" width="105"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column><el-table-column prop="owner" label="责任人" width="105" /><el-table-column prop="nextAction" label="下一步" min-width="130" /><el-table-column label="操作" width="210" fixed="right"><template #default="{ row }"><el-button link type="primary" @click="openEdit(row)">维护</el-button><el-button link @click="openReview(row)">复核</el-button><el-button link @click="openTrace(row)">追溯</el-button></template></el-table-column></el-table>
    </el-card>    <el-dialog v-model="editDialogVisible" title="共享协管维护" width="680px"><el-form label-width="110px"><el-form-item label="患者"><el-input :model-value="selected?.patient" disabled /></el-form-item><el-form-item label="主责团队"><el-input :model-value="selected?.primaryTeam" /></el-form-item><el-form-item label="协管团队"><el-select :model-value="selected?.sharedTeam"><el-option label="感控小组" value="感控小组" /><el-option label="营养师团队" value="营养师团队" /><el-option label="血管通路团队" value="血管通路团队" /><el-option label="医务医事" value="医务医事" /></el-select></el-form-item><el-form-item label="数据范围"><el-input type="textarea" :rows="3" :model-value="selected?.scope" /></el-form-item><el-form-item label="协管原因"><el-input type="textarea" :rows="3" :model-value="selected?.reason" /></el-form-item></el-form><template #footer><el-button @click="editDialogVisible = false">取消</el-button><el-button type="primary" @click="editDialogVisible = false; submitAction('共享协管已保存')">保存</el-button></template></el-dialog>
    <el-dialog v-model="reviewDialogVisible" title="协管权限复核" width="560px"><el-form label-width="100px"><el-form-item label="协管号"><el-input :model-value="selected?.id" disabled /></el-form-item><el-form-item label="复核结果"><el-radio-group model-value="pass"><el-radio-button label="pass">通过</el-radio-button><el-radio-button label="return">退回</el-radio-button><el-radio-button label="deny">不通过</el-radio-button></el-radio-group></el-form-item><el-form-item label="意见"><el-input type="textarea" :rows="3" /></el-form-item></el-form><template #footer><el-button @click="reviewDialogVisible = false">取消</el-button><el-button type="primary" @click="reviewDialogVisible = false; submitAction('协管权限已复核')">提交</el-button></template></el-dialog>
    <el-drawer v-model="traceDrawerVisible" title="协管追溯" size="520px"><el-timeline><el-timeline-item timestamp="2026-05-10 10:30" type="primary">创建协管：{{ selected?.sharedTeam }}</el-timeline-item><el-timeline-item timestamp="2026-05-10 10:40">复核数据范围和期限</el-timeline-item><el-timeline-item timestamp="2026-05-10 11:00" type="success">协管权限生效并同步工作站</el-timeline-item></el-timeline></el-drawer>
  </section>
</template>
