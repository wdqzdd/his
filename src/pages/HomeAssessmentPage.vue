<script setup lang="ts">
import { ref } from 'vue';
import { CircleCheck, DocumentAdd, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();

type AssessmentRecord = {
  id: string;
  type: string;
  patient: string;
  submittedAt: string;
  bp: string;
  weightGain: string;
  symptoms: string;
  access: string;
  medication: string;
  status: string;
  risk: string;
  nextAction: string;
};

const fillDialogVisible = ref(false);
const reviewDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const selected = ref<AssessmentRecord | null>(null);

const isSpecial = props.context.menuKey === 'home-special-assess';
const pageTitle = isSpecial ? '专科病情评估' : '常见病情评估';

const rows: AssessmentRecord[] = [
  { id: 'ASS-001', type: '透析间期', patient: '王建国', submittedAt: '2026-05-10 07:30', bp: '148/86', weightGain: '+2.1kg', symptoms: '轻度乏力', access: '震颤正常', medication: '按医嘱', status: '待审核', risk: '中', nextAction: '护士审核' },
  { id: 'ASS-002', type: '导管自查', patient: '李秀兰', submittedAt: '2026-05-10 08:10', bp: '136/78', weightGain: '+1.8kg', symptoms: '无发热', access: '导管口轻红', medication: '按医嘱', status: '预警待处理', risk: '高', nextAction: '感控筛查' },
  { id: 'ASS-003', type: '通路自查', patient: '赵明', submittedAt: '2026-05-10 08:40', bp: '142/82', weightGain: '+2.4kg', symptoms: '无胸闷', access: '内瘘震颤正常', medication: '漏服一次', status: '待审核', risk: '中', nextAction: '医生确认' },
  { id: 'ASS-004', type: '常见症状', patient: '陈志强', submittedAt: '2026-05-10 09:00', bp: '160/92', weightGain: '+3.0kg', symptoms: '胸闷、水肿', access: '无', medication: '不清楚', status: '已转事件', risk: '高', nextAction: '医生处理' },
  { id: 'ASS-005', type: '饮食用药', patient: '周萍', submittedAt: '2026-05-10 10:20', bp: '128/76', weightGain: '+1.2kg', symptoms: '无', access: '待建通路', medication: '按医嘱', status: '已归档', risk: '低', nextAction: '健康档案' },
  { id: 'ASS-006', type: '透析间期', patient: '郑军', submittedAt: '2026-05-10 11:15', bp: '150/84', weightGain: '+2.8kg', symptoms: '轻度气促', access: '震颤弱', medication: '按医嘱', status: '待审核', risk: '中', nextAction: '护士电话随访' },
  { id: 'ASS-007', type: '常见症状', patient: '韩梅', submittedAt: '2026-05-10 12:00', bp: '132/76', weightGain: '+1.5kg', symptoms: '无', access: '正常', medication: '按医嘱', status: '已归档', risk: '低', nextAction: '继续观察' },
  { id: 'ASS-008', type: '导管自查', patient: '林建平', submittedAt: '2026-05-10 13:20', bp: '138/80', weightGain: '+2.0kg', symptoms: '低热', access: '导管口渗液', medication: '按医嘱', status: '预警待处理', risk: '高', nextAction: '感控事件' },
  { id: 'ASS-009', type: '透析间期', patient: '孙丽', submittedAt: '2026-05-10 14:05', bp: '126/72', weightGain: '+1.0kg', symptoms: '恶心', access: '无', medication: '未用药', status: '待审核', risk: '中', nextAction: '医生评估' },
  { id: 'ASS-010', type: '通路自查', patient: '马强', submittedAt: '2026-05-10 16:10', bp: '140/82', weightGain: '+2.2kg', symptoms: '无', access: '穿刺点淤青', medication: '按医嘱', status: '待审核', risk: '中', nextAction: '护士复核' },
];

const activeTables = ['home_assessment', 'home_common_assessment', 'home_special_assessment', 'patient_health_profile', 'warning_event', 'nursing_follow_record'];

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value === '已归档' || value === '低') return 'success';
  if (value === '高' || value.includes('预警') || value.includes('事件')) return 'danger';
  if (value.includes('待') || value === '中') return 'warning';
  return 'info';
}

