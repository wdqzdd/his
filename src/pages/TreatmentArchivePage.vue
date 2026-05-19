<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  CircleCheck,
  DocumentChecked,
  EditPen,
  Files,
  Printer,
  Search,
  Warning,
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

type ArchiveRow = {
  id: string;
  patient: string;
  dialysisNo: string;
  sessionDate: string;
  shiftBed: string;
  mode: string;
  summaryStatus: string;
  disinfectionStatus: string;
  sheetStatus: string;
  doctorSign: string;
  nurseSign: string;
  patientSign: string;
  reviewStatus: string;
  archiveStatus: string;
  version: string;
  risk: string;
  nextAction: string;
};

const selectedArchiveId = ref('AR-001');
const summaryDialogVisible = ref(false);
const disinfectionDialogVisible = ref(false);
const sheetDrawerVisible = ref(false);
const signDialogVisible = ref(false);
const reviewDialogVisible = ref(false);
const returnDialogVisible = ref(false);
const versionDrawerVisible = ref(false);

const archives = ref<ArchiveRow[]>([
  { id: 'AR-001', patient: '王建国', dialysisNo: 'HD-00038', sessionDate: '2026-05-10', shiftBed: '上午班 / A区08床', mode: 'HD', summaryStatus: '已完成', disinfectionStatus: '已记录', sheetStatus: '已生成', doctorSign: '已签名', nurseSign: '已签名', patientSign: '待确认', reviewStatus: '待提交', archiveStatus: '未归档', version: 'v1', risk: '低', nextAction: '补患者确认' },
  { id: 'AR-002', patient: '李秀兰', dialysisNo: 'HD-00072', sessionDate: '2026-05-10', shiftBed: '上午班 / A区12床', mode: 'HD', summaryStatus: '待补充', disinfectionStatus: '已记录', sheetStatus: '草稿', doctorSign: '未签名', nurseSign: '已签名', patientSign: '未签名', reviewStatus: '未提交', archiveStatus: '未归档', version: 'v1', risk: '中', nextAction: '补治疗小结' },
  { id: 'AR-003', patient: '赵明', dialysisNo: 'HD-00116', sessionDate: '2026-05-10', shiftBed: '下午班 / B区03床', mode: 'HD', summaryStatus: '退回修改', disinfectionStatus: '未记录', sheetStatus: '草稿', doctorSign: '未签名', nurseSign: '未签名', patientSign: '未签名', reviewStatus: '已退回', archiveStatus: '未归档', version: 'v2', risk: '高', nextAction: '处理退回意见' },
  { id: 'AR-004', patient: '陈志强', dialysisNo: 'HD-00128', sessionDate: '2026-05-10', shiftBed: '下午班 / B区07床', mode: 'HD+HF', summaryStatus: '已完成', disinfectionStatus: '已记录', sheetStatus: '已生成', doctorSign: '已签名', nurseSign: '已签名', patientSign: '已确认', reviewStatus: '待审核', archiveStatus: '待归档', version: 'v1', risk: '中', nextAction: '审核归档' },
  { id: 'AR-005', patient: '刘梅英', dialysisNo: 'HD-00151', sessionDate: '2026-05-10', shiftBed: '夜班 / C区02床', mode: 'HD+HP', summaryStatus: '待补充', disinfectionStatus: '待复核', sheetStatus: '草稿', doctorSign: '未签名', nurseSign: '未签名', patientSign: '未签名', reviewStatus: '未提交', archiveStatus: '未归档', version: 'v1', risk: '高', nextAction: '补专项记录' },
  { id: 'AR-006', patient: '孙海', dialysisNo: 'HD-00177', sessionDate: '2026-05-10', shiftBed: '上午班 / A区05床', mode: 'HD', summaryStatus: '已完成', disinfectionStatus: '已记录', sheetStatus: '已生成', doctorSign: '已签名', nurseSign: '已签名', patientSign: '已确认', reviewStatus: '已审核', archiveStatus: '已归档', version: 'v1', risk: '低', nextAction: '可查阅' },
  { id: 'AR-007', patient: '马丽', dialysisNo: 'HD-00203', sessionDate: '2026-05-10', shiftBed: '上午班 / 隔离区01床', mode: '隔离HD', summaryStatus: '已完成', disinfectionStatus: '待复核', sheetStatus: '已生成', doctorSign: '已签名', nurseSign: '已签名', patientSign: '已确认', reviewStatus: '待审核', archiveStatus: '待归档', version: 'v1', risk: '中', nextAction: '复核隔离消毒' },
  { id: 'AR-008', patient: '周庆', dialysisNo: 'HD-00218', sessionDate: '2026-05-10', shiftBed: '下午班 / A区16床', mode: 'HD', summaryStatus: '已完成', disinfectionStatus: '已记录', sheetStatus: '已生成', doctorSign: '待签名', nurseSign: '已签名', patientSign: '已确认', reviewStatus: '未提交', archiveStatus: '未归档', version: 'v1', risk: '高', nextAction: '补医生签名' },
  { id: 'AR-009', patient: '何雪', dialysisNo: 'HD-00246', sessionDate: '2026-05-10', shiftBed: '下午班 / B区11床', mode: 'HD', summaryStatus: '已完成', disinfectionStatus: '已记录', sheetStatus: '已生成', doctorSign: '已签名', nurseSign: '已签名', patientSign: '已确认', reviewStatus: '已审核', archiveStatus: '已归档', version: 'v1', risk: '中', nextAction: '可查阅' },
  { id: 'AR-010', patient: '郭强', dialysisNo: 'HD-00277', sessionDate: '2026-05-10', shiftBed: '夜班 / C区06床', mode: 'HD', summaryStatus: '待补充', disinfectionStatus: '已记录', sheetStatus: '草稿', doctorSign: '未签名', nurseSign: '待签名', patientSign: '未签名', reviewStatus: '未提交', archiveStatus: '未归档', version: 'v1', risk: '高', nextAction: '补症状处理' },
  { id: 'AR-011', patient: '曹敏', dialysisNo: 'HD-00291', sessionDate: '2026-05-10', shiftBed: '上午班 / A区10床', mode: 'HD', summaryStatus: '已完成', disinfectionStatus: '已记录', sheetStatus: '已生成', doctorSign: '已签名', nurseSign: '已签名', patientSign: '已确认', reviewStatus: '已审核', archiveStatus: '已归档', version: 'v1', risk: '低', nextAction: '可查阅' },
  { id: 'AR-012', patient: '潘德胜', dialysisNo: 'HD-00305', sessionDate: '2026-05-10', shiftBed: '下午班 / B区15床', mode: 'HD', summaryStatus: '已完成', disinfectionStatus: '已记录', sheetStatus: '已生成', doctorSign: '已签名', nurseSign: '待签名', patientSign: '待确认', reviewStatus: '未提交', archiveStatus: '未归档', version: 'v1', risk: '中', nextAction: '补签名确认' },
]);

