<script setup lang="ts">
import { ref } from 'vue';
import { CircleCheck, DocumentChecked, Message, Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();

type ProfileRow = {
  item: string;
  value: string;
  source: string;
  status: string;
  owner: string;
  updatedAt: string;
  nextAction: string;
};

const editDialogVisible = ref(false);
const confirmDialogVisible = ref(false);
const teamDrawerVisible = ref(false);
const selected = ref<ProfileRow | null>(null);

const titleMap: Record<string, string> = {
  'home-log': '工作日志',
  'home-team': '我的专家团队',
  'home-health': '健康档案',
  'home-patient': '患者基本信息',
  'home-contract': '签约续约解约',
  'home-consent': '知情同意书',
};

const rows: ProfileRow[] = [
  { item: '患者主档', value: '王建国，男，58岁，P20260510001', source: '导诊台患者建档', status: '已确认', owner: '导诊王敏', updatedAt: '2026-05-10 08:42', nextAction: '资料变更需复核' },
  { item: '联系方式', value: '138****6721，家属王强 139****1001', source: '患者端补充', status: '待复核', owner: '导诊王敏', updatedAt: '2026-05-10 09:00', nextAction: '导诊复核' },
  { item: '医保资料', value: '职工医保，医保号已核验', source: '导诊台医保维护', status: '已确认', owner: '导诊王敏', updatedAt: '2026-05-10 09:05', nextAction: '费用引用' },
  { item: '签约服务', value: '标准血透服务包，2026-05-10 至 2027-05-09', source: '导诊台签约', status: '已签约', owner: '导诊王敏', updatedAt: '2026-05-10 09:20', nextAction: '续约提醒' },
  { item: '知情同意', value: '血液净化治疗知情同意书已签署', source: '患者端电子签', status: '已归档', owner: '导诊王敏', updatedAt: '2026-05-10 09:30', nextAction: '医生可引用' },
  { item: '专家团队', value: '刘主任 / 赵护士 / 王导诊 / 周营养师', source: '归属分配', status: '已生效', owner: '医务张洁', updatedAt: '2026-05-10 10:20', nextAction: '在线咨询' },
  { item: '血管通路', value: '左前臂内瘘，震颤良好', source: '医生站通路档案', status: '已归档', owner: '刘主任', updatedAt: '2026-05-09 15:10', nextAction: '上机核对引用' },
  { item: '过敏史', value: '无明确药物过敏', source: '患者主档', status: '已确认', owner: '导诊王敏', updatedAt: '2026-05-10 08:42', nextAction: '医嘱校验' },
  { item: '最近检验', value: 'Hb 92g/L，P 1.78mmol/L', source: '检验上传/检验科', status: '待复查', owner: '刘主任', updatedAt: '2026-05-10 08:00', nextAction: '疗效预警' },
  { item: '工作日志', value: '上传报告、完成评估、确认用药建议', source: '居家待办', status: '已记录', owner: '患者本人', updatedAt: '2026-05-10 18:00', nextAction: '医护查看' },
];

const activeTables = ['patient_master', 'patient_health_profile', 'home_contract_record', 'home_consent_record', 'home_work_log'];

function tagType(status: string): 'success' | 'warning' | 'danger' | 'info' {
  if (status.includes('已') || status.includes('生效')) return 'success';
  if (status.includes('待')) return 'warning';
  if (status.includes('异常')) return 'danger';
  return 'info';
}

function openEdit(row: ProfileRow): void {
  selected.value = row;
  editDialogVisible.value = true;
}

function openConfirm(row: ProfileRow): void {
  selected.value = row;
  confirmDialogVisible.value = true;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}
</script>

<template>
  <section class="home-patient-page">
    <el-card class="home-work-card" shadow="never">
      <template #header>
        <div class="home-header">
          <div>
            <h2>{{ titleMap[context.menuKey] ?? context.menuTitle }}</h2>
            <p>患者查看和确认个人资料、健康档案、专家团队、签约服务、知情同意和工作日志，变更项回流导诊或责任团队复核。</p>
          </div>
          <div class="home-actions">
            <el-button type="primary" :icon="CircleCheck" @click="openEdit(rows[0])">维护资料</el-button>
            <el-button :icon="Message" @click="teamDrawerVisible = true">联系团队</el-button>
            <el-button :icon="DocumentChecked" @click="openConfirm(rows[3])">确认服务</el-button>
          </div>
        </div>
      </template>

      <el-form class="home-filter" inline>
        <el-form-item label="关键字"><el-input placeholder="资料项、来源、责任人、状态" clearable /></el-form-item>
        <el-form-item label="资料类型"><el-select placeholder="全部资料" clearable><el-option label="患者主档" value="患者主档" /><el-option label="签约服务" value="签约服务" /><el-option label="专家团队" value="专家团队" /><el-option label="知情同意" value="知情同意" /><el-option label="工作日志" value="工作日志" /></el-select></el-form-item>
        <el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="待复核" value="待复核" /><el-option label="已确认" value="已确认" /><el-option label="已归档" value="已归档" /><el-option label="已签约" value="已签约" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <el-table :data="rows" border stripe>
        <el-table-column prop="item" label="资料项" width="120" fixed="left" />
        <el-table-column prop="value" label="当前内容" min-width="260" />
        <el-table-column prop="source" label="来源" min-width="150" />
        <el-table-column prop="status" label="状态" width="110"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="owner" label="责任人" width="110" />
        <el-table-column prop="updatedAt" label="更新时间" width="150" />
        <el-table-column prop="nextAction" label="下一步" min-width="130" />
        <el-table-column label="操作" width="210" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">维护</el-button>
            <el-button link @click="openConfirm(row)">确认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="editDialogVisible" title="患者端资料维护" width="640px">
      <el-form label-width="110px">
        <el-form-item label="资料项"><el-input :model-value="selected?.item" disabled /></el-form-item>
        <el-form-item label="当前内容"><el-input type="textarea" :rows="2" :model-value="selected?.value" /></el-form-item>
        <el-form-item label="变更原因"><el-input type="textarea" :rows="3" placeholder="说明资料变更原因、来源和需医护确认的内容" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="editDialogVisible = false">取消</el-button><el-button type="primary" @click="editDialogVisible = false; submitAction('资料变更已提交，等待责任人复核')">提交变更</el-button></template>
    </el-dialog>

    <el-dialog v-model="confirmDialogVisible" title="资料/服务确认" width="580px">
      <el-form label-width="100px">
        <el-form-item label="项目"><el-input :model-value="selected?.item" disabled /></el-form-item>
        <el-form-item label="确认结果"><el-radio-group model-value="confirm"><el-radio-button label="confirm">确认无误</el-radio-button><el-radio-button label="question">有疑问</el-radio-button><el-radio-button label="change">申请修改</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="备注"><el-input type="textarea" :rows="3" placeholder="补充疑问或修改内容" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="confirmDialogVisible = false">取消</el-button><el-button type="primary" @click="confirmDialogVisible = false; submitAction('确认结果已提交')">提交确认</el-button></template>
    </el-dialog>

    <el-drawer v-model="teamDrawerVisible" title="我的专家团队" size="560px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="主诊医生">刘主任，负责透析处方、检验趋势和用药调整</el-descriptions-item>
        <el-descriptions-item label="责任护士">赵护士，负责通路护理、宣教和评估审核</el-descriptions-item>
        <el-descriptions-item label="导诊客服">王导诊，负责签约、续约、预约和资料复核</el-descriptions-item>
        <el-descriptions-item label="营养师">周营养师，负责限磷饮食和蛋白摄入指导</el-descriptions-item>
      </el-descriptions>
    </el-drawer>
  </section>
</template>
