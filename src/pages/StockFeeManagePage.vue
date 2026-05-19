<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, Coin, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();
type Row = { id: string; patient: string; dialysisNo: string; item: string; source: string; amount: string; chargeStatus: string; balance: string; owner: string; nextAction: string };
type SessionSummary = { dialysisNo: string; patient: string; treatmentFee: string; drugFee: string; materialFee: string; labFee: string; total: string; status: string; nextAction: string };
type PatientSummary = { patient: string; monthTotal: string; paid: string; balance: string; arrears: string; owner: string; nextAction: string };
const selectedId = ref('FEE-001');
const chargeDialogVisible = ref(false);
const debtDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const rows: Row[] = [
  { id: 'FEE-001', patient: '王建国', dialysisNo: 'HD-00038', item: 'HD治疗费', source: '治疗记录', amount: '420.00', chargeStatus: '已计费', balance: '充足', owner: '收费员陈', nextAction: '归档' },
  { id: 'FEE-002', patient: '李秀英', dialysisNo: 'HD-00072', item: '导管护理耗材', source: '耗材消耗', amount: '12.00', chargeStatus: '待计费', balance: '充足', owner: '收费员陈', nextAction: '计费确认' },
  { id: 'FEE-003', patient: '赵明', dialysisNo: 'HD-00116', item: '高钾复查', source: '检验医嘱', amount: '45.00', chargeStatus: '已计费', balance: '欠费', owner: '收费员钱', nextAction: '欠费提醒' },
  { id: 'FEE-004', patient: '刘梦莹', dialysisNo: 'HD-00151', item: '血液灌流器', source: '耗材消耗', amount: '980.00', chargeStatus: '待确认', balance: '充足', owner: '收费员钱', nextAction: '同意书核对' },
  { id: 'FEE-005', patient: '何雪', dialysisNo: 'HD-00246', item: '司维拉姆片', source: '药品消耗', amount: '138.00', chargeStatus: '接口待同步', balance: '充足', owner: '接口管理员', nextAction: 'HIS同步' },
  { id: 'FEE-006', patient: '马丽', dialysisNo: 'HD-00203', item: '隔离治疗包', source: '耗材消耗', amount: '120.00', chargeStatus: '已计费', balance: '充足', owner: '收费员陈', nextAction: '感控追溯' },
  { id: 'FEE-007', patient: '周庆', dialysisNo: 'HD-00218', item: '穿刺针', source: '耗材消耗', amount: '16.00', chargeStatus: '已计费', balance: '欠费', owner: '收费员钱', nextAction: '余额提醒' },
  { id: 'FEE-008', patient: '陈敏', dialysisNo: 'HD-00341', item: '骨化三醇', source: '药品消耗', amount: '42.00', chargeStatus: '已计费', balance: '充足', owner: '收费员陈', nextAction: '归档' },
  { id: 'FEE-009', patient: '潘德胜', dialysisNo: 'HD-00305', item: 'GCP研究药物', source: 'CRC站', amount: '0.00', chargeStatus: '不计费', balance: '充足', owner: 'GCP药师', nextAction: '研究台账' },
  { id: 'FEE-010', patient: '郭强', dialysisNo: 'HD-00277', item: 'Kt/V检测', source: '检验医嘱', amount: '45.00', chargeStatus: '待计费', balance: '充足', owner: '收费员陈', nextAction: '计费确认' },
];
const sessionSummaries: SessionSummary[] = [
  { dialysisNo: 'HD-00038', patient: '王建国', treatmentFee: '420.00', drugFee: '56.00', materialFee: '253.00', labFee: '0.00', total: '729.00', status: '已确认', nextAction: '归档报表' },
  { dialysisNo: 'HD-00072', patient: '李秀英', treatmentFee: '420.00', drugFee: '96.00', materialFee: '12.00', labFee: '0.00', total: '528.00', status: '待计费', nextAction: '补全导管护理耗材' },
  { dialysisNo: 'HD-00116', patient: '赵明', treatmentFee: '420.00', drugFee: '18.00', materialFee: '0.00', labFee: '45.00', total: '483.00', status: '欠费提醒', nextAction: '导诊沟通' },
  { dialysisNo: 'HD-00151', patient: '刘梦莹', treatmentFee: '420.00', drugFee: '0.00', materialFee: '980.00', labFee: '0.00', total: '1400.00', status: '待确认', nextAction: '高值耗材同意书核对' },
];
const patientSummaries: PatientSummary[] = [
  { patient: '王建国', monthTotal: '2860.00', paid: '2860.00', balance: '充足', arrears: '0.00', owner: '收费员陈', nextAction: '持续治疗' },
  { patient: '赵明', monthTotal: '3128.00', paid: '1848.00', balance: '欠费', arrears: '1280.00', owner: '收费员钱', nextAction: '欠费提醒' },
  { patient: '周庆', monthTotal: '2456.00', paid: '2216.00', balance: '欠费', arrears: '240.00', owner: '收费员钱', nextAction: '余额提醒' },
  { patient: '潘德胜', monthTotal: '0.00', paid: '0.00', balance: 'GCP隔离', arrears: '0.00', owner: 'GCP药师', nextAction: '研究费用隔离' },
];
const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['charge_detail', 'patient_account_balance', 'fee_reversal_record', 'his_charge_sync'];
const metrics = computed(() => [{ label: '费用明细', value: rows.length, tone: 'blue' }, { label: '待计费', value: rows.filter((i) => i.chargeStatus === '待计费').length, tone: 'orange' }, { label: '接口待同步', value: rows.filter((i) => i.chargeStatus === '接口待同步').length, tone: 'red' }, { label: '欠费', value: rows.filter((i) => i.balance === '欠费').length, tone: 'red' }, { label: '已计费', value: rows.filter((i) => i.chargeStatus === '已计费').length, tone: 'green' }]);
function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' { if (value === '已计费' || value === '已确认' || value === '充足' || value === '不计费') return 'success'; if (value.includes('待')) return 'warning'; if (value === '欠费' || value.includes('接口') || value.includes('欠费')) return 'danger'; return 'info'; }
function selectRow(row: Row): void { selectedId.value = row.id; }
function submitAction(message: string): void { ElMessage.success(message); }
</script>

