<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, DocumentChecked, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();

type AuditRow = {
  id: string;
  patient: string;
  diagnosis: string;
  drug: string;
  dose: string;
  orderType: string;
  sourceDept: string;
  risk: string;
  stock: string;
  status: string;
  pharmacist: string;
  nextAction: string;
};

const selectedId = ref('PAUD-001');
const auditDialogVisible = ref(false);
const returnDialogVisible = ref(false);
const traceDrawerVisible = ref(false);

const rows: AuditRow[] = [
  { id: 'PAUD-001', patient: '赵明', diagnosis: '高钾血症', drug: '聚苯乙烯磺酸钙散', dose: '5g tid', orderType: '临时医嘱', sourceDept: '医生站', risk: '剂量适宜', stock: '充足', status: '待审核', pharmacist: '周药师', nextAction: '药师审核' },
  { id: 'PAUD-002', patient: '李秀英', diagnosis: '肾性贫血', drug: '促红素注射液', dose: '4000IU biw', orderType: '长期医嘱', sourceDept: '医生站', risk: 'Hb偏低', stock: '充足', status: '已通过', pharmacist: '周药师', nextAction: '调配核对' },
  { id: 'PAUD-003', patient: '郭强', diagnosis: '钙磷异常', drug: '碳酸镧咀嚼片', dose: '500mg tid', orderType: '长期医嘱', sourceDept: '医生站', risk: '重复用药风险', stock: '充足', status: '待确认', pharmacist: '陈药师', nextAction: '退回医生确认' },
  { id: 'PAUD-004', patient: '何雪', diagnosis: '高磷血症', drug: '司维拉姆片', dose: '800mg tid', orderType: '长期医嘱', sourceDept: '医生站', risk: '适应症相符', stock: '充足', status: '已通过', pharmacist: '陈药师', nextAction: '发药' },
  { id: 'PAUD-005', patient: '陈志强', diagnosis: '透中低血压', drug: '米多君片', dose: '2.5mg 透前', orderType: '临时医嘱', sourceDept: '护士站', risk: '需核对血压', stock: '低库存', status: '待审核', pharmacist: '周药师', nextAction: '锁库存' },
  { id: 'PAUD-006', patient: '马丽', diagnosis: '乙肝隔离透析', drug: '恩替卡韦片', dose: '0.5mg qd', orderType: '门诊处方', sourceDept: '门诊医生站', risk: '肾功能剂量调整', stock: '充足', status: '待确认', pharmacist: '王药师', nextAction: '确认剂量' },
  { id: 'PAUD-007', patient: '孙海', diagnosis: '肾性贫血', drug: '蔗糖铁注射液', dose: '100mg qw', orderType: '皮试医嘱', sourceDept: '护士站', risk: '过敏史核对', stock: '充足', status: '待审核', pharmacist: '王药师', nextAction: '皮试结果复核' },
  { id: 'PAUD-008', patient: '陈敏', diagnosis: '骨矿异常', drug: '骨化三醇胶丸', dose: '0.25ug qod', orderType: '长期医嘱', sourceDept: '医生站', risk: '钙磷联动监测', stock: '近效期', status: '已通过', pharmacist: '陈药师', nextAction: '提醒复查' },
  { id: 'PAUD-009', patient: '潘德胜', diagnosis: 'GCP入组', drug: '研究药物HD-CKD-01', dose: '方案剂量', orderType: 'GCP医嘱', sourceDept: 'CRC站', risk: '需受试者编号', stock: '专柜锁定', status: '待审核', pharmacist: 'GCP药师', nextAction: '核对随机号' },
  { id: 'PAUD-010', patient: '周庆', diagnosis: '容量负荷过高', drug: '呋塞米片', dose: '20mg bid', orderType: '停止医嘱', sourceDept: '医生站', risk: '停药后余额退费', stock: '充足', status: '待审核', pharmacist: '周药师', nextAction: '停止审核' },
];

const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['pharmacy_order_audit', 'drug_interaction_check', 'drug_inventory', 'audit_signature'];

const metrics = computed(() => [
  { label: '待审核', value: rows.filter((item) => item.status === '待审核').length, tone: 'orange' },
  { label: '已通过', value: rows.filter((item) => item.status === '已通过').length, tone: 'green' },
  { label: '待确认', value: rows.filter((item) => item.status === '待确认').length, tone: 'red' },
  { label: '库存风险', value: rows.filter((item) => item.stock !== '充足').length, tone: 'orange' },
  { label: '特殊类型', value: rows.filter((item) => ['皮试医嘱', '门诊处方', '停止医嘱', 'GCP医嘱'].includes(item.orderType)).length, tone: 'blue' },
]);

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value === '已通过' || value === '充足' || value === '适应症相符') return 'success';
  if (value === '待审核' || value === '近效期' || value.includes('需')) return 'warning';
  if (value === '待确认' || value === '低库存' || value.includes('重复')) return 'danger';
  return 'info';
}

function selectRow(row: AuditRow): void { selectedId.value = row.id; }
function submitAction(message: string): void { ElMessage.success(message); }
function openAudit(row?: AuditRow): void { selectedId.value = row?.id ?? rows[0].id; auditDialogVisible.value = true; }
function openReturn(row: AuditRow): void { selectedId.value = row.id; returnDialogVisible.value = true; }
</script>

