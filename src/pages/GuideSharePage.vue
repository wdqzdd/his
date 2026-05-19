<script setup lang="ts">
import { ref } from 'vue';
import { CircleCheck, DocumentChecked, Search, UserFilled } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

type ShareRecord = {
  patient: string;
  primaryTeam: string;
  sharedTeam: string;
  shareReason: string;
  dataScope: string;
  startDate: string;
  endDate: string;
  status: string;
  owner: string;
  nextAction: string;
};

type StaffCallRecord = {
  callNo: string;
  patient: string;
  callTarget: string;
  callReason: string;
  urgency: string;
  responseStatus: string;
  caller: string;
  calledAt: string;
  nextAction: string;
};

const shareDialogVisible = ref(false);
const callDialogVisible = ref(false);
const reviewDialogVisible = ref(false);
const stopDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const selected = ref<ShareRecord | null>(null);

const rows: ShareRecord[] = [
  { patient: '王建国 / P20260510001', primaryTeam: '王主任团队', sharedTeam: '营养师团队', shareReason: '血磷偏高饮食干预', dataScope: '检验趋势、饮食任务、健康档案', startDate: '2026-05-10', endDate: '2026-06-10', status: '协管中', owner: '张明', nextAction: '营养随访' },
  { patient: '李秀兰 / P20260510002', primaryTeam: '血管通路团队', sharedTeam: '感控小组', shareReason: '导管感染风险', dataScope: '通路记录、感控事件、宣教任务', startDate: '2026-05-10', endDate: '2026-05-31', status: '待复核', owner: '赵玲', nextAction: '感控复核' },
  { patient: '赵明 / P20260510003', primaryTeam: '隔离透析团队', sharedTeam: '感控小组', shareReason: '乙肝隔离管理', dataScope: '隔离标识、透析记录、感控检查', startDate: '2026-05-10', endDate: '2027-05-09', status: '协管中', owner: '孙涛', nextAction: '隔离预约' },
  { patient: '陈志强 / P20260510004', primaryTeam: '急诊透析团队', sharedTeam: '医务医事', shareReason: '临时透析准入审核', dataScope: '签约草稿、知情同意、急诊记录', startDate: '2026-05-14', endDate: '2026-05-16', status: '待确认', owner: '急诊护士长', nextAction: '补录资料' },
  { patient: '周萍 / P20260510006', primaryTeam: '腹透转血透团队', sharedTeam: '血管通路团队', shareReason: '转血透通路评估', dataScope: '通路评估、检查报告、医生病程', startDate: '2026-05-12', endDate: '2026-06-12', status: '协管中', owner: '陈宁', nextAction: '通路评估' },
  { patient: '郑军 / P20260510007', primaryTeam: '王主任团队', sharedTeam: '医保协同组', shareReason: '异地医保备案', dataScope: '医保资料、费用提醒、签约状态', startDate: '2026-05-13', endDate: '2026-05-20', status: '待复核', owner: '导诊王敏', nextAction: '备案核验' },
  { patient: '韩梅 / P20260510008', primaryTeam: '刘主任团队', sharedTeam: '护士宣教组', shareReason: '新患者宣教', dataScope: '居家任务、宣教完成、知情同意', startDate: '2026-05-10', endDate: '2026-06-10', status: '协管中', owner: '赵玲', nextAction: '宣教跟进' },
  { patient: '林建平 / P20260510009', primaryTeam: '导管护理团队', sharedTeam: '感控小组', shareReason: '导管感染预警', dataScope: '临床事件、通路记录、感控整改', startDate: '2026-05-10', endDate: '2026-05-24', status: '协管中', owner: '感控护士', nextAction: '预警复查' },
  { patient: '孙丽 / P20260510010', primaryTeam: '急诊透析团队', sharedTeam: '导诊台', shareReason: '身份资料补齐', dataScope: '患者主档、同意书、临时申请', startDate: '2026-05-14', endDate: '2026-05-15', status: '待确认', owner: '导诊李倩', nextAction: '身份核验' },
  { patient: '马强 / P20260510011', primaryTeam: '夜间透析团队', sharedTeam: '医务医事', shareReason: '夜间班转组', dataScope: '排班、机位、责任分配', startDate: '2026-05-18', endDate: '2026-06-18', status: '待停止', owner: '医务张洁', nextAction: '停止复核' },
];

const activeTables = ['patient_assignment', 'share_collaboration', 'sys_permission_scope', 'assignment_change_log'];

