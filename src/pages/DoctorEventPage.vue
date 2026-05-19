<script setup lang="ts">
import { ref } from 'vue';
import { CircleCheck, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

type EventRow = {
  id: string;
  patient: string;
  eventType: string;
  historyType: string;
  source: string;
  level: string;
  description: string;
  handler: string;
  status: string;
  deadline: string;
  nextAction: string;
};

const handleDialogVisible = ref(false);
const closeDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const selected = ref<EventRow | null>(null);

const rows: EventRow[] = [
  { id: 'CE-001', patient: '赵明', eventType: '危急值', historyType: '就诊史', source: '检验科血钾', level: '高', description: '血钾5.9mmol/L，需复查并调整处方', handler: '张明', status: '待处理', deadline: '2026-05-10 10:00', nextAction: '处理危急值' },
  { id: 'CE-002', patient: '李秀兰', eventType: '导管异常', historyType: '住院史', source: '居家事件', level: '高', description: '导管出口红肿', handler: '陈宁', status: '处理中', deadline: '2026-05-10 12:00', nextAction: '感控协同' },
  { id: 'CE-003', patient: '陈志强', eventType: '通路风险', historyType: '手术史', source: '护士通路记录', level: '中', description: '人工血管震颤稍弱', handler: '刘主任', status: '待复查', deadline: '2026-05-12 17:00', nextAction: '通路超声' },
  { id: 'CE-004', patient: '刘梅英', eventType: '贫血预警', historyType: '专科特殊治疗史', source: '检验趋势', level: '中', description: 'Hb 89g/L，促红素需调整', handler: '陈宁', status: '待处理', deadline: '2026-05-11 12:00', nextAction: '调整医嘱' },
  { id: 'CE-005', patient: '周庆', eventType: '低血压事件', historyType: 'MACE', source: '治疗记录', level: '高', description: '透中低血压伴心衰风险', handler: '王主任', status: '处理中', deadline: '2026-05-11 09:00', nextAction: '限制超滤' },
  { id: 'CE-006', patient: '何雪', eventType: '用药调整', historyType: '过敏史', source: '血磷趋势', level: '中', description: '血磷持续偏高', handler: '刘主任', status: '已关闭', deadline: '2026-05-12 18:00', nextAction: '复查血磷' },
  { id: 'CE-007', patient: '郭强', eventType: '疗效未达标', historyType: '并发症', source: 'Kt/V', level: '高', description: 'Kt/V 1.18，充分性不足', handler: '张明', status: '待处理', deadline: '2026-05-11 18:00', nextAction: '处方调整' },
  { id: 'CE-008', patient: '马丽', eventType: '隔离管理', historyType: '传染病史', source: '感染标志', level: '中', description: '乙肝隔离标识持续阳性', handler: '张明', status: '已关闭', deadline: '2026-05-12 12:00', nextAction: '隔离排班' },
  { id: 'CE-009', patient: '孙海', eventType: '用药确认', historyType: '就诊史', source: '患者留言', level: '低', description: '左卡尼汀用药咨询', handler: '刘主任', status: '已关闭', deadline: '2026-05-11 17:00', nextAction: '患者已读' },
  { id: 'CE-010', patient: '潘德胜', eventType: '跌倒风险', historyType: '住院史', source: '护士评估', level: '中', description: '透后离室需家属陪同', handler: '王主任', status: '待复查', deadline: '2026-05-12 17:00', nextAction: '护理宣教' },
];

const activeTables = ['clinical_event', 'warning_event', 'critical_value_notice', 'event_handle_log'];

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value === '已关闭' || value === '低') return 'success';
  if (value === '高' || value === '待处理') return 'danger';
  if (value.includes('待') || value.includes('中') || value === '中') return 'warning';
  return 'info';
}

function openHandle(row: EventRow): void {
  selected.value = row;
  handleDialogVisible.value = true;
}

function openClose(row: EventRow): void {
  selected.value = row;
  closeDialogVisible.value = true;
}

