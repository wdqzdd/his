<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  CircleCheck,
  Connection,
  DocumentAdd,
  Operation,
  Search,
  SwitchButton,
  Warning,
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{
  context: PageContext;
}>();

type RuleRow = {
  id: string;
  type: string;
  name: string;
  trigger: string;
  condition: string;
  action: string;
  target: string;
  priority: string;
  status: string;
  lastRun: string;
  hitCount: number;
  owner: string;
  nextAction: string;
};

type LogRow = {
  time: string;
  rule: string;
  source: string;
  result: string;
  receiver: string;
  status: string;
};

const sectionByMenu: Record<string, string> = {
  'rule-diagnosis': 'diagnosis',
  'rule-task': 'task',
  'rule-message': 'message',
  'rule-effect': 'effect',
  'rule-warning': 'warning',
  'rule-cqi': 'cqi',
  'rule-flow': 'flow',
};

const activeTab = ref(sectionByMenu[props.context.menuKey] ?? 'diagnosis');
const selectedRuleId = ref('RULE-001');
const editDialogVisible = ref(false);
const testDialogVisible = ref(false);
const publishDialogVisible = ref(false);
const logDrawerVisible = ref(false);

watch(
  () => props.context.menuKey,
  (menuKey) => {
    activeTab.value = sectionByMenu[menuKey] ?? 'diagnosis';
  },
);

const rules = ref<RuleRow[]>([
  { id: 'RULE-001', type: '智能诊断', name: '高钾血症诊断提示', trigger: '检验结果复核', condition: '血钾 > 5.5 mmol/L', action: '生成医生待办和危急值提示', target: '医生站/员工主页', priority: '高', status: '启用', lastRun: '2026-05-10 08:40', hitCount: 12, owner: '医务医事站', nextAction: '复核诊断口径' },
  { id: 'RULE-002', type: '工作任务', name: '新入患者建档补全任务', trigger: '导诊建档保存', condition: '医保/联系人/签约缺项', action: '生成导诊补录任务', target: '导诊台', priority: '中', status: '启用', lastRun: '2026-05-10 09:05', hitCount: 8, owner: '导诊台', nextAction: '持续运行' },
  { id: 'RULE-003', type: '消息提醒', name: '长期医嘱到期提醒', trigger: '每日 07:00', condition: '长期医嘱剩余 <= 3 天', action: '推送医生复核提醒', target: '医生站/员工主页', priority: '中', status: '启用', lastRun: '2026-05-10 07:00', hitCount: 18, owner: '医生站', nextAction: '查看命中患者' },
  { id: 'RULE-004', type: '疗效方案', name: 'Kt/V 不达标预警', trigger: '治疗记录归档', condition: 'Kt/V < 1.20', action: '生成疗效预警', target: '医生站/疗效预警与CQI', priority: '高', status: '启用', lastRun: '2026-05-10 12:30', hitCount: 6, owner: '质量管理组', nextAction: '生成CQI' },
  { id: 'RULE-005', type: '预警事件', name: '透中低血压护理预警', trigger: '透中监测保存', condition: '收缩压 < 90 或下降 > 30', action: '推送护士处置流程', target: '护士站/科室看板', priority: '高', status: '启用', lastRun: '2026-05-10 14:10', hitCount: 11, owner: '护理组', nextAction: '优化处置模板' },
  { id: 'RULE-006', type: 'CQI方案', name: '手卫生依从率低于目标', trigger: '感控月报生成', condition: '依从率 < 95%', action: '生成感控培训与整改任务', target: '感控管理/CQI', priority: '中', status: '启用', lastRun: '2026-05-09 18:00', hitCount: 3, owner: '感控管理', nextAction: '安排培训' },
  { id: 'RULE-007', type: '数据流转', name: 'LIS 危急值同步', trigger: 'LIS 接口入库', condition: '危急值标志 = Y', action: '通知检验复核并推送医生', target: '检验科/医生站', priority: '高', status: '启用', lastRun: '2026-05-10 10:16', hitCount: 4, owner: '接口管理员', nextAction: '检查同步日志' },
  { id: 'RULE-008', type: '预警事件', name: '水质异常禁止上机', trigger: '水质记录保存', condition: '电导率/余氯/菌落异常', action: '设备置为待复核并阻断排班放行', target: '技师与设备站/护士站', priority: '高', status: '启用', lastRun: '2026-05-10 09:12', hitCount: 2, owner: '设备技师', nextAction: '复测水质' },
  { id: 'RULE-009', type: '消息提醒', name: '欠费患者透前提醒', trigger: '签到/排班确认', condition: '欠费金额 > 1000', action: '提醒导诊沟通并标记费用风险', target: '导诊台/费用管理', priority: '中', status: '停用', lastRun: '2026-05-08 08:00', hitCount: 0, owner: '费用管理', nextAction: '评估启用' },
  { id: 'RULE-010', type: '工作任务', name: '通路评估到期任务', trigger: '每日 06:30', condition: '通路评估距今 >= 30 天', action: '生成医生和护士共同评估任务', target: '医生站/护士站', priority: '中', status: '启用', lastRun: '2026-05-10 06:30', hitCount: 21, owner: '医生站', nextAction: '查看到期清单' },
  { id: 'RULE-011', type: '数据流转', name: '治疗归档回写报表', trigger: '治疗记录归档审核', condition: '归档状态 = 已归档', action: '写入统计快照候选数据', target: '统计报表', priority: '低', status: '启用', lastRun: '2026-05-10 16:00', hitCount: 94, owner: '统计分析员', nextAction: '核对报表口径' },
  { id: 'RULE-012', type: 'CQI方案', name: '导管感染事件转 CQI', trigger: '感控事件复核', condition: '导管相关感染 或 复发 >= 2 次', action: '生成CQI项目并要求复查', target: '感控管理/医生站', priority: '高', status: '草稿', lastRun: '-', hitCount: 0, owner: '感控管理', nextAction: '发布前测试' },
]);

