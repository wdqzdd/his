<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, DocumentChecked, Files, Search, UserFilled } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{
  context: PageContext;
}>();

type AdmissionStatus = '待接诊' | '资料待补' | '医生待评估' | '感控待确认' | '通路待登记' | '待签署同意' | '准入通过' | '条件通过' | '暂缓准入';

type AdmissionRow = {
  id: string;
  name: string;
  sexAge: string;
  source: string;
  outpatientNo: string;
  inpatientNo: string;
  patientId: string;
  diagnosis: string;
  indication: string;
  infection: string;
  access: string;
  team: string;
  consent: string;
  status: AdmissionStatus;
  owner: string;
  nextAction: string;
};

const rows = ref<AdmissionRow[]>([
  { id: 'ADM-20260525-001', name: '王建国', sexAge: '男 / 58岁', source: '到院接诊', outpatientNo: 'MZ20260525018', inpatientNo: '-', patientId: 'P20260510001', diagnosis: 'CKD5期 / 糖尿病肾病', indication: '维持性血透适应证明确', infection: '乙肝阴性 / 丙肝阴性 / HIV阴性', access: '左前臂自体动静脉内瘘可用', team: '张明 / 周敏 / A区一组', consent: '待签署', status: '待签署同意', owner: '导诊王敏', nextAction: '推送知情同意签署' },
  { id: 'ADM-20260525-002', name: '李秀兰', sexAge: '女 / 64岁', source: 'HIS关联导入', outpatientNo: 'MZ20260525022', inpatientNo: 'ZY20260518009', patientId: '待绑定', diagnosis: 'CKD5期 / 高血压肾病', indication: '医生待确认首次血透指征', infection: '乙肝待回报 / 丙肝阴性', access: '右颈内静脉导管', team: '未分配', consent: '未签署', status: '医生待评估', owner: '导诊林洁', nextAction: '医生诊断与适应证评估' },
  { id: 'ADM-20260525-003', name: '赵明', sexAge: '男 / 42岁', source: '批量导入', outpatientNo: '待绑定', inpatientNo: '-', patientId: 'P20260510003', diagnosis: '尿毒症 / 透析转入', indication: '外院规律透析资料待补', infection: '丙肝阳性，需隔离确认', access: '左前臂内瘘，穿刺记录待补', team: '隔离组待分配', consent: '未签署', status: '感控待确认', owner: '导诊王敏', nextAction: '确认隔离分区与感染标识' },
  { id: 'ADM-20260525-004', name: '陈志强', sexAge: '男 / 71岁', source: '急诊临时接诊', outpatientNo: 'MZ20260525037', inpatientNo: 'ZY20260525003', patientId: 'P20260510004', diagnosis: '急性肾损伤合并高钾', indication: '临时透析适应证明确', infection: '传染病筛查加急中', access: '临时导管待登记', team: '急诊组 / 王主任', consent: '家属待签署', status: '条件通过', owner: '导诊何青', nextAction: '补齐筛查结果后进入临时排班' },
  { id: 'ADM-20260525-005', name: '吴海', sexAge: '男 / 53岁', source: '既往患者复入', outpatientNo: 'MZ20260525044', inpatientNo: '-', patientId: 'P20260510005', diagnosis: 'CKD5期 / 既往退出', indication: '需复核退出原因与重新准入', infection: '资料过期，需重筛', access: '通路状态未知', team: '未分配', consent: '过期', status: '资料待补', owner: '导诊林洁', nextAction: '补外院资料和传染病筛查' },
]);

const selectedId = ref(rows.value[0].id);
const activeStep = ref(4);
const assessmentDialogVisible = ref(false);
const conclusionDialogVisible = ref(false);

const current = computed(() => rows.value.find((item) => item.id === selectedId.value) ?? rows.value[0]);