function openTrace(row: EventRow): void {
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
          <div>
            <h2>{{ context.menuTitle }}</h2>
            <p>医生处理危急值、并发症、通路异常、疗效未达标、患者上报和护理评估生成的临床事件。</p>
          </div>
          <div class="clinical-actions">
            <el-button type="primary" :icon="Warning" @click="openHandle(rows[0])">处理事件</el-button>
            <el-button :icon="CircleCheck" @click="openClose(rows[1])">复核关闭</el-button>
          </div>
        </div>
      </template>

      <el-form class="clinical-filter" inline>
        <el-form-item label="关键字"><el-input placeholder="患者、事件、来源、处理人" clearable /></el-form-item>
        <el-form-item label="事件类型"><el-select placeholder="全部类型" clearable><el-option label="危急值" value="危急值" /><el-option label="导管异常" value="导管异常" /><el-option label="疗效未达标" value="疗效未达标" /><el-option label="低血压事件" value="低血压事件" /></el-select></el-form-item>
        <el-form-item label="病史类型"><el-select placeholder="全部病史" clearable><el-option label="就诊史" value="就诊史" /><el-option label="住院史" value="住院史" /><el-option label="手术史" value="手术史" /><el-option label="专科特殊治疗史" value="专科特殊治疗史" /><el-option label="并发症" value="并发症" /><el-option label="过敏史" value="过敏史" /><el-option label="MACE" value="MACE" /></el-select></el-form-item>
        <el-form-item label="等级"><el-select placeholder="全部等级" clearable><el-option label="高" value="高" /><el-option label="中" value="中" /><el-option label="低" value="低" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <el-table :data="rows" border stripe>
        <el-table-column prop="id" label="事件号" width="105" fixed="left" />
        <el-table-column prop="patient" label="患者" width="100" />
        <el-table-column prop="eventType" label="事件类型" width="120" />
        <el-table-column prop="historyType" label="病史/事件归类" min-width="130" />
        <el-table-column prop="source" label="来源" min-width="135" />
        <el-table-column prop="level" label="等级" width="80"><template #default="{ row }"><el-tag :type="tagType(row.level)">{{ row.level }}</el-tag></template></el-table-column>
        <el-table-column prop="description" label="描述" min-width="230" />
        <el-table-column prop="handler" label="处理医生" width="105" />
        <el-table-column prop="status" label="状态" width="105"><template #default="{ row }"><el-tag :type="tagType(row.status)" effect="plain">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="deadline" label="时限" width="150" />
        <el-table-column prop="nextAction" label="下一步" min-width="130" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }"><el-button link type="primary" @click="openHandle(row)">处理</el-button><el-button link @click="openClose(row)">关闭</el-button><el-button link @click="openTrace(row)">追溯</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="handleDialogVisible" title="临床事件处理" width="660px">
      <el-alert v-if="selected?.level === '高'" type="warning" show-icon :closable="false" title="高等级事件需明确处理措施、复查时限和关闭条件。" />
      <el-form class="dialog-form" label-width="110px">
        <el-form-item label="事件"><el-input :model-value="selected ? `${selected.id} / ${selected.eventType}` : ''" disabled /></el-form-item>
        <el-form-item label="处理方式"><el-checkbox-group model-value="record"><el-checkbox-button label="record">写病程</el-checkbox-button><el-checkbox-button label="order">调整医嘱</el-checkbox-button><el-checkbox-button label="recheck">复查</el-checkbox-button><el-checkbox-button label="cqi">转CQI</el-checkbox-button></el-checkbox-group></el-form-item>
        <el-form-item label="处理意见"><el-input type="textarea" :rows="3" placeholder="记录原因分析、处置、用药/处方调整和复查要求" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="handleDialogVisible = false">取消</el-button><el-button type="primary" @click="handleDialogVisible = false; submitAction('临床事件处理结果已保存')">提交处理</el-button></template>
    </el-dialog>

    <el-dialog v-model="closeDialogVisible" title="事件复核关闭" width="600px">
      <el-form label-width="110px">
        <el-form-item label="事件"><el-input :model-value="selected?.id" disabled /></el-form-item>
        <el-form-item label="关闭结果"><el-radio-group model-value="close"><el-radio-button label="close">关闭</el-radio-button><el-radio-button label="follow">继续随访</el-radio-button><el-radio-button label="return">退回复查</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="关闭说明"><el-input type="textarea" :rows="3" placeholder="症状转归、复查结果、患者确认和下一步计划" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="closeDialogVisible = false">取消</el-button><el-button type="primary" @click="closeDialogVisible = false; submitAction('事件关闭复核已提交')">提交关闭</el-button></template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="临床事件追溯" size="540px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-10 07:42" type="danger">事件生成：{{ selected?.description }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 08:00">医生确认并记录处理意见</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 10:00" type="success">复查/关闭结果回写预警和健康档案</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
