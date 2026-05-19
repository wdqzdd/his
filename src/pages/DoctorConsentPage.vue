<script setup lang="ts">
import { ref } from 'vue';
import { CircleCheck, Document, Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

type ConsentRow = {
  id: string;
  patient: string;
  documentName: string;
  scene: string;
  attachment: string;
  signer: string;
  validUntil: string;
  status: string;
  source: string;
  nextAction: string;
};

const signDialogVisible = ref(false);
const reviewDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const selected = ref<ConsentRow | null>(null);

const rows: ConsentRow[] = [
  { id: 'DOC-001', patient: '王建国 / HD-00038', documentName: '血液净化治疗知情同意书', scene: '规律透析', attachment: '电子签名附件', signer: '王建国', validUntil: '2027-05-09', status: '有效', source: '导诊台归档', nextAction: '处方可引用' },
  { id: 'DOC-002', patient: '李秀兰 / HD-00072', documentName: '血液透析随访知情同意书', scene: '随访管理', attachment: '纸质扫描附件', signer: '家属李强', validUntil: '2026-11-10', status: '待续签', source: '护士站补录', nextAction: '发起续签' },
  { id: 'DOC-003', patient: '赵明 / HD-00116', documentName: '深静脉穿刺置管知情同意书', scene: '深静脉穿刺', attachment: '待上传附件', signer: '赵明', validUntil: '待签署', status: '缺失', source: '医生站触发', nextAction: '补签后处方' },
  { id: 'DOC-004', patient: '陈志强 / HD-00128', documentName: '手术知情同意书', scene: '通路手术', attachment: '手术文书附件', signer: '陈志强', validUntil: '2026-08-30', status: '有效', source: '通路档案', nextAction: '通路申请引用' },
  { id: 'DOC-005', patient: '刘梅英 / HD-00151', documentName: '血液净化治疗知情同意书', scene: 'HD+HP', attachment: '专项治疗附件', signer: '待签署', validUntil: '待签署', status: '待签署', source: '专项医嘱', nextAction: '补专项同意' },
  { id: 'DOC-006', patient: '孙海 / HD-00177', documentName: '血液透析随访知情同意书', scene: '规律随访', attachment: '电子签名附件', signer: '孙海', validUntil: '2027-04-30', status: '有效', source: '导诊台归档', nextAction: '处方复用' },
  { id: 'DOC-007', patient: '马丽 / HD-00203', documentName: '临床试验知情同意书', scene: 'GCP筛选', attachment: 'GCP附件', signer: '马丽', validUntil: '2027-05-01', status: '有效', source: 'CRC站归档', nextAction: '隔离处方引用' },
  { id: 'DOC-008', patient: '周庆 / HD-00218', documentName: '血液净化治疗知情同意书', scene: '心衰风险', attachment: '家属签名附件', signer: '周庆家属', validUntil: '2026-07-01', status: '待复核', source: '医生站补录', nextAction: '复核后生效' },
  { id: 'DOC-009', patient: '何雪 / HD-00246', documentName: '手术知情同意书', scene: '用药调整', attachment: '纸质扫描附件', signer: '何雪', validUntil: '2026-12-31', status: '有效', source: '患者端签署', nextAction: '药师审核引用' },
  { id: 'DOC-010', patient: '郭强 / HD-00277', documentName: '深静脉穿刺置管知情同意书', scene: '充分性不足', attachment: '待上传附件', signer: '待签署', validUntil: '待签署', status: '待签署', source: '疗效评估', nextAction: '签署后调处方' },
];

const activeTables = ['patient_consent', 'consent_document', 'doctor_consent_review', 'sys_audit_log'];

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value === '有效') return 'success';
  if (value === '缺失') return 'danger';
  if (value.includes('待')) return 'warning';
  return 'info';
}

function openSign(row?: ConsentRow): void {
  selected.value = row ?? rows[0];
  signDialogVisible.value = true;
}

function openReview(row: ConsentRow): void {
  selected.value = row;
  reviewDialogVisible.value = true;
}

