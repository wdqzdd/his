<script setup lang="ts">
import { ref } from 'vue';
import { CircleCheck, DocumentAdd, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();

type AssessmentRow = {
  id: string;
  patient: string;
  type: string;
  summary: string;
  conclusion: string;
  risk: string;
  owner: string;
  time: string;
  status: string;
  nextAction: string;
};

const fillDialogVisible = ref(false);
const reviewDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const selected = ref<AssessmentRow | null>(null);

const isSpecial = props.context.menuKey === 'nurse-special-assess';
const title = isSpecial ? '专科病情评估' : '常见病情评估';

const rows: AssessmentRow[] = [
  { id: 'NAS-001', patient: '王建国', type: '透析间期', summary: '体重增长2.1kg，血压平稳', conclusion: '病情稳定', risk: '低', owner: '赵护士', time: '2026-05-10', status: '已完成', nextAction: '归档' },
  { id: 'NAS-002', patient: '李秀兰', type: '常见症状', summary: '导管出口红肿', conclusion: '疑似导管感染', risk: '高', owner: '钱护士', time: '2026-05-10', status: '待审核', nextAction: '感控复核' },
  { id: 'NAS-003', patient: '赵明', type: '专科', summary: '血钾5.9mmol/L', conclusion: '高钾风险高', risk: '高', owner: '孙护士', time: '2026-05-10', status: '待处理', nextAction: '医生处理' },
  { id: 'NAS-004', patient: '陈志强', type: '通路', summary: '人工血管震颤稍弱', conclusion: '建议通路复查', risk: '中', owner: '周护士', time: '2026-05-10', status: '已完成', nextAction: '通路申请' },
  { id: 'NAS-005', patient: '刘梅英', type: '专科', summary: 'Hb 89g/L', conclusion: '贫血需调整促红素', risk: '高', owner: '吴护士', time: '2026-05-10', status: '待复评', nextAction: '补充评估' },
  { id: 'NAS-006', patient: '孙海', type: '常见症状', summary: '无胸闷、无水肿', conclusion: '稳定', risk: '低', owner: '郑护士', time: '2026-05-10', status: '已完成', nextAction: '健康档案' },
  { id: 'NAS-007', patient: '马丽', type: '感染隔离', summary: 'HBsAg阳性，体温正常', conclusion: '继续隔离透析', risk: '中', owner: '冯护士', time: '2026-05-10', status: '已完成', nextAction: '隔离排班' },
  { id: 'NAS-008', patient: '周庆', type: '心血管', summary: 'BNP高，低血压史', conclusion: '心血管风险高', risk: '高', owner: '蒋护士', time: '2026-05-10', status: '待复评', nextAction: '医生评估' },
  { id: 'NAS-009', patient: '何雪', type: '钙磷', summary: 'P 2.05，钙磷乘积高', conclusion: '需调整降磷药', risk: '中', owner: '谢护士', time: '2026-05-10', status: '已完成', nextAction: '药师协同' },
  { id: 'NAS-010', patient: '郭强', type: '透析充分性', summary: 'Kt/V 1.18', conclusion: '未达标', risk: '高', owner: '陆护士', time: '2026-05-10', status: '待完成', nextAction: '处方调整' },
];

const activeTables = ['nursing_assessment', 'warning_event', 'patient_health_profile'];

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value === '低' || value === '已完成') return 'success';
  if (value === '高' || value === '待处理') return 'danger';
  if (value.includes('待') || value === '中') return 'warning';
  return 'info';
}

function openFill(row?: AssessmentRow): void { selected.value = row ?? rows[0]; fillDialogVisible.value = true; }
function openReview(row: AssessmentRow): void { selected.value = row; reviewDialogVisible.value = true; }
function openTrace(row: AssessmentRow): void { selected.value = row; traceDrawerVisible.value = true; }
function submitAction(message: string): void { ElMessage.success(message); }
</script>

