<script setup lang="ts">
import { ref } from 'vue';
import { CircleCheck, EditPen, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

type PatientRow = {
  id: string;
  name: string;
  sexAge: string;
  dialysisNo: string;
  patientQueue: string;
  pendingType: string;
  schedule: string;
  bed: string;
  diagnosis: string;
  access: string;
  assessment: string;
  consent: string;
  labRisk: string;
  eventStatus: string;
  risk: string;
  nextAction: string;
};

const detailDrawerVisible = ref(false);
const assessDialogVisible = ref(false);
const eventDialogVisible = ref(false);
const selected = ref<PatientRow | null>(null);

const rows: PatientRow[] = [
  { id: 'P202604001', name: '王建国', sexAge: '男 / 62岁', dialysisNo: 'HD-00038', patientQueue: '我的分管患者', pendingType: '待审核患者', schedule: '05-10 上午班', bed: 'A区 08床', diagnosis: '终末期肾病 / 糖尿病肾病', access: '左前臂自体内瘘', assessment: '已完成', consent: '已签署', labRisk: '达标', eventStatus: '无待处理', risk: '低', nextAction: '可进入处方' },
  { id: 'P202604002', name: '李秀兰', sexAge: '女 / 71岁', dialysisNo: 'HD-00072', patientQueue: '重点关注患者', pendingType: '待处理检验异常患者', schedule: '05-10 上午班', bed: 'A区 12床', diagnosis: '慢性肾衰竭5期 / 高血压', access: '右颈内静脉长期导管', assessment: '待复评', consent: '已签署', labRisk: '白蛋白偏低', eventStatus: '导管出口红肿', risk: '中', nextAction: '先完成专科评估' },
  { id: 'P202604003', name: '赵明', sexAge: '男 / 45岁', dialysisNo: 'HD-00116', patientQueue: '预警患者', pendingType: '待签名患者', schedule: '05-10 下午班', bed: 'B区 03床', diagnosis: 'IgA肾病尿毒症期', access: '右前臂自体内瘘', assessment: '已完成', consent: '待签署', labRisk: '钾偏高', eventStatus: '危急值待处理', risk: '高', nextAction: '处理危急值并补同意书' },
  { id: 'P202604004', name: '陈志强', sexAge: '男 / 58岁', dialysisNo: 'HD-00128', patientQueue: '重点关注患者', pendingType: '待处理疗效不达标患者', schedule: '05-10 下午班', bed: 'B区 07床', diagnosis: '多囊肾 / 维持性血透', access: '左上臂人工血管', assessment: '已完成', consent: '已签署', labRisk: '磷偏高', eventStatus: '通路狭窄复查', risk: '中', nextAction: '复核通路事件' },
  { id: 'P202604005', name: '刘梅英', sexAge: '女 / 66岁', dialysisNo: 'HD-00151', patientQueue: '新收病人', pendingType: '待签名患者', schedule: '05-10 夜班', bed: 'C区 02床', diagnosis: '狼疮性肾炎尿毒症期', access: '股静脉临时导管', assessment: '待完成', consent: '待续签', labRisk: '血红蛋白低', eventStatus: '贫血随访', risk: '高', nextAction: '补评估与同意书' },
  { id: 'P202604006', name: '孙海', sexAge: '男 / 53岁', dialysisNo: 'HD-00177', patientQueue: '我的分管患者', pendingType: '待审核患者', schedule: '05-11 上午班', bed: 'A区 05床', diagnosis: '糖尿病肾病 / 冠心病', access: '左前臂自体内瘘', assessment: '已完成', consent: '已签署', labRisk: '达标', eventStatus: '无待处理', risk: '低', nextAction: '处方复用' },
  { id: 'P202604007', name: '马丽', sexAge: '女 / 39岁', dialysisNo: 'HD-00203', patientQueue: '预警患者', pendingType: '待审核患者', schedule: '05-11 上午班', bed: '隔离区 01床', diagnosis: '慢性肾衰竭5期 / 乙肝携带', access: '右前臂自体内瘘', assessment: '已完成', consent: '已签署', labRisk: '感染标志阳性', eventStatus: '隔离透析', risk: '中', nextAction: '确认隔离排班' },
  { id: 'P202604008', name: '周庆', sexAge: '男 / 74岁', dialysisNo: 'HD-00218', patientQueue: '重点关注患者', pendingType: '待处理检验异常患者', schedule: '05-11 下午班', bed: 'A区 16床', diagnosis: '高血压肾损害 / 心衰', access: '右颈内静脉长期导管', assessment: '待心功能评估', consent: '已签署', labRisk: 'BNP高', eventStatus: '低血压事件', risk: '高', nextAction: '补心功能评估' },
  { id: 'P202604009', name: '何雪', sexAge: '女 / 50岁', dialysisNo: 'HD-00246', patientQueue: '我的分管患者', pendingType: '待处理检验异常患者', schedule: '05-11 下午班', bed: 'B区 11床', diagnosis: '肾小球肾炎尿毒症期', access: '左前臂自体内瘘', assessment: '已完成', consent: '已签署', labRisk: '钙磷乘积高', eventStatus: '用药调整', risk: '中', nextAction: '复查检验' },
  { id: 'P202604010', name: '郭强', sexAge: '男 / 61岁', dialysisNo: 'HD-00277', patientQueue: '预警患者', pendingType: '待处理疗效不达标患者', schedule: '05-11 夜班', bed: 'C区 06床', diagnosis: '梗阻性肾病 / 维持性血透', access: '左上臂人工血管', assessment: '待完成', consent: '已签署', labRisk: '尿素清除不足', eventStatus: 'Kt/V低', risk: '高', nextAction: '补病程和疗效评估' },
];

const activeTables = ['patient_assignment', 'medical_record', 'patient_diagnosis', 'clinical_assessment', 'clinical_event'];

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (['低', '达标', '已完成', '已签署', '无待处理'].includes(value)) return 'success';
  if (value === '高' || value.includes('危急') || value.includes('待处理')) return 'danger';
  if (value.includes('待') || value.includes('偏') || value.includes('高') || value === '中') return 'warning';
  return 'info';
}

