<script setup lang="ts">
import { ref } from 'vue';
import { CircleCheck, FirstAidKit, Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

type DiagnosisRow = {
  id: string;
  patient: string;
  diagnosisName: string;
  diagnosisType: string;
  subDiagnosis: string;
  stage: string;
  startDate: string;
  source: string;
  status: string;
  smartSuggestion: string;
  reviewer: string;
  nextAction: string;
};

const editDialogVisible = ref(false);
const reviewDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const selected = ref<DiagnosisRow | null>(null);

const rows: DiagnosisRow[] = [
  { id: 'DX-001', patient: '王建国', diagnosisName: '终末期肾病', diagnosisType: '主诊断', subDiagnosis: '血液透析依赖', stage: 'CKD5期', startDate: '2024-06-18', source: '门诊诊断', status: '有效', smartSuggestion: '智能诊断已确认', reviewer: '刘主任', nextAction: '处方引用' },
  { id: 'DX-002', patient: '王建国', diagnosisName: '糖尿病肾病', diagnosisType: '原发病', subDiagnosis: '2型糖尿病', stage: '并发糖尿病', startDate: '2024-06-18', source: '肾内科病历', status: '有效', smartSuggestion: '诊断历史一致', reviewer: '刘主任', nextAction: '健康报告引用' },
  { id: 'DX-003', patient: '李秀兰', diagnosisName: '慢性肾衰竭5期', diagnosisType: '主诊断', subDiagnosis: '高血压肾病', stage: 'CKD5期', startDate: '2023-11-02', source: '住院病历', status: '有效', smartSuggestion: '建议补分期', reviewer: '陈宁', nextAction: '处方引用' },
  { id: 'DX-004', patient: '赵明', diagnosisName: 'IgA肾病尿毒症期', diagnosisType: '主诊断', subDiagnosis: '高钾血症', stage: '维持性血透', startDate: '2025-01-12', source: '外院病历', status: '待复核', smartSuggestion: '智能诊断建议高钾血症', reviewer: '张明', nextAction: '复核后处方' },
  { id: 'DX-005', patient: '陈志强', diagnosisName: '多囊肾', diagnosisType: '原发病', subDiagnosis: '通路狭窄', stage: '维持性血透', startDate: '2022-08-20', source: '门诊诊断', status: '有效', smartSuggestion: '诊断历史引用', reviewer: '刘主任', nextAction: '病程引用' },
  { id: 'DX-006', patient: '刘梅英', diagnosisName: '狼疮性肾炎尿毒症期', diagnosisType: '主诊断', subDiagnosis: '贫血', stage: 'CKD5期', startDate: '2021-03-15', source: '风湿免疫病历', status: '有效', smartSuggestion: '建议贫血评估', reviewer: '陈宁', nextAction: '专项评估' },
  { id: 'DX-007', patient: '周庆', diagnosisName: '慢性心力衰竭', diagnosisType: '并发症', subDiagnosis: '透中低血压', stage: 'NYHA III', startDate: '2026-05-08', source: '心内会诊', status: '待复核', smartSuggestion: '智能诊断待确认', reviewer: '王主任', nextAction: '心功能评估' },
  { id: 'DX-008', patient: '何雪', diagnosisName: '继发性甲旁亢', diagnosisType: '并发症', subDiagnosis: '过敏诊断：无', stage: '观察', startDate: '2026-04-10', source: '检验趋势', status: '有效', smartSuggestion: '诊断历史引用', reviewer: '刘主任', nextAction: '用药调整' },
  { id: 'DX-009', patient: '郭强', diagnosisName: '透析充分性不足', diagnosisType: '疗效诊断', subDiagnosis: '再循环风险', stage: 'Kt/V低', startDate: '2026-05-11', source: '疗效分析', status: '待复核', smartSuggestion: '智能诊断建议充分性不足', reviewer: '张明', nextAction: '处方调整' },
  { id: 'DX-010', patient: '马丽', diagnosisName: '乙肝病毒携带', diagnosisType: '感染诊断', subDiagnosis: '传染病登记：乙肝', stage: '隔离透析', startDate: '2024-12-01', source: '检验科', status: '有效', smartSuggestion: '感染诊断已登记', reviewer: '感控护士', nextAction: '隔离排班' },
];

const activeTables = ['patient_diagnosis', 'diagnosis_dict', 'diagnosis_review_log', 'medical_record'];

function tagType(status: string): 'success' | 'warning' | 'danger' | 'info' {
  if (status === '有效') return 'success';
  if (status.includes('待')) return 'warning';
  if (status.includes('停用')) return 'danger';
  return 'info';
}

function openEdit(row?: DiagnosisRow): void {
  selected.value = row ?? rows[0];
  editDialogVisible.value = true;
}

function openReview(row: DiagnosisRow): void {
  selected.value = row;
  reviewDialogVisible.value = true;
}

function openTrace(row: DiagnosisRow): void {
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
            <p>维护主诊断、原发病、并发症、感染标识和疗效诊断，作为病程、处方、报表和质控的统一诊断口径。</p>
          </div>
          <div class="clinical-actions">
            <el-button type="primary" :icon="FirstAidKit" @click="openEdit()">新增诊断</el-button>
            <el-button :icon="CircleCheck" @click="openReview(rows[3])">复核诊断</el-button>
          </div>
        </div>
      </template>

      <el-form class="clinical-filter" inline>
        <el-form-item label="关键字"><el-input placeholder="患者、诊断名称、来源" clearable /></el-form-item>
        <el-form-item label="诊断类型"><el-select placeholder="全部类型" clearable><el-option label="主诊断" value="主诊断" /><el-option label="子诊断" value="子诊断" /><el-option label="原发病" value="原发病" /><el-option label="感染诊断" value="感染诊断" /><el-option label="过敏诊断" value="过敏诊断" /><el-option label="传染病登记" value="传染病登记" /><el-option label="智能诊断建议" value="智能诊断建议" /></el-select></el-form-item>
        <el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="有效" value="有效" /><el-option label="待复核" value="待复核" /><el-option label="停用" value="停用" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <el-table :data="rows" border stripe>
        <el-table-column prop="id" label="诊断号" width="95" fixed="left" />
        <el-table-column prop="patient" label="患者" width="100" />
        <el-table-column prop="diagnosisName" label="诊断名称" min-width="190" />
        <el-table-column prop="diagnosisType" label="类型" width="105" />
        <el-table-column prop="subDiagnosis" label="子诊断/登记" min-width="150" />
        <el-table-column prop="stage" label="分期/标识" min-width="140" />
        <el-table-column prop="startDate" label="开始日期" width="110" />
        <el-table-column prop="source" label="来源" min-width="130" />
        <el-table-column prop="smartSuggestion" label="智能建议/历史" min-width="150" />
        <el-table-column prop="status" label="状态" width="100"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="reviewer" label="复核人" width="105" />
        <el-table-column prop="nextAction" label="下一步" min-width="130" />
        <el-table-column label="操作" width="210" fixed="right">
          <template #default="{ row }"><el-button link type="primary" @click="openEdit(row)">编辑</el-button><el-button link @click="openReview(row)">复核</el-button><el-button link @click="openTrace(row)">追溯</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="editDialogVisible" title="诊断维护" width="640px">
      <el-form label-width="110px">
        <el-form-item label="患者"><el-input :model-value="selected?.patient" /></el-form-item>
        <el-form-item label="诊断名称"><el-input :model-value="selected?.diagnosisName" placeholder="从诊断字典选择或录入" /></el-form-item>
        <el-form-item label="诊断类型"><el-select :model-value="selected?.diagnosisType"><el-option label="主诊断" value="主诊断" /><el-option label="子诊断" value="子诊断" /><el-option label="原发病" value="原发病" /><el-option label="感染诊断" value="感染诊断" /><el-option label="过敏诊断" value="过敏诊断" /><el-option label="传染病登记" value="传染病登记" /><el-option label="智能诊断建议" value="智能诊断建议" /><el-option label="疗效诊断" value="疗效诊断" /></el-select></el-form-item>
        <el-form-item label="子诊断/登记"><el-input :model-value="selected?.subDiagnosis" placeholder="子诊断、过敏诊断或传染病登记信息" /></el-form-item>
        <el-form-item label="分期/标识"><el-input :model-value="selected?.stage" /></el-form-item>
        <el-form-item label="智能建议"><el-input :model-value="selected?.smartSuggestion" placeholder="智能诊断建议、诊断历史或复核线索" /></el-form-item>
        <el-form-item label="来源说明"><el-input type="textarea" :rows="3" :model-value="selected?.source" placeholder="病历、检验、会诊、疗效分析或医生判断依据" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="editDialogVisible = false">取消</el-button><el-button type="primary" @click="editDialogVisible = false; submitAction('诊断已保存，待复核后生效')">保存诊断</el-button></template>
    </el-dialog>

    <el-dialog v-model="reviewDialogVisible" title="诊断复核" width="560px">
      <el-form label-width="100px">
        <el-form-item label="诊断"><el-input :model-value="selected?.diagnosisName" disabled /></el-form-item>
        <el-form-item label="复核结果"><el-radio-group model-value="pass"><el-radio-button label="pass">生效</el-radio-button><el-radio-button label="return">退回</el-radio-button><el-radio-button label="stop">停用</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="复核意见"><el-input type="textarea" :rows="3" placeholder="记录诊断依据、退回原因或停用说明" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="reviewDialogVisible = false">取消</el-button><el-button type="primary" @click="reviewDialogVisible = false; submitAction('诊断复核结果已保存')">提交复核</el-button></template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="诊断追溯" size="520px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-10 08:00" type="primary">创建诊断：{{ selected?.diagnosisName }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 08:20">关联病历、检验和评估依据</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 08:30" type="success">复核生效，可被医嘱处方引用</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
