<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  CircleCheck,
  DocumentAdd,
  Files,
  FirstAidKit,
  Refresh,
  Search,
  Warning,
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

defineProps<{
  context: PageContext;
}>();

type OrderRow = {
  id: string;
  patient: string;
  dialysisNo: string;
  orderType: string;
  orderScope: string;
  item: string;
  detail: string;
  frequency: string;
  startTime: string;
  duration: string;
  reviewStatus: string;
  executeStatus: string;
  chargeLink: string;
  risk: string;
  nextAction: string;
};

type PrescriptionRow = {
  id: string;
  patient: string;
  mode: string;
  access: string;
  duration: string;
  bloodFlow: string;
  dialysateFlow: string;
  anticoagulation: string;
  ultrafiltration: string;
  reviewStatus: string;
  executeStatus: string;
  source: string;
};

const selectedOrderId = ref('MO-20260510-001');
const activeTab = ref('orders');
const orderDrawerVisible = ref(false);
const prescriptionDrawerVisible = ref(false);
const setDialogVisible = ref(false);
const reviewDialogVisible = ref(false);
const historyDrawerVisible = ref(false);
const executionDrawerVisible = ref(false);

const orders = ref<OrderRow[]>([
  { id: 'MO-20260510-001', patient: '王建国', dialysisNo: 'HD-00038', orderType: '长期医嘱', orderScope: '个人医嘱组套引用', item: '促红素注射液', detail: '4000IU 皮下注射', frequency: '每周2次', startTime: '2026-05-10', duration: '长期', reviewStatus: '已审核', executeStatus: '待执行', chargeLink: '药品消耗', risk: '低', nextAction: '护士核对执行' },
  { id: 'MO-20260510-002', patient: '李秀兰', dialysisNo: 'HD-00072', orderType: '临时医嘱', orderScope: '科室医嘱组套引用', item: '导管出口护理', detail: '碘伏消毒并换药', frequency: '本次透析前', startTime: '2026-05-10', duration: '1次', reviewStatus: '待审核', executeStatus: '未下发', chargeLink: '耗材消耗', risk: '中', nextAction: '提交审核' },
  { id: 'MO-20260510-003', patient: '赵明', dialysisNo: 'HD-00116', orderType: '临时医嘱', orderScope: '历史医嘱引用', item: '高钾处理', detail: '复查血钾，必要时调整透析液钾浓度', frequency: '立即', startTime: '2026-05-10', duration: '1次', reviewStatus: '退回修改', executeStatus: '未下发', chargeLink: '检验费用', risk: '高', nextAction: '修改后重提' },
  { id: 'MO-20260510-004', patient: '陈志强', dialysisNo: 'HD-00128', orderType: '长期医嘱', orderScope: '全院医嘱组套引用', item: '低分子肝素钙', detail: '4100AXaIU 上机前', frequency: '每次透析', startTime: '2026-05-10', duration: '4周', reviewStatus: '已审核', executeStatus: '执行中', chargeLink: '药品消耗', risk: '中', nextAction: '执行追踪' },
  { id: 'MO-20260510-005', patient: '刘梅英', dialysisNo: 'HD-00151', orderType: '血液净化专项', orderScope: '科室医嘱组套引用', item: '血液灌流', detail: 'HA130 2小时联合HD', frequency: '每周1次', startTime: '2026-05-10', duration: '4次', reviewStatus: '待审核', executeStatus: '未下发', chargeLink: '耗材+费用', risk: '高', nextAction: '补同意书后审核' },
  { id: 'MO-20260510-006', patient: '孙海', dialysisNo: 'HD-00177', orderType: '出院带药', orderScope: '历史医嘱引用', item: '左卡尼汀', detail: '1g 静推', frequency: '每次透析后', startTime: '2026-05-11', duration: '长期', reviewStatus: '已审核', executeStatus: '待执行', chargeLink: '药品消耗', risk: '低', nextAction: '护士核对执行' },
  { id: 'MO-20260510-007', patient: '马丽', dialysisNo: 'HD-00203', orderType: '隔离透析医嘱', orderScope: '全院医嘱组套引用', item: '乙肝隔离透析', detail: '固定隔离机位和专用物品', frequency: '每次透析', startTime: '2026-05-11', duration: '长期', reviewStatus: '已审核', executeStatus: '待执行', chargeLink: '隔离耗材', risk: '中', nextAction: '按隔离流程执行' },
  { id: 'MO-20260510-008', patient: '周庆', dialysisNo: 'HD-00218', orderType: '停止医嘱', orderScope: '医生手工开立', item: '限制超滤', detail: '本次超滤不超过2.0L', frequency: '本次透析', startTime: '2026-05-11', duration: '1次', reviewStatus: '已审核', executeStatus: '待执行', chargeLink: '无费用', risk: '高', nextAction: '治疗记录引用' },
  { id: 'MO-20260510-009', patient: '何雪', dialysisNo: 'HD-00246', orderType: '长期医嘱', orderScope: '个人医嘱组套引用', item: '碳酸司维拉姆', detail: '0.8g 口服 tid', frequency: '每日', startTime: '2026-05-11', duration: '4周', reviewStatus: '待审核', executeStatus: '未下发', chargeLink: '药品消耗', risk: '中', nextAction: '药师协同审核' },
  { id: 'MO-20260510-010', patient: '郭强', dialysisNo: 'HD-00277', orderType: '血液净化专项', orderScope: '科室医嘱组套引用', item: '透析充分性复评', detail: '调整血流量后复查Kt/V', frequency: '下次透析后', startTime: '2026-05-11', duration: '1次', reviewStatus: '待审核', executeStatus: '未下发', chargeLink: '检验费用', risk: '高', nextAction: '审核后执行' },
  { id: 'MO-20260510-011', patient: '曹敏', dialysisNo: 'HD-00291', orderType: '皮试医嘱', orderScope: '医生手工开立', item: '头孢皮试', detail: '给药前皮试并记录结果', frequency: '每日', startTime: '2026-05-12', duration: '4周', reviewStatus: '已审核', executeStatus: '待执行', chargeLink: '药品消耗', risk: '中', nextAction: '护士核对执行' },
  { id: 'MO-20260510-012', patient: '潘德胜', dialysisNo: 'HD-00305', orderType: '退药记录', orderScope: '药房退回', item: '跌倒风险宣教', detail: '透后离室前家属陪同', frequency: '本次透析后', startTime: '2026-05-12', duration: '1次', reviewStatus: '已审核', executeStatus: '待执行', chargeLink: '退费核对', risk: '中', nextAction: '护理记录引用' },
]);

