<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  CircleCheck,
  DataAnalysis,
  DocumentAdd,
  Histogram,
  Search,
  Warning,
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{
  context: PageContext;
}>();

type AlertRow = {
  id: string;
  patient: string;
  dialysisNo: string;
  alertType: string;
  source: string;
  indicator: string;
  value: string;
  target: string;
  severity: string;
  ownerRole: string;
  effectRecord: string;
  rectification: string;
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
  review: string;
};

const selectedAlertId = ref('AL-001');
const activeTab = ref(props.context.menuKey.includes('quality') ? 'alerts' : 'alerts');
const handleDialogVisible = ref(false);
const cqiDialogVisible = ref(false);
const reviewDialogVisible = ref(false);
const traceDrawerVisible = ref(false);

const alerts = ref<AlertRow[]>([
  { id: 'AL-001', patient: '赵明', dialysisNo: 'HD-00116', alertType: '危急值', source: '检验报告', indicator: '血钾', value: '6.2 mmol/L', target: '<=5.5', severity: '高', ownerRole: '医生', effectRecord: '预警事件评估和处理记录', rectification: '整改建议：复查血钾并调处方', handleStatus: '待处理', cqiStatus: '未生成', reviewStatus: '未复查', nextAction: '立即处理' },
  { id: 'AL-002', patient: '郭强', dialysisNo: 'HD-00277', alertType: '疗效不达标', source: '透析记录', indicator: 'Kt/V', value: '1.18', target: '>=1.20', severity: '高', ownerRole: '医生', effectRecord: '疗效分析评估和处理记录', rectification: '整改建议：延长透析时长', handleStatus: '处理中', cqiStatus: '已生成', reviewStatus: '待复查', nextAction: '复查充分性' },
  { id: 'AL-003', patient: '李秀兰', dialysisNo: 'HD-00072', alertType: '营养风险', source: '检验报告', indicator: '白蛋白', value: '34 g/L', target: '>=35', severity: '中', ownerRole: '医生', effectRecord: '疗效不达标患者', rectification: '整改建议：营养干预', handleStatus: '待处理', cqiStatus: '未生成', reviewStatus: '未复查', nextAction: '营养评估' },
  { id: 'AL-004', patient: '周庆', dialysisNo: 'HD-00218', alertType: '透中低血压', source: '治疗监测', indicator: '收缩压', value: '88 mmHg', target: '>=90', severity: '高', ownerRole: '护士', effectRecord: '预警事件评估和处理记录', rectification: '整改建议：限制超滤', handleStatus: '已处理', cqiStatus: '未生成', reviewStatus: '待复查', nextAction: '复查超滤' },
  { id: 'AL-005', patient: '陈志强', dialysisNo: 'HD-00128', alertType: '通路风险', source: '通路评估', indicator: '静脉压', value: '升高', target: '稳定', severity: '中', ownerRole: '医生', effectRecord: '持续质量改进任务', rectification: '整改建议：通路超声', handleStatus: '处理中', cqiStatus: '已生成', reviewStatus: '待复查', nextAction: '超声复查' },
  { id: 'AL-006', patient: '何雪', dialysisNo: 'HD-00246', alertType: '钙磷异常', source: '检验报告', indicator: '血磷', value: '1.82 mmol/L', target: '<=1.45', severity: '中', ownerRole: '医生', effectRecord: '疗效分析评估和处理记录', rectification: '整改建议：调整用药', handleStatus: '待处理', cqiStatus: '未生成', reviewStatus: '未复查', nextAction: '调整用药' },
  { id: 'AL-007', patient: '曹敏', dialysisNo: 'HD-00291', alertType: 'PTH不达标', source: '检验报告', indicator: 'PTH', value: '780 pg/mL', target: '150-600', severity: '中', ownerRole: '医生', effectRecord: '疗效不达标患者', rectification: '整改建议：骨代谢评估', handleStatus: '待处理', cqiStatus: '未生成', reviewStatus: '未复查', nextAction: '骨代谢评估' },
  { id: 'AL-008', patient: '马丽', dialysisNo: 'HD-00203', alertType: '隔离流程', source: '设备消毒', indicator: '终末消毒', value: '待复核', target: '已复核', severity: '中', ownerRole: '护士', effectRecord: '持续质量改进任务', rectification: '整改建议：感控复核', handleStatus: '处理中', cqiStatus: '未生成', reviewStatus: '未复查', nextAction: '感控复核' },
  { id: 'AL-009', patient: '孙海', dialysisNo: 'HD-00177', alertType: '贫血管理', source: '检验报告', indicator: 'Hb', value: '92 g/L', target: '100-120', severity: '中', ownerRole: '医生', effectRecord: '疗效分析评估和处理记录', rectification: '整改建议：复查Hb', handleStatus: '已处理', cqiStatus: '未生成', reviewStatus: '待复查', nextAction: '复查Hb' },
  { id: 'AL-010', patient: '潘德胜', dialysisNo: 'HD-00305', alertType: '跌倒风险', source: '护理记录', indicator: '跌倒评分', value: '高风险', target: '低风险', severity: '中', ownerRole: '护士', effectRecord: '处理状态标记', rectification: '整改建议：宣教复查', handleStatus: '已处理', cqiStatus: '未生成', reviewStatus: '待复查', nextAction: '宣教复查' },
]);

