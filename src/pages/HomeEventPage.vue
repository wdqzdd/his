<script setup lang="ts">
import { ref } from 'vue';
import { CircleCheck, DocumentAdd, FirstAidKit, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

type EventRecord = {
  id: string;
  patient: string;
  eventType: string;
  occurredAt: string;
  description: string;
  triage: string;
  handler: string;
  status: string;
  risk: string;
  nextAction: string;
};

const reportDialogVisible = ref(false);
const historyDialogVisible = ref(false);
const triageDialogVisible = ref(false);
const closeDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const selected = ref<EventRecord | null>(null);

const rows: EventRecord[] = [
  { id: 'EVT-001', patient: '王建国', eventType: '胸闷胸痛', occurredAt: '2026-05-10 02:10', description: '夜间胸闷10分钟后缓解', triage: '医生复核', handler: '刘主任', status: '处理中', risk: '高', nextAction: '电话评估' },
  { id: 'EVT-002', patient: '李秀兰', eventType: '导管异常', occurredAt: '2026-05-10 08:00', description: '导管口发红伴渗液', triage: '感控筛查', handler: '赵玲', status: '预警联动', risk: '高', nextAction: '感控处理' },
  { id: 'EVT-003', patient: '赵明', eventType: '发热感染', occurredAt: '2026-05-09 20:30', description: '体温38.1，隔离患者', triage: '建议来院', handler: '张明', status: '待复诊', risk: '高', nextAction: '预约复诊' },
  { id: 'EVT-004', patient: '陈志强', eventType: '气促水肿', occurredAt: '2026-05-10 06:40', description: '气促、下肢水肿加重', triage: '急诊建议', handler: '王主任', status: '已转急诊', risk: '高', nextAction: '急诊跟踪' },
  { id: 'EVT-005', patient: '周萍', eventType: '用药不适', occurredAt: '2026-05-10 10:20', description: '服药后恶心', triage: '医生留言', handler: '陈宁', status: '待确认', risk: '中', nextAction: '调整用药' },
  { id: 'EVT-006', patient: '郑军', eventType: '血压异常', occurredAt: '2026-05-10 11:15', description: '家庭血压168/96', triage: '护士随访', handler: '周敏', status: '处理中', risk: '中', nextAction: '复测血压' },
  { id: 'EVT-007', patient: '韩梅', eventType: '低血糖', occurredAt: '2026-05-10 12:00', description: '餐前头晕，血糖3.6', triage: '宣教处理', handler: '赵玲', status: '已关闭', risk: '中', nextAction: '健康档案' },
  { id: 'EVT-008', patient: '林建平', eventType: '导管异常', occurredAt: '2026-05-10 13:20', description: '导管敷料渗液', triage: '感控筛查', handler: '感控护士', status: '整改中', risk: '高', nextAction: '复查关闭' },
  { id: 'EVT-009', patient: '孙丽', eventType: '恶心呕吐', occurredAt: '2026-05-10 14:05', description: '透析前恶心', triage: '医生评估', handler: '陈宁', status: '待确认', risk: '中', nextAction: '病情评估' },
  { id: 'EVT-010', patient: '马强', eventType: '穿刺点淤青', occurredAt: '2026-05-10 16:10', description: '穿刺点淤青无出血', triage: '护士宣教', handler: '赵玲', status: '已关闭', risk: '低', nextAction: '继续观察' },
];

const activeTables = ['clinical_event', 'home_clinical_event', 'patient_medical_history', 'warning_event', 'doctor_follow_task', 'nursing_follow_record'];

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value === '已关闭' || value === '低') return 'success';
  if (value === '高' || value.includes('急诊') || value.includes('预警')) return 'danger';
  if (value.includes('待') || value.includes('中') || value === '中') return 'warning';
  return 'info';
}

function openReport(row?: EventRecord): void {
  selected.value = row ?? rows[0];
  reportDialogVisible.value = true;
}

