<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, Goods, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();

type DispenseRow = {
  id: string;
  patient: string;
  drug: string;
  dose: string;
  batch: string;
  dispenseQuantity: string;
  returnQuantity: string;
  returnReason: string;
  stock: string;
  dispenseStatus: string;
  receiver: string;
  nextAction: string;
};

const selectedId = ref('PDIS-001');
const dispenseDialogVisible = ref(false);
const returnDialogVisible = ref(false);
const traceDrawerVisible = ref(false);

const rows: DispenseRow[] = [
  { id: 'PDIS-001', patient: '李秀英', drug: '促红素注射液', dose: '4000IU', batch: 'EPO260401', dispenseQuantity: '1支', returnQuantity: '-', returnReason: '-', stock: '充足', dispenseStatus: '待发药', receiver: '张护士', nextAction: '护士签收' },
  { id: 'PDIS-002', patient: '何雪', drug: '司维拉姆片', dose: '800mg', batch: 'SEV260106', dispenseQuantity: '1盒', returnQuantity: '-', returnReason: '-', stock: '充足', dispenseStatus: '已发药', receiver: '钱护士', nextAction: '用药交待' },
  { id: 'PDIS-003', patient: '陈志强', drug: '米多君片', dose: '2.5mg', batch: 'MID260030', dispenseQuantity: '1盒', returnQuantity: '-', returnReason: '-', stock: '低库存', dispenseStatus: '暂缓', receiver: '周护士', nextAction: '等待补货' },
  { id: 'PDIS-004', patient: '孙海', drug: '蔗糖铁注射液', dose: '100mg', batch: 'IRON260211', dispenseQuantity: '1支', returnQuantity: '-', returnReason: '-', stock: '充足', dispenseStatus: '待签收', receiver: '刘护士', nextAction: '签收确认' },
  { id: 'PDIS-005', patient: '郭强', drug: '碳酸镧咀嚼片', dose: '500mg', batch: 'LAN260105', dispenseQuantity: '1盒', returnQuantity: '1盒', returnReason: '医生停药', stock: '充足', dispenseStatus: '退药中', receiver: '王护士', nextAction: '退药审核' },
  { id: 'PDIS-006', patient: '马丽', drug: '恩替卡韦片', dose: '0.5mg', batch: 'ETV260118', dispenseQuantity: '7片', returnQuantity: '-', returnReason: '-', stock: '充足', dispenseStatus: '待领药', receiver: '患者本人', nextAction: '领药确认' },
  { id: 'PDIS-007', patient: '潘德胜', drug: '研究药物A', dose: '方案剂量', batch: 'GCP-A260501', dispenseQuantity: '1盒', returnQuantity: '-', returnReason: '-', stock: '专柜锁定', dispenseStatus: '待发药', receiver: 'CRC林', nextAction: 'GCP签收' },
  { id: 'PDIS-008', patient: '周庆', drug: '呋塞米片', dose: '20mg', batch: 'FUR260118', dispenseQuantity: '1瓶', returnQuantity: '20片', returnReason: '停止医嘱', stock: '充足', dispenseStatus: '退药完成', receiver: '患者家属', nextAction: '退费同步' },
  { id: 'PDIS-009', patient: '赵明', drug: '聚苯乙烯磺酸钙散', dose: '5g', batch: 'CAL260221', dispenseQuantity: '3包', returnQuantity: '-', returnReason: '-', stock: '充足', dispenseStatus: '已发药', receiver: '陈护士', nextAction: '执行核对' },
  { id: 'PDIS-010', patient: '陈敏', drug: '低分子肝素钙', dose: '4100IU', batch: 'LMWH260309', dispenseQuantity: '1支', returnQuantity: '-', returnReason: '-', stock: '充足', dispenseStatus: '待签收', receiver: '李护士', nextAction: '上机前签收' },
];

const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['pharmacy_dispense_record', 'drug_return_record', 'drug_inventory_flow'];

const metrics = computed(() => [
  { label: '待发药', value: rows.filter((item) => item.dispenseStatus === '待发药').length, tone: 'orange' },
  { label: '待领/签收', value: rows.filter((item) => item.dispenseStatus === '待签收' || item.dispenseStatus === '待领药').length, tone: 'orange' },
  { label: '已发药', value: rows.filter((item) => item.dispenseStatus === '已发药').length, tone: 'green' },
  { label: '退药记录', value: rows.filter((item) => item.returnQuantity !== '-').length, tone: 'blue' },
  { label: '退药统计', value: rows.filter((item) => item.dispenseStatus.includes('退药')).length, tone: 'red' },
]);

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value === '已发药' || value === '充足') return 'success';
  if (value === '待发药' || value === '待签收' || value === '待领药' || value === '退药中' || value === '专柜锁定') return 'warning';
  if (value === '退药完成') return 'info';
  if (value === '暂缓' || value === '低库存') return 'danger';
  return 'info';
}

