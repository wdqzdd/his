<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, Operation, Search, UserFilled } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();

type ScheduleRow = {
  id: string;
  date: string;
  shift: string;
  scheduleType: string;
  department: string;
  staff: string;
  role: string;
  area: string;
  status: string;
  nextAction: string;
};

type DutyRow = {
  id: string;
  dutyDate: string;
  dutyType: string;
  staff: string;
  phone: string;
  responseArea: string;
  handover: string;
  status: string;
  nextAction: string;
};

type StatRow = {
  id: string;
  dimension: string;
  period: string;
  planned: number;
  published: number;
  gap: number;
  workload: string;
  owner: string;
  status: string;
  nextAction: string;
};

type ChangeRow = {
  id: string;
  object: string;
  changeType: string;
  beforeValue: string;
  afterValue: string;
  reason: string;
  operator: string;
  changedAt: string;
  status: string;
  nextAction: string;
};

const activeTab = ref('schedule');
const selectedScheduleId = ref('SCH-001');
const dutyDialogVisible = ref(false);
const publishDialogVisible = ref(false);
const traceDrawerVisible = ref(false);

const scheduleRows: ScheduleRow[] = [
  { id: 'SCH-001', date: '2026-05-15', shift: '上午班', scheduleType: '医疗排班', department: '血液净化中心', staff: '张明', role: '主诊医生', area: 'A/B区处方审核', status: '已发布', nextAction: '班前交接' },
  { id: 'SCH-002', date: '2026-05-15', shift: '上午班', scheduleType: '护理排班', department: 'A区护理组', staff: '周敏', role: '责任组长', area: 'A01-A08', status: '已发布', nextAction: '核对签到' },
  { id: 'SCH-003', date: '2026-05-15', shift: '上午班', scheduleType: '行政排班', department: '医务科', staff: '张洁', role: '医务协调', area: '预约审核/投诉接待', status: '已发布', nextAction: '处理待办' },
  { id: 'SCH-004', date: '2026-05-15', shift: '下午班', scheduleType: '医疗排班', department: '血液净化中心', staff: '陈宁', role: '主诊医生', area: 'C区治疗审核', status: '待确认', nextAction: '资质确认' },
  { id: 'SCH-005', date: '2026-05-15', shift: '下午班', scheduleType: '护理排班', department: 'B区护理组', staff: '赵琼', role: '责任护士', area: 'B01-B07', status: '草稿', nextAction: '发布排班' },
  { id: 'SCH-006', date: '2026-05-15', shift: '夜间班', scheduleType: '医疗排班', department: '夜间透析组', staff: '王主任', role: '总值班', area: '夜间加透/急诊', status: '已发布', nextAction: '急诊响应' },
  { id: 'SCH-007', date: '2026-05-16', shift: '上午班', scheduleType: '护理排班', department: '隔离组', staff: '孙涵', role: '隔离组长', area: 'I01-I08', status: '待复核', nextAction: '感控复核' },
  { id: 'SCH-008', date: '2026-05-16', shift: '全日', scheduleType: '行政排班', department: '医务科', staff: '刘主任', role: '质量值班', area: 'CQI/不良事件', status: '草稿', nextAction: '发布排班' },
  { id: 'SCH-009', date: '2026-05-16', shift: '上午班', scheduleType: '医疗排班', department: '通路团队', staff: '李教授', role: '通路会诊', area: '通路风险患者', status: '已发布', nextAction: '会诊安排' },
  { id: 'SCH-010', date: '2026-05-16', shift: '下午班', scheduleType: '护理排班', department: 'C区护理组', staff: '陈蕾', role: '责任护士', area: 'C08-C14', status: '待确认', nextAction: '组长确认' },
];