function openFill(row?: AssessmentRecord): void {
  selected.value = row ?? rows[0];
  fillDialogVisible.value = true;
}

function openReview(row: AssessmentRecord): void {
  selected.value = row;
  reviewDialogVisible.value = true;
}

function openTrace(row: AssessmentRecord): void {
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
            <h2>{{ pageTitle }}</h2>
            <p>{{ isSpecial ? '采集血液净化前评估、内瘘日常评估、静脉导管评估、通路手术史回顾和透后不适上报。' : '采集身高体重、生命体征、微量血糖、24小时尿量、一般情况和评估量表。' }}</p>
          </div>
          <div class="home-actions">
            <el-button type="primary" :icon="DocumentAdd" @click="openFill()">填写评估</el-button>
            <el-button :icon="CircleCheck" @click="openReview(rows[0])">审核评估</el-button>
          </div>
        </div>
      </template>

      <el-form class="home-filter" inline>
        <el-form-item label="关键字"><el-input placeholder="患者、症状、通路、评估号" clearable /></el-form-item>
        <el-form-item label="类型">
          <el-select placeholder="全部类型" clearable>
            <template v-if="!isSpecial">
              <el-option label="身高体重" value="身高体重" />
              <el-option label="生命体征" value="生命体征" />
              <el-option label="微量血糖" value="微量血糖" />
              <el-option label="24小时尿量" value="24小时尿量" />
              <el-option label="一般情况" value="一般情况" />
              <el-option label="评估量表" value="评估量表" />
            </template>
            <template v-else>
              <el-option label="血液净化前评估" value="血液净化前评估" />
              <el-option label="内瘘日常评估" value="内瘘日常评估" />
              <el-option label="静脉导管评估" value="静脉导管评估" />
              <el-option label="通路手术史回顾" value="通路手术史回顾" />
              <el-option label="透后不适上报" value="透后不适上报" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="风险"><el-select placeholder="全部风险" clearable><el-option label="高" value="高" /><el-option label="中" value="中" /><el-option label="低" value="低" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <el-table :data="rows" border stripe>
        <el-table-column prop="id" label="评估号" width="105" fixed="left" />
        <el-table-column prop="type" label="类型" width="110" />
        <el-table-column prop="patient" label="患者" width="100" />
        <el-table-column prop="submittedAt" label="提交时间" width="150" />
        <el-table-column prop="bp" label="血压" width="95" />
        <el-table-column prop="weightGain" label="体重变化" width="100" />
        <el-table-column prop="symptoms" label="症状" min-width="145" />
        <el-table-column prop="access" label="通路/导管" min-width="140" />
        <el-table-column prop="medication" label="用药" width="100" />
        <el-table-column prop="status" label="状态" width="115"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="risk" label="风险" width="80"><template #default="{ row }"><el-tag :type="tagType(row.risk)" effect="plain">{{ row.risk }}</el-tag></template></el-table-column>
        <el-table-column prop="nextAction" label="下一步" min-width="130" />
        <el-table-column label="操作" width="210" fixed="right">
          <template #default="{ row }"><el-button link type="primary" @click="openFill(row)">填写</el-button><el-button link @click="openReview(row)">审核</el-button><el-button link @click="openTrace(row)">追溯</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="fillDialogVisible" title="居家病情评估表" width="700px">
      <el-form label-width="120px">
        <el-form-item label="患者"><el-input :model-value="selected?.patient" disabled /></el-form-item>
        <template v-if="!isSpecial">
          <el-form-item label="身高体重"><el-row :gutter="8"><el-col :span="12"><el-input placeholder="身高 cm" /></el-col><el-col :span="12"><el-input :model-value="selected?.weightGain" placeholder="体重/变化 kg" /></el-col></el-row></el-form-item>
          <el-form-item label="生命体征"><el-row :gutter="8"><el-col :span="8"><el-input :model-value="selected?.bp" placeholder="血压" /></el-col><el-col :span="8"><el-input placeholder="体温" /></el-col><el-col :span="8"><el-input placeholder="脉搏/呼吸" /></el-col></el-row></el-form-item>
          <el-form-item label="微量血糖"><el-input placeholder="填写空腹/餐后血糖和测量时间" /></el-form-item>
          <el-form-item label="24小时尿量"><el-input placeholder="填写 24 小时尿量 ml" /></el-form-item>
          <el-form-item label="一般情况"><el-checkbox-group model-value="fatigue"><el-checkbox-button label="fatigue">乏力</el-checkbox-button><el-checkbox-button label="fever">发热</el-checkbox-button><el-checkbox-button label="dyspnea">气促</el-checkbox-button><el-checkbox-button label="chest">胸闷胸痛</el-checkbox-button><el-checkbox-button label="edema">水肿</el-checkbox-button><el-checkbox-button label="bleeding">黑便/出血</el-checkbox-button></el-checkbox-group></el-form-item>
          <el-form-item label="评估量表"><el-input type="textarea" :rows="3" placeholder="填写营养、疼痛、跌倒、用药依从性等量表结果" /></el-form-item>
        </template>
        <template v-else>
          <el-form-item label="净化前评估"><el-input type="textarea" :rows="2" placeholder="体重增长、血压、症状、通路状态和透析准备情况" /></el-form-item>
          <el-form-item label="内瘘日常评估"><el-input placeholder="震颤、杂音、穿刺点、红肿疼痛或出血" /></el-form-item>
          <el-form-item label="静脉导管评估"><el-input placeholder="导管口红肿、渗液、敷料、发热或疼痛" /></el-form-item>
          <el-form-item label="通路手术史回顾"><el-input type="textarea" :rows="2" placeholder="手术名称、日期、医院、并发症和当前通畅情况" /></el-form-item>
          <el-form-item label="透后不适上报"><el-input type="textarea" :rows="3" placeholder="低血压、抽筋、胸闷、恶心、出血、通路不适和处理经过" /></el-form-item>
        </template>
      </el-form>
      <template #footer><el-button @click="fillDialogVisible = false">取消</el-button><el-button type="primary" @click="fillDialogVisible = false; submitAction('评估已提交，系统将按风险推送责任团队')">提交评估</el-button></template>
    </el-dialog>

    <el-dialog v-model="reviewDialogVisible" title="评估审核与处置" width="640px">
      <el-alert v-if="selected?.risk === '高'" type="warning" show-icon :closable="false" title="高风险评估需确认是否升级为临床事件或预警处置。" />
      <el-form class="dialog-form" label-width="110px">
        <el-form-item label="评估"><el-input :model-value="selected ? `${selected.id} / ${selected.patient}` : ''" disabled /></el-form-item>
        <el-form-item label="处置结果"><el-radio-group model-value="archive"><el-radio-button label="archive">归档</el-radio-button><el-radio-button label="follow">电话随访</el-radio-button><el-radio-button label="event">转临床事件</el-radio-button><el-radio-button label="warning">生成预警</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="审核意见"><el-input type="textarea" :rows="3" placeholder="记录风险判断、随访建议和回写结果" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="reviewDialogVisible = false">取消</el-button><el-button type="primary" @click="reviewDialogVisible = false; submitAction('评估审核结果已回写')">提交审核</el-button></template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="评估追溯" size="520px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-10 07:30" type="primary">患者提交评估：{{ selected?.id }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 07:31">系统完成风险判定：{{ selected?.risk }}风险</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 08:00" type="success">医护审核后写入健康档案或预警事件</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
