<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, DocumentAdd, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{
  context: PageContext;
}>();

type RefundRow = {
  id: string;
  patient: string;
  dialysisNo: string;
  type: string;
  linkedOrder: string;
  amount: string;
  reason: string;
  status: string;
  reviewer: string;
  nextAction: string;
};

const selectedId = ref('REF-001');
const applyDialogVisible = ref(false);
const auditDialogVisible = ref(false);
const traceDrawerVisible = ref(false);

const rows: RefundRow[] = [
  { id: 'REF-001', patient: '王建国', dialysisNo: 'HD-00038', type: '退费', linkedOrder: '门诊输液费', amount: '¥128.00', reason: '重复计费', status: '待审核', reviewer: '张护士', nextAction: '护士审核' },
  { id: 'REF-002', patient: '李秀英', dialysisNo: 'HD-00072', type: '退药', linkedOrder: '钙剂', amount: '¥46.80', reason: '患者拒用', status: '已通过', reviewer: '钱护士', nextAction: '发起冲红' },
  { id: 'REF-003', patient: '赵明', dialysisNo: 'HD-00116', type: '退费', linkedOrder: '材料费', amount: '¥320.00', reason: '项目撤销', status: '已冲红', reviewer: '刘护士', nextAction: '归档' },
  { id: 'REF-004', patient: '陈志强', dialysisNo: 'HD-00128', type: '退药', linkedOrder: '阿托伐他汀', amount: '¥58.20', reason: '医嘱变更', status: '待提交', reviewer: '周护士', nextAction: '补充关联医嘱' },
  { id: 'REF-005', patient: '周庆', dialysisNo: 'HD-00218', type: '退费', linkedOrder: '治疗加班费', amount: '¥86.00', reason: '班次调整', status: '待审核', reviewer: '张护士', nextAction: '核对排班' },
  { id: 'REF-006', patient: '何雪', dialysisNo: 'HD-00246', type: '退药', linkedOrder: '铁剂', amount: '¥72.60', reason: '库存临期替换', status: '已退回', reviewer: '钱护士', nextAction: '医生确认' },
  { id: 'REF-007', patient: '孙海', dialysisNo: 'HD-00277', type: '退费', linkedOrder: '材料追补', amount: '¥94.00', reason: '收费口径调整', status: '已通过', reviewer: '刘护士', nextAction: '费用冲正' },
  { id: 'REF-008', patient: '马丽', dialysisNo: 'HD-00305', type: '退药', linkedOrder: '研究药物', amount: '¥0.00', reason: 'GCP 退出', status: '待审核', reviewer: 'GCP护士', nextAction: '项目备案' },
  { id: 'REF-009', patient: '郭强', dialysisNo: 'HD-00322', type: '退费', linkedOrder: '检验费', amount: '¥96.00', reason: '检验重做', status: '待审核', reviewer: '张护士', nextAction: '复核申请' },
  { id: 'REF-010', patient: '陈敏', dialysisNo: 'HD-00341', type: '退药', linkedOrder: '抗凝药', amount: '¥68.40', reason: '医嘱停用', status: '待提交', reviewer: '周护士', nextAction: '补录原因' },
];

const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['refund_request', 'refund_audit_log', 'charge_reversal_record', 'drug_return_record'];

const metrics = computed(() => [
  { label: '申请总数', value: rows.length, tone: 'blue' },
  { label: '待审核', value: rows.filter((item) => item.status === '待审核').length, tone: 'orange' },
  { label: '待提交', value: rows.filter((item) => item.status === '待提交').length, tone: 'blue' },
  { label: '已冲红', value: rows.filter((item) => item.status === '已冲红').length, tone: 'green' },
  { label: '已退回', value: rows.filter((item) => item.status === '已退回').length, tone: 'red' },
]);

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value === '已通过' || value === '已冲红') return 'success';
  if (value === '待审核' || value === '待提交') return 'warning';
  if (value === '已退回') return 'danger';
  return 'info';
}

function selectRow(row: RefundRow): void {
  selectedId.value = row.id;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}

function openApply(row?: RefundRow): void {
  selectedId.value = row?.id ?? rows[0].id;
  applyDialogVisible.value = true;
}

