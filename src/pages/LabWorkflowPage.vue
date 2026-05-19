<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  CircleCheck,
  DocumentAdd,
  Files,
  Histogram,
  Search,
  Upload,
  Warning,
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{
  context: PageContext;
}>();

type LabOrderRow = {
  id: string;
  patient: string;
  dialysisNo: string;
  orderItem: string;
  specimen: string;
  requestedAt: string;
  collectStatus: string;
  receiveStatus: string;
  reportNo: string;
  reportStatus: string;
  abnormal: string;
  critical: string;
  reviewStatus: string;
  archiveStatus: string;
  nextAction: string;
};

type ResultItem = {
  item: string;
  value: string;
  unit: string;
  reference: string;
  abnormal: string;
  critical: string;
  target: string;
};

const sectionByMenu: Record<string, string> = {
  'lab-log': 'orders',
  'lab-order': 'orders',
  'lab-specimen': 'specimen',
  'lab-execute': 'review',
  'lab-input': 'input',
  'lab-result': 'result',
  'lab-quality': 'quality',
};

const activeTab = ref(sectionByMenu[props.context.menuKey] ?? 'orders');
const selectedOrderId = ref('LAB-001');
const specimenDialogVisible = ref(false);
const inputDialogVisible = ref(false);
const uploadDialogVisible = ref(false);
const reviewDialogVisible = ref(false);
const criticalDialogVisible = ref(false);
const trendDrawerVisible = ref(false);

watch(
  () => props.context.menuKey,
  (menuKey) => {
    activeTab.value = sectionByMenu[menuKey] ?? 'orders';
  },
);

const labOrders = ref<LabOrderRow[]>([
  { id: 'LAB-001', patient: '王建国', dialysisNo: 'HD-00038', orderItem: '血常规+肾功电解质', specimen: '静脉血', requestedAt: '2026-05-10 07:20', collectStatus: '已采集', receiveStatus: '已接收', reportNo: 'R20260510001', reportStatus: '已出报告', abnormal: '无', critical: '无', reviewStatus: '已复核', archiveStatus: '已归档', nextAction: '医生查看' },
  { id: 'LAB-002', patient: '李秀兰', dialysisNo: 'HD-00072', orderItem: '白蛋白+CRP', specimen: '静脉血', requestedAt: '2026-05-10 07:35', collectStatus: '已采集', receiveStatus: '已接收', reportNo: 'R20260510002', reportStatus: '待复核', abnormal: '白蛋白低', critical: '无', reviewStatus: '待复核', archiveStatus: '未归档', nextAction: '复核报告' },
  { id: 'LAB-003', patient: '赵明', dialysisNo: 'HD-00116', orderItem: '血钾复查', specimen: '静脉血', requestedAt: '2026-05-10 08:05', collectStatus: '已采集', receiveStatus: '已接收', reportNo: 'R20260510003', reportStatus: '已出结果', abnormal: '血钾高', critical: '危急值', reviewStatus: '待通知', archiveStatus: '未归档', nextAction: '危急值通知' },
  { id: 'LAB-004', patient: '陈志强', dialysisNo: 'HD-00128', orderItem: '凝血功能', specimen: '枸橼酸血', requestedAt: '2026-05-10 08:20', collectStatus: '已采集', receiveStatus: '待接收', reportNo: '-', reportStatus: '待检验', abnormal: '未判定', critical: '无', reviewStatus: '未复核', archiveStatus: '未归档', nextAction: '接收标本' },
  { id: 'LAB-005', patient: '刘梅英', dialysisNo: 'HD-00151', orderItem: '乙肝/丙肝/HIV', specimen: '血清', requestedAt: '2026-05-10 08:40', collectStatus: '待采集', receiveStatus: '未接收', reportNo: '-', reportStatus: '未开始', abnormal: '未判定', critical: '无', reviewStatus: '未复核', archiveStatus: '未归档', nextAction: '采集标本' },
  { id: 'LAB-006', patient: '孙海', dialysisNo: 'HD-00177', orderItem: 'Kt/V评估', specimen: '透前透后血', requestedAt: '2026-05-11 07:20', collectStatus: '已采集', receiveStatus: '已接收', reportNo: 'R20260511001', reportStatus: '待录入', abnormal: '未达标', critical: '无', reviewStatus: '未复核', archiveStatus: '未归档', nextAction: '录入结果' },
  { id: 'LAB-007', patient: '马丽', dialysisNo: 'HD-00203', orderItem: '感染四项', specimen: '血清', requestedAt: '2026-05-11 07:30', collectStatus: '已采集', receiveStatus: '已接收', reportNo: 'R20260511002', reportStatus: 'LIS已同步', abnormal: '乙肝阳性', critical: '无', reviewStatus: '待复核', archiveStatus: '未归档', nextAction: '复核并归档' },
  { id: 'LAB-008', patient: '周庆', dialysisNo: 'HD-00218', orderItem: 'BNP+电解质', specimen: '静脉血', requestedAt: '2026-05-11 13:10', collectStatus: '已采集', receiveStatus: '已接收', reportNo: 'R20260511003', reportStatus: '已出结果', abnormal: 'BNP高', critical: '无', reviewStatus: '待复核', archiveStatus: '未归档', nextAction: '复核报告' },
  { id: 'LAB-009', patient: '何雪', dialysisNo: 'HD-00246', orderItem: '钙磷PTH', specimen: '静脉血', requestedAt: '2026-05-11 13:20', collectStatus: '已采集', receiveStatus: '已接收', reportNo: 'R20260511004', reportStatus: '已出报告', abnormal: '磷高/PTH高', critical: '无', reviewStatus: '已复核', archiveStatus: '已归档', nextAction: '医生评估' },
  { id: 'LAB-010', patient: '郭强', dialysisNo: 'HD-00277', orderItem: '尿素清除率', specimen: '透前透后血', requestedAt: '2026-05-11 18:10', collectStatus: '已采集', receiveStatus: '已接收', reportNo: 'R20260511005', reportStatus: '待复核', abnormal: 'Kt/V低', critical: '无', reviewStatus: '待复核', archiveStatus: '未归档', nextAction: '达标判定' },
  { id: 'LAB-011', patient: '曹敏', dialysisNo: 'HD-00291', orderItem: 'PTH+ALP', specimen: '静脉血', requestedAt: '2026-05-12 07:40', collectStatus: '已采集', receiveStatus: '已接收', reportNo: 'R20260512001', reportStatus: 'LIS已同步', abnormal: 'PTH高', critical: '无', reviewStatus: '待复核', archiveStatus: '未归档', nextAction: '复核报告' },
  { id: 'LAB-012', patient: '潘德胜', dialysisNo: 'HD-00305', orderItem: '血常规', specimen: '静脉血', requestedAt: '2026-05-12 13:30', collectStatus: '待采集', receiveStatus: '未接收', reportNo: '-', reportStatus: '未开始', abnormal: '未判定', critical: '无', reviewStatus: '未复核', archiveStatus: '未归档', nextAction: '采集标本' },
]);