const dutyRows: DutyRow[] = [
  { id: 'DUTY-001', dutyDate: '2026-05-15', dutyType: '医疗值班', staff: '张明', phone: '13800010001', responseArea: '透析医嘱/危急值', handover: '已交接 2 项', status: '在岗', nextAction: '持续响应' },
  { id: 'DUTY-002', dutyDate: '2026-05-15', dutyType: '护理值班', staff: '周敏', phone: '13800010002', responseArea: '上机核对/护理异常', handover: '待交接 1 项', status: '在岗', nextAction: '完成交接' },
  { id: 'DUTY-003', dutyDate: '2026-05-15', dutyType: '行政值班', staff: '张洁', phone: '13800010003', responseArea: '预约审核/医患沟通', handover: '无遗留', status: '在岗', nextAction: '处理审核' },
  { id: 'DUTY-004', dutyDate: '2026-05-15', dutyType: '医疗值班', staff: '王主任', phone: '13800010004', responseArea: '夜间急诊透析', handover: '待接班', status: '待接班', nextAction: '接班确认' },
  { id: 'DUTY-005', dutyDate: '2026-05-15', dutyType: '护理值班', staff: '邓雪', phone: '13800010005', responseArea: '夜间护理', handover: '待接班', status: '待接班', nextAction: '接班确认' },
  { id: 'DUTY-006', dutyDate: '2026-05-16', dutyType: '行政值班', staff: '刘主任', phone: '13800010006', responseArea: '质量安全', handover: '待确认', status: '待确认', nextAction: '确认值班' },
  { id: 'DUTY-007', dutyDate: '2026-05-16', dutyType: '医疗值班', staff: '陈宁', phone: '13800010007', responseArea: 'C区治疗审核', handover: '排班已发', status: '待上岗', nextAction: '班前签到' },
  { id: 'DUTY-008', dutyDate: '2026-05-16', dutyType: '护理值班', staff: '孙涵', phone: '13800010008', responseArea: '隔离区护理', handover: '感控待复核', status: '待复核', nextAction: '感控确认' },
  { id: 'DUTY-009', dutyDate: '2026-05-16', dutyType: '行政值班', staff: '李娜', phone: '13800010009', responseArea: '导诊协调', handover: '新收患者 3 人', status: '待上岗', nextAction: '班前签到' },
  { id: 'DUTY-010', dutyDate: '2026-05-16', dutyType: '医疗值班', staff: '李教授', phone: '13800010010', responseArea: '通路会诊', handover: '通路风险 4 人', status: '已发布', nextAction: '会诊确认' },
];

const statRows: StatRow[] = [
  { id: 'STAT-001', dimension: '医疗排班', period: '本周', planned: 28, published: 25, gap: 3, workload: '人均 6.5 班', owner: '医务科', status: '缺口预警', nextAction: '补齐夜间班' },
  { id: 'STAT-002', dimension: '护理排班', period: '本周', planned: 56, published: 52, gap: 4, workload: '人均 5.8 班', owner: '护理部', status: '待优化', nextAction: '调整休假' },
  { id: 'STAT-003', dimension: '行政排班', period: '本周', planned: 14, published: 14, gap: 0, workload: '人均 3.5 班', owner: '医务科', status: '达标', nextAction: '持续监测' },
  { id: 'STAT-004', dimension: '隔离区值班', period: '本周', planned: 12, published: 10, gap: 2, workload: '资质人员偏紧', owner: '感控管理', status: '缺口预警', nextAction: '补隔离资质' },
  { id: 'STAT-005', dimension: '夜间值班', period: '本周', planned: 7, published: 6, gap: 1, workload: '总值班偏高', owner: '医务科', status: '待优化', nextAction: '安排替班' },
  { id: 'STAT-006', dimension: '通路会诊', period: '本周', planned: 6, published: 6, gap: 0, workload: '会诊 18 人', owner: '专家团队', status: '达标', nextAction: '同步医生站' },
];

const changeRows: ChangeRow[] = [
  { id: 'CHG-001', object: 'SCH-004 / 下午医疗排班', changeType: '替班', beforeValue: '陈宁', afterValue: '刘主任', reason: '陈宁临时会诊', operator: '医务张洁', changedAt: '2026-05-14 16:20', status: '待复核', nextAction: '主任复核' },
  { id: 'CHG-002', object: 'SCH-007 / 隔离护理排班', changeType: '资质校验', beforeValue: '普通护理组', afterValue: '隔离组', reason: '乙肝隔离患者增加', operator: '护理周敏', changedAt: '2026-05-14 17:05', status: '已生效', nextAction: '排班引用' },
  { id: 'CHG-003', object: 'DUTY-003 / 行政值班', changeType: '新增', beforeValue: '无', afterValue: '张洁', reason: '周五预约审核量增加', operator: '医务刘主任', changedAt: '2026-05-14 10:15', status: '已生效', nextAction: '员工主页待办' },
  { id: 'CHG-004', object: 'STAT-001 / 医疗排班', changeType: '缺口预警', beforeValue: '缺口 1 班', afterValue: '缺口 3 班', reason: '夜间加透增加', operator: '系统规则', changedAt: '2026-05-14 18:00', status: '预警', nextAction: '生成补班任务' },
  { id: 'CHG-005', object: 'SCH-008 / 质量值班', changeType: '发布时间调整', beforeValue: '2026-05-15', afterValue: '2026-05-16', reason: 'CQI会议延期', operator: '医务张洁', changedAt: '2026-05-13 15:30', status: '已归档', nextAction: '查看审计' },
  { id: 'CHG-006', object: 'DUTY-008 / 隔离护理值班', changeType: '复核退回', beforeValue: '待上岗', afterValue: '待复核', reason: '隔离培训记录临期', operator: '感控孙主任', changedAt: '2026-05-14 19:10', status: '待补正', nextAction: '补培训记录' },
];