const prescriptions = ref<PrescriptionRow[]>([
  { id: 'RX-20260510-001', patient: '王建国', mode: 'HD', access: '左前臂自体内瘘', duration: '4.0h', bloodFlow: '260 ml/min', dialysateFlow: '500 ml/min', anticoagulation: '低分子肝素 4100AXaIU', ultrafiltration: '2.1L', reviewStatus: '已审核', executeStatus: '待上机', source: '引用上次并调整超滤' },
  { id: 'RX-20260510-002', patient: '李秀兰', mode: 'HD', access: '右颈内静脉长期导管', duration: '4.0h', bloodFlow: '220 ml/min', dialysateFlow: '500 ml/min', anticoagulation: '普通肝素首剂', ultrafiltration: '1.8L', reviewStatus: '待审核', executeStatus: '未下发', source: '新开处方' },
  { id: 'RX-20260510-003', patient: '赵明', mode: 'HD', access: '右前臂自体内瘘', duration: '4.5h', bloodFlow: '280 ml/min', dialysateFlow: '500 ml/min', anticoagulation: '低分子肝素', ultrafiltration: '2.4L', reviewStatus: '退回修改', executeStatus: '未下发', source: '血钾异常调整' },
  { id: 'RX-20260510-004', patient: '陈志强', mode: 'HD+HF', access: '左上臂人工血管', duration: '4.0h', bloodFlow: '260 ml/min', dialysateFlow: '500 ml/min', anticoagulation: '低分子肝素', ultrafiltration: '2.0L', reviewStatus: '已审核', executeStatus: '执行中', source: '通路复查后调整' },
  { id: 'RX-20260510-005', patient: '刘梅英', mode: 'HD+HP', access: '股静脉临时导管', duration: '4.0h', bloodFlow: '200 ml/min', dialysateFlow: '500 ml/min', anticoagulation: '无肝素透析', ultrafiltration: '1.5L', reviewStatus: '待审核', executeStatus: '未下发', source: '专项治疗申请' },
  { id: 'RX-20260510-006', patient: '孙海', mode: 'HD', access: '左前臂自体内瘘', duration: '4.0h', bloodFlow: '260 ml/min', dialysateFlow: '500 ml/min', anticoagulation: '低分子肝素', ultrafiltration: '2.2L', reviewStatus: '已审核', executeStatus: '待上机', source: '历史处方复用' },
  { id: 'RX-20260510-007', patient: '马丽', mode: '隔离HD', access: '右前臂自体内瘘', duration: '4.0h', bloodFlow: '250 ml/min', dialysateFlow: '500 ml/min', anticoagulation: '低分子肝素', ultrafiltration: '1.9L', reviewStatus: '已审核', executeStatus: '待上机', source: '隔离透析模板' },
  { id: 'RX-20260510-008', patient: '周庆', mode: 'HD', access: '右颈内静脉长期导管', duration: '4.0h', bloodFlow: '210 ml/min', dialysateFlow: '500 ml/min', anticoagulation: '低剂量肝素', ultrafiltration: '不超过2.0L', reviewStatus: '已审核', executeStatus: '待上机', source: '心衰风险调整' },
  { id: 'RX-20260510-009', patient: '何雪', mode: 'HD', access: '左前臂自体内瘘', duration: '4.0h', bloodFlow: '260 ml/min', dialysateFlow: '500 ml/min', anticoagulation: '低分子肝素', ultrafiltration: '2.3L', reviewStatus: '待审核', executeStatus: '未下发', source: '钙磷异常复评' },
  { id: 'RX-20260510-010', patient: '郭强', mode: 'HD', access: '左上臂人工血管', duration: '4.5h', bloodFlow: '280 ml/min', dialysateFlow: '500 ml/min', anticoagulation: '低分子肝素', ultrafiltration: '2.5L', reviewStatus: '待审核', executeStatus: '未下发', source: '充分性不足调整' },
]);

