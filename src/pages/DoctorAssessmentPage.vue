<script setup lang="ts">
import { ref } from 'vue';
import { CircleCheck, Document, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();

type AssessmentRow = {
  id: string;
  patient: string;
  type: string;
  itemSummary: string;
  conclusion: string;
  risk: string;
  source: string;
  status: string;
  owner: string;
  nextAction: string;
};

const editDialogVisible = ref(false);
const reviewDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const selected = ref<AssessmentRow | null>(null);

const isSpecial = props.context.menuKey === 'doctor-special-assess';
const rows: AssessmentRow[] = [
  { id: 'ASM-001', patient: '王建国', type: '透析充分性评估', itemSummary: 'Kt/V 1.32，URR达标', conclusion: '充分性达标，维持当前处方', risk: '低', source: '检验+治疗记录', status: '已完成', owner: '刘主任', nextAction: '处方复用' },
  { id: 'ASM-002', patient: '李秀兰', type: '营养评估', itemSummary: 'Alb 34g/L，食欲差', conclusion: '白蛋白偏低，需营养宣教', risk: '中', source: '检验+居家评估', status: '待复评', owner: '陈宁', nextAction: '营养任务' },
  { id: 'ASM-003', patient: '赵明', type: '高钾风险评估', itemSummary: 'K 5.9mmol/L', conclusion: '需处理危急值并调整透析液', risk: '高', source: '检验科危急值', status: '待处理', owner: '张明', nextAction: '临床事件' },
  { id: 'ASM-004', patient: '陈志强', type: '血管通路评估', itemSummary: '人工血管震颤稍弱', conclusion: '建议通路超声复查', risk: '中', source: '护士通路记录', status: '已完成', owner: '刘主任', nextAction: '通路申请' },
  { id: 'ASM-005', patient: '刘梅英', type: '贫血管理评估', itemSummary: 'Hb 89g/L', conclusion: '促红素方案需调整', risk: '高', source: '检验趋势', status: '待完成', owner: '陈宁', nextAction: '补充评估' },
  { id: 'ASM-006', patient: '孙海', type: '常见病情评估', itemSummary: '无胸闷、无水肿', conclusion: '病情稳定', risk: '低', source: '居家评估', status: '已完成', owner: '刘主任', nextAction: '归档' },
  { id: 'ASM-007', patient: '马丽', type: '感染隔离评估', itemSummary: 'HBsAg阳性，体温正常', conclusion: '继续固定隔离机位', risk: '中', source: '检验+感控', status: '已完成', owner: '张明', nextAction: '隔离排班' },
  { id: 'ASM-008', patient: '周庆', type: '心血管风险评估', itemSummary: 'BNP高，透中低血压史', conclusion: '限制超滤，建议心内会诊', risk: '高', source: '检验+事件', status: '待复评', owner: '王主任', nextAction: '调整处方' },
  { id: 'ASM-009', patient: '何雪', type: '钙磷代谢评估', itemSummary: 'P 2.05，钙磷乘积高', conclusion: '调整降磷药并宣教', risk: '中', source: '检验趋势', status: '已完成', owner: '刘主任', nextAction: '药师审核' },
  { id: 'ASM-010', patient: '郭强', type: '疗效达标评估', itemSummary: 'Kt/V 1.18', conclusion: '未达标，需调整血流和时长', risk: '高', source: '治疗记录', status: '待完成', owner: '张明', nextAction: '处方调整' },
];

const activeTables = ['clinical_assessment', 'assessment_template', 'warning_event', 'medical_record'];

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value === '低' || value === '已完成') return 'success';
  if (value === '高' || value.includes('待处理')) return 'danger';
  if (value.includes('待') || value === '中') return 'warning';
  return 'info';
}

function openEdit(row?: AssessmentRow): void {
  selected.value = row ?? rows[0];
  editDialogVisible.value = true;
}

function openReview(row: AssessmentRow): void {
  selected.value = row;
  reviewDialogVisible.value = true;
}

