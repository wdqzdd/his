<script setup lang="ts">
import { computed } from 'vue';
import {
  Bell,
  CircleCheck,
  DataAnalysis,
  FirstAidKit,
  Monitor,
  Operation,
  Warning,
} from '@element-plus/icons-vue';
import type { PageContext } from '../types';

const props = defineProps<{
  context: PageContext;
}>();

const todayRows = [
  { bed: 'A区-08', patient: '王建国', shift: '上午班', status: '治疗中', access: '自体动静脉内瘘', plan: 'HD 4h / 低分子肝素', nurse: '周敏', next: '10:40 复测血压' },
  { bed: 'A区-12', patient: '李秀兰', shift: '上午班', status: '待上机', access: '长期导管', plan: 'HDF 4h / 无肝素', nurse: '赵玲', next: '透前评估待确认' },
  { bed: 'B区-03', patient: '陈志强', shift: '中午班', status: '已下机', access: '移植物内瘘', plan: 'HD 3.5h / 常规抗凝', nurse: '孙涛', next: '治疗小结待归档' },
  { bed: 'C区-16', patient: '刘桂英', shift: '下午班', status: '未签到', access: '自体动静脉内瘘', plan: 'HD 4h / 常规抗凝', nurse: '吴倩', next: '导诊电话确认' },
];

const warningRows = [
  { patient: '王建国', category: '透前血压', level: '高', value: '196/102 mmHg', source: '护士站', owner: '医生站', status: '处理中' },
  { patient: '赵明', category: '危急值', level: '高', value: 'K+ 6.4 mmol/L', source: '检验接口', owner: '主诊医生', status: '待确认' },
  { patient: '李秀兰', category: '通路感染', level: '中', value: '导管出口红肿', source: '透前评估', owner: '护理组长', status: '已记录' },
  { patient: '陈志强', category: '低血压事件', level: '中', value: '92/54 mmHg', source: '治疗监测', owner: '值班医生', status: '已闭环' },
];

const taskRows = [
  { task: '待审核医嘱', count: 21, role: '医生站', deadline: '今日 12:00', risk: '影响上机核对', status: '待处理' },
  { task: '护理记录补全', count: 28, role: '护士站', deadline: '本班次结束前', risk: '影响治疗归档', status: '处理中' },
  { task: '治疗小结归档', count: 16, role: '医生站', deadline: '今日 18:00', risk: '影响病历完整性', status: '待处理' },
  { task: '设备巡检复核', count: 5, role: '技师与设备站', deadline: '今日 10:30', risk: '影响设备放行', status: '处理中' },
  { task: '库存预警处理', count: 7, role: '药耗管理', deadline: '今日 16:00', risk: '影响次日排班', status: '待处理' },
];

const deviceRows = [
  { zone: 'A区', item: '水处理系统 A', metric: '电导率', value: '9.8 μS/cm', status: '待复核', time: '07:20', owner: '技师' },
  { zone: 'B区', item: 'HD-08 透析机', metric: '静脉压报警', value: '连续 2 次', status: '处理中', time: '09:15', owner: '技师' },
  { zone: 'C区', item: '配液系统', metric: '消毒记录', value: '已完成', status: '正常', time: '06:55', owner: '护士' },
  { zone: 'A区', item: 'HD-21 透析机', metric: '维护到期', value: '剩余 2 天', status: '待安排', time: '10:00', owner: '技师' },
];

const dashboardCards = computed(() => {
  if (props.context.menuKey === 'board-today') {
    return [
      { label: '排班患者', value: '132', unit: '人', tone: 'blue' },
      { label: '已签到', value: '118', unit: '人', tone: 'green' },
      { label: '治疗中', value: '48', unit: '人', tone: 'blue' },
      { label: '未签到', value: '14', unit: '人', tone: 'orange' },
    ];
  }
  if (props.context.menuKey === 'board-warning') {
    return [
      { label: '未闭环预警', value: '18', unit: '条', tone: 'red' },
      { label: '危急值', value: '3', unit: '条', tone: 'red' },
      { label: '高风险患者', value: '7', unit: '人', tone: 'orange' },
      { label: '已闭环', value: '42', unit: '条', tone: 'green' },
    ];
  }
  if (props.context.menuKey === 'board-task') {
    return [
      { label: '今日待办', value: '77', unit: '项', tone: 'blue' },
      { label: '临近超时', value: '12', unit: '项', tone: 'orange' },
      { label: '跨角色协同', value: '9', unit: '项', tone: 'purple' },
      { label: '已完成', value: '146', unit: '项', tone: 'green' },
    ];
  }
  return [
    { label: '运行设备', value: '64', unit: '台', tone: 'blue' },
    { label: '水质复核', value: '1', unit: '项', tone: 'orange' },
    { label: '设备异常', value: '2', unit: '台', tone: 'red' },
    { label: '维护到期', value: '5', unit: '台', tone: 'purple' },
  ];
});

const pageLead = computed(() => {
  const map: Record<string, string> = {
    'board-today': '按班次、分区、机位聚合今日透析执行状态，突出未签到、待上机、治疗中和待归档患者。',
    'board-warning': '集中呈现危急值、透析事件、通路风险和院感风险，便于科室负责人跟踪闭环。',
    'board-task': '按角色汇总医生、护士、技师、导诊和药耗相关待办，优先处理临近超时事项。',
    'board-device': '展示透析机、水处理、配液和维护复核状态，把设备风险放在治疗调度之前处理。',
  };
  return map[props.context.menuKey] ?? map['board-today'];
});

const rows = computed(() => {
  if (props.context.menuKey === 'board-warning') return warningRows;
  if (props.context.menuKey === 'board-task') return taskRows;
  if (props.context.menuKey === 'board-device') return deviceRows;
  return todayRows;
});