const steps = computed(() => [
  { title: '到院/接诊', desc: current.value.source },
  { title: '档案查询', desc: current.value.patientId === '待绑定' ? '未找到可用主档' : `已匹配 ${current.value.patientId}` },
  { title: '维护基本信息', desc: '患者中心基本信息同源' },
  { title: '绑定院内ID', desc: `${current.value.outpatientNo} / ${current.value.inpatientNo}` },
  { title: '诊断适应证', desc: current.value.indication },
  { title: '传染病筛查确认', desc: current.value.infection },
  { title: '血管通路登记', desc: current.value.access },
  { title: '责任团队分配', desc: current.value.team },
  { title: '知情同意', desc: current.value.consent },
  { title: '进入处方排班', desc: current.value.nextAction },
]);

const checklist = computed(() => [
  { group: '患者到院/接诊', item: '接诊来源、接诊时间、导诊责任人', result: current.value.source, status: '已完成' },
  { group: '档案查询', item: '按姓名、证件号、手机号、HIS号查询是否已有档案', result: current.value.patientId, status: current.value.patientId === '待绑定' ? '待处理' : '已完成' },
  { group: '基本信息', item: '维护患者基本信息、联系人、医保、地址和附件', result: '患者中心主档同源', status: current.value.status === '资料待补' ? '待补全' : '已完成' },
  { group: '院内ID绑定', item: '绑定门诊号、住院号、患者ID，形成唯一主索引', result: `${current.value.outpatientNo} / ${current.value.inpatientNo}`, status: current.value.outpatientNo === '待绑定' ? '待处理' : '已完成' },
  { group: '医生评估', item: '医生诊断、透析适应证、临时/规律透析准入意见', result: current.value.diagnosis, status: current.value.status === '医生待评估' ? '待医生评估' : '已完成' },
  { group: '传染病筛查', item: '乙肝、丙肝、梅毒、HIV、结核、发热与隔离要求', result: current.value.infection, status: current.value.status === '感控待确认' ? '待感控确认' : '已完成' },
  { group: '血管通路', item: '内瘘、导管、移植物、建立日期、可用性和风险', result: current.value.access, status: current.value.status === '通路待登记' ? '待登记' : '已完成' },
  { group: '责任分配', item: '主诊医生、责任护士、护理组、机位意向', result: current.value.team, status: current.value.team === '未分配' || current.value.team.includes('待分配') ? '待分配' : '已完成' },
  { group: '知情同意', item: '血液透析、特殊净化、导管/穿刺、费用等同意书', result: current.value.consent, status: current.value.consent.includes('待') || current.value.consent === '未签署' ? '待签署' : '已完成' },
]);

const statusType = (status: string): 'success' | 'warning' | 'danger' | 'info' => {
  if (['准入通过', '已完成'].includes(status)) return 'success';
  if (['暂缓准入'].includes(status)) return 'danger';
  if (status.includes('待') || ['条件通过', '待补全'].includes(status)) return 'warning';
  return 'info';
};

function selectRow(row: AdmissionRow): void {
  selectedId.value = row.id;
  const firstPendingIndex = checklist.value.findIndex((item) => item.status !== '已完成');
  activeStep.value = firstPendingIndex >= 0 ? firstPendingIndex : 9;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}
</script>