function openTrace(row: AssessmentRow): void {
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
            <h2>{{ isSpecial ? '专科病情评估' : '常见病情评估' }}</h2>
            <p>{{ isSpecial ? '围绕充分性、通路、贫血、钙磷、感染隔离和心血管风险形成处方前置依据。' : '围绕症状、血压、体重、用药、营养和居家上报完成常见病情评估。' }}</p>
          </div>
          <div class="clinical-actions">
            <el-button type="primary" :icon="Document" @click="openEdit()">新增评估</el-button>
            <el-button :icon="CircleCheck" @click="openReview(rows[2])">审核评估</el-button>
          </div>
        </div>
      </template>

      <el-form class="clinical-filter" inline>
        <el-form-item label="关键字"><el-input placeholder="患者、评估类型、结论" clearable /></el-form-item>
        <el-form-item label="评估类型"><el-select placeholder="全部类型" clearable><el-option label="透析充分性评估" value="透析充分性评估" /><el-option label="血管通路评估" value="血管通路评估" /><el-option label="心血管风险评估" value="心血管风险评估" /><el-option label="常见病情评估" value="常见病情评估" /></el-select></el-form-item>
        <el-form-item label="风险"><el-select placeholder="全部风险" clearable><el-option label="高" value="高" /><el-option label="中" value="中" /><el-option label="低" value="低" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <el-table :data="rows" border stripe>
        <el-table-column prop="id" label="评估号" width="105" fixed="left" />
        <el-table-column prop="patient" label="患者" width="100" />
        <el-table-column prop="type" label="评估类型" min-width="150" />
        <el-table-column prop="itemSummary" label="关键指标" min-width="180" />
        <el-table-column prop="conclusion" label="评估结论" min-width="240" />
        <el-table-column prop="risk" label="风险" width="80"><template #default="{ row }"><el-tag :type="tagType(row.risk)">{{ row.risk }}</el-tag></template></el-table-column>
        <el-table-column prop="source" label="来源" min-width="140" />
        <el-table-column prop="status" label="状态" width="105"><template #default="{ row }"><el-tag :type="tagType(row.status)" effect="plain">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="owner" label="责任医生" width="105" />
        <el-table-column prop="nextAction" label="下一步" min-width="130" />
        <el-table-column label="操作" width="210" fixed="right">
          <template #default="{ row }"><el-button link type="primary" @click="openEdit(row)">评估</el-button><el-button link @click="openReview(row)">审核</el-button><el-button link @click="openTrace(row)">追溯</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="editDialogVisible" title="病情评估表" width="700px">
      <el-form label-width="112px">
        <el-form-item label="患者"><el-input :model-value="selected?.patient" /></el-form-item>
        <el-form-item label="评估类型"><el-select :model-value="selected?.type"><el-option label="常见病情评估" value="常见病情评估" /><el-option label="透析充分性评估" value="透析充分性评估" /><el-option label="血管通路评估" value="血管通路评估" /><el-option label="心血管风险评估" value="心血管风险评估" /></el-select></el-form-item>
        <el-form-item label="关键指标"><el-input type="textarea" :rows="2" :model-value="selected?.itemSummary" /></el-form-item>
        <el-form-item label="评估结论"><el-input type="textarea" :rows="3" :model-value="selected?.conclusion" /></el-form-item>
        <el-form-item label="风险等级"><el-radio-group :model-value="selected?.risk"><el-radio-button label="低">低</el-radio-button><el-radio-button label="中">中</el-radio-button><el-radio-button label="高">高</el-radio-button></el-radio-group></el-form-item>
      </el-form>
      <template #footer><el-button @click="editDialogVisible = false">取消</el-button><el-button type="primary" @click="editDialogVisible = false; submitAction('病情评估已保存并重新计算处方准入')">保存评估</el-button></template>
    </el-dialog>

    <el-dialog v-model="reviewDialogVisible" title="评估审核与联动" width="640px">
      <el-alert v-if="selected?.risk === '高'" type="warning" show-icon :closable="false" title="高风险评估应明确是否生成预警、临床事件或处方限制。" />
      <el-form class="dialog-form" label-width="110px">
        <el-form-item label="评估"><el-input :model-value="selected?.id" disabled /></el-form-item>
        <el-form-item label="联动处理"><el-checkbox-group model-value="record"><el-checkbox-button label="record">写入病程</el-checkbox-button><el-checkbox-button label="order">处方依据</el-checkbox-button><el-checkbox-button label="warning">生成预警</el-checkbox-button><el-checkbox-button label="cqi">CQI线索</el-checkbox-button></el-checkbox-group></el-form-item>
        <el-form-item label="审核意见"><el-input type="textarea" :rows="3" placeholder="审核结论、处方限制、复查计划和联动说明" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="reviewDialogVisible = false">取消</el-button><el-button type="primary" @click="reviewDialogVisible = false; submitAction('评估审核结果已回写')">提交审核</el-button></template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="评估追溯" size="520px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-10 08:10" type="primary">创建评估：{{ selected?.type }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 08:18">引用检验、治疗记录、居家评估和通路数据</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 08:30" type="success">审核后输出给医嘱处方、预警和健康报告</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