const logs = ref<LogRow[]>([
  { time: '2026-05-10 16:00', rule: '治疗归档回写报表', source: 'TX-20260510-042', result: '写入报表候选数据', receiver: '统计报表', status: '成功' },
  { time: '2026-05-10 14:10', rule: '透中低血压护理预警', source: 'MON-20260510-128', result: '生成护士待办', receiver: '护士站', status: '成功' },
  { time: '2026-05-10 10:16', rule: 'LIS 危急值同步', source: 'LAB-20260510-071', result: '推送医生危急值', receiver: '医生站', status: '成功' },
  { time: '2026-05-10 09:12', rule: '水质异常禁止上机', source: 'WQ-20260510-ROA', result: '设备置为待复核', receiver: '技师与设备站', status: '待复核' },
]);

const selectedRule = computed(() => rules.value.find((item) => item.id === selectedRuleId.value) ?? rules.value[0]);

const metrics = computed(() => [
  { label: '规则总数', value: rules.value.length, tone: 'blue' },
  { label: '已启用', value: rules.value.filter((item) => item.status === '启用').length, tone: 'green' },
  { label: '高优先级', value: rules.value.filter((item) => item.priority === '高').length, tone: 'red' },
  { label: '今日命中', value: rules.value.reduce((sum, item) => sum + item.hitCount, 0), tone: 'orange' },
  { label: '草稿/停用', value: rules.value.filter((item) => item.status !== '启用').length, tone: 'blue' },
]);

const closureChecks = computed(() => [
  { label: '触发时机', value: selectedRule.value.trigger, pass: true },
  { label: '条件表达式', value: selectedRule.value.condition, pass: true },
  { label: '动作', value: selectedRule.value.action, pass: true },
  { label: '目标工作站', value: selectedRule.value.target, pass: true },
  { label: '发布状态', value: selectedRule.value.status, pass: selectedRule.value.status === '启用' },
  { label: '执行日志', value: `${selectedRule.value.hitCount} 次`, pass: selectedRule.value.status !== '启用' || selectedRule.value.hitCount > 0 },
]);

const scenarioRows = computed(() => [
  { source: 'LAB-20260510-071', input: '血钾 6.2 mmol/L', rule: '高钾血症诊断提示', result: '生成医生危急值待办', status: '通过' },
  { source: 'TX-20260510-128', input: 'Kt/V 1.14', rule: 'Kt/V 不达标预警', result: '生成疗效预警', status: '通过' },
  { source: 'WQ-20260510-ROA', input: '电导率偏高', rule: '水质异常禁止上机', result: '设备待复核', status: '通过' },
  { source: 'IC-003', input: '隔离终末消毒待复核', rule: '手卫生依从率低于目标', result: '纳入感控统计', status: '待复核' },
]);

const activeTables = ['rule_plan', 'rule_condition', 'rule_action', 'rule_execution_log', 'reminder_rule'];

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (['启用', '低', '成功', '通过'].includes(value)) return 'success';
  if (['高'].includes(value)) return 'danger';
  if (value.includes('待') || value.includes('草稿') || value.includes('停用') || value === '中') return 'warning';
  return 'info';
}

