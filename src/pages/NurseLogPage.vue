<script setup lang="ts">
import { ref } from 'vue';
import { CircleCheck, Document, Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

type LogRow = {
  id: string;
  taskType: string;
  subject: string;
  patient: string;
  content: string;
  source: string;
  status: string;
  owner: string;
  time: string;
  nextAction: string;
};

const editDialogVisible = ref(false);
const confirmDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const selected = ref<LogRow | null>(null);

const rows: LogRow[] = [
  { id: 'NLOG-001', taskType: '今日待办', subject: '上午交班', patient: '王建国等12人', content: '完成交班，待核对患者4人', source: '护士站', status: '已记录', owner: '赵护士', time: '2026-05-10 08:00', nextAction: '核对执行' },
  { id: 'NLOG-002', taskType: '护理任务', subject: '导管护理', patient: '李秀兰', content: '导管出口红肿，已发起护理审核', source: '护理执行', status: '处理中', owner: '钱护士', time: '2026-05-10 08:30', nextAction: '感控处理' },
  { id: 'NLOG-003', taskType: '护理任务', subject: '隔离核对', patient: '马丽', content: '隔离机位和专用物品已确认', source: '护理执行', status: '已完成', owner: '冯护士', time: '2026-05-10 09:00', nextAction: '治疗记录' },
  { id: 'NLOG-004', taskType: '到期提醒', subject: '低血压风险', patient: '周庆', content: '限制超滤并提醒医生关注', source: '临床事件', status: '待确认', owner: '蒋护士', time: '2026-05-10 09:30', nextAction: '医生确认' },
  { id: 'NLOG-005', taskType: '宣教任务', subject: '家属沟通', patient: '潘德胜', content: '透后离室需家属陪同', source: '宣教', status: '已记录', owner: '唐护士', time: '2026-05-10 10:00', nextAction: '确认签名' },
  { id: 'NLOG-006', taskType: '逾期任务', subject: '风险交班', patient: '赵明', content: '高钾待复核，已暂停执行', source: '护理审核', status: '待复核', owner: '孙护士', time: '2026-05-10 10:30', nextAction: '等待医生' },
  { id: 'NLOG-007', taskType: '评估任务', subject: '通路观察', patient: '陈志强', content: '人工血管震颤稍弱', source: '通路记录', status: '已记录', owner: '周护士', time: '2026-05-10 11:00', nextAction: '医生复查' },
  { id: 'NLOG-008', taskType: '已完成', subject: '药耗确认', patient: '何雪', content: '降磷药已执行并回写费用', source: '药耗消耗', status: '已完成', owner: '谢护士', time: '2026-05-10 11:30', nextAction: '归档' },
  { id: 'NLOG-009', taskType: '今日待办', subject: '应急备床', patient: '孙海', content: '补床患者已安排', source: '排班', status: '已记录', owner: '郑护士', time: '2026-05-10 12:00', nextAction: '排班引用' },
  { id: 'NLOG-010', taskType: '到期提醒', subject: '班末总结', patient: '全部患者', content: '班次无重大差错，待签名归档', source: '班末总结', status: '待签名', owner: '赵护士', time: '2026-05-10 12:30', nextAction: '签名确认' },
];

const taskSummary = [
  { label: '今日待办', value: rows.filter((item) => item.taskType === '今日待办').length },
  { label: '到期提醒', value: rows.filter((item) => item.taskType === '到期提醒').length },
  { label: '已完成', value: rows.filter((item) => item.taskType === '已完成' || item.status === '已完成').length },
  { label: '逾期任务', value: rows.filter((item) => item.taskType === '逾期任务').length },
  { label: '护理/宣教/评估', value: rows.filter((item) => ['护理任务', '宣教任务', '评估任务'].includes(item.taskType)).length },
];

const activeTables = ['nursing_log', 'handover_record', 'nursing_task', 'nursing_audit_log'];

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value.includes('已')) return 'success';
  if (value.includes('待') || value.includes('中')) return 'warning';
  return 'info';
}

function openEdit(row?: LogRow): void { selected.value = row ?? rows[0]; editDialogVisible.value = true; }
function openConfirm(row: LogRow): void { selected.value = row; confirmDialogVisible.value = true; }
function openTrace(row: LogRow): void { selected.value = row; traceDrawerVisible.value = true; }
function submitAction(message: string): void { ElMessage.success(message); }
</script>

