<script setup lang="ts">
import { ref } from 'vue';
import { CircleCheck, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

type ReviewRow = {
  id: string;
  patient: string;
  orderSummary: string;
  prescription: string;
  access: string;
  consent: string;
  risk: string;
  status: string;
  reviewer: string;
  nextAction: string;
};

const reviewDialogVisible = ref(false);
const returnDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const selected = ref<ReviewRow | null>(null);

const rows: ReviewRow[] = [
  { id: 'NR-001', patient: '王建国 / HD-00038', orderSummary: '4条已审核医嘱', prescription: 'HD 4h，UF 2.1L', access: '左前臂内瘘', consent: '有效', risk: '低', status: '待护理审核', reviewer: '赵护士', nextAction: '通过后核对' },
  { id: 'NR-002', patient: '李秀兰 / HD-00072', orderSummary: '导管护理+透析处方', prescription: 'HD 4h，导管血流220', access: '右颈长期导管', consent: '有效', risk: '中', status: '待护理审核', reviewer: '钱护士', nextAction: '核对导管风险' },
  { id: 'NR-003', patient: '赵明 / HD-00116', orderSummary: '高钾处理医嘱', prescription: 'HD 4.5h，透析液钾待确认', access: '右前臂内瘘', consent: '缺失', risk: '高', status: '退回医生', reviewer: '孙护士', nextAction: '补同意书' },
  { id: 'NR-004', patient: '陈志强 / HD-00128', orderSummary: 'HD+HF医嘱', prescription: 'HD+HF 4h', access: '人工血管', consent: '有效', risk: '中', status: '已通过', reviewer: '周护士', nextAction: '双人核对' },
  { id: 'NR-005', patient: '刘梅英 / HD-00151', orderSummary: 'HD+HP专项医嘱', prescription: 'HD+HP 4h', access: '股静脉临时导管', consent: '专项待签', risk: '高', status: '待护理审核', reviewer: '吴护士', nextAction: '核同意书' },
  { id: 'NR-006', patient: '孙海 / HD-00177', orderSummary: '常规用药医嘱', prescription: 'HD 4h', access: '左前臂内瘘', consent: '有效', risk: '低', status: '已通过', reviewer: '郑护士', nextAction: '双人核对' },
  { id: 'NR-007', patient: '马丽 / HD-00203', orderSummary: '隔离透析医嘱', prescription: '隔离HD 4h', access: '右前臂内瘘', consent: '隔离有效', risk: '中', status: '待护理审核', reviewer: '冯护士', nextAction: '隔离核对' },
  { id: 'NR-008', patient: '周庆 / HD-00218', orderSummary: '限制超滤医嘱', prescription: 'UF<=2.0L', access: '右颈长期导管', consent: '高危有效', risk: '高', status: '待护理审核', reviewer: '蒋护士', nextAction: '风险确认' },
  { id: 'NR-009', patient: '何雪 / HD-00246', orderSummary: '降磷药医嘱', prescription: 'HD 4h', access: '左前臂内瘘', consent: '有效', risk: '中', status: '已通过', reviewer: '谢护士', nextAction: '执行用药' },
  { id: 'NR-010', patient: '郭强 / HD-00277', orderSummary: '充分性调整医嘱', prescription: 'HD 4.5h', access: '人工血管', consent: '有效', risk: '高', status: '待护理审核', reviewer: '陆护士', nextAction: '核对处方' },
];

const activeTables = ['nursing_review', 'medical_order', 'dialysis_prescription', 'patient_consent', 'nursing_review_log'];

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value === '已通过' || value === '有效' || value === '低') return 'success';
  if (value.includes('退回') || value === '缺失' || value === '高') return 'danger';
  if (value.includes('待') || value === '中') return 'warning';
  return 'info';
}

function openReview(row?: ReviewRow): void {
  selected.value = row ?? rows[0];
  reviewDialogVisible.value = true;
}

function openReturn(row: ReviewRow): void {
  selected.value = row;
  returnDialogVisible.value = true;
}

function openTrace(row: ReviewRow): void {
  selected.value = row;
  traceDrawerVisible.value = true;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}
</script>

