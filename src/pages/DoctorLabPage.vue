<script setup lang="ts">
import { ref } from 'vue';
import { CircleCheck, Histogram, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

type LabRow = {
  id: string;
  patient: string;
  reportType: string;
  reportView: string;
  item: string;
  value: string;
  refRange: string;
  trend: string;
  status: string;
  reportTime: string;
  reviewer: string;
  nextAction: string;
};

const trendDrawerVisible = ref(false);
const eventDialogVisible = ref(false);
const adoptDialogVisible = ref(false);
const selected = ref<LabRow | null>(null);

const rows: LabRow[] = [
  { id: 'LAB-001', patient: '王建国', reportType: '生化', reportView: '标准化检验结果查看', item: '血钾 K+', value: '4.8 mmol/L', refRange: '3.5-5.5', trend: '平稳', status: '达标', reportTime: '2026-05-10 07:42', reviewer: '刘主任', nextAction: '处方引用' },
  { id: 'LAB-002', patient: '李秀兰', reportType: '营养', reportView: '原始检验报告查看', item: '白蛋白 Alb', value: '34 g/L', refRange: '35-50', trend: '下降', status: '异常', reportTime: '2026-05-08 09:30', reviewer: '陈宁', nextAction: '营养评估' },
  { id: 'LAB-003', patient: '赵明', reportType: '生化', reportView: '危急值查看', item: '血钾 K+', value: '5.9 mmol/L', refRange: '3.5-5.5', trend: '上升', status: '危急关注', reportTime: '2026-05-10 07:42', reviewer: '张明', nextAction: '转临床事件' },
  { id: 'LAB-004', patient: '陈志强', reportType: '钙磷', reportView: '达标 / 不达标查看', item: '血磷 P', value: '2.05 mmol/L', refRange: '0.81-1.45', trend: '上升', status: '异常', reportTime: '2026-05-08 09:30', reviewer: '刘主任', nextAction: '用药调整' },
  { id: 'LAB-005', patient: '刘梅英', reportType: '血常规', reportView: '检验趋势图', item: '血红蛋白 Hb', value: '89 g/L', refRange: '100-120', trend: '下降', status: '异常', reportTime: '2026-05-08 09:30', reviewer: '陈宁', nextAction: '贫血评估' },
  { id: 'LAB-006', patient: '孙海', reportType: '充分性', reportView: '标准化检验结果查看', item: 'Kt/V', value: '1.34', refRange: '>=1.20', trend: '平稳', status: '达标', reportTime: '2026-05-03 11:20', reviewer: '刘主任', nextAction: '报告归档' },
  { id: 'LAB-007', patient: '马丽', reportType: '感染标志', reportView: '检查报告查看', item: 'HBsAg', value: '阳性', refRange: '阴性', trend: '持续阳性', status: '隔离标识', reportTime: '2026-05-08 10:00', reviewer: '感控护士', nextAction: '隔离透析' },
  { id: 'LAB-008', patient: '周庆', reportType: '心功能', reportView: '检查结果查看', item: 'BNP', value: '980 pg/mL', refRange: '<100', trend: '上升', status: '异常', reportTime: '2026-05-09 08:20', reviewer: '王主任', nextAction: '心功能评估' },
  { id: 'LAB-009', patient: '何雪', reportType: '钙磷', reportView: '达标 / 不达标查看', item: '钙磷乘积', value: '58', refRange: '<55', trend: '上升', status: '未达标', reportTime: '2026-05-08 09:30', reviewer: '刘主任', nextAction: '降磷药调整' },
  { id: 'LAB-010', patient: '郭强', reportType: '充分性', reportView: '检验异常处理', item: 'Kt/V', value: '1.18', refRange: '>=1.20', trend: '下降', status: '未达标', reportTime: '2026-05-03 11:20', reviewer: '张明', nextAction: '处方调整' },
];

const activeTables = ['lab_report', 'lab_result_item', 'critical_value_notice', 'clinical_assessment'];

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value === '达标' || value === '平稳') return 'success';
  if (value.includes('危急')) return 'danger';
  if (value.includes('异常') || value.includes('未达标') || value.includes('上升') || value.includes('下降')) return 'warning';
  return 'info';
}

function openTrend(row: LabRow): void {
  selected.value = row;
  trendDrawerVisible.value = true;
}

function openEvent(row: LabRow): void {
  selected.value = row;
  eventDialogVisible.value = true;
}

