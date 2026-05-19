<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, DocumentAdd, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{
  context: PageContext;
}>();

type OrderRow = {
  id: string;
  patient: string;
  dialysisNo: string;
  sourceDept: string;
  receiver: string;
  orderItem: string;
  specimen: string;
  requestedAt: string;
  acceptedAt: string;
  collectStatus: string;
  sendStatus: string;
  reviewStatus: string;
  reportStatus: string;
  abnormal: string;
  critical: string;
  nextAction: string;
};

const selectedId = ref('LABO-001');
const orderDialogVisible = ref(false);
const reviewDialogVisible = ref(false);
const traceDrawerVisible = ref(false);

const rows: OrderRow[] = [
  { id: 'LABO-001', patient: '王建国', dialysisNo: 'HD-00038', sourceDept: '医生站', receiver: '李技师', orderItem: '血常规+肾功', specimen: '静脉血', requestedAt: '2026-05-10 07:20', acceptedAt: '2026-05-10 07:25', collectStatus: '已采集', sendStatus: '已送检', reviewStatus: '待复核', reportStatus: '待回报', abnormal: '否', critical: '否', nextAction: '等待结果' },
  { id: 'LABO-002', patient: '李秀英', dialysisNo: 'HD-00072', sourceDept: '护士站', receiver: '王技师', orderItem: '白蛋白+CRP', specimen: '静脉血', requestedAt: '2026-05-10 07:35', acceptedAt: '2026-05-10 07:40', collectStatus: '已采集', sendStatus: '已送检', reviewStatus: '待复核', reportStatus: '已生成', abnormal: '白蛋白低', critical: '否', nextAction: '复核报告' },
  { id: 'LABO-003', patient: '赵明', dialysisNo: 'HD-00116', sourceDept: '医生站', receiver: '张技师', orderItem: '血钾复查', specimen: '静脉血', requestedAt: '2026-05-10 08:05', acceptedAt: '2026-05-10 08:08', collectStatus: '已采集', sendStatus: '已送检', reviewStatus: '待通知', reportStatus: '已生成', abnormal: '血钾高', critical: '危急', nextAction: '危急通知' },
  { id: 'LABO-004', patient: '陈志强', dialysisNo: 'HD-00128', sourceDept: '医生站', receiver: '待接收', orderItem: '凝血功能', specimen: '枸橼酸血', requestedAt: '2026-05-10 08:20', acceptedAt: '-', collectStatus: '待采集', sendStatus: '待送检', reviewStatus: '未复核', reportStatus: '待生成', abnormal: '未判定', critical: '否', nextAction: '接收医嘱' },
  { id: 'LABO-005', patient: '周庆', dialysisNo: 'HD-00218', sourceDept: '护士站', receiver: '待接收', orderItem: '乙肝四项', specimen: '血清', requestedAt: '2026-05-10 08:40', acceptedAt: '-', collectStatus: '待采集', sendStatus: '待送检', reviewStatus: '未复核', reportStatus: '待生成', abnormal: '未判定', critical: '否', nextAction: '采集标本' },
  { id: 'LABO-006', patient: '何雪', dialysisNo: 'HD-00246', sourceDept: '治疗记录', receiver: '李技师', orderItem: 'Kt/V评估', specimen: '透前透后血', requestedAt: '2026-05-11 07:20', acceptedAt: '2026-05-11 07:30', collectStatus: '已采集', sendStatus: '已送检', reviewStatus: '待复核', reportStatus: '待录入', abnormal: '未达标', critical: '否', nextAction: '录入结果' },
  { id: 'LABO-007', patient: '孙海', dialysisNo: 'HD-00277', sourceDept: '医生站', receiver: '王技师', orderItem: '感染四项', specimen: '血清', requestedAt: '2026-05-11 07:30', acceptedAt: '2026-05-11 07:36', collectStatus: '已采集', sendStatus: '已送检', reviewStatus: '待复核', reportStatus: 'LIS同步', abnormal: '乙肝阳性', critical: '否', nextAction: '复核并归档' },
  { id: 'LABO-008', patient: '马丽', dialysisNo: 'HD-00305', sourceDept: '医生站', receiver: '张技师', orderItem: 'BNP+电解质', specimen: '静脉血', requestedAt: '2026-05-11 13:10', acceptedAt: '2026-05-11 13:15', collectStatus: '已采集', sendStatus: '已送检', reviewStatus: '待复核', reportStatus: '已生成', abnormal: 'BNP高', critical: '否', nextAction: '复核报告' },
  { id: 'LABO-009', patient: '郭强', dialysisNo: 'HD-00322', sourceDept: '医生站', receiver: '刘技师', orderItem: '钙磷PTH', specimen: '静脉血', requestedAt: '2026-05-11 13:20', acceptedAt: '2026-05-11 13:24', collectStatus: '已采集', sendStatus: '已送检', reviewStatus: '已复核', reportStatus: '已归档', abnormal: 'PTH高', critical: '否', nextAction: '医生评估' },
  { id: 'LABO-010', patient: '陈敏', dialysisNo: 'HD-00341', sourceDept: '治疗记录', receiver: '待接收', orderItem: '尿素清除率', specimen: '透前透后血', requestedAt: '2026-05-11 18:10', acceptedAt: '-', collectStatus: '待采集', sendStatus: '待送检', reviewStatus: '未复核', reportStatus: '待回报', abnormal: '未判定', critical: '否', nextAction: '接收医嘱' },
];

