<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, Operation, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();

type ExecuteRow = {
  id: string;
  patient: string;
  drug: string;
  dose: string;
  orderType: string;
  checkItems: string;
  batch: string;
  executor: string;
  status: string;
  risk: string;
  nextAction: string;
};

const selectedId = ref('PEX-001');
const checkDialogVisible = ref(false);
const executeDialogVisible = ref(false);
const exceptionDialogVisible = ref(false);
const traceDrawerVisible = ref(false);

const rows: ExecuteRow[] = [
  { id: 'PEX-001', patient: '李秀英', drug: '促红素注射液', dose: '4000IU', orderType: '长期医嘱', checkItems: '四查十对', batch: 'EPO260401', executor: '周药师', status: '待核对', risk: '低', nextAction: '调配核对' },
  { id: 'PEX-002', patient: '赵明', drug: '聚苯乙烯磺酸钙散', dose: '5g', orderType: '临时医嘱', checkItems: '剂量核对', batch: 'CAL260221', executor: '陈药师', status: '待执行', risk: '高', nextAction: '发药交待' },
  { id: 'PEX-003', patient: '孙海', drug: '蔗糖铁注射液', dose: '100mg', orderType: '皮试医嘱', checkItems: '皮试结果', batch: 'IRON260211', executor: '王药师', status: '暂停', risk: '高', nextAction: '补过敏史' },
  { id: 'PEX-004', patient: '何雪', drug: '司维拉姆片', dose: '800mg', orderType: '门诊处方', checkItems: '用法核对', batch: 'SEV260106', executor: '陈药师', status: '已执行', risk: '低', nextAction: '患者交待' },
  { id: 'PEX-005', patient: '陈敏', drug: '低分子肝素钙', dose: '4100IU', orderType: '长期医嘱', checkItems: '批号核对', batch: 'LMWH260309', executor: '周药师', status: '待核对', risk: '中', nextAction: '护士签收' },
  { id: 'PEX-006', patient: '马丽', drug: '恩替卡韦片', dose: '0.5mg', orderType: '出院带药', checkItems: '身份与数量', batch: 'ETV260118', executor: '王药师', status: '待执行', risk: '中', nextAction: '出院领药' },
  { id: 'PEX-007', patient: '潘德胜', drug: '研究药物A', dose: '方案剂量', orderType: 'GCP医嘱', checkItems: '随机号核对', batch: 'GCP-A260501', executor: 'GCP药师', status: '待核对', risk: '高', nextAction: 'CRC签收' },
  { id: 'PEX-008', patient: '周庆', drug: '呋塞米片', dose: '20mg', orderType: '停止医嘱', checkItems: '停药余额', batch: 'FUR260118', executor: '周药师', status: '待执行', risk: '中', nextAction: '退药退费' },
  { id: 'PEX-009', patient: '郭强', drug: '碳酸镧咀嚼片', dose: '500mg', orderType: '长期医嘱', checkItems: '重复用药复核', batch: 'LAN260105', executor: '陈药师', status: '已执行', risk: '低', nextAction: '发药记录' },
  { id: 'PEX-010', patient: '陈志强', drug: '米多君片', dose: '2.5mg', orderType: '临时医嘱', checkItems: '血压核对', batch: 'MID260030', executor: '王药师', status: '暂停', risk: '高', nextAction: '库存补货' },
];

const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['pharmacy_check_record', 'pharmacy_execute_record', 'drug_batch_trace'];

const metrics = computed(() => [
  { label: '待核对', value: rows.filter((item) => item.status === '待核对').length, tone: 'orange' },
  { label: '待执行', value: rows.filter((item) => item.status === '待执行').length, tone: 'orange' },
  { label: '暂停', value: rows.filter((item) => item.status === '暂停').length, tone: 'red' },
  { label: '已执行', value: rows.filter((item) => item.status === '已执行').length, tone: 'green' },
  { label: '特殊医嘱', value: rows.filter((item) => ['出院带药', '皮试医嘱', '门诊处方', 'GCP医嘱', '停止医嘱'].includes(item.orderType)).length, tone: 'blue' },
]);

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value === '已执行' || value === '低') return 'success';
  if (value === '暂停' || value === '高') return 'danger';
  if (value === '待核对' || value === '待执行' || value === '中') return 'warning';
  return 'info';
}

function selectRow(row: ExecuteRow): void { selectedId.value = row.id; }
function submitAction(message: string): void { ElMessage.success(message); }
</script>

