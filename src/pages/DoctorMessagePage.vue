<script setup lang="ts">
import { ref } from 'vue';
import { CircleCheck, Message, Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

type MessageRow = {
  id: string;
  patient: string;
  topic: string;
  from: string;
  adviceRecord: string;
  handover: string;
  content: string;
  priority: string;
  status: string;
  owner: string;
  nextAction: string;
};

const replyDialogVisible = ref(false);
const closeDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const selected = ref<MessageRow | null>(null);

const rows: MessageRow[] = [
  { id: 'MSG-001', patient: '孙海', topic: '患者用药咨询', from: '患者端', adviceRecord: '医疗护理建议记录', handover: '否', content: '左卡尼汀是否每次透后使用', priority: '中', status: '待回复', owner: '刘主任', nextAction: '医生回复' },
  { id: 'MSG-002', patient: '周庆', topic: '护士核对疑问', from: '护士站', adviceRecord: '医疗护理建议', handover: '是', content: '本次超滤上限是否2.0L', priority: '高', status: '已回复', owner: '王主任', nextAction: '护理执行' },
  { id: 'MSG-003', patient: '赵明', topic: '导诊签约缺项', from: '导诊台', adviceRecord: '医疗护理建议记录', handover: '是', content: '高钾处理知情确认缺失', priority: '高', status: '待处理', owner: '张明', nextAction: '补签文书' },
  { id: 'MSG-004', patient: '何雪', topic: '药师退回', from: '药房站', adviceRecord: '医疗护理建议', handover: '否', content: '降磷药剂量需确认', priority: '中', status: '待回复', owner: '刘主任', nextAction: '调整医嘱' },
  { id: 'MSG-005', patient: '韩梅', topic: '健康报告阅读', from: '患者端', adviceRecord: '医疗护理建议记录', handover: '否', content: '健康报告已读确认', priority: '低', status: '已完成', owner: '刘主任', nextAction: '归档' },
  { id: 'MSG-006', patient: '李秀兰', topic: '感控提醒', from: '感控管理', adviceRecord: '医疗护理建议', handover: '是', content: '导管出口红肿需复查', priority: '高', status: '处理中', owner: '陈宁', nextAction: '事件处理' },
  { id: 'MSG-007', patient: '李秀兰', topic: '营养师建议', from: '营养师', adviceRecord: '医疗护理建议', handover: '否', content: '高蛋白饮食建议已生成', priority: '中', status: '已回复', owner: '陈宁', nextAction: '患者确认' },
  { id: 'MSG-008', patient: '郭强', topic: '护士签名请求', from: '护士站', adviceRecord: '医疗护理建议记录', handover: '是', content: '透后复查采样计划', priority: '中', status: '待确认', owner: '张明', nextAction: '确认计划' },
  { id: 'MSG-009', patient: '潘德胜', topic: '家属咨询', from: '患者端', adviceRecord: '医疗护理建议', handover: '否', content: '透后跌倒风险注意事项', priority: '低', status: '待回复', owner: '王主任', nextAction: '回复家属' },
  { id: 'MSG-010', patient: '赵明', topic: '设备放行提醒', from: '技师站', adviceRecord: '医疗护理建议记录', handover: '是', content: '隔离机位放行状态确认', priority: '中', status: '已完成', owner: '张明', nextAction: '排班引用' },
];

const activeTables = ['message_board', 'message_reply', 'home_message_log', 'sys_audit_log'];

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value.includes('已') || value === '低') return 'success';
  if (value === '高') return 'danger';
  if (value.includes('待') || value.includes('中') || value === '中') return 'warning';
  return 'info';
}

function openReply(row?: MessageRow): void {
  selected.value = row ?? rows[0];
  replyDialogVisible.value = true;
}

function openClose(row: MessageRow): void {
  selected.value = row;
  closeDialogVisible.value = true;
}