function openTriage(row: EventRecord): void {
  selected.value = row;
  triageDialogVisible.value = true;
}

function openClose(row: EventRecord): void {
  selected.value = row;
  closeDialogVisible.value = true;
}

function openTrace(row: EventRecord): void {
  selected.value = row;
  traceDrawerVisible.value = true;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}
</script>

<template>
  <section class="home-patient-page">
    <el-card class="home-work-card" shadow="never">
      <template #header>
        <div class="home-header">
          <div>
            <h2>{{ context.menuTitle }}</h2>
            <p>患者主动上报临床事件，也可维护就诊史、住院史、手术史、专科特殊治疗史、并发症和过敏史。</p>
          </div>
          <div class="home-actions">
            <el-button type="primary" :icon="FirstAidKit" @click="openReport()">上报事件</el-button>
            <el-button :icon="DocumentAdd" @click="historyDialogVisible = true">维护病史</el-button>
            <el-button :icon="CircleCheck" @click="openTriage(rows[0])">分诊处理</el-button>
          </div>
        </div>
      </template>

      <el-alert class="home-filter" type="warning" show-icon :closable="false" title="胸痛、严重呼吸困难、意识异常、大出血等紧急情况应立即线下就医或拨打急救电话。" />

      <el-form class="home-filter" inline>
        <el-form-item label="关键字"><el-input placeholder="患者、事件类型、描述、处理人" clearable /></el-form-item>
        <el-form-item label="事件类型"><el-select placeholder="全部类型" clearable><el-option label="就诊史" value="就诊史" /><el-option label="住院史" value="住院史" /><el-option label="手术史" value="手术史" /><el-option label="专科特殊治疗史" value="专科特殊治疗史" /><el-option label="并发症" value="并发症" /><el-option label="过敏史" value="过敏史" /></el-select></el-form-item>
        <el-form-item label="风险"><el-select placeholder="全部风险" clearable><el-option label="高" value="高" /><el-option label="中" value="中" /><el-option label="低" value="低" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <el-table :data="rows" border stripe>
        <el-table-column prop="id" label="事件号" width="105" fixed="left" />
        <el-table-column prop="patient" label="患者" width="100" />
        <el-table-column prop="eventType" label="事件类型" width="120" />
        <el-table-column prop="occurredAt" label="发生时间" width="150" />
        <el-table-column prop="description" label="描述" min-width="190" />
        <el-table-column prop="triage" label="分诊结论" min-width="120" />
        <el-table-column prop="handler" label="处理人" width="105" />
        <el-table-column prop="status" label="状态" width="110"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="risk" label="风险" width="80"><template #default="{ row }"><el-tag :type="tagType(row.risk)" effect="plain">{{ row.risk }}</el-tag></template></el-table-column>
        <el-table-column prop="nextAction" label="下一步" min-width="120" />
        <el-table-column label="操作" width="230" fixed="right">
          <template #default="{ row }"><el-button link type="primary" @click="openReport(row)">补充</el-button><el-button link @click="openTriage(row)">处理</el-button><el-button link @click="openClose(row)">关闭</el-button><el-button link @click="openTrace(row)">追溯</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="reportDialogVisible" title="上报/补充临床事件" width="680px">
      <el-form label-width="110px">
        <el-form-item label="患者"><el-input :model-value="selected?.patient" /></el-form-item>
        <el-form-item label="事件类型"><el-select :model-value="selected?.eventType"><el-option label="胸闷胸痛" value="胸闷胸痛" /><el-option label="导管异常" value="导管异常" /><el-option label="发热感染" value="发热感染" /><el-option label="通路异常" value="通路异常" /><el-option label="用药不适" value="用药不适" /></el-select></el-form-item>
        <el-form-item label="发生时间"><el-date-picker type="datetime" /></el-form-item>
        <el-form-item label="家庭测量"><el-input placeholder="血压、体温、血糖、体重或血氧" /></el-form-item>
        <el-form-item label="描述"><el-input type="textarea" :rows="3" :model-value="selected?.description" placeholder="症状、持续时间、已采取措施、当前状态" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="reportDialogVisible = false">取消</el-button><el-button type="primary" @click="reportDialogVisible = false; submitAction('临床事件已提交，护士站将收到分诊待办')">提交事件</el-button></template>
    </el-dialog>

    <el-dialog v-model="historyDialogVisible" title="维护临床病史事件" width="700px">
      <el-form label-width="120px">
        <el-form-item label="病史类型"><el-select model-value="visit"><el-option label="就诊史" value="visit" /><el-option label="住院史" value="inpatient" /><el-option label="手术史" value="surgery" /><el-option label="专科特殊治疗史" value="special" /><el-option label="并发症" value="complication" /><el-option label="过敏史" value="allergy" /></el-select></el-form-item>
        <el-form-item label="发生/起始日期"><el-date-picker type="date" /></el-form-item>
        <el-form-item label="医院/科室"><el-input placeholder="填写就诊医院、科室或治疗机构" /></el-form-item>
        <el-form-item label="病史说明"><el-input type="textarea" :rows="3" placeholder="填写诊断、治疗、手术、并发症、过敏原、处理结果和当前影响" /></el-form-item>
        <el-form-item label="附件"><el-upload drag action="#"><div class="el-upload__text">上传病历、出院小结、手术记录或过敏证明</div></el-upload></el-form-item>
      </el-form>
      <template #footer><el-button @click="historyDialogVisible = false">取消</el-button><el-button type="primary" @click="historyDialogVisible = false; submitAction('病史事件已提交医生确认')">提交病史</el-button></template>
    </el-dialog>

    <el-dialog v-model="triageDialogVisible" title="事件分诊处理" width="660px">
      <el-alert v-if="selected?.risk === '高'" type="warning" show-icon :closable="false" title="高风险事件应明确医生处理、来院复诊或急诊建议。" />
      <el-form class="dialog-form" label-width="110px">
        <el-form-item label="事件"><el-input :model-value="selected ? `${selected.id} / ${selected.eventType}` : ''" disabled /></el-form-item>
        <el-form-item label="处理结论"><el-radio-group model-value="doctor"><el-radio-button label="nurse">护士随访</el-radio-button><el-radio-button label="doctor">医生处理</el-radio-button><el-radio-button label="infection">感控处理</el-radio-button><el-radio-button label="er">急诊建议</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="处理意见"><el-input type="textarea" :rows="3" placeholder="记录电话沟通、就医建议、药物调整、复查要求和关闭条件" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="triageDialogVisible = false">取消</el-button><el-button type="primary" @click="triageDialogVisible = false; submitAction('事件分诊已提交并回写责任团队')">提交处理</el-button></template>
    </el-dialog>

    <el-dialog v-model="closeDialogVisible" title="事件关闭复核" width="600px">
      <el-form label-width="110px">
        <el-form-item label="事件"><el-input :model-value="selected?.id" disabled /></el-form-item>
        <el-form-item label="关闭结果"><el-radio-group model-value="close"><el-radio-button label="close">关闭</el-radio-button><el-radio-button label="follow">继续随访</el-radio-button><el-radio-button label="cqi">转CQI</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="关闭说明"><el-input type="textarea" :rows="3" placeholder="记录症状转归、复查结果、患者确认和后续计划" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="closeDialogVisible = false">取消</el-button><el-button type="primary" @click="closeDialogVisible = false; submitAction('事件关闭结果已归档')">提交关闭</el-button></template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="临床事件追溯" size="540px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-10 02:10" type="primary">患者上报事件：{{ selected?.eventType }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 02:15">系统按症状和风险阈值生成分诊待办</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 08:30" type="success">医护处理后回写健康档案、预警或随访记录</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
