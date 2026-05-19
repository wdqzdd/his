<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  Bell,
  CircleCheck,
  DataAnalysis,
  DocumentChecked,
  Download,
  EditPen,
  FullScreen,
  RefreshRight,
  Search,
  Warning,
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{
  context: PageContext;
}>();

type DashboardTone = 'blue' | 'green' | 'orange' | 'red';
type MetricGroup = 'treatment' | 'risk' | 'task' | 'device' | 'quality';

const router = useRouter();
const activeMetric = ref('todayDialysis');
const patientDrawerVisible = ref(false);
const warningDialogVisible = ref(false);
const taskDialogVisible = ref(false);
const deviceDialogVisible = ref(false);
const selectedPatient = ref<Record<string, string> | null>(null);
const selectedWarning = ref<Record<string, string> | null>(null);
const selectedTask = ref<Record<string, string> | null>(null);
const selectedDevice = ref<Record<string, string> | null>(null);

const metrics: Array<{
  key: string;
  label: string;
  value: string;
  unit: string;
  tone: DashboardTone;
  group: MetricGroup;
  routeTarget: string;
  hint: string;
}> = [
  { key: 'todayDialysis', label: '今日透析人数', value: '132', unit: '人', tone: 'blue', group: 'treatment', routeTarget: 'board-today', hint: '来自 treatment_session' },
  { key: 'scheduled', label: '今日排班人数', value: '138', unit: '人', tone: 'blue', group: 'treatment', routeTarget: 'board-today', hint: '来自 dialysis_schedule' },
  { key: 'checkedIn', label: '已签到人数', value: '118', unit: '人', tone: 'green', group: 'treatment', routeTarget: 'board-today', hint: '签到记录已生成' },
  { key: 'notCheckedIn', label: '未签到人数', value: '20', unit: '人', tone: 'orange', group: 'treatment', routeTarget: 'board-today', hint: '导诊需确认' },
  { key: 'onMachine', label: '已上机人数', value: '86', unit: '人', tone: 'blue', group: 'treatment', routeTarget: 'board-today', hint: '上机核对已完成' },
  { key: 'treating', label: '治疗中人数', value: '48', unit: '人', tone: 'blue', group: 'treatment', routeTarget: 'board-today', hint: '透中监测进行中' },
  { key: 'offMachine', label: '已下机人数', value: '38', unit: '人', tone: 'green', group: 'treatment', routeTarget: 'board-today', hint: '等待透后评估或归档' },
  { key: 'temporary', label: '临时加透人数', value: '5', unit: '人', tone: 'orange', group: 'treatment', routeTarget: 'guide-schedule', hint: '需确认机位和处方' },
  { key: 'absent', label: '缺席人数', value: '14', unit: '人', tone: 'red', group: 'treatment', routeTarget: 'guide-schedule', hint: '需登记原因' },
  { key: 'makeup', label: '补透人数', value: '6', unit: '人', tone: 'orange', group: 'treatment', routeTarget: 'guide-schedule', hint: '来自 schedule_change_log' },
  { key: 'bedUtilization', label: '机位使用率', value: '88', unit: '%', tone: 'green', group: 'device', routeTarget: 'board-device', hint: '分区班次综合利用率' },
  { key: 'warningPatients', label: '今日预警患者', value: '18', unit: '人', tone: 'red', group: 'risk', routeTarget: 'board-warning', hint: '未闭环风险患者' },
  { key: 'criticalValues', label: '今日危急值', value: '3', unit: '条', tone: 'red', group: 'risk', routeTarget: 'board-warning', hint: 'LIS/手工报告触发' },
  { key: 'orderReview', label: '待审核医嘱', value: '21', unit: '条', tone: 'orange', group: 'task', routeTarget: 'board-task', hint: '影响上机核对' },
  { key: 'orderExecute', label: '待执行医嘱', value: '36', unit: '条', tone: 'orange', group: 'task', routeTarget: 'board-task', hint: '护士/药师执行计划' },
  { key: 'nursingRecord', label: '待完成护理记录', value: '28', unit: '份', tone: 'orange', group: 'task', routeTarget: 'board-task', hint: '影响治疗归档' },
  { key: 'summary', label: '待完成治疗小结', value: '16', unit: '份', tone: 'orange', group: 'task', routeTarget: 'board-task', hint: '医生签名前置' },
  { key: 'deviceAbnormal', label: '设备异常', value: '2', unit: '台', tone: 'red', group: 'device', routeTarget: 'board-device', hint: '影响上机放行' },
  { key: 'waterAbnormal', label: '水质异常', value: '1', unit: '项', tone: 'red', group: 'device', routeTarget: 'board-device', hint: '需复测关闭' },
  { key: 'stockWarning', label: '药品耗材库存预警', value: '7', unit: '项', tone: 'orange', group: 'task', routeTarget: 'stock-drug-warning', hint: '药耗管理待处理' },
  { key: 'quality', label: '科室质量指标', value: '4', unit: '项', tone: 'red', group: 'quality', routeTarget: 'report-quality', hint: '低于目标需改进' },
  { key: 'todo', label: '今日待办汇总', value: '77', unit: '项', tone: 'blue', group: 'task', routeTarget: 'board-task', hint: '跨角色任务池' },
];