const staffCallRows: StaffCallRecord[] = [
  { callNo: 'CALL-001', patient: '王建国 / P20260510001', callTarget: '主诊医生 张明', callReason: '高钾复查结果已出，需确认是否调整透析处方', urgency: '紧急', responseStatus: '已响应', caller: '导诊王敏', calledAt: '2026-05-10 08:40', nextAction: '医生处理' },
  { callNo: 'CALL-002', patient: '李秀兰 / P20260510002', callTarget: '责任护士 赵玲', callReason: '导管患者到院，需协助核对置管资料', urgency: '普通', responseStatus: '待响应', caller: '导诊王敏', calledAt: '2026-05-10 09:12', nextAction: '护士接收' },
  { callNo: 'CALL-003', patient: '赵明 / P20260510003', callTarget: '感控护士', callReason: '乙肝隔离患者提前到院，需确认隔离通道', urgency: '紧急', responseStatus: '处理中', caller: '导诊陈洁', calledAt: '2026-05-10 09:30', nextAction: '隔离引导' },
  { callNo: 'CALL-004', patient: '陈志强 / P20260510004', callTarget: '急诊护士长', callReason: '临时透析资料缺失，家属已到窗口', urgency: '紧急', responseStatus: '已响应', caller: '导诊李倩', calledAt: '2026-05-10 10:15', nextAction: '补录签署' },
  { callNo: 'CALL-005', patient: '林建平 / P20260510009', callTarget: '血管通路团队', callReason: '导管感染风险随访需加急评估', urgency: '普通', responseStatus: '待响应', caller: '感控护士', calledAt: '2026-05-10 14:10', nextAction: '通路评估' },
];

function tagType(status: string): 'success' | 'warning' | 'danger' | 'info' {
  if (status === '协管中') return 'success';
  if (status.includes('待停止')) return 'danger';
  if (status.includes('待')) return 'warning';
  return 'info';
}

function openShare(row?: ShareRecord): void {
  selected.value = row ?? rows[0];
  shareDialogVisible.value = true;
}

function openCall(row?: ShareRecord): void {
  selected.value = row ?? rows[0];
  callDialogVisible.value = true;
}

function openReview(row: ShareRecord): void {
  selected.value = row;
  reviewDialogVisible.value = true;
}

function openStop(row: ShareRecord): void {
  selected.value = row;
  stopDialogVisible.value = true;
}

