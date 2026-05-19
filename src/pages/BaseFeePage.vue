<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, Coin, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();

type Row = {
  code: string;
  name: string;
  category: string;
  configType: string;
  price: string;
  unit: string;
  insuranceCode: string;
  selfPay: string;
  chargeRule: string;
  status: string;
  owner: string;
  usedBy: string;
  nextAction: string;
};

const selectedCode = ref('FEE-HD');
const feeDialogVisible = ref(false);
const ruleDialogVisible = ref(false);
const usageDrawerVisible = ref(false);

const rows: Row[] = [
  { code: 'FEE-HD', name: '血液透析治疗费', category: '治疗项目', configType: '透析模式费用配置', price: '420.00', unit: '次', insuranceCode: 'HIS-HD-001', selfPay: '否', chargeRule: '按次计费', status: '启用', owner: '收费办', usedBy: '单次透析费用', nextAction: '持续维护' },
  { code: 'FEE-HDF', name: '血液透析滤过治疗费', category: '治疗项目', configType: '透析模式费用配置', price: '560.00', unit: '次', insuranceCode: 'HIS-HDF-001', selfPay: '否', chargeRule: '按次计费', status: '启用', owner: '收费办', usedBy: 'HDF处方/费用', nextAction: '持续维护' },
  { code: 'FEE-HP', name: '血液灌流治疗费', category: '治疗项目', configType: '透析模式费用配置', price: '680.00', unit: '次', insuranceCode: 'HIS-HP-001', selfPay: '部分自费', chargeRule: '特殊净化', status: '待复核', owner: '收费办', usedBy: '特殊净化申请', nextAction: '复核发布' },
  { code: 'FEE-MAT-DIALYZER', name: '透析器费用', category: '耗材项目', configType: '耗材费用配置', price: '180.00', unit: '支', insuranceCode: 'MAT-DIALYZER', selfPay: '否', chargeRule: '随耗材消耗', status: '启用', owner: '药耗组', usedBy: '治疗自动消耗', nextAction: '持续维护' },
  { code: 'FEE-MAT-LINE', name: '透析管路费用', category: '耗材项目', configType: '耗材费用配置', price: '75.00', unit: '套', insuranceCode: 'MAT-LINE', selfPay: '否', chargeRule: '随耗材消耗', status: '启用', owner: '药耗组', usedBy: '治疗自动消耗', nextAction: '持续维护' },
  { code: 'FEE-DRUG-EPO', name: '促红素注射费', category: '药品项目', configType: '药品费用配置', price: '138.00', unit: '支', insuranceCode: 'DRUG-EPO', selfPay: '否', chargeRule: '按医嘱计费', status: '启用', owner: '药剂科', usedBy: '长期医嘱/费用', nextAction: '持续维护' },
  { code: 'FEE-DRUG-HEP', name: '低分子肝素费用', category: '药品项目', configType: '药品费用配置', price: '42.00', unit: '支', insuranceCode: 'DRUG-HEP', selfPay: '否', chargeRule: '按医嘱计费', status: '启用', owner: '药剂科', usedBy: '抗凝医嘱/费用', nextAction: '持续维护' },
  { code: 'FEE-LAB-K', name: '血钾检测费', category: '检验项目', configType: '检验检查费用配置', price: '45.00', unit: '项', insuranceCode: 'LAB-K', selfPay: '否', chargeRule: '检验报告归档', status: '启用', owner: '检验科', usedBy: '检验医嘱/收费', nextAction: '持续维护' },
  { code: 'FEE-EXAM-US', name: '内瘘超声检查费', category: '检查项目', configType: '检验检查费用配置', price: '120.00', unit: '次', insuranceCode: 'EXAM-US-AVF', selfPay: '否', chargeRule: '检查报告归档', status: '启用', owner: '医技科', usedBy: '检查申请/收费', nextAction: '持续维护' },
  { code: 'FEE-ISO-KIT', name: '隔离治疗包费用', category: '耗材项目', configType: '耗材费用配置', price: '120.00', unit: '包', insuranceCode: 'MAT-ISO-KIT', selfPay: '部分自费', chargeRule: '隔离治疗附加', status: '待复核', owner: '感控管理', usedBy: '隔离排班/费用', nextAction: '复核发布' },
  { code: 'FEE-GCP-DRUG', name: '研究药物费用', category: 'GCP项目', configType: '药品费用配置', price: '0.00', unit: '访视', insuranceCode: 'GCP-FREE', selfPay: '不计费', chargeRule: '不计费', status: '受控', owner: 'GCP中心', usedBy: 'CRC/药房', nextAction: '研究授权' },
  { code: 'FEE-OLD-HDF', name: '旧版HDF费用', category: '历史项目', configType: '透析模式费用配置', price: '520.00', unit: '次', insuranceCode: 'HIS-HDF-OLD', selfPay: '否', chargeRule: '历史引用', status: '停用', owner: '收费办', usedBy: '历史费用', nextAction: '引用清理' },
];