<template>
  <section class="nurse-execution-page">
    <el-card class="nurse-work-card" shadow="never">
      <template #header><div class="nurse-header"><div><h2>{{ title }}</h2><p>{{ isSpecial ? '记录血管通路、感染隔离、心血管、贫血和钙磷等专科评估。' : '记录症状、血压、体重、通路和常见病情变化。' }}</p></div><div class="nurse-actions"><el-button type="primary" :icon="DocumentAdd" @click="openFill()">填写评估</el-button><el-button :icon="CircleCheck" @click="openReview(rows[0])">审核评估</el-button></div></div></template>
      <el-form class="nurse-filter" inline><el-form-item label="关键字"><el-input placeholder="患者、评估类型、结论" clearable /></el-form-item><el-form-item label="风险"><el-select placeholder="全部风险" clearable><el-option label="高" value="高" /><el-option label="中" value="中" /><el-option label="低" value="低" /></el-select></el-form-item><el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item></el-form>
      <el-table :data="rows" border stripe><el-table-column prop="id" label="评估号" width="105" fixed="left" /><el-table-column prop="patient" label="患者" width="100" /><el-table-column prop="type" label="评估类型" width="120" /><el-table-column prop="summary" label="关键情况" min-width="180" /><el-table-column prop="conclusion" label="结论" min-width="200" /><el-table-column prop="risk" label="风险" width="80"><template #default="{ row }"><el-tag :type="tagType(row.risk)">{{ row.risk }}</el-tag></template></el-table-column><el-table-column prop="owner" label="责任护士" width="105" /><el-table-column prop="time" label="时间" width="110" /><el-table-column prop="status" label="状态" width="105"><template #default="{ row }"><el-tag :type="tagType(row.status)" effect="plain">{{ row.status }}</el-tag></template></el-table-column><el-table-column prop="nextAction" label="下一步" min-width="130" /><el-table-column label="操作" width="210" fixed="right"><template #default="{ row }"><el-button link type="primary" @click="openFill(row)">填写</el-button><el-button link @click="openReview(row)">审核</el-button><el-button link @click="openTrace(row)">追溯</el-button></template></el-table-column></el-table>
    </el-card>    <el-dialog v-model="fillDialogVisible" title="病情评估" width="700px"><el-form label-width="120px"><el-form-item label="患者"><el-input :model-value="selected?.patient" /></el-form-item><el-form-item label="评估类型"><el-select :model-value="selected?.type"><el-option label="透析间期" value="透析间期" /><el-option label="常见症状" value="常见症状" /><el-option label="专科" value="专科" /><el-option label="感染隔离" value="感染隔离" /></el-select></el-form-item><el-form-item label="关键情况"><el-input type="textarea" :rows="2" :model-value="selected?.summary" /></el-form-item><el-form-item label="评估结论"><el-input type="textarea" :rows="3" :model-value="selected?.conclusion" /></el-form-item><el-form-item label="风险等级"><el-radio-group :model-value="selected?.risk"><el-radio-button label="低">低</el-radio-button><el-radio-button label="中">中</el-radio-button><el-radio-button label="高">高</el-radio-button></el-radio-group></el-form-item></el-form><template #footer><el-button @click="fillDialogVisible = false">取消</el-button><el-button type="primary" @click="fillDialogVisible = false; submitAction('评估已保存')">保存</el-button></template></el-dialog>
    <el-dialog v-model="reviewDialogVisible" title="评估审核" width="620px"><el-form label-width="110px"><el-form-item label="评估"><el-input :model-value="selected?.id" disabled /></el-form-item><el-form-item label="审核结果"><el-radio-group model-value="pass"><el-radio-button label="pass">通过</el-radio-button><el-radio-button label="return">退回</el-radio-button><el-radio-button label="event">生成事件</el-radio-button></el-radio-group></el-form-item><el-form-item label="审核意见"><el-input type="textarea" :rows="3" placeholder="记录风险判断、随访建议和回写结果" /></el-form-item></el-form><template #footer><el-button @click="reviewDialogVisible = false">取消</el-button><el-button type="primary" @click="reviewDialogVisible = false; submitAction('评估审核结果已回写')">提交审核</el-button></template></el-dialog>
    <el-drawer v-model="traceDrawerVisible" title="评估追溯" size="520px"><el-timeline><el-timeline-item timestamp="2026-05-10 07:30" type="primary">护士提交评估</el-timeline-item><el-timeline-item timestamp="2026-05-10 07:31">系统判定风险并推送责任团队</el-timeline-item><el-timeline-item timestamp="2026-05-10 08:00" type="success">审核后写入健康档案或预警</el-timeline-item></el-timeline></el-drawer>
  </section>
</template>