function selectRule(row: RuleRow): void {
  selectedRuleId.value = row.id;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}

function saveRule(): void {
  editDialogVisible.value = false;
  submitAction('规则配置已保存，需测试通过后发布');
}

function testRule(): void {
  testDialogVisible.value = false;
  submitAction('规则仿真通过，已生成测试日志');
}

function publishRule(): void {
  selectedRule.value.status = '启用';
  publishDialogVisible.value = false;
  submitAction('规则已发布启用，后续命中会进入执行日志');
}
</script>

<template>
  <section class="rule-config-page">
    <el-card class="rule-work-card" shadow="never">
      <template #header>
        <div class="rule-header">
          <div>
            <h2>规则配置与质量改进</h2>
            <p>配置智能诊断、任务、提醒、疗效、预警、CQI 和数据流转规则，发布前先仿真，发布后记录执行日志。</p>
          </div>
          <div class="rule-actions">
            <el-button type="primary" :icon="DocumentAdd" @click="editDialogVisible = true">新增规则</el-button>
            <el-button :icon="Operation" @click="testDialogVisible = true">仿真测试</el-button>
            <el-button :icon="SwitchButton" @click="publishDialogVisible = true">发布启用</el-button>
            <el-button :icon="Connection" @click="logDrawerVisible = true">执行日志</el-button>
          </div>
        </div>
      </template>

      <el-form class="rule-filter" inline>
        <el-form-item label="规则类型">
          <el-select placeholder="全部类型" clearable>
            <el-option label="智能诊断" value="diagnosis" />
            <el-option label="工作任务" value="task" />
            <el-option label="消息提醒" value="message" />
            <el-option label="疗效方案" value="effect" />
            <el-option label="预警事件" value="warning" />
            <el-option label="CQI方案" value="cqi" />
            <el-option label="数据流转" value="flow" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select placeholder="全部状态" clearable>
            <el-option label="启用" value="enabled" />
            <el-option label="草稿" value="draft" />
            <el-option label="停用" value="disabled" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键字">
          <el-input placeholder="规则名称、条件、目标工作站" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>

      <div class="rule-stat-grid">
        <el-card v-for="item in metrics" :key="item.label" :class="['rule-stat-card', item.tone]" shadow="never">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </el-card>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :xl="16">
          <el-card class="rule-main-card" shadow="never">
            <template #header>
              <div class="rule-card-header">
                <div>
                  <strong>规则方案列表</strong>
                  <p>示例数据不少于 10 条，规则发布后必须能影响具体工作站待办、预警、报表或 CQI 流程。</p>
                </div>
                <el-tag type="primary" effect="plain">定义 -> 仿真 -> 发布 -> 命中 -> 日志回写</el-tag>
              </div>
            </template>
            <el-table :data="rules" border stripe highlight-current-row row-key="id" @row-click="selectRule">
              <el-table-column prop="type" label="类型" width="110" fixed="left" />
              <el-table-column prop="name" label="规则名称" min-width="165" />
              <el-table-column prop="trigger" label="触发时机" min-width="140" />
              <el-table-column prop="condition" label="条件" min-width="190" />
              <el-table-column prop="action" label="动作" min-width="210" />
              <el-table-column prop="target" label="目标" min-width="150" />
              <el-table-column prop="priority" label="优先级" width="85">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.priority)">{{ row.priority }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="85">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.status)">{{ row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="hitCount" label="命中" width="80" />
              <el-table-column prop="owner" label="维护方" min-width="120" />
              <el-table-column prop="nextAction" label="下一步" min-width="120" />
              <el-table-column label="操作" width="220" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click.stop="selectRule(row); editDialogVisible = true">编辑</el-button>
                  <el-button link @click.stop="selectRule(row); testDialogVisible = true">测试</el-button>
                  <el-button link @click.stop="selectRule(row); publishDialogVisible = true">发布</el-button>
                  <el-button link @click.stop="selectRule(row); logDrawerVisible = true">日志</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>

        <el-col :xs="24" :xl="8">
          <el-card class="rule-side-card" shadow="never">
            <template #header>
              <div class="rule-card-header">
                <strong>当前规则闭环</strong>
                <el-tag :type="tagType(selectedRule.status)">{{ selectedRule.status }}</el-tag>
              </div>
            </template>
            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="规则">{{ selectedRule.name }}</el-descriptions-item>
              <el-descriptions-item label="条件">{{ selectedRule.condition }}</el-descriptions-item>
              <el-descriptions-item label="动作">{{ selectedRule.action }}</el-descriptions-item>
              <el-descriptions-item label="目标">{{ selectedRule.target }}</el-descriptions-item>
            </el-descriptions>
            <div class="rule-check-list">
              <div v-for="item in closureChecks" :key="item.label" class="rule-check-row">
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
                <el-icon :class="{ pass: item.pass, block: !item.pass }">
                  <CircleCheck v-if="item.pass" />
                  <Warning v-else />
                </el-icon>
              </div>
            </div>
            <div class="rule-quick-actions">
              <el-button type="primary" @click="testDialogVisible = true">仿真测试</el-button>
              <el-button @click="publishDialogVisible = true">发布启用</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="rule-workspace-card" shadow="never">
      <template #header>
        <div class="rule-card-header">
          <div>
            <strong>仿真场景与执行结果</strong>
            <p>发布前使用真实业务样例验证触发条件、动作、目标工作站和日志写入，避免误报或漏报。</p>
          </div>
          <el-button type="primary" :icon="Operation" @click="testDialogVisible = true">运行仿真</el-button>
        </div>
      </template>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="仿真样例" name="diagnosis">
          <el-table :data="scenarioRows" border stripe>
            <el-table-column prop="source" label="样例来源" min-width="150" />
            <el-table-column prop="input" label="输入数据" min-width="160" />
            <el-table-column prop="rule" label="命中规则" min-width="170" />
            <el-table-column prop="result" label="预期结果" min-width="190" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="tagType(row.status)">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="执行日志" name="flow">
          <el-table :data="logs" border stripe>
            <el-table-column prop="time" label="时间" min-width="150" />
            <el-table-column prop="rule" label="规则" min-width="170" />
            <el-table-column prop="source" label="来源记录" min-width="150" />
            <el-table-column prop="result" label="结果" min-width="170" />
            <el-table-column prop="receiver" label="接收方" width="130" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="tagType(row.status)">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog v-model="editDialogVisible" title="规则配置" width="720px">
      <el-form label-width="110px">
        <el-form-item label="规则名称">
          <el-input :model-value="selectedRule.name" />
        </el-form-item>
        <el-form-item label="触发时机">
          <el-input :model-value="selectedRule.trigger" />
        </el-form-item>
        <el-form-item label="条件表达式">
          <el-input type="textarea" :rows="3" :model-value="selectedRule.condition" />
        </el-form-item>
        <el-form-item label="动作">
          <el-input type="textarea" :rows="3" :model-value="selectedRule.action" />
        </el-form-item>
        <el-form-item label="目标工作站">
          <el-input :model-value="selectedRule.target" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRule">保存配置</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="testDialogVisible" title="规则仿真测试" width="680px">
      <el-form label-width="110px">
        <el-form-item label="测试样例">
          <el-select model-value="lab">
            <el-option label="血钾危急值样例" value="lab" />
            <el-option label="Kt/V 不达标样例" value="ktv" />
            <el-option label="水质异常样例" value="water" />
            <el-option label="感控事件样例" value="infection" />
          </el-select>
        </el-form-item>
        <el-form-item label="预期动作">
          <el-input :model-value="selectedRule.action" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="testDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="testRule">运行测试</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="publishDialogVisible" title="发布启用规则" width="620px">
      <el-alert type="warning" show-icon :closable="false" title="规则发布会影响实际待办、预警和数据流转，发布前应完成仿真测试并确认责任工作站。" />
      <el-form class="dialog-form" label-width="110px">
        <el-form-item label="规则">
          <el-input :model-value="selectedRule.name" />
        </el-form-item>
        <el-form-item label="发布说明">
          <el-input type="textarea" :rows="3" placeholder="记录变更原因、审批人、影响范围和回滚方式" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="publishDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="publishRule">确认发布</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="logDrawerVisible" title="规则执行日志" size="620px">
      <el-table :data="logs" border stripe>
        <el-table-column prop="time" label="时间" min-width="150" />
        <el-table-column prop="rule" label="规则" min-width="170" />
        <el-table-column prop="source" label="来源" min-width="150" />
        <el-table-column prop="result" label="执行结果" min-width="170" />
        <el-table-column prop="receiver" label="接收方" width="130" />
        <el-table-column prop="status" label="状态" width="95">
          <template #default="{ row }">
            <el-tag :type="tagType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
  </section>
</template>
