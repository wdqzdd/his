<script setup lang="ts">
import { ref } from 'vue';
import { CircleCheck, DocumentChecked, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

type AppointmentRecord = {
  requestNo: string;
  patient: string;
  requestType: string;
  assignment: string;
  mode: string;
  frequency: string;
  firstDate: string;
  shiftIntent: string;
  isolation: string;
  status: string;
  reviewer: string;
  nextAction: string;
};

type AppointmentAuditRecord = {
  requestNo: string;
  appointmentType: string;
  appointmentTime: string;
  reviewResult: string;
  reviewOpinion: string;
  reviewer: string;
  reviewedAt: string;
  nextAction: string;
};

const requestDialogVisible = ref(false);
const reviewDialogVisible = ref(false);
const returnDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const selected = ref<AppointmentRecord | null>(null);

const rows: AppointmentRecord[] = [
  { requestNo: 'REQ-202605-001', patient: '王建国 / P20260510001', requestType: '血液透析申请/预约', assignment: '张明 / 周敏 / A区一组', mode: 'HD', frequency: '每周一三五', firstDate: '2026-05-15', shiftIntent: '上午班 / A08', isolation: '无特殊隔离', status: '待审核', reviewer: '医务张洁', nextAction: '预约审核' },
  { requestNo: 'REQ-202605-002', patient: '李秀兰 / P20260510002', requestType: '特殊血液净化申请/预约', assignment: '陈宁 / 赵玲 / B区二组', mode: 'HDF+HP', frequency: '每周二四六', firstDate: '2026-05-16', shiftIntent: '下午班 / B12', isolation: '导管护理', status: '退回修改', reviewer: '医务张洁', nextAction: '调整申请' },
  { requestNo: 'REQ-202605-003', patient: '赵明 / P20260510003', requestType: '血液透析申请/预约', assignment: '张明 / 孙涛 / 隔离组', mode: 'HD', frequency: '每周一三五', firstDate: '2026-05-15', shiftIntent: '上午班 / I03', isolation: '乙肝隔离', status: '审核通过', reviewer: '医务张洁', nextAction: '进入排班' },
  { requestNo: 'REQ-202605-004', patient: '陈志强 / P20260510004', requestType: '深静脉穿刺申请/预约', assignment: '王主任 / 周敏 / 急诊组', mode: 'CVC', frequency: '临时一次', firstDate: '2026-05-14', shiftIntent: '手术室 / 置管时段', isolation: '急诊评估', status: '待补资料', reviewer: '急诊护士长', nextAction: '补签约资料' },
  { requestNo: 'REQ-202605-005', patient: '周萍 / P20260510006', requestType: '特殊血液净化申请/预约', assignment: '陈宁 / 孙涛 / C区一组', mode: 'HDF', frequency: '每周二四六', firstDate: '2026-05-16', shiftIntent: '上午班 / C06', isolation: '无特殊隔离', status: '待审核', reviewer: '医务张洁', nextAction: '容量确认' },
  { requestNo: 'REQ-202605-006', patient: '郑军 / P20260510007', requestType: '手术申请/预约', assignment: '张明 / 周敏 / A区二组', mode: 'AVF', frequency: '一次手术', firstDate: '2026-05-18', shiftIntent: '日间手术 / 第一台', isolation: '异地医保核验', status: '暂停', reviewer: '导诊王敏', nextAction: '医保核验' },
  { requestNo: 'REQ-202605-007', patient: '韩梅 / P20260510008', requestType: '血液透析申请/预约', assignment: '刘主任 / 赵玲 / D区一组', mode: 'HD', frequency: '每周二四六', firstDate: '2026-05-16', shiftIntent: '上午班 / D03', isolation: '无特殊隔离', status: '已预约', reviewer: '医务张洁', nextAction: '排班排床' },
  { requestNo: 'REQ-202605-008', patient: '林建平 / P20260510009', requestType: '随访申请/预约', assignment: '王主任 / 孙涛 / B区一组', mode: '导管随访', frequency: '每周一次', firstDate: '2026-05-15', shiftIntent: '下午门诊 / B07', isolation: '导管感染风险', status: '待审核', reviewer: '感控护士', nextAction: '感控确认' },
  { requestNo: 'REQ-202605-009', patient: '孙丽 / P20260510010', requestType: '血液透析申请/预约', assignment: '陈宁 / 周敏 / 急诊组', mode: 'HD', frequency: '临时一次', firstDate: '2026-05-14', shiftIntent: '急诊备用 / E04', isolation: '无特殊隔离', status: '待补资料', reviewer: '急诊护士长', nextAction: '身份核验' },
  { requestNo: 'REQ-202605-010', patient: '马强 / P20260510011', requestType: '随访申请/预约', assignment: '张明 / 赵玲 / 夜间组', mode: '夜间随访', frequency: '每月一次', firstDate: '2026-05-18', shiftIntent: '夜间班 / N02', isolation: '无特殊隔离', status: '审核通过', reviewer: '医务张洁', nextAction: '进入排班' },
];

const activeTables = ['service_request', 'appointment', 'appointment_review', 'patient_assignment', 'schedule_plan'];

const appointmentAuditRows: AppointmentAuditRecord[] = [
  { requestNo: 'REQ-202605-001', appointmentType: '预约记录', appointmentTime: '2026-05-15 上午班 A08', reviewResult: '待审核', reviewOpinion: '等待容量确认', reviewer: '医务张洁', reviewedAt: '2026-05-10 11:00', nextAction: '预约审核' },
  { requestNo: 'REQ-202605-002', appointmentType: '审核记录', appointmentTime: '2026-05-16 下午班 B12', reviewResult: '退回修改', reviewOpinion: '特殊净化模式需补医嘱依据', reviewer: '医务张洁', reviewedAt: '2026-05-10 11:20', nextAction: '补正申请' },
  { requestNo: 'REQ-202605-004', appointmentType: '预约记录', appointmentTime: '2026-05-14 置管时段', reviewResult: '待补资料', reviewOpinion: '深静脉穿刺知情同意缺失', reviewer: '急诊护士长', reviewedAt: '2026-05-10 11:35', nextAction: '补签文书' },
  { requestNo: 'REQ-202605-006', appointmentType: '审核记录', appointmentTime: '2026-05-18 日间手术', reviewResult: '暂停', reviewOpinion: '医保备案未通过，手术预约暂缓', reviewer: '导诊王敏', reviewedAt: '2026-05-10 13:10', nextAction: '医保核验' },
  { requestNo: 'REQ-202605-008', appointmentType: '预约记录', appointmentTime: '2026-05-15 下午门诊', reviewResult: '待审核', reviewOpinion: '随访申请需感控确认', reviewer: '感控护士', reviewedAt: '2026-05-10 14:20', nextAction: '感控确认' },
];

function tagType(status: string): 'success' | 'warning' | 'danger' | 'info' {
  if (['审核通过', '已预约'].includes(status)) return 'success';
  if (['退回修改', '暂停'].includes(status)) return 'danger';
  if (status.includes('待')) return 'warning';
  return 'info';
}

function openRequest(row?: AppointmentRecord): void {
  selected.value = row ?? rows[0];
  requestDialogVisible.value = true;
}

function openReview(row: AppointmentRecord): void {
  selected.value = row;
  reviewDialogVisible.value = true;
}

function openReturn(row: AppointmentRecord): void {
  selected.value = row;
  returnDialogVisible.value = true;
}

function openTrace(row: AppointmentRecord): void {
  selected.value = row;
  traceDrawerVisible.value = true;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}
</script>

<template>
  <section class="guide-desk-page">
    <el-card class="guide-work-card" shadow="never">
      <template #header>
        <div class="guide-work-header">
          <div>
            <h2>{{ context.menuTitle }}</h2>
            <p>基于患者签约和责任归属发起治疗/随访申请，审核班次、机位、隔离要求和容量后输出给排班排床。</p>
          </div>
          <div class="guide-actions">
            <el-button type="primary" :icon="CircleCheck" @click="openRequest()">发起申请</el-button>
            <el-button :icon="DocumentChecked" @click="openReview(rows[0])">预约审核</el-button>
            <el-button :icon="Warning" @click="openReturn(rows[1])">退回修改</el-button>
          </div>
        </div>
      </template>

      <el-form class="guide-filter" inline>
        <el-form-item label="关键词"><el-input placeholder="申请号、患者、医生、护士、机位" clearable /></el-form-item>
        <el-form-item label="透析模式"><el-select placeholder="全部模式" clearable><el-option label="HD" value="HD" /><el-option label="HDF" value="HDF" /><el-option label="HP" value="HP" /></el-select></el-form-item>
        <el-form-item label="申请类型"><el-select placeholder="全部类型" clearable><el-option label="血液透析申请/预约" value="hd" /><el-option label="特殊血液净化申请/预约" value="special" /><el-option label="深静脉穿刺申请/预约" value="cvc" /><el-option label="手术申请/预约" value="surgery" /><el-option label="随访申请/预约" value="follow" /></el-select></el-form-item>
        <el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="待审核" value="待审核" /><el-option label="退回修改" value="退回修改" /><el-option label="审核通过" value="审核通过" /><el-option label="已预约" value="已预约" /></el-select></el-form-item>
        <el-form-item label="首次日期"><el-date-picker type="date" placeholder="选择日期" /></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <el-table :data="rows" border stripe>
        <el-table-column prop="requestNo" label="申请号" width="145" fixed="left" />
        <el-table-column prop="patient" label="患者" min-width="165" />
        <el-table-column prop="requestType" label="申请/预约类型" min-width="175" />
        <el-table-column prop="assignment" label="责任归属" min-width="180" />
        <el-table-column prop="mode" label="模式" width="80" />
        <el-table-column prop="frequency" label="频次" width="115" />
        <el-table-column prop="firstDate" label="首次日期" width="110" />
        <el-table-column prop="shiftIntent" label="班次/机位意向" min-width="145" />
        <el-table-column prop="isolation" label="隔离/风险要求" min-width="140" />
        <el-table-column prop="status" label="状态" width="110"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="reviewer" label="审核人" width="110" />
        <el-table-column prop="nextAction" label="下一步" min-width="120" />
        <el-table-column label="操作" width="245" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openRequest(row)">申请</el-button>
            <el-button link @click="openReview(row)">审核</el-button>
            <el-button link type="danger" @click="openReturn(row)">退回</el-button>
            <el-button link @click="openTrace(row)">追溯</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="guide-work-card" shadow="never">
      <template #header>
        <div class="guide-card-header">
          <strong>预约记录与审核记录</strong>
          <el-tag type="warning" effect="plain">覆盖申请、预约、审核留痕</el-tag>
        </div>
      </template>
      <el-table :data="appointmentAuditRows" border stripe>
        <el-table-column prop="requestNo" label="申请号" width="145" />
        <el-table-column prop="appointmentType" label="记录类型" width="110" />
        <el-table-column prop="appointmentTime" label="预约时间/资源" min-width="180" />
        <el-table-column prop="reviewResult" label="审核结果" width="110">
          <template #default="{ row }"><el-tag :type="tagType(row.reviewResult)">{{ row.reviewResult }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="reviewOpinion" label="审核意见" min-width="220" />
        <el-table-column prop="reviewer" label="审核人" width="110" />
        <el-table-column prop="reviewedAt" label="记录时间" width="150" />
        <el-table-column prop="nextAction" label="下一步" min-width="120" />
      </el-table>
    </el-card>

    <el-dialog v-model="requestDialogVisible" title="治疗/随访申请" width="700px">
      <el-form label-width="118px">
        <el-form-item label="患者"><el-input :model-value="selected?.patient" disabled /></el-form-item>
        <el-form-item label="责任归属"><el-input :model-value="selected?.assignment" disabled /></el-form-item>
        <el-form-item label="申请类型"><el-select :model-value="selected?.requestType"><el-option label="血液透析申请/预约" value="血液透析申请/预约" /><el-option label="特殊血液净化申请/预约" value="特殊血液净化申请/预约" /><el-option label="深静脉穿刺申请/预约" value="深静脉穿刺申请/预约" /><el-option label="手术申请/预约" value="手术申请/预约" /><el-option label="随访申请/预约" value="随访申请/预约" /></el-select></el-form-item>
        <el-form-item label="模式/项目"><el-select :model-value="selected?.mode"><el-option label="HD" value="HD" /><el-option label="HDF" value="HDF" /><el-option label="HP" value="HP" /><el-option label="HDF+HP" value="HDF+HP" /><el-option label="深静脉置管" value="CVC" /><el-option label="内瘘手术" value="AVF" /><el-option label="专家随访" value="follow" /></el-select></el-form-item>
        <el-form-item label="频次/班次"><el-row :gutter="8"><el-col :span="12"><el-input :model-value="selected?.frequency" /></el-col><el-col :span="12"><el-input :model-value="selected?.shiftIntent" /></el-col></el-row></el-form-item>
        <el-form-item label="首次预约"><el-date-picker type="date" :placeholder="selected?.firstDate" /></el-form-item>
        <el-form-item label="隔离要求"><el-select :model-value="selected?.isolation"><el-option label="无特殊隔离" value="无特殊隔离" /><el-option label="乙肝隔离" value="乙肝隔离" /><el-option label="导管护理" value="导管护理" /><el-option label="急诊评估" value="急诊评估" /></el-select></el-form-item>
        <el-form-item label="申请依据"><el-input type="textarea" :rows="3" placeholder="医嘱依据、首透要求、病情风险、患者偏好和资料缺项" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="requestDialogVisible = false">取消</el-button><el-button type="primary" @click="requestDialogVisible = false; submitAction('治疗申请已提交，等待预约审核')">提交申请</el-button></template>
    </el-dialog>

    <el-dialog v-model="reviewDialogVisible" title="预约审核" width="660px">
      <el-alert type="info" show-icon :closable="false" title="审核需要同时确认签约、责任归属、隔离要求、机位容量和班次资源。" />
      <el-form class="dialog-form" label-width="118px">
        <el-form-item label="申请"><el-input :model-value="selected ? `${selected.requestNo} / ${selected.patient}` : ''" disabled /></el-form-item>
        <el-form-item label="审核结果"><el-radio-group model-value="pass"><el-radio-button label="pass">通过</el-radio-button><el-radio-button label="return">退回修改</el-radio-button><el-radio-button label="reject">不通过</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="建议班次机位"><el-input :model-value="selected?.shiftIntent" /></el-form-item>
        <el-form-item label="容量确认"><el-checkbox-group model-value="contract"><el-checkbox-button label="contract">签约有效</el-checkbox-button><el-checkbox-button label="assignment">归属有效</el-checkbox-button><el-checkbox-button label="capacity">班次有容量</el-checkbox-button><el-checkbox-button label="isolation">隔离可安排</el-checkbox-button></el-checkbox-group></el-form-item>
        <el-form-item label="审核意见"><el-input type="textarea" :rows="3" placeholder="通过、退回或不通过原因；输出给排班排床的注意事项" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="reviewDialogVisible = false">取消</el-button><el-button type="primary" @click="reviewDialogVisible = false; submitAction('预约审核已完成，输出给排班排床')">提交审核</el-button></template>
    </el-dialog>

    <el-dialog v-model="returnDialogVisible" title="退回修改" width="600px">
      <el-form label-width="110px">
        <el-form-item label="申请"><el-input :model-value="selected?.requestNo" disabled /></el-form-item>
        <el-form-item label="退回原因"><el-select placeholder="请选择"><el-option label="签约未生效" value="contract" /><el-option label="责任归属未复核" value="assignment" /><el-option label="班次容量不足" value="capacity" /><el-option label="隔离要求不清" value="isolation" /></el-select></el-form-item>
        <el-form-item label="补正要求"><el-input type="textarea" :rows="3" placeholder="明确需要导诊、医务或患者补正的信息" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="returnDialogVisible = false">取消</el-button><el-button type="danger" @click="returnDialogVisible = false; submitAction('申请已退回并生成补正待办')">确认退回</el-button></template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="申请预约追溯" size="540px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-10 10:20" type="primary">归属分配完成后创建治疗申请：{{ selected?.requestNo }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 10:30">导诊提交模式、频次、班次、隔离要求和首次预约日期</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 11:00" type="success">医务审核通过后写入预约记录，等待排班排床引用</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
