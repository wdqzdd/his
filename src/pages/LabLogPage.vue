<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, Document, Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{
  context: PageContext;
}>();

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
  dueAt: string;
  urgency: string;
  nextAction: string;
};

const selectedId = ref('LLOG-001');
const editDialogVisible = ref(false);
const confirmDialogVisible = ref(false);
const traceDrawerVisible = ref(false);

const rows: LogRow[] = [
  { id: 'LLOG-001', taskType: '检验待办', subject: '标本接收', patient: '王建国', content: '完成晨间标本接收与登记', source: '标本台', status: '已记录', owner: '李技师', time: '2026-05-10 08:00', dueAt: '2026-05-10 08:30', urgency: '普通', nextAction: '等待检测' },
  { id: 'LLOG-002', taskType: '检验任务', subject: 'LIS同步', patient: '李秀英', content: 'LIS 同步成功，报告号已生成', source: '接口同步', status: '处理中', owner: '王技师', time: '2026-05-10 08:15', dueAt: '2026-05-10 09:00', urgency: '普通', nextAction: '复核结果' },
  { id: 'LLOG-003', taskType: '到期提醒', subject: '危急值通知', patient: '赵明', content: '高钾危急值已电话通知医生', source: '危急值', status: '已记录', owner: '张技师', time: '2026-05-10 08:30', dueAt: '2026-05-10 08:40', urgency: '危急', nextAction: '补充记录' },
  { id: 'LLOG-004', taskType: '检验待办', subject: '手工录入', patient: '陈志强', content: '手工录入血常规结果', source: '手工结果', status: '待确认', owner: '李技师', time: '2026-05-10 08:45', dueAt: '2026-05-10 10:00', urgency: '普通', nextAction: '等待复核' },
  { id: 'LLOG-005', taskType: '已完成任务', subject: '报告上传', patient: '周庆', content: '上传原始 PDF 报告', source: '报告附件', status: '已记录', owner: '王技师', time: '2026-05-10 09:00', dueAt: '2026-05-10 09:30', urgency: '普通', nextAction: '归档' },
  { id: 'LLOG-006', taskType: '检验任务', subject: '结果复核', patient: '何雪', content: '复核异常项并补充备注', source: '结果审核', status: '处理中', owner: '张技师', time: '2026-05-10 09:15', dueAt: '2026-05-10 10:15', urgency: '关注', nextAction: '发布结果' },
  { id: 'LLOG-007', taskType: '逾期提醒', subject: '趋势判定', patient: '孙海', content: 'Kt/V 趋势未达标', source: '趋势分析', status: '待确认', owner: '李技师', time: '2026-05-10 09:30', dueAt: '2026-05-10 09:45', urgency: '逾期', nextAction: '通知医生' },
  { id: 'LLOG-008', taskType: '已完成任务', subject: '报告归档', patient: '马丽', content: '报告与附件已归档', source: '归档任务', status: '已记录', owner: '王技师', time: '2026-05-10 09:45', dueAt: '2026-05-10 10:00', urgency: '普通', nextAction: '结束' },
  { id: 'LLOG-009', taskType: '检验任务', subject: '异常值追踪', patient: '郭强', content: '补充异常值处理说明', source: '异常记录', status: '处理中', owner: '张技师', time: '2026-05-10 10:00', dueAt: '2026-05-10 11:00', urgency: '关注', nextAction: '补录' },
  { id: 'LLOG-010', taskType: '到期提醒', subject: '交接总结', patient: '陈敏', content: '班次交接总结完成', source: '工作日志', status: '待确认', owner: '李技师', time: '2026-05-10 10:15', dueAt: '2026-05-10 10:30', urgency: '普通', nextAction: '签名确认' },
];

const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['lab_work_log', 'handover_record', 'audit_log'];

const metrics = computed(() => [
  { label: '日志总数', value: rows.length, tone: 'blue' },
  { label: '处理中', value: rows.filter((item) => item.status === '处理中').length, tone: 'orange' },
  { label: '待确认', value: rows.filter((item) => item.status === '待确认').length, tone: 'orange' },
  { label: '已记录', value: rows.filter((item) => item.status === '已记录').length, tone: 'green' },
  { label: '到期/逾期', value: rows.filter((item) => item.taskType.includes('提醒')).length, tone: 'red' },
]);

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value === '已记录') return 'success';
  if (value === '危急' || value === '逾期') return 'danger';
  if (value === '处理中' || value === '待确认') return 'warning';
  return 'info';
}

