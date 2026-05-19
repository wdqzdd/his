<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  CircleCheck,
  DocumentChecked,
  EditPen,
  Finished,
  Operation,
  Search,
  Warning,
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{
  context: PageContext;
}>();

type NursePatient = {
  id: string;
  patient: string;
  dialysisNo: string;
  shift: string;
  bed: string;
  mode: string;
  access: string;
  orders: number;
  reviewStatus: string;
  checkStatus: string;
  executeStatus: string;
  doubleCheck: string;
  exception: string;
  signStatus: string;
  risk: string;
  nextAction: string;
};

type ExecutionOrder = {
  item: string;
  detail: string;
  type: string;
  planTime: string;
  executor: string;
  status: string;
  doubleCheck: string;
  charge: string;
};

const sectionByMenu: Record<string, string> = {
  'nurse-home': 'patients',
  'nurse-patient': 'patients',
  'nurse-check': 'review',
  'nurse-execute': 'execute',
  'nurse-record': 'record',
};

const activeTab = ref(sectionByMenu[props.context.menuKey] ?? 'patients');
const selectedPatientId = ref('NP-001');
const reviewDialogVisible = ref(false);
const checkDialogVisible = ref(false);
const executeDialogVisible = ref(false);
const correctionDialogVisible = ref(false);
const signDialogVisible = ref(false);
const traceDrawerVisible = ref(false);

watch(
  () => props.context.menuKey,
  (menuKey) => {
    activeTab.value = sectionByMenu[menuKey] ?? 'patients';
  },
);

