<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, Goods, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();

type DrugRow = {
  id: string;
  name: string;
  spec: string;
  category: string;
  stock: string;
  batch: string;
  expiry: string;
  usageLimit: string;
  insurance: string;
  contraindication: string;
  status: string;
  nextAction: string;
};

const selectedId = ref('PDRUG-001');
const detailDialogVisible = ref(false);
const warningDialogVisible = ref(false);
const traceDrawerVisible = ref(false);

const rows: DrugRow[] = [
  { id: 'PDRUG-001', name: '促红素注射液', spec: '4000IU/支', category: '贫血治疗', stock: '268支', batch: 'EPO260401', expiry: '2027-04', usageLimit: 'Hb>120慎开', insurance: '医保甲类', contraindication: 'Hb过高慎用', status: '正常', nextAction: '可发药' },
  { id: 'PDRUG-002', name: '蔗糖铁注射液', spec: '100mg/支', category: '贫血治疗', stock: '86支', batch: 'IRON260211', expiry: '2026-11', usageLimit: '需皮试/过敏史', insurance: '医保乙类', contraindication: '过敏禁用', status: '正常', nextAction: '过敏史核对' },
  { id: 'PDRUG-003', name: '司维拉姆片', spec: '800mg*30片', category: '降磷', stock: '42盒', batch: 'SEV260106', expiry: '2027-01', usageLimit: '随餐服用', insurance: '自费/特批', contraindication: '肠梗阻禁用', status: '正常', nextAction: '随餐交待' },
  { id: 'PDRUG-004', name: '骨化三醇胶丸', spec: '0.25ug*10粒', category: '钙磷代谢', stock: '18盒', batch: 'CAL260012', expiry: '2026-07', usageLimit: '监测钙磷PTH', insurance: '医保乙类', contraindication: '高钙血症慎用', status: '近效期', nextAction: '优先使用' },
  { id: 'PDRUG-005', name: '米多君片', spec: '2.5mg*20片', category: '低血压', stock: '7盒', batch: 'MID260030', expiry: '2027-02', usageLimit: '透前血压复核', insurance: '自费', contraindication: '高血压禁用', status: '低库存', nextAction: '补货申请' },
  { id: 'PDRUG-006', name: '低分子肝素钙', spec: '4100IU/支', category: '抗凝', stock: '126支', batch: 'LMWH260309', expiry: '2027-03', usageLimit: '出血评分>3阻断', insurance: '医保甲类', contraindication: '出血风险慎用', status: '正常', nextAction: '批号追溯' },
  { id: 'PDRUG-007', name: '恩替卡韦片', spec: '0.5mg*7片', category: '抗病毒', stock: '64盒', batch: 'ETV260118', expiry: '2027-06', usageLimit: '按eGFR调剂量', insurance: '医保乙类', contraindication: '乳酸酸中毒风险', status: '正常', nextAction: '肾功能复核' },
  { id: 'PDRUG-008', name: '聚苯乙烯磺酸钙散', spec: '5g*10袋', category: '降钾', stock: '32盒', batch: 'CAL260221', expiry: '2026-12', usageLimit: '便秘/肠梗阻慎用', insurance: '医保甲类', contraindication: '肠梗阻禁用', status: '正常', nextAction: '血钾复核' },
  { id: 'PDRUG-009', name: '呋塞米片', spec: '20mg*100片', category: '利尿', stock: '21瓶', batch: 'FUR260118', expiry: '2027-01', usageLimit: '残肾功能评估', insurance: '医保甲类', contraindication: '低钾慎用', status: '正常', nextAction: '停止医嘱核对' },
  { id: 'PDRUG-010', name: '研究药物A', spec: '方案定义', category: 'GCP药物', stock: '专柜12盒', batch: 'GCP-A260501', expiry: '2026-09', usageLimit: '仅授权受试者', insurance: '不计费', contraindication: '方案入排标准', status: '受控', nextAction: 'CRC授权' },
];

const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['drug_master', 'drug_inventory', 'drug_contraindication', 'drug_batch_trace'];

const metrics = computed(() => [
  { label: '药品品规', value: rows.length, tone: 'blue' },
  { label: '正常', value: rows.filter((item) => item.status === '正常').length, tone: 'green' },
  { label: '近效期', value: rows.filter((item) => item.status === '近效期').length, tone: 'orange' },
  { label: '低库存', value: rows.filter((item) => item.status === '低库存').length, tone: 'red' },
  { label: '医保/受控', value: rows.filter((item) => item.insurance !== '自费').length, tone: 'blue' },
]);

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value === '正常') return 'success';
  if (value === '近效期') return 'warning';
  if (value === '低库存') return 'danger';
  if (value === '受控') return 'warning';
  return 'info';
}