function openAudit(row: RefundRow): void {
  selectedId.value = row.id;
  auditDialogVisible.value = true;
}
</script>

<template>
  <section class="nurse-execution-page">
    <el-card class="nurse-work-card" shadow="never">
      <template #header>
        <div class="nurse-header">
          <div>
            <h2>{{ context.menuTitle }}</h2>
            <p>登记退药退费申请、核对关联医嘱和费用，完成审核后再冲红或退回修正。</p>
          </div>
          <div class="nurse-actions">
            <el-button type="primary" :icon="DocumentAdd" @click="openApply()">新建申请</el-button>
            <el-button :icon="CircleCheck" @click="openAudit(rows[0])">审核申请</el-button>
            <el-button :icon="Warning" @click="traceDrawerVisible = true">查看追溯</el-button>
          </div>
        </div>
      </template>

      <el-form class="nurse-filter" inline>
        <el-form-item label="关键字">
          <el-input placeholder="患者、医嘱、金额、原因" clearable />
        </el-form-item>
        <el-form-item label="类型">
          <el-select placeholder="全部类型" clearable>
            <el-option label="退药" value="退药" />
            <el-option label="退费" value="退费" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select placeholder="全部状态" clearable>
            <el-option label="待提交" value="待提交" />
            <el-option label="待审核" value="待审核" />
            <el-option label="已通过" value="已通过" />
            <el-option label="已退回" value="已退回" />
            <el-option label="已冲红" value="已冲红" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>

      <div class="nurse-stat-grid">
        <el-card v-for="item in metrics" :key="item.label" :class="['nurse-stat-card', item.tone]" shadow="never">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </el-card>
      </div>

      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow">
        <el-table-column prop="patient" label="患者" width="100" fixed="left" />
        <el-table-column prop="dialysisNo" label="透析号" width="110" />
        <el-table-column prop="type" label="类型" width="90" />
        <el-table-column prop="linkedOrder" label="关联项目" min-width="150" />
        <el-table-column prop="amount" label="金额" width="100" />
        <el-table-column prop="reason" label="原因" min-width="130" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="reviewer" label="责任人" width="100" />
        <el-table-column prop="nextAction" label="下一步" min-width="120" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click.stop="openApply(row)">编辑</el-button>
            <el-button link @click.stop="openAudit(row)">审核</el-button>
            <el-button link type="danger" @click.stop="traceDrawerVisible = true">追溯</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="applyDialogVisible" title="退药退费申请" width="640px">
      <el-form label-width="100px">
        <el-form-item label="患者"><el-input :model-value="currentRow.patient" disabled /></el-form-item>
        <el-form-item label="申请类型">
          <el-radio-group model-value="退费">
            <el-radio-button label="退药">退药</el-radio-button>
            <el-radio-button label="退费">退费</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关联项目"><el-input :model-value="currentRow.linkedOrder" /></el-form-item>
        <el-form-item label="金额"><el-input :model-value="currentRow.amount" /></el-form-item>
        <el-form-item label="原因"><el-input type="textarea" :rows="3" placeholder="记录退回原因、库存回退和收费冲红说明" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="applyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="applyDialogVisible = false; submitAction('退药退费申请已保存')">保存申请</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="auditDialogVisible" title="退药退费审核" width="620px">
      <el-alert type="warning" show-icon :closable="false" title="退药退费需要核对医嘱、库存、收费项目和责任护士意见后再冲红。" />
      <el-form label-width="100px">
        <el-form-item label="申请单"><el-input :model-value="currentRow.id" disabled /></el-form-item>
        <el-form-item label="审核结果">
          <el-radio-group model-value="pass">
            <el-radio-button label="pass">通过</el-radio-button>
            <el-radio-button label="return">退回</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核意见"><el-input type="textarea" :rows="3" placeholder="记录审核结论、冲红范围和责任人" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="auditDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="auditDialogVisible = false; submitAction('退药退费申请已审核')">提交审核</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="退药退费追溯" size="520px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-10 08:10" type="primary">提交申请：{{ currentRow.patient }} / {{ currentRow.linkedOrder }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 08:30">护士核对医嘱、收费与库存</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 08:50" type="success">完成冲红并回写费用流水</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
