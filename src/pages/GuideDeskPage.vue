<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  CircleCheck,
  DocumentChecked,
  EditPen,
  Files,
  Search,
  Upload,
  UserFilled,
  Warning,
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{
  context: PageContext;
}>();

type PatientRow = {
  no: string;
  name: string;
  sexAge: string;
  idCard: string;
  phone: string;
  insurance: string;
  customerType: string;
  contract: string;
  package: string;
  alias: string;
  status: string;
  next: string;
};

const patientDrawerVisible = ref(false);
const contractDialogVisible = ref(false);
const contactDrawerVisible = ref(false);
const exitDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const assignmentDrawerVisible = ref(false);
const appointmentDialogVisible = ref(false);
const reviewDialogVisible = ref(false);
const selectedRow = ref<PatientRow | null>(null);

const tableMap = {
  'guide-home': ['patient_master', 'patient_contact', 'patient_insurance', 'patient_contract'],
  'guide-patient': ['patient_master', 'patient_contact', 'patient_insurance'],
  'guide-contract': ['patient_contract', 'patient_follow_alias', 'patient_exit_record'],
  'guide-follow-name': ['patient_follow_alias', 'patient_contract', 'sys_audit_log'],
  'guide-owner': ['patient_assignment', 'service_request', 'assignment_change_log'],
  'guide-appointment': ['service_request', 'appointment', 'appointment_review', 'patient_assignment'],
} as Record<string, string[]>;

const patientRows: PatientRow[] = [
  {
    no: 'P20260510001',
    name: '王建国',
    sexAge: '男 / 58岁',
    idCard: '3301********2218',
    phone: '138****6721',
    insurance: '职工医保',
    customerType: '维持性血透',
    contract: '已签约',
    package: '标准血透服务包',
    alias: '王叔',
    status: '在管',
    next: '进入归属分配',
  },
  {
    no: 'P20260510002',
    name: '李秀兰',
    sexAge: '女 / 64岁',
    idCard: '3205********0936',
    phone: '139****2860',
    insurance: '居民医保',
    customerType: '导管患者',
    contract: '待续约',
    package: '导管护理增强包',
    alias: '李阿姨',
    status: '待确认',
    next: '续约后预约',
  },
  {
    no: 'P20260510003',
    name: '赵明',
    sexAge: '男 / 42岁',
    idCard: '3412********4412',
    phone: '136****9012',
    insurance: '异地医保',
    customerType: '隔离透析',
    contract: '已签约',
    package: '隔离透析服务包',
    alias: '赵先生',
    status: '在管',
    next: '隔离区归属',
  },
  {
    no: 'P20260510004',
    name: '陈志强',
    sexAge: '男 / 71岁',
    idCard: '3101********7829',
    phone: '135****6180',
    insurance: '自费',
    customerType: '临时透析',
    contract: '草稿',
    package: '临时透析服务包',
    alias: '陈老',
    status: '建档中',
    next: '补齐联系人',
  },
  {
    no: 'P20260510005',
    name: '吴海',
    sexAge: '男 / 53岁',
    idCard: '3306********1833',
    phone: '137****4522',
    insurance: '职工医保',
    customerType: '高风险随访',
    contract: '已解约',
    package: '原标准血透服务包',
    alias: '吴先生',
    status: '退出待归档',
    next: '退出原因归档',
  },
];

const followRows: PatientRow[] = [
  { ...patientRows[0], alias: '王叔 / 家属称呼', contract: '已启用', status: '启用', next: '用于随访提醒' },
  { ...patientRows[1], alias: '李阿姨 / 护理组备注', contract: '待复核', status: '待复核', next: '复核后启用' },
  { ...patientRows[2], alias: '赵先生 / 隔离区', contract: '已启用', status: '启用', next: '用于隔离标识' },
];

const assignmentRows: PatientRow[] = [
  { ...patientRows[0], contract: '已签约', package: '王主任团队 / 张明 / 周敏 / A区一组 / A08', status: '已分配', next: '发起治疗申请' },
  { ...patientRows[1], contract: '待续约', package: '血管通路团队 / 陈宁 / 赵玲 / B区二组 / B12', status: '待复核', next: '复核归属' },
  { ...patientRows[2], contract: '已签约', package: '隔离透析团队 / 张明 / 孙涛 / 隔离组 / I03', status: '已分配', next: '隔离预约' },
  { ...patientRows[3], contract: '草稿', package: '未分配', status: '待分配', next: '补齐签约后分配' },
];

