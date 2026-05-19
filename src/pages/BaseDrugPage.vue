<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, Files, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();
type Row = {
  code: string;
  genericName: string;
  tradeName: string;
  category: string;
  spec: string;
  doseUnit: string;
  dosageForm: string;
  usageDose: string;
  insurance: string;
  selfDrug: string;
  gcpFlag: string;
  stockEnabled: string;
  feeItem: string;
  status: string;
  owner: string;
  risk: string;
  nextAction: string;
};
const selectedCode = ref('DRUG-H001');
const editDialogVisible = ref(false);
const riskDialogVisible = ref(false);
const usageDrawerVisible = ref(false);
const rows: Row[] = [
  { code: 'DRUG-H001', genericName: '低分子肝素钠', tradeName: '速碧林', category: '抗凝药', spec: '0.4ml', doseUnit: 'ml', dosageForm: '注射液', usageDose: '透析前皮下注射', insurance: '乙类', selfDrug: '否', gcpFlag: '否', stockEnabled: '是', feeItem: '抗凝药费', status: '启用', owner: '药剂科', risk: '需核对出血风险/剂量限制', nextAction: '持续维护' },
  { code: 'DRUG-EPO', genericName: '重组人促红素', tradeName: '益比奥', category: '贫血管理', spec: '4000IU', doseUnit: 'IU', dosageForm: '注射液', usageDose: '每周2次皮下注射', insurance: '乙类', selfDrug: '否', gcpFlag: '否', stockEnabled: '是', feeItem: '促红素注射', status: '启用', owner: '药剂科', risk: '需核对Hb/剂量限制', nextAction: '持续维护' },
  { code: 'DRUG-IRON', genericName: '蔗糖铁', tradeName: '维乐福', category: '贫血管理', spec: '100mg', doseUnit: 'mg', dosageForm: '注射液', usageDose: '静滴', insurance: '乙类', selfDrug: '否', gcpFlag: '否', stockEnabled: '是', feeItem: '铁剂注射', status: '启用', owner: '药剂科', risk: '过敏史核对/配伍禁忌', nextAction: '持续维护' },
  { code: 'DRUG-SEV', genericName: '司维拉姆', tradeName: '诺维乐', category: '降磷药', spec: '800mg', doseUnit: 'mg', dosageForm: '片剂', usageDose: '餐时口服', insurance: '自费', selfDrug: '可', gcpFlag: '否', stockEnabled: '否', feeItem: '口服药费', status: '启用', owner: '药剂科', risk: '餐时用药/医保限制', nextAction: '持续维护' },
  { code: 'DRUG-CAL', genericName: '骨化三醇', tradeName: '罗盖全', category: '骨病管理', spec: '0.25ug', doseUnit: 'ug', dosageForm: '胶丸', usageDose: '口服', insurance: '乙类', selfDrug: '可', gcpFlag: '否', stockEnabled: '否', feeItem: '口服药费', status: '启用', owner: '药剂科', risk: '钙磷联动/禁忌症', nextAction: '持续维护' },
  { code: 'DRUG-MIDO', genericName: '米多君', tradeName: '管通', category: '透中低血压', spec: '2.5mg', doseUnit: 'mg', dosageForm: '片剂', usageDose: '透析前口服', insurance: '自费', selfDrug: '可', gcpFlag: '否', stockEnabled: '否', feeItem: '口服药费', status: '启用', owner: '药剂科', risk: '血压核对/禁忌症', nextAction: '持续维护' },
  { code: 'DRUG-ALB', genericName: '人血白蛋白', tradeName: '白蛋白', category: '急救药', spec: '10g', doseUnit: 'g', dosageForm: '注射液', usageDose: '静滴', insurance: '限制医保', selfDrug: '否', gcpFlag: '否', stockEnabled: '是', feeItem: '急救药费', status: '待复核', owner: '药剂科', risk: '适应症复核/使用限制', nextAction: '复核发布' },
  { code: 'DRUG-NS', genericName: '氯化钠注射液', tradeName: '0.9%氯化钠', category: '冲管补液', spec: '500ml', doseUnit: 'ml', dosageForm: '注射液', usageDose: '冲管补液', insurance: '甲类', selfDrug: '否', gcpFlag: '否', stockEnabled: '是', feeItem: '补液费', status: '启用', owner: '药剂科', risk: '容量核对', nextAction: '持续维护' },
  { code: 'DRUG-GCP01', genericName: '研究药物A', tradeName: '方案盲态药', category: 'GCP药物', spec: '方案剂量', doseUnit: '片', dosageForm: '片剂', usageDose: '按SoA访视', insurance: '不计费', selfDrug: '否', gcpFlag: '是', stockEnabled: '是', feeItem: '不计费', status: '受控', owner: 'GCP药师', risk: '需受试者编号/超温限制', nextAction: '研究授权' },
  { code: 'DRUG-HEP-OLD', genericName: '普通肝素', tradeName: '旧规格肝素', category: '抗凝药', spec: '12500IU', doseUnit: 'IU', dosageForm: '注射液', usageDose: '历史用法', insurance: '乙类', selfDrug: '否', gcpFlag: '否', stockEnabled: '否', feeItem: '抗凝药费', status: '停用', owner: '药剂科', risk: '历史引用', nextAction: '引用清理' },
];
const currentRow = computed(() => rows.find((item) => item.code === selectedCode.value) ?? rows[0]);
const activeTables = ['base_drug', 'base_fee_item', 'stock_lot', 'drug_risk_rule'];
const metrics = computed(() => [
  { label: '药品项', value: rows.length, tone: 'blue' },
  { label: '启用', value: rows.filter((item) => item.status === '启用').length, tone: 'green' },
  { label: '受控/待复核', value: rows.filter((item) => item.status === '受控' || item.status === '待复核').length, tone: 'orange' },
  { label: '停用', value: rows.filter((item) => item.status === '停用').length, tone: 'purple' },
]);
function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' { if (['启用', '持续维护'].includes(value)) return 'success'; if (value === '停用') return 'info'; if (value.includes('待') || value.includes('受控') || value.includes('核对') || value.includes('复核') || value.includes('授权')) return 'warning'; return 'info'; }
function selectRow(row: Row): void { selectedCode.value = row.code; }
function submitAction(message: string): void { ElMessage.success(message); }
</script>

