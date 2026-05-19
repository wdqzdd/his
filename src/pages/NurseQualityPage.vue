<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, DocumentAdd, Histogram, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{
  context: PageContext;
}>();

type QualityRow = {
  id: string;
  patient: string;
  alertType: string;
  source: string;
  indicator: string;
  value: string;
  target: string;
  severity: string;
  ownerRole: string;
  handleStatus: string;
  cqiStatus: string;
  reviewStatus: string;
  nextAction: string;
};

type CqiRow = {
  code: string;
  title: string;
  problem: string;
  owner: string;
  dueDate: string;
  status: string;
};

const selectedId = ref('NQ-001');
const handleDialogVisible = ref(false);
const cqiDialogVisible = ref(false);
const reviewDialogVisible = ref(false);
const trendDrawerVisible = ref(false);

const rows: QualityRow[] = [
  { id: 'NQ-001', patient: '王建国', alertType: '低血压预警', source: '透中监测', indicator: '收缩压', value: '88 mmHg', target: '>=90', severity: '高', ownerRole: '护士', handleStatus: '待处理', cqiStatus: '未生成', reviewStatus: '待复核', nextAction: '立即处理' },
  { id: 'NQ-002', patient: '李秀英', alertType: '通路风险', source: '通路记录', indicator: '出口红肿', value: '红肿', target: '正常', severity: '高', ownerRole: '护士', handleStatus: '处理中', cqiStatus: '已生成', reviewStatus: '待复核', nextAction: '感控协同' },
  { id: 'NQ-003', patient: '赵明', alertType: '疗效未达标', source: '治疗记录', indicator: 'Kt/V', value: '1.18', target: '>=1.20', severity: '高', ownerRole: '护士', handleStatus: '待处理', cqiStatus: '未生成', reviewStatus: '待复核', nextAction: '生成 CQI' },
  { id: 'NQ-004', patient: '陈志强', alertType: '营养风险', source: '检验报告', indicator: 'Alb', value: '34 g/L', target: '>=35', severity: '中', ownerRole: '护士', handleStatus: '待处理', cqiStatus: '未生成', reviewStatus: '待复核', nextAction: '宣教提醒' },
  { id: 'NQ-005', patient: '周庆', alertType: '跌倒风险', source: '护理记录', indicator: '跌倒评分', value: '高风险', target: '低风险', severity: '中', ownerRole: '护士', handleStatus: '处理中', cqiStatus: '已生成', reviewStatus: '待复核', nextAction: '复查关闭' },
  { id: 'NQ-006', patient: '何雪', alertType: '感染提醒', source: '感控检查', indicator: '手卫生', value: '1次漏项', target: '0', severity: '中', ownerRole: '护士', handleStatus: '待处理', cqiStatus: '未生成', reviewStatus: '待复核', nextAction: '整改登记' },
  { id: 'NQ-007', patient: '孙海', alertType: '高磷预警', source: '检验报告', indicator: 'P', value: '1.82 mmol/L', target: '<=1.45', severity: '中', ownerRole: '护士', handleStatus: '待处理', cqiStatus: '未生成', reviewStatus: '待复核', nextAction: '补充宣教' },
  { id: 'NQ-008', patient: '马丽', alertType: '隔离异常', source: '设备消毒', indicator: '消毒状态', value: '待复核', target: '已复核', severity: '中', ownerRole: '护士', handleStatus: '处理中', cqiStatus: '已生成', reviewStatus: '待复核', nextAction: '感控复核' },
  { id: 'NQ-009', patient: '郭强', alertType: '宣教缺失', source: '随访记录', indicator: '宣教完成率', value: '80%', target: '100%', severity: '低', ownerRole: '护士', handleStatus: '待处理', cqiStatus: '未生成', reviewStatus: '待复核', nextAction: '补录宣教' },
  { id: 'NQ-010', patient: '陈敏', alertType: '复查超时', source: '随访任务', indicator: '超时天数', value: '3天', target: '0天', severity: '低', ownerRole: '护士', handleStatus: '待处理', cqiStatus: '未生成', reviewStatus: '待复核', nextAction: '安排复查' },
];

const cqiRows: CqiRow[] = [
  { code: 'CQI-N-001', title: '提升低血压处理闭环', problem: '透中低血压重复出现', owner: '护士长', dueDate: '2026-05-31', status: '整改中' },
  { code: 'CQI-N-002', title: '通路异常复查及时率', problem: '通路异常上报后复查慢', owner: '感染护士', dueDate: '2026-05-25', status: '待启动' },
  { code: 'CQI-N-003', title: '宣教确认完整率', problem: '部分患者未完成确认', owner: '张护士', dueDate: '2026-06-05', status: '整改中' },
];

const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['nursing_alert_event', 'nursing_cqi_project', 'nursing_review_record', 'nursing_quality_metric'];

const metrics = computed(() => [
  { label: '预警总数', value: rows.length, tone: 'blue' },
  { label: '高风险', value: rows.filter((item) => item.severity === '高').length, tone: 'red' },
  { label: '待处理', value: rows.filter((item) => item.handleStatus === '待处理').length, tone: 'orange' },
  { label: 'CQI项目', value: cqiRows.length, tone: 'green' },
  { label: '待复核', value: rows.filter((item) => item.reviewStatus === '待复核').length, tone: 'orange' },
]);

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value === '已生成' || value === '整改中' || value === '已完成') return 'success';
  if (value === '高' || value === '待处理') return 'danger';
  if (value === '待启动' || value === '处理中' || value === '待复核') return 'warning';
  return 'info';
}

function selectRow(row: QualityRow): void {
  selectedId.value = row.id;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}