function openTrace(row: ConsentRow): void {
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
      <template #header>
        <div class="clinical-header">
          <div>
            <h2>{{ context.menuTitle }}</h2>
            <p>医生查看治疗、专项处置、隔离、通路和高风险处方相关知情同意状态，缺失时直接发起补签或复核。</p>
          </div>
          <div class="clinical-actions">
            <el-button type="primary" :icon="Document" @click="openSign()">发起补签</el-button>
            <el-button :icon="CircleCheck" @click="openReview(rows[7])">复核文书</el-button>
          </div>
        </div>
      </template>

      <el-form class="clinical-filter" inline>
        <el-form-item label="关键字"><el-input placeholder="患者、文书、场景、签署人" clearable /></el-form-item>
        <el-form-item label="文书类型"><el-select placeholder="全部文书" clearable><el-option label="血液净化治疗知情同意书" value="血液净化治疗知情同意书" /><el-option label="血液透析随访知情同意书" value="血液透析随访知情同意书" /><el-option label="深静脉穿刺置管知情同意书" value="深静脉穿刺置管知情同意书" /><el-option label="手术知情同意书" value="手术知情同意书" /><el-option label="临床试验知情同意书" value="临床试验知情同意书" /></el-select></el-form-item>
        <el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="有效" value="有效" /><el-option label="待签署" value="待签署" /><el-option label="待续签" value="待续签" /><el-option label="缺失" value="缺失" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <el-table :data="rows" border stripe>
        <el-table-column prop="id" label="文书号" width="105" fixed="left" />
        <el-table-column prop="patient" label="患者" min-width="155" />
        <el-table-column prop="documentName" label="文书名称" min-width="220" />
        <el-table-column prop="scene" label="场景" width="120" />
        <el-table-column prop="attachment" label="知情同意书附件" min-width="140" />
        <el-table-column prop="signer" label="签署人" width="115" />
        <el-table-column prop="validUntil" label="有效期至" width="120" />
        <el-table-column prop="status" label="状态" width="100"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="source" label="来源" min-width="130" />
        <el-table-column prop="nextAction" label="下一步" min-width="135" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }"><el-button link type="primary" @click="openSign(row)">补签</el-button><el-button link @click="openReview(row)">复核</el-button><el-button link @click="openTrace(row)">追溯</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="signDialogVisible" title="发起知情同意补签" width="640px">
      <el-form label-width="112px">
        <el-form-item label="患者"><el-input :model-value="selected?.patient" disabled /></el-form-item>
        <el-form-item label="文书"><el-select :model-value="selected?.documentName"><el-option label="血液净化治疗知情同意书" value="血液净化治疗知情同意书" /><el-option label="血液透析随访知情同意书" value="血液透析随访知情同意书" /><el-option label="深静脉穿刺置管知情同意书" value="深静脉穿刺置管知情同意书" /><el-option label="手术知情同意书" value="手术知情同意书" /><el-option label="临床试验知情同意书" value="临床试验知情同意书" /></el-select></el-form-item>
        <el-form-item label="附件"><el-input :model-value="selected?.attachment" placeholder="上传或查看知情同意书附件" /></el-form-item>
        <el-form-item label="签署对象"><el-radio-group model-value="patient"><el-radio-button label="patient">患者本人</el-radio-button><el-radio-button label="family">家属代签</el-radio-button><el-radio-button label="offline">纸质补录</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="补签原因"><el-input type="textarea" :rows="3" placeholder="专项治疗、风险变化、文书过期、缺失补录等原因" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="signDialogVisible = false">取消</el-button><el-button type="primary" @click="signDialogVisible = false; submitAction('知情同意补签任务已发起')">发起签署</el-button></template>
    </el-dialog>

    <el-dialog v-model="reviewDialogVisible" title="知情同意复核" width="580px">
      <el-form label-width="100px">
        <el-form-item label="文书"><el-input :model-value="selected?.id" disabled /></el-form-item>
        <el-form-item label="复核结果"><el-radio-group model-value="pass"><el-radio-button label="pass">有效</el-radio-button><el-radio-button label="return">退回补签</el-radio-button><el-radio-button label="invalid">作废</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="复核意见"><el-input type="textarea" :rows="3" placeholder="记录适用场景、有效期、退回原因或作废原因" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="reviewDialogVisible = false">取消</el-button><el-button type="primary" @click="reviewDialogVisible = false; submitAction('知情同意复核结果已保存')">提交复核</el-button></template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="知情同意追溯" size="520px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-10 09:00" type="primary">创建文书任务：{{ selected?.documentName }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 09:10">患者或家属完成签署</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 09:20" type="success">复核后进入处方准入检查</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