const currentRow = computed(() => rows.find((item) => item.code === selectedCode.value) ?? rows[0]);
const activeTables = ['base_fee_item', 'base_dialysis_mode', 'base_drug', 'base_material', 'base_lab_item', 'charge_detail', 'his_charge_sync'];
const metrics = computed(() => [
  { label: '费用项目', value: rows.length, tone: 'blue' },
  { label: '启用', value: rows.filter((item) => item.status === '启用').length, tone: 'green' },
  { label: '待复核/受控', value: rows.filter((item) => item.status === '待复核' || item.status === '受控').length, tone: 'orange' },
  { label: '自动计费', value: rows.filter((item) => item.chargeRule.includes('医嘱') || item.chargeRule.includes('消耗') || item.chargeRule.includes('报告')).length, tone: 'purple' },
]);

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (['启用', '持续维护'].includes(value)) return 'success';
  if (value.includes('待') || value.includes('受控') || value.includes('复核') || value.includes('授权') || value.includes('自费')) return 'warning';
  if (value === '停用') return 'info';
  return 'info';
}

function selectRow(row: Row): void {
  selectedCode.value = row.code;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}
</script>

<template>
  <section class="base-data-page">
    <el-card class="base-work-card" shadow="never">
      <template #header>
        <div class="base-work-header">
          <div>
            <h2>{{ props.context.menuTitle }}</h2>
            <p>维护透析模式、药品、耗材、检验检查和 GCP 费用口径，供自动计费、欠费提醒和 HIS 收费同步引用。</p>
          </div>
          <div class="base-actions">
            <el-button type="primary" :icon="Coin" @click="feeDialogVisible = true">新增费用项</el-button>
            <el-button :icon="Warning" @click="ruleDialogVisible = true">计费规则</el-button>
            <el-button :icon="CircleCheck" @click="usageDrawerVisible = true">引用分析</el-button>
          </div>
        </div>
      </template>

      <el-form class="base-filter" inline>
        <el-form-item label="关键字"><el-input placeholder="费用名称、医保编码、配置类型、规则、引用模块" clearable /></el-form-item>
        <el-form-item label="分类"><el-select placeholder="全部分类" clearable><el-option label="治疗项目" value="治疗项目" /><el-option label="耗材项目" value="耗材项目" /><el-option label="药品项目" value="药品项目" /><el-option label="检验项目" value="检验项目" /><el-option label="检查项目" value="检查项目" /></el-select></el-form-item>
        <el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="启用" value="启用" /><el-option label="待复核" value="待复核" /><el-option label="受控" value="受控" /><el-option label="停用" value="停用" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <div class="base-stat-grid"><el-card v-for="item in metrics" :key="item.label" :class="['base-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>
      <el-table :data="rows" border stripe highlight-current-row row-key="code" @row-click="selectRow">
        <el-table-column prop="code" label="编码" width="145" fixed="left" />
        <el-table-column prop="name" label="费用名称" min-width="150" />
        <el-table-column prop="category" label="分类" width="95" />
        <el-table-column prop="configType" label="配置类型" width="135" />
        <el-table-column prop="price" label="价格" width="90" />
        <el-table-column prop="unit" label="计费单位" width="90" />
        <el-table-column prop="insuranceCode" label="医保/收费编码" width="135" />
        <el-table-column prop="selfPay" label="自费标识" width="95"><template #default="{ row }"><el-tag :type="tagType(row.selfPay)" effect="plain">{{ row.selfPay }}</el-tag></template></el-table-column>
        <el-table-column prop="chargeRule" label="计费规则" width="130" />
        <el-table-column prop="status" label="状态" width="95"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="owner" label="责任部门" width="110" />
        <el-table-column prop="usedBy" label="引用模块" min-width="130" />
        <el-table-column prop="nextAction" label="下一步" min-width="110" />
        <el-table-column label="操作" width="220" fixed="right"><template #default="{ row }"><el-button link type="primary" @click.stop="selectRow(row); feeDialogVisible = true">维护</el-button><el-button link @click.stop="selectRow(row); ruleDialogVisible = true">规则</el-button><el-button link @click.stop="selectRow(row); usageDrawerVisible = true">引用</el-button></template></el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="feeDialogVisible" title="费用基础资料维护" width="680px">
      <el-form label-width="120px">
        <el-form-item label="费用编码"><el-input :model-value="currentRow.code" /></el-form-item>
        <el-form-item label="费用名称"><el-input :model-value="currentRow.name" /></el-form-item>
        <el-form-item label="配置类型"><el-input :model-value="currentRow.configType" /></el-form-item>
        <el-form-item label="价格/单位"><el-input :model-value="`${currentRow.price} / ${currentRow.unit}`" /></el-form-item>
        <el-form-item label="医保编码"><el-input :model-value="currentRow.insuranceCode" /></el-form-item>
        <el-form-item label="自费标识"><el-input :model-value="currentRow.selfPay" /></el-form-item>
        <el-form-item label="接口映射"><el-input placeholder="填写 HIS 收费编码、院区价格版本和医保限制" /></el-form-item>
        <el-form-item label="说明"><el-input type="textarea" :rows="3" placeholder="记录计费口径、费用来源和对历史收费的影响" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="feeDialogVisible = false">取消</el-button><el-button type="primary" @click="feeDialogVisible = false; submitAction('费用资料已保存')">保存费用项</el-button></template>
    </el-dialog>

    <el-dialog v-model="ruleDialogVisible" title="计费规则维护" width="620px">
      <el-form label-width="110px">
        <el-form-item label="费用项目"><el-input :model-value="currentRow.name" disabled /></el-form-item>
        <el-form-item label="触发来源"><el-checkbox-group><el-checkbox label="治疗归档" /><el-checkbox label="医嘱执行" /><el-checkbox label="药品消耗" /><el-checkbox label="耗材消耗" /><el-checkbox label="检验报告" /><el-checkbox label="检查报告" /></el-checkbox-group></el-form-item>
        <el-form-item label="计费结论"><el-radio-group model-value="charge"><el-radio-button label="charge">计费</el-radio-button><el-radio-button label="free">不计费</el-radio-button><el-radio-button label="review">人工复核</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="规则说明"><el-input type="textarea" :rows="3" placeholder="记录触发条件、冲红限制、医保限制和接口同步要求" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="ruleDialogVisible = false">取消</el-button><el-button type="primary" @click="ruleDialogVisible = false; submitAction('计费规则已更新')">保存规则</el-button></template>
    </el-dialog>

    <el-drawer v-model="usageDrawerVisible" title="费用引用分析" size="520px">
      <el-timeline>
        <el-timeline-item timestamp="引用位置">费用项：{{ currentRow.name }}，引用：{{ currentRow.usedBy }}</el-timeline-item>
        <el-timeline-item timestamp="计费校验" type="warning">发布前检查治疗、药耗、检验检查、欠费和 HIS 同步影响。</el-timeline-item>
        <el-timeline-item timestamp="闭环输出" type="success">写入患者费用明细和收费接口审计。</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