const appointmentRows: PatientRow[] = [
  { ...patientRows[0], contract: '申请已提交', package: 'HD / 每周一三五 / 上午班', status: '待审核', next: '医务审核' },
  { ...patientRows[1], contract: '审核退回', package: 'HDF / 每周二四六 / 下午班', status: '退回修改', next: '调整申请' },
  { ...patientRows[2], contract: '审核通过', package: 'HD / 每周一三五 / 隔离区上午班', status: '已预约', next: '进入排班' },
  { ...patientRows[4], contract: '暂停申请', package: '原 HD / 周二四六', status: '暂停', next: '退出归档' },
];

const mode = computed(() => {
  if (props.context.menuKey === 'guide-contract') return 'contract';
  if (props.context.menuKey === 'guide-follow-name') return 'follow';
  if (props.context.menuKey === 'guide-owner') return 'owner';
  if (props.context.menuKey === 'guide-appointment') return 'appointment';
  if (props.context.menuKey === 'guide-patient') return 'patient';
  return 'home';
});

const rows = computed(() => {
  if (mode.value === 'follow') return followRows;
  if (mode.value === 'owner') return assignmentRows;
  if (mode.value === 'appointment') return appointmentRows;
  return patientRows;
});
const activeTables = computed(() => tableMap[props.context.menuKey] ?? tableMap['guide-home']);

const pageHint = computed(() => {
  const map: Record<string, string> = {
    home: '集中处理新患者接入、资料补齐、签约续约、退出归档和进入下一步分配的导诊任务。',
    patient: '维护患者主档、联系人、医保和基础身份信息，保证后续医嘱、预约和费用使用同一患者主索引。',
    contract: '维护签约、续约、解约、服务包和客户类型，决定患者是否可以进入归属分配和预约。',
    follow: '维护患者随访称呼、风险备注和提醒展示名，便于随访、宣教和护理沟通。',
    owner: '为已签约患者分配随访医院、科室、专家团队、护理组、机位、主诊医生和责任护士。',
    appointment: '根据患者归属和治疗申请进行预约审核，审核通过后输出给排班排床。',
  };
  return map[mode.value];
});

const metrics = computed(() => [
  { label: mode.value === 'appointment' ? '待审申请' : '今日新增', value: mode.value === 'appointment' ? 12 : 8, tone: 'blue' },
  { label: mode.value === 'owner' ? '待分配' : '待签/续约', value: mode.value === 'owner' ? 5 : 6, tone: 'orange' },
  { label: mode.value === 'appointment' ? '退回修改' : '资料待补齐', value: mode.value === 'appointment' ? 2 : 4, tone: 'red' },
  { label: mode.value === 'owner' ? '已完成归属' : '可进入分配', value: mode.value === 'owner' ? 36 : 18, tone: 'green' },
]);

function tagType(status: string): 'success' | 'warning' | 'danger' | 'info' {
  if (['在管', '启用', '已签约'].includes(status)) return 'success';
  if (['已分配', '审核通过', '已预约'].includes(status)) return 'success';
  if (['待确认', '建档中', '待复核', '草稿', '待续约', '待分配', '待审核'].includes(status)) return 'warning';
  if (['退出待归档', '已解约', '退回修改', '暂停'].includes(status)) return 'danger';
  return 'info';
}

function openPatient(row?: PatientRow): void {
  selectedRow.value = row ?? null;
  patientDrawerVisible.value = true;
}

function openContract(row?: PatientRow): void {
  selectedRow.value = row ?? rows.value[0] ?? null;
  contractDialogVisible.value = true;
}

function openContact(row: PatientRow): void {
  selectedRow.value = row;
  contactDrawerVisible.value = true;
}

function openExit(row: PatientRow): void {
  selectedRow.value = row;
  exitDialogVisible.value = true;
}

function openAssignment(row?: PatientRow): void {
  selectedRow.value = row ?? rows.value[0] ?? null;
  assignmentDrawerVisible.value = true;
}

function openAppointment(row?: PatientRow): void {
  selectedRow.value = row ?? rows.value[0] ?? null;
  appointmentDialogVisible.value = true;
}