const resultItems: ResultItem[] = [
  { item: '血钾 K+', value: '6.2', unit: 'mmol/L', reference: '3.5-5.5', abnormal: '高', critical: '是', target: '未达标' },
  { item: '血红蛋白 Hb', value: '92', unit: 'g/L', reference: '100-120', abnormal: '低', critical: '否', target: '未达标' },
  { item: '白蛋白 Alb', value: '34', unit: 'g/L', reference: '35-50', abnormal: '低', critical: '否', target: '未达标' },
  { item: '血磷 P', value: '1.82', unit: 'mmol/L', reference: '0.81-1.45', abnormal: '高', critical: '否', target: '未达标' },
  { item: 'Kt/V', value: '1.18', unit: '', reference: '>=1.20', abnormal: '低', critical: '否', target: '未达标' },
];

const selectedOrder = computed(() => labOrders.value.find((item) => item.id === selectedOrderId.value) ?? labOrders.value[0]);

const metrics = computed(() => [
  { label: '检验医嘱', value: labOrders.value.length, tone: 'blue' },
  { label: '待采集', value: labOrders.value.filter((item) => item.collectStatus.includes('待')).length, tone: 'orange' },
  { label: '待复核', value: labOrders.value.filter((item) => item.reviewStatus.includes('待')).length, tone: 'orange' },
  { label: '危急值', value: labOrders.value.filter((item) => item.critical === '危急值').length, tone: 'red' },
  { label: '已归档', value: labOrders.value.filter((item) => item.archiveStatus === '已归档').length, tone: 'green' },
]);

