<script setup lang="ts">
import { ref } from 'vue';
import { CircleCheck, EditPen, Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

type RecordRow = {
  id: string;
  patient: string;
  recordType: string;
  treatmentDate: string;
  chiefComplaint: string;
  assessment: string;
  prescriptionBasis: string;
  status: string;
  signer: string;
  nextAction: string;
};

const editDrawerVisible = ref(false);
const signDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const selected = ref<RecordRow | null>(null);

const rows: RecordRow[] = [
  { id: 'REC-001', patient: '王建国 / HD-00038', recordType: '入院病历', treatmentDate: '2026-05-10', chiefComplaint: '规律血透入组，体重增长2.1kg', assessment: '血压平稳，通路良好', prescriptionBasis: '建立初始诊疗资料', status: '已签名', signer: '刘主任', nextAction: '可作为处方依据' },
  { id: 'REC-002', patient: '李秀兰 / HD-00072', recordType: '首次病程记录', treatmentDate: '2026-05-10', chiefComplaint: '导管出口红肿', assessment: '疑似轻度感染', prescriptionBasis: '补导管护理医嘱', status: '草稿', signer: '陈宁', nextAction: '签名后下发医嘱' },
  { id: 'REC-003', patient: '赵明 / HD-00116', recordType: '危急值查房记录', treatmentDate: '2026-05-10', chiefComplaint: '血钾偏高', assessment: '需复查血钾并调整透析液', prescriptionBasis: '高钾处理', status: '待签名', signer: '张明', nextAction: '签名并处理事件' },
  { id: 'REC-004', patient: '陈志强 / HD-00128', recordType: '科主任查房记录', treatmentDate: '2026-05-10', chiefComplaint: '通路狭窄复查', assessment: '人工血管震颤稍弱', prescriptionBasis: '建议通路评估', status: '已签名', signer: '刘主任', nextAction: '通路评估' },
  { id: 'REC-005', patient: '刘梅英 / HD-00151', recordType: '主治查房记录', treatmentDate: '2026-05-10', chiefComplaint: '乏力', assessment: 'Hb偏低', prescriptionBasis: '促红素调整', status: '退回修改', signer: '陈宁', nextAction: '补检验依据' },
  { id: 'REC-006', patient: '孙海 / HD-00177', recordType: '一般查房记录', treatmentDate: '2026-05-11', chiefComplaint: '无特殊不适', assessment: '病情稳定', prescriptionBasis: '处方复用', status: '已签名', signer: '刘主任', nextAction: '处方复用' },
  { id: 'REC-007', patient: '马丽 / HD-00203', recordType: '谈话记录', treatmentDate: '2026-05-11', chiefComplaint: '隔离透析风险沟通', assessment: '乙肝隔离状态稳定', prescriptionBasis: '固定隔离机位', status: '已签名', signer: '张明', nextAction: '隔离排班引用' },
  { id: 'REC-008', patient: '周庆 / HD-00218', recordType: '抢救记录', treatmentDate: '2026-05-11', chiefComplaint: '透中低血压史', assessment: '心衰风险高', prescriptionBasis: '限制超滤', status: '待签名', signer: '王主任', nextAction: '补心功能评估' },
  { id: 'REC-009', patient: '何雪 / HD-00246', recordType: '病例讨论', treatmentDate: '2026-05-11', chiefComplaint: '血磷高', assessment: '饮食和用药依从性需加强', prescriptionBasis: '调整降磷药', status: '已签名', signer: '刘主任', nextAction: '药师协同审核' },
  { id: 'REC-010', patient: '郭强 / HD-00277', recordType: '病历打印 / 归档', treatmentDate: '2026-05-11', chiefComplaint: 'Kt/V低', assessment: '透析充分性不足', prescriptionBasis: '延长透析时长', status: '草稿', signer: '张明', nextAction: '签名后处方调整' },
];

const activeTables = ['medical_record', 'record_signature', 'record_revision_log', 'clinical_event'];

function tagType(status: string): 'success' | 'warning' | 'danger' | 'info' {
  if (status === '已签名') return 'success';
  if (status.includes('退回')) return 'danger';
  if (status.includes('待') || status === '草稿') return 'warning';
  return 'info';
}

function openEdit(row?: RecordRow): void {
  selected.value = row ?? rows[0];
  editDrawerVisible.value = true;
}

function openSign(row: RecordRow): void {
  selected.value = row;
  signDialogVisible.value = true;
}

function openTrace(row: RecordRow): void {
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
            <p>维护入院病历、首次病程、查房、抢救、危急值、预警、谈话、手术相关病程、病例讨论、出院记录、疾病证明书和病历打印归档。</p>
          </div>
          <div class="clinical-actions">
            <el-button type="primary" :icon="EditPen" @click="openEdit()">新建病程</el-button>
            <el-button :icon="CircleCheck" @click="openSign(rows[1])">签名提交</el-button>
          </div>
        </div>
      </template>

      <el-form class="clinical-filter" inline>
        <el-form-item label="患者"><el-input placeholder="患者、透析号、病程类型" clearable /></el-form-item>
        <el-form-item label="病程类型"><el-select placeholder="全部类型" clearable><el-option label="入院病历" value="admission" /><el-option label="首次病程记录" value="first" /><el-option label="查房病程记录" value="round" /><el-option label="抢救记录" value="rescue" /><el-option label="危急值查房记录" value="critical" /><el-option label="预警事件查房记录" value="warning" /><el-option label="谈话记录" value="talk" /><el-option label="手术相关病程记录" value="surgery" /><el-option label="病例讨论" value="discussion" /><el-option label="出院记录" value="discharge" /><el-option label="疾病证明书" value="certificate" /><el-option label="病历打印 / 归档" value="archive" /></el-select></el-form-item>
        <el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="草稿" value="草稿" /><el-option label="待签名" value="待签名" /><el-option label="已签名" value="已签名" /><el-option label="退回修改" value="退回修改" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <el-table :data="rows" border stripe>
        <el-table-column prop="id" label="病程号" width="105" fixed="left" />
        <el-table-column prop="patient" label="患者" min-width="155" />
        <el-table-column prop="recordType" label="病程类型" min-width="140" />
        <el-table-column prop="treatmentDate" label="日期" width="110" />
        <el-table-column prop="chiefComplaint" label="主诉/情况" min-width="210" />
        <el-table-column prop="assessment" label="评估结论" min-width="180" />
        <el-table-column prop="prescriptionBasis" label="处方依据" min-width="150" />
        <el-table-column prop="status" label="状态" width="100"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="signer" label="签名医生" width="105" />
        <el-table-column prop="nextAction" label="下一步" min-width="140" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }"><el-button link type="primary" @click="openEdit(row)">编辑</el-button><el-button link @click="openSign(row)">签名</el-button><el-button link @click="openTrace(row)">追溯</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-drawer v-model="editDrawerVisible" title="病历病程编辑" size="720px">
      <el-form label-width="112px">
        <el-form-item label="患者"><el-input :model-value="selected?.patient" /></el-form-item>
        <el-form-item label="病程类型"><el-select :model-value="selected?.recordType"><el-option label="入院病历" value="入院病历" /><el-option label="首次病程记录" value="首次病程记录" /><el-option label="查房病程记录" value="查房病程记录" /><el-option label="科主任查房记录" value="科主任查房记录" /><el-option label="教授查房记录" value="教授查房记录" /><el-option label="主治查房记录" value="主治查房记录" /><el-option label="一般查房记录" value="一般查房记录" /><el-option label="抢救记录" value="抢救记录" /><el-option label="危急值查房记录" value="危急值查房记录" /><el-option label="预警事件查房记录" value="预警事件查房记录" /><el-option label="谈话记录" value="谈话记录" /><el-option label="手术相关病程记录" value="手术相关病程记录" /><el-option label="病例讨论" value="病例讨论" /><el-option label="出院记录" value="出院记录" /><el-option label="疾病证明书" value="疾病证明书" /><el-option label="病历打印 / 归档" value="病历打印 / 归档" /></el-select></el-form-item>
        <el-form-item label="主诉/情况"><el-input type="textarea" :rows="3" :model-value="selected?.chiefComplaint" /></el-form-item>
        <el-form-item label="评估结论"><el-input type="textarea" :rows="3" :model-value="selected?.assessment" /></el-form-item>
        <el-form-item label="处方依据"><el-input type="textarea" :rows="3" :model-value="selected?.prescriptionBasis" /></el-form-item>
      </el-form>
      <div class="drawer-actions"><el-button @click="editDrawerVisible = false">取消</el-button><el-button @click="submitAction('病程已暂存')">暂存</el-button><el-button type="primary" @click="editDrawerVisible = false; submitAction('病程已提交签名')">提交签名</el-button></div>
    </el-drawer>

    <el-dialog v-model="signDialogVisible" title="病程签名" width="560px">
      <el-form label-width="100px">
        <el-form-item label="病程"><el-input :model-value="selected?.id" disabled /></el-form-item>
        <el-form-item label="签名结果"><el-radio-group model-value="sign"><el-radio-button label="sign">签名生效</el-radio-button><el-radio-button label="return">退回修改</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="签名意见"><el-input type="textarea" :rows="3" placeholder="记录签名意见、退回原因和修改要求" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="signDialogVisible = false">取消</el-button><el-button type="primary" @click="signDialogVisible = false; submitAction('病程签名结果已保存')">提交</el-button></template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="病程修改追溯" size="520px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-10 08:16" type="primary">创建病程：{{ selected?.id }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 08:22">补充检验、通路和处方依据</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 08:30" type="success">医生签名后进入处方依据</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