<template>
  <section class="nurse-execution-page">
    <el-card class="nurse-work-card" shadow="never">
      <template #header><div class="nurse-header"><div><h2>{{ context.menuTitle }}</h2><p>记录班次交班、风险提醒、执行总结和护理确认，作为护士工作日志与审计入口。</p></div><div class="nurse-actions"><el-button type="primary" :icon="Document" @click="openEdit()">新增日志</el-button><el-button :icon="CircleCheck" @click="openConfirm(rows[0])">确认完成</el-button></div></div></template>
      <el-form class="nurse-filter" inline><el-form-item label="关键字"><el-input placeholder="主题、患者、内容、来源" clearable /></el-form-item><el-form-item label="任务类型"><el-select placeholder="全部类型" clearable><el-option label="今日待办" value="今日待办" /><el-option label="到期提醒" value="到期提醒" /><el-option label="护理任务" value="护理任务" /><el-option label="宣教任务" value="宣教任务" /><el-option label="评估任务" value="评估任务" /><el-option label="逾期任务" value="逾期任务" /></el-select></el-form-item><el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="已记录" value="已记录" /><el-option label="处理中" value="处理中" /><el-option label="待确认" value="待确认" /></el-select></el-form-item><el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item></el-form>
      <div class="nurse-stat-grid"><el-card v-for="item in taskSummary" :key="item.label" class="nurse-stat-card orange" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>
      <el-table :data="rows" border stripe><el-table-column prop="id" label="日志号" width="105" fixed="left" /><el-table-column prop="taskType" label="任务类型" width="115" /><el-table-column prop="subject" label="主题" min-width="120" /><el-table-column prop="patient" label="患者/范围" min-width="130" /><el-table-column prop="content" label="内容" min-width="240" /><el-table-column prop="source" label="来源" width="110" /><el-table-column prop="status" label="状态" width="100"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column><el-table-column prop="owner" label="责任护士" width="105" /><el-table-column prop="time" label="时间" width="150" /><el-table-column prop="nextAction" label="下一步" min-width="130" /><el-table-column label="操作" width="210" fixed="right"><template #default="{ row }"><el-button link type="primary" @click="openEdit(row)">编辑</el-button><el-button link @click="openConfirm(row)">确认</el-button><el-button link @click="openTrace(row)">追溯</el-button></template></el-table-column></el-table>
    </el-card>    <el-dialog v-model="editDialogVisible" title="护士工作日志" width="640px"><el-form label-width="110px"><el-form-item label="主题"><el-input :model-value="selected?.subject" /></el-form-item><el-form-item label="患者/范围"><el-input :model-value="selected?.patient" /></el-form-item><el-form-item label="来源"><el-input :model-value="selected?.source" /></el-form-item><el-form-item label="内容"><el-input type="textarea" :rows="4" :model-value="selected?.content" /></el-form-item></el-form><template #footer><el-button @click="editDialogVisible = false">取消</el-button><el-button type="primary" @click="editDialogVisible = false; submitAction('工作日志已保存')">保存</el-button></template></el-dialog>
    <el-dialog v-model="confirmDialogVisible" title="日志确认" width="560px"><el-form label-width="100px"><el-form-item label="日志"><el-input :model-value="selected?.id" disabled /></el-form-item><el-form-item label="确认结果"><el-radio-group model-value="done"><el-radio-button label="done">完成</el-radio-button><el-radio-button label="follow">继续跟进</el-radio-button></el-radio-group></el-form-item><el-form-item label="确认意见"><el-input type="textarea" :rows="3" /></el-form-item></el-form><template #footer><el-button @click="confirmDialogVisible = false">取消</el-button><el-button type="primary" @click="confirmDialogVisible = false; submitAction('日志状态已确认')">提交</el-button></template></el-dialog>
    <el-drawer v-model="traceDrawerVisible" title="日志追溯" size="520px"><el-timeline><el-timeline-item timestamp="2026-05-10 08:30" type="primary">创建日志：{{ selected?.subject }}</el-timeline-item><el-timeline-item timestamp="2026-05-10 09:00">补充说明并确认下一步</el-timeline-item><el-timeline-item timestamp="2026-05-10 09:30" type="success">写入护理审计</el-timeline-item></el-timeline></el-drawer>
  </section>
</template>