function openHandle(row: QualityRow): void {
  selectedId.value = row.id;
  handleDialogVisible.value = true;
}

function openCqi(row: QualityRow): void {
  selectedId.value = row.id;
  cqiDialogVisible.value = true;
}

function openReview(row: QualityRow): void {
  selectedId.value = row.id;
  reviewDialogVisible.value = true;
}
</script>

<template>
  <section class="nurse-execution-page">
    <el-card class="nurse-work-card" shadow="never">
      <template #header>
        <div class="nurse-header">
          <div>
            <h2>{{ context.menuTitle }}</h2>
            <p>跟踪护理预警、质量指标和 CQI 项目，把异常处理和复查闭环留在护士站内。</p>
          </div>
          <div class="nurse-actions">
            <el-button type="primary" :icon="Warning" @click="openHandle(rows[0])">处理预警</el-button>
            <el-button :icon="DocumentAdd" @click="openCqi(rows[0])">生成 CQI</el-button>
            <el-button :icon="CircleCheck" @click="openReview(rows[0])">复核关闭</el-button>
            <el-button :icon="Histogram" @click="trendDrawerVisible = true">趋势分析</el-button>
          </div>
        </div>
      </template>

      <el-form class="nurse-filter" inline>
        <el-form-item label="关键字">
          <el-input placeholder="患者、预警、指标、责任人" clearable />
        </el-form-item>
        <el-form-item label="级别">
          <el-select placeholder="全部级别" clearable>
            <el-option label="高" value="高" />
            <el-option label="中" value="中" />
            <el-option label="低" value="低" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理状态">
          <el-select placeholder="全部状态" clearable>
            <el-option label="待处理" value="待处理" />
            <el-option label="处理中" value="处理中" />
            <el-option label="已生成" value="已生成" />
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
        <el-table-column prop="alertType" label="预警类型" min-width="140" />
        <el-table-column prop="source" label="来源" width="100" />
        <el-table-column prop="indicator" label="指标" width="110" />
        <el-table-column prop="value" label="当前值" width="120" />
        <el-table-column prop="target" label="目标" width="100" />
        <el-table-column prop="severity" label="级别" width="80">
          <template #default="{ row }"><el-tag :type="tagType(row.severity)">{{ row.severity }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="ownerRole" label="责任角色" width="100" />
        <el-table-column prop="handleStatus" label="处理" width="100">
          <template #default="{ row }"><el-tag :type="tagType(row.handleStatus)" effect="plain">{{ row.handleStatus }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="cqiStatus" label="CQI" width="90">
          <template #default="{ row }"><el-tag :type="tagType(row.cqiStatus)" effect="plain">{{ row.cqiStatus }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="reviewStatus" label="复核" width="90" />
        <el-table-column prop="nextAction" label="下一步" min-width="120" />
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click.stop="openHandle(row)">处理</el-button>
            <el-button link @click.stop="openCqi(row)">CQI</el-button>
            <el-button link type="danger" @click.stop="openReview(row)">复核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="handleDialogVisible" title="预警处理" width="620px">
      <el-form label-width="100px">
        <el-form-item label="患者"><el-input :model-value="currentRow.patient" disabled /></el-form-item>
        <el-form-item label="处理方式">
          <el-select placeholder="请选择">
            <el-option label="立即处理" value="now" />
            <el-option label="继续观察" value="watch" />
            <el-option label="转医生" value="doctor" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理说明"><el-input type="textarea" :rows="3" placeholder="记录处理动作、责任人和关闭条件" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleDialogVisible = false; submitAction('护理预警已处理')">提交处理</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="cqiDialogVisible" title="生成 CQI" width="620px">
      <el-form label-width="100px">
        <el-form-item label="预警项"><el-input :model-value="currentRow.alertType" disabled /></el-form-item>
        <el-form-item label="CQI标题"><el-input placeholder="请输入CQI标题" /></el-form-item>
        <el-form-item label="责任人"><el-input placeholder="请输入责任人" /></el-form-item>
        <el-form-item label="整改说明"><el-input type="textarea" :rows="3" placeholder="说明整改目标、措施和复查时间" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cqiDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="cqiDialogVisible = false; submitAction('CQI项目已生成')">保存 CQI</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="reviewDialogVisible" title="复核关闭" width="560px">
      <el-form label-width="100px">
        <el-form-item label="预警项"><el-input :model-value="currentRow.alertType" disabled /></el-form-item>
        <el-form-item label="复核结果">
          <el-radio-group model-value="close">
            <el-radio-button label="close">关闭</el-radio-button>
            <el-radio-button label="follow">继续观察</el-radio-button>
            <el-radio-button label="return">退回整改</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="复核意见"><el-input type="textarea" :rows="3" placeholder="记录关闭依据、复查结论和后续要求" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reviewDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="reviewDialogVisible = false; submitAction('护理预警已复核关闭')">提交复核</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="trendDrawerVisible" title="护理质量趋势" size="560px">
      <el-timeline>
        <el-timeline-item timestamp="2026-04-10">低血压预警 3 例</el-timeline-item>
        <el-timeline-item timestamp="2026-05-03" type="warning">低血压预警 5 例</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10" type="success">整改后下降至 2 例</el-timeline-item>
      </el-timeline>
      <el-divider />
      <el-table :data="cqiRows" border size="small">
        <el-table-column prop="code" label="CQI编号" width="120" />
        <el-table-column prop="title" label="标题" min-width="150" />
        <el-table-column prop="owner" label="责任人" width="100" />
        <el-table-column prop="status" label="状态" width="90" />
      </el-table>
    </el-drawer>
  </section>
</template>