const selectedArchive = computed(() => archives.value.find((item) => item.id === selectedArchiveId.value) ?? archives.value[0]);

const metrics = computed(() => [
  { label: '待处理记录', value: archives.value.filter((item) => item.archiveStatus !== '已归档').length, tone: 'blue' },
  { label: '待审核', value: archives.value.filter((item) => item.reviewStatus === '待审核').length, tone: 'orange' },
  { label: '已归档', value: archives.value.filter((item) => item.archiveStatus === '已归档').length, tone: 'green' },
  { label: '退回修改', value: archives.value.filter((item) => item.reviewStatus === '已退回').length, tone: 'red' },
  { label: '签名缺项', value: archives.value.filter((item) => item.doctorSign !== '已签名' || item.nurseSign !== '已签名' || !item.patientSign.includes('已')).length, tone: 'orange' },
]);

const archiveChecks = computed(() => [
  { label: '治疗小结', value: selectedArchive.value.summaryStatus, pass: selectedArchive.value.summaryStatus === '已完成' },
  { label: '消毒记录', value: selectedArchive.value.disinfectionStatus, pass: selectedArchive.value.disinfectionStatus === '已记录' },
  { label: '记录单', value: selectedArchive.value.sheetStatus, pass: selectedArchive.value.sheetStatus === '已生成' },
  { label: '医生签名', value: selectedArchive.value.doctorSign, pass: selectedArchive.value.doctorSign === '已签名' },
  { label: '护士签名', value: selectedArchive.value.nurseSign, pass: selectedArchive.value.nurseSign === '已签名' },
  { label: '患者确认', value: selectedArchive.value.patientSign, pass: selectedArchive.value.patientSign === '已确认' },
]);

