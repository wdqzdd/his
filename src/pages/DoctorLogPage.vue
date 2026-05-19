<script setup lang="ts">
import { ref } from 'vue';
import { CircleCheck, Document, Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

type LogRow = {
  id: string;
  patientScope: string;
  taskBucket: string;
  workType: string;
  content: string;
  relatedModule: string;
  status: string;
  dueStatus: string;
  owner: string;
  time: string;
  nextAction: string;
};

const editDialogVisible = ref(false);
const confirmDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const selected = ref<LogRow | null>(null);

const rows: LogRow[] = [
  { id: 'LOG-001', patientScope: '王建国等12人', taskBucket: '今日待办', workType: '上午班查房', content: '完成责任患者查房和处方准入检查', relatedModule: '医生工作台', status: '已记录', dueStatus: '到期提醒', owner: '刘主任', time: '2026-05-10 08:30', nextAction: '处方审核' },
  { id: 'LOG-002', patientScope: '赵明', taskBucket: '今日待办', workType: '危急值处理', content: '血钾危急值确认，要求复查并调整处方', relatedModule: '检验检查', status: '处理中', dueStatus: '逾期提醒', owner: '张明', time: '2026-05-10 08:45', nextAction: '事件关闭' },
  { id: 'LOG-003', patientScope: '李秀兰', taskBucket: '本周待办', workType: '导管风险', content: '导管出口红肿，已发起感控协管', relatedModule: '临床事件', status: '待复核', dueStatus: '到期提醒', owner: '陈宁', time: '2026-05-10 09:00', nextAction: '感控处理' },
  { id: 'LOG-004', patientScope: '周庆', taskBucket: '今日待办', workType: '处方调整', content: '心衰风险限制超滤不超过2.0L', relatedModule: '医嘱管理', status: '已记录', dueStatus: '正常', owner: '王主任', time: '2026-05-10 09:30', nextAction: '护理执行' },
  { id: 'LOG-005', patientScope: '孙海', taskBucket: '已完成', workType: '报告发布', content: '月度健康报告已发布', relatedModule: '健康报告', status: '已完成', dueStatus: '正常', owner: '刘主任', time: '2026-05-10 10:00', nextAction: '患者确认' },
  { id: 'LOG-006', patientScope: '何雪', taskBucket: '本周待办', workType: '药师协同', content: '降磷药调整提交药师审核', relatedModule: '药房站', status: '处理中', dueStatus: '到期提醒', owner: '刘主任', time: '2026-05-10 10:30', nextAction: '药师回复' },
  { id: 'LOG-007', patientScope: '陈志强', taskBucket: '今日待办', workType: '通路申请', content: '人工血管震颤稍弱，申请通路超声', relatedModule: '血管通路', status: '待审核', dueStatus: '到期提醒', owner: '刘主任', time: '2026-05-10 11:00', nextAction: '预约检查' },
  { id: 'LOG-008', patientScope: '马丽', taskBucket: '已完成', workType: '隔离复核', content: '乙肝隔离透析标识复核', relatedModule: '感控管理', status: '已完成', dueStatus: '正常', owner: '张明', time: '2026-05-10 11:30', nextAction: '排班引用' },
  { id: 'LOG-009', patientScope: '郭强', taskBucket: '本周待办', workType: '充分性评估', content: 'Kt/V低，建议延长透析时长', relatedModule: '专科病情评估', status: '待签名', dueStatus: '逾期提醒', owner: '张明', time: '2026-05-10 12:00', nextAction: '病程签名' },
  { id: 'LOG-010', patientScope: '潘德胜', taskBucket: '工作任务记录', workType: '跌倒风险', content: '透后离室前家属陪同宣教', relatedModule: '护士站', status: '已记录', dueStatus: '工作任务完成情况', owner: '王主任', time: '2026-05-10 12:30', nextAction: '护理记录' },
];

const activeTables = ['doctor_work_log', 'clinical_event', 'medical_order', 'sys_audit_log'];

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value.includes('已')) return 'success';
  if (value.includes('待') || value.includes('中')) return 'warning';
  return 'info';
}

function openEdit(row?: LogRow): void {
  selected.value = row ?? rows[0];
  editDialogVisible.value = true;
}

function openConfirm(row: LogRow): void {
  selected.value = row;
  confirmDialogVisible.value = true;
}

function openTrace(row: LogRow): void {
  selected.value = row;
  traceDrawerVisible.value = true;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}
</script>

