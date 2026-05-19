<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  CircleCheck,
  DataAnalysis,
  Download,
  Histogram,
  Refresh,
  Search,
  Warning,
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{
  context: PageContext;
}>();

type ReportMetric = {
  code: string;
  category: string;
  name: string;
  dimension: string;
  value: string;
  target: string;
  trend: string;
  status: string;
  source: string;
  owner: string;
  drillCount: number;
  nextAction: string;
};

type SnapshotRow = {
  id: string;
  reportType: string;
  period: string;
  generatedAt: string;
  status: string;
  metrics: number;
  exceptionCount: number;
  publisher: string;
};

const sectionByMenu: Record<string, string> = {
  'report-patient': 'patient',
  'report-dialysis': 'dialysis',
  'report-bed': 'bed',
  'report-lab': 'lab',
  'report-quality': 'quality',
  'report-infection': 'infection',
  'report-warning': 'warning',
  'report-fee': 'fee',
  'report-campus': 'campus',
};

const activeTab = ref(sectionByMenu[props.context.menuKey] ?? 'patient');
const selectedMetricCode = ref('RPT-001');
const snapshotDialogVisible = ref(false);
const exportDialogVisible = ref(false);
const drillDrawerVisible = ref(false);
const cqiDialogVisible = ref(false);

watch(
  () => props.context.menuKey,
  (menuKey) => {
    activeTab.value = sectionByMenu[menuKey] ?? 'patient';
  },
);