<template>
  <section class="base-data-page">
    <el-card class="base-work-card" shadow="never">
      <template #header><div class="base-work-header"><div><h2>{{ props.context.menuTitle }}</h2><p>维护药品通用名、商品名、规格、剂型、用法用量、医保、自备药、GCP、库存启用和用药限制，供医嘱、药房、库存和费用统一引用。</p></div><div class="base-actions"><el-button type="primary" :icon="Files" @click="editDialogVisible = true">新增药品</el-button><el-button :icon="Warning" @click="riskDialogVisible = true">风险规则</el-button><el-button :icon="CircleCheck" @click="usageDrawerVisible = true">引用分析</el-button></div></div></template>
      <el-form class="base-filter" inline><el-form-item label="关键字"><el-input placeholder="药品、分类、规格、风险" clearable /></el-form-item><el-form-item label="分类"><el-select placeholder="全部分类" clearable><el-option label="抗凝药" value="抗凝药" /><el-option label="贫血管理" value="贫血管理" /><el-option label="GCP药物" value="GCP药物" /></el-select></el-form-item><el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="启用" value="启用" /><el-option label="待复核" value="待复核" /><el-option label="受控" value="受控" /><el-option label="停用" value="停用" /></el-select></el-form-item><el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item></el-form>
      <div class="base-stat-grid"><el-card v-for="item in metrics" :key="item.label" :class="['base-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>
      <el-table :data="rows" border stripe highlight-current-row row-key="code" @row-click="selectRow"><el-table-column prop="code" label="编码" width="130" fixed="left" /><el-table-column prop="genericName" label="通用名" min-width="130" /><el-table-column prop="tradeName" label="商品名" width="105" /><el-table-column prop="category" label="分类" width="100" /><el-table-column prop="spec" label="规格" width="90" /><el-table-column prop="doseUnit" label="单位" width="75" /><el-table-column prop="dosageForm" label="剂型" width="90" /><el-table-column prop="usageDose" label="用法用量" min-width="130" /><el-table-column prop="insurance" label="医保属性" width="95" /><el-table-column prop="selfDrug" label="自备药" width="80" /><el-table-column prop="gcpFlag" label="GCP" width="70" /><el-table-column prop="stockEnabled" label="库存" width="70" /><el-table-column prop="feeItem" label="费用项目" width="110" /><el-table-column prop="status" label="状态" width="90"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column><el-table-column prop="risk" label="使用限制/禁忌" min-width="155"><template #default="{ row }"><el-tag :type="tagType(row.risk)" effect="plain">{{ row.risk }}</el-tag></template></el-table-column><el-table-column prop="nextAction" label="下一步" min-width="105" /><el-table-column label="操作" width="220" fixed="right"><template #default="{ row }"><el-button link type="primary" @click.stop="selectRow(row); editDialogVisible = true">维护</el-button><el-button link @click.stop="selectRow(row); riskDialogVisible = true">风险</el-button><el-button link @click.stop="selectRow(row); usageDrawerVisible = true">引用</el-button></template></el-table-column></el-table>
    </el-card>    <el-dialog v-model="editDialogVisible" title="药品基础资料维护" width="720px"><el-form label-width="120px"><el-form-item label="药品编码"><el-input :model-value="currentRow.code" /></el-form-item><el-form-item label="通用名"><el-input :model-value="currentRow.genericName" /></el-form-item><el-form-item label="商品名"><el-input :model-value="currentRow.tradeName" /></el-form-item><el-form-item label="规格/剂型"><el-input :model-value="`${currentRow.spec} / ${currentRow.dosageForm}`" /></el-form-item><el-form-item label="用法用量"><el-input :model-value="currentRow.usageDose" /></el-form-item><el-form-item label="医保/自备药"><el-input :model-value="`${currentRow.insurance} / 自备药:${currentRow.selfDrug}`" /></el-form-item><el-form-item label="费用项目"><el-input :model-value="currentRow.feeItem" /></el-form-item><el-form-item label="药品属性"><el-checkbox-group><el-checkbox label="医嘱可开立" /><el-checkbox label="库存扣减" /><el-checkbox label="费用同步" /><el-checkbox label="自备药可登记" /><el-checkbox label="GCP受控" /></el-checkbox-group></el-form-item><el-form-item label="变更说明"><el-input type="textarea" :rows="3" placeholder="记录药品规格、医保、自备药、库存、费用和医嘱影响" /></el-form-item></el-form><template #footer><el-button @click="editDialogVisible = false">取消</el-button><el-button type="primary" @click="editDialogVisible = false; submitAction('药品资料已保存')">保存药品</el-button></template></el-dialog>
    <el-dialog v-model="riskDialogVisible" title="药品风险规则" width="600px"><el-form label-width="110px"><el-form-item label="药品"><el-input :model-value="currentRow.genericName" disabled /></el-form-item><el-form-item label="核对项目"><el-checkbox-group><el-checkbox label="诊断" /><el-checkbox label="检验指标" /><el-checkbox label="过敏史" /><el-checkbox label="库存批号" /></el-checkbox-group></el-form-item><el-form-item label="风险说明"><el-input type="textarea" :rows="3" placeholder="记录剂量、禁忌、适应症、GCP限制和拦截规则" /></el-form-item></el-form><template #footer><el-button @click="riskDialogVisible = false">取消</el-button><el-button type="primary" @click="riskDialogVisible = false; submitAction('药品风险规则已更新')">保存规则</el-button></template></el-dialog>
    <el-drawer v-model="usageDrawerVisible" title="药品引用分析" size="520px"><el-timeline><el-timeline-item timestamp="引用位置">药品：{{ currentRow.genericName }}，费用：{{ currentRow.feeItem }}</el-timeline-item><el-timeline-item timestamp="风险校验" type="warning">医嘱开立、药师审核、库存批号、医保限制和费用同步均会引用。</el-timeline-item><el-timeline-item timestamp="闭环输出" type="success">发布后进入医生站、药房站、药耗费用和CRC站。</el-timeline-item></el-timeline></el-drawer>
  </section>
</template>
