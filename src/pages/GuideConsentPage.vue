<script setup lang="ts">
import { ref } from 'vue';
import { CircleCheck, DocumentChecked, Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

type ConsentRecord = {
  docNo: string;
  patient: string;
  documentName: string;
  attachment: string;
  scene: string;
  signer: string;
  signMethod: string;
  signedAt: string;
  status: string;
  reviewer: string;
  nextAction: string;
};

const viewDialogVisible = ref(false);
const signDialogVisible = ref(false);
const archiveDialogVisible = ref(false);
const selected = ref<ConsentRecord | null>(null);

const rows: ConsentRecord[] = [
  { docNo: 'ICF-001', patient: '王建国 / P20260510001', documentName: '血液净化治疗知情同意书', attachment: '电子签章PDF', scene: '规律透析签约', signer: '王建国', signMethod: '患者端电子签', signedAt: '2026-05-10 09:10', status: '已签署', reviewer: '导诊王敏', nextAction: '签约归档' },
  { docNo: 'ICF-002', patient: '李秀兰 / P20260510002', documentName: '深静脉穿刺置管知情同意书', attachment: '纸质扫描件待上传', scene: '导管护理增强包', signer: '李秀兰家属', signMethod: '现场签字', signedAt: '待签署', status: '待签署', reviewer: '责任护士赵玲', nextAction: '提醒签署' },
  { docNo: 'ICF-003', patient: '赵明 / P20260510003', documentName: '血液透析随访知情同意书', attachment: '电子签章PDF', scene: '隔离透析签约', signer: '赵明', signMethod: '现场签字', signedAt: '2026-05-10 10:00', status: '待归档', reviewer: '感控护士', nextAction: '感控归档' },
  { docNo: 'ICF-004', patient: '陈志强 / P20260510004', documentName: '临时透析治疗知情同意书', attachment: '纸质补录缺失', scene: '急诊临时透析', signer: '陈志强家属', signMethod: '纸质补录', signedAt: '待补录', status: '缺失', reviewer: '急诊护士长', nextAction: '补录签名' },
  { docNo: 'ICF-005', patient: '周萍 / P20260510006', documentName: '特殊血液净化知情同意书', attachment: '电子签章PDF', scene: '腹透转血透', signer: '周萍', signMethod: '患者端电子签', signedAt: '2026-05-12 08:30', status: '已签署', reviewer: '医务张洁', nextAction: '合同复核' },
  { docNo: 'ICF-006', patient: '郑军 / P20260510007', documentName: '手术知情同意书', attachment: '术前谈话扫描件待传', scene: '内瘘手术预约', signer: '郑军', signMethod: '待电子签', signedAt: '待签署', status: '待签署', reviewer: '导诊王敏', nextAction: '备案后签署' },
  { docNo: 'ICF-007', patient: '韩梅 / P20260510008', documentName: '血液净化治疗知情同意书', attachment: '电子签章PDF', scene: '规律透析签约', signer: '韩梅', signMethod: '患者端电子签', signedAt: '2026-05-10 13:50', status: '已归档', reviewer: '导诊陈洁', nextAction: '预约申请' },
  { docNo: 'ICF-008', patient: '林建平 / P20260510009', documentName: '深静脉穿刺置管知情同意书', attachment: '导管风险附件 2 份', scene: '感控协管', signer: '林建平', signMethod: '患者端电子签', signedAt: '2026-05-10 14:18', status: '待归档', reviewer: '感控护士', nextAction: '感控复核' },
  { docNo: 'ICF-009', patient: '孙丽 / P20260510010', documentName: '临床试验知情同意书', attachment: '受试者签署页待补', scene: 'GCP 筛选提示', signer: '孙丽家属', signMethod: '纸质补录', signedAt: '待补录', status: '缺失', reviewer: 'CRC 李娜', nextAction: '线下补录' },
  { docNo: 'ICF-010', patient: '马强 / P20260510011', documentName: '血液透析随访知情同意书', attachment: '电子签章PDF', scene: '夜间透析转组', signer: '马强', signMethod: '患者端电子签', signedAt: '2026-05-10 16:20', status: '已签署', reviewer: '医务张洁', nextAction: '排班引用' },
];

const activeTables = ['consent_document', 'home_consent_record', 'patient_contract', 'sys_audit_log'];

function tagType(status: string): 'success' | 'warning' | 'danger' | 'info' {
  if (status === '已签署' || status === '已归档') return 'success';
  if (status === '缺失') return 'danger';
  if (status.includes('待')) return 'warning';
  return 'info';
}

function openView(row: ConsentRecord): void {
  selected.value = row;
  viewDialogVisible.value = true;
}

function openSign(row?: ConsentRecord): void {
  selected.value = row ?? rows[1];
  signDialogVisible.value = true;
}

function openArchive(row: ConsentRecord): void {
  selected.value = row;
  archiveDialogVisible.value = true;
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
            <p>查看、补签和归档签约、治疗、导管、隔离、急诊和居家相关知情同意书，缺失文书会阻断签约或预约审核。</p>
          </div>
          <div class="guide-actions">
            <el-button type="primary" :icon="CircleCheck" @click="openSign()">发起签署</el-button>
            <el-button :icon="DocumentChecked" @click="openArchive(rows[2])">审核归档</el-button>
          </div>
        </div>
      </template>

      <el-form class="guide-filter" inline>
        <el-form-item label="关键词"><el-input placeholder="患者、文书、场景、签署人" clearable /></el-form-item>
        <el-form-item label="文书类型"><el-select placeholder="全部文书" clearable><el-option label="治疗知情同意书" value="treatment" /><el-option label="导管护理告知书" value="catheter" /><el-option label="隔离风险告知书" value="isolation" /><el-option label="急诊透析知情同意书" value="emergency" /></el-select></el-form-item>
        <el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="待签署" value="待签署" /><el-option label="已签署" value="已签署" /><el-option label="待归档" value="待归档" /><el-option label="缺失" value="缺失" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <el-table :data="rows" border stripe>
        <el-table-column prop="docNo" label="文书号" width="105" fixed="left" />
        <el-table-column prop="patient" label="患者" min-width="165" />
        <el-table-column prop="documentName" label="文书名称" min-width="210" />
        <el-table-column prop="attachment" label="附件记录" min-width="165" />
        <el-table-column prop="scene" label="业务场景" min-width="145" />
        <el-table-column prop="signer" label="签署人" width="110" />
        <el-table-column prop="signMethod" label="签署方式" width="120" />
        <el-table-column prop="signedAt" label="签署时间" width="145" />
        <el-table-column prop="status" label="状态" width="100"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="reviewer" label="责任人" width="115" />
        <el-table-column prop="nextAction" label="下一步" min-width="120" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openView(row)">查看</el-button>
            <el-button link @click="openSign(row)">补签</el-button>
            <el-button link @click="openArchive(row)">归档</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="viewDialogVisible" title="知情同意书查看" width="680px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="文书">{{ selected?.documentName }}</el-descriptions-item>
        <el-descriptions-item label="患者">{{ selected?.patient }}</el-descriptions-item>
        <el-descriptions-item label="业务场景">{{ selected?.scene }}</el-descriptions-item>
        <el-descriptions-item label="签署状态">{{ selected?.status }}</el-descriptions-item>
      </el-descriptions>
      <el-alert class="dialog-form" type="info" show-icon :closable="false" title="原型展示文书元数据和业务状态，正式系统应打开电子病历或电子签章原文。" />
      <template #footer><el-button @click="viewDialogVisible = false">关闭</el-button></template>
    </el-dialog>

    <el-dialog v-model="signDialogVisible" title="发起/补录签署" width="640px">
      <el-form label-width="110px">
        <el-form-item label="患者"><el-input :model-value="selected?.patient" disabled /></el-form-item>
        <el-form-item label="文书类型"><el-select :model-value="selected?.documentName"><el-option label="血液净化治疗知情同意书" value="血液净化治疗知情同意书" /><el-option label="血液透析随访知情同意书" value="血液透析随访知情同意书" /><el-option label="深静脉穿刺置管知情同意书" value="深静脉穿刺置管知情同意书" /><el-option label="手术知情同意书" value="手术知情同意书" /><el-option label="临床试验知情同意书" value="临床试验知情同意书" /></el-select></el-form-item>
        <el-form-item label="签署方式"><el-radio-group model-value="online"><el-radio-button label="online">患者端电子签</el-radio-button><el-radio-button label="offline">纸质补录</el-radio-button><el-radio-button label="family">家属代签</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="签署人"><el-input :model-value="selected?.signer" placeholder="患者或家属姓名" /></el-form-item>
        <el-form-item label="附件记录"><el-input :model-value="selected?.attachment" placeholder="电子签章PDF、纸质扫描件、签署页或补录附件" /></el-form-item>
        <el-form-item label="补录说明"><el-input type="textarea" :rows="3" placeholder="缺失原因、线下签署时间、家属关系和附件说明" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="signDialogVisible = false">取消</el-button><el-button type="primary" @click="signDialogVisible = false; submitAction('知情同意签署任务已保存')">提交签署</el-button></template>
    </el-dialog>

    <el-dialog v-model="archiveDialogVisible" title="文书审核归档" width="600px">
      <el-form label-width="110px">
        <el-form-item label="文书"><el-input :model-value="selected?.docNo" disabled /></el-form-item>
        <el-form-item label="审核结果"><el-radio-group model-value="archive"><el-radio-button label="archive">归档</el-radio-button><el-radio-button label="return">退回补签</el-radio-button><el-radio-button label="invalid">作废</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="审核意见"><el-input type="textarea" :rows="3" placeholder="记录归档材料、退回原因或作废原因" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="archiveDialogVisible = false">取消</el-button><el-button type="primary" @click="archiveDialogVisible = false; submitAction('知情同意书已审核归档')">提交归档</el-button></template>
    </el-dialog>
  </section>
</template>