const currentRow = computed(() => scheduleRows.find((item) => item.id === selectedScheduleId.value) ?? scheduleRows[0]);
const activeTables = ['staff_profile', 'duty_schedule', 'sys_work_identity', 'duty_publish_log'];
const metrics = computed(() => [
  { label: '排班计划', value: scheduleRows.length, tone: 'blue' },
  { label: '已发布', value: scheduleRows.filter((item) => item.status === '已发布').length, tone: 'green' },
  { label: '待确认/复核', value: scheduleRows.filter((item) => item.status.includes('待')).length, tone: 'orange' },
  { label: '排班缺口', value: statRows.reduce((sum, item) => sum + item.gap, 0), tone: 'purple' },
]);

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (['已发布', '在岗', '已生效', '达标', '持续监测'].includes(value)) return 'success';
  if (value.includes('预警') || value === '待补正') return 'danger';
  if (value.includes('待') || value.includes('草稿') || value.includes('优化') || value.includes('复核')) return 'warning';
  return 'info';
}

function selectSchedule(row: ScheduleRow): void {
  selectedScheduleId.value = row.id;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}
</script>

<template>
  <section class="medical-affairs-page">
    <el-card class="medical-work-card" shadow="never">
      <template #header>
        <div class="medical-work-header">
          <div>
            <h2>{{ props.context.menuTitle }}</h2>
            <p>维护医疗、护理、行政排班和值班，发布后进入员工主页、导诊接入、排班排床和治疗执行。</p>
          </div>
          <div class="medical-actions">
            <el-button type="primary" :icon="UserFilled" @click="dutyDialogVisible = true">新增排班</el-button>
            <el-button :icon="CircleCheck" @click="publishDialogVisible = true">发布排班</el-button>
            <el-button :icon="Operation" @click="traceDrawerVisible = true">变更追溯</el-button>
          </div>
        </div>
      </template>

      <el-form class="medical-filter" inline>
        <el-form-item label="日期"><el-date-picker type="date" placeholder="选择日期" /></el-form-item>
        <el-form-item label="类型">
          <el-select placeholder="全部类型" clearable>
            <el-option label="医疗排班" value="医疗排班" />
            <el-option label="护理排班" value="护理排班" />
            <el-option label="行政排班" value="行政排班" />
            <el-option label="医疗值班" value="医疗值班" />
            <el-option label="护理值班" value="护理值班" />
            <el-option label="行政值班" value="行政值班" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select placeholder="全部状态" clearable>
            <el-option label="草稿" value="草稿" />
            <el-option label="待确认" value="待确认" />
            <el-option label="待复核" value="待复核" />
            <el-option label="已发布" value="已发布" />
          </el-select>
        </el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <div class="medical-stat-grid">
        <el-card v-for="item in metrics" :key="item.label" :class="['medical-stat-card', item.tone]" shadow="never">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </el-card>
      </div>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="医疗/护理/行政排班" name="schedule">
          <el-table :data="scheduleRows" border stripe highlight-current-row row-key="id" @row-click="selectSchedule">
            <el-table-column prop="date" label="日期" width="115" fixed="left" />
            <el-table-column prop="shift" label="班次" width="90" />
            <el-table-column prop="scheduleType" label="排班类型" width="110" />
            <el-table-column prop="department" label="科室/组别" width="130" />
            <el-table-column prop="staff" label="人员" width="95" />
            <el-table-column prop="role" label="身份" width="115" />
            <el-table-column prop="area" label="负责范围" min-width="160" />
            <el-table-column prop="status" label="状态" width="95"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
            <el-table-column prop="nextAction" label="下一步" min-width="120" />
            <el-table-column label="操作" width="210" fixed="right"><template #default="{ row }"><el-button link type="primary" @click.stop="selectSchedule(row); dutyDialogVisible = true">编辑</el-button><el-button link @click.stop="selectSchedule(row); publishDialogVisible = true">发布</el-button><el-button link @click.stop="selectSchedule(row); traceDrawerVisible = true">追溯</el-button></template></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="医疗/护理/行政值班" name="duty">
          <el-table :data="dutyRows" border stripe row-key="id">
            <el-table-column prop="dutyDate" label="值班日期" width="115" fixed="left" />
            <el-table-column prop="dutyType" label="值班类型" width="110" />
            <el-table-column prop="staff" label="值班人员" width="95" />
            <el-table-column prop="phone" label="联系方式" width="130" />
            <el-table-column prop="responseArea" label="响应范围" min-width="150" />
            <el-table-column prop="handover" label="交接状态" width="130" />
            <el-table-column prop="status" label="状态" width="95"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
            <el-table-column prop="nextAction" label="下一步" min-width="120" />
            <el-table-column label="操作" width="180" fixed="right"><template #default><el-button link type="primary" @click="dutyDialogVisible = true">接班</el-button><el-button link @click="traceDrawerVisible = true">交接追溯</el-button></template></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="排班统计" name="statistics">
          <el-table :data="statRows" border stripe row-key="id">
            <el-table-column prop="dimension" label="统计维度" width="120" fixed="left" />
            <el-table-column prop="period" label="周期" width="90" />
            <el-table-column prop="planned" label="应排班" width="90" />
            <el-table-column prop="published" label="已发布" width="90" />
            <el-table-column prop="gap" label="缺口" width="80" />
            <el-table-column prop="workload" label="工作量" min-width="140" />
            <el-table-column prop="owner" label="责任方" width="110" />
            <el-table-column prop="status" label="状态" width="100"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
            <el-table-column prop="nextAction" label="下一步" min-width="130" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="值班变更记录" name="changes">
          <el-table :data="changeRows" border stripe row-key="id">
            <el-table-column prop="object" label="变更对象" min-width="160" fixed="left" />
            <el-table-column prop="changeType" label="变更类型" width="110" />
            <el-table-column prop="beforeValue" label="变更前" width="130" />
            <el-table-column prop="afterValue" label="变更后" width="130" />
            <el-table-column prop="reason" label="原因" min-width="150" />
            <el-table-column prop="operator" label="操作人" width="110" />
            <el-table-column prop="changedAt" label="时间" width="145" />
            <el-table-column prop="status" label="状态" width="95"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
            <el-table-column prop="nextAction" label="下一步" min-width="120" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog v-model="dutyDialogVisible" title="排班和值班维护" width="640px">
      <el-form label-width="110px">
        <el-form-item label="排班日期"><el-date-picker type="date" /></el-form-item>
        <el-form-item label="排班类型"><el-select :model-value="currentRow.scheduleType"><el-option label="医疗排班" value="医疗排班" /><el-option label="护理排班" value="护理排班" /><el-option label="行政排班" value="行政排班" /></el-select></el-form-item>
        <el-form-item label="班次"><el-select :model-value="currentRow.shift"><el-option label="上午班" value="上午班" /><el-option label="下午班" value="下午班" /><el-option label="夜间班" value="夜间班" /><el-option label="全日" value="全日" /></el-select></el-form-item>
        <el-form-item label="人员"><el-input :model-value="currentRow.staff" /></el-form-item>
        <el-form-item label="负责范围"><el-input :model-value="currentRow.area" /></el-form-item>
        <el-form-item label="调整说明"><el-input type="textarea" :rows="3" placeholder="记录资质校验、替班原因、行政值班职责和影响范围" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dutyDialogVisible = false">取消</el-button><el-button type="primary" @click="dutyDialogVisible = false; submitAction('排班和值班已保存')">保存</el-button></template>
    </el-dialog>

    <el-dialog v-model="publishDialogVisible" title="发布值班排班" width="560px">
      <el-form label-width="110px">
        <el-form-item label="排班对象"><el-input :model-value="`${currentRow.date} / ${currentRow.shift} / ${currentRow.staff}`" disabled /></el-form-item>
        <el-form-item label="发布范围"><el-checkbox-group><el-checkbox label="员工主页" /><el-checkbox label="导诊台" /><el-checkbox label="医生站" /><el-checkbox label="护士站" /><el-checkbox label="统计报表" /></el-checkbox-group></el-form-item>
        <el-form-item label="发布说明"><el-input type="textarea" :rows="3" placeholder="说明发布后影响的工作站、待办范围和工作量统计口径" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="publishDialogVisible = false">取消</el-button><el-button type="primary" @click="publishDialogVisible = false; submitAction('值班排班已发布')">确认发布</el-button></template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="值班排班变更追溯" size="560px">
      <el-timeline>
        <el-timeline-item timestamp="草稿创建">创建排班：{{ currentRow.staff }} / {{ currentRow.shift }}</el-timeline-item>
        <el-timeline-item timestamp="资质校验" type="warning">校验工作身份、证书有效期、护理组和行政值班职责</el-timeline-item>
        <el-timeline-item timestamp="发布生效" type="success">同步员工主页、工作站权限范围、排班统计和变更日志</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
