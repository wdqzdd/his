<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, Coin, Search, Tickets } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();
type Row = { id: string; patient: string; dialysisNo: string; sourceType: string; orderItem: string; drug: string; lotNo: string; quantity: string; amount: string; consumeStatus: string; chargeStatus: string; nextAction: string };
const selectedId = ref('DUSE-001');
const consumeDialogVisible = ref(false);
const feeDrawerVisible = ref(false);
const rows: Row[] = [
  { id: 'DUSE-001', patient: '王建国', dialysisNo: 'HD-00038', sourceType: '透析过程用药', orderItem: '低分子肝素钙', drug: '低分子肝素钙注射液', lotNo: 'LMWH260401', quantity: '1支', amount: '56.00', consumeStatus: '已扣减', chargeStatus: '已计费', nextAction: '治疗记录引用' },
  { id: 'DUSE-002', patient: '李秀英', dialysisNo: 'HD-00072', sourceType: '医嘱用药记录', orderItem: '促红素', drug: '促红素注射液', lotNo: 'EPO260312', quantity: '1支', amount: '96.00', consumeStatus: '待复核', chargeStatus: '待计费', nextAction: '护士复核' },
  { id: 'DUSE-003', patient: '赵明', dialysisNo: 'HD-00116', sourceType: '医嘱用药记录', orderItem: '高钾处理', drug: '聚苯乙烯磺酸钙散', lotNo: 'CAL260221', quantity: '1包', amount: '18.00', consumeStatus: '已扣减', chargeStatus: '已计费', nextAction: '医生复查' },
  { id: 'DUSE-004', patient: '何雪', dialysisNo: 'HD-00246', sourceType: '自备药使用记录', orderItem: '降磷治疗', drug: '司维拉姆片', lotNo: 'SELF-SEV2605', quantity: '1盒', amount: '0.00', consumeStatus: '接口待同步', chargeStatus: '不计费', nextAction: '自备药告知确认' },
  { id: 'DUSE-005', patient: '孙海', dialysisNo: 'HD-00177', sourceType: '透析过程用药', orderItem: '左卡尼汀', drug: '左卡尼汀注射液', lotNo: 'LC260210', quantity: '1支', amount: '18.00', consumeStatus: '已扣减', chargeStatus: '已计费', nextAction: '患者宣教' },
  { id: 'DUSE-006', patient: '陈敏', dialysisNo: 'HD-00341', sourceType: '医嘱用药记录', orderItem: '骨化三醇', drug: '骨化三醇胶丸', lotNo: 'CAL260501', quantity: '7粒', amount: '42.00', consumeStatus: '已扣减', chargeStatus: '已计费', nextAction: '钙磷复查' },
  { id: 'DUSE-007', patient: '马丽', dialysisNo: 'HD-00305', sourceType: '隔离区用药', orderItem: '恩替卡韦', drug: '恩替卡韦片', lotNo: 'ETV260207', quantity: '1盒', amount: '72.00', consumeStatus: '待复核', chargeStatus: '待计费', nextAction: '隔离区复核' },
  { id: 'DUSE-008', patient: '周庆', dialysisNo: 'HD-00218', sourceType: '自备药使用记录', orderItem: '利尿调整', drug: '呋塞米片', lotNo: 'SELF-FUR2605', quantity: '1瓶', amount: '0.00', consumeStatus: '已扣减', chargeStatus: '不计费', nextAction: '患者库存回写' },
  { id: 'DUSE-009', patient: '陈志强', dialysisNo: 'HD-00128', sourceType: '医嘱用药记录', orderItem: '米多君', drug: '米多君片', lotNo: 'MID260030', quantity: '1盒', amount: '28.00', consumeStatus: '待扣减', chargeStatus: '待确认', nextAction: '库存锁定' },
  { id: 'DUSE-010', patient: '郭强', dialysisNo: 'HD-00322', sourceType: 'GCP药物使用记录', orderItem: '研究药物访视V3', drug: '研究药物A', lotNo: 'GCP-A2603', quantity: '1盒', amount: '0.00', consumeStatus: '待复核', chargeStatus: '不计费', nextAction: 'CRC台账同步' },
];
const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['medication_consumption', 'stock_transaction', 'charge_detail', 'gcp_drug_record'];
const metrics = computed(() => [{ label: '消耗总数', value: rows.length, tone: 'blue' }, { label: '自备药', value: rows.filter((i) => i.sourceType === '自备药使用记录').length, tone: 'green' }, { label: 'GCP药物', value: rows.filter((i) => i.sourceType === 'GCP药物使用记录').length, tone: 'red' }, { label: '待复核', value: rows.filter((i) => i.consumeStatus === '待复核').length, tone: 'orange' }, { label: '接口待同步', value: rows.filter((i) => i.consumeStatus === '接口待同步').length, tone: 'red' }]);
function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' { if (value === '已扣减' || value === '已计费' || value === '不计费') return 'success'; if (value.includes('待')) return 'warning'; if (value.includes('接口') || value.includes('GCP')) return 'danger'; return 'info'; }
function selectRow(row: Row): void { selectedId.value = row.id; }
function submitAction(message: string): void { ElMessage.success(message); }
</script>