const tableMode = computed(() => props.context.menuKey);

</script>

<template>
  <section class="board-workpage">
    <el-card class="board-toolbar-card" shadow="never">
      <div class="board-toolbar-title">
        <h2>{{ context.menuTitle }}</h2>
        <span>{{ pageLead }}</span>
      </div>
      <el-form class="board-top-filter" inline>
        <el-form-item label="日期">
          <el-date-picker type="date" placeholder="今日" />
        </el-form-item>
        <el-form-item label="分区">
          <el-select placeholder="全部分区" clearable>
            <el-option label="A区" value="a" />
            <el-option label="B区" value="b" />
            <el-option label="C区" value="c" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select placeholder="全部状态" clearable>
            <el-option label="待处理" value="pending" />
            <el-option label="处理中" value="doing" />
            <el-option label="已闭环" value="done" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="DataAnalysis">刷新</el-button>
          <el-button plain :icon="Operation">配置视图</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="board-page-stats">
      <el-card v-for="item in dashboardCards" :key="item.label" :class="['board-stat', item.tone]" shadow="never">
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}<small>{{ item.unit }}</small></strong>
      </el-card>
    </div>

    <el-row :gutter="16">
      <el-col :xs="24" :xl="17">
        <el-card class="board-data-card" shadow="never">
          <template #header>
            <div class="board-card-header">
              <strong>{{ context.menuTitle }}明细</strong>
              <div>
                <el-button text type="primary">导出</el-button>
                <el-button type="primary" plain>批量处理</el-button>
              </div>
            </div>
          </template>

          <el-table v-if="tableMode === 'board-today'" :data="rows" border stripe>
            <el-table-column prop="bed" label="机位" width="100" />
            <el-table-column prop="patient" label="患者" width="110" />
            <el-table-column prop="shift" label="班次" width="100" />
            <el-table-column prop="status" label="状态" width="110">
              <template #default="{ row }">
                <el-tag :type="row.status === '治疗中' ? 'primary' : row.status === '已下机' ? 'success' : row.status === '未签到' ? 'danger' : 'warning'">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="access" label="血管通路" min-width="150" />
            <el-table-column prop="plan" label="透析方案" min-width="170" />
            <el-table-column prop="nurse" label="责任护士" width="110" />
            <el-table-column prop="next" label="下一步" min-width="150" />
          </el-table>

          <el-table v-else-if="tableMode === 'board-warning'" :data="rows" border stripe>
            <el-table-column prop="patient" label="患者" width="110" />
            <el-table-column prop="category" label="预警类型" width="120" />
            <el-table-column prop="level" label="级别" width="90">
              <template #default="{ row }">
                <el-tag :type="row.level === '高' ? 'danger' : 'warning'">{{ row.level }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="value" label="异常值 / 事件" min-width="160" />
            <el-table-column prop="source" label="来源" width="120" />
            <el-table-column prop="owner" label="责任方" width="120" />
            <el-table-column prop="status" label="闭环状态" width="120" />
          </el-table>

          <el-table v-else-if="tableMode === 'board-task'" :data="rows" border stripe>
            <el-table-column prop="task" label="待办事项" min-width="160" />
            <el-table-column prop="count" label="数量" width="90" />
            <el-table-column prop="role" label="责任工作站" width="140" />
            <el-table-column prop="deadline" label="截止时间" min-width="140" />
            <el-table-column prop="risk" label="影响" min-width="160" />
            <el-table-column prop="status" label="状态" width="110" />
          </el-table>

          <el-table v-else :data="rows" border stripe>
            <el-table-column prop="zone" label="区域" width="90" />
            <el-table-column prop="item" label="设备 / 系统" min-width="150" />
            <el-table-column prop="metric" label="监测项" width="120" />
            <el-table-column prop="value" label="当前值" min-width="130" />
            <el-table-column prop="status" label="状态" width="110">
              <template #default="{ row }">
                <el-tag :type="row.status === '正常' ? 'success' : row.status === '处理中' ? 'warning' : 'danger'">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="time" label="时间" width="100" />
            <el-table-column prop="owner" label="责任人" width="100" />
          </el-table>
        </el-card>
      </el-col>

      <el-col :xs="24" :xl="7">
        <el-card class="board-side-card" shadow="never">
          <template #header>
            <strong>重点提醒</strong>
          </template>
          <div class="board-alert-line danger">
            <el-icon><Warning /></el-icon>
            <span>危急值、设备异常、水质异常需要记录处理人、时间和复核结果。</span>
          </div>
          <div class="board-alert-line">
            <el-icon><CircleCheck /></el-icon>
            <span>治疗执行、医嘱审核、护理记录和归档状态均应支持审计追溯。</span>
          </div>
          <div class="board-alert-line">
            <el-icon><Bell /></el-icon>
            <span>跨角色待办应在顶部工作站和左侧菜单切换后保持同一任务上下文。</span>
          </div>
        </el-card>

        <el-card class="board-side-card" shadow="never">
          <template #header>
            <strong>今日质量关注</strong>
          </template>
          <div class="board-quality-row">
            <span>Kt/V达标率</span>
            <strong>91.8%</strong>
          </div>
          <div class="board-quality-row">
            <span>低血压事件</span>
            <strong>4</strong>
          </div>
          <div class="board-quality-row">
            <span>通路感染事件</span>
            <strong>0</strong>
          </div>
          <div class="board-quality-row">
            <span>水质复核完成率</span>
            <strong>96%</strong>
          </div>
        </el-card>
      </el-col>
    </el-row>

  </section>
</template>