<template>
  <section class="guide-admission-page">
    <el-card class="admission-card" shadow="never">
      <template #header>
        <div class="admission-header">
          <div>
            <h2>{{ props.context.menuTitle }}</h2>
            <p>患者到院接诊后，完成档案查询、院内ID绑定、医生适应证评估、传染病筛查、通路登记、责任分配和知情同意，准入通过后才进入处方与排班。</p>
          </div>
          <div class="admission-actions">
            <el-button type="primary" :icon="CircleCheck" @click="conclusionDialogVisible = true">提交准入结论</el-button>
            <el-button :icon="DocumentChecked" @click="assessmentDialogVisible = true">发起复核</el-button>
            <el-button :icon="Files" @click="submitAction('准入评估单已生成，供医生站、护士站和排班引用')">生成评估单</el-button>
          </div>
        </div>
      </template>

      <el-form class="admission-filter" inline>
        <el-form-item label="接诊日期"><el-date-picker type="date" placeholder="选择日期" /></el-form-item>
        <el-form-item label="准入状态">
          <el-select placeholder="全部状态" clearable>
            <el-option v-for="status in ['待接诊', '资料待补', '医生待评估', '感控待确认', '通路待登记', '待签署同意', '准入通过', '条件通过', '暂缓准入']" :key="status" :label="status" :value="status" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键字"><el-input placeholder="姓名、证件号、门诊号、住院号、患者ID" clearable /></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <el-row :gutter="16">
        <el-col :xs="24" :xl="15">
          <el-card class="admission-section" shadow="never">
            <template #header>
              <div class="admission-section-head">
                <strong>准入患者队列</strong>
                <el-tag type="primary" effect="plain">输入：建档/HIS导入/批量导入/急诊接诊</el-tag>
              </div>
            </template>
            <el-table :data="rows" border stripe highlight-current-row @row-click="selectRow">
              <el-table-column prop="id" label="评估单号" min-width="150" fixed="left" />
              <el-table-column prop="name" label="患者" width="100" />
              <el-table-column prop="sexAge" label="性别/年龄" width="110" />
              <el-table-column prop="source" label="接诊来源" min-width="120" />
              <el-table-column prop="outpatientNo" label="门诊号" min-width="130" />
              <el-table-column prop="inpatientNo" label="住院号" min-width="130" />
              <el-table-column prop="patientId" label="患者ID" min-width="130" />
              <el-table-column prop="status" label="准入状态" width="120">
                <template #default="{ row }">
                  <el-tag :type="statusType(row.status)">{{ row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="nextAction" label="下一步" min-width="180" />
            </el-table>
          </el-card>
        </el-col>

        <el-col :xs="24" :xl="9">
          <el-card class="admission-section" shadow="never">
            <template #header>
              <div class="admission-section-head">
                <strong>当前准入进度</strong>
                <el-tag :type="statusType(current.status)">{{ current.status }}</el-tag>
              </div>
            </template>
            <div class="current-patient">
              <div class="current-avatar"><el-icon><UserFilled /></el-icon></div>
              <div>
                <strong>{{ current.name }}</strong>
                <span>{{ current.sexAge }} / {{ current.patientId }}</span>
              </div>
            </div>
            <el-steps direction="vertical" :active="activeStep" finish-status="success">
              <el-step v-for="step in steps" :key="step.title" :title="step.title" :description="step.desc" />
            </el-steps>
          </el-card>
        </el-col>
      </el-row>

      <el-card class="admission-section" shadow="never">
        <template #header>
          <div class="admission-section-head">
            <strong>准入评估明细</strong>
            <span>按“接诊 -> 主索引 -> 医生评估 -> 感控筛查 -> 通路 -> 责任团队 -> 同意书”逐项闭环</span>
          </div>
        </template>
        <el-table :data="checklist" border>
          <el-table-column prop="group" label="环节" width="130" />
          <el-table-column prop="item" label="核验内容" min-width="280" />
          <el-table-column prop="result" label="当前结果" min-width="240" />
          <el-table-column prop="status" label="状态" width="120">
            <template #default="{ row }">
              <el-tag :type="statusType(row.status)">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="处理" width="180" fixed="right">
            <template #default="{ row }">
              <el-button v-if="row.status !== '已完成'" link type="primary" @click="assessmentDialogVisible = true">处理</el-button>
              <el-button v-else link @click="submitAction(`${row.group}已复核`)">复核</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <div class="closure-strip">
        <div><span>输入</span><strong>到院接诊、患者基本信息、HIS主索引、医生诊断、传染病筛查、通路资料、责任团队和知情同意</strong></div>
        <div><span>输出</span><strong>准入结论、风险标识、隔离要求、患者ID绑定、责任分配、同意书状态和可进入处方/排班的患者队列</strong></div>
        <div><span>下一环节</span><strong>准入通过进入医生处方、签约/归属分配、预约排班；条件通过生成补资料、复核或感控任务</strong></div>
      </div>
    </el-card>

    <el-dialog v-model="assessmentDialogVisible" title="处理准入评估环节" width="720px">
      <el-form label-width="128px" class="dialog-form">
        <el-form-item label="患者"><el-input :model-value="`${current.name} / ${current.id}`" disabled /></el-form-item>
        <el-form-item label="处理环节">
          <el-select model-value="医生诊断与适应证评估">
            <el-option label="绑定门诊号/住院号/患者ID" value="绑定门诊号/住院号/患者ID" />
            <el-option label="医生诊断与适应证评估" value="医生诊断与适应证评估" />
            <el-option label="传染病筛查确认" value="传染病筛查确认" />
            <el-option label="血管通路登记" value="血管通路登记" />
            <el-option label="责任团队分配" value="责任团队分配" />
            <el-option label="知情同意签署" value="知情同意签署" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理结论">
          <el-radio-group model-value="pass">
            <el-radio-button label="pass">通过</el-radio-button>
            <el-radio-button label="condition">条件通过</el-radio-button>
            <el-radio-button label="pending">补资料</el-radio-button>
            <el-radio-button label="reject">暂缓</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="复核/补充说明"><el-input type="textarea" :rows="4" placeholder="记录诊断依据、筛查结果、隔离要求、通路情况、责任团队或补资料原因" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="assessmentDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="assessmentDialogVisible = false; submitAction('准入评估环节已处理，并生成下一步任务')">保存处理</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="conclusionDialogVisible" title="提交准入结论" width="680px">
      <el-alert type="warning" show-icon :closable="false" title="准入结论会影响医生处方、预约排班、隔离分区和护士站患者可见范围，请确认关键环节已完成。" />
      <el-form label-width="120px" class="dialog-form">
        <el-form-item label="准入结论">
          <el-select model-value="条件通过">
            <el-option label="准入通过" value="准入通过" />
            <el-option label="条件通过" value="条件通过" />
            <el-option label="暂缓准入" value="暂缓准入" />
            <el-option label="不予准入/建议转诊" value="不予准入/建议转诊" />
          </el-select>
        </el-form-item>
        <el-form-item label="进入路径">
          <el-checkbox-group model-value="contract">
            <el-checkbox-button label="contract">签约</el-checkbox-button>
            <el-checkbox-button label="owner">归属分配</el-checkbox-button>
            <el-checkbox-button label="doctor">医生处方</el-checkbox-button>
            <el-checkbox-button label="schedule">预约排班</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="结论说明"><el-input type="textarea" :rows="4" placeholder="说明通过条件、待补资料、隔离分区、临时透析限制或转诊建议" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="conclusionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="conclusionDialogVisible = false; submitAction('准入结论已提交，患者进入处方与排班前置队列')">提交结论</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<style scoped>
.guide-admission-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.admission-card,
.admission-section {
  border-radius: 8px;
}

.admission-header,
.admission-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.admission-header h2 {
  margin: 0 0 6px;
  font-size: 20px;
}

.admission-header p,
.admission-section-head span {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.admission-actions,
.admission-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.admission-section {
  margin-top: 16px;
}

.current-patient {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 0 16px;
}

.current-patient strong,
.current-patient span {
  display: block;
}

.current-patient span {
  margin-top: 4px;
  color: #64748b;
  font-size: 13px;
}

.current-avatar {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border-radius: 8px;
  color: #2563eb;
  background: #eff6ff;
}

.closure-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.closure-strip div {
  padding: 12px;
  border: 1px solid #dbe4f0;
  border-radius: 8px;
  background: #f8fbff;
}

.closure-strip span,
.closure-strip strong {
  display: block;
}

.closure-strip span {
  color: #2563eb;
  font-size: 12px;
  margin-bottom: 6px;
}

.closure-strip strong {
  color: #334155;
  font-size: 13px;
  line-height: 1.6;
}

.dialog-form {
  margin-top: 12px;
}

@media (max-width: 960px) {
  .admission-header,
  .admission-section-head {
    align-items: flex-start;
    flex-direction: column;
  }

  .closure-strip {
    grid-template-columns: 1fr;
  }
}
</style>
