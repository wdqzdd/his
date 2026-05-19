<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  CircleCheck,
  Coin,
  DocumentAdd,
  Files,
  Search,
  Tickets,
  Warning,
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{
  context: PageContext;
}>();

type StockLot = {
  id: string;
  itemType: string;
  name: string;
  spec: string;
  lotNo: string;
  udi: string;
  expireDate: string;
  quantity: number;
  unit: string;
  warehouse: string;
  warning: string;
  supplier: string;
  nextAction: string;
};

type ConsumptionRow = {
  id: string;
  patient: string;
  dialysisNo: string;
  session: string;
  orderItem: string;
  itemType: string;
  itemName: string;
  lotNo: string;
  quantity: string;
  chargeAmount: string;
  consumeStatus: string;
  chargeStatus: string;
  traceStatus: string;
};

const sectionByMenu: Record<string, string> = {
  'stock-drug-io': 'stock',
  'stock-drug-warning': 'warning',
  'stock-drug-use': 'consume',
  'stock-material-io': 'stock',
  'stock-material-warning': 'warning',
  'stock-material-use': 'consume',
  'stock-fee': 'fee',
};

const activeTab = ref(sectionByMenu[props.context.menuKey] ?? 'stock');
const selectedLotId = ref('LOT-001');
const inoutDialogVisible = ref(false);
const consumeDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const feeDrawerVisible = ref(false);
const warningDialogVisible = ref(false);

watch(
  () => props.context.menuKey,
  (menuKey) => {
    activeTab.value = sectionByMenu[menuKey] ?? 'stock';
  },
);

const stockLots = ref<StockLot[]>([
  { id: 'LOT-001', itemType: '药品', name: '低分子肝素钙注射液', spec: '4100AXaIU/支', lotNo: 'LMWH260401', udi: 'UDI-D-100001', expireDate: '2027-04-01', quantity: 326, unit: '支', warehouse: '透析药房', warning: '正常', supplier: '华东医药', nextAction: '按医嘱消耗' },
  { id: 'LOT-002', itemType: '药品', name: '促红素注射液', spec: '4000IU/支', lotNo: 'EPO260312', udi: 'UDI-D-100002', expireDate: '2026-08-15', quantity: 88, unit: '支', warehouse: '透析药房', warning: '低库存', supplier: '国药控股', nextAction: '生成补货' },
  { id: 'LOT-003', itemType: '药品', name: '左卡尼汀注射液', spec: '1g/支', lotNo: 'LC260210', udi: 'UDI-D-100003', expireDate: '2026-07-02', quantity: 52, unit: '支', warehouse: '透析药房', warning: '近效期', supplier: '上药控股', nextAction: '优先消耗' },
  { id: 'LOT-004', itemType: '药品', name: '骨化三醇胶丸', spec: '0.25ug/粒', lotNo: 'CAL260501', udi: 'UDI-D-100004', expireDate: '2027-05-01', quantity: 1200, unit: '粒', warehouse: '中心库', warning: '正常', supplier: '国药控股', nextAction: '正常发放' },
  { id: 'LOT-005', itemType: '耗材', name: '透析器', spec: 'FX80', lotNo: 'DIAL260405', udi: 'UDI-M-200001', expireDate: '2028-04-05', quantity: 240, unit: '支', warehouse: '耗材库', warning: '正常', supplier: '费森尤斯', nextAction: '治疗自动消耗' },
  { id: 'LOT-006', itemType: '耗材', name: '血液灌流器', spec: 'HA130', lotNo: 'HP260301', udi: 'UDI-M-200002', expireDate: '2027-03-01', quantity: 18, unit: '支', warehouse: '耗材库', warning: '低库存', supplier: '健帆', nextAction: '补货审批' },
  { id: 'LOT-007', itemType: '耗材', name: '动静脉穿刺针', spec: '16G', lotNo: 'AVN260320', udi: 'UDI-M-200003', expireDate: '2028-03-20', quantity: 980, unit: '支', warehouse: '护士站二级库', warning: '正常', supplier: '威高', nextAction: '二级库消耗' },
  { id: 'LOT-008', itemType: '耗材', name: '透析管路', spec: '成人标准', lotNo: 'LINE260118', udi: 'UDI-M-200004', expireDate: '2026-06-18', quantity: 66, unit: '套', warehouse: '护士站二级库', warning: '近效期', supplier: '贝朗', nextAction: '优先消耗' },
  { id: 'LOT-009', itemType: '耗材', name: '碘伏棉签', spec: '10支/包', lotNo: 'IOD260422', udi: 'UDI-M-200005', expireDate: '2027-04-22', quantity: 420, unit: '包', warehouse: '护士站二级库', warning: '正常', supplier: '稳健医疗', nextAction: '导管护理消耗' },
  { id: 'LOT-010', itemType: '耗材', name: '无菌敷贴', spec: '10cm*12cm', lotNo: 'DRS260201', udi: 'UDI-M-200006', expireDate: '2026-06-01', quantity: 34, unit: '片', warehouse: '护士站二级库', warning: '近效期', supplier: '3M', nextAction: '优先消耗' },
  { id: 'LOT-011', itemType: '耗材', name: '隔离治疗包', spec: '乙肝隔离', lotNo: 'ISO260510', udi: 'UDI-M-200007', expireDate: '2027-05-10', quantity: 25, unit: '包', warehouse: '隔离区库', warning: '低库存', supplier: '威高', nextAction: '补货审批' },
  { id: 'LOT-012', itemType: '耗材', name: '透析液浓缩液A液', spec: '10L', lotNo: 'DFA260430', udi: 'UDI-M-200008', expireDate: '2026-09-30', quantity: 160, unit: '桶', warehouse: '配液间', warning: '正常', supplier: '百特', nextAction: '设备站核对' },
]);