<template>
  <section class="pharmacy-page">
    <el-card class="pharmacy-work-card" shadow="never">
      <template #header>
        <div class="pharmacy-header">
          <div>
            <h2>{{ context.menuTitle }}</h2>
            <p>按四查十对完成药师核对、调配执行、批号记录和异常暂停。</p>
          </div>
          <div class="pharmacy-actions">
            <el-button type="primary" :icon="Operation" @click="checkDialogVisible = true">四查十对</el-button>
            <el-button :icon="CircleCheck" @click="executeDialogVisible = true">提交执行</el-button>
            <el-button :icon="Warning" @click="exceptionDialogVisible = true">异常暂停</el-button>
            <el-button @click="traceDrawerVisible = true">执行追溯</el-button>
          </div>
        </div>
      </template>
      <el-form class="pharmacy-filter" inline>
        <el-form-item label="关键字"><el-input placeholder="患者、药品、批号、药师" clearable /></el-form-item>
        <el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="待核对" value="待核对" /><el-option label="待执行" value="待执行" /><el-option label="暂停" value="暂停" /><el-option label="已执行" value="已执行" /></el-select></el-form-item>
        <el-form-item label="医嘱类型"><el-select placeholder="全部类型" clearable><el-option label="长期医嘱" value="长期医嘱" /><el-option label="临时医嘱" value="临时医嘱" /><el-option label="出院带药" value="出院带药" /><el-option label="皮试医嘱" value="皮试医嘱" /><el-option label="门诊处方" value="门诊处方" /><el-option label="GCP医嘱" value="GCP医嘱" /><el-option label="停止医嘱" value="停止医嘱" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>
      <div class="pharmacy-stat-grid"><el-card v-for="item in metrics" :key="item.label" :class="['pharmacy-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>
      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow">
        <el-table-column prop="patient" label="患者" width="95" fixed="left" />
        <el-table-column prop="drug" label="药品" min-width="160" />
        <el-table-column prop="dose" label="剂量" width="90" />
        <el-table-column prop="orderType" label="医嘱类型" width="100" />
        <el-table-column prop="checkItems" label="核对项" width="120" />
        <el-table-column prop="batch" label="批号" width="120" />
        <el-table-column prop="executor" label="药师" width="100" />
        <el-table-column prop="status" label="状态" width="90"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="risk" label="风险" width="80"><template #default="{ row }"><el-tag :type="tagType(row.risk)" effect="plain">{{ row.risk }}</el-tag></template></el-table-column>
        <el-table-column prop="nextAction" label="下一步" min-width="120" />
        <el-table-column label="操作" width="120" fixed="right"><template #default="{ row }"><el-button link type="primary" @click.stop="selectRow(row); traceDrawerVisible = true">追溯</el-button></template></el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="checkDialogVisible" title="四查十对" width="620px">
      <el-form label-width="100px">
        <el-form-item label="药品"><el-input :model-value="currentRow.drug" disabled /></el-form-item>
        <el-form-item label="医嘱类型"><el-input :model-value="currentRow.orderType" disabled /></el-form-item>
        <el-form-item label="核对项"><el-checkbox-group model-value="patient"><el-checkbox-button label="patient">患者</el-checkbox-button><el-checkbox-button label="drug">药品</el-checkbox-button><el-checkbox-button label="dose">剂量</el-checkbox-button><el-checkbox-button label="batch">批号</el-checkbox-button><el-checkbox-button label="special">特殊类型</el-checkbox-button></el-checkbox-group></el-form-item>
        <el-form-item label="第二核对人"><el-input placeholder="请输入第二核对药师" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="checkDialogVisible = false">取消</el-button><el-button type="primary" @click="checkDialogVisible = false; submitAction('四查十对已完成')">完成核对</el-button></template>
    </el-dialog>

    <el-dialog v-model="executeDialogVisible" title="调配执行" width="620px">
      <el-form label-width="100px">
        <el-form-item label="批号"><el-input :model-value="currentRow.batch" /></el-form-item>
        <el-form-item label="执行结果"><el-radio-group model-value="done"><el-radio-button label="done">已执行</el-radio-button><el-radio-button label="hold">暂停</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="执行说明"><el-input type="textarea" :rows="3" placeholder="记录调配数量、批号、签收人和注意事项" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="executeDialogVisible = false">取消</el-button><el-button type="primary" @click="executeDialogVisible = false; submitAction('药师执行已提交')">提交执行</el-button></template>
    </el-dialog>

    <el-dialog v-model="exceptionDialogVisible" title="异常暂停" width="580px">
      <el-form label-width="100px">
        <el-form-item label="医嘱"><el-input :model-value="`${currentRow.patient} / ${currentRow.drug}`" disabled /></el-form-item>
        <el-form-item label="异常原因"><el-input type="textarea" :rows="3" placeholder="记录库存、批号、过敏史或剂量异常" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="exceptionDialogVisible = false">取消</el-button><el-button type="danger" @click="exceptionDialogVisible = false; submitAction('异常暂停已提交')">提交暂停</el-button></template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="药师核对执行追溯" size="520px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-10 08:20" type="primary">接收已审核医嘱：{{ currentRow.orderType }} / {{ currentRow.drug }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 08:28">完成核对项：{{ currentRow.checkItems }}，批号 {{ currentRow.batch }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 08:35" type="success">执行结果回写发药队列、库存批号和审计签名</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