function openAdopt(row: LabRow): void {
  selected.value = row;
  adoptDialogVisible.value = true;
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
            <p>查看检验检查结果、趋势、达标判定和危急值，异常结果可生成评估、病程、临床事件或处方调整依据。</p>
          </div>
          <div class="clinical-actions">
            <el-button type="primary" :icon="Histogram" @click="openTrend(rows[2])">查看趋势</el-button>
            <el-button :icon="Warning" @click="openEvent(rows[2])">转临床事件</el-button>
            <el-button :icon="CircleCheck" @click="openAdopt(rows[0])">采纳引用</el-button>
          </div>
        </div>
      </template>

      <el-form class="clinical-filter" inline>
        <el-form-item label="关键字"><el-input placeholder="患者、项目、结果、报告类型" clearable /></el-form-item>
        <el-form-item label="报告类型"><el-select placeholder="全部类型" clearable><el-option label="生化" value="生化" /><el-option label="血常规" value="血常规" /><el-option label="钙磷" value="钙磷" /><el-option label="感染标志" value="感染标志" /></el-select></el-form-item>
        <el-form-item label="查看类型"><el-select placeholder="全部查看" clearable><el-option label="标准化检验结果查看" value="标准化检验结果查看" /><el-option label="原始检验报告查看" value="原始检验报告查看" /><el-option label="检验趋势图" value="检验趋势图" /><el-option label="危急值查看" value="危急值查看" /><el-option label="达标 / 不达标查看" value="达标 / 不达标查看" /><el-option label="检验异常处理" value="检验异常处理" /><el-option label="检查结果查看" value="检查结果查看" /><el-option label="检查报告查看" value="检查报告查看" /></el-select></el-form-item>
        <el-form-item label="判定"><el-select placeholder="全部判定" clearable><el-option label="达标" value="达标" /><el-option label="异常" value="异常" /><el-option label="危急关注" value="危急关注" /><el-option label="未达标" value="未达标" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <el-table :data="rows" border stripe>
        <el-table-column prop="id" label="报告项" width="105" fixed="left" />
        <el-table-column prop="patient" label="患者" width="100" />
        <el-table-column prop="reportType" label="报告类型" width="105" />
        <el-table-column prop="reportView" label="查看类型" min-width="160" />
        <el-table-column prop="item" label="项目" min-width="130" />
        <el-table-column prop="value" label="结果" width="120" />
        <el-table-column prop="refRange" label="参考范围" width="120" />
        <el-table-column prop="trend" label="趋势" width="100"><template #default="{ row }"><el-tag :type="tagType(row.trend)" effect="plain">{{ row.trend }}</el-tag></template></el-table-column>
        <el-table-column prop="status" label="判定" width="115"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="reportTime" label="报告时间" width="150" />
        <el-table-column prop="reviewer" label="责任人" width="105" />
        <el-table-column prop="nextAction" label="下一步" min-width="130" />
        <el-table-column label="操作" width="230" fixed="right">
          <template #default="{ row }"><el-button link type="primary" @click="openTrend(row)">趋势</el-button><el-button link @click="openAdopt(row)">引用</el-button><el-button link type="danger" @click="openEvent(row)">转事件</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-drawer v-model="trendDrawerVisible" title="检验趋势查看" size="620px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="患者">{{ selected?.patient }}</el-descriptions-item>
        <el-descriptions-item label="项目">{{ selected?.item }}</el-descriptions-item>
        <el-descriptions-item label="本次结果">{{ selected?.value }}</el-descriptions-item>
        <el-descriptions-item label="趋势">{{ selected?.trend }}</el-descriptions-item>
      </el-descriptions>
      <el-timeline class="clinical-event-timeline">
        <el-timeline-item timestamp="2026-04-10">上月结果：接近参考范围</el-timeline-item>
        <el-timeline-item timestamp="2026-05-08" type="warning">本月结果：{{ selected?.value }}，{{ selected?.status }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10" type="primary">建议：{{ selected?.nextAction }}</el-timeline-item>
      </el-timeline>
    </el-drawer>

    <el-dialog v-model="eventDialogVisible" title="异常结果转临床事件" width="620px">
      <el-alert type="warning" show-icon :closable="false" title="危急值和高风险异常需明确通知、处理人和关闭条件。" />
      <el-form class="dialog-form" label-width="110px">
        <el-form-item label="检验项"><el-input :model-value="selected ? `${selected.item}：${selected.value}` : ''" disabled /></el-form-item>
        <el-form-item label="事件类型"><el-select model-value="critical"><el-option label="危急值处理" value="critical" /><el-option label="疗效未达标" value="effect" /><el-option label="用药调整" value="drug" /></el-select></el-form-item>
        <el-form-item label="处理要求"><el-input type="textarea" :rows="3" placeholder="通知对象、处理建议、复查计划和关闭条件" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="eventDialogVisible = false">取消</el-button><el-button type="primary" @click="eventDialogVisible = false; submitAction('异常检验已转为临床事件')">提交事件</el-button></template>
    </el-dialog>

    <el-dialog v-model="adoptDialogVisible" title="检验结果采纳引用" width="580px">
      <el-form label-width="110px">
        <el-form-item label="检验项"><el-input :model-value="selected ? `${selected.patient} / ${selected.item}` : ''" disabled /></el-form-item>
        <el-form-item label="引用用途"><el-checkbox-group model-value="assessment"><el-checkbox-button label="assessment">病情评估</el-checkbox-button><el-checkbox-button label="record">病程</el-checkbox-button><el-checkbox-button label="order">医嘱处方</el-checkbox-button><el-checkbox-button label="report">健康报告</el-checkbox-button></el-checkbox-group></el-form-item>
        <el-form-item label="引用说明"><el-input type="textarea" :rows="3" placeholder="说明采纳口径、异常解释和后续计划" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="adoptDialogVisible = false">取消</el-button><el-button type="primary" @click="adoptDialogVisible = false; submitAction('检验结果已采纳引用')">确认引用</el-button></template>
    </el-dialog>
  </section>
</template>