const activeTables = ['treatment_summary', 'disinfection_record', 'dialysis_record_sheet', 'signature_record', 'archive_review', 'record_version_history'];

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (['已完成', '已记录', '已生成', '已签名', '已确认', '已审核', '已归档', '低'].includes(value)) return 'success';
  if (['退回修改', '已退回', '未记录', '高', '未归档'].includes(value) || value.includes('未签名')) return 'danger';
  if (value.includes('待') || value === '草稿' || value === '中' || value.includes('补')) return 'warning';
  return 'info';
}

function selectArchive(row: ArchiveRow): void {
  selectedArchiveId.value = row.id;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}

function completeSummary(): void {
  selectedArchive.value.summaryStatus = '已完成';
  summaryDialogVisible.value = false;
  submitAction('治疗小结已保存');
}

function completeDisinfection(): void {
  selectedArchive.value.disinfectionStatus = '已记录';
  disinfectionDialogVisible.value = false;
  submitAction('消毒记录已保存并进入归档检查');
}

function signAll(): void {
  selectedArchive.value.doctorSign = '已签名';
  selectedArchive.value.nurseSign = '已签名';
  selectedArchive.value.patientSign = '已确认';
  signDialogVisible.value = false;
  submitAction('医生、护士和患者确认已完成');
}

function submitReview(): void {
  selectedArchive.value.reviewStatus = '待审核';
  selectedArchive.value.archiveStatus = '待归档';
  reviewDialogVisible.value = false;
  submitAction('记录已提交归档审核');
}

function approveArchive(): void {
  selectedArchive.value.reviewStatus = '已审核';
  selectedArchive.value.archiveStatus = '已归档';
  reviewDialogVisible.value = false;
  submitAction('治疗记录已归档，数据进入质控、报表、费用和患者档案');
}
</script>

