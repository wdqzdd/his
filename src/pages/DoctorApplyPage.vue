<script setup lang="ts">
import { ref } from 'vue';
import { CircleCheck, Document, Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

type ApplyRow = {
  id: string;
  patient: string;
  applyType: string;
  applyCategory: string;
  targetDept: string;
  reason: string;
  requestedTime: string;
  status: string;
  owner: string;
  nextAction: string;
};

const applyDialogVisible = ref(false);
const reviewDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const selected = ref<ApplyRow | null>(null);

const rows: ApplyRow[] = [
  { id: 'APP-001', patient: '陈志强 / HD-00128', applyType: '通路超声预约', applyCategory: '检查申请', targetDept: '血管通路团队', reason: '人工血管震颤稍弱，申请超声复查', requestedTime: '2026-05-11 上午', status: '待审核', owner: '刘主任', nextAction: '通路团队确认' },
  { id: 'APP-002', patient: '周庆 / HD-00218', applyType: '心内会诊', applyCategory: '随访申请', targetDept: '心内科', reason: 'BNP高，透中低血压风险', requestedTime: '2026-05-11 下午', status: '已预约', owner: '王主任', nextAction: '等待会诊' },
  { id: 'APP-003', patient: '李秀兰 / HD-00072', applyType: '营养随访', applyCategory: '随访申请', targetDept: '营养师团队', reason: '白蛋白偏低，需营养评估', requestedTime: '2026-05-12', status: '处理中', owner: '陈宁', nextAction: '营养师回复' },
  { id: 'APP-004', patient: '赵明 / HD-00116', applyType: '特殊血液净化准入', applyCategory: '特殊血液净化申请', targetDept: '感控小组', reason: '隔离透析风险复核', requestedTime: '2026-05-10', status: '已完成', owner: '张明', nextAction: '归档' },
  { id: 'APP-005', patient: '何雪 / HD-00246', applyType: '药师审核', applyCategory: '血液透析申请', targetDept: '药房站', reason: '降磷药调整适宜性审核', requestedTime: '2026-05-10', status: '待审核', owner: '刘主任', nextAction: '药师审核' },
  { id: 'APP-006', patient: '郭强 / HD-00277', applyType: '检验复查', applyCategory: '检查申请', targetDept: '检验科', reason: '透后复查Kt/V', requestedTime: '2026-05-11 透后', status: '待采集', owner: '张明', nextAction: '护士采样' },
  { id: 'APP-007', patient: '刘梅英 / HD-00151', applyType: '胸片复查', applyCategory: '检查申请', targetDept: '影像科', reason: '胸片复查', requestedTime: '2026-05-11', status: '退回修改', owner: '陈宁', nextAction: '补充申请' },
  { id: 'APP-008', patient: '郑军 / HD-00299', applyType: '深静脉穿刺申请', applyCategory: '深静脉穿刺申请', targetDept: '导诊台', reason: '异地医保备案影响处方费用', requestedTime: '2026-05-10', status: '处理中', owner: '张明', nextAction: '导诊回复' },
  { id: 'APP-009', patient: '王建国 / HD-00038', applyType: '手术申请', applyCategory: '手术申请', targetDept: 'CRC站', reason: '贫血项目筛选咨询', requestedTime: '2026-05-13', status: '待确认', owner: '刘主任', nextAction: '研究护士确认' },
  { id: 'APP-010', patient: '陈志强 / HD-00128', applyType: '临时透析准入', applyCategory: '血液透析申请', targetDept: '急诊科', reason: '临时透析准入审核', requestedTime: '2026-05-10', status: '已完成', owner: '王主任', nextAction: '治疗准备' },
];

const activeTables = ['consult_apply', 'appointment_request', 'department_collaboration', 'sys_audit_log'];

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value.includes('已')) return 'success';
  if (value.includes('退回')) return 'danger';
  if (value.includes('待') || value.includes('中')) return 'warning';
  return 'info';
}

function openApply(row?: ApplyRow): void {
  selected.value = row ?? rows[0];
  applyDialogVisible.value = true;
}

function openReview(row: ApplyRow): void {
  selected.value = row;
  reviewDialogVisible.value = true;
}