<template>
  <section class="doctor-clinical-page">
    <el-card class="clinical-work-card" shadow="never">
      <template #header>
        <div class="clinical-header">
          <div><h2>{{ context.menuTitle }}</h2><p>记录医生每日查房、处方调整、危急值处理、报告发布和跨团队协作事项，形成可审计工作日志。</p></div>
          <div class="clinical-actions"><el-button type="primary" :icon="Document" @click="openEdit()">新增日志</el-button><el-button :icon="CircleCheck" @click="openConfirm(rows[0])">确认完成</el-button></div>
        </div>
      </template>
      <el-form class="clinical-filter" inline>
        <el-form-item label="关键字"><el-input placeholder="患者、类型、模块、内容" clearable /></el-form-item>
        <el-form-item label="类型"><el-select placeholder="全部类型" clearable><el-option label="查房" value="round" /><el-option label="危急值" value="critical" /><el-option label="处方调整" value="order" /><el-option label="协同" value="share" /></el-select></el-form-item>
        <el-form-item label="任务分组"><el-select placeholder="全部分组" clearable><el-option label="今日待办" value="今日待办" /><el-option label="本周待办" value="本周待办" /><el-option label="已完成" value="已完成" /><el-option label="工作任务记录" value="工作任务记录" /></el-select></el-form-item>
        <el-form-item label="提醒"><el-select placeholder="全部提醒" clearable><el-option label="到期提醒" value="到期提醒" /><el-option label="逾期提醒" value="逾期提醒" /><el-option label="工作任务完成情况" value="工作任务完成情况" /></el-select></el-form-item>
        <el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="待审核" value="pending" /><el-option label="处理中" value="doing" /><el-option label="已完成" value="done" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>
      <el-table :data="rows" border stripe>
        <el-table-column prop="id" label="日志号" width="105" fixed="left" />
        <el-table-column prop="patientScope" label="患者/范围" min-width="130" />
        <el-table-column prop="taskBucket" label="任务分组" min-width="120" />
        <el-table-column prop="workType" label="工作类型" min-width="120" />
        <el-table-column prop="content" label="内容" min-width="260" />
        <el-table-column prop="relatedModule" label="关联模块" min-width="130" />
        <el-table-column prop="status" label="状态" width="100"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="dueStatus" label="到期/完成" min-width="130"><template #default="{ row }"><el-tag :type="tagType(row.dueStatus)" effect="plain">{{ row.dueStatus }}</el-tag></template></el-table-column>
        <el-table-column prop="owner" label="医生" width="95" />
        <el-table-column prop="time" label="时间" width="150" />
        <el-table-column prop="nextAction" label="下一步" min-width="130" />
        <el-table-column label="操作" width="210" fixed="right"><template #default="{ row }"><el-button link type="primary" @click="openEdit(row)">编辑</el-button><el-button link @click="openConfirm(row)">确认</el-button><el-button link @click="openTrace(row)">追溯</el-button></template></el-table-column>
      </el-table>
    </el-card>    <el-dialog v-model="editDialogVisible" title="医生工作日志" width="640px"><el-form label-width="110px"><el-form-item label="工作类型"><el-input :model-value="selected?.workType" /></el-form-item><el-form-item label="患者/范围"><el-input :model-value="selected?.patientScope" /></el-form-item><el-form-item label="关联模块"><el-input :model-value="selected?.relatedModule" /></el-form-item><el-form-item label="工作内容"><el-input type="textarea" :rows="4" :model-value="selected?.content" /></el-form-item><el-form-item label="下一步"><el-input :model-value="selected?.nextAction" /></el-form-item></el-form><template #footer><el-button @click="editDialogVisible = false">取消</el-button><el-button type="primary" @click="editDialogVisible = false; submitAction('工作日志已保存')">保存</el-button></template></el-dialog>
    <el-dialog v-model="confirmDialogVisible" title="日志确认" width="560px"><el-form label-width="100px"><el-form-item label="日志"><el-input :model-value="selected?.id" disabled /></el-form-item><el-form-item label="确认结果"><el-radio-group model-value="done"><el-radio-button label="done">完成</el-radio-button><el-radio-button label="follow">继续跟进</el-radio-button></el-radio-group></el-form-item><el-form-item label="确认意见"><el-input type="textarea" :rows="3" /></el-form-item></el-form><template #footer><el-button @click="confirmDialogVisible = false">取消</el-button><el-button type="primary" @click="confirmDialogVisible = false; submitAction('日志状态已确认')">提交</el-button></template></el-dialog>
    <el-drawer v-model="traceDrawerVisible" title="日志追溯" size="520px"><el-timeline><el-timeline-item timestamp="2026-05-10 08:30" type="primary">创建日志：{{ selected?.workType }}</el-timeline-item><el-timeline-item timestamp="2026-05-10 09:00">关联业务模块和下一步</el-timeline-item><el-timeline-item timestamp="2026-05-10 09:30" type="success">确认完成并写入审计</el-timeline-item></el-timeline></el-drawer>
  </section>
</template>