const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['lab_order', 'specimen_record', 'lab_report', 'critical_value_notice'];

const metrics = computed(() => [
  { label: '医嘱总数', value: rows.length, tone: 'blue' },
  { label: '待接收', value: rows.filter((item) => item.receiver === '待接收').length, tone: 'orange' },
  { label: '待采集', value: rows.filter((item) => item.collectStatus === '待采集').length, tone: 'orange' },
  { label: '待回报', value: rows.filter((item) => item.reportStatus === '待回报').length, tone: 'orange' },
  { label: '待复核', value: rows.filter((item) => item.reviewStatus === '待复核').length, tone: 'orange' },
  { label: '危急值', value: rows.filter((item) => item.critical === '危急').length, tone: 'red' },
  { label: '已归档', value: rows.filter((item) => item.reportStatus === '已归档').length, tone: 'green' },
]);

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value === '已采集' || value === '已送检' || value === '已复核' || value === '已归档' || value === 'LIS同步') return 'success';
  if (value === '待接收' || value === '待采集' || value === '待送检' || value === '待回报' || value === '待复核' || value === '待通知' || value === '待生成' || value === '待录入') return 'warning';
  if (value === '危急') return 'danger';
  return 'info';
}

function selectRow(row: OrderRow): void {
  selectedId.value = row.id;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}

function openOrder(row?: OrderRow): void {
  selectedId.value = row?.id ?? rows[0].id;
  orderDialogVisible.value = true;
}

function openReview(row: OrderRow): void {
  selectedId.value = row.id;
  reviewDialogVisible.value = true;
}
</script>