const cqiRows = ref<CqiRow[]>([
  { code: 'CQI-202605-001', title: '提高透析充分性达标率', problem: 'Kt/V低于目标患者增加', owner: '医生', dueDate: '2026-05-31', status: '整改中', review: '待复查' },
  { code: 'CQI-202605-002', title: '降低透中低血压发生率', problem: '高龄心衰患者超滤风险', owner: '护士长', dueDate: '2026-05-25', status: '整改中', review: '待复查' },
  { code: 'CQI-202605-003', title: '导管出口感染风险改进', problem: '导管护理事件增加', owner: '感控专员', dueDate: '2026-06-05', status: '待启动', review: '未复查' },
  { code: 'CQI-202605-004', title: '白蛋白达标改善', problem: '营养风险患者增多', owner: '医生', dueDate: '2026-06-10', status: '待启动', review: '未复查' },
]);

const selectedAlert = computed(() => alerts.value.find((item) => item.id === selectedAlertId.value) ?? alerts.value[0]);

const metrics = computed(() => [
  { label: '预警总数', value: alerts.value.length, tone: 'blue' },
  { label: '高风险', value: alerts.value.filter((item) => item.severity === '高').length, tone: 'red' },
  { label: '待处理', value: alerts.value.filter((item) => item.handleStatus === '待处理').length, tone: 'orange' },
  { label: 'CQI项目', value: cqiRows.value.length, tone: 'green' },
  { label: '待复查', value: alerts.value.filter((item) => item.reviewStatus.includes('待')).length, tone: 'orange' },
]);

const closureChecks = computed(() => [
  { label: '预警来源', value: selectedAlert.value.source, pass: true },
  { label: '责任角色', value: selectedAlert.value.ownerRole, pass: true },
  { label: '处理状态', value: selectedAlert.value.handleStatus, pass: selectedAlert.value.handleStatus !== '待处理' },
  { label: 'CQI状态', value: selectedAlert.value.cqiStatus, pass: selectedAlert.value.severity !== '高' || selectedAlert.value.cqiStatus === '已生成' },
  { label: '复查状态', value: selectedAlert.value.reviewStatus, pass: selectedAlert.value.reviewStatus === '已复查' },
]);

const activeTables = ['alert_event', 'alert_handle_record', 'efficacy_evaluation', 'cqi_project', 'cqi_action', 'cqi_review'];

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (['已处理', '已生成', '已复查', '低', '整改完成'].includes(value)) return 'success';
  if (['高', '待处理'].includes(value)) return 'danger';
  if (value.includes('待') || value.includes('中') || value === '未生成' || value === '未复查') return 'warning';
  return 'info';
}

function selectAlert(row: AlertRow): void {
  selectedAlertId.value = row.id;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}

function handleAlert(): void {
  selectedAlert.value.handleStatus = '已处理';
  handleDialogVisible.value = false;
  submitAction('预警已处理，结果已回写看板和员工主页待办');
}

function createCqi(): void {
  selectedAlert.value.cqiStatus = '已生成';
  cqiDialogVisible.value = false;
  submitAction('CQI项目已生成，整改任务已分配');
}

function reviewAlert(): void {
  selectedAlert.value.reviewStatus = '已复查';
  reviewDialogVisible.value = false;
  submitAction('复查完成，预警可关闭');
}
</script>