const consumptions = ref<ConsumptionRow[]>([
  { id: 'CON-001', patient: '王建国', dialysisNo: 'HD-00038', session: '2026-05-10 A08', orderItem: '低分子肝素钙', itemType: '药品', itemName: '低分子肝素钙注射液', lotNo: 'LMWH260401', quantity: '1支', chargeAmount: '56.00', consumeStatus: '已扣减', chargeStatus: '已计费', traceStatus: '完整' },
  { id: 'CON-002', patient: '王建国', dialysisNo: 'HD-00038', session: '2026-05-10 A08', orderItem: '常规HD', itemType: '耗材', itemName: '透析器 FX80', lotNo: 'DIAL260405', quantity: '1支', chargeAmount: '168.00', consumeStatus: '已扣减', chargeStatus: '已计费', traceStatus: '完整' },
  { id: 'CON-003', patient: '李秀兰', dialysisNo: 'HD-00072', session: '2026-05-10 A12', orderItem: '导管出口护理', itemType: '耗材', itemName: '无菌敷贴', lotNo: 'DRS260201', quantity: '1片', chargeAmount: '12.00', consumeStatus: '待复核', chargeStatus: '待计费', traceStatus: '批号待确认' },
  { id: 'CON-004', patient: '陈志强', dialysisNo: 'HD-00128', session: '2026-05-10 B07', orderItem: 'HD+HF', itemType: '耗材', itemName: '透析管路', lotNo: 'LINE260118', quantity: '1套', chargeAmount: '85.00', consumeStatus: '已扣减', chargeStatus: '已计费', traceStatus: '完整' },
  { id: 'CON-005', patient: '刘梅英', dialysisNo: 'HD-00151', session: '2026-05-10 C02', orderItem: '血液灌流', itemType: '耗材', itemName: '血液灌流器 HA130', lotNo: 'HP260301', quantity: '1支', chargeAmount: '980.00', consumeStatus: '待扣减', chargeStatus: '待确认', traceStatus: '同意书待确认' },
  { id: 'CON-006', patient: '孙海', dialysisNo: 'HD-00177', session: '2026-05-11 A05', orderItem: '左卡尼汀', itemType: '药品', itemName: '左卡尼汀注射液', lotNo: 'LC260210', quantity: '1支', chargeAmount: '18.00', consumeStatus: '已扣减', chargeStatus: '已计费', traceStatus: '完整' },
  { id: 'CON-007', patient: '马丽', dialysisNo: 'HD-00203', session: '2026-05-11 ISO01', orderItem: '隔离透析', itemType: '耗材', itemName: '隔离治疗包', lotNo: 'ISO260510', quantity: '1包', chargeAmount: '120.00', consumeStatus: '已扣减', chargeStatus: '已计费', traceStatus: '完整' },
  { id: 'CON-008', patient: '周庆', dialysisNo: 'HD-00218', session: '2026-05-11 A16', orderItem: '常规HD', itemType: '耗材', itemName: '动静脉穿刺针', lotNo: 'AVN260320', quantity: '2支', chargeAmount: '16.00', consumeStatus: '已扣减', chargeStatus: '已计费', traceStatus: '完整' },
  { id: 'CON-009', patient: '何雪', dialysisNo: 'HD-00246', session: '2026-05-11 B11', orderItem: '碳酸司维拉姆', itemType: '药品', itemName: '碳酸司维拉姆', lotNo: 'SEV260410', quantity: '1盒', chargeAmount: '138.00', consumeStatus: '接口待同步', chargeStatus: '待计费', traceStatus: 'HIS待回写' },
  { id: 'CON-010', patient: '郭强', dialysisNo: 'HD-00277', session: '2026-05-11 C06', orderItem: '透析充分性复评', itemType: '费用', itemName: 'Kt/V检测', lotNo: '-', quantity: '1次', chargeAmount: '45.00', consumeStatus: '无库存', chargeStatus: '已计费', traceStatus: '完整' },
  { id: 'CON-011', patient: '曹敏', dialysisNo: 'HD-00291', session: '2026-05-12 A10', orderItem: '骨化三醇', itemType: '药品', itemName: '骨化三醇胶丸', lotNo: 'CAL260501', quantity: '7粒', chargeAmount: '42.00', consumeStatus: '已扣减', chargeStatus: '已计费', traceStatus: '完整' },
  { id: 'CON-012', patient: '潘德胜', dialysisNo: 'HD-00305', session: '2026-05-12 B15', orderItem: '跌倒风险宣教', itemType: '费用', itemName: '护理宣教', lotNo: '-', quantity: '1次', chargeAmount: '0.00', consumeStatus: '无库存', chargeStatus: '不计费', traceStatus: '完整' },
]);

