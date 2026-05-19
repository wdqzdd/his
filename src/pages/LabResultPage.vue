<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, Histogram, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{
  context: PageContext;
}>();

type ResultRow = {
  id: string;
  patient: string;
  reportType: string;
  item: string;
  value: string;
  refRange: string;
  originalReport: string;
  attachment: string;
  trend: string;
  status: string;
  archiveStatus: string;
  reportTime: string;
  reviewer: string;
  nextAction: string;
};

const selectedId = ref('LRES-001');
const trendDrawerVisible = ref(false);
const eventDialogVisible = ref(false);
const adoptDialogVisible = ref(false);
const attachmentDrawerVisible = ref(false);
const printDialogVisible = ref(false);
const archiveDialogVisible = ref(false);

const rows: ResultRow[] = [
  { id: 'LRES-001', patient: '王建国', reportType: '生化', item: 'K+', value: '4.8 mmol/L', refRange: '3.5-5.5', originalReport: 'LIS原始报告 R20260510001', attachment: 'PDF+结构化结果', trend: '平稳', status: '达标', archiveStatus: '待归档', reportTime: '2026-05-10 07:42', reviewer: '刘技师', nextAction: '处方引用' },
  { id: 'LRES-002', patient: '李秀英', reportType: '营养', item: 'Alb', value: '34 g/L', refRange: '35-50', originalReport: '外院扫描报告', attachment: 'PDF附件', trend: '下降', status: '异常', archiveStatus: '待归档', reportTime: '2026-05-08 09:30', reviewer: '张技师', nextAction: '营养评估' },
  { id: 'LRES-003', patient: '赵明', reportType: '生化', item: 'K+', value: '5.9 mmol/L', refRange: '3.5-5.5', originalReport: 'LIS危急值报告', attachment: 'PDF+电话记录', trend: '上升', status: '危急关注', archiveStatus: '归档待危急关闭', reportTime: '2026-05-10 07:42', reviewer: '李技师', nextAction: '转临床事件' },
  { id: 'LRES-004', patient: '陈志强', reportType: '钙磷', item: 'P', value: '2.05 mmol/L', refRange: '0.81-1.45', originalReport: 'LIS原始报告 R20260508004', attachment: 'PDF附件', trend: '上升', status: '异常', archiveStatus: '待归档', reportTime: '2026-05-08 09:30', reviewer: '刘技师', nextAction: '用药调整' },
  { id: 'LRES-005', patient: '周庆', reportType: '血常规', item: 'Hb', value: '89 g/L', refRange: '100-120', originalReport: '血球分析仪原始结果', attachment: '图片附件', trend: '下降', status: '异常', archiveStatus: '已归档', reportTime: '2026-05-08 09:30', reviewer: '张技师', nextAction: '贫血评估' },
  { id: 'LRES-006', patient: '何雪', reportType: '充分性', item: 'Kt/V', value: '1.34', refRange: '>=1.20', originalReport: '尿素清除率计算单', attachment: 'PDF附件', trend: '平稳', status: '达标', archiveStatus: '待归档', reportTime: '2026-05-03 11:20', reviewer: '刘技师', nextAction: '归档报告' },
  { id: 'LRES-007', patient: '孙海', reportType: '感染', item: 'HBsAg', value: '阳性', refRange: '阴性', originalReport: '感染四项原始报告', attachment: 'PDF+感控标记', trend: '持续阳性', status: '隔离标记', archiveStatus: '已归档', reportTime: '2026-05-08 10:00', reviewer: '感染护士', nextAction: '隔离透析' },
  { id: 'LRES-008', patient: '马丽', reportType: '心功能', item: 'BNP', value: '980 pg/mL', refRange: '<100', originalReport: '免疫分析仪报告', attachment: 'PDF附件', trend: '上升', status: '异常', archiveStatus: '待归档', reportTime: '2026-05-09 08:20', reviewer: '王技师', nextAction: '医生评估' },
  { id: 'LRES-009', patient: '郭强', reportType: '钙磷', item: 'PTH', value: '780 pg/mL', refRange: '150-600', originalReport: 'LIS原始报告 R20260508009', attachment: 'PDF附件', trend: '上升', status: '异常', archiveStatus: '已归档', reportTime: '2026-05-08 09:30', reviewer: '刘技师', nextAction: '降磷处理' },
  { id: 'LRES-010', patient: '陈敏', reportType: '充分性', item: 'Kt/V', value: '1.18', refRange: '>=1.20', originalReport: '尿素清除率计算单', attachment: 'Excel导入+PDF', trend: '下降', status: '未达标', archiveStatus: '待归档', reportTime: '2026-05-03 11:20', reviewer: '张技师', nextAction: '处方调整' },
];

const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['lab_report', 'lab_result_item', 'critical_value_notice', 'lab_result_trend'];