function openTrace(row: ApplyRow): void {
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
      <template #header><div class="clinical-header"><div><h2>{{ context.menuTitle }}</h2><p>向检验、影像、通路、心内、感控、营养、药房等团队发起会诊或预约申请，并跟踪闭环。</p></div><div class="clinical-actions"><el-button type="primary" :icon="Document" @click="openApply()">发起申请</el-button><el-button :icon="CircleCheck" @click="openReview(rows[0])">确认结果</el-button></div></div></template>
      <el-form class="clinical-filter" inline><el-form-item label="关键字"><el-input placeholder="患者、申请类型、目标科室" clearable /></el-form-item><el-form-item label="申请分类"><el-select placeholder="全部分类" clearable><el-option label="血液透析申请" value="血液透析申请" /><el-option label="特殊血液净化申请" value="特殊血液净化申请" /><el-option label="深静脉穿刺申请" value="深静脉穿刺申请" /><el-option label="手术申请" value="手术申请" /><el-option label="随访申请" value="随访申请" /><el-option label="检查申请" value="检查申请" /></el-select></el-form-item><el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="待审核" value="待审核" /><el-option label="已预约" value="已预约" /><el-option label="退回修改" value="退回修改" /></el-select></el-form-item><el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item></el-form>
      <el-table :data="rows" border stripe><el-table-column prop="id" label="申请号" width="105" fixed="left" /><el-table-column prop="patient" label="患者" min-width="150" /><el-table-column prop="applyCategory" label="申请分类" min-width="150" /><el-table-column prop="applyType" label="申请类型" min-width="145" /><el-table-column prop="targetDept" label="目标科室" width="120" /><el-table-column prop="reason" label="申请原因" min-width="260" /><el-table-column prop="requestedTime" label="期望时间" width="140" /><el-table-column prop="status" label="状态" width="105"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column><el-table-column prop="owner" label="申请医生" width="105" /><el-table-column prop="nextAction" label="下一步" min-width="130" /><el-table-column label="操作" width="210" fixed="right"><template #default="{ row }"><el-button link type="primary" @click="openApply(row)">维护</el-button><el-button link @click="openReview(row)">确认</el-button><el-button link @click="openTrace(row)">追溯</el-button></template></el-table-column></el-table>
    </el-card>    <el-dialog v-model="applyDialogVisible" title="向他科申请预约" width="660px"><el-form label-width="110px"><el-form-item label="患者"><el-input :model-value="selected?.patient" /></el-form-item><el-form-item label="申请分类"><el-select :model-value="selected?.applyCategory"><el-option label="血液透析申请" value="血液透析申请" /><el-option label="特殊血液净化申请" value="特殊血液净化申请" /><el-option label="深静脉穿刺申请" value="深静脉穿刺申请" /><el-option label="手术申请" value="手术申请" /><el-option label="随访申请" value="随访申请" /><el-option label="检查申请" value="检查申请" /></el-select></el-form-item><el-form-item label="申请类型"><el-input :model-value="selected?.applyType" /></el-form-item><el-form-item label="目标科室"><el-select :model-value="selected?.targetDept"><el-option label="血管通路团队" value="血管通路团队" /><el-option label="心内科" value="心内科" /><el-option label="检验科" value="检验科" /><el-option label="药房站" value="药房站" /></el-select></el-form-item><el-form-item label="期望时间"><el-date-picker type="datetime" /></el-form-item><el-form-item label="申请原因"><el-input type="textarea" :rows="4" :model-value="selected?.reason" /></el-form-item></el-form><template #footer><el-button @click="applyDialogVisible = false">取消</el-button><el-button type="primary" @click="applyDialogVisible = false; submitAction('他科申请已提交')">提交申请</el-button></template></el-dialog>
    <el-dialog v-model="reviewDialogVisible" title="申请结果确认" width="560px"><el-form label-width="100px"><el-form-item label="申请"><el-input :model-value="selected?.id" disabled /></el-form-item><el-form-item label="确认结果"><el-radio-group model-value="done"><el-radio-button label="done">已完成</el-radio-button><el-radio-button label="return">退回修改</el-radio-button><el-radio-button label="follow">继续跟踪</el-radio-button></el-radio-group></el-form-item><el-form-item label="意见"><el-input type="textarea" :rows="3" /></el-form-item></el-form><template #footer><el-button @click="reviewDialogVisible = false">取消</el-button><el-button type="primary" @click="reviewDialogVisible = false; submitAction('申请结果已确认')">提交</el-button></template></el-dialog>
    <el-drawer v-model="traceDrawerVisible" title="申请追溯" size="520px"><el-timeline><el-timeline-item timestamp="2026-05-10 08:30" type="primary">医生发起申请：{{ selected?.applyType }}</el-timeline-item><el-timeline-item timestamp="2026-05-10 09:00">目标科室接收并处理</el-timeline-item><el-timeline-item timestamp="2026-05-10 10:00" type="success">结果回写病程和工作日志</el-timeline-item></el-timeline></el-drawer>
  </section>
</template>