const patients = ref<NursePatient[]>([
  { id: 'NP-001', patient: '王建国', dialysisNo: 'HD-00038', shift: '上午班', bed: 'A区08床', mode: 'HD', access: '左前臂自体内瘘', orders: 4, reviewStatus: '已审核', checkStatus: '待核对', executeStatus: '待执行', doubleCheck: '需双人', exception: '无', signStatus: '待签名', risk: '低', nextAction: '核对医嘱' },
  { id: 'NP-002', patient: '李秀兰', dialysisNo: 'HD-00072', shift: '上午班', bed: 'A区12床', mode: 'HD', access: '右颈长期导管', orders: 5, reviewStatus: '待护理审核', checkStatus: '未核对', executeStatus: '未执行', doubleCheck: '需双人', exception: '导管出口红肿', signStatus: '待签名', risk: '中', nextAction: '先做护理审核' },
  { id: 'NP-003', patient: '赵明', dialysisNo: 'HD-00116', shift: '下午班', bed: 'B区03床', mode: 'HD', access: '右前臂自体内瘘', orders: 3, reviewStatus: '退回医生', checkStatus: '暂停', executeStatus: '暂停', doubleCheck: '需双人', exception: '高钾待复核', signStatus: '未签名', risk: '高', nextAction: '等待医嘱修正' },
  { id: 'NP-004', patient: '陈志强', dialysisNo: 'HD-00128', shift: '下午班', bed: 'B区07床', mode: 'HD+HF', access: '左上臂人工血管', orders: 6, reviewStatus: '已审核', checkStatus: '已核对', executeStatus: '执行中', doubleCheck: '已完成', exception: '通路狭窄复查', signStatus: '部分签名', risk: '中', nextAction: '继续执行' },
  { id: 'NP-005', patient: '刘梅英', dialysisNo: 'HD-00151', shift: '夜班', bed: 'C区02床', mode: 'HD+HP', access: '股静脉临时导管', orders: 5, reviewStatus: '待护理审核', checkStatus: '未核对', executeStatus: '未执行', doubleCheck: '需双人', exception: '专项同意待确认', signStatus: '未签名', risk: '高', nextAction: '核对同意书' },
  { id: 'NP-006', patient: '孙海', dialysisNo: 'HD-00177', shift: '上午班', bed: 'A区05床', mode: 'HD', access: '左前臂自体内瘘', orders: 4, reviewStatus: '已审核', checkStatus: '已核对', executeStatus: '待执行', doubleCheck: '已完成', exception: '无', signStatus: '待签名', risk: '低', nextAction: '执行用药' },
  { id: 'NP-007', patient: '马丽', dialysisNo: 'HD-00203', shift: '上午班', bed: '隔离区01床', mode: '隔离HD', access: '右前臂自体内瘘', orders: 4, reviewStatus: '已审核', checkStatus: '待核对', executeStatus: '待执行', doubleCheck: '需双人', exception: '隔离流程', signStatus: '待签名', risk: '中', nextAction: '核对隔离物品' },
  { id: 'NP-008', patient: '周庆', dialysisNo: 'HD-00218', shift: '下午班', bed: 'A区16床', mode: 'HD', access: '右颈长期导管', orders: 5, reviewStatus: '已审核', checkStatus: '待核对', executeStatus: '待执行', doubleCheck: '需双人', exception: '低血压风险', signStatus: '待签名', risk: '高', nextAction: '限制超滤核对' },
  { id: 'NP-009', patient: '何雪', dialysisNo: 'HD-00246', shift: '下午班', bed: 'B区11床', mode: 'HD', access: '左前臂自体内瘘', orders: 3, reviewStatus: '已审核', checkStatus: '已核对', executeStatus: '待执行', doubleCheck: '已完成', exception: '磷偏高', signStatus: '待签名', risk: '中', nextAction: '执行用药' },
  { id: 'NP-010', patient: '郭强', dialysisNo: 'HD-00277', shift: '夜班', bed: 'C区06床', mode: 'HD', access: '左上臂人工血管', orders: 4, reviewStatus: '待护理审核', checkStatus: '未核对', executeStatus: '未执行', doubleCheck: '需双人', exception: 'Kt/V低复评', signStatus: '未签名', risk: '高', nextAction: '护理审核' },
  { id: 'NP-011', patient: '曹敏', dialysisNo: 'HD-00291', shift: '上午班', bed: 'A区10床', mode: 'HD', access: '右前臂自体内瘘', orders: 4, reviewStatus: '已审核', checkStatus: '已核对', executeStatus: '已执行', doubleCheck: '已完成', exception: '无', signStatus: '已签名', risk: '低', nextAction: '写入治疗记录' },
  { id: 'NP-012', patient: '潘德胜', dialysisNo: 'HD-00305', shift: '下午班', bed: 'B区15床', mode: 'HD', access: '右颈长期导管', orders: 3, reviewStatus: '已审核', checkStatus: '待核对', executeStatus: '待执行', doubleCheck: '需双人', exception: '跌倒风险', signStatus: '待签名', risk: '中', nextAction: '宣教并签名' },
]);

const executionOrders: ExecutionOrder[] = [
  { item: '促红素注射液', detail: '4000IU 皮下注射', type: '长期医嘱', planTime: '透析后', executor: '责任护士', status: '待执行', doubleCheck: '否', charge: '药品消耗' },
  { item: '低分子肝素钙', detail: '4100AXaIU 上机前', type: '长期医嘱', planTime: '上机前', executor: '责任护士', status: '待执行', doubleCheck: '是', charge: '药品消耗' },
  { item: '透析处方核对', detail: 'HD 4h 血流量260ml/min', type: '处方核对', planTime: '上机前', executor: '双人核对', status: '待核对', doubleCheck: '是', charge: '无费用' },
  { item: '通路核对', detail: '左前臂自体内瘘，阶梯穿刺', type: '护理核对', planTime: '穿刺前', executor: '责任护士', status: '待核对', doubleCheck: '是', charge: '无费用' },
];

const selectedPatient = computed(() => patients.value.find((item) => item.id === selectedPatientId.value) ?? patients.value[0]);