const patientRows = [
  { bed: 'A08', patient: '王建国', gender: '男', age: '62', shift: '上午班', status: '治疗中', mode: 'HD 4h', access: '自体动静脉内瘘', doctor: '张明', nurse: '周敏', next: '10:40 复测血压', risk: '透前血压高' },
  { bed: 'A12', patient: '李秀兰', gender: '女', age: '58', shift: '上午班', status: '待上机', mode: 'HDF 4h', access: '长期导管', doctor: '陈宁', nurse: '赵玲', next: '透前评估确认', risk: '无肝素处方' },
  { bed: 'B03', patient: '陈志强', gender: '男', age: '71', shift: '中午班', status: '已下机', mode: 'HD 3.5h', access: '移植物内瘘', doctor: '张明', nurse: '孙涛', next: '治疗小结归档', risk: '低血压事件' },
  { bed: 'B09', patient: '赵明', gender: '男', age: '49', shift: '中午班', status: '待医生处理', mode: 'HD 4h', access: '自体动静脉内瘘', doctor: '王主任', nurse: '赵玲', next: '处理危急值K+', risk: '危急值' },
  { bed: 'C16', patient: '刘桂英', gender: '女', age: '67', shift: '下午班', status: '未签到', mode: 'HD 4h', access: '自体动静脉内瘘', doctor: '陈宁', nurse: '吴倩', next: '导诊电话确认', risk: '缺席风险' },
  { bed: 'I03', patient: '黄立军', gender: '男', age: '54', shift: '下午班', status: '待上机', mode: 'HD 4h', access: '长期导管', doctor: '张明', nurse: '孙涛', next: '隔离机位核对', risk: '乙肝隔离' },
  { bed: '急备01', patient: '马丽', gender: '女', age: '45', shift: '中午班', status: '临时加透', mode: 'HD 3h', access: '自体动静脉内瘘', doctor: '刘主任', nurse: '郑护士', next: '医生确认处方', risk: '容量负荷高' },
  { bed: 'A10', patient: '吴海', gender: '男', age: '60', shift: '上午班', status: '补透待确认', mode: 'HD 4h', access: '自体动静脉内瘘', doctor: '陈宁', nurse: '周敏', next: '确认补透机位', risk: '请假后补透' },
  { bed: 'B15', patient: '潘德胜', gender: '男', age: '69', shift: '下午班', status: '待上机', mode: 'HD 4h', access: '右颈长期导管', doctor: '张明', nurse: '陆护士', next: '双人核对', risk: '跌倒风险' },
  { bed: 'C02', patient: '郭强', gender: '男', age: '55', shift: '夜班', status: '待归档', mode: 'HD+HP', access: '股静脉临时导管', doctor: '陈宁', nurse: '谢护士', next: '补治疗小结', risk: '充分性未达标' },
];