const selectedOrder = computed(() => orders.value.find((item) => item.id === selectedOrderId.value) ?? orders.value[0]);
const highRiskOrders = computed(() => orders.value.filter((item) => item.risk === '高').length);
const pendingReview = computed(() => orders.value.filter((item) => item.reviewStatus === '待审核').length);
const readyExecute = computed(() => orders.value.filter((item) => item.reviewStatus === '已审核' && item.executeStatus.includes('待')).length);

const metrics = computed(() => [
  { label: '医嘱总数', value: orders.value.length, tone: 'blue' },
  { label: '待审核医嘱', value: pendingReview.value, tone: 'orange' },
  { label: '待执行医嘱', value: readyExecute.value, tone: 'green' },
  { label: '高风险调整', value: highRiskOrders.value, tone: 'red' },
  { label: '透析处方', value: prescriptions.value.length, tone: 'blue' },
]);

const safetyChecks = computed(() => [
  { label: '诊断评估', value: selectedOrder.value.patient === '赵明' ? '评估需补充' : '已完成', pass: selectedOrder.value.patient !== '赵明' },
  { label: '通路引用', value: selectedOrder.value.patient === '刘梅英' ? '临时导管' : '有效通路', pass: true },
  { label: '检验风险', value: selectedOrder.value.risk === '高' ? '需复核' : '可接受', pass: selectedOrder.value.risk !== '高' },
  { label: '知情同意', value: selectedOrder.value.patient === '刘梅英' ? '待补专项同意' : '有效', pass: selectedOrder.value.patient !== '刘梅英' },
]);