function openTrace(row: MessageRow): void {
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
      <template #header><div class="clinical-header"><div><h2>{{ context.menuTitle }}</h2><p>处理患者、护士、导诊、药师、技师和感控团队留言，回复结果可同步患者端、护理执行和工作日志。</p></div><div class="clinical-actions"><el-button type="primary" :icon="Message" @click="openReply()">回复留言</el-button><el-button :icon="CircleCheck" @click="openClose(rows[0])">关闭留言</el-button></div></div></template>
      <el-form class="clinical-filter" inline><el-form-item label="关键字"><el-input placeholder="患者、主题、来源、内容" clearable /></el-form-item><el-form-item label="优先级"><el-select placeholder="全部优先级" clearable><el-option label="高" value="高" /><el-option label="中" value="中" /><el-option label="低" value="低" /></el-select></el-form-item><el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="待回复" value="待回复" /><el-option label="处理中" value="处理中" /><el-option label="已回复" value="已回复" /></el-select></el-form-item><el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item></el-form>
      <el-table :data="rows" border stripe><el-table-column prop="id" label="留言号" width="105" fixed="left" /><el-table-column prop="patient" label="患者" width="100" /><el-table-column prop="topic" label="主题" min-width="150" /><el-table-column prop="from" label="来源" width="110" /><el-table-column prop="adviceRecord" label="医疗护理建议记录" min-width="150" /><el-table-column prop="handover" label="是否交班记录" width="120" /><el-table-column prop="content" label="医疗护理建议" min-width="220" /><el-table-column prop="priority" label="优先级" width="85"><template #default="{ row }"><el-tag :type="tagType(row.priority)">{{ row.priority }}</el-tag></template></el-table-column><el-table-column prop="status" label="状态" width="105"><template #default="{ row }"><el-tag :type="tagType(row.status)" effect="plain">{{ row.status }}</el-tag></template></el-table-column><el-table-column prop="owner" label="医生" width="95" /><el-table-column prop="nextAction" label="下一步" min-width="130" /><el-table-column label="操作" width="210" fixed="right"><template #default="{ row }"><el-button link type="primary" @click="openReply(row)">回复</el-button><el-button link @click="openClose(row)">关闭</el-button><el-button link @click="openTrace(row)">追溯</el-button></template></el-table-column></el-table>
    </el-card>    <el-dialog v-model="replyDialogVisible" title="留言回复" width="620px"><el-form label-width="100px"><el-form-item label="留言"><el-input :model-value="selected?.topic" disabled /></el-form-item><el-form-item label="回复对象"><el-input :model-value="selected?.from" /></el-form-item><el-form-item label="回复内容"><el-input type="textarea" :rows="4" placeholder="填写明确处理意见、注意事项或下一步安排" /></el-form-item><el-form-item label="同步范围"><el-checkbox-group model-value="source"><el-checkbox-button label="source">来源端</el-checkbox-button><el-checkbox-button label="log">工作日志</el-checkbox-button><el-checkbox-button label="event">临床事件</el-checkbox-button></el-checkbox-group></el-form-item></el-form><template #footer><el-button @click="replyDialogVisible = false">取消</el-button><el-button type="primary" @click="replyDialogVisible = false; submitAction('留言已回复')">提交回复</el-button></template></el-dialog>
    <el-dialog v-model="closeDialogVisible" title="留言关闭" width="560px"><el-form label-width="100px"><el-form-item label="留言"><el-input :model-value="selected?.id" disabled /></el-form-item><el-form-item label="关闭结果"><el-radio-group model-value="close"><el-radio-button label="close">关闭</el-radio-button><el-radio-button label="follow">继续跟踪</el-radio-button></el-radio-group></el-form-item><el-form-item label="说明"><el-input type="textarea" :rows="3" /></el-form-item></el-form><template #footer><el-button @click="closeDialogVisible = false">取消</el-button><el-button type="primary" @click="closeDialogVisible = false; submitAction('留言状态已更新')">提交</el-button></template></el-dialog>
    <el-drawer v-model="traceDrawerVisible" title="留言追溯" size="520px"><el-timeline><el-timeline-item timestamp="2026-05-10 08:10" type="primary">收到留言：{{ selected?.topic }}</el-timeline-item><el-timeline-item timestamp="2026-05-10 08:30">医生回复并同步来源端</el-timeline-item><el-timeline-item timestamp="2026-05-10 09:00" type="success">关闭并写入审计</el-timeline-item></el-timeline></el-drawer>
  </section>
</template>