function openReview(row: PatientRow): void {
  selectedRow.value = row;
  reviewDialogVisible.value = true;
}

function openTrace(row: PatientRow): void {
  selectedRow.value = row;
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
            <p>{{ pageHint }}</p>
          </div>
          <div class="guide-actions">
            <el-button v-if="mode === 'owner'" type="primary" :icon="UserFilled" @click="openAssignment()">分配归属</el-button>
            <el-button v-else-if="mode === 'appointment'" type="primary" :icon="CircleCheck" @click="openAppointment()">发起申请</el-button>
            <el-button v-else type="primary" :icon="UserFilled" @click="openPatient()">新增患者</el-button>
            <el-button v-if="mode === 'appointment'" :icon="DocumentChecked" @click="openReview(rows[0])">预约审核</el-button>
            <el-button v-else :icon="CircleCheck" @click="openContract()">快速签约</el-button>
            <el-button :icon="Upload">批量导入</el-button>
            <el-button :icon="DocumentChecked" @click="openTrace(rows[0])">建档追溯</el-button>
          </div>
        </div>
      </template>

      <el-form class="guide-filter" inline>
        <el-form-item label="关键词">
          <el-input placeholder="姓名、患者号、证件、电话或随访名" clearable />
        </el-form-item>
        <el-form-item label="客户类型">
          <el-select placeholder="全部类型" clearable>
            <el-option label="维持性血透" value="mhd" />
            <el-option label="导管患者" value="catheter" />
            <el-option label="隔离透析" value="isolation" />
            <el-option label="临时透析" value="temporary" />
          </el-select>
        </el-form-item>
        <el-form-item label="签约状态">
          <el-select placeholder="全部状态" clearable>
            <el-option label="草稿" value="draft" />
            <el-option label="已签约" value="signed" />
            <el-option label="待续约" value="renew" />
            <el-option label="已解约" value="cancelled" />
          </el-select>
        </el-form-item>
        <el-form-item label="医保">
          <el-select placeholder="全部医保" clearable>
            <el-option label="职工医保" value="employee" />
            <el-option label="居民医保" value="resident" />
            <el-option label="异地医保" value="remote" />
            <el-option label="自费" value="self" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>

      <div class="guide-stat-grid">
        <el-card v-for="item in metrics" :key="item.label" :class="['guide-stat-card', item.tone]" shadow="never">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </el-card>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :xl="17">
          <el-card class="guide-main-card" shadow="never">
            <template #header>
              <div class="guide-card-header">
                <div>
                  <strong>{{ mode === 'follow' ? '随访名称列表' : mode === 'owner' ? '归属分配列表' : mode === 'appointment' ? '治疗申请与预约列表' : '患者接入列表' }}</strong>
                  <p>{{ mode === 'owner' ? '已签约患者分配责任医生、责任护士、护理组和机位后，医生站和护士站才能看到责任患者。' : mode === 'appointment' ? '治疗申请审核通过后输出预约时间、班次意向和隔离要求，供排班排床引用。' : '患者主档、联系人、医保、签约状态和服务包完成后，才能进入归属分配与预约。' }}</p>
                </div>
                <el-tag type="primary" effect="plain">导诊客服组</el-tag>
              </div>
            </template>
            <el-table :data="rows" border stripe>
              <el-table-column prop="no" label="患者号" min-width="145" />
              <el-table-column prop="name" label="姓名" width="100" />
              <el-table-column prop="sexAge" label="性别/年龄" width="110" />
              <el-table-column prop="idCard" label="证件号" min-width="155" />
              <el-table-column prop="phone" label="电话" width="120" />
              <el-table-column prop="insurance" label="医保" width="110" />
              <el-table-column prop="customerType" label="客户类型" width="130" />
              <el-table-column prop="contract" :label="mode === 'appointment' ? '申请状态' : mode === 'owner' ? '签约' : '签约'" width="115">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.contract)" effect="plain">{{ row.contract }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="package" :label="mode === 'owner' ? '归属/分管' : mode === 'appointment' ? '治疗申请' : '服务包'" min-width="220" />
              <el-table-column prop="alias" label="随访名称" min-width="130" />
              <el-table-column prop="status" label="状态" width="115">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.status)">{{ row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="next" label="下一步" min-width="130" />
              <el-table-column label="操作" width="260" fixed="right">
                <template #default="{ row }">
                  <el-button v-if="mode === 'owner'" link type="primary" @click="openAssignment(row)">分配</el-button>
                  <el-button v-else-if="mode === 'appointment'" link type="primary" @click="openAppointment(row)">申请</el-button>
                  <el-button v-else link type="primary" @click="openPatient(row)">编辑</el-button>
                  <el-button v-if="mode === 'appointment'" link @click="openReview(row)">审核</el-button>
                  <el-button v-else-if="mode === 'owner'" link @click="openAppointment(row)">预约</el-button>
                  <el-button v-else link @click="openContract(row)">签约</el-button>
                  <el-button v-if="mode !== 'appointment' && mode !== 'owner'" link @click="openContact(row)">联系人</el-button>
                  <el-button v-if="mode !== 'appointment' && mode !== 'owner'" link type="danger" @click="openExit(row)">退出</el-button>
                  <el-button link @click="openTrace(row)">追溯</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>

        <el-col :xs="24" :xl="7">
          <el-card class="guide-side-card" shadow="never">
            <template #header>
              <strong>接入流程</strong>
            </template>
            <el-steps direction="vertical" :active="3" finish-status="success">
              <el-step title="身份核验" description="患者号、证件、联系电话和医保信息唯一性校验" />
              <el-step title="资料补齐" description="联系人、住址、感染标识、客户类型和服务诉求" />
              <el-step :title="mode === 'owner' ? '归属分配' : mode === 'appointment' ? '预约审核' : '签约确认'" :description="mode === 'owner' ? '分配专家团队、医生、护士、护理组和机位意向' : mode === 'appointment' ? '治疗申请审核，确认班次意向、隔离要求和预约状态' : '选择服务包，完成签约/续约/解约和知情资料入口'" />
              <el-step title="进入下一环节" description="输出给责任工作站、预约审核和排班排床" />
            </el-steps>
          </el-card>

          <el-card class="guide-side-card" shadow="never">
            <template #header>
              <strong>导诊安全关注</strong>
            </template>
            <div class="guide-risk-line danger">
              <el-icon><Warning /></el-icon>
              <span>隔离透析、导管患者、医保异常和退出待归档患者必须在接入页明确标识。</span>
            </div>
            <div class="guide-risk-line">
              <el-icon><Files /></el-icon>
              <span>签约、续约、解约和患者资料修改要进入审计追溯，避免后续费用和治疗归属不一致。</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-drawer v-model="patientDrawerVisible" title="患者建档信息" size="640px">
      <el-form label-width="110px">
        <el-form-item label="患者姓名">
          <el-input :model-value="selectedRow?.name" placeholder="请输入患者姓名" />
        </el-form-item>
        <el-form-item label="证件号">
          <el-input :model-value="selectedRow?.idCard" placeholder="请输入身份证或其他证件号" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input :model-value="selectedRow?.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="医保类型">
          <el-select :model-value="selectedRow?.insurance" placeholder="请选择医保类型">
            <el-option label="职工医保" value="职工医保" />
            <el-option label="居民医保" value="居民医保" />
            <el-option label="异地医保" value="异地医保" />
            <el-option label="自费" value="自费" />
          </el-select>
        </el-form-item>
        <el-form-item label="客户类型">
          <el-select :model-value="selectedRow?.customerType" placeholder="请选择客户类型">
            <el-option label="维持性血透" value="维持性血透" />
            <el-option label="导管患者" value="导管患者" />
            <el-option label="隔离透析" value="隔离透析" />
            <el-option label="临时透析" value="临时透析" />
          </el-select>
        </el-form-item>
        <el-form-item label="风险备注">
          <el-input type="textarea" :rows="3" placeholder="感染标识、导管状态、医保异常或特殊沟通要求" />
        </el-form-item>
      </el-form>
      <div class="drawer-actions">
        <el-button @click="patientDrawerVisible = false">取消</el-button>
        <el-button type="primary" :icon="CircleCheck" @click="submitAction('患者主档已保存，待签约确认')">保存建档</el-button>
      </div>
    </el-drawer>

    <el-dialog v-model="contractDialogVisible" title="签约/续约服务" width="620px">
      <el-form label-width="110px">
        <el-form-item label="患者">
          <el-input :model-value="selectedRow ? `${selectedRow.name}（${selectedRow.no}）` : ''" />
        </el-form-item>
        <el-form-item label="服务包">
          <el-select :model-value="selectedRow?.package" placeholder="请选择服务包">
            <el-option label="标准血透服务包" value="标准血透服务包" />
            <el-option label="导管护理增强包" value="导管护理增强包" />
            <el-option label="隔离透析服务包" value="隔离透析服务包" />
            <el-option label="临时透析服务包" value="临时透析服务包" />
          </el-select>
        </el-form-item>
        <el-form-item label="合同状态">
          <el-radio-group model-value="signed">
            <el-radio-button label="draft">草稿</el-radio-button>
            <el-radio-button label="signed">签约</el-radio-button>
            <el-radio-button label="renew">续约</el-radio-button>
            <el-radio-button label="cancel">解约</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="有效期">
          <el-date-picker type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item label="签约说明">
          <el-input type="textarea" :rows="3" placeholder="记录服务包、续约原因、解约原因或特殊约定" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="contractDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAction('签约状态已保存，患者可进入归属分配')">保存签约</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="contactDrawerVisible" title="联系人与医保资料" size="560px">
      <el-form label-width="110px">
        <el-form-item label="主要联系人">
          <el-input placeholder="例如：王强 / 儿子" />
        </el-form-item>
        <el-form-item label="联系人电话">
          <el-input placeholder="请输入联系人电话" />
        </el-form-item>
        <el-form-item label="家庭地址">
          <el-input placeholder="请输入家庭地址" />
        </el-form-item>
        <el-form-item label="医保号">
          <el-input placeholder="请输入医保号或异地备案信息" />
        </el-form-item>
        <el-form-item label="随访名称">
          <el-input :model-value="selectedRow?.alias" placeholder="请输入随访展示名称" />
        </el-form-item>
      </el-form>
      <div class="drawer-actions">
        <el-button @click="contactDrawerVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAction('联系人、医保和随访名称已更新')">保存资料</el-button>
      </div>
    </el-drawer>

    <el-dialog v-model="exitDialogVisible" title="退出病员登记" width="560px">
      <el-alert type="warning" show-icon :closable="false" title="退出登记会影响预约、排班、费用和在管患者统计，请确认后再提交。" />
      <el-form class="dialog-form" label-width="100px">
        <el-form-item label="患者">
          <el-input :model-value="selectedRow ? `${selectedRow.name}（${selectedRow.no}）` : ''" />
        </el-form-item>
        <el-form-item label="退出原因">
          <el-select placeholder="请选择退出原因">
            <el-option label="转院" value="transfer" />
            <el-option label="停止透析" value="stop" />
            <el-option label="死亡" value="death" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="退出日期">
          <el-date-picker type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="说明">
          <el-input type="textarea" :rows="3" placeholder="记录退出说明和后续交接" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="exitDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="submitAction('退出登记已提交，等待归档复核')">提交退出</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="assignmentDrawerVisible" title="归属与责任分配" size="640px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="患者">{{ selectedRow?.name }} / {{ selectedRow?.no }}</el-descriptions-item>
        <el-descriptions-item label="签约状态">{{ selectedRow?.contract }}</el-descriptions-item>
        <el-descriptions-item label="客户类型">{{ selectedRow?.customerType }}</el-descriptions-item>
      </el-descriptions>
      <el-form class="dialog-form" label-width="110px">
        <el-form-item label="随访医院">
          <el-select model-value="华东肾病医学中心">
            <el-option label="华东肾病医学中心 / 总院区" value="华东肾病医学中心" />
          </el-select>
        </el-form-item>
        <el-form-item label="随访科室">
          <el-select model-value="血液净化中心">
            <el-option label="血液净化中心" value="血液净化中心" />
            <el-option label="肾内科门诊" value="肾内科门诊" />
          </el-select>
        </el-form-item>
        <el-form-item label="专家团队">
          <el-select model-value="王主任团队">
            <el-option label="王主任团队" value="王主任团队" />
            <el-option label="血管通路团队" value="血管通路团队" />
            <el-option label="隔离透析团队" value="隔离透析团队" />
          </el-select>
        </el-form-item>
        <el-form-item label="主诊医生">
          <el-select model-value="张明">
            <el-option label="张明" value="张明" />
            <el-option label="陈宁" value="陈宁" />
            <el-option label="王主任" value="王主任" />
          </el-select>
        </el-form-item>
        <el-form-item label="责任护士">
          <el-select model-value="周敏">
            <el-option label="周敏" value="周敏" />
            <el-option label="赵玲" value="赵玲" />
            <el-option label="孙涛" value="孙涛" />
          </el-select>
        </el-form-item>
        <el-form-item label="护理组/机位">
          <el-cascader
            placeholder="请选择护理组和机位意向"
            :options="[
              { label: 'A区一组', value: 'A区一组', children: [{ label: 'A08', value: 'A08' }, { label: 'A10', value: 'A10' }] },
              { label: 'B区二组', value: 'B区二组', children: [{ label: 'B12', value: 'B12' }] },
              { label: '隔离组', value: '隔离组', children: [{ label: 'I03', value: 'I03' }] },
            ]"
          />
        </el-form-item>
        <el-form-item label="分配原因">
          <el-input type="textarea" :rows="3" placeholder="记录分配依据、隔离要求、患者偏好和资源限制" />
        </el-form-item>
      </el-form>
      <div class="drawer-actions">
        <el-button @click="assignmentDrawerVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAction('患者归属已保存，医生站和护士站可见')">保存分配</el-button>
      </div>
    </el-drawer>

    <el-dialog v-model="appointmentDialogVisible" title="治疗申请与预约" width="660px">
      <el-form label-width="110px">
        <el-form-item label="患者">
          <el-input :model-value="selectedRow ? `${selectedRow.name}（${selectedRow.no}）` : ''" />
        </el-form-item>
        <el-form-item label="申请类型">
          <el-select model-value="dialysis">
            <el-option label="规律血液透析" value="dialysis" />
            <el-option label="临时加透" value="extra" />
            <el-option label="血管通路评估" value="access" />
            <el-option label="专家随访" value="follow" />
          </el-select>
        </el-form-item>
        <el-form-item label="透析模式">
          <el-select model-value="HD">
            <el-option label="HD" value="HD" />
            <el-option label="HDF" value="HDF" />
            <el-option label="HP" value="HP" />
          </el-select>
        </el-form-item>
        <el-form-item label="频次/班次">
          <el-input model-value="每周一三五 / 上午班" />
        </el-form-item>
        <el-form-item label="预约日期">
          <el-date-picker type="date" placeholder="选择首次预约日期" />
        </el-form-item>
        <el-form-item label="隔离要求">
          <el-select placeholder="请选择隔离要求" clearable>
            <el-option label="无特殊隔离" value="none" />
            <el-option label="乙肝隔离" value="hbv" />
            <el-option label="丙肝隔离" value="hcv" />
            <el-option label="急诊备用区" value="emergency" />
          </el-select>
        </el-form-item>
        <el-form-item label="申请说明">
          <el-input type="textarea" :rows="3" placeholder="记录患者需求、医嘱依据、首透要求和特殊注意事项" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="appointmentDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAction('治疗申请已提交，等待预约审核')">提交申请</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="reviewDialogVisible" title="预约审核" width="620px">
      <el-alert type="info" show-icon :closable="false" title="审核时需要同时确认签约状态、归属分配、隔离要求、机位资源和班次容量。" />
      <el-form class="dialog-form" label-width="110px">
        <el-form-item label="患者">
          <el-input :model-value="selectedRow ? `${selectedRow.name}（${selectedRow.no}）` : ''" />
        </el-form-item>
        <el-form-item label="审核结果">
          <el-radio-group model-value="pass">
            <el-radio-button label="pass">通过</el-radio-button>
            <el-radio-button label="return">退回修改</el-radio-button>
            <el-radio-button label="reject">不通过</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="预约建议">
          <el-input model-value="周一三五上午班，优先 A08，隔离患者进入 I 区" />
        </el-form-item>
        <el-form-item label="审核意见">
          <el-input type="textarea" :rows="3" placeholder="记录容量、分区、人员、机位和退回原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reviewDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAction('预约审核已完成，输出给排班排床')">提交审核</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="建档签约追溯" size="520px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-10 08:30" type="primary">导诊创建患者主档：{{ selectedRow?.name }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 08:42">补充联系人、医保、客户类型和随访名称</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 09:00" type="success">签约服务包后输出给归属分配与预约</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