function selectRow(row: LogRow): void {
  selectedId.value = row.id;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}

function openEdit(row?: LogRow): void {
  selectedId.value = row?.id ?? rows[0].id;
  editDialogVisible.value = true;
}

function openConfirm(row: LogRow): void {
  selectedId.value = row.id;
  confirmDialogVisible.value = true;
}
</script>

<template>
  <section class="lab-workflow-page">
    <el-card class="lab-work-card" shadow="never">
      <template #header>
        <div class="lab-header">
          <div>
            <h2>{{ context.menuTitle }}</h2>
            <p>记录检验科班次日志、交接提醒、异常说明和护理/医生确认，作为审计入口。</p>
          </div>
          <div class="lab-actions">
            <el-button type="primary" :icon="Document" @click="openEdit()">新增日志</el-button>
            <el-button :icon="CircleCheck" @click="openConfirm(rows[0])">确认完成</el-button>
          </div>
        </div>
      </template>

      <el-form class="lab-filter" inline>
        <el-form-item label="关键字">
          <el-input placeholder="主题、患者、来源、内容" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select placeholder="全部状态" clearable>
            <el-option label="已记录" value="已记录" />
            <el-option label="处理中" value="处理中" />
            <el-option label="待确认" value="待确认" />
          </el-select>
        </el-form-item>
        <el-form-item label="任务类型">
          <el-select placeholder="全部任务" clearable>
            <el-option label="检验待办" value="检验待办" />
            <el-option label="检验任务" value="检验任务" />
            <el-option label="已完成任务" value="已完成任务" />
            <el-option label="到期提醒" value="到期提醒" />
            <el-option label="逾期提醒" value="逾期提醒" />
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
        <el-table-column prop="id" label="日志号" width="110" fixed="left" />
        <el-table-column prop="taskType" label="任务类型" width="110" />
        <el-table-column prop="subject" label="主题" width="120" />
        <el-table-column prop="patient" label="患者" width="100" />
        <el-table-column prop="content" label="内容" min-width="210" />
        <el-table-column prop="source" label="来源" width="100" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="owner" label="责任人" width="100" />
        <el-table-column prop="time" label="时间" width="150" />
        <el-table-column prop="dueAt" label="到期时间" width="150" />
        <el-table-column prop="urgency" label="提醒" width="85">
          <template #default="{ row }"><el-tag :type="tagType(row.urgency)" effect="plain">{{ row.urgency }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="nextAction" label="下一步" min-width="120" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click.stop="openEdit(row)">编辑</el-button>
            <el-button link @click.stop="openConfirm(row)">确认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="editDialogVisible" title="检验工作日志" width="640px">
      <el-form label-width="100px">
        <el-form-item label="主题"><el-input :model-value="currentRow.subject" /></el-form-item>
        <el-form-item label="患者"><el-input :model-value="currentRow.patient" /></el-form-item>
        <el-form-item label="来源"><el-input :model-value="currentRow.source" /></el-form-item>
        <el-form-item label="内容"><el-input type="textarea" :rows="4" :model-value="currentRow.content" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editDialogVisible = false; submitAction('检验工作日志已保存')">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="confirmDialogVisible" title="日志确认" width="560px">
      <el-form label-width="100px">
        <el-form-item label="日志号"><el-input :model-value="currentRow.id" disabled /></el-form-item>
        <el-form-item label="确认结果">
          <el-radio-group model-value="done">
            <el-radio-button label="done">完成</el-radio-button>
            <el-radio-button label="follow">继续跟进</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="确认意见"><el-input type="textarea" :rows="3" placeholder="补充确认说明和后续安排" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="confirmDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmDialogVisible = false; submitAction('检验工作日志已确认')">提交确认</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="日志追溯" size="520px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-10 08:00" type="primary">创建日志：{{ currentRow.subject }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 08:30">补充异常说明和交接事项</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 09:00" type="success">班次确认完成并进入审计</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