<template>
  <section class="stock-fee-page">
    <el-card class="stock-work-card" shadow="never">
      <template #header><div class="stock-header"><div><h2>{{ props.context.menuTitle }}</h2><p>按透析过程、医嘱、自备药和 GCP 药物记录自动生成药品消耗，确认批号扣减和费用明细。</p></div><div class="stock-actions"><el-button type="primary" :icon="CircleCheck" @click="consumeDialogVisible = true">确认消耗</el-button><el-button :icon="Coin" @click="feeDrawerVisible = true">费用明细</el-button><el-button :icon="Tickets" @click="feeDrawerVisible = true">批号追溯</el-button></div></div></template>
      <el-form class="stock-filter" inline><el-form-item label="关键字"><el-input placeholder="患者、透析号、药品、批号" clearable /></el-form-item><el-form-item label="来源"><el-select placeholder="全部来源" clearable><el-option label="透析过程用药" value="透析过程用药" /><el-option label="医嘱用药记录" value="医嘱用药记录" /><el-option label="自备药使用记录" value="自备药使用记录" /><el-option label="GCP药物使用记录" value="GCP药物使用记录" /></el-select></el-form-item><el-form-item label="消耗状态"><el-select placeholder="全部状态" clearable><el-option label="已扣减" value="已扣减" /><el-option label="待复核" value="待复核" /><el-option label="接口待同步" value="接口待同步" /></el-select></el-form-item><el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item></el-form>
      <div class="stock-stat-grid"><el-card v-for="item in metrics" :key="item.label" :class="['stock-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>
      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow"><el-table-column prop="patient" label="患者" width="95" fixed="left" /><el-table-column prop="dialysisNo" label="透析号" width="110" /><el-table-column prop="sourceType" label="来源" width="135" /><el-table-column prop="orderItem" label="医嘱/访视" min-width="130" /><el-table-column prop="drug" label="药品" min-width="160" /><el-table-column prop="lotNo" label="批号" width="120" /><el-table-column prop="quantity" label="数量" width="80" /><el-table-column prop="amount" label="金额" width="90" /><el-table-column prop="consumeStatus" label="消耗" width="100"><template #default="{ row }"><el-tag :type="tagType(row.consumeStatus)">{{ row.consumeStatus }}</el-tag></template></el-table-column><el-table-column prop="chargeStatus" label="计费" width="90"><template #default="{ row }"><el-tag :type="tagType(row.chargeStatus)" effect="plain">{{ row.chargeStatus }}</el-tag></template></el-table-column><el-table-column prop="nextAction" label="下一步" min-width="120" /></el-table>
    </el-card>    <el-dialog v-model="consumeDialogVisible" title="药品消耗确认" width="620px"><el-form label-width="100px"><el-form-item label="患者"><el-input :model-value="currentRow.patient" disabled /></el-form-item><el-form-item label="药品批号"><el-input :model-value="`${currentRow.drug} / ${currentRow.lotNo}`" disabled /></el-form-item><el-form-item label="确认结果"><el-radio-group model-value="done"><el-radio-button label="done">确认扣减</el-radio-button><el-radio-button label="hold">暂缓</el-radio-button></el-radio-group></el-form-item><el-form-item label="说明"><el-input type="textarea" :rows="3" placeholder="记录执行人、费用口径和异常说明" /></el-form-item></el-form><template #footer><el-button @click="consumeDialogVisible = false">取消</el-button><el-button type="primary" @click="consumeDialogVisible = false; submitAction('药品消耗已确认')">确认消耗</el-button></template></el-dialog>
    <el-drawer v-model="feeDrawerVisible" title="药品费用与批号追溯" size="520px"><el-descriptions :column="1" border><el-descriptions-item label="患者">{{ currentRow.patient }}</el-descriptions-item><el-descriptions-item label="来源">{{ currentRow.sourceType }}</el-descriptions-item><el-descriptions-item label="药品">{{ currentRow.drug }}</el-descriptions-item><el-descriptions-item label="批号">{{ currentRow.lotNo }}</el-descriptions-item><el-descriptions-item label="金额">{{ currentRow.amount }}</el-descriptions-item><el-descriptions-item label="下一步">{{ currentRow.nextAction }}</el-descriptions-item></el-descriptions></el-drawer>
  </section>
</template>