<template>
  <section class="quality-cqi-page">
    <el-card class="quality-work-card" shadow="never">
      <template #header>
        <div class="quality-header">
          <div>
            <h2>疗效预警与 CQI</h2>
            <p>汇总治疗、检验、通路、设备和护理事件，推动预警处理、CQI整改、复查关闭和质量指标改进。</p>
          </div>
          <div class="quality-actions">
            <el-button type="primary" :icon="Warning" @click="handleDialogVisible = true">处理预警</el-button>
            <el-button :icon="DocumentAdd" @click="cqiDialogVisible = true">生成 CQI</el-button>
            <el-button :icon="CircleCheck" @click="reviewDialogVisible = true">复查关闭</el-button>
            <el-button :icon="Histogram" @click="traceDrawerVisible = true">趋势分析</el-button>
          </div>
        </div>
      </template>

      <el-form class="quality-filter" inline>
        <el-form-item label="关键字">
          <el-input placeholder="患者、预警类型、指标、责任人" clearable />
        </el-form-item>
        <el-form-item label="严重程度">
          <el-select placeholder="全部等级" clearable>
            <el-option label="高" value="high" />
            <el-option label="中" value="middle" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理状态">
          <el-select placeholder="全部状态" clearable>
            <el-option label="待处理" value="pending" />
            <el-option label="处理中" value="doing" />
            <el-option label="已处理" value="done" />
          </el-select>
        </el-form-item>
        <el-form-item label="周期">
          <el-date-picker type="month" placeholder="选择月份" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>

      <div class="quality-stat-grid">
        <el-card v-for="item in metrics" :key="item.label" :class="['quality-stat-card', item.tone]" shadow="never">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </el-card>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :xl="16">
          <el-card class="quality-main-card" shadow="never">
            <template #header>
              <div class="quality-card-header">
                <div>
                  <strong>预警事件</strong>
                  <p>示例数据不少于 10 条，覆盖检验、治疗、通路、设备、护理和感控相关质量风险。</p>
                </div>
                <el-tag type="primary" effect="plain">指标不达标 -> 预警 -> 处理/CQI -> 复查关闭</el-tag>
              </div>
            </template>
            <el-table :data="alerts" border stripe highlight-current-row row-key="id" @row-click="selectAlert">
              <el-table-column prop="patient" label="患者" width="95" fixed="left" />
              <el-table-column prop="dialysisNo" label="透析号" width="115" />
              <el-table-column prop="alertType" label="预警类型" min-width="130" />
              <el-table-column prop="source" label="来源" min-width="120" />
              <el-table-column prop="indicator" label="指标" width="110" />
              <el-table-column prop="value" label="当前值" min-width="120" />
              <el-table-column prop="target" label="目标" width="100" />
              <el-table-column prop="severity" label="等级" width="80">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.severity)">{{ row.severity }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="ownerRole" label="责任角色" width="100" />
              <el-table-column prop="effectRecord" label="评估处理记录" min-width="180" />
              <el-table-column prop="rectification" label="整改建议" min-width="170" />
              <el-table-column prop="handleStatus" label="处理" width="100">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.handleStatus)">{{ row.handleStatus }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="cqiStatus" label="CQI" width="100">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.cqiStatus)" effect="plain">{{ row.cqiStatus }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="reviewStatus" label="复查" width="100" />
              <el-table-column prop="nextAction" label="下一步" min-width="120" />
              <el-table-column label="操作" width="230" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click.stop="selectAlert(row); handleDialogVisible = true">处理</el-button>
                  <el-button link @click.stop="selectAlert(row); cqiDialogVisible = true">CQI</el-button>
                  <el-button link @click.stop="selectAlert(row); reviewDialogVisible = true">复查</el-button>
                  <el-button link @click.stop="selectAlert(row); traceDrawerVisible = true">追溯</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>

        <el-col :xs="24" :xl="8">
          <el-card class="quality-side-card" shadow="never">
            <template #header>
              <div class="quality-card-header">
                <strong>当前预警闭环检查</strong>
                <el-tag :type="tagType(selectedAlert.severity)">{{ selectedAlert.severity }}风险</el-tag>
              </div>
            </template>
            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="患者">{{ selectedAlert.patient }} / {{ selectedAlert.dialysisNo }}</el-descriptions-item>
              <el-descriptions-item label="预警">{{ selectedAlert.alertType }} / {{ selectedAlert.indicator }}</el-descriptions-item>
              <el-descriptions-item label="当前值">{{ selectedAlert.value }}；目标 {{ selectedAlert.target }}</el-descriptions-item>
              <el-descriptions-item label="来源">{{ selectedAlert.source }}</el-descriptions-item>
            </el-descriptions>
            <div class="quality-check-list">
              <div v-for="item in closureChecks" :key="item.label" class="quality-check-row">
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
                <el-icon :class="{ pass: item.pass, block: !item.pass }">
                  <CircleCheck v-if="item.pass" />
                  <Warning v-else />
                </el-icon>
              </div>
            </div>
            <div class="quality-quick-actions">
              <el-button type="primary" @click="handleDialogVisible = true">处理预警</el-button>
              <el-button @click="cqiDialogVisible = true">生成 CQI</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="quality-workspace-card" shadow="never">
      <template #header>
        <div class="quality-card-header">
          <div>
            <strong>CQI 项目与整改</strong>
            <p>共性问题进入 CQI，明确责任人、整改措施、到期时间和复查结果。</p>
          </div>
          <el-button type="primary" :icon="DocumentAdd" @click="cqiDialogVisible = true">新增 CQI</el-button>
        </div>
      </template>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="CQI项目" name="alerts">
          <el-table :data="cqiRows" border stripe>
            <el-table-column prop="code" label="编号" width="140" />
            <el-table-column prop="title" label="项目名称" min-width="190" />
            <el-table-column prop="problem" label="问题描述" min-width="210" />
            <el-table-column prop="owner" label="责任人" width="100" />
            <el-table-column prop="dueDate" label="到期日" width="115" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="tagType(row.status)">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="review" label="复查" width="100" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="指标趋势" name="trend">
          <div class="quality-trend-grid">
            <el-card shadow="never" class="quality-trend-card">
              <strong>Kt/V达标率</strong>
              <span>86%</span>
              <p>目标 >= 90%，当前触发 CQI。</p>
            </el-card>
            <el-card shadow="never" class="quality-trend-card">
              <strong>Hb达标率</strong>
              <span>78%</span>
              <p>贫血管理需复查用药与铁剂。</p>
            </el-card>
            <el-card shadow="never" class="quality-trend-card">
              <strong>低血压发生率</strong>
              <span>6.4%</span>
              <p>高龄心衰患者需限制超滤。</p>
            </el-card>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog v-model="handleDialogVisible" title="预警处理" width="660px">
      <el-form label-width="110px">
        <el-form-item label="预警">
          <el-input :model-value="`${selectedAlert.patient} / ${selectedAlert.alertType} / ${selectedAlert.value}`" />
        </el-form-item>
        <el-form-item label="处理措施">
          <el-input type="textarea" :rows="3" placeholder="记录医嘱调整、宣教、复查、转诊、护理干预或设备处理措施" />
        </el-form-item>
        <el-form-item label="处理结果">
          <el-radio-group model-value="done">
            <el-radio-button label="done">已处理</el-radio-button>
            <el-radio-button label="track">继续跟踪</el-radio-button>
            <el-radio-button label="cqi">转CQI</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAlert">保存处理</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="cqiDialogVisible" title="生成 CQI 项目" width="660px">
      <el-form label-width="110px">
        <el-form-item label="项目名称">
          <el-input placeholder="例如：提高透析充分性达标率" />
        </el-form-item>
        <el-form-item label="问题描述">
          <el-input type="textarea" :rows="3" :placeholder="selectedAlert.alertType + ' / ' + selectedAlert.indicator" />
        </el-form-item>
        <el-form-item label="责任人">
          <el-input :model-value="selectedAlert.ownerRole" />
        </el-form-item>
        <el-form-item label="到期日期">
          <el-date-picker type="date" placeholder="整改到期日期" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cqiDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="createCqi">生成项目</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="reviewDialogVisible" title="复查关闭" width="620px">
      <el-form label-width="110px">
        <el-form-item label="复查结果">
          <el-radio-group model-value="pass">
            <el-radio-button label="pass">达标关闭</el-radio-button>
            <el-radio-button label="continue">继续整改</el-radio-button>
            <el-radio-button label="upgrade">升级处理</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="复查说明">
          <el-input type="textarea" :rows="3" placeholder="记录复查指标、是否达标、后续计划" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reviewDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="reviewAlert">完成复查</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="预警来源追溯" size="560px">
      <el-timeline>
        <el-timeline-item timestamp="来源记录" type="primary">{{ selectedAlert.source }} 产生 {{ selectedAlert.indicator }} 异常。</el-timeline-item>
        <el-timeline-item timestamp="预警生成" type="warning">{{ selectedAlert.alertType }}，等级 {{ selectedAlert.severity }}，责任 {{ selectedAlert.ownerRole }}。</el-timeline-item>
        <el-timeline-item timestamp="处理状态" type="success">处理：{{ selectedAlert.handleStatus }}；CQI：{{ selectedAlert.cqiStatus }}；复查：{{ selectedAlert.reviewStatus }}。</el-timeline-item>
        <el-timeline-item timestamp="回流">状态同步到科室看板、员工主页、统计报表和规则配置。</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
