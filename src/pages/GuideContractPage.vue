<script setup lang="ts">
import { ref } from 'vue';
import { CircleCheck, DocumentChecked, Files, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

type ContractRecord = {
  no: string;
  patient: string;
  followName: string;
  customerType: string;
  memberLevel: string;
  diagnosis: string;
  servicePackage: string;
  hospitalDept: string;
  doctor: string;
  nurse: string;
  startDate: string;
  endDate: string;
  status: string;
  reviewer: string;
  nextAction: string;
};

type ContractStatusRecord = {
  contractNo: string;
  changeType: string;
  fromStatus: string;
  toStatus: string;
  reason: string;
  operator: string;
  changedAt: string;
  nextAction: string;
};

const serviceDialogVisible = ref(false);
const cancelDialogVisible = ref(false);
const archiveDialogVisible = ref(false);
const statusDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const selected = ref<ContractRecord | null>(null);

const rows: ContractRecord[] = [
  { no: 'CT-202605-001', patient: '王建国 / P20260510001', followName: '王叔', customerType: '维持性血透', memberLevel: '金卡', diagnosis: 'CKD5期，维持性血液透析', servicePackage: '标准血透服务包', hospitalDept: '总院 / 血液净化中心', doctor: '张明', nurse: '周敏', startDate: '2026-05-10', endDate: '2027-05-09', status: '已签约', reviewer: '导诊王敏', nextAction: '进入归属分配' },
  { no: 'CT-202605-002', patient: '李秀兰 / P20260510002', followName: '李阿姨', customerType: '导管患者', memberLevel: '银卡', diagnosis: '糖尿病肾病，导管透析', servicePackage: '导管护理增强包', hospitalDept: '总院 / 肾内科', doctor: '陈宁', nurse: '赵玲', startDate: '2025-05-15', endDate: '2026-05-14', status: '待续约', reviewer: '导诊王敏', nextAction: '续约审核' },
  { no: 'CT-202605-003', patient: '赵明 / P20260510003', followName: '赵先生', customerType: '隔离透析', memberLevel: '专案', diagnosis: '乙肝隔离透析', servicePackage: '隔离透析服务包', hospitalDept: '东院 / 隔离透析区', doctor: '张明', nurse: '孙涛', startDate: '2026-04-01', endDate: '2027-03-31', status: '已签约', reviewer: '医务张洁', nextAction: '隔离归属分配' },
  { no: 'CT-202605-004', patient: '陈志强 / P20260510004', followName: '陈老', customerType: '临时透析', memberLevel: '普通', diagnosis: '急性肾损伤临时透析', servicePackage: '临时透析服务包', hospitalDept: '总院 / 急诊透析', doctor: '王主任', nurse: '周敏', startDate: '待定', endDate: '待定', status: '草稿', reviewer: '导诊李倩', nextAction: '补齐签约资料' },
  { no: 'CT-202605-005', patient: '吴海 / P20260510005', followName: '吴先生', customerType: '高风险随访', memberLevel: '暂停', diagnosis: 'CKD5期，转院', servicePackage: '原标准血透服务包', hospitalDept: '总院 / 血液净化中心', doctor: '刘主任', nurse: '赵玲', startDate: '2025-06-01', endDate: '2026-05-08', status: '解约待归档', reviewer: '医务张洁', nextAction: '归档退出记录' },
  { no: 'CT-202605-006', patient: '周萍 / P20260510006', followName: '周姐', customerType: '腹透转血透', memberLevel: '银卡', diagnosis: '腹透转血透', servicePackage: '标准血透服务包', hospitalDept: '西院 / 血液净化中心', doctor: '陈宁', nurse: '孙涛', startDate: '2026-05-12', endDate: '2027-05-11', status: '待复核', reviewer: '医务张洁', nextAction: '服务包复核' },
  { no: 'CT-202605-007', patient: '郑军 / P20260510007', followName: '郑先生', customerType: '维持性血透', memberLevel: '普通', diagnosis: 'CKD5期，异地备案', servicePackage: '标准血透服务包', hospitalDept: '总院 / 血液净化中心', doctor: '张明', nurse: '周敏', startDate: '2026-05-13', endDate: '2027-05-12', status: '待医保核验', reviewer: '导诊王敏', nextAction: '医保通过后签约' },
  { no: 'CT-202605-008', patient: '韩梅 / P20260510008', followName: '韩女士', customerType: '维持性血透', memberLevel: '金卡', diagnosis: '高血压肾病', servicePackage: '标准血透服务包', hospitalDept: '东院 / 血液净化中心', doctor: '刘主任', nurse: '赵玲', startDate: '2026-05-09', endDate: '2027-05-08', status: '已签约', reviewer: '导诊陈洁', nextAction: '预约申请' },
  { no: 'CT-202605-009', patient: '林建平 / P20260510009', followName: '林先生', customerType: '导管患者', memberLevel: '专案', diagnosis: '导管感染风险', servicePackage: '导管护理增强包', hospitalDept: '总院 / 血液净化中心', doctor: '王主任', nurse: '孙涛', startDate: '2026-05-14', endDate: '2027-05-13', status: '待复核', reviewer: '感控护士', nextAction: '感控复核' },
  { no: 'CT-202605-010', patient: '孙丽 / P20260510010', followName: '孙女士', customerType: '临时透析', memberLevel: '普通', diagnosis: '临时透析观察', servicePackage: '临时透析服务包', hospitalDept: '总院 / 急诊透析', doctor: '陈宁', nurse: '周敏', startDate: '待定', endDate: '待定', status: '草稿', reviewer: '导诊李倩', nextAction: '患者确认' },
];

const activeTables = ['patient_contract', 'patient_follow_alias', 'service_package', 'patient_exit_record', 'contract_status_change_log', 'sys_audit_log'];

const statusRows: ContractStatusRecord[] = [
  { contractNo: 'CT-202605-001', changeType: '新签审核', fromStatus: '草稿', toStatus: '已签约', reason: '签约单、医保、知情同意齐全', operator: '导诊王敏', changedAt: '2026-05-10 09:40', nextAction: '归属分配' },
  { contractNo: 'CT-202605-002', changeType: '续约提醒', fromStatus: '已签约', toStatus: '待续约', reason: '合同 3 日内到期', operator: '系统规则', changedAt: '2026-05-11 08:00', nextAction: '续约审核' },
  { contractNo: 'CT-202605-005', changeType: '解约登记', fromStatus: '已签约', toStatus: '解约待归档', reason: '死亡退出，等待证明附件', operator: '医务张洁', changedAt: '2026-05-09 16:25', nextAction: '资料归档' },
  { contractNo: 'CT-202605-006', changeType: '服务包变更', fromStatus: '草稿', toStatus: '待复核', reason: '腹透转血透，需调整服务包', operator: '导诊李倩', changedAt: '2026-05-12 09:30', nextAction: '医务复核' },
];

function tagType(status: string): 'success' | 'warning' | 'danger' | 'info' {
  if (status === '已签约') return 'success';
  if (status.includes('解约')) return 'danger';
  if (status.includes('待') || status === '草稿') return 'warning';
  return 'info';
}

function openService(row?: ContractRecord): void {
  selected.value = row ?? rows[0];
  serviceDialogVisible.value = true;
}

function openCancel(row: ContractRecord): void {
  selected.value = row;
  cancelDialogVisible.value = true;
}

function openArchive(row: ContractRecord): void {
  selected.value = row;
  archiveDialogVisible.value = true;
}

function openStatus(row: ContractRecord): void {
  selected.value = row;
  statusDialogVisible.value = true;
}

function openTrace(row: ContractRecord): void {
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
            <p>办理签约、续约、解约、服务包、客户类型和随访名称，决定患者能否进入责任分配与治疗预约。</p>
          </div>
          <div class="guide-actions">
            <el-button type="primary" :icon="CircleCheck" @click="openService()">新签/续约</el-button>
            <el-button :icon="DocumentChecked" @click="openArchive(rows[1])">审核归档</el-button>
            <el-button :icon="Files" @click="openStatus(rows[0])">状态变更</el-button>
            <el-button :icon="Files" @click="openTrace(rows[0])">签约追溯</el-button>
          </div>
        </div>
      </template>

      <el-form class="guide-filter" inline>
        <el-form-item label="关键词"><el-input placeholder="患者、合同号、随访名称、诊断" clearable /></el-form-item>
        <el-form-item label="服务包"><el-select placeholder="全部服务包" clearable><el-option label="标准血透服务包" value="标准血透服务包" /><el-option label="导管护理增强包" value="导管护理增强包" /><el-option label="隔离透析服务包" value="隔离透析服务包" /><el-option label="临时透析服务包" value="临时透析服务包" /></el-select></el-form-item>
        <el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="草稿" value="草稿" /><el-option label="待复核" value="待复核" /><el-option label="待续约" value="待续约" /><el-option label="已签约" value="已签约" /><el-option label="解约待归档" value="解约待归档" /></el-select></el-form-item>
        <el-form-item label="到期"><el-date-picker type="daterange" start-placeholder="开始" end-placeholder="结束" /></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <el-table :data="rows" border stripe>
        <el-table-column prop="no" label="合同号" width="145" fixed="left" />
        <el-table-column prop="patient" label="患者" min-width="165" />
        <el-table-column prop="followName" label="随访名称" width="105" />
        <el-table-column prop="customerType" label="客户类型" width="125" />
        <el-table-column prop="memberLevel" label="会员等级" width="105" />
        <el-table-column prop="diagnosis" label="主要诊断" min-width="180" />
        <el-table-column prop="servicePackage" label="服务包" min-width="160" />
        <el-table-column prop="hospitalDept" label="签约医院/科室" min-width="170" />
        <el-table-column prop="doctor" label="主诊医生" width="100" />
        <el-table-column prop="nurse" label="责任护士" width="100" />
        <el-table-column prop="startDate" label="开始日期" width="110" />
        <el-table-column prop="endDate" label="结束日期" width="110" />
        <el-table-column prop="status" label="状态" width="115"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="reviewer" label="责任人" width="105" />
        <el-table-column prop="nextAction" label="下一步" min-width="130" />
        <el-table-column label="操作" width="245" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openService(row)">签约/续约</el-button>
            <el-button link type="danger" @click="openCancel(row)">解约</el-button>
            <el-button link @click="openStatus(row)">变更</el-button>
            <el-button link @click="openArchive(row)">审核</el-button>
            <el-button link @click="openTrace(row)">追溯</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="guide-work-card" shadow="never">
      <template #header>
        <div class="guide-card-header">
          <strong>签约状态变更记录</strong>
          <el-tag type="warning" effect="plain">客户类型 / 会员等级 / 状态流转</el-tag>
        </div>
      </template>
      <el-table :data="statusRows" border stripe>
        <el-table-column prop="contractNo" label="合同号" width="145" />
        <el-table-column prop="changeType" label="变更类型" width="120" />
        <el-table-column prop="fromStatus" label="原状态" width="105" />
        <el-table-column prop="toStatus" label="新状态" width="115">
          <template #default="{ row }"><el-tag :type="tagType(row.toStatus)">{{ row.toStatus }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="reason" label="变更原因" min-width="220" />
        <el-table-column prop="operator" label="操作人" width="110" />
        <el-table-column prop="changedAt" label="变更时间" width="150" />
        <el-table-column prop="nextAction" label="下一步" min-width="120" />
      </el-table>
    </el-card>

    <el-dialog v-model="serviceDialogVisible" title="签约/续约服务表单" width="700px">
      <el-form label-width="118px">
        <el-form-item label="患者"><el-input :model-value="selected?.patient" disabled /></el-form-item>
        <el-form-item label="签约类型"><el-radio-group model-value="renew"><el-radio-button label="new">新签</el-radio-button><el-radio-button label="renew">续约</el-radio-button><el-radio-button label="change">服务包变更</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="随访名称"><el-input :model-value="selected?.followName" placeholder="用于患者端、宣教和随访提醒" /></el-form-item>
        <el-form-item label="客户/会员">
          <el-row :gutter="8">
            <el-col :span="12"><el-select :model-value="selected?.customerType" placeholder="客户类型"><el-option label="维持性血透" value="维持性血透" /><el-option label="导管患者" value="导管患者" /><el-option label="隔离透析" value="隔离透析" /><el-option label="临时透析" value="临时透析" /></el-select></el-col>
            <el-col :span="12"><el-select :model-value="selected?.memberLevel" placeholder="会员等级"><el-option label="普通" value="普通" /><el-option label="银卡" value="银卡" /><el-option label="金卡" value="金卡" /><el-option label="专案" value="专案" /><el-option label="暂停" value="暂停" /></el-select></el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="主要诊断"><el-input :model-value="selected?.diagnosis" placeholder="主诊断、并发症诊断或签约病种" /></el-form-item>
        <el-form-item label="服务包"><el-select :model-value="selected?.servicePackage" placeholder="请选择服务包"><el-option label="标准血透服务包" value="标准血透服务包" /><el-option label="导管护理增强包" value="导管护理增强包" /><el-option label="隔离透析服务包" value="隔离透析服务包" /><el-option label="临时透析服务包" value="临时透析服务包" /></el-select></el-form-item>
        <el-form-item label="签约医院科室"><el-input :model-value="selected?.hospitalDept" /></el-form-item>
        <el-form-item label="医生/护士"><el-row :gutter="8"><el-col :span="12"><el-select :model-value="selected?.doctor"><el-option label="张明" value="张明" /><el-option label="陈宁" value="陈宁" /><el-option label="刘主任" value="刘主任" /></el-select></el-col><el-col :span="12"><el-select :model-value="selected?.nurse"><el-option label="周敏" value="周敏" /><el-option label="赵玲" value="赵玲" /><el-option label="孙涛" value="孙涛" /></el-select></el-col></el-row></el-form-item>
        <el-form-item label="有效期"><el-date-picker type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" /></el-form-item>
        <el-form-item label="说明"><el-input type="textarea" :rows="3" placeholder="记录服务内容、续约原因、医保限制和特殊约定" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="serviceDialogVisible = false">取消</el-button><el-button type="primary" @click="serviceDialogVisible = false; submitAction('签约服务已保存，待复核后输出给归属分配')">保存签约</el-button></template>
    </el-dialog>

    <el-dialog v-model="cancelDialogVisible" title="解约登记" width="620px">
      <el-alert type="warning" :closable="false" show-icon title="解约会同步影响居家待办、预约、排班和费用，请确认所有未结事项。" />
      <el-form class="dialog-form" label-width="110px">
        <el-form-item label="患者"><el-input :model-value="selected?.patient" disabled /></el-form-item>
        <el-form-item label="解约原因"><el-select placeholder="请选择"><el-option label="转院" value="transfer" /><el-option label="患者申请停止服务" value="patient" /><el-option label="长期失访" value="lost" /><el-option label="死亡" value="death" /></el-select></el-form-item>
        <el-form-item label="解约日期"><el-date-picker type="date" placeholder="选择日期" /></el-form-item>
        <el-form-item label="交接清单"><el-input type="textarea" :rows="3" placeholder="预约、费用、药耗、健康档案、纸质资料和随访结论" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="cancelDialogVisible = false">取消</el-button><el-button type="danger" @click="cancelDialogVisible = false; submitAction('解约登记已提交，等待医务复核归档')">提交解约</el-button></template>
    </el-dialog>

    <el-dialog v-model="archiveDialogVisible" title="签约审核归档" width="620px">
      <el-form label-width="110px">
        <el-form-item label="合同"><el-input :model-value="selected ? `${selected.no} / ${selected.patient}` : ''" disabled /></el-form-item>
        <el-form-item label="审核结果"><el-radio-group model-value="pass"><el-radio-button label="pass">通过</el-radio-button><el-radio-button label="return">退回补正</el-radio-button><el-radio-button label="reject">不通过</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="归档材料"><el-checkbox-group model-value="contract"><el-checkbox-button label="contract">签约单</el-checkbox-button><el-checkbox-button label="consent">知情同意</el-checkbox-button><el-checkbox-button label="id">身份医保</el-checkbox-button><el-checkbox-button label="risk">风险告知</el-checkbox-button></el-checkbox-group></el-form-item>
        <el-form-item label="审核意见"><el-input type="textarea" :rows="3" placeholder="记录退回原因、缺失材料或归档说明" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="archiveDialogVisible = false">取消</el-button><el-button type="primary" @click="archiveDialogVisible = false; submitAction('签约审核已完成并写入归档记录')">提交审核</el-button></template>
    </el-dialog>

    <el-dialog v-model="statusDialogVisible" title="签约状态变更" width="640px">
      <el-form label-width="116px">
        <el-form-item label="合同"><el-input :model-value="selected ? `${selected.no} / ${selected.patient}` : ''" disabled /></el-form-item>
        <el-form-item label="变更类型"><el-select placeholder="请选择"><el-option label="新签生效" value="new" /><el-option label="续约生效" value="renew" /><el-option label="服务包变更" value="package" /><el-option label="客户类型变更" value="customer" /><el-option label="会员等级变更" value="member" /><el-option label="解约归档" value="cancel" /></el-select></el-form-item>
        <el-form-item label="状态流转"><el-row :gutter="8"><el-col :span="12"><el-input :model-value="selected?.status" disabled /></el-col><el-col :span="12"><el-select placeholder="新状态"><el-option label="待复核" value="待复核" /><el-option label="已签约" value="已签约" /><el-option label="待续约" value="待续约" /><el-option label="解约待归档" value="解约待归档" /></el-select></el-col></el-row></el-form-item>
        <el-form-item label="客户/会员"><el-row :gutter="8"><el-col :span="12"><el-select :model-value="selected?.customerType"><el-option label="维持性血透" value="维持性血透" /><el-option label="导管患者" value="导管患者" /><el-option label="隔离透析" value="隔离透析" /><el-option label="高风险随访" value="高风险随访" /></el-select></el-col><el-col :span="12"><el-select :model-value="selected?.memberLevel"><el-option label="普通" value="普通" /><el-option label="银卡" value="银卡" /><el-option label="金卡" value="金卡" /><el-option label="专案" value="专案" /></el-select></el-col></el-row></el-form-item>
        <el-form-item label="变更原因"><el-input type="textarea" :rows="3" placeholder="记录状态、客户类型或会员等级变更依据，提交后进入审计追溯" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="statusDialogVisible = false">取消</el-button><el-button type="primary" @click="statusDialogVisible = false; submitAction('签约状态变更已记录并进入审计')">保存变更</el-button></template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="签约续约解约追溯" size="540px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-10 09:00" type="primary">创建合同：{{ selected?.no }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 09:20">维护服务包、随访名称、主诊医生和责任护士</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 09:40" type="success">审核通过后同步归属分配、患者端签约和审计日志</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