const metrics = ref<ReportMetric[]>([
  { code: 'RPT-001', category: '患者统计', name: '在透患者数', dimension: '总院区/血液净化中心', value: '386', target: '稳定管理', trend: '+12', status: '正常', source: 'patient_master, contract_record', owner: '导诊台', drillCount: 386, nextAction: '查看患者清单' },
  { code: 'RPT-002', category: '透析统计', name: '本月治疗人次', dimension: '2026-05', value: '4,812', target: '按排班完成', trend: '+4.6%', status: '正常', source: 'dialysis_session, schedule_bed', owner: '护士站', drillCount: 4812, nextAction: '下钻治疗记录' },
  { code: 'RPT-003', category: '机位统计', name: '机位利用率', dimension: 'A/B/C区', value: '87.6%', target: '80%-92%', trend: '+2.1%', status: '正常', source: 'schedule_bed, device_bed_binding', owner: '医务医事站', drillCount: 64, nextAction: '查看班次与机位' },
  { code: 'RPT-004', category: '检验指标统计', name: '血钾达标率', dimension: '月度', value: '91.8%', target: '>=92%', trend: '-1.4%', status: '关注', source: 'lab_result, alert_event', owner: '医生站', drillCount: 29, nextAction: '下钻异常患者' },
  { code: 'RPT-005', category: '质控统计', name: 'Kt/V 达标率', dimension: '维持透析患者', value: '88.2%', target: '>=90%', trend: '-2.8%', status: '异常', source: 'dialysis_session, efficacy_evaluation', owner: '医生站', drillCount: 46, nextAction: '生成CQI' },
  { code: 'RPT-006', category: '感控指标统计', name: '手卫生依从率', dimension: '医生/护士/技师', value: '94.1%', target: '>=95%', trend: '-0.9%', status: '关注', source: 'infection_check, infection_training', owner: '感控管理', drillCount: 18, nextAction: '安排培训' },
  { code: 'RPT-007', category: '预警统计', name: '危急值闭环率', dimension: '检验危急值', value: '96.7%', target: '100%', trend: '+1.2%', status: '关注', source: 'lab_result, alert_handle_record', owner: '检验科工作站', drillCount: 6, nextAction: '催办未闭环' },
  { code: 'RPT-008', category: '费用统计', name: '欠费患者数', dimension: '医保/自费', value: '23', target: '持续下降', trend: '+5', status: '异常', source: 'patient_fee_detail, stock_consume_record', owner: '药品耗材与费用管理', drillCount: 23, nextAction: '通知导诊跟进' },
  { code: 'RPT-009', category: '院区对比分析', name: '水质异常次数', dimension: '总院区/东院区', value: '3', target: '0', trend: '+1', status: '异常', source: 'water_quality_record, device_alert', owner: '技师与设备站', drillCount: 3, nextAction: '查看水处理记录' },
  { code: 'RPT-010', category: '透析统计', name: '临时加透人次', dimension: '急诊/门诊', value: '42', target: '<=50', trend: '-6', status: '正常', source: 'schedule_bed, appointment_request', owner: '导诊台', drillCount: 42, nextAction: '分析加透原因' },
  { code: 'RPT-011', category: '质控统计', name: '透中低血压发生率', dimension: '本月治疗', value: '6.4%', target: '<=5%', trend: '+0.8%', status: '异常', source: 'dialysis_monitor, nursing_record', owner: '护士站', drillCount: 71, nextAction: '生成护理改进' },
  { code: 'RPT-012', category: '患者统计', name: '新签约患者数', dimension: '2026-05', value: '18', target: '按容量评估', trend: '+3', status: '正常', source: 'contract_record, patient_master', owner: '导诊台', drillCount: 18, nextAction: '查看签约明细' },
  { code: 'RPT-013', category: '患者统计', name: '年龄/性别/原发病/透析龄构成', dimension: '在管患者', value: '4类分布', target: '结构可下钻', trend: '+2%糖尿病', status: '关注', source: 'patient_master, patient_diagnosis, dialysis_first_record', owner: '统计分析员', drillCount: 386, nextAction: '查看患者构成' },
  { code: 'RPT-014', category: '透析统计', name: '透析模式与班次统计', dimension: 'HD/HDF/HP/CRRT + 班次', value: '3980/612/176/44', target: '容量均衡', trend: '+3.2%HDF', status: '正常', source: 'dialysis_prescription, schedule_bed', owner: '医生站/护士站', drillCount: 4812, nextAction: '查看模式班次' },
  { code: 'RPT-015', category: '检验指标统计', name: '钙/Kt/V/URR/检验完成率', dimension: '月度必检', value: '4项追踪', target: '按规则达标', trend: '-1.5%完成率', status: '异常', source: 'lab_order, lab_result, efficacy_evaluation', owner: '检验科/医生站', drillCount: 182, nextAction: '催办未完成检验' },
  { code: 'RPT-016', category: '感控指标统计', name: '传染病转阳率与导管感染率', dimension: 'HBV/HCV/HIV/梅毒/导管', value: '2项异常', target: '0转阳', trend: '+2线索', status: '异常', source: 'infectious_screening_result, vascular_access_event', owner: '感控管理', drillCount: 9, nextAction: '生成感控复核' },
  { code: 'RPT-017', category: '费用统计', name: '库存周转与异常消耗', dimension: '药品/耗材', value: '31天/24天, 19例异常', target: '15-35天, 异常0', trend: '+5异常', status: '异常', source: 'inventory_ledger, consume_fee_match', owner: '药耗管理', drillCount: 205, nextAction: '生成消耗复核' },
  { code: 'RPT-018', category: '院区对比分析', name: '检验达标与费用对比', dimension: '总院/东院/居家', value: 'Hb 86.2%/费用326.8万', target: '同口径对比', trend: '-2.0%Hb', status: '关注', source: 'lab_result, patient_fee_detail', owner: '运营管理组', drillCount: 4866, nextAction: '下钻院区差异' },
]);

const snapshots = ref<SnapshotRow[]>([
  { id: 'SN-20260510-01', reportType: '运营日报', period: '2026-05-10', generatedAt: '2026-05-10 18:00', status: '已发布', metrics: 42, exceptionCount: 6, publisher: '统计分析员' },
  { id: 'SN-202605-01', reportType: '月度质控报表', period: '2026-05', generatedAt: '2026-05-10 09:00', status: '草稿', metrics: 78, exceptionCount: 11, publisher: '质量管理组' },
  { id: 'SN-2026Q2-01', reportType: '季度院区对比', period: '2026Q2', generatedAt: '2026-05-09 17:30', status: '复核中', metrics: 56, exceptionCount: 8, publisher: '运营管理组' },
]);

const selectedMetric = computed(() => metrics.value.find((item) => item.code === selectedMetricCode.value) ?? metrics.value[0]);