<template>
  <section class="treatment-archive-page">
    <el-card class="archive-work-card" shadow="never">
      <template #header>
        <div class="archive-header">
          <div>
            <h2>治疗记录归档审核</h2>
            <p>汇总治疗过程、消毒、小结、记录单和签名，完整后提交审核归档，退回修改保留版本痕迹。</p>
          </div>
          <div class="archive-actions">
            <el-button type="primary" :icon="EditPen" @click="summaryDialogVisible = true">治疗小结</el-button>
            <el-button :icon="CircleCheck" @click="disinfectionDialogVisible = true">消毒记录</el-button>
            <el-button :icon="Files" @click="sheetDrawerVisible = true">记录单</el-button>
            <el-button :icon="DocumentChecked" @click="signDialogVisible = true">签名确认</el-button>
            <el-button :icon="Printer">打印</el-button>
          </div>
        </div>
      </template>

      <el-form class="archive-filter" inline>
        <el-form-item label="患者">
          <el-input placeholder="姓名、透析号、记录单号" clearable />
        </el-form-item>
        <el-form-item label="归档状态">
          <el-select placeholder="全部状态" clearable>
            <el-option label="未归档" value="draft" />
            <el-option label="待归档" value="pending" />
            <el-option label="已归档" value="archived" />
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select placeholder="全部审核" clearable>
            <el-option label="未提交" value="none" />
            <el-option label="待审核" value="pending" />
            <el-option label="已退回" value="returned" />
            <el-option label="已审核" value="approved" />
          </el-select>
        </el-form-item>
        <el-form-item label="治疗日期">
          <el-date-picker type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>

      <div class="archive-stat-grid">
        <el-card v-for="item in metrics" :key="item.label" :class="['archive-stat-card', item.tone]" shadow="never">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </el-card>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :xl="16">
          <el-card class="archive-main-card" shadow="never">
            <template #header>
              <div class="archive-card-header">
                <div>
                  <strong>待归档治疗记录</strong>
                  <p>示例数据不少于 10 条，覆盖小结、消毒、记录单、签名、审核、退回和历史版本状态。</p>
                </div>
                <el-tag type="primary" effect="plain">完整性检查通过后才能归档</el-tag>
              </div>
            </template>
            <el-table :data="archives" border stripe highlight-current-row row-key="id" @row-click="selectArchive">
              <el-table-column prop="patient" label="患者" width="95" fixed="left" />
              <el-table-column prop="dialysisNo" label="透析号" width="115" />
              <el-table-column prop="sessionDate" label="治疗日期" width="115" />
              <el-table-column prop="shiftBed" label="班次机位" min-width="150" />
              <el-table-column prop="mode" label="模式" width="90" />
              <el-table-column prop="summaryStatus" label="小结" width="100">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.summaryStatus)">{{ row.summaryStatus }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="disinfectionStatus" label="消毒" width="100">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.disinfectionStatus)" effect="plain">{{ row.disinfectionStatus }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="sheetStatus" label="记录单" width="100" />
              <el-table-column prop="doctorSign" label="医生签名" width="105" />
              <el-table-column prop="nurseSign" label="护士签名" width="105" />
              <el-table-column prop="patientSign" label="患者确认" width="105" />
              <el-table-column prop="reviewStatus" label="审核" width="100">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.reviewStatus)">{{ row.reviewStatus }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="archiveStatus" label="归档" width="100">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.archiveStatus)" effect="plain">{{ row.archiveStatus }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="version" label="版本" width="80" />
              <el-table-column prop="nextAction" label="下一步" min-width="130" />
              <el-table-column label="操作" width="270" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click.stop="selectArchive(row); sheetDrawerVisible = true">记录单</el-button>
                  <el-button link @click.stop="selectArchive(row); signDialogVisible = true">签名</el-button>
                  <el-button link @click.stop="selectArchive(row); reviewDialogVisible = true">审核</el-button>
                  <el-button link @click.stop="selectArchive(row); returnDialogVisible = true">退回</el-button>
                  <el-button link @click.stop="selectArchive(row); versionDrawerVisible = true">版本</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>

        <el-col :xs="24" :xl="8">
          <el-card class="archive-side-card" shadow="never">
            <template #header>
              <div class="archive-card-header">
                <strong>归档完整性检查</strong>
                <el-tag :type="tagType(selectedArchive.risk)">{{ selectedArchive.risk }}风险</el-tag>
              </div>
            </template>
            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="患者">{{ selectedArchive.patient }} / {{ selectedArchive.dialysisNo }}</el-descriptions-item>
              <el-descriptions-item label="治疗">{{ selectedArchive.sessionDate }} / {{ selectedArchive.shiftBed }}</el-descriptions-item>
              <el-descriptions-item label="状态">{{ selectedArchive.reviewStatus }} / {{ selectedArchive.archiveStatus }}</el-descriptions-item>
              <el-descriptions-item label="版本">{{ selectedArchive.version }}</el-descriptions-item>
            </el-descriptions>
            <div class="archive-check-list">
              <div v-for="item in archiveChecks" :key="item.label" class="archive-check-row">
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
                <el-icon :class="{ pass: item.pass, block: !item.pass }">
                  <CircleCheck v-if="item.pass" />
                  <Warning v-else />
                </el-icon>
              </div>
            </div>
            <div class="archive-quick-actions">
              <el-button type="primary" :disabled="archiveChecks.some((item) => !item.pass)" @click="submitReview">提交审核</el-button>
              <el-button :disabled="selectedArchive.reviewStatus !== '待审核'" @click="approveArchive">审核归档</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="archive-workspace-card" shadow="never">
      <template #header>
        <div class="archive-card-header">
          <div>
            <strong>记录单预览与版本痕迹</strong>
            <p>归档前可预览透析记录单，归档后修改必须产生新版本和审核痕迹。</p>
          </div>
          <el-button type="primary" :icon="Files" @click="sheetDrawerVisible = true">打开记录单</el-button>
        </div>
      </template>
      <div class="archive-preview-grid">
        <el-card shadow="never" class="archive-preview-card">
          <strong>治疗小结</strong>
          <p>本次治疗完成，实际超滤、症状处理、医嘱执行和透后状态已汇总。异常记录需医生确认后归档。</p>
          <el-tag :type="tagType(selectedArchive.summaryStatus)">{{ selectedArchive.summaryStatus }}</el-tag>
        </el-card>
        <el-card shadow="never" class="archive-preview-card">
          <strong>消毒记录</strong>
          <p>透析机、机位、管路和隔离流程消毒结果必须与治疗记录关联，异常影响感控统计。</p>
          <el-tag :type="tagType(selectedArchive.disinfectionStatus)">{{ selectedArchive.disinfectionStatus }}</el-tag>
        </el-card>
        <el-card shadow="never" class="archive-preview-card">
          <strong>修改痕迹</strong>
          <p>退回修改、勘误、补签名和重新归档均记录版本号、修改前后内容、审核人和时间。</p>
          <el-tag type="primary">{{ selectedArchive.version }}</el-tag>
        </el-card>
      </div>
    </el-card>

    <el-dialog v-model="summaryDialogVisible" title="治疗小结" width="660px">
      <el-form label-width="110px">
        <el-form-item label="患者">
          <el-input :model-value="`${selectedArchive.patient} / ${selectedArchive.sessionDate}`" />
        </el-form-item>
        <el-form-item label="充分性小结">
          <el-input type="textarea" :rows="3" placeholder="记录治疗时长、实际超滤、Kt/V、血压变化和处方达成情况" />
        </el-form-item>
        <el-form-item label="并发症">
          <el-input type="textarea" :rows="3" placeholder="记录低血压、肌痉挛、通路异常、处理措施和结局" />
        </el-form-item>
        <el-form-item label="医生建议">
          <el-input placeholder="下次处方、检验复查、用药或宣教建议" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="summaryDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="completeSummary">保存小结</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="disinfectionDialogVisible" title="消毒记录" width="640px">
      <el-form label-width="110px">
        <el-form-item label="设备/机位">
          <el-input :model-value="selectedArchive.shiftBed" />
        </el-form-item>
        <el-form-item label="消毒方式">
          <el-select model-value="chemical">
            <el-option label="化学消毒" value="chemical" />
            <el-option label="热消毒" value="heat" />
            <el-option label="隔离流程终末消毒" value="isolation" />
          </el-select>
        </el-form-item>
        <el-form-item label="结果">
          <el-radio-group model-value="pass">
            <el-radio-button label="pass">合格</el-radio-button>
            <el-radio-button label="review">待复核</el-radio-button>
            <el-radio-button label="fail">不合格</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="记录">
          <el-input type="textarea" :rows="3" placeholder="记录操作者、消毒时间、浓度、结果和异常处理" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="disinfectionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="completeDisinfection">保存消毒</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="signDialogVisible" title="签名确认" width="600px">
      <el-form label-width="110px">
        <el-form-item label="签名对象">
          <el-checkbox-group model-value="doctor">
            <el-checkbox-button label="doctor">医生</el-checkbox-button>
            <el-checkbox-button label="nurse">护士</el-checkbox-button>
            <el-checkbox-button label="patient">患者/家属</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="签名方式">
          <el-radio-group model-value="ca">
            <el-radio-button label="password">密码</el-radio-button>
            <el-radio-button label="ca">CA</el-radio-button>
            <el-radio-button label="scan">患者确认</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="签名口令">
          <el-input type="password" placeholder="请输入签名口令" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="signDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="signAll">确认签名</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="reviewDialogVisible" title="归档审核" width="640px">
      <el-alert type="warning" show-icon :closable="false" title="归档后记录进入质控、费用、报表和审计口径；修改必须走版本和审核流程。" />
      <el-form class="dialog-form" label-width="110px">
        <el-form-item label="审核结果">
          <el-radio-group model-value="approve">
            <el-radio-button label="approve">审核通过</el-radio-button>
            <el-radio-button label="return">退回修改</el-radio-button>
            <el-radio-button label="hold">暂缓</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核意见">
          <el-input type="textarea" :rows="3" placeholder="记录归档意见、退回原因或补充要求" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reviewDialogVisible = false">取消</el-button>
        <el-button @click="submitReview">提交审核</el-button>
        <el-button type="primary" @click="approveArchive">审核归档</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="returnDialogVisible" title="审核退回" width="600px">
      <el-form label-width="110px">
        <el-form-item label="退回原因">
          <el-select model-value="missing">
            <el-option label="记录缺项" value="missing" />
            <el-option label="签名缺失" value="sign" />
            <el-option label="消毒待复核" value="disinfection" />
            <el-option label="症状处理不完整" value="symptom" />
          </el-select>
        </el-form-item>
        <el-form-item label="修改要求">
          <el-input type="textarea" :rows="3" placeholder="说明需要补充或修正的字段，生成版本痕迹" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="returnDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="selectedArchive.reviewStatus = '已退回'; selectedArchive.version = 'v2'; returnDialogVisible = false; submitAction('记录已退回修改，版本痕迹已生成')">确认退回</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="sheetDrawerVisible" title="透析记录单预览" size="720px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="患者">{{ selectedArchive.patient }}</el-descriptions-item>
        <el-descriptions-item label="透析号">{{ selectedArchive.dialysisNo }}</el-descriptions-item>
        <el-descriptions-item label="治疗日期">{{ selectedArchive.sessionDate }}</el-descriptions-item>
        <el-descriptions-item label="班次机位">{{ selectedArchive.shiftBed }}</el-descriptions-item>
        <el-descriptions-item label="治疗模式">{{ selectedArchive.mode }}</el-descriptions-item>
        <el-descriptions-item label="记录单状态">{{ selectedArchive.sheetStatus }}</el-descriptions-item>
        <el-descriptions-item label="治疗过程">透前评估、上机核对、透中监测、症状处理、下机、透后评估。</el-descriptions-item>
        <el-descriptions-item label="签名">医生：{{ selectedArchive.doctorSign }}；护士：{{ selectedArchive.nurseSign }}；患者：{{ selectedArchive.patientSign }}</el-descriptions-item>
      </el-descriptions>
    </el-drawer>

    <el-drawer v-model="versionDrawerVisible" title="历史版本与修改痕迹" size="560px">
      <el-timeline>
        <el-timeline-item timestamp="v1 / 2026-05-10 12:30" type="primary">治疗记录单生成，来源于透析过程记录。</el-timeline-item>
        <el-timeline-item timestamp="v1 / 2026-05-10 12:45" type="success">护士签名，医生签名完成。</el-timeline-item>
        <el-timeline-item timestamp="v2 / 2026-05-10 13:10" type="warning">审核退回，要求补充症状处理和消毒复核。</el-timeline-item>
        <el-timeline-item timestamp="后续">重新提交后保留 before/after 差异和审核人。</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