const metrics = computed(() => [
  { label: '护理患者', value: patients.value.length, tone: 'blue' },
  { label: '待护理审核', value: patients.value.filter((item) => item.reviewStatus.includes('待')).length, tone: 'orange' },
  { label: '待核对执行', value: patients.value.filter((item) => item.executeStatus.includes('待')).length, tone: 'green' },
  { label: '高风险', value: patients.value.filter((item) => item.risk === '高').length, tone: 'red' },
  { label: '待签名', value: patients.value.filter((item) => item.signStatus.includes('待') || item.signStatus === '未签名').length, tone: 'orange' },
]);

const checkItems = computed(() => [
  { label: '患者身份', value: `${selectedPatient.value.patient} / ${selectedPatient.value.dialysisNo}`, pass: true },
  { label: '机位班次', value: `${selectedPatient.value.shift} / ${selectedPatient.value.bed}`, pass: true },
  { label: '透析处方', value: selectedPatient.value.mode, pass: selectedPatient.value.reviewStatus === '已审核' },
  { label: '血管通路', value: selectedPatient.value.access, pass: !selectedPatient.value.exception.includes('同意') },
  { label: '风险事件', value: selectedPatient.value.exception, pass: selectedPatient.value.risk !== '高' },
  { label: '双人核对', value: selectedPatient.value.doubleCheck, pass: selectedPatient.value.doubleCheck === '已完成' },
]);

const activeTables = ['nursing_review', 'order_execution', 'double_check_record', 'nursing_record', 'execution_correction'];

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (['已审核', '已核对', '已完成', '已执行', '已签名', '低', '无'].includes(value)) return 'success';
  if (['退回医生', '暂停', '未执行', '未签名', '高'].includes(value) || value.includes('待确认')) return 'danger';
  if (value.includes('待') || value.includes('部分') || value === '中' || value !== '无') return 'warning';
  return 'info';
}

function selectPatient(row: NursePatient): void {
  selectedPatientId.value = row.id;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}

function approveReview(): void {
  selectedPatient.value.reviewStatus = '已审核';
  selectedPatient.value.checkStatus = '待核对';
  reviewDialogVisible.value = false;
  submitAction('护理审核已通过，进入核对执行队列');
}

function completeDoubleCheck(): void {
  selectedPatient.value.checkStatus = '已核对';
  selectedPatient.value.doubleCheck = '已完成';
  checkDialogVisible.value = false;
  submitAction('双人核对已完成，可执行医嘱并写入记录');
}

function executeOrders(): void {
  selectedPatient.value.executeStatus = '已执行';
  executeDialogVisible.value = false;
  submitAction('医嘱已执行，结果写入护理记录和治疗记录');
}

function signRecord(): void {
  selectedPatient.value.signStatus = '已签名';
  signDialogVisible.value = false;
  submitAction('护理记录已签名，进入治疗过程闭环');
}
</script>