const summaryCards = computed(() => [
  { label: '指标总数', value: metrics.value.length, tone: 'blue' },
  { label: '异常指标', value: metrics.value.filter((item) => item.status === '异常').length, tone: 'red' },
  { label: '关注指标', value: metrics.value.filter((item) => item.status === '关注').length, tone: 'orange' },
  { label: '可下钻记录', value: metrics.value.reduce((sum, item) => sum + item.drillCount, 0), tone: 'green' },
  { label: '报表快照', value: snapshots.value.length, tone: 'blue' },
]);

const categoryRows = computed(() => {
  const grouped = metrics.value.reduce<Record<string, { total: number; abnormal: number; drill: number }>>((acc, item) => {
    acc[item.category] ??= { total: 0, abnormal: 0, drill: 0 };
    acc[item.category].total += 1;
    acc[item.category].abnormal += item.status === '异常' ? 1 : 0;
    acc[item.category].drill += item.drillCount;
    return acc;
  }, {});
  return Object.entries(grouped).map(([name, item]) => ({ name, ...item }));
});

const closureChecks = computed(() => [
  { label: '指标定义', value: selectedMetric.value.code, pass: true },
  { label: '来源表', value: selectedMetric.value.source, pass: true },
  { label: '目标值', value: selectedMetric.value.target, pass: Boolean(selectedMetric.value.target) },
  { label: '下钻记录', value: `${selectedMetric.value.drillCount} 条`, pass: selectedMetric.value.drillCount > 0 },
  { label: '责任工作站', value: selectedMetric.value.owner, pass: true },
  { label: '异常处理', value: selectedMetric.value.nextAction, pass: selectedMetric.value.status !== '异常' || selectedMetric.value.nextAction.includes('生成') || selectedMetric.value.nextAction.includes('查看') },
]);

const drillRows = computed(() => [
  { type: '患者', id: 'P-00072', name: '李秀兰', source: 'patient_master', status: selectedMetric.value.status },
  { type: '治疗记录', id: 'TX-20260510-018', name: '第2班透析', source: 'dialysis_session', status: '已归档' },
  { type: '检验结果', id: 'LAB-202605-091', name: '血钾/血磷/PTH', source: 'lab_result', status: '已复核' },
  { type: '设备水质', id: 'WQ-20260510-ROA', name: 'RO-A 水质记录', source: 'water_quality_record', status: '已复测' },
  { type: '预警处理', id: 'AL-004', name: '透中低血压预警', source: 'alert_handle_record', status: '待复查' },
]);

const activeTables = ['report_metric_def', 'report_snapshot', 'report_metric_value', 'report_drill_link'];

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (['正常', '已发布', '已归档', '已复核', '已复测'].includes(value)) return 'success';
  if (['异常'].includes(value)) return 'danger';
  if (value.includes('关注') || value.includes('草稿') || value.includes('复核') || value.includes('待')) return 'warning';
  return 'info';
}

function selectMetric(row: ReportMetric): void {
  selectedMetricCode.value = row.code;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}

function generateSnapshot(): void {
  snapshotDialogVisible.value = false;
  submitAction('报表快照已生成，指标值与下钻链接已固化');
}

function exportReport(): void {
  exportDialogVisible.value = false;
  submitAction('导出任务已提交，完成后进入消息中心');
}

function createImprovement(): void {
  cqiDialogVisible.value = false;
  submitAction('异常指标已生成改进任务，并推送到责任工作站');
}
</script>