<template>
  <section class="pharmacy-page">
    <el-card class="pharmacy-work-card" shadow="never">
      <template #header>
        <div class="pharmacy-header">
          <div>
            <h2>{{ context.menuTitle }}</h2>
            <p>核对诊断、剂量、用法、禁忌、库存和 GCP 限制，审核结果回写医生医嘱与发药队列。</p>
          </div>
          <div class="pharmacy-actions">
            <el-button type="primary" :icon="DocumentChecked" @click="openAudit()">药师审核</el-button>
            <el-button :icon="Warning" @click="openReturn(rows[2])">退回医生</el-button>
            <el-button :icon="CircleCheck" @click="traceDrawerVisible = true">审计追溯</el-button>
          </div>
        </div>
      </template>
      <el-form class="pharmacy-filter" inline>
        <el-form-item label="关键字"><el-input placeholder="患者、药品、诊断、风险" clearable /></el-form-item>
        <el-form-item label="审核状态"><el-select placeholder="全部状态" clearable><el-option label="待审核" value="待审核" /><el-option label="已通过" value="已通过" /><el-option label="待确认" value="待确认" /></el-select></el-form-item>
        <el-form-item label="医嘱类型"><el-select placeholder="全部类型" clearable><el-option label="长期医嘱" value="长期医嘱" /><el-option label="临时医嘱" value="临时医嘱" /><el-option label="皮试医嘱" value="皮试医嘱" /><el-option label="门诊处方" value="门诊处方" /><el-option label="停止医嘱" value="停止医嘱" /><el-option label="GCP医嘱" value="GCP医嘱" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>
      <div class="pharmacy-stat-grid"><el-card v-for="item in metrics" :key="item.label" :class="['pharmacy-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>
      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow">
        <el-table-column prop="patient" label="患者" width="95" fixed="left" />
        <el-table-column prop="diagnosis" label="诊断" min-width="130" />
        <el-table-column prop="drug" label="药品" min-width="160" />
        <el-table-column prop="dose" label="剂量用法" width="120" />
        <el-table-column prop="orderType" label="医嘱类型" width="100" />
        <el-table-column prop="sourceDept" label="来源" width="105" />
        <el-table-column prop="risk" label="审核提示" min-width="140"><template #default="{ row }"><el-tag :type="tagType(row.risk)" effect="plain">{{ row.risk }}</el-tag></template></el-table-column>
        <el-table-column prop="stock" label="库存" width="90"><template #default="{ row }"><el-tag :type="tagType(row.stock)" effect="plain">{{ row.stock }}</el-tag></template></el-table-column>
        <el-table-column prop="status" label="审核" width="90"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="pharmacist" label="药师" width="100" />
        <el-table-column prop="nextAction" label="下一步" min-width="120" />
        <el-table-column label="操作" width="220" fixed="right"><template #default="{ row }"><el-button link type="primary" @click.stop="openAudit(row)">审核</el-button><el-button link type="danger" @click.stop="openReturn(row)">退回</el-button><el-button link @click.stop="traceDrawerVisible = true">追溯</el-button></template></el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="auditDialogVisible" title="药师审核" width="640px">
      <el-alert type="warning" show-icon :closable="false" title="审核通过后进入调配发药；有禁忌、库存或 GCP 限制时需退回医生确认。" />
      <el-form class="dialog-form" label-width="100px">
        <el-form-item label="药品"><el-input :model-value="currentRow.drug" disabled /></el-form-item>
        <el-form-item label="审核结果"><el-radio-group model-value="pass"><el-radio-button label="pass">通过</el-radio-button><el-radio-button label="return">退回</el-radio-button><el-radio-button label="hold">暂停</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="审核意见"><el-input type="textarea" :rows="3" placeholder="记录诊断相符、剂量、皮试/门诊/停止医嘱要点、禁忌和库存核对意见" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="auditDialogVisible = false">取消</el-button><el-button type="primary" @click="auditDialogVisible = false; submitAction('药师审核已提交')">提交审核</el-button></template>
    </el-dialog>

    <el-dialog v-model="returnDialogVisible" title="退回医生确认" width="620px">
      <el-form label-width="100px">
        <el-form-item label="医嘱"><el-input :model-value="`${currentRow.patient} / ${currentRow.drug}`" disabled /></el-form-item>
        <el-form-item label="退回原因"><el-input type="textarea" :rows="3" placeholder="说明剂量、禁忌、重复用药、库存或方案不符原因" /></el-form-item>
        <el-form-item label="建议处理"><el-input placeholder="建议医生调整剂量、补充诊断或停用医嘱" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="returnDialogVisible = false">取消</el-button><el-button type="danger" @click="returnDialogVisible = false; submitAction('医嘱已退回医生确认')">确认退回</el-button></template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="审核追溯" size="520px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-10 08:10" type="primary">接收医嘱：{{ currentRow.drug }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 08:20">完成适宜性和库存检查</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 08:30" type="success">审核结果回写医生站和药房队列</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