<template>
  <section class="nurse-execution-page">
    <el-card class="nurse-work-card" shadow="never">
      <template #header>
        <div class="nurse-header">
          <div>
            <h2>护理核对执行工作台</h2>
            <p>接收医生已审核医嘱和透析处方，完成护理审核、双人核对、执行、异常勘误和签名，输出治疗记录依据。</p>
          </div>
          <div class="nurse-actions">
            <el-button type="primary" :icon="CircleCheck" @click="reviewDialogVisible = true">护理审核</el-button>
            <el-button :icon="Operation" @click="checkDialogVisible = true">双人核对</el-button>
            <el-button :icon="Finished" @click="executeDialogVisible = true">执行医嘱</el-button>
            <el-button :icon="EditPen" @click="correctionDialogVisible = true">异常勘误</el-button>
            <el-button :icon="DocumentChecked" @click="signDialogVisible = true">签名</el-button>
          </div>
        </div>
      </template>

      <el-form class="nurse-filter" inline>
        <el-form-item label="患者">
          <el-input placeholder="姓名、透析号、床位" clearable />
        </el-form-item>
        <el-form-item label="班次">
          <el-select placeholder="全部班次" clearable>
            <el-option label="上午班" value="am" />
            <el-option label="下午班" value="pm" />
            <el-option label="夜班" value="night" />
          </el-select>
        </el-form-item>
        <el-form-item label="分区">
          <el-select placeholder="全部分区" clearable>
            <el-option label="A区" value="a" />
            <el-option label="B区" value="b" />
            <el-option label="C区" value="c" />
            <el-option label="隔离区" value="iso" />
          </el-select>
        </el-form-item>
        <el-form-item label="执行状态">
          <el-select placeholder="全部状态" clearable>
            <el-option label="待审核" value="review" />
            <el-option label="待核对" value="check" />
            <el-option label="待执行" value="execute" />
            <el-option label="已执行" value="done" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>

      <div class="nurse-stat-grid">
        <el-card v-for="item in metrics" :key="item.label" :class="['nurse-stat-card', item.tone]" shadow="never">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </el-card>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :xl="16">
          <el-card class="nurse-main-card" shadow="never">
            <template #header>
              <div class="nurse-card-header">
                <div>
                  <strong>护理患者与医嘱状态</strong>
                  <p>示例数据不少于 10 条，覆盖审核、核对、执行、异常、签名和下一步状态。</p>
                </div>
                <el-tag type="primary" effect="plain">{{ context.role }} / {{ context.department }}</el-tag>
              </div>
            </template>
            <el-table :data="patients" border stripe highlight-current-row row-key="id" @row-click="selectPatient">
              <el-table-column prop="patient" label="患者" width="95" fixed="left" />
              <el-table-column prop="dialysisNo" label="透析号" width="115" />
              <el-table-column prop="shift" label="班次" width="90" />
              <el-table-column prop="bed" label="机位" width="105" />
              <el-table-column prop="mode" label="模式" width="90" />
              <el-table-column prop="access" label="通路" min-width="150" />
              <el-table-column prop="orders" label="医嘱数" width="80" />
              <el-table-column prop="reviewStatus" label="护理审核" width="115">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.reviewStatus)">{{ row.reviewStatus }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="checkStatus" label="核对" width="95">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.checkStatus)" effect="plain">{{ row.checkStatus }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="executeStatus" label="执行" width="95">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.executeStatus)" effect="plain">{{ row.executeStatus }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="doubleCheck" label="双人核对" width="105" />
              <el-table-column prop="exception" label="异常/风险" min-width="130">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.exception)" effect="plain">{{ row.exception }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="signStatus" label="签名" width="95">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.signStatus)">{{ row.signStatus }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="nextAction" label="下一步" min-width="140" />
              <el-table-column label="操作" width="260" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click.stop="selectPatient(row); reviewDialogVisible = true">审核</el-button>
                  <el-button link @click.stop="selectPatient(row); checkDialogVisible = true">核对</el-button>
                  <el-button link @click.stop="selectPatient(row); executeDialogVisible = true">执行</el-button>
                  <el-button link @click.stop="selectPatient(row); correctionDialogVisible = true">勘误</el-button>
                  <el-button link @click.stop="selectPatient(row); traceDrawerVisible = true">追溯</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>

        <el-col :xs="24" :xl="8">
          <el-card class="nurse-side-card" shadow="never">
            <template #header>
              <div class="nurse-card-header">
                <strong>当前患者核对清单</strong>
                <el-tag :type="tagType(selectedPatient.risk)">{{ selectedPatient.risk }}风险</el-tag>
              </div>
            </template>
            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="患者">{{ selectedPatient.patient }} / {{ selectedPatient.dialysisNo }}</el-descriptions-item>
              <el-descriptions-item label="班次机位">{{ selectedPatient.shift }} / {{ selectedPatient.bed }}</el-descriptions-item>
              <el-descriptions-item label="治疗模式">{{ selectedPatient.mode }}</el-descriptions-item>
              <el-descriptions-item label="当前通路">{{ selectedPatient.access }}</el-descriptions-item>
            </el-descriptions>
            <div class="nurse-check-list">
              <div v-for="item in checkItems" :key="item.label" class="nurse-check-row">
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
                <el-icon :class="{ pass: item.pass, block: !item.pass }">
                  <CircleCheck v-if="item.pass" />
                  <Warning v-else />
                </el-icon>
              </div>
            </div>
            <div class="nurse-quick-actions">
              <el-button type="primary" :disabled="checkItems.some((item) => !item.pass)" @click="executeOrders">核对通过并执行</el-button>
              <el-button @click="correctionDialogVisible = true">登记异常</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="nurse-workspace-card" shadow="never">
      <template #header>
        <div class="nurse-card-header">
          <div>
            <strong>核对执行明细</strong>
            <p>医嘱执行结果必须回写护理记录和治疗记录，异常执行需要勘误审批和审计追溯。</p>
          </div>
          <el-button type="primary" :icon="Finished" @click="executeDialogVisible = true">批量执行</el-button>
        </div>
      </template>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="医嘱执行" name="execute">
          <el-table :data="executionOrders" border stripe>
            <el-table-column prop="item" label="项目" min-width="140" />
            <el-table-column prop="detail" label="明细" min-width="180" />
            <el-table-column prop="type" label="类型" width="110" />
            <el-table-column prop="planTime" label="计划时间" width="110" />
            <el-table-column prop="executor" label="执行人" width="110" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="tagType(row.status)">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="doubleCheck" label="双人核对" width="100" />
            <el-table-column prop="charge" label="药耗费用" width="120" />
            <el-table-column label="操作" width="160">
              <template #default>
                <el-button link type="primary" @click="executeDialogVisible = true">执行</el-button>
                <el-button link @click="correctionDialogVisible = true">异常</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="护理记录" name="record">
          <div class="nurse-record-grid">
            <el-card shadow="never" class="nurse-record-card">
              <strong>护理审核记录</strong>
              <p>已核对医嘱来源、患者身份、处方参数、通路状态和风险事件。</p>
              <el-tag :type="tagType(selectedPatient.reviewStatus)">{{ selectedPatient.reviewStatus }}</el-tag>
            </el-card>
            <el-card shadow="never" class="nurse-record-card">
              <strong>执行记录</strong>
              <p>记录执行时间、执行人、给药/耗材、执行结果、异常说明和签名。</p>
              <el-tag :type="tagType(selectedPatient.executeStatus)">{{ selectedPatient.executeStatus }}</el-tag>
            </el-card>
            <el-card shadow="never" class="nurse-record-card">
              <strong>双人核对</strong>
              <p>高风险用药、抗凝、处方参数、隔离流程和血管通路需双人核对。</p>
              <el-tag :type="tagType(selectedPatient.doubleCheck)">{{ selectedPatient.doubleCheck }}</el-tag>
            </el-card>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog v-model="reviewDialogVisible" title="护理审核" width="640px">
      <el-form label-width="110px">
        <el-form-item label="患者">
          <el-input :model-value="`${selectedPatient.patient} / ${selectedPatient.bed}`" />
        </el-form-item>
        <el-form-item label="审核项目">
          <el-checkbox-group model-value="identity">
            <el-checkbox-button label="identity">身份</el-checkbox-button>
            <el-checkbox-button label="order">医嘱</el-checkbox-button>
            <el-checkbox-button label="prescription">处方</el-checkbox-button>
            <el-checkbox-button label="access">通路</el-checkbox-button>
            <el-checkbox-button label="risk">风险</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="审核意见">
          <el-input type="textarea" :rows="3" placeholder="记录护理审核结论、需医生确认的问题或执行注意事项" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reviewDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="approveReview">审核通过</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="checkDialogVisible" title="双人核对" width="640px">
      <el-alert type="warning" show-icon :closable="false" title="抗凝、处方参数、高风险用药、隔离流程和通路异常必须双人核对并留痕。" />
      <el-form class="dialog-form" label-width="110px">
        <el-form-item label="第一核对人">
          <el-input model-value="赵护士" />
        </el-form-item>
        <el-form-item label="第二核对人">
          <el-input placeholder="请输入第二核对人" />
        </el-form-item>
        <el-form-item label="核对结果">
          <el-radio-group model-value="pass">
            <el-radio-button label="pass">通过</el-radio-button>
            <el-radio-button label="hold">暂缓</el-radio-button>
            <el-radio-button label="reject">退回</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="说明">
          <el-input type="textarea" :rows="3" placeholder="记录核对项目、异常项和处理意见" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="checkDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="completeDoubleCheck">完成核对</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="executeDialogVisible" title="执行医嘱" width="640px">
      <el-form label-width="110px">
        <el-form-item label="执行项目">
          <el-select model-value="epo">
            <el-option label="促红素注射液" value="epo" />
            <el-option label="低分子肝素钙" value="lmwh" />
            <el-option label="透析处方核对" value="rx" />
            <el-option label="通路核对" value="access" />
          </el-select>
        </el-form-item>
        <el-form-item label="执行结果">
          <el-radio-group model-value="done">
            <el-radio-button label="done">已执行</el-radio-button>
            <el-radio-button label="partial">部分执行</el-radio-button>
            <el-radio-button label="exception">异常</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="药耗批号">
          <el-input placeholder="药品/耗材批号，后续 Task 15 追溯" />
        </el-form-item>
        <el-form-item label="执行记录">
          <el-input type="textarea" :rows="3" placeholder="记录执行时间、执行人、剂量、患者反应和异常处理" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="executeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="executeOrders">保存执行</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="correctionDialogVisible" title="执行异常与勘误" width="640px">
      <el-form label-width="110px">
        <el-form-item label="异常类型">
          <el-select model-value="dose">
            <el-option label="剂量调整" value="dose" />
            <el-option label="患者拒绝" value="reject" />
            <el-option label="医嘱退回" value="order" />
            <el-option label="执行时间变更" value="time" />
          </el-select>
        </el-form-item>
        <el-form-item label="勘误原因">
          <el-input type="textarea" :rows="3" placeholder="说明原记录、变更后记录、审批人和影响范围" />
        </el-form-item>
        <el-form-item label="审批人">
          <el-input placeholder="护理组长或医生" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="correctionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="correctionDialogVisible = false; submitAction('异常勘误已提交审批并保留审计痕迹')">提交勘误</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="signDialogVisible" title="护理签名" width="560px">
      <el-form label-width="100px">
        <el-form-item label="签名对象">
          <el-input :model-value="`${selectedPatient.patient} 护理执行记录`" />
        </el-form-item>
        <el-form-item label="签名方式">
          <el-radio-group model-value="password">
            <el-radio-button label="password">密码</el-radio-button>
            <el-radio-button label="ca">CA</el-radio-button>
            <el-radio-button label="finger">指纹</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="签名口令">
          <el-input type="password" placeholder="请输入签名口令" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="signDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="signRecord">确认签名</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="护理执行追溯" size="540px">
      <el-timeline>
        <el-timeline-item timestamp="08:05" type="primary">接收医生站已审核医嘱与透析处方。</el-timeline-item>
        <el-timeline-item timestamp="08:10" type="warning">护理审核：{{ selectedPatient.reviewStatus }}，风险：{{ selectedPatient.exception }}。</el-timeline-item>
        <el-timeline-item timestamp="08:18" type="success">双人核对状态：{{ selectedPatient.doubleCheck }}。</el-timeline-item>
        <el-timeline-item timestamp="后续">执行结果写入治疗记录，异常进入勘误审批，药耗批号进入费用追溯。</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