const warningRows = [
  { patient: '赵明', type: '危急值', level: '高', value: 'K+ 6.4 mmol/L', source: 'LIS', owner: '王主任', status: '待确认', limit: '30分钟内', next: '医生记录处置' },
  { patient: '王建国', type: '透前血压', level: '高', value: '196/102 mmHg', source: '护士站', owner: '张明', status: '处理中', limit: '本班次', next: '复测并调整处方' },
  { patient: '陈志强', type: '透中低血压', level: '中', value: '92/54 mmHg', source: '治疗记录', owner: '值班医生', status: '待复核', limit: '下机前', next: '复核处理结果' },
  { patient: '李秀兰', type: '通路感染风险', level: '中', value: '导管出口红肿', source: '透前评估', owner: '护理组长', status: '已记录', limit: '24小时', next: '生成通路复评' },
  { patient: '郭强', type: '充分性不达标', level: '中', value: 'Kt/V 1.18', source: '质控规则', owner: '陈宁', status: '待处理', limit: '48小时', next: '调整透析处方' },
  { patient: '刘桂英', type: '缺席风险', level: '低', value: '连续2次迟到', source: '签到', owner: '导诊台', status: '待联系', limit: '今日', next: '电话确认' },
  { patient: '黄立军', type: '隔离核对', level: '高', value: '乙肝分区不匹配', source: '排班', owner: '护士长', status: '待调整', limit: '上机前', next: '调床复核' },
  { patient: '吴海', type: '补透处方', level: '中', value: '补透无最新处方', source: '排班', owner: '医生站', status: '待补充', limit: '上机前', next: '补处方' },
  { patient: '潘德胜', type: '跌倒风险', level: '中', value: '评分高', source: '护理评估', owner: '责任护士', status: '处理中', limit: '本班次', next: '宣教签名' },
  { patient: '马丽', type: '容量负荷', level: '高', value: '体重较干体重+4.2kg', source: '体重秤', owner: '刘主任', status: '待确认', limit: '上机前', next: '确认超滤目标' },
];

const taskRows = [
  { title: '待审核医嘱', count: '21', role: '医生站', owner: '张明', deadline: '今日 12:00', status: '待处理', impact: '影响上机核对' },
  { title: '待执行医嘱', count: '36', role: '护士站/药房站', owner: '周敏', deadline: '本班次执行前', status: '待执行', impact: '影响治疗记录' },
  { title: '护理记录补全', count: '28', role: '护士站', owner: '周敏', deadline: '本班次结束前', status: '处理中', impact: '影响治疗归档' },
  { title: '治疗小结归档', count: '16', role: '医生站', owner: '陈宁', deadline: '今日 18:00', status: '待处理', impact: '影响病历完整性' },
  { title: '库存预警处理', count: '7', role: '药耗管理', owner: '库房', deadline: '今日 16:00', status: '待处理', impact: '影响次日排班' },
  { title: '危急值确认', count: '3', role: '医生站', owner: '值班医生', deadline: '30分钟内', status: '超时风险', impact: '医疗安全' },
  { title: '设备复测任务', count: '4', role: '技师与设备站', owner: '许工', deadline: '上机前', status: '待复核', impact: '影响设备放行' },
  { title: '缺席患者联系', count: '14', role: '导诊台', owner: '沈洁', deadline: '今日 15:00', status: '待联系', impact: '影响补透安排' },
  { title: '签名待确认', count: '11', role: '医生/护士/患者', owner: '科室秘书', deadline: '归档前', status: '待签名', impact: '影响审计闭环' },
  { title: 'CQI复查', count: '5', role: '质控员', owner: '护士长', deadline: '本周五', status: '待复查', impact: '影响质量指标' },
];

const deviceRows = [
  { zone: 'A区', item: '水处理系统A', metric: '电导率', value: '9.8 μS/cm', status: '待复核', owner: '许工', time: '07:20', next: '复测水质' },
  { zone: 'B区', item: 'HD-08透析机', metric: '静脉压报警', value: '连续2次', status: '处理中', owner: '许工', time: '09:15', next: '维修复核' },
  { zone: 'A区', item: 'HD-21透析机', metric: '维护到期', value: '剩余2天', status: '待安排', owner: '设备组', time: '10:00', next: '安排保养' },
  { zone: 'C区', item: '配液系统', metric: '消毒记录', value: '已完成', status: '正常', owner: '吴倩', time: '06:55', next: '放行' },
  { zone: '隔离区', item: 'HD-33透析机', metric: '终末消毒', value: '待复核', status: '待复核', owner: '孙涛', time: '09:40', next: '护士复核' },
  { zone: 'A区', item: '体重秤A2', metric: '联机状态', value: '离线8分钟', status: '异常', owner: '接口管理员', time: '10:12', next: '重连采集' },
  { zone: 'B区', item: 'RO-B回路', metric: '余氯', value: '0.08 mg/L', status: '正常', owner: '许工', time: '08:10', next: '继续监测' },
  { zone: 'C区', item: 'HD-42透析机', metric: '电导率采集', value: '接口延迟', status: '关注', owner: '设备组', time: '10:26', next: '核对联机' },
  { zone: '急诊区', item: '备用机位01', metric: '放行状态', value: '待巡检', status: '待处理', owner: '许工', time: '10:30', next: '巡检放行' },
  { zone: '水机房', item: '内毒素检测', metric: '本周送检', value: '已采样', status: '待报告', owner: '检验科', time: '09:00', next: '回填报告' },
];

