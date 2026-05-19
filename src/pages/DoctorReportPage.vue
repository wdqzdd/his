<script setup lang="ts">
import { ref } from 'vue';
import { CircleCheck, Document, Search, Upload } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

type ReportRow = {
  id: string;
  patient: string;
  period: string;
  score: string;
  summary: string;
  dataQuote: string;
  riskTip: string;
  missing: string;
  status: string;
  publisher: string;
  nextAction: string;
};

const previewDrawerVisible = ref(false);
const generateDialogVisible = ref(false);
const publishDialogVisible = ref(false);
const selected = ref<ReportRow | null>(null);

const rows: ReportRow[] = [
  { id: 'RPT-001', patient: '王建国 / HD-00038', period: '2026-05', score: '86', summary: '充分性达标，血钾稳定，贫血需观察', dataQuote: '自动引用患者数据', riskTip: '健康风险提示：贫血观察', missing: '无', status: '可生成', publisher: '刘主任', nextAction: '归档打印' },
  { id: 'RPT-002', patient: '李秀兰 / HD-00072', period: '2026-05', score: '72', summary: '营养偏低，导管护理风险', dataQuote: '自动引用检验和通路', riskTip: '健康风险提示：导管感染', missing: '专科评估待复核', status: '待补充', publisher: '陈宁', nextAction: '补评估' },
  { id: 'RPT-003', patient: '赵明 / HD-00116', period: '2026-05', score: '65', summary: '高钾危急值待处理', dataQuote: '自动引用危急值', riskTip: '健康风险提示：高钾', missing: '同意书缺失、事件未关闭', status: '不可生成', publisher: '张明', nextAction: '关闭事件' },
  { id: 'RPT-004', patient: '陈志强 / HD-00128', period: '2026-05', score: '78', summary: '通路狭窄复查中', dataQuote: '自动引用通路事件', riskTip: '健康风险提示：通路狭窄', missing: '通路报告', status: '待补充', publisher: '刘主任', nextAction: '补通路检查' },
  { id: 'RPT-005', patient: '刘梅英 / HD-00151', period: '2026-05', score: '70', summary: '贫血未达标，需调整促红素', dataQuote: '自动引用检验趋势', riskTip: '健康风险提示：贫血', missing: '贫血评估', status: '待补充', publisher: '陈宁', nextAction: '补评估' },
  { id: 'RPT-006', patient: '孙海 / HD-00177', period: '2026-05', score: '90', summary: '整体稳定，处方可复用', dataQuote: '自动引用治疗归档', riskTip: '健康风险提示：低风险', missing: '无', status: '已发布', publisher: '刘主任', nextAction: '患者端查看' },
  { id: 'RPT-007', patient: '马丽 / HD-00203', period: '2026-05', score: '82', summary: '隔离透析稳定', dataQuote: '自动引用感控记录', riskTip: '健康风险提示：隔离管理', missing: '感控复核', status: '可生成', publisher: '张明', nextAction: '生成报告' },
  { id: 'RPT-008', patient: '周庆 / HD-00218', period: '2026-05', score: '68', summary: '心衰风险和低血压事件', dataQuote: '自动引用事件记录', riskTip: '健康风险提示：心衰低血压', missing: '心功能评估', status: '待补充', publisher: '王主任', nextAction: '补心评估' },
  { id: 'RPT-009', patient: '何雪 / HD-00246', period: '2026-05', score: '76', summary: '血磷偏高，已调整降磷药', dataQuote: '自动引用医嘱执行', riskTip: '健康风险提示：钙磷异常', missing: '复查计划', status: '可生成', publisher: '刘主任', nextAction: '生成报告' },
  { id: 'RPT-010', patient: '郭强 / HD-00277', period: '2026-05', score: '60', summary: '充分性不足，需处方调整', dataQuote: '自动引用充分性指标', riskTip: '健康风险提示：充分性不足', missing: '病程未签名', status: '不可生成', publisher: '张明', nextAction: '补病程' },
];

const activeTables = ['health_report', 'clinical_assessment', 'lab_report', 'treatment_archive'];

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value === '可生成' || value === '已发布' || value === '无') return 'success';
  if (value === '不可生成') return 'danger';
  if (value.includes('待') || value !== '无') return 'warning';
  return 'info';
}

function openPreview(row: ReportRow): void {
  selected.value = row;
  previewDrawerVisible.value = true;
}

function openGenerate(row?: ReportRow): void {
  selected.value = row ?? rows[0];
  generateDialogVisible.value = true;
}