const closureChecks = computed(() => [
  { label: '标本采集', value: selectedOrder.value.collectStatus, pass: selectedOrder.value.collectStatus === '已采集' },
  { label: '标本接收', value: selectedOrder.value.receiveStatus, pass: selectedOrder.value.receiveStatus === '已接收' },
  { label: '结果状态', value: selectedOrder.value.reportStatus, pass: !['未开始', '待检验', '待录入'].includes(selectedOrder.value.reportStatus) },
  { label: '结果复核', value: selectedOrder.value.reviewStatus, pass: selectedOrder.value.reviewStatus === '已复核' },
  { label: '报告归档', value: selectedOrder.value.archiveStatus, pass: selectedOrder.value.archiveStatus === '已归档' },
]);

const activeTables = ['lab_order', 'specimen_record', 'lab_report', 'lab_result_item', 'critical_value_record', 'lab_report_attachment'];

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (['已采集', '已接收', '已出报告', 'LIS已同步', '已复核', '已归档', '无', '完整', '达标'].includes(value)) return 'success';
  if (['危急值', '高', '低'].includes(value) || value.includes('待通知')) return 'danger';
  if (value.includes('待') || value.includes('未') || value.includes('异常') || value.includes('高') || value.includes('低')) return 'warning';
  return 'info';
}

function selectOrder(row: LabOrderRow): void {
  selectedOrderId.value = row.id;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}

function collectSpecimen(): void {
  selectedOrder.value.collectStatus = '已采集';
  selectedOrder.value.receiveStatus = '已接收';
  specimenDialogVisible.value = false;
  submitAction('标本已采集并接收');
}

function saveResult(): void {
  selectedOrder.value.reportStatus = '已出结果';
  inputDialogVisible.value = false;
  submitAction('检验结果已录入，等待复核');
}

function reviewReport(): void {
  selectedOrder.value.reviewStatus = '已复核';
  selectedOrder.value.reportStatus = '已出报告';
  selectedOrder.value.archiveStatus = '已归档';
  reviewDialogVisible.value = false;
  submitAction('报告已复核归档，医生站和报表可引用');
}

function closeCritical(): void {
  selectedOrder.value.reviewStatus = '已复核';
  selectedOrder.value.archiveStatus = '已归档';
  criticalDialogVisible.value = false;
  submitAction('危急值已通知医生并关闭通知记录');
}
</script>