function selectRow(row: DispenseRow): void { selectedId.value = row.id; }
function submitAction(message: string): void { ElMessage.success(message); }
</script>

<template>
  <section class="pharmacy-page">
    <el-card class="pharmacy-work-card" shadow="never">
      <template #header>
        <div class="pharmacy-header">
          <div>
            <h2>{{ context.menuTitle }}</h2>
            <p>处理发药、签收、退药和库存回退，批号全程追溯到患者费用和执行记录。</p>
          </div>
          <div class="pharmacy-actions">
            <el-button type="primary" :icon="Goods" @click="dispenseDialogVisible = true">发药/领药</el-button>
            <el-button :icon="Warning" @click="returnDialogVisible = true">退药登记</el-button>
            <el-button :icon="CircleCheck" @click="traceDrawerVisible = true">批号追溯</el-button>
          </div>
        </div>
      </template>
      <el-form class="pharmacy-filter" inline>
        <el-form-item label="关键字"><el-input placeholder="患者、药品、批号、签收人" clearable /></el-form-item>
        <el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="待发药" value="待发药" /><el-option label="待领药" value="待领药" /><el-option label="待签收" value="待签收" /><el-option label="已发药" value="已发药" /><el-option label="退药中" value="退药中" /><el-option label="退药完成" value="退药完成" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>
      <div class="pharmacy-stat-grid"><el-card v-for="item in metrics" :key="item.label" :class="['pharmacy-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>
      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow">
        <el-table-column prop="patient" label="患者" width="95" fixed="left" />
        <el-table-column prop="drug" label="药品" min-width="160" />
        <el-table-column prop="dose" label="剂量" width="90" />
        <el-table-column prop="batch" label="批号" width="120" />
        <el-table-column prop="dispenseQuantity" label="发药数量" width="95" />
        <el-table-column prop="returnQuantity" label="退药数量" width="95" />
        <el-table-column prop="returnReason" label="退药原因" min-width="120" />
        <el-table-column prop="stock" label="库存" width="90"><template #default="{ row }"><el-tag :type="tagType(row.stock)" effect="plain">{{ row.stock }}</el-tag></template></el-table-column>
        <el-table-column prop="dispenseStatus" label="发药状态" width="100"><template #default="{ row }"><el-tag :type="tagType(row.dispenseStatus)">{{ row.dispenseStatus }}</el-tag></template></el-table-column>
        <el-table-column prop="receiver" label="签收人" width="100" />
        <el-table-column prop="nextAction" label="下一步" min-width="120" />
      </el-table>
    </el-card>

    <el-dialog v-model="dispenseDialogVisible" title="发药/领药签收" width="620px">
      <el-form label-width="100px">
        <el-form-item label="药品"><el-input :model-value="currentRow.drug" disabled /></el-form-item>
        <el-form-item label="批号"><el-input :model-value="currentRow.batch" /></el-form-item>
        <el-form-item label="发药数量"><el-input :model-value="currentRow.dispenseQuantity" /></el-form-item>
        <el-form-item label="签收人"><el-input :model-value="currentRow.receiver" /></el-form-item>
        <el-form-item label="说明"><el-input type="textarea" :rows="3" placeholder="记录发药数量、交待事项和签收确认" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dispenseDialogVisible = false">取消</el-button><el-button type="primary" @click="dispenseDialogVisible = false; submitAction('发药签收已完成')">确认发药</el-button></template>
    </el-dialog>

    <el-dialog v-model="returnDialogVisible" title="退药登记" width="600px">
      <el-form label-width="100px">
        <el-form-item label="药品"><el-input :model-value="currentRow.drug" disabled /></el-form-item>
        <el-form-item label="退药数量"><el-input :model-value="currentRow.returnQuantity === '-' ? '' : currentRow.returnQuantity" placeholder="请输入退药数量" /></el-form-item>
        <el-form-item label="退药原因"><el-input type="textarea" :rows="3" placeholder="记录退药原因、数量、库存回退和费用处理" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="returnDialogVisible = false">取消</el-button><el-button type="danger" @click="returnDialogVisible = false; submitAction('退药登记已提交')">提交退药</el-button></template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="批号追溯" size="520px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-10 08:30" type="primary">库存锁定：{{ currentRow.batch }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 08:50">药师发药并护士签收</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 09:00" type="success">写入患者费用和库存流水</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