<template>
  <section class="lab-workflow-page">
    <el-card class="lab-work-card" shadow="never">
      <template #header>
        <div class="lab-header">
          <div>
            <h2>{{ context.menuTitle }}</h2>
            <p>管理检验医嘱、采集状态和结果复核，让护士站和检验科共享同一套医嘱队列。</p>
          </div>
          <div class="lab-actions">
            <el-button type="primary" :icon="DocumentAdd" @click="openOrder()">新增医嘱</el-button>
            <el-button :icon="CircleCheck" @click="openReview(rows[0])">结果复核</el-button>
            <el-button :icon="Warning" @click="traceDrawerVisible = true">危急追溯</el-button>
          </div>
        </div>
      </template>

      <el-form class="lab-filter" inline>
        <el-form-item label="关键字">
          <el-input placeholder="患者、项目、报告号、标本" clearable />
        </el-form-item>
        <el-form-item label="采集状态">
          <el-select placeholder="全部状态" clearable>
            <el-option label="待采集" value="待采集" />
            <el-option label="已采集" value="已采集" />
          </el-select>
        </el-form-item>
        <el-form-item label="报告状态">
          <el-select placeholder="全部状态" clearable>
            <el-option label="待回报" value="待回报" />
            <el-option label="待生成" value="待生成" />
            <el-option label="待复核" value="待复核" />
            <el-option label="已归档" value="已归档" />
          </el-select>
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

      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow">
        <el-table-column prop="patient" label="患者" width="100" fixed="left" />
        <el-table-column prop="dialysisNo" label="透析号" width="110" />
        <el-table-column prop="sourceDept" label="来源" width="95" />
        <el-table-column prop="receiver" label="接收人" width="95">
          <template #default="{ row }"><el-tag :type="tagType(row.receiver)" effect="plain">{{ row.receiver }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="orderItem" label="检验项目" min-width="150" />
        <el-table-column prop="specimen" label="标本" width="100" />
        <el-table-column prop="requestedAt" label="申请时间" width="150" />
        <el-table-column prop="acceptedAt" label="接收时间" width="150" />
        <el-table-column prop="collectStatus" label="采集" width="90">
          <template #default="{ row }"><el-tag :type="tagType(row.collectStatus)">{{ row.collectStatus }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="sendStatus" label="送检" width="90">
          <template #default="{ row }"><el-tag :type="tagType(row.sendStatus)" effect="plain">{{ row.sendStatus }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="reviewStatus" label="复核" width="90">
          <template #default="{ row }"><el-tag :type="tagType(row.reviewStatus)" effect="plain">{{ row.reviewStatus }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="reportStatus" label="报告" width="90">
          <template #default="{ row }"><el-tag :type="tagType(row.reportStatus)">{{ row.reportStatus }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="abnormal" label="异常" width="100" />
        <el-table-column prop="critical" label="危急值" width="90">
          <template #default="{ row }"><el-tag :type="tagType(row.critical)">{{ row.critical }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="nextAction" label="下一步" min-width="120" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click.stop="openOrder(row)">编辑</el-button>
            <el-button link @click.stop="openReview(row)">复核</el-button>
            <el-button link type="danger" @click.stop="traceDrawerVisible = true">追溯</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="orderDialogVisible" title="检验医嘱" width="640px">
      <el-form label-width="100px">
        <el-form-item label="患者"><el-input :model-value="currentRow.patient" disabled /></el-form-item>
        <el-form-item label="检验项目"><el-input :model-value="currentRow.orderItem" /></el-form-item>
        <el-form-item label="标本类型"><el-input :model-value="currentRow.specimen" /></el-form-item>
        <el-form-item label="采集要求"><el-input type="textarea" :rows="3" placeholder="记录采集时间、前置条件和禁食要求" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="orderDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="orderDialogVisible = false; submitAction('检验医嘱已保存')">保存医嘱</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="reviewDialogVisible" title="结果复核" width="620px">
      <el-form label-width="100px">
        <el-form-item label="报告号"><el-input :model-value="currentRow.id" disabled /></el-form-item>
        <el-form-item label="复核结果">
          <el-radio-group model-value="pass">
            <el-radio-button label="pass">通过</el-radio-button>
            <el-radio-button label="return">退回修改</el-radio-button>
            <el-radio-button label="notify">危急通知</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="复核意见"><el-input type="textarea" :rows="3" placeholder="记录复核结论、通知情况和发布结果" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reviewDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="reviewDialogVisible = false; submitAction('检验结果已复核')">提交复核</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="危急值追溯" size="520px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-10 07:42" type="danger">危急值生成：{{ currentRow.abnormal }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 07:50">通知责任医生和护士站</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 08:10" type="success">复核后归档并回写预警</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