const activeTables = ['medical_order', 'medical_order_detail', 'dialysis_prescription', 'order_review_log', 'order_execution_plan'];

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (['已审核', '待执行', '待上机', '执行中', '低', '有效', '可接受'].includes(value)) return 'success';
  if (['退回修改', '高', '未下发'].includes(value) || value.includes('待补')) return 'danger';
  if (value.includes('待') || value === '中' || value.includes('需')) return 'warning';
  return 'info';
}

function selectOrder(row: OrderRow): void {
  selectedOrderId.value = row.id;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}

function submitOrder(): void {
  selectedOrder.value.reviewStatus = '待审核';
  selectedOrder.value.executeStatus = '未下发';
  orderDrawerVisible.value = false;
  submitAction('医嘱已提交审核，护士站暂不可执行');
}

function approveOrder(): void {
  selectedOrder.value.reviewStatus = '已审核';
  selectedOrder.value.executeStatus = '待执行';
  reviewDialogVisible.value = false;
  submitAction('医嘱已审核通过，已生成护士核对执行计划');
}
</script>

<template>
  <section class="doctor-order-page">
    <el-card class="order-work-card" shadow="never">
      <template #header>
        <div class="order-header">
          <div>
            <h2>医嘱与透析处方</h2>
            <p>基于诊断、评估、通路、检验和知情同意生成医嘱与处方，审核后下发护士站、药耗费用和治疗记录。</p>
          </div>
          <div class="order-actions">
            <el-button type="primary" :icon="DocumentAdd" @click="orderDrawerVisible = true">新开医嘱</el-button>
            <el-button :icon="FirstAidKit" @click="prescriptionDrawerVisible = true">新开处方</el-button>
            <el-button :icon="Files" @click="setDialogVisible = true">引用组套</el-button>
            <el-button :icon="CircleCheck" @click="reviewDialogVisible = true">审核/提交</el-button>
            <el-button :icon="Refresh" @click="historyDrawerVisible = true">历史引用</el-button>
          </div>
        </div>
      </template>

      <el-form class="order-filter" inline>
        <el-form-item label="患者">
          <el-input placeholder="姓名、透析号、医嘱项目" clearable />
        </el-form-item>
        <el-form-item label="医嘱类型">
          <el-select placeholder="全部类型" clearable>
            <el-option label="门诊处方笺" value="outpatient" />
            <el-option label="临时医嘱" value="temp" />
            <el-option label="长期医嘱" value="long" />
            <el-option label="出院带药" value="discharge" />
            <el-option label="皮试医嘱" value="skin" />
            <el-option label="停止医嘱" value="stop" />
            <el-option label="退药记录" value="refund" />
            <el-option label="血液净化专项" value="dialysis" />
          </el-select>
        </el-form-item>
        <el-form-item label="组套范围">
          <el-select placeholder="全部组套" clearable>
            <el-option label="全院医嘱组套引用" value="hospital" />
            <el-option label="科室医嘱组套引用" value="dept" />
            <el-option label="个人医嘱组套引用" value="personal" />
            <el-option label="历史医嘱引用" value="history" />
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select placeholder="全部状态" clearable>
            <el-option label="待审核" value="pending" />
            <el-option label="已审核" value="approved" />
            <el-option label="退回修改" value="rejected" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>

      <div class="order-stat-grid">
        <el-card v-for="item in metrics" :key="item.label" :class="['order-stat-card', item.tone]" shadow="never">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </el-card>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :xl="16">
          <el-card class="order-main-card" shadow="never">
            <template #header>
              <div class="order-card-header">
                <div>
                  <strong>医嘱列表</strong>
                  <p>覆盖临时、长期、血液净化专项医嘱；示例数据不少于 10 条，便于验证审核和执行状态。</p>
                </div>
                <el-tag type="primary" effect="plain">审核后进入护士核对执行</el-tag>
              </div>
            </template>
            <el-table :data="orders" border stripe highlight-current-row row-key="id" @row-click="selectOrder">
              <el-table-column prop="patient" label="患者" width="95" fixed="left" />
              <el-table-column prop="dialysisNo" label="透析号" width="115" />
              <el-table-column prop="orderType" label="类型" width="120" />
              <el-table-column prop="orderScope" label="引用/组套" min-width="150" />
              <el-table-column prop="item" label="医嘱项目" min-width="150" />
              <el-table-column prop="detail" label="明细" min-width="190" />
              <el-table-column prop="frequency" label="频次" width="120" />
              <el-table-column prop="startTime" label="开始时间" width="115" />
              <el-table-column prop="duration" label="疗程" width="90" />
              <el-table-column prop="reviewStatus" label="审核" width="100">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.reviewStatus)">{{ row.reviewStatus }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="executeStatus" label="执行" width="100">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.executeStatus)" effect="plain">{{ row.executeStatus }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="chargeLink" label="药耗费用" width="110" />
              <el-table-column prop="risk" label="风险" width="80">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.risk)">{{ row.risk }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="nextAction" label="下一步" min-width="140" />
              <el-table-column label="操作" width="250" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click.stop="selectOrder(row); orderDrawerVisible = true">编辑</el-button>
                  <el-button link @click.stop="selectOrder(row); reviewDialogVisible = true">审核</el-button>
                  <el-button link @click.stop="selectOrder(row); executionDrawerVisible = true">执行计划</el-button>
                  <el-button link @click.stop="selectOrder(row); historyDrawerVisible = true">追溯</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>

        <el-col :xs="24" :xl="8">
          <el-card class="order-side-card" shadow="never">
            <template #header>
              <div class="order-card-header">
                <strong>当前医嘱安全校验</strong>
                <el-tag :type="selectedOrder.risk === '高' ? 'danger' : 'success'">{{ selectedOrder.risk }}风险</el-tag>
              </div>
            </template>
            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="患者">{{ selectedOrder.patient }} / {{ selectedOrder.dialysisNo }}</el-descriptions-item>
              <el-descriptions-item label="医嘱">{{ selectedOrder.orderType }} - {{ selectedOrder.item }}</el-descriptions-item>
              <el-descriptions-item label="组套来源">{{ selectedOrder.orderScope }}</el-descriptions-item>
              <el-descriptions-item label="明细">{{ selectedOrder.detail }}</el-descriptions-item>
              <el-descriptions-item label="下一步">{{ selectedOrder.nextAction }}</el-descriptions-item>
            </el-descriptions>
            <div class="order-check-list">
              <div v-for="item in safetyChecks" :key="item.label" class="order-check-row">
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
                <el-icon :class="{ pass: item.pass, block: !item.pass }">
                  <CircleCheck v-if="item.pass" />
                  <Warning v-else />
                </el-icon>
              </div>
            </div>
            <div class="order-quick-actions">
              <el-button type="primary" :disabled="safetyChecks.some((item) => !item.pass)" @click="approveOrder">审核通过并下发</el-button>
              <el-button @click="reviewDialogVisible = true">写审核意见</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="order-workspace-card" shadow="never">
      <template #header>
        <div class="order-card-header">
          <div>
            <strong>透析处方</strong>
            <p>处方必须引用当前有效血管通路，并输出上机参数、抗凝方案、超滤目标和执行状态。</p>
          </div>
          <el-button type="primary" :icon="FirstAidKit" @click="prescriptionDrawerVisible = true">维护处方</el-button>
        </div>
      </template>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="透析处方列表" name="orders">
          <el-table :data="prescriptions" border stripe>
            <el-table-column prop="patient" label="患者" width="95" />
            <el-table-column prop="mode" label="模式" width="100" />
            <el-table-column prop="access" label="通路" min-width="150" />
            <el-table-column prop="duration" label="时长" width="85" />
            <el-table-column prop="bloodFlow" label="血流量" width="120" />
            <el-table-column prop="dialysateFlow" label="透析液流量" width="130" />
            <el-table-column prop="anticoagulation" label="抗凝" min-width="160" />
            <el-table-column prop="ultrafiltration" label="超滤目标" width="110" />
            <el-table-column prop="reviewStatus" label="审核" width="100">
              <template #default="{ row }">
                <el-tag :type="tagType(row.reviewStatus)">{{ row.reviewStatus }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="executeStatus" label="执行" width="100">
              <template #default="{ row }">
                <el-tag :type="tagType(row.executeStatus)" effect="plain">{{ row.executeStatus }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="source" label="来源" min-width="150" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="执行计划" name="execution">
          <div class="execution-plan-grid">
            <el-card shadow="never" class="execution-plan-card">
              <strong>护士站核对</strong>
              <p>审核通过后生成护理核对任务，核对患者、机位、通路、医嘱明细、药品耗材和双人核对要求。</p>
              <el-tag type="success">Task 12 输入</el-tag>
            </el-card>
            <el-card shadow="never" class="execution-plan-card">
              <strong>药耗费用</strong>
              <p>药品、耗材和治疗项目按医嘱明细生成消耗计划，后续由库存、费用和批号追溯引用。</p>
              <el-tag type="warning">Task 15 输入</el-tag>
            </el-card>
            <el-card shadow="never" class="execution-plan-card">
              <strong>治疗记录</strong>
              <p>透析处方参数进入上机核对与治疗记录，执行异常需要回写医嘱执行计划。</p>
              <el-tag type="primary">Task 13 输入</el-tag>
            </el-card>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-drawer v-model="orderDrawerVisible" title="新开/编辑医嘱" size="640px">
      <el-form label-width="110px">
        <el-form-item label="患者">
          <el-input :model-value="`${selectedOrder.patient} / ${selectedOrder.dialysisNo}`" />
        </el-form-item>
        <el-form-item label="医嘱类型">
          <el-select :model-value="selectedOrder.orderType">
            <el-option label="临时医嘱" value="临时医嘱" />
            <el-option label="长期医嘱" value="长期医嘱" />
            <el-option label="门诊处方笺" value="门诊处方笺" />
            <el-option label="出院带药" value="出院带药" />
            <el-option label="皮试医嘱" value="皮试医嘱" />
            <el-option label="停止医嘱" value="停止医嘱" />
            <el-option label="退药记录" value="退药记录" />
            <el-option label="血液净化专项" value="血液净化专项" />
            <el-option label="隔离透析医嘱" value="隔离透析医嘱" />
          </el-select>
        </el-form-item>
        <el-form-item label="医嘱项目">
          <el-input :model-value="selectedOrder.item" />
        </el-form-item>
        <el-form-item label="剂量/明细">
          <el-input :model-value="selectedOrder.detail" />
        </el-form-item>
        <el-form-item label="频次">
          <el-input :model-value="selectedOrder.frequency" />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker type="datetime" placeholder="选择开始时间" />
        </el-form-item>
        <el-form-item label="执行角色">
          <el-checkbox-group model-value="nurse">
            <el-checkbox-button label="nurse">护士</el-checkbox-button>
            <el-checkbox-button label="pharmacy">药房</el-checkbox-button>
            <el-checkbox-button label="lab">检验</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="开立依据">
          <el-input type="textarea" :rows="3" placeholder="引用诊断、评估、检验、通路、同意书或临床事件处理结论" />
        </el-form-item>
      </el-form>
      <div class="drawer-actions">
        <el-button @click="orderDrawerVisible = false">取消</el-button>
        <el-button @click="submitAction('医嘱已暂存，尚未进入审核')">暂存</el-button>
        <el-button type="primary" @click="submitOrder">提交审核</el-button>
      </div>
    </el-drawer>

    <el-drawer v-model="prescriptionDrawerVisible" title="透析处方维护" size="680px">
      <el-form label-width="120px">
        <el-form-item label="治疗模式">
          <el-select model-value="HD">
            <el-option label="HD" value="HD" />
            <el-option label="HD+HF" value="HDF" />
            <el-option label="HD+HP" value="HP" />
            <el-option label="隔离HD" value="isolation" />
          </el-select>
        </el-form-item>
        <el-form-item label="血管通路">
          <el-select model-value="avf">
            <el-option label="左前臂自体内瘘" value="avf" />
            <el-option label="右颈内静脉长期导管" value="tcc" />
            <el-option label="左上臂人工血管" value="avg" />
          </el-select>
        </el-form-item>
        <el-form-item label="治疗时长">
          <el-input placeholder="例如 4.0h" />
        </el-form-item>
        <el-form-item label="血流量">
          <el-input placeholder="例如 260 ml/min" />
        </el-form-item>
        <el-form-item label="透析液流量">
          <el-input placeholder="例如 500 ml/min" />
        </el-form-item>
        <el-form-item label="抗凝方案">
          <el-input placeholder="药品、剂量、给药时点和禁忌提示" />
        </el-form-item>
        <el-form-item label="超滤目标">
          <el-input placeholder="结合干体重、透前体重和心血管风险" />
        </el-form-item>
        <el-form-item label="安全提示">
          <el-alert type="warning" show-icon :closable="false" title="处方参数将进入上机核对；通路、抗凝、超滤目标异常时必须复核。" />
        </el-form-item>
      </el-form>
      <div class="drawer-actions">
        <el-button @click="prescriptionDrawerVisible = false">取消</el-button>
        <el-button type="primary" @click="prescriptionDrawerVisible = false; submitAction('透析处方已提交审核')">提交处方</el-button>
      </div>
    </el-drawer>

    <el-dialog v-model="setDialogVisible" title="引用医嘱组套" width="660px">
      <el-table :data="[
        { name: '常规维持性血透组套', items: '抗凝、透后用药、常规检验', risk: '低' },
        { name: '高钾处理组套', items: '复查血钾、调整透析液、心电监护', risk: '高' },
        { name: '导管护理组套', items: '出口护理、敷料、感染观察', risk: '中' },
        { name: '贫血管理组套', items: '促红素、铁剂、血红蛋白复查', risk: '中' },
      ]" border>
        <el-table-column prop="name" label="组套名称" />
        <el-table-column prop="items" label="包含项目" />
        <el-table-column prop="risk" label="风险" width="90">
          <template #default="{ row }">
            <el-tag :type="tagType(row.risk)">{{ row.risk }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="setDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="setDialogVisible = false; submitAction('组套已引用，请核对剂量、频次和执行计划')">引用组套</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="reviewDialogVisible" title="医嘱审核" width="620px">
      <el-alert type="warning" show-icon :closable="false" title="审核前必须确认诊断评估、通路、检验风险、知情同意和药品禁忌；退回需要写明原因。" />
      <el-form class="dialog-form" label-width="110px">
        <el-form-item label="审核结果">
          <el-radio-group model-value="approve">
            <el-radio-button label="approve">通过</el-radio-button>
            <el-radio-button label="reject">退回修改</el-radio-button>
            <el-radio-button label="hold">暂缓</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核意见">
          <el-input type="textarea" :rows="3" placeholder="记录审核依据、退回原因或执行注意事项" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reviewDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="approveOrder">审核通过</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="historyDrawerVisible" title="历史引用与审计追溯" size="540px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-10 08:20" type="primary">医生开立医嘱：{{ selectedOrder.item }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 08:24" type="warning">系统完成处方准入校验，发现风险：{{ selectedOrder.risk }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 08:31" type="success">审核通过后生成执行计划，等待护士站核对。</el-timeline-item>
        <el-timeline-item timestamp="后续">执行结果将回写治疗记录、药耗费用和质控追溯。</el-timeline-item>
      </el-timeline>
    </el-drawer>

    <el-drawer v-model="executionDrawerVisible" title="执行计划" size="540px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="执行角色">护士站核对执行；药房/库房按药耗计划协同。</el-descriptions-item>
        <el-descriptions-item label="计划时间">{{ selectedOrder.startTime }} / {{ selectedOrder.frequency }}</el-descriptions-item>
        <el-descriptions-item label="执行前核对">患者、机位、通路、剂量、禁忌、双人核对、签名。</el-descriptions-item>
        <el-descriptions-item label="回写目标">治疗记录、医嘱执行记录、药耗费用、审计日志。</el-descriptions-item>
      </el-descriptions>
    </el-drawer>
  </section>
</template>