const selectedLot = computed(() => stockLots.value.find((item) => item.id === selectedLotId.value) ?? stockLots.value[0]);

const metrics = computed(() => [
  { label: '库存批次', value: stockLots.value.length, tone: 'blue' },
  { label: '低库存', value: stockLots.value.filter((item) => item.warning === '低库存').length, tone: 'red' },
  { label: '近效期', value: stockLots.value.filter((item) => item.warning === '近效期').length, tone: 'orange' },
  { label: '今日消耗', value: consumptions.value.length, tone: 'green' },
  { label: '待计费', value: consumptions.value.filter((item) => item.chargeStatus.includes('待')).length, tone: 'orange' },
]);

const lotTrace = computed(() => [
  { label: '基础资料', value: `${selectedLot.value.name} / ${selectedLot.value.spec}`, pass: true },
  { label: '批号效期', value: `${selectedLot.value.lotNo} / ${selectedLot.value.expireDate}`, pass: selectedLot.value.warning !== '近效期' },
  { label: 'UDI/批号', value: selectedLot.value.udi, pass: selectedLot.value.udi !== '-' },
  { label: '当前库存', value: `${selectedLot.value.quantity}${selectedLot.value.unit}`, pass: selectedLot.value.warning !== '低库存' },
  { label: '仓库位置', value: selectedLot.value.warehouse, pass: true },
]);

const activeTables = ['stock_lot', 'stock_transaction', 'medication_consumption', 'material_consumption', 'charge_detail', 'patient_account_balance'];

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (['正常', '已扣减', '已计费', '完整', '不计费', '无库存'].includes(value)) return 'success';
  if (['低库存', '待扣减', '待确认'].includes(value) || value.includes('欠费')) return 'danger';
  if (value.includes('待') || value.includes('近效期') || value.includes('接口') || value.includes('批号')) return 'warning';
  return 'info';
}