<template>
  <section class="nurse-execution-page">
    <el-card class="nurse-work-card" shadow="never">
      <template #header>
        <div class="nurse-header">
          <div>
            <h2>{{ context.menuTitle }}</h2>
            <p>护士在执行前复核医嘱、处方、通路、同意书和风险事件，确认可执行或退回医生补正。</p>
          </div>
          <div class="nurse-actions">
            <el-button type="primary" :icon="CircleCheck" @click="openReview()">护理审核</el-button>
            <el-button :icon="Warning" @click="openReturn(rows[2])">退回医生</el-button>
          </div>
        </div>
      </template>

      <el-form class="nurse-filter" inline>
        <el-form-item label="关键字"><el-input placeholder="患者、医嘱、处方、通路" clearable /></el-form-item>
        <el-form-item label="风险"><el-select placeholder="全部风险" clearable><el-option label="高" value="高" /><el-option label="中" value="中" /><el-option label="低" value="低" /></el-select></el-form-item>
        <el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="待护理审核" value="待护理审核" /><el-option label="已通过" value="已通过" /><el-option label="退回医生" value="退回医生" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <el-table :data="rows" border stripe>
        <el-table-column prop="id" label="审核号" width="105" fixed="left" />
        <el-table-column prop="patient" label="患者" min-width="155" />
        <el-table-column prop="orderSummary" label="医嘱摘要" min-width="165" />
        <el-table-column prop="prescription" label="处方" min-width="150" />
        <el-table-column prop="access" label="通路" min-width="130" />
        <el-table-column prop="consent" label="同意书" width="110"><template #default="{ row }"><el-tag :type="tagType(row.consent)" effect="plain">{{ row.consent }}</el-tag></template></el-table-column>
        <el-table-column prop="risk" label="风险" width="80"><template #default="{ row }"><el-tag :type="tagType(row.risk)">{{ row.risk }}</el-tag></template></el-table-column>
        <el-table-column prop="status" label="状态" width="115"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="reviewer" label="审核护士" width="105" />
        <el-table-column prop="nextAction" label="下一步" min-width="130" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }"><el-button link type="primary" @click="openReview(row)">审核</el-button><el-button link type="danger" @click="openReturn(row)">退回</el-button><el-button link @click="openTrace(row)">追溯</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="reviewDialogVisible" title="护理审核表单" width="660px">
      <el-form label-width="110px">
        <el-form-item label="患者"><el-input :model-value="selected?.patient" disabled /></el-form-item>
        <el-form-item label="审核项目"><el-checkbox-group model-value="order"><el-checkbox-button label="order">医嘱</el-checkbox-button><el-checkbox-button label="rx">处方</el-checkbox-button><el-checkbox-button label="access">通路</el-checkbox-button><el-checkbox-button label="consent">同意书</el-checkbox-button><el-checkbox-button label="risk">风险</el-checkbox-button></el-checkbox-group></el-form-item>
        <el-form-item label="审核结果"><el-radio-group model-value="pass"><el-radio-button label="pass">通过</el-radio-button><el-radio-button label="return">退回医生</el-radio-button><el-radio-button label="hold">暂停执行</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="审核意见"><el-input type="textarea" :rows="3" placeholder="记录风险、退回原因或执行注意事项" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="reviewDialogVisible = false">取消</el-button><el-button type="primary" @click="reviewDialogVisible = false; submitAction('护理审核结果已保存')">提交审核</el-button></template>
    </el-dialog>

    <el-dialog v-model="returnDialogVisible" title="退回医生补正" width="600px">
      <el-form label-width="110px">
        <el-form-item label="患者"><el-input :model-value="selected?.patient" disabled /></el-form-item>
        <el-form-item label="退回原因"><el-select placeholder="请选择"><el-option label="同意书缺失" value="consent" /><el-option label="处方参数不清" value="rx" /><el-option label="风险未处理" value="risk" /><el-option label="通路不一致" value="access" /></el-select></el-form-item>
        <el-form-item label="补正要求"><el-input type="textarea" :rows="3" placeholder="明确医生需补正的医嘱、处方或风险处理" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="returnDialogVisible = false">取消</el-button><el-button type="danger" @click="returnDialogVisible = false; submitAction('已退回医生补正')">确认退回</el-button></template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="护理审核追溯" size="520px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-10 08:30" type="primary">接收医生医嘱和透析处方</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 08:40">护士完成处方、通路、同意书和风险审核</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 08:45" type="success">审核通过后进入核对执行</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