const qualityRows = [
  { indicator: 'Kt/V达标率', value: '91.8%', target: '≥95%', status: '低于目标', owner: '医生站', next: '生成充分性CQI' },
  { indicator: '血红蛋白达标率', value: '83.2%', target: '≥85%', status: '关注', owner: '医生站', next: '复查贫血方案' },
  { indicator: '低血压事件', value: '4例', target: '持续下降', status: '异常', owner: '护士站', next: '护理复盘' },
  { indicator: '水质复核完成率', value: '96%', target: '100%', status: '关注', owner: '技师站', next: '补齐复核' },
  { indicator: '治疗记录按时归档率', value: '88%', target: '≥95%', status: '异常', owner: '医生/护士', next: '催办签名' },
];

const shiftRows = [
  { zone: 'A区', shift: '上午班', scheduled: 44, checked: 41, onMachine: 36, treating: 22, off: 14, absent: 3, utilization: '88%' },
  { zone: 'B区', shift: '中午班', scheduled: 38, checked: 34, onMachine: 26, treating: 18, off: 8, absent: 4, utilization: '81%' },
  { zone: 'C区', shift: '下午班', scheduled: 42, checked: 35, onMachine: 8, treating: 8, off: 0, absent: 7, utilization: '74%' },
  { zone: '隔离区', shift: '下午班', scheduled: 8, checked: 8, onMachine: 5, treating: 5, off: 0, absent: 0, utilization: '100%' },
  { zone: '急诊备用区', shift: '中午班', scheduled: 6, checked: 5, onMachine: 3, treating: 3, off: 0, absent: 1, utilization: '67%' },
];

const operationLogs = [
  { time: '10:36', text: '赵明危急值已推送王主任，等待确认', type: 'danger' },
  { time: '10:28', text: 'A区12号患者透前评估已补全', type: 'success' },
  { time: '10:05', text: 'HD-08透析机报警，设备组处理中', type: 'warning' },
  { time: '09:42', text: '上午班38人完成上机核对', type: 'primary' },
  { time: '09:10', text: '库存预警生成补货任务7项', type: 'warning' },
];

const selectedMetric = computed(() => metrics.find((item) => item.key === activeMetric.value) ?? metrics[0]);

const filteredPatients = computed(() => {
  if (activeMetric.value === 'notCheckedIn' || activeMetric.value === 'absent') return patientRows.filter((item) => item.status === '未签到');
  if (activeMetric.value === 'treating') return patientRows.filter((item) => item.status === '治疗中' || item.status === '待医生处理');
  if (activeMetric.value === 'offMachine') return patientRows.filter((item) => item.status === '已下机' || item.status === '待归档');
  if (activeMetric.value === 'temporary') return patientRows.filter((item) => item.status === '临时加透');
  if (activeMetric.value === 'makeup') return patientRows.filter((item) => item.status === '补透待确认');
  return patientRows;
});

const visiblePanel = computed(() => selectedMetric.value.group);

function metricTagType(tone: DashboardTone) {
  if (tone === 'green') return 'success';
  if (tone === 'orange') return 'warning';
  if (tone === 'red') return 'danger';
  return 'primary';
}

function stateTagType(value: string) {
  if (['正常', '已完成', '已记录', '放行'].some((item) => value.includes(item))) return 'success';
  if (['异常', '高', '超时', '危急', '低于目标'].some((item) => value.includes(item))) return 'danger';
  if (['待', '处理中', '关注', '风险'].some((item) => value.includes(item))) return 'warning';
  return 'info';
}

function goTo(menuKey: string): void {
  router.push(`/workspace/${encodeURIComponent(props.context.workspace)}/${menuKey}`);
}

function openPatient(row: Record<string, string>): void {
  selectedPatient.value = row;
  patientDrawerVisible.value = true;
}