function openPublish(row: ReportRow): void {
  selected.value = row;
  publishDialogVisible.value = true;
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
            <p>基于治疗归档、检验趋势、评估结论、通路事件和医嘱执行生成患者健康报告，发布到居家个人主页。</p>
          </div>
          <div class="clinical-actions">
            <el-button type="primary" :icon="Document" @click="openGenerate()">生成报告</el-button>
            <el-button :icon="Upload" @click="openPublish(rows[0])">发布患者端</el-button>
          </div>
        </div>
      </template>

      <el-form class="clinical-filter" inline>
        <el-form-item label="关键字"><el-input placeholder="患者、报告期、摘要" clearable /></el-form-item>
        <el-form-item label="报告期"><el-date-picker type="month" placeholder="选择月份" /></el-form-item>
        <el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="待补充" value="待补充" /><el-option label="可生成" value="可生成" /><el-option label="不可生成" value="不可生成" /><el-option label="已发布" value="已发布" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <el-table :data="rows" border stripe>
        <el-table-column prop="id" label="报告号" width="105" fixed="left" />
        <el-table-column prop="patient" label="患者" min-width="155" />
        <el-table-column prop="period" label="报告期" width="100" />
        <el-table-column prop="score" label="综合分" width="85" />
        <el-table-column prop="summary" label="报告摘要" min-width="240" />
        <el-table-column prop="dataQuote" label="自动引用患者数据" min-width="150" />
        <el-table-column prop="riskTip" label="健康风险提示" min-width="170" />
        <el-table-column prop="missing" label="缺项" min-width="150"><template #default="{ row }"><el-tag :type="tagType(row.missing)" effect="plain">{{ row.missing }}</el-tag></template></el-table-column>
        <el-table-column prop="status" label="状态" width="110"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="publisher" label="发布医生" width="105" />
        <el-table-column prop="nextAction" label="下一步" min-width="130" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }"><el-button link type="primary" @click="openPreview(row)">预览</el-button><el-button link @click="openGenerate(row)">生成</el-button><el-button link @click="openPublish(row)">发布</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-drawer v-model="previewDrawerVisible" title="健康报告预览" size="640px">
      <div class="report-drawer">
        <div class="report-preview">
          <div><strong>{{ selected?.patient }} 月度健康报告</strong><p>{{ selected?.summary }}</p></div>
          <div class="report-score"><span>综合分</span><strong>{{ selected?.score }}</strong></div>
        </div>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="缺项">{{ selected?.missing }}</el-descriptions-item>
          <el-descriptions-item label="自动引用">{{ selected?.dataQuote }}</el-descriptions-item>
          <el-descriptions-item label="风险提示">{{ selected?.riskTip }}</el-descriptions-item>
          <el-descriptions-item label="发布医生">{{ selected?.publisher }}</el-descriptions-item>
          <el-descriptions-item label="下一步">{{ selected?.nextAction }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-drawer>

    <el-dialog v-model="generateDialogVisible" title="生成健康报告" width="620px">
      <el-form label-width="110px">
        <el-form-item label="患者"><el-input :model-value="selected?.patient" disabled /></el-form-item>
        <el-form-item label="报告期"><el-date-picker type="month" /></el-form-item>
        <el-form-item label="生成范围"><el-checkbox-group model-value="lab"><el-checkbox-button label="lab">检验趋势</el-checkbox-button><el-checkbox-button label="treatment">治疗归档</el-checkbox-button><el-checkbox-button label="event">临床事件</el-checkbox-button><el-checkbox-button label="assessment">病情评估</el-checkbox-button></el-checkbox-group></el-form-item>
        <el-form-item label="编辑小结"><el-input type="textarea" :rows="3" placeholder="编辑小结、月度变化和治疗完成情况" /></el-form-item>
        <el-form-item label="医生建议"><el-input type="textarea" :rows="3" placeholder="下月复查、饮食用药、通路护理和就医建议" /></el-form-item>
        <el-form-item label="归档打印"><el-checkbox-group model-value="archive"><el-checkbox-button label="archive">归档</el-checkbox-button><el-checkbox-button label="print">打印</el-checkbox-button><el-checkbox-button label="home">发布患者端</el-checkbox-button></el-checkbox-group></el-form-item>
      </el-form>
      <template #footer><el-button @click="generateDialogVisible = false">取消</el-button><el-button type="primary" @click="generateDialogVisible = false; submitAction('健康报告已生成草稿')">生成草稿</el-button></template>
    </el-dialog>

    <el-dialog v-model="publishDialogVisible" title="发布到患者端" width="560px">
      <el-form label-width="100px">
        <el-form-item label="报告"><el-input :model-value="selected?.id" disabled /></el-form-item>
        <el-form-item label="发布方式"><el-checkbox-group model-value="home"><el-checkbox-button label="home">居家主页</el-checkbox-button><el-checkbox-button label="message">消息提醒</el-checkbox-button><el-checkbox-button label="task">阅读待办</el-checkbox-button></el-checkbox-group></el-form-item>
        <el-form-item label="发布说明"><el-input type="textarea" :rows="3" placeholder="患者端展示说明和需确认事项" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="publishDialogVisible = false">取消</el-button><el-button type="primary" @click="publishDialogVisible = false; submitAction('健康报告已发布到患者端')">确认发布</el-button></template>
    </el-dialog>
  </section>
</template>