<template>
  <section class="report-analytics-page">
    <el-card class="report-work-card" shadow="never">
      <template #header>
        <div class="report-header">
          <div>
            <h2>统计报表</h2>
            <p>汇总患者、治疗、机位、检验、质控、感控、预警、费用和院区对比指标，并支持下钻追溯到原始业务记录。</p>
          </div>
          <div class="report-actions">
            <el-button type="primary" :icon="Refresh" @click="snapshotDialogVisible = true">生成快照</el-button>
            <el-button :icon="Download" @click="exportDialogVisible = true">导出报表</el-button>
            <el-button :icon="Warning" @click="cqiDialogVisible = true">异常改进</el-button>
            <el-button :icon="Histogram" @click="drillDrawerVisible = true">下钻分析</el-button>
          </div>
        </div>
      </template>

      <el-form class="report-filter" inline>
        <el-form-item label="周期">
          <el-date-picker type="month" placeholder="选择月份" />
        </el-form-item>
        <el-form-item label="报表类型">
          <el-select placeholder="全部类型" clearable>
            <el-option label="运营日报" value="daily" />
            <el-option label="月度质控" value="quality" />
            <el-option label="感控统计" value="infection" />
            <el-option label="院区对比" value="campus" />
          </el-select>
        </el-form-item>
        <el-form-item label="指标状态">
          <el-select placeholder="全部状态" clearable>
            <el-option label="正常" value="normal" />
            <el-option label="关注" value="watch" />
            <el-option label="异常" value="abnormal" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键字">
          <el-input placeholder="指标、来源表、责任工作站" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>

      <div class="report-stat-grid">
        <el-card v-for="item in summaryCards" :key="item.label" :class="['report-stat-card', item.tone]" shadow="never">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </el-card>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :xl="16">
          <el-card class="report-main-card" shadow="never">
            <template #header>
              <div class="report-card-header">
                <div>
                  <strong>指标结果与下钻</strong>
                  <p>示例数据不少于 10 条，所有报表指标必须能回溯到患者、治疗、检验、设备、费用、预警或感控记录。</p>
                </div>
                <el-tag type="primary" effect="plain">采集 -> 计算 -> 快照 -> 发布 -> 下钻改进</el-tag>
              </div>
            </template>
            <el-table :data="metrics" border stripe highlight-current-row row-key="code" @row-click="selectMetric">
              <el-table-column prop="category" label="分类" min-width="120" fixed="left" />
              <el-table-column prop="name" label="指标名称" min-width="150" />
              <el-table-column prop="dimension" label="维度" min-width="135" />
              <el-table-column prop="value" label="指标值" width="105" />
              <el-table-column prop="target" label="目标" min-width="115" />
              <el-table-column prop="trend" label="趋势" width="90" />
              <el-table-column prop="status" label="状态" width="90">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.status)">{{ row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="source" label="来源表" min-width="210" />
              <el-table-column prop="owner" label="责任工作站" min-width="140" />
              <el-table-column prop="drillCount" label="下钻数" width="90" />
              <el-table-column prop="nextAction" label="下一步" min-width="130" />
              <el-table-column label="操作" width="210" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click.stop="selectMetric(row); drillDrawerVisible = true">下钻</el-button>
                  <el-button link @click.stop="selectMetric(row); snapshotDialogVisible = true">快照</el-button>
                  <el-button link @click.stop="selectMetric(row); cqiDialogVisible = true">改进</el-button>
                  <el-button link @click.stop="selectMetric(row); exportDialogVisible = true">导出</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>

        <el-col :xs="24" :xl="8">
          <el-card class="report-side-card" shadow="never">
            <template #header>
              <div class="report-card-header">
                <strong>当前指标闭环</strong>
                <el-tag :type="tagType(selectedMetric.status)">{{ selectedMetric.status }}</el-tag>
              </div>
            </template>
            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="指标">{{ selectedMetric.name }}</el-descriptions-item>
              <el-descriptions-item label="维度">{{ selectedMetric.dimension }}</el-descriptions-item>
              <el-descriptions-item label="值/目标">{{ selectedMetric.value }} / {{ selectedMetric.target }}</el-descriptions-item>
              <el-descriptions-item label="责任">{{ selectedMetric.owner }}</el-descriptions-item>
            </el-descriptions>
            <div class="report-check-list">
              <div v-for="item in closureChecks" :key="item.label" class="report-check-row">
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
                <el-icon :class="{ pass: item.pass, block: !item.pass }">
                  <CircleCheck v-if="item.pass" />
                  <Warning v-else />
                </el-icon>
              </div>
            </div>
            <div class="report-quick-actions">
              <el-button type="primary" @click="drillDrawerVisible = true">查看来源</el-button>
              <el-button @click="cqiDialogVisible = true">生成改进</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="report-workspace-card" shadow="never">
      <template #header>
        <div class="report-card-header">
          <div>
            <strong>报表快照与分类概览</strong>
            <p>快照用于锁定统计口径和周期结果，发布后应可复核、导出，并保留指标来源。</p>
          </div>
          <el-button type="primary" :icon="DataAnalysis" @click="snapshotDialogVisible = true">生成报表快照</el-button>
        </div>
      </template>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="快照列表" name="patient">
          <el-table :data="snapshots" border stripe>
            <el-table-column prop="id" label="快照编号" min-width="150" />
            <el-table-column prop="reportType" label="报表类型" width="130" />
            <el-table-column prop="period" label="周期" width="110" />
            <el-table-column prop="generatedAt" label="生成时间" min-width="150" />
            <el-table-column prop="metrics" label="指标数" width="90" />
            <el-table-column prop="exceptionCount" label="异常数" width="90" />
            <el-table-column prop="publisher" label="发布人" width="120" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="tagType(row.status)">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="分类概览" name="quality">
          <div class="report-category-grid">
            <el-card v-for="row in categoryRows" :key="row.name" class="report-category-card" shadow="never">
              <strong>{{ row.name }}</strong>
              <p>指标 {{ row.total }} 项，异常 {{ row.abnormal }} 项，可下钻 {{ row.drill }} 条。</p>
              <el-progress :percentage="Math.max(0, Math.round(((row.total - row.abnormal) / row.total) * 100))" />
            </el-card>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog v-model="snapshotDialogVisible" title="生成报表快照" width="640px">
      <el-form label-width="110px">
        <el-form-item label="报表类型">
          <el-select model-value="quality">
            <el-option label="运营日报" value="daily" />
            <el-option label="月度质控报表" value="quality" />
            <el-option label="感控统计报表" value="infection" />
            <el-option label="院区对比分析" value="campus" />
          </el-select>
        </el-form-item>
        <el-form-item label="统计周期">
          <el-date-picker type="month" placeholder="选择月份" />
        </el-form-item>
        <el-form-item label="锁定口径">
          <el-switch active-text="生成后保留快照版本" inactive-text="仅临时计算" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="snapshotDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="generateSnapshot">生成快照</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="exportDialogVisible" title="导出报表" width="620px">
      <el-form label-width="110px">
        <el-form-item label="导出范围">
          <el-checkbox-group model-value="summary">
            <el-checkbox-button label="summary">汇总表</el-checkbox-button>
            <el-checkbox-button label="detail">明细表</el-checkbox-button>
            <el-checkbox-button label="drill">下钻链接</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="格式">
          <el-radio-group model-value="xlsx">
            <el-radio-button label="xlsx">Excel</el-radio-button>
            <el-radio-button label="pdf">PDF</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="exportDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="exportReport">提交导出</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="cqiDialogVisible" title="异常指标改进任务" width="660px">
      <el-alert type="warning" show-icon :closable="false" title="异常指标应分配责任工作站，必要时进入 CQI、感控整改或费用跟进流程。" />
      <el-form class="dialog-form" label-width="110px">
        <el-form-item label="指标">
          <el-input :model-value="selectedMetric.name" />
        </el-form-item>
        <el-form-item label="责任工作站">
          <el-input :model-value="selectedMetric.owner" />
        </el-form-item>
        <el-form-item label="改进措施">
          <el-input type="textarea" :rows="3" placeholder="记录下钻发现、责任人、完成时限和复查指标" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cqiDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="createImprovement">生成任务</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="drillDrawerVisible" title="指标来源下钻" size="620px">
      <el-descriptions :column="1" border size="small">
        <el-descriptions-item label="指标">{{ selectedMetric.name }}</el-descriptions-item>
        <el-descriptions-item label="来源表">{{ selectedMetric.source }}</el-descriptions-item>
        <el-descriptions-item label="下钻记录">{{ selectedMetric.drillCount }} 条</el-descriptions-item>
      </el-descriptions>
      <el-table class="drawer-table" :data="drillRows" border stripe>
        <el-table-column prop="type" label="类型" width="95" />
        <el-table-column prop="id" label="记录号" min-width="140" />
        <el-table-column prop="name" label="摘要" min-width="150" />
        <el-table-column prop="source" label="来源表" min-width="150" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="tagType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
  </section>
</template>