function openTrace(row: ShareRecord): void {
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
            <p>为跨团队协作开通患者数据共享范围和协管责任，处理营养、感控、医保、通路、急诊等跨角色事项。</p>
          </div>
          <div class="guide-actions">
            <el-button type="primary" :icon="UserFilled" @click="openShare()">新增协管</el-button>
            <el-button :icon="CircleCheck" @click="openCall(rows[0])">呼叫医护</el-button>
            <el-button :icon="CircleCheck" @click="openReview(rows[1])">协管复核</el-button>
            <el-button :icon="DocumentChecked" @click="openTrace(rows[0])">协管追溯</el-button>
          </div>
        </div>
      </template>

      <el-form class="guide-filter" inline>
        <el-form-item label="关键词"><el-input placeholder="患者、主责团队、协管团队、原因" clearable /></el-form-item>
        <el-form-item label="协管团队"><el-select placeholder="全部团队" clearable><el-option label="感控小组" value="感控小组" /><el-option label="营养师团队" value="营养师团队" /><el-option label="血管通路团队" value="血管通路团队" /><el-option label="医务医事" value="医务医事" /></el-select></el-form-item>
        <el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="待确认" value="待确认" /><el-option label="待复核" value="待复核" /><el-option label="协管中" value="协管中" /><el-option label="待停止" value="待停止" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <el-table :data="rows" border stripe>
        <el-table-column prop="patient" label="患者" min-width="165" fixed="left" />
        <el-table-column prop="primaryTeam" label="主责团队" min-width="135" />
        <el-table-column prop="sharedTeam" label="协管团队" min-width="135" />
        <el-table-column prop="shareReason" label="协管原因" min-width="170" />
        <el-table-column prop="dataScope" label="数据范围" min-width="220" />
        <el-table-column prop="startDate" label="开始日期" width="110" />
        <el-table-column prop="endDate" label="结束日期" width="110" />
        <el-table-column prop="status" label="状态" width="105"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="owner" label="责任人" width="110" />
        <el-table-column prop="nextAction" label="下一步" min-width="120" />
        <el-table-column label="操作" width="230" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openShare(row)">维护</el-button>
            <el-button link @click="openReview(row)">复核</el-button>
            <el-button link type="danger" @click="openStop(row)">停止</el-button>
            <el-button link @click="openTrace(row)">追溯</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="guide-work-card" shadow="never">
      <template #header>
        <div class="guide-card-header">
          <strong>呼叫医护记录</strong>
          <el-tag type="warning" effect="plain">导诊台跨角色即时协同</el-tag>
        </div>
      </template>
      <el-table :data="staffCallRows" border stripe>
        <el-table-column prop="callNo" label="呼叫号" width="105" />
        <el-table-column prop="patient" label="患者" min-width="165" />
        <el-table-column prop="callTarget" label="呼叫对象" min-width="135" />
        <el-table-column prop="callReason" label="呼叫原因" min-width="240" />
        <el-table-column prop="urgency" label="紧急度" width="90">
          <template #default="{ row }"><el-tag :type="row.urgency === '紧急' ? 'danger' : 'info'">{{ row.urgency }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="responseStatus" label="响应状态" width="105">
          <template #default="{ row }"><el-tag :type="row.responseStatus === '已响应' ? 'success' : row.responseStatus === '处理中' ? 'warning' : 'danger'">{{ row.responseStatus }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="caller" label="呼叫人" width="105" />
        <el-table-column prop="calledAt" label="呼叫时间" width="150" />
        <el-table-column prop="nextAction" label="下一步" min-width="120" />
      </el-table>
    </el-card>

    <el-dialog v-model="shareDialogVisible" title="共享协管维护" width="680px">
      <el-form label-width="110px">
        <el-form-item label="患者"><el-input :model-value="selected?.patient" disabled /></el-form-item>
        <el-form-item label="主责团队"><el-input :model-value="selected?.primaryTeam" disabled /></el-form-item>
        <el-form-item label="协管团队"><el-select :model-value="selected?.sharedTeam"><el-option label="感控小组" value="感控小组" /><el-option label="营养师团队" value="营养师团队" /><el-option label="血管通路团队" value="血管通路团队" /><el-option label="医务医事" value="医务医事" /></el-select></el-form-item>
        <el-form-item label="数据范围"><el-checkbox-group model-value="lab"><el-checkbox-button label="lab">检验趋势</el-checkbox-button><el-checkbox-button label="record">治疗记录</el-checkbox-button><el-checkbox-button label="event">临床事件</el-checkbox-button><el-checkbox-button label="profile">健康档案</el-checkbox-button><el-checkbox-button label="fee">费用医保</el-checkbox-button></el-checkbox-group></el-form-item>
        <el-form-item label="有效期"><el-date-picker type="daterange" start-placeholder="开始" end-placeholder="结束" /></el-form-item>
        <el-form-item label="协管原因"><el-input type="textarea" :rows="3" :model-value="selected?.shareReason" placeholder="记录协管目的、处理要求和关闭条件" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="shareDialogVisible = false">取消</el-button><el-button type="primary" @click="shareDialogVisible = false; submitAction('共享协管已保存，等待权限复核')">保存协管</el-button></template>
    </el-dialog>

    <el-dialog v-model="callDialogVisible" title="呼叫医护" width="620px">
      <el-form label-width="112px">
        <el-form-item label="患者"><el-input :model-value="selected?.patient" disabled /></el-form-item>
        <el-form-item label="呼叫对象"><el-select placeholder="请选择"><el-option label="主诊医生" value="doctor" /><el-option label="责任护士" value="nurse" /><el-option label="感控护士" value="infection" /><el-option label="急诊护士长" value="emergency" /><el-option label="血管通路团队" value="access" /></el-select></el-form-item>
        <el-form-item label="紧急度"><el-radio-group model-value="normal"><el-radio-button label="urgent">紧急</el-radio-button><el-radio-button label="normal">普通</el-radio-button><el-radio-button label="notice">通知</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="呼叫原因"><el-input type="textarea" :rows="3" placeholder="记录患者到院、危急值、资料缺失、隔离引导、导管风险等需要医护响应的事项" /></el-form-item>
        <el-form-item label="期望响应"><el-input placeholder="例如：10分钟内确认、到导诊台处理、电话回复" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="callDialogVisible = false">取消</el-button><el-button type="primary" @click="callDialogVisible = false; submitAction('呼叫医护记录已生成，并推送到员工主页待办')">发起呼叫</el-button></template>
    </el-dialog>

    <el-dialog v-model="reviewDialogVisible" title="协管权限复核" width="600px">
      <el-form label-width="110px">
        <el-form-item label="患者"><el-input :model-value="selected?.patient" disabled /></el-form-item>
        <el-form-item label="复核结果"><el-radio-group model-value="pass"><el-radio-button label="pass">通过</el-radio-button><el-radio-button label="return">退回</el-radio-button><el-radio-button label="deny">不通过</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="复核意见"><el-input type="textarea" :rows="3" placeholder="记录权限范围、协管期限和退回原因" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="reviewDialogVisible = false">取消</el-button><el-button type="primary" @click="reviewDialogVisible = false; submitAction('协管权限复核已完成')">提交复核</el-button></template>
    </el-dialog>

    <el-dialog v-model="stopDialogVisible" title="停止协管" width="580px">
      <el-form label-width="110px">
        <el-form-item label="患者"><el-input :model-value="selected?.patient" disabled /></el-form-item>
        <el-form-item label="停止原因"><el-select placeholder="请选择"><el-option label="任务完成" value="done" /><el-option label="到期关闭" value="expired" /><el-option label="授权撤回" value="cancel" /><el-option label="误开通" value="wrong" /></el-select></el-form-item>
        <el-form-item label="交接说明"><el-input type="textarea" :rows="3" placeholder="记录未完成事项、归档材料和后续责任人" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="stopDialogVisible = false">取消</el-button><el-button type="danger" @click="stopDialogVisible = false; submitAction('停止协管申请已提交，等待复核')">提交停止</el-button></template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="共享协管追溯" size="540px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-10 10:30" type="primary">创建协管：{{ selected?.sharedTeam }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 10:40">复核数据范围、协管原因和有效期</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 11:00" type="success">协管权限生效并同步相关工作站</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