function selectLot(row: StockLot): void {
  selectedLotId.value = row.id;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}

function saveInout(): void {
  selectedLot.value.quantity += 20;
  inoutDialogVisible.value = false;
  submitAction('出入库流水已保存，批号库存已更新');
}

function saveConsume(): void {
  consumeDialogVisible.value = false;
  submitAction('治疗消耗已确认，库存扣减和费用明细已生成');
}
</script>

<template>
  <section class="stock-fee-page">
    <el-card class="stock-work-card" shadow="never">
      <template #header>
        <div class="stock-header">
          <div>
            <h2>药品耗材与费用消耗</h2>
            <p>按医嘱和治疗记录自动生成药品、耗材和费用消耗，支持批号/效期/UDI追溯、库存预警和欠费提醒。</p>
          </div>
          <div class="stock-actions">
            <el-button type="primary" :icon="DocumentAdd" @click="inoutDialogVisible = true">出入库登记</el-button>
            <el-button :icon="CircleCheck" @click="consumeDialogVisible = true">确认消耗</el-button>
            <el-button :icon="Warning" @click="warningDialogVisible = true">处理预警</el-button>
            <el-button :icon="Coin" @click="feeDrawerVisible = true">费用明细</el-button>
            <el-button :icon="Tickets" @click="traceDrawerVisible = true">批号追溯</el-button>
          </div>
        </div>
      </template>

      <el-form class="stock-filter" inline>
        <el-form-item label="关键字">
          <el-input placeholder="药品、耗材、批号、患者、透析号" clearable />
        </el-form-item>
        <el-form-item label="类别">
          <el-select placeholder="全部类别" clearable>
            <el-option label="药品" value="drug" />
            <el-option label="耗材" value="material" />
            <el-option label="费用" value="fee" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select placeholder="全部状态" clearable>
            <el-option label="正常" value="normal" />
            <el-option label="低库存" value="low" />
            <el-option label="近效期" value="expire" />
            <el-option label="待计费" value="charge" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker type="date" placeholder="业务日期" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>

      <div class="stock-stat-grid">
        <el-card v-for="item in metrics" :key="item.label" :class="['stock-stat-card', item.tone]" shadow="never">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </el-card>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :xl="16">
          <el-card class="stock-main-card" shadow="never">
            <template #header>
              <div class="stock-card-header">
                <div>
                  <strong>批号库存</strong>
                  <p>示例数据不少于 10 条，覆盖药品、耗材、二级库、低库存、近效期和 UDI/批号追溯。</p>
                </div>
                <el-tag type="primary" effect="plain">批号库存 -> 治疗消耗 -> 费用明细</el-tag>
              </div>
            </template>
            <el-table :data="stockLots" border stripe highlight-current-row row-key="id" @row-click="selectLot">
              <el-table-column prop="itemType" label="类别" width="80" fixed="left" />
              <el-table-column prop="name" label="名称" min-width="160" />
              <el-table-column prop="spec" label="规格" min-width="120" />
              <el-table-column prop="lotNo" label="批号" min-width="130" />
              <el-table-column prop="udi" label="UDI/追溯码" min-width="140" />
              <el-table-column prop="expireDate" label="效期" width="115" />
              <el-table-column label="库存" width="100">
                <template #default="{ row }">{{ row.quantity }}{{ row.unit }}</template>
              </el-table-column>
              <el-table-column prop="warehouse" label="仓库" min-width="130" />
              <el-table-column prop="warning" label="预警" width="100">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.warning)">{{ row.warning }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="supplier" label="供应商" min-width="120" />
              <el-table-column prop="nextAction" label="下一步" min-width="130" />
              <el-table-column label="操作" width="230" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click.stop="selectLot(row); inoutDialogVisible = true">出入库</el-button>
                  <el-button link @click.stop="selectLot(row); consumeDialogVisible = true">消耗</el-button>
                  <el-button link @click.stop="selectLot(row); traceDrawerVisible = true">追溯</el-button>
                  <el-button link @click.stop="selectLot(row); warningDialogVisible = true">预警</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>

        <el-col :xs="24" :xl="8">
          <el-card class="stock-side-card" shadow="never">
            <template #header>
              <div class="stock-card-header">
                <strong>当前批号追溯检查</strong>
                <el-tag :type="tagType(selectedLot.warning)">{{ selectedLot.warning }}</el-tag>
              </div>
            </template>
            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="名称">{{ selectedLot.name }}</el-descriptions-item>
              <el-descriptions-item label="批号">{{ selectedLot.lotNo }}</el-descriptions-item>
              <el-descriptions-item label="UDI">{{ selectedLot.udi }}</el-descriptions-item>
              <el-descriptions-item label="仓库">{{ selectedLot.warehouse }}</el-descriptions-item>
            </el-descriptions>
            <div class="stock-check-list">
              <div v-for="item in lotTrace" :key="item.label" class="stock-check-row">
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
                <el-icon :class="{ pass: item.pass, block: !item.pass }">
                  <CircleCheck v-if="item.pass" />
                  <Warning v-else />
                </el-icon>
              </div>
            </div>
            <div class="stock-quick-actions">
              <el-button type="primary" @click="traceDrawerVisible = true">查看追溯链</el-button>
              <el-button @click="warningDialogVisible = true">处理预警</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="stock-workspace-card" shadow="never">
      <template #header>
        <div class="stock-card-header">
          <div>
            <strong>治疗消耗与费用</strong>
            <p>来自治疗记录和医嘱执行的自动消耗必须能追到患者、治疗、医嘱、批号、费用和收费状态。</p>
          </div>
          <el-button type="primary" :icon="Coin" @click="feeDrawerVisible = true">查看费用</el-button>
        </div>
      </template>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="治疗自动消耗" name="consume">
          <el-table :data="consumptions" border stripe>
            <el-table-column prop="patient" label="患者" width="95" fixed="left" />
            <el-table-column prop="dialysisNo" label="透析号" width="115" />
            <el-table-column prop="session" label="治疗记录" min-width="140" />
            <el-table-column prop="orderItem" label="医嘱/治疗项目" min-width="150" />
            <el-table-column prop="itemType" label="类别" width="80" />
            <el-table-column prop="itemName" label="消耗项目" min-width="160" />
            <el-table-column prop="lotNo" label="批号" min-width="120" />
            <el-table-column prop="quantity" label="数量" width="80" />
            <el-table-column prop="chargeAmount" label="金额" width="90" />
            <el-table-column prop="consumeStatus" label="扣减" width="110">
              <template #default="{ row }">
                <el-tag :type="tagType(row.consumeStatus)">{{ row.consumeStatus }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="chargeStatus" label="计费" width="100">
              <template #default="{ row }">
                <el-tag :type="tagType(row.chargeStatus)" effect="plain">{{ row.chargeStatus }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="traceStatus" label="追溯" width="120">
              <template #default="{ row }">
                <el-tag :type="tagType(row.traceStatus)" effect="plain">{{ row.traceStatus }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="170" fixed="right">
              <template #default>
                <el-button link type="primary" @click="consumeDialogVisible = true">确认</el-button>
                <el-button link @click="feeDrawerVisible = true">费用</el-button>
                <el-button link @click="traceDrawerVisible = true">追溯</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="费用与欠费提醒" name="fee">
          <div class="fee-board-grid">
            <el-card shadow="never" class="fee-board-card">
              <strong>已计费金额</strong>
              <span>1,680.00</span>
              <p>来自药品、耗材、治疗项目和检验费用。</p>
            </el-card>
            <el-card shadow="never" class="fee-board-card danger">
              <strong>欠费提醒</strong>
              <span>3人</span>
              <p>临床治疗不因提示自动中断，但需提醒导诊/收费协同处理。</p>
            </el-card>
            <el-card shadow="never" class="fee-board-card warning">
              <strong>待同步</strong>
              <span>2条</span>
              <p>HIS/收费接口待回写，保留重试和人工处理入口。</p>
            </el-card>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog v-model="inoutDialogVisible" title="出入库登记" width="640px">
      <el-form label-width="110px">
        <el-form-item label="项目">
          <el-input :model-value="`${selectedLot.name} / ${selectedLot.lotNo}`" />
        </el-form-item>
        <el-form-item label="流水类型">
          <el-radio-group model-value="in">
            <el-radio-button label="in">入库</el-radio-button>
            <el-radio-button label="out">出库</el-radio-button>
            <el-radio-button label="transfer">调拨</el-radio-button>
            <el-radio-button label="adjust">盘点调整</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="数量">
          <el-input placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="来源/去向">
          <el-input placeholder="供应商、中心库、二级库或治疗记录" />
        </el-form-item>
        <el-form-item label="说明">
          <el-input type="textarea" :rows="3" placeholder="记录验收、调拨、盘点或异常原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="inoutDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveInout">保存流水</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="consumeDialogVisible" title="治疗消耗确认" width="660px">
      <el-alert type="warning" show-icon :closable="false" title="自动消耗确认后会扣减库存并生成费用；批号不完整时必须先复核。" />
      <el-form class="dialog-form" label-width="110px">
        <el-form-item label="治疗记录">
          <el-input placeholder="患者 / 治疗日期 / 机位" />
        </el-form-item>
        <el-form-item label="消耗项目">
          <el-input :model-value="selectedLot.name" />
        </el-form-item>
        <el-form-item label="批号">
          <el-input :model-value="selectedLot.lotNo" />
        </el-form-item>
        <el-form-item label="数量">
          <el-input placeholder="本次消耗数量" />
        </el-form-item>
        <el-form-item label="计费">
          <el-switch active-text="生成费用" inactive-text="仅记录消耗" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="consumeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveConsume">确认消耗</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="warningDialogVisible" title="库存与效期预警处理" width="620px">
      <el-form label-width="110px">
        <el-form-item label="预警项目">
          <el-input :model-value="`${selectedLot.name} / ${selectedLot.warning}`" />
        </el-form-item>
        <el-form-item label="处理方式">
          <el-select model-value="replenish">
            <el-option label="生成补货申请" value="replenish" />
            <el-option label="优先消耗" value="first-use" />
            <el-option label="调拨二级库" value="transfer" />
            <el-option label="停用批次" value="block" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理说明">
          <el-input type="textarea" :rows="3" placeholder="记录处理原因、责任人和复核要求" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="warningDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="selectedLot.warning = '正常'; warningDialogVisible = false; submitAction('预警已处理并生成追溯记录')">确认处理</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="批号追溯链" size="560px">
      <el-timeline>
        <el-timeline-item timestamp="入库验收" type="primary">{{ selectedLot.name }} / {{ selectedLot.lotNo }} / {{ selectedLot.supplier }}</el-timeline-item>
        <el-timeline-item timestamp="库存位置" type="success">{{ selectedLot.warehouse }}，当前库存 {{ selectedLot.quantity }}{{ selectedLot.unit }}</el-timeline-item>
        <el-timeline-item timestamp="临床使用" type="warning">关联患者治疗记录、医嘱执行和消耗明细。</el-timeline-item>
        <el-timeline-item timestamp="费用与审计">生成费用明细，可回溯到患者、治疗、批号、UDI 和操作者。</el-timeline-item>
      </el-timeline>
    </el-drawer>

    <el-drawer v-model="feeDrawerVisible" title="患者费用明细" size="620px">
      <el-table :data="consumptions.slice(0, 8)" border stripe>
        <el-table-column prop="patient" label="患者" width="95" />
        <el-table-column prop="itemName" label="项目" min-width="160" />
        <el-table-column prop="quantity" label="数量" width="80" />
        <el-table-column prop="chargeAmount" label="金额" width="90" />
        <el-table-column prop="chargeStatus" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="tagType(row.chargeStatus)">{{ row.chargeStatus }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
  </section>
</template>