const metrics = computed(() => [
  { label: '报告总数', value: rows.length, tone: 'blue' },
  { label: '达标', value: rows.filter((item) => item.status === '达标').length, tone: 'green' },
  { label: '异常', value: rows.filter((item) => item.status === '异常').length, tone: 'orange' },
  { label: '危急关注', value: rows.filter((item) => item.status === '危急关注').length, tone: 'red' },
  { label: '未达标', value: rows.filter((item) => item.status === '未达标').length, tone: 'orange' },
  { label: '待归档', value: rows.filter((item) => item.archiveStatus.includes('待')).length, tone: 'orange' },
]);

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value === '达标' || value === '平稳') return 'success';
  if (value === '已归档') return 'success';
  if (value.includes('待') || value === '异常' || value === '未达标' || value === '危急关注') return 'warning';
  if (value === '隔离标记') return 'danger';
  return 'info';
}

function selectRow(row: ResultRow): void {
  selectedId.value = row.id;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}
</script>

<template>
  <section class="lab-workflow-page">
    <el-card class="lab-work-card" shadow="never">
      <template #header>
        <div class="lab-header">
          <div>
            <h2>{{ context.menuTitle }}</h2>
            <p>查看检验结果、趋势和达标判定，并将异常结果引导到临床事件或质量管理。</p>
          </div>
          <div class="lab-actions">
            <el-button type="primary" :icon="Histogram" @click="trendDrawerVisible = true">查看趋势</el-button>
            <el-button :icon="CircleCheck" @click="attachmentDrawerVisible = true">原始报告</el-button>
            <el-button :icon="CircleCheck" @click="printDialogVisible = true">打印报告</el-button>
            <el-button :icon="CircleCheck" @click="archiveDialogVisible = true">归档确认</el-button>
            <el-button :icon="Warning" @click="eventDialogVisible = true">转临床事件</el-button>
            <el-button :icon="CircleCheck" @click="adoptDialogVisible = true">采用引用</el-button>
          </div>
        </div>
      </template>

      <el-form class="lab-filter" inline>
        <el-form-item label="关键字"><el-input placeholder="患者、项目、结果、来源" clearable /></el-form-item>
        <el-form-item label="结果类型">
          <el-select placeholder="全部类型" clearable>
            <el-option label="生化" value="生化" />
            <el-option label="血常规" value="血常规" />
            <el-option label="钙磷" value="钙磷" />
            <el-option label="充分性" value="充分性" />
          </el-select>
        </el-form-item>
        <el-form-item label="判定">
          <el-select placeholder="全部判定" clearable>
            <el-option label="达标" value="达标" />
            <el-option label="异常" value="异常" />
            <el-option label="危急关注" value="危急关注" />
            <el-option label="未达标" value="未达标" />
          </el-select>
        </el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <div class="lab-stat-grid">
        <el-card v-for="item in metrics" :key="item.label" :class="['lab-stat-card', item.tone]" shadow="never">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </el-card>
      </div>

      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow">
        <el-table-column prop="patient" label="患者" width="100" fixed="left" />
        <el-table-column prop="reportType" label="报告类型" width="100" />
        <el-table-column prop="item" label="项目" width="100" />
        <el-table-column prop="value" label="结果" width="120" />
        <el-table-column prop="refRange" label="参考范围" width="120" />
        <el-table-column prop="originalReport" label="原始报告" min-width="160" />
        <el-table-column prop="attachment" label="附件" width="130" />
        <el-table-column prop="trend" label="趋势" width="100">
          <template #default="{ row }"><el-tag :type="tagType(row.trend)" effect="plain">{{ row.trend }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="status" label="判定" width="100">
          <template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="archiveStatus" label="归档" width="120">
          <template #default="{ row }"><el-tag :type="tagType(row.archiveStatus)" effect="plain">{{ row.archiveStatus }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="reportTime" label="报告时间" width="150" />
        <el-table-column prop="reviewer" label="责任人" width="100" />
        <el-table-column prop="nextAction" label="下一步" min-width="120" />
      </el-table>
    </el-card>

    <el-drawer v-model="trendDrawerVisible" title="检验趋势" size="620px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="患者">{{ currentRow.patient }}</el-descriptions-item>
        <el-descriptions-item label="项目">{{ currentRow.item }}</el-descriptions-item>
        <el-descriptions-item label="本次结果">{{ currentRow.value }}</el-descriptions-item>
        <el-descriptions-item label="趋势">{{ currentRow.trend }}</el-descriptions-item>
      </el-descriptions>
      <el-timeline class="clinical-event-timeline">
        <el-timeline-item timestamp="2026-04-10">上月结果：接近参考范围</el-timeline-item>
        <el-timeline-item timestamp="2026-05-08" type="warning">本月结果：{{ currentRow.value }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10" type="success">建议：{{ currentRow.nextAction }}</el-timeline-item>
      </el-timeline>
    </el-drawer>

    <el-drawer v-model="attachmentDrawerVisible" title="原始检验报告与附件" size="620px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="患者">{{ currentRow.patient }}</el-descriptions-item>
        <el-descriptions-item label="原始报告">{{ currentRow.originalReport }}</el-descriptions-item>
        <el-descriptions-item label="附件">{{ currentRow.attachment }}</el-descriptions-item>
        <el-descriptions-item label="标准化结果">{{ currentRow.item }} {{ currentRow.value }}，参考范围 {{ currentRow.refRange }}</el-descriptions-item>
      </el-descriptions>
      <el-alert class="dialog-form" type="info" show-icon :closable="false" title="附件归档后不覆盖原文件，只允许追加版本并保留审计记录。" />
      <el-table :data="[
        { version: 'V1', file: currentRow.originalReport, source: 'LIS/上传', status: '已校验' },
        { version: 'V2', file: currentRow.attachment, source: '附件追加', status: '待归档' },
      ]" border size="small">
        <el-table-column prop="version" label="版本" width="80" />
        <el-table-column prop="file" label="文件/报告" min-width="180" />
        <el-table-column prop="source" label="来源" width="110" />
        <el-table-column prop="status" label="状态" width="100" />
      </el-table>
    </el-drawer>

    <el-dialog v-model="eventDialogVisible" title="转临床事件" width="620px">
      <el-alert type="warning" show-icon :closable="false" title="危急值和未达标结果可直接转临床事件或质量分析任务。" />
      <el-form label-width="100px">
        <el-form-item label="检验项"><el-input :model-value="`${currentRow.patient} / ${currentRow.item}`" disabled /></el-form-item>
        <el-form-item label="事件类型">
          <el-select placeholder="请选择">
            <el-option label="危急值处理" value="critical" />
            <el-option label="疗效未达标" value="effect" />
            <el-option label="用药调整" value="drug" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理要求"><el-input type="textarea" :rows="3" placeholder="填写通知对象、处理意见和复查要求" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="eventDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="eventDialogVisible = false; submitAction('检验结果已转临床事件')">提交事件</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="printDialogVisible" title="检验报告打印" width="580px">
      <el-form label-width="100px">
        <el-form-item label="报告对象"><el-input :model-value="`${currentRow.patient} / ${currentRow.reportType}`" disabled /></el-form-item>
        <el-form-item label="打印内容">
          <el-checkbox-group model-value="standard">
            <el-checkbox-button label="standard">标准化结果</el-checkbox-button>
            <el-checkbox-button label="original">原始报告</el-checkbox-button>
            <el-checkbox-button label="trend">趋势图</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="用途"><el-input placeholder="医生评估、患者留存、归档补打或质控抽查" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="printDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="printDialogVisible = false; submitAction('检验报告打印任务已生成')">确认打印</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="archiveDialogVisible" title="检验报告归档确认" width="620px">
      <el-alert type="warning" show-icon :closable="false" title="归档前需确认结果复核、危急值通知、附件完整和医生可引用状态。" />
      <el-form class="dialog-form" label-width="110px">
        <el-form-item label="报告"><el-input :model-value="`${currentRow.patient} / ${currentRow.item}`" disabled /></el-form-item>
        <el-form-item label="归档检查">
          <el-checkbox-group model-value="review">
            <el-checkbox-button label="review">已复核</el-checkbox-button>
            <el-checkbox-button label="attachment">附件完整</el-checkbox-button>
            <el-checkbox-button label="critical">危急值已处理</el-checkbox-button>
            <el-checkbox-button label="publish">医生站可引用</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="归档意见"><el-input type="textarea" :rows="3" placeholder="记录归档人、归档时间、退回原因或追加版本说明" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="archiveDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="archiveDialogVisible = false; submitAction('检验报告已归档，医生评估和统计报表可引用')">确认归档</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="adoptDialogVisible" title="质量引用" width="580px">
      <el-form label-width="100px">
        <el-form-item label="检验项"><el-input :model-value="`${currentRow.patient} / ${currentRow.item}`" disabled /></el-form-item>
        <el-form-item label="引用用途">
          <el-checkbox-group model-value="assessment">
            <el-checkbox-button label="assessment">病情评估</el-checkbox-button>
            <el-checkbox-button label="order">医嘱调整</el-checkbox-button>
            <el-checkbox-button label="report">健康报告</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="说明"><el-input type="textarea" :rows="3" placeholder="说明引用口径、异常解释和后续计划" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="adoptDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="adoptDialogVisible = false; submitAction('检验结果已用于质量引用')">确认引用</el-button>
      </template>
    </el-dialog>
  </section>
</template>