function openWarning(row: Record<string, string>): void {
  selectedWarning.value = row;
  warningDialogVisible.value = true;
}

function openTask(row: Record<string, string>): void {
  selectedTask.value = row;
  taskDialogVisible.value = true;
}

function openDevice(row: Record<string, string>): void {
  selectedDevice.value = row;
  deviceDialogVisible.value = true;
}

function saveAction(message: string, close: () => void): void {
  close();
  ElMessage.success(message);
}
</script>

<template>
  <section class="department-dashboard">
    <el-card class="dashboard-toolbar-card" shadow="never">
      <div class="dashboard-title">
        <h2>科室运营看板</h2>
        <span>2026-05-14 10:40 自动刷新 · {{ props.context.department }} · {{ props.context.role }}</span>
      </div>
      <el-form class="dashboard-toolbar" inline>
        <el-form-item label="日期">
          <el-date-picker type="date" placeholder="今日" />
        </el-form-item>
        <el-form-item label="班次">
          <el-select placeholder="全部班次" clearable>
            <el-option label="上午班" value="am" />
            <el-option label="中午班" value="noon" />
            <el-option label="下午班" value="pm" />
            <el-option label="夜班" value="night" />
          </el-select>
        </el-form-item>
        <el-form-item label="分区">
          <el-select placeholder="全部分区" clearable>
            <el-option label="A区" value="a" />
            <el-option label="B区" value="b" />
            <el-option label="C区" value="c" />
            <el-option label="隔离区" value="iso" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">查询</el-button>
          <el-button :icon="RefreshRight">刷新</el-button>
          <el-button :icon="Download">日报</el-button>
          <el-button :icon="FullScreen">全屏</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="dashboard-stat-grid">
      <button
        v-for="item in metrics"
        :key="item.key"
        type="button"
        :class="['dashboard-stat-card', item.tone, { active: activeMetric === item.key }]"
        @click="activeMetric = item.key"
      >
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}<small>{{ item.unit }}</small></strong>
        <em>{{ item.hint }}</em>
      </button>
    </div>

    <el-card class="dashboard-panel" shadow="never">
      <template #header>
        <div class="panel-title">
          <div>
            <strong>{{ selectedMetric.label }}明细</strong>
            <small>点击指标后切换当前业务对象，进入对应菜单完成处理闭环。</small>
          </div>
          <div class="panel-actions">
            <el-tag :type="metricTagType(selectedMetric.tone)" effect="plain">{{ selectedMetric.value }}{{ selectedMetric.unit }}</el-tag>
            <el-button type="primary" plain @click="goTo(selectedMetric.routeTarget)">进入处理页</el-button>
          </div>
        </div>
      </template>

      <el-table v-if="visiblePanel === 'treatment'" :data="filteredPatients" border stripe>
        <el-table-column prop="bed" label="机位" width="85" fixed="left" />
        <el-table-column prop="patient" label="患者" width="100" />
        <el-table-column prop="gender" label="性别" width="70" />
        <el-table-column prop="age" label="年龄" width="70" />
        <el-table-column prop="shift" label="班次" width="95" />
        <el-table-column prop="status" label="治疗状态" width="120">
          <template #default="{ row }">
            <el-tag :type="stateTagType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="mode" label="模式" width="110" />
        <el-table-column prop="access" label="血管通路" min-width="150" />
        <el-table-column prop="doctor" label="医生" width="90" />
        <el-table-column prop="nurse" label="护士" width="90" />
        <el-table-column prop="next" label="下一步" min-width="150" />
        <el-table-column prop="risk" label="风险" min-width="130" />
        <el-table-column label="操作" width="190" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openPatient(row)">详情</el-button>
            <el-button link @click="goTo('board-today')">队列</el-button>
            <el-button link @click="goTo('nurse-treatment')">治疗记录</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-table v-else-if="visiblePanel === 'risk'" :data="warningRows" border stripe>
        <el-table-column prop="patient" label="患者" width="100" fixed="left" />
        <el-table-column prop="type" label="预警类型" width="130" />
        <el-table-column prop="level" label="级别" width="80">
          <template #default="{ row }">
            <el-tag :type="stateTagType(row.level)">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="异常值/事件" min-width="160" />
        <el-table-column prop="source" label="来源" width="110" />
        <el-table-column prop="owner" label="责任人" width="110" />
        <el-table-column prop="status" label="闭环状态" width="110" />
        <el-table-column prop="limit" label="时限" width="105" />
        <el-table-column prop="next" label="下一步" min-width="145" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openWarning(row)">处理</el-button>
            <el-button link @click="goTo('board-warning')">追溯</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-table v-else-if="visiblePanel === 'task'" :data="taskRows" border stripe>
        <el-table-column prop="title" label="待办事项" min-width="160" fixed="left" />
        <el-table-column prop="count" label="数量" width="80" />
        <el-table-column prop="role" label="责任工作站" width="140" />
        <el-table-column prop="owner" label="责任人" width="110" />
        <el-table-column prop="deadline" label="截止时间" min-width="130" />
        <el-table-column prop="status" label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="stateTagType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="impact" label="影响" min-width="150" />
        <el-table-column label="操作" width="165" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openTask(row)">催办</el-button>
            <el-button link @click="goTo('board-task')">待办页</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-table v-else-if="visiblePanel === 'device'" :data="deviceRows" border stripe>
        <el-table-column prop="zone" label="区域" width="90" fixed="left" />
        <el-table-column prop="item" label="设备/系统" min-width="150" />
        <el-table-column prop="metric" label="监测项" width="120" />
        <el-table-column prop="value" label="当前值" min-width="130" />
        <el-table-column prop="status" label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="stateTagType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="owner" label="责任人" width="100" />
        <el-table-column prop="time" label="时间" width="100" />
        <el-table-column prop="next" label="下一步" min-width="120" />
        <el-table-column label="操作" width="165" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openDevice(row)">复核</el-button>
            <el-button link @click="goTo('board-device')">设备页</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-table v-else :data="qualityRows" border stripe>
        <el-table-column prop="indicator" label="质量指标" min-width="150" fixed="left" />
        <el-table-column prop="value" label="当前值" width="105" />
        <el-table-column prop="target" label="目标" width="105" />
        <el-table-column prop="status" label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="stateTagType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="owner" label="责任工作站" width="130" />
        <el-table-column prop="next" label="下一步" min-width="150" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default>
            <el-button link type="primary" @click="goTo('doctor-quality')">生成CQI</el-button>
            <el-button link @click="goTo('report-quality')">报表</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-row :gutter="16">
      <el-col :xs="24" :xl="16">
        <el-card class="dashboard-panel" shadow="never">
          <template #header>
            <div class="panel-title">
              <strong>分区班次进度</strong>
              <el-button link type="primary" @click="goTo('guide-schedule')">进入排班排床</el-button>
            </div>
          </template>
          <el-table :data="shiftRows" border stripe>
            <el-table-column prop="zone" label="分区" width="100" />
            <el-table-column prop="shift" label="班次" width="100" />
            <el-table-column prop="scheduled" label="排班" />
            <el-table-column prop="checked" label="签到" />
            <el-table-column prop="onMachine" label="已上机" />
            <el-table-column prop="treating" label="治疗中" />
            <el-table-column prop="off" label="已下机" />
            <el-table-column prop="absent" label="缺席" />
            <el-table-column prop="utilization" label="机位使用率" />
          </el-table>
        </el-card>
      </el-col>

      <el-col :xs="24" :xl="8">
        <el-card class="dashboard-panel" shadow="never">
          <template #header>
            <div class="panel-title">
              <strong>高风险优先处理</strong>
              <el-tag type="danger" effect="plain">危急值/水质/设备</el-tag>
            </div>
          </template>
          <div class="dashboard-action-list">
            <button v-for="item in warningRows.slice(0, 5)" :key="`${item.patient}-${item.type}`" type="button" class="dashboard-action-item danger" @click="openWarning(item)">
              <span>{{ item.patient }} / {{ item.type }}</span>
              <strong>{{ item.value }}</strong>
              <small>{{ item.owner }} · {{ item.status }} · {{ item.limit }}</small>
            </button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :xs="24">
        <el-card class="dashboard-panel" shadow="never">
          <template #header>
            <strong>运行事件时间线</strong>
          </template>
          <el-timeline>
            <el-timeline-item v-for="item in operationLogs" :key="`${item.time}-${item.text}`" :timestamp="item.time" :type="item.type">
              {{ item.text }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>

    <el-drawer v-model="patientDrawerVisible" title="患者治疗详情" size="520px">
      <el-descriptions v-if="selectedPatient" :column="1" border>
        <el-descriptions-item label="患者">{{ selectedPatient.patient }} / {{ selectedPatient.gender }} / {{ selectedPatient.age }}岁</el-descriptions-item>
        <el-descriptions-item label="机位班次">{{ selectedPatient.bed }} / {{ selectedPatient.shift }}</el-descriptions-item>
        <el-descriptions-item label="治疗状态">{{ selectedPatient.status }}</el-descriptions-item>
        <el-descriptions-item label="透析模式">{{ selectedPatient.mode }}</el-descriptions-item>
        <el-descriptions-item label="血管通路">{{ selectedPatient.access }}</el-descriptions-item>
        <el-descriptions-item label="责任医护">{{ selectedPatient.doctor }} / {{ selectedPatient.nurse }}</el-descriptions-item>
        <el-descriptions-item label="下一步">{{ selectedPatient.next }}</el-descriptions-item>
      </el-descriptions>
      <div class="drawer-actions">
        <el-button type="primary" :icon="EditPen" @click="goTo('nurse-treatment')">打开治疗记录</el-button>
        <el-button :icon="DocumentChecked" @click="goTo('board-today')">查看追溯</el-button>
      </div>
    </el-drawer>

    <el-dialog v-model="warningDialogVisible" title="处理预警与危急值" width="600px">
      <el-descriptions v-if="selectedWarning" :column="1" border>
        <el-descriptions-item label="患者">{{ selectedWarning.patient }}</el-descriptions-item>
        <el-descriptions-item label="类型">{{ selectedWarning.type }} / {{ selectedWarning.level }}风险</el-descriptions-item>
        <el-descriptions-item label="异常值">{{ selectedWarning.value }}</el-descriptions-item>
        <el-descriptions-item label="来源">{{ selectedWarning.source }}</el-descriptions-item>
        <el-descriptions-item label="责任人">{{ selectedWarning.owner }}</el-descriptions-item>
      </el-descriptions>
      <el-form class="dialog-form" label-width="90px">
        <el-form-item label="处理意见">
          <el-input type="textarea" :rows="3" placeholder="记录处理措施、复核计划和医嘱调整建议" />
        </el-form-item>
        <el-form-item label="处理状态">
          <el-select placeholder="选择状态">
            <el-option label="处理中" value="doing" />
            <el-option label="待复核" value="review" />
            <el-option label="已闭环" value="closed" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="warningDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveAction('预警处理记录已保存，并回写员工待办', () => warningDialogVisible = false)">保存处理记录</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="taskDialogVisible" title="处理待办任务" width="560px">
      <el-descriptions v-if="selectedTask" :column="1" border>
        <el-descriptions-item label="任务">{{ selectedTask.title }}</el-descriptions-item>
        <el-descriptions-item label="数量">{{ selectedTask.count }}</el-descriptions-item>
        <el-descriptions-item label="责任">{{ selectedTask.role }} / {{ selectedTask.owner }}</el-descriptions-item>
        <el-descriptions-item label="截止">{{ selectedTask.deadline }}</el-descriptions-item>
        <el-descriptions-item label="影响">{{ selectedTask.impact }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="taskDialogVisible = false">关闭</el-button>
        <el-button @click="saveAction('待办已改派并生成消息提醒', () => taskDialogVisible = false)">改派</el-button>
        <el-button type="primary" @click="goTo('board-task')">进入待办页</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="deviceDialogVisible" title="设备水质复核" width="560px">
      <el-descriptions v-if="selectedDevice" :column="1" border>
        <el-descriptions-item label="区域">{{ selectedDevice.zone }}</el-descriptions-item>
        <el-descriptions-item label="对象">{{ selectedDevice.item }}</el-descriptions-item>
        <el-descriptions-item label="监测项">{{ selectedDevice.metric }}</el-descriptions-item>
        <el-descriptions-item label="当前值">{{ selectedDevice.value }}</el-descriptions-item>
        <el-descriptions-item label="责任人">{{ selectedDevice.owner }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="deviceDialogVisible = false">取消</el-button>
        <el-button @click="saveAction('相关机位已临时停用，排班限制已更新', () => deviceDialogVisible = false)">停用相关机位</el-button>
        <el-button type="primary" @click="saveAction('设备水质复核结果已记录', () => deviceDialogVisible = false)">记录复核结果</el-button>
      </template>
    </el-dialog>
  </section>
</template>