function selectRow(row: DrugRow): void { selectedId.value = row.id; }
function submitAction(message: string): void { ElMessage.success(message); }
</script>

<template>
  <section class="pharmacy-page">
    <el-card class="pharmacy-work-card" shadow="never">
      <template #header>
        <div class="pharmacy-header">
          <div>
            <h2>{{ context.menuTitle }}</h2>
            <p>查看药品基础资料、使用限制、医保信息、库存、批号、效期和禁忌提示，供审核与发药引用。</p>
          </div>
          <div class="pharmacy-actions">
            <el-button type="primary" :icon="Goods" @click="detailDialogVisible = true">药品详情</el-button>
            <el-button :icon="Warning" @click="warningDialogVisible = true">预警处理</el-button>
            <el-button :icon="CircleCheck" @click="traceDrawerVisible = true">批号追溯</el-button>
          </div>
        </div>
      </template>
      <el-form class="pharmacy-filter" inline>
        <el-form-item label="关键字"><el-input placeholder="药品、分类、批号、医保、限制、禁忌" clearable /></el-form-item>
        <el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="正常" value="正常" /><el-option label="近效期" value="近效期" /><el-option label="低库存" value="低库存" /></el-select></el-form-item>
        <el-form-item label="医保"><el-select placeholder="全部医保" clearable><el-option label="医保甲类" value="医保甲类" /><el-option label="医保乙类" value="医保乙类" /><el-option label="自费/特批" value="自费/特批" /><el-option label="不计费" value="不计费" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>
      <div class="pharmacy-stat-grid"><el-card v-for="item in metrics" :key="item.label" :class="['pharmacy-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>
      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow">
        <el-table-column prop="name" label="药品" min-width="160" fixed="left" />
        <el-table-column prop="spec" label="规格" width="120" />
        <el-table-column prop="category" label="分类" width="110" />
        <el-table-column prop="stock" label="库存" width="90" />
        <el-table-column prop="batch" label="批号" width="120" />
        <el-table-column prop="expiry" label="效期" width="100" />
        <el-table-column prop="usageLimit" label="使用限制" min-width="140" />
        <el-table-column prop="insurance" label="医保信息" width="110" />
        <el-table-column prop="contraindication" label="禁忌提示" min-width="150" />
        <el-table-column prop="status" label="状态" width="90"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="nextAction" label="下一步" min-width="120" />
      </el-table>
    </el-card>

    <el-dialog v-model="detailDialogVisible" title="药品详情" width="620px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="药品">{{ currentRow.name }}</el-descriptions-item>
        <el-descriptions-item label="规格">{{ currentRow.spec }}</el-descriptions-item>
        <el-descriptions-item label="库存批号">{{ currentRow.stock }} / {{ currentRow.batch }}</el-descriptions-item>
        <el-descriptions-item label="使用限制">{{ currentRow.usageLimit }}</el-descriptions-item>
        <el-descriptions-item label="医保信息">{{ currentRow.insurance }}</el-descriptions-item>
        <el-descriptions-item label="禁忌提示">{{ currentRow.contraindication }}</el-descriptions-item>
      </el-descriptions>
      <template #footer><el-button @click="detailDialogVisible = false">关闭</el-button></template>
    </el-dialog>

    <el-dialog v-model="warningDialogVisible" title="库存效期预警处理" width="600px">
      <el-form label-width="100px">
        <el-form-item label="药品"><el-input :model-value="currentRow.name" disabled /></el-form-item>
        <el-form-item label="处理方式"><el-select placeholder="请选择"><el-option label="补货申请" value="stock" /><el-option label="优先使用" value="expiry" /><el-option label="停用批号" value="hold" /></el-select></el-form-item>
        <el-form-item label="处理说明"><el-input type="textarea" :rows="3" placeholder="记录库存、效期和责任人说明" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="warningDialogVisible = false">取消</el-button><el-button type="primary" @click="warningDialogVisible = false; submitAction('药品预警已处理')">提交处理</el-button></template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="批号追溯" size="520px">
      <el-timeline>
        <el-timeline-item timestamp="2026-04-01" type="primary">批号入库：{{ currentRow.batch }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10">药师审核和发药引用该批号</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10" type="success">回写库存流水和患者费用</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