function openDetail(row: PatientRow): void {
  selected.value = row;
  detailDrawerVisible.value = true;
}

function openAssess(row: PatientRow): void {
  selected.value = row;
  assessDialogVisible.value = true;
}

function openEvent(row: PatientRow): void {
  selected.value = row;
  eventDialogVisible.value = true;
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
            <p>按责任医生展示患者、排班、机位、通路、诊断、评估、同意书、检验风险和临床事件状态。</p>
          </div>
          <div class="clinical-actions">
            <el-button type="primary" :icon="EditPen" @click="openDetail(rows[0])">查看患者</el-button>
            <el-button :icon="CircleCheck" @click="openAssess(rows[1])">补充评估</el-button>
            <el-button :icon="Warning" @click="openEvent(rows[2])">处理风险</el-button>
          </div>
        </div>
      </template>

      <el-form class="clinical-filter" inline>
        <el-form-item label="患者"><el-input placeholder="姓名、透析号、床位" clearable /></el-form-item>
        <el-form-item label="治疗日期"><el-date-picker type="date" placeholder="选择日期" /></el-form-item>
        <el-form-item label="责任范围"><el-select model-value="mine"><el-option label="我的患者" value="mine" /><el-option label="本组患者" value="team" /><el-option label="今日全部" value="today" /></el-select></el-form-item>
        <el-form-item label="患者队列"><el-select placeholder="全部队列" clearable><el-option label="我的分管患者" value="我的分管患者" /><el-option label="新收病人" value="新收病人" /><el-option label="重点关注患者" value="重点关注患者" /><el-option label="预警患者" value="预警患者" /></el-select></el-form-item>
        <el-form-item label="待办类型"><el-select placeholder="全部待办" clearable><el-option label="待签名患者" value="待签名患者" /><el-option label="待审核患者" value="待审核患者" /><el-option label="待处理检验异常患者" value="待处理检验异常患者" /><el-option label="待处理疗效不达标患者" value="待处理疗效不达标患者" /></el-select></el-form-item>
        <el-form-item label="风险"><el-select placeholder="全部风险" clearable><el-option label="高" value="高" /><el-option label="中" value="中" /><el-option label="低" value="低" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <el-table :data="rows" border stripe>
        <el-table-column prop="name" label="患者" width="95" fixed="left" />
        <el-table-column prop="sexAge" label="性别年龄" width="105" />
        <el-table-column prop="dialysisNo" label="透析号" width="115" />
        <el-table-column prop="patientQueue" label="患者队列" min-width="130" />
        <el-table-column prop="pendingType" label="待办类型" min-width="160" />
        <el-table-column prop="schedule" label="排班" width="120" />
        <el-table-column prop="bed" label="机位" width="105" />
        <el-table-column prop="diagnosis" label="主要诊断" min-width="190" />
        <el-table-column prop="access" label="当前通路" min-width="150" />
        <el-table-column prop="assessment" label="评估" width="110"><template #default="{ row }"><el-tag :type="tagType(row.assessment)">{{ row.assessment }}</el-tag></template></el-table-column>
        <el-table-column prop="consent" label="同意书" width="105"><template #default="{ row }"><el-tag :type="tagType(row.consent)" effect="plain">{{ row.consent }}</el-tag></template></el-table-column>
        <el-table-column prop="labRisk" label="检验风险" min-width="120"><template #default="{ row }"><el-tag :type="tagType(row.labRisk)" effect="plain">{{ row.labRisk }}</el-tag></template></el-table-column>
        <el-table-column prop="eventStatus" label="事件" min-width="130" />
        <el-table-column prop="risk" label="风险" width="80"><template #default="{ row }"><el-tag :type="tagType(row.risk)">{{ row.risk }}</el-tag></template></el-table-column>
        <el-table-column prop="nextAction" label="下一步" min-width="150" />
        <el-table-column label="操作" width="230" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openDetail(row)">详情</el-button>
            <el-button link @click="openAssess(row)">评估</el-button>
            <el-button link @click="openEvent(row)">事件</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-drawer v-model="detailDrawerVisible" title="患者诊疗详情" size="660px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="患者">{{ selected?.name }} / {{ selected?.dialysisNo }}</el-descriptions-item>
        <el-descriptions-item label="排班机位">{{ selected?.schedule }} / {{ selected?.bed }}</el-descriptions-item>
        <el-descriptions-item label="主要诊断">{{ selected?.diagnosis }}</el-descriptions-item>
        <el-descriptions-item label="当前通路">{{ selected?.access }}</el-descriptions-item>
        <el-descriptions-item label="下一步">{{ selected?.nextAction }}</el-descriptions-item>
      </el-descriptions>
    </el-drawer>

    <el-dialog v-model="assessDialogVisible" title="补充患者评估" width="640px">
      <el-form label-width="110px">
        <el-form-item label="患者"><el-input :model-value="selected?.name" disabled /></el-form-item>
        <el-form-item label="评估类型"><el-select model-value="dialysis"><el-option label="透析充分性评估" value="dialysis" /><el-option label="心血管风险评估" value="heart" /><el-option label="通路风险评估" value="access" /></el-select></el-form-item>
        <el-form-item label="评估结论"><el-input type="textarea" :rows="3" placeholder="记录诊疗结论、风险等级和处方前置建议" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="assessDialogVisible = false">取消</el-button><el-button type="primary" @click="assessDialogVisible = false; submitAction('患者评估已保存')">保存评估</el-button></template>
    </el-dialog>

    <el-dialog v-model="eventDialogVisible" title="风险事件处理" width="620px">
      <el-form label-width="110px">
        <el-form-item label="患者"><el-input :model-value="selected?.name" disabled /></el-form-item>
        <el-form-item label="处理结论"><el-radio-group model-value="follow"><el-radio-button label="follow">继续随访</el-radio-button><el-radio-button label="order">调整医嘱</el-radio-button><el-radio-button label="close">关闭事件</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="意见"><el-input type="textarea" :rows="3" placeholder="记录危急值、事件处理、复查要求和处方限制" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="eventDialogVisible = false">取消</el-button><el-button type="primary" @click="eventDialogVisible = false; submitAction('风险处理结果已回写')">提交处理</el-button></template>
    </el-dialog>
  </section>
</template>