<template>
  <section class="lab-workflow-page">
    <el-card class="lab-work-card" shadow="never">
      <template #header>
        <div class="lab-header">
          <div>
            <h2>检验科工作站</h2>
            <p>承接检验医嘱和标本，完成结果录入/LIS同步、异常标记、危急值通知、复核发布、趋势与达标判定。</p>
          </div>
          <div class="lab-actions">
            <el-button type="primary" :icon="CircleCheck" @click="specimenDialogVisible = true">标本接收</el-button>
            <el-button :icon="DocumentAdd" @click="inputDialogVisible = true">录入结果</el-button>
            <el-button :icon="Upload" @click="uploadDialogVisible = true">上传报告</el-button>
            <el-button :icon="DocumentAdd" @click="reviewDialogVisible = true">结果复核</el-button>
            <el-button :icon="Warning" @click="criticalDialogVisible = true">危急值处理</el-button>
          </div>
        </div>
      </template>

      <el-form class="lab-filter" inline>
        <el-form-item label="关键字">
          <el-input placeholder="患者、透析号、报告号、检验项目" clearable />
        </el-form-item>
        <el-form-item label="标本状态">
          <el-select placeholder="全部状态" clearable>
            <el-option label="待采集" value="collect" />
            <el-option label="已采集" value="collected" />
            <el-option label="已接收" value="received" />
          </el-select>
        </el-form-item>
        <el-form-item label="报告状态">
          <el-select placeholder="全部报告" clearable>
            <el-option label="待录入" value="input" />
            <el-option label="待复核" value="review" />
            <el-option label="已归档" value="archived" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker type="date" placeholder="申请日期" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>

      <div class="lab-stat-grid">
        <el-card v-for="item in metrics" :key="item.label" :class="['lab-stat-card', item.tone]" shadow="never">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </el-card>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :xl="16">
          <el-card class="lab-main-card" shadow="never">
            <template #header>
              <div class="lab-card-header">
                <div>
                  <strong>检验医嘱与报告队列</strong>
                  <p>示例数据不少于 10 条，覆盖标本采集、接收、LIS同步、手工录入、复核、危急值和归档。</p>
                </div>
                <el-tag type="primary" effect="plain">结果归档后回流医生站与报表</el-tag>
              </div>
            </template>
            <el-table :data="labOrders" border stripe highlight-current-row row-key="id" @row-click="selectOrder">
              <el-table-column prop="patient" label="患者" width="95" fixed="left" />
              <el-table-column prop="dialysisNo" label="透析号" width="115" />
              <el-table-column prop="orderItem" label="检验项目" min-width="160" />
              <el-table-column prop="specimen" label="标本" width="105" />
              <el-table-column prop="requestedAt" label="申请时间" min-width="150" />
              <el-table-column prop="collectStatus" label="采集" width="95">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.collectStatus)">{{ row.collectStatus }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="receiveStatus" label="接收" width="95">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.receiveStatus)" effect="plain">{{ row.receiveStatus }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="reportNo" label="报告号" min-width="130" />
              <el-table-column prop="reportStatus" label="报告" width="105">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.reportStatus)">{{ row.reportStatus }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="abnormal" label="异常" min-width="120">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.abnormal)" effect="plain">{{ row.abnormal }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="critical" label="危急值" width="100">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.critical)">{{ row.critical }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="reviewStatus" label="复核" width="100" />
              <el-table-column prop="archiveStatus" label="归档" width="100" />
              <el-table-column prop="nextAction" label="下一步" min-width="130" />
              <el-table-column label="操作" width="250" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click.stop="selectOrder(row); specimenDialogVisible = true">标本</el-button>
                  <el-button link @click.stop="selectOrder(row); inputDialogVisible = true">录入</el-button>
                  <el-button link @click.stop="selectOrder(row); reviewDialogVisible = true">复核</el-button>
                  <el-button link @click.stop="selectOrder(row); trendDrawerVisible = true">趋势</el-button>
                  <el-button link @click.stop="selectOrder(row); criticalDialogVisible = true">危急值</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>

        <el-col :xs="24" :xl="8">
          <el-card class="lab-side-card" shadow="never">
            <template #header>
              <div class="lab-card-header">
                <strong>当前报告闭环检查</strong>
                <el-tag :type="tagType(selectedOrder.critical)">{{ selectedOrder.critical }}</el-tag>
              </div>
            </template>
            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="患者">{{ selectedOrder.patient }} / {{ selectedOrder.dialysisNo }}</el-descriptions-item>
              <el-descriptions-item label="项目">{{ selectedOrder.orderItem }}</el-descriptions-item>
              <el-descriptions-item label="报告号">{{ selectedOrder.reportNo }}</el-descriptions-item>
              <el-descriptions-item label="异常">{{ selectedOrder.abnormal }}</el-descriptions-item>
            </el-descriptions>
            <div class="lab-check-list">
              <div v-for="item in closureChecks" :key="item.label" class="lab-check-row">
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
                <el-icon :class="{ pass: item.pass, block: !item.pass }">
                  <CircleCheck v-if="item.pass" />
                  <Warning v-else />
                </el-icon>
              </div>
            </div>
            <div class="lab-quick-actions">
              <el-button type="primary" :disabled="closureChecks.some((item) => !item.pass)" @click="reviewReport">发布报告</el-button>
              <el-button @click="criticalDialogVisible = true">危急值通知</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="lab-workspace-card" shadow="never">
      <template #header>
        <div class="lab-card-header">
          <div>
            <strong>结果项与趋势判定</strong>
            <p>结果项需要标记异常、危急值和达标状态，归档后医生评估、疗效预警和统计报表引用同一口径。</p>
          </div>
          <el-button type="primary" :icon="Histogram" @click="trendDrawerVisible = true">查看趋势</el-button>
        </div>
      </template>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="结果项" name="result">
          <el-table :data="resultItems" border stripe>
            <el-table-column prop="item" label="项目" min-width="130" />
            <el-table-column prop="value" label="结果" width="90" />
            <el-table-column prop="unit" label="单位" width="90" />
            <el-table-column prop="reference" label="参考范围" width="120" />
            <el-table-column prop="abnormal" label="异常" width="90">
              <template #default="{ row }">
                <el-tag :type="tagType(row.abnormal)">{{ row.abnormal }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="critical" label="危急值" width="100">
              <template #default="{ row }">
                <el-tag :type="row.critical === '是' ? 'danger' : 'success'">{{ row.critical }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="target" label="达标判定" width="110">
              <template #default="{ row }">
                <el-tag :type="tagType(row.target)" effect="plain">{{ row.target }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="质控与附件" name="quality">
          <div class="lab-quality-grid">
            <el-card shadow="never" class="lab-quality-card">
              <strong>原始报告附件</strong>
              <p>支持上传扫描件或接收 LIS 原始报告，归档后不可覆盖，只能追加版本。</p>
              <el-button :icon="Upload" @click="uploadDialogVisible = true">上传附件</el-button>
            </el-card>
            <el-card shadow="never" class="lab-quality-card">
              <strong>危急值通知</strong>
              <p>危急值需要通知时间、接收医生、处理意见和关闭状态，进入预警闭环。</p>
              <el-button :icon="Warning" @click="criticalDialogVisible = true">处理危急值</el-button>
            </el-card>
            <el-card shadow="never" class="lab-quality-card">
              <strong>达标判定</strong>
              <p>Kt/V、血红蛋白、白蛋白、钙磷、PTH 等指标进入疗效分析和 CQI。</p>
              <el-button :icon="Histogram" @click="trendDrawerVisible = true">查看趋势</el-button>
            </el-card>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog v-model="specimenDialogVisible" title="标本采集与接收" width="640px">
      <el-form label-width="110px">
        <el-form-item label="患者">
          <el-input :model-value="`${selectedOrder.patient} / ${selectedOrder.orderItem}`" />
        </el-form-item>
        <el-form-item label="标本类型">
          <el-input :model-value="selectedOrder.specimen" />
        </el-form-item>
        <el-form-item label="采集时间">
          <el-date-picker type="datetime" placeholder="选择采集时间" />
        </el-form-item>
        <el-form-item label="标本状态">
          <el-radio-group model-value="received">
            <el-radio-button label="collected">已采集</el-radio-button>
            <el-radio-button label="received">已接收</el-radio-button>
            <el-radio-button label="reject">拒收</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="specimenDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="collectSpecimen">保存标本</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="inputDialogVisible" title="录入检验结果" width="680px">
      <el-form label-width="110px">
        <el-form-item label="报告号">
          <el-input :model-value="selectedOrder.reportNo === '-' ? '自动生成' : selectedOrder.reportNo" />
        </el-form-item>
        <el-form-item label="结果来源">
          <el-radio-group model-value="manual">
            <el-radio-button label="manual">手工录入</el-radio-button>
            <el-radio-button label="lis">LIS同步</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="结果内容">
          <el-input type="textarea" :rows="4" placeholder="录入项目、结果、单位、参考范围、异常和危急值标记" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="inputDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveResult">保存结果</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="reviewDialogVisible" title="结果复核与发布" width="640px">
      <el-alert type="warning" show-icon :closable="false" title="复核发布后医生站、预警和报表将引用该结果；危急值必须先完成通知。" />
      <el-form class="dialog-form" label-width="110px">
        <el-form-item label="复核结果">
          <el-radio-group model-value="pass">
            <el-radio-button label="pass">通过</el-radio-button>
            <el-radio-button label="return">退回修改</el-radio-button>
            <el-radio-button label="hold">暂缓</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="复核意见">
          <el-input type="textarea" :rows="3" placeholder="记录复核意见、异常确认和危急值通知情况" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reviewDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="reviewReport">复核发布</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="criticalDialogVisible" title="危急值通知" width="640px">
      <el-form label-width="110px">
        <el-form-item label="危急项目">
          <el-input :model-value="selectedOrder.abnormal" />
        </el-form-item>
        <el-form-item label="通知医生">
          <el-input placeholder="接收医生" />
        </el-form-item>
        <el-form-item label="通知时间">
          <el-date-picker type="datetime" placeholder="选择通知时间" />
        </el-form-item>
        <el-form-item label="处理记录">
          <el-input type="textarea" :rows="3" placeholder="记录通知、复述确认、医生处理意见和关闭状态" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="criticalDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="closeCritical">完成通知</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="uploadDialogVisible" title="上传原始报告" width="560px">
      <el-upload drag action="#">
        <el-icon><Upload /></el-icon>
        <div class="el-upload__text">拖拽报告文件或点击上传</div>
      </el-upload>
      <template #footer>
        <el-button @click="uploadDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="uploadDialogVisible = false; submitAction('原始报告附件已上传')">保存附件</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="trendDrawerVisible" title="检验趋势与达标判定" size="620px">
      <div class="lab-trend-bars">
        <div v-for="(item, index) in ['Hb', 'Alb', 'K+', 'P', 'PTH', 'Kt/V']" :key="item">
          <span :style="{ height: `${34 + index * 8}px` }"></span>
          <strong>{{ item }}</strong>
        </div>
      </div>
      <el-alert type="warning" show-icon :closable="false" title="未达标指标将进入疗效预警和 CQI 任务，医生站可直接引用趋势。" />
    </el-drawer>
  </section>
</template>