<template>
  <section class="stock-fee-page">
    <el-card class="stock-work-card" shadow="never">
      <template #header><div class="stock-header"><div><h2>{{ props.context.menuTitle }}</h2><p>汇总患者费用明细、单次透析费用和患者费用汇总，处理计费、冲红、欠费提醒和 HIS 同步。</p></div><div class="stock-actions"><el-button type="primary" :icon="Coin" @click="chargeDialogVisible = true">计费确认</el-button><el-button :icon="Warning" @click="debtDialogVisible = true">欠费提醒</el-button><el-button :icon="CircleCheck" @click="traceDrawerVisible = true">费用追溯</el-button></div></div></template>
      <el-form class="stock-filter" inline><el-form-item label="关键字"><el-input placeholder="患者、费用项、来源、责任人" clearable /></el-form-item><el-form-item label="计费状态"><el-select placeholder="全部状态" clearable><el-option label="待计费" value="待计费" /><el-option label="已计费" value="已计费" /><el-option label="接口待同步" value="接口待同步" /></el-select></el-form-item><el-form-item label="余额"><el-select placeholder="全部余额" clearable><el-option label="充足" value="充足" /><el-option label="欠费" value="欠费" /></el-select></el-form-item><el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item></el-form>
      <div class="stock-stat-grid"><el-card v-for="item in metrics" :key="item.label" :class="['stock-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>

      <el-row :gutter="16" class="stock-summary-grid">
        <el-col :xs="24" :xl="14">
          <el-card class="stock-main-card" shadow="never">
            <template #header><div class="stock-card-header"><strong>单次透析费用汇总</strong><el-tag effect="plain">治疗费 + 药品 + 耗材 + 检验</el-tag></div></template>
            <el-table :data="sessionSummaries" border stripe>
              <el-table-column prop="dialysisNo" label="透析号" width="110" fixed="left" />
              <el-table-column prop="patient" label="患者" width="95" />
              <el-table-column prop="treatmentFee" label="治疗费" width="90" />
              <el-table-column prop="drugFee" label="药品" width="80" />
              <el-table-column prop="materialFee" label="耗材" width="80" />
              <el-table-column prop="labFee" label="检验" width="80" />
              <el-table-column prop="total" label="合计" width="90" />
              <el-table-column prop="status" label="状态" width="95"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
              <el-table-column prop="nextAction" label="下一步" min-width="150" />
            </el-table>
          </el-card>
        </el-col>
        <el-col :xs="24" :xl="10">
          <el-card class="stock-main-card" shadow="never">
            <template #header><div class="stock-card-header"><strong>患者费用汇总</strong><el-tag effect="plain">月度费用 / 余额 / 欠费</el-tag></div></template>
            <el-table :data="patientSummaries" border stripe>
              <el-table-column prop="patient" label="患者" width="95" fixed="left" />
              <el-table-column prop="monthTotal" label="月费用" width="90" />
              <el-table-column prop="paid" label="已缴" width="90" />
              <el-table-column prop="balance" label="余额" width="90"><template #default="{ row }"><el-tag :type="tagType(row.balance)">{{ row.balance }}</el-tag></template></el-table-column>
              <el-table-column prop="arrears" label="欠费" width="90" />
              <el-table-column prop="nextAction" label="下一步" min-width="120" />
            </el-table>
          </el-card>
        </el-col>
      </el-row>

      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow"><el-table-column prop="patient" label="患者" width="95" fixed="left" /><el-table-column prop="dialysisNo" label="透析号" width="110" /><el-table-column prop="item" label="费用项" min-width="140" /><el-table-column prop="source" label="来源" width="110" /><el-table-column prop="amount" label="金额" width="90" /><el-table-column prop="chargeStatus" label="计费" width="100"><template #default="{ row }"><el-tag :type="tagType(row.chargeStatus)">{{ row.chargeStatus }}</el-tag></template></el-table-column><el-table-column prop="balance" label="余额" width="90"><template #default="{ row }"><el-tag :type="tagType(row.balance)" effect="plain">{{ row.balance }}</el-tag></template></el-table-column><el-table-column prop="owner" label="责任人" width="110" /><el-table-column prop="nextAction" label="下一步" min-width="120" /></el-table>
    </el-card>    <el-dialog v-model="chargeDialogVisible" title="计费确认" width="620px"><el-form label-width="100px"><el-form-item label="患者"><el-input :model-value="currentRow.patient" disabled /></el-form-item><el-form-item label="费用项"><el-input :model-value="currentRow.item" disabled /></el-form-item><el-form-item label="计费结果"><el-radio-group model-value="charge"><el-radio-button label="charge">确认计费</el-radio-button><el-radio-button label="hold">暂缓</el-radio-button><el-radio-button label="free">不计费</el-radio-button></el-radio-group></el-form-item><el-form-item label="说明"><el-input type="textarea" :rows="3" placeholder="记录费用口径、HIS同步和异常原因" /></el-form-item></el-form><template #footer><el-button @click="chargeDialogVisible = false">取消</el-button><el-button type="primary" @click="chargeDialogVisible = false; submitAction('费用计费已确认')">确认计费</el-button></template></el-dialog>
    <el-dialog v-model="debtDialogVisible" title="欠费提醒" width="580px"><el-form label-width="100px"><el-form-item label="患者"><el-input :model-value="currentRow.patient" disabled /></el-form-item><el-form-item label="提醒方式"><el-radio-group model-value="message"><el-radio-button label="message">站内消息</el-radio-button><el-radio-button label="phone">电话</el-radio-button><el-radio-button label="guide">导诊台</el-radio-button></el-radio-group></el-form-item><el-form-item label="提醒说明"><el-input type="textarea" :rows="3" placeholder="记录欠费金额、处理人和下一步" /></el-form-item></el-form><template #footer><el-button @click="debtDialogVisible = false">取消</el-button><el-button type="primary" @click="debtDialogVisible = false; submitAction('欠费提醒已生成')">发送提醒</el-button></template></el-dialog>
    <el-drawer v-model="traceDrawerVisible" title="费用追溯" size="520px"><el-timeline><el-timeline-item timestamp="治疗完成" type="primary">生成费用：{{ currentRow.item }}</el-timeline-item><el-timeline-item timestamp="计费确认">写入患者费用明细</el-timeline-item><el-timeline-item timestamp="HIS同步" type="success">同步收费接口并保留审计</el-timeline-item></el-timeline></el-drawer>
  </section>
</template>
