<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  CircleCheck,
  DataAnalysis,
  DocumentChecked,
  EditPen,
  Files,
  Operation,
  Search,
  Upload,
  Warning,
} from '@element-plus/icons-vue';
import type { PageContext } from '../types';

const props = defineProps<{
  context: PageContext;
}>();

const editDrawerVisible = ref(false);
const reviewDialogVisible = ref(false);
const usageDrawerVisible = ref(false);
const selectedRow = ref<Record<string, string> | null>(null);

const tableMap = {
  'base-medical-dict': ['base_dict', 'base_dict_item', 'base_diagnosis'],
  'base-order': ['base_order_item', 'base_order_set', 'base_order_set_item'],
  'base-drug': ['base_drug', 'base_fee_item', 'stock_lot'],
  'base-material': ['base_material', 'base_fee_item', 'stock_lot'],
  'base-fee': ['base_fee_item', 'base_dialysis_mode', 'charge_detail'],
  'base-lab': ['base_lab_item', 'lab_result_item', 'critical_value_record'],
  'base-dialysis': ['base_dialysis_mode', 'base_order_item', 'dialysis_prescription'],
  'base-template': ['base_template', 'medical_record', 'patient_consent'],
} as Record<string, string[]>;

const dictRows = [
  { code: 'DX-CKD5D', name: '慢性肾脏病5D期', category: '诊断字典', version: '2026.05', status: '启用', usedBy: '医生诊断/报表', updatedAt: '2026-05-01' },
  { code: 'INF-HBV', name: '乙肝隔离标识', category: '感染类型', version: '2026.05', status: '启用', usedBy: '排班分区/感控', updatedAt: '2026-05-01' },
  { code: 'ACCESS-AVF', name: '自体动静脉内瘘', category: '血管通路', version: '2026.05', status: '启用', usedBy: '通路/上机核对', updatedAt: '2026-04-28' },
];

const orderRows = [
  { code: 'ORD-HD-001', name: '普通血液透析', category: '血液净化专项医嘱', version: '2026.05', status: '启用', usedBy: '透析处方/治疗记录', updatedAt: '2026-05-02' },
  { code: 'ORD-LAB-K', name: '血钾检测', category: '检验医嘱', version: '2026.05', status: '启用', usedBy: '检验闭环/危急值', updatedAt: '2026-05-02' },
  { code: 'SET-HD-STD', name: '标准血透医嘱组套', category: '科室组套', version: '草稿', status: '待复核', usedBy: '医生站', updatedAt: '2026-05-10' },
];

const drugRows = [
  { code: 'DRUG-H001', name: '低分子肝素钠', category: '抗凝药', version: '2026.05', status: '启用', usedBy: '医嘱/自动消耗', updatedAt: '2026-04-22' },
  { code: 'DRUG-EPO', name: '重组人促红素', category: '贫血管理', version: '2026.05', status: '启用', usedBy: '长期医嘱/药房', updatedAt: '2026-04-20' },
  { code: 'DRUG-GCP01', name: '研究药物A', category: 'GCP药物', version: '受控', status: '受控', usedBy: 'CRC/药房', updatedAt: '2026-05-03' },
];

const materialRows = [
  { code: 'MAT-DIALYZER-HF', name: '高通量透析器', category: '透析器', version: '2026.05', status: '启用', usedBy: '透析耗材套餐', updatedAt: '2026-04-18' },
  { code: 'MAT-BLOODLINE', name: '血液透析管路', category: '管路', version: '2026.05', status: '启用', usedBy: '自动消耗', updatedAt: '2026-04-18' },
  { code: 'MAT-NEEDLE', name: '内瘘穿刺针', category: '穿刺针', version: '2026.05', status: '启用', usedBy: '穿刺记录', updatedAt: '2026-04-18' },
];

const feeRows = [
  { code: 'FEE-HD', name: '血液透析治疗费', category: '治疗项目', version: '2026.05', status: '启用', usedBy: '单次透析费用', updatedAt: '2026-04-15' },
  { code: 'FEE-HDF', name: '血液透析滤过治疗费', category: '治疗项目', version: '2026.05', status: '启用', usedBy: '透析模式费用', updatedAt: '2026-04-15' },
  { code: 'FEE-MAT', name: '透析耗材套餐费', category: '耗材项目', version: '草稿', status: '待复核', usedBy: '费用明细', updatedAt: '2026-05-10' },
];

const labRows = [
  { code: 'LAB-K', name: '血钾', category: '生化', version: '2026.05', status: '启用', usedBy: '危急值/预警', updatedAt: '2026-04-10' },
  { code: 'LAB-HB', name: '血红蛋白', category: '血常规', version: '2026.05', status: '启用', usedBy: '贫血管理', updatedAt: '2026-04-10' },
  { code: 'LAB-KTV', name: 'Kt/V', category: '透析充分性', version: '2026.05', status: '启用', usedBy: '质量报表', updatedAt: '2026-04-10' },
];

const dialysisRows = [
  { code: 'MODE-HD', name: 'HD', category: '透析模式', version: '2026.05', status: '启用', usedBy: '处方/排班/费用', updatedAt: '2026-04-09' },
  { code: 'MODE-HDF', name: 'HDF', category: '透析模式', version: '2026.05', status: '启用', usedBy: '处方/费用', updatedAt: '2026-04-09' },
  { code: 'MODE-HP', name: '血液灌流', category: '特殊净化', version: '草稿', status: '待复核', usedBy: '特殊净化申请', updatedAt: '2026-05-08' },
];

const templateRows = [
  { code: 'TPL-PRE', name: '透前评估模板', category: '护理评估', version: 'v1.4', status: '启用', usedBy: '治疗记录', updatedAt: '2026-04-05' },
  { code: 'TPL-CONSENT-HD', name: '血液净化知情同意书', category: '知情同意', version: 'v2.1', status: '启用', usedBy: '导诊/医生站', updatedAt: '2026-04-05' },
  { code: 'TPL-REPORT', name: '月度健康报告模板', category: '健康报告', version: '草稿', status: '待复核', usedBy: '医生站/患者端', updatedAt: '2026-05-10' },
];

const mode = computed(() => {
  if (props.context.menuKey === 'base-order') return 'order';
  if (props.context.menuKey === 'base-drug') return 'drug';
  if (props.context.menuKey === 'base-material') return 'material';
  if (props.context.menuKey === 'base-fee') return 'fee';
  if (props.context.menuKey === 'base-lab') return 'lab';
  if (props.context.menuKey === 'base-dialysis') return 'dialysis';
  if (props.context.menuKey === 'base-template') return 'template';
  return 'dict';
});

const rows = computed(() => {
  if (mode.value === 'order') return orderRows;
  if (mode.value === 'drug') return drugRows;
  if (mode.value === 'material') return materialRows;
  if (mode.value === 'fee') return feeRows;
  if (mode.value === 'lab') return labRows;
  if (mode.value === 'dialysis') return dialysisRows;
  if (mode.value === 'template') return templateRows;
  return dictRows;
});

const activeTables = computed(() => tableMap[props.context.menuKey] ?? tableMap['base-medical-dict']);

function openEdit(row?: Record<string, string>): void {
  selectedRow.value = row ?? null;
  editDrawerVisible.value = true;
}

function openReview(row: Record<string, string>): void {
  selectedRow.value = row;
  reviewDialogVisible.value = true;
}

function openUsage(row: Record<string, string>): void {
  selectedRow.value = row;
  usageDrawerVisible.value = true;
}
</script>

<template>
  <section class="base-data-page">
    <el-card class="base-work-card" shadow="never">
      <template #header>
        <div class="base-work-header">
          <div>
            <h2>{{ context.menuTitle }}</h2>
            <p>维护可被医嘱、治疗、费用、检验和报表统一引用的基础资料。</p>
          </div>
          <div class="base-actions">
            <el-button type="primary" :icon="Files" @click="openEdit()">新增</el-button>
            <el-button :icon="Upload">导入</el-button>
            <el-button :icon="CircleCheck">发布版本</el-button>
            <el-button :icon="DataAnalysis">引用分析</el-button>
          </div>
        </div>
      </template>

      <el-form class="base-filter" inline>
        <el-form-item label="关键词">
          <el-input placeholder="编码、名称、分类或引用模块" clearable />
        </el-form-item>
        <el-form-item label="分类">
          <el-select placeholder="全部分类" clearable>
            <el-option label="诊断字典" value="dx" />
            <el-option label="医嘱项目" value="order" />
            <el-option label="药品耗材" value="stock" />
            <el-option label="检验项目" value="lab" />
            <el-option label="透析专科" value="dialysis" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select placeholder="全部状态" clearable>
            <el-option label="启用" value="enabled" />
            <el-option label="停用" value="disabled" />
            <el-option label="待复核" value="review" />
            <el-option label="受控" value="controlled" />
          </el-select>
        </el-form-item>
        <el-form-item label="版本">
          <el-select placeholder="当前版本" clearable>
            <el-option label="2026.05" value="2026.05" />
            <el-option label="草稿" value="draft" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="rows" border stripe>
        <el-table-column prop="code" label="编码" width="150" />
        <el-table-column prop="name" label="名称" min-width="190" />
        <el-table-column prop="category" label="分类" width="140" />
        <el-table-column prop="version" label="版本" width="110" />
        <el-table-column prop="status" label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="row.status === '启用' ? 'success' : row.status === '待复核' ? 'warning' : 'info'">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="usedBy" label="引用模块" min-width="180" />
        <el-table-column prop="updatedAt" label="更新时间" width="120" />
        <el-table-column label="操作" width="230" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">维护</el-button>
            <el-button link @click="openReview(row)">复核</el-button>
            <el-button link @click="openUsage(row)">引用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-drawer v-model="editDrawerVisible" title="维护基础资料" size="560px">
      <el-form label-width="100px">
        <el-form-item label="编码">
          <el-input :model-value="selectedRow?.code" placeholder="请输入唯一编码" />
        </el-form-item>
        <el-form-item label="名称">
          <el-input :model-value="selectedRow?.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="分类">
          <el-input :model-value="selectedRow?.category" placeholder="请输入分类" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group :model-value="selectedRow?.status || '待复核'">
            <el-radio-button label="启用" />
            <el-radio-button label="停用" />
            <el-radio-button label="待复核" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="变更原因">
          <el-input type="textarea" :rows="3" placeholder="说明本次调整对医嘱、治疗、费用或报表的影响" />
        </el-form-item>
      </el-form>
      <div class="drawer-actions">
        <el-button @click="editDrawerVisible = false">取消</el-button>
        <el-button type="primary" :icon="EditPen" @click="editDrawerVisible = false">保存为草稿</el-button>
      </div>
    </el-drawer>

    <el-dialog v-model="reviewDialogVisible" title="复核基础资料变更" width="560px">
      <el-descriptions v-if="selectedRow" :column="1" border>
        <el-descriptions-item label="编码">{{ selectedRow.code }}</el-descriptions-item>
        <el-descriptions-item label="名称">{{ selectedRow.name }}</el-descriptions-item>
        <el-descriptions-item label="引用">{{ selectedRow.usedBy }}</el-descriptions-item>
      </el-descriptions>
      <div class="base-risk-line">
        <el-icon><Warning /></el-icon>
        <span>已被业务引用的基础项发布前必须确认历史记录兼容，不能直接覆盖已归档数据。</span>
      </div>
      <template #footer>
        <el-button @click="reviewDialogVisible = false">退回</el-button>
        <el-button type="primary" @click="reviewDialogVisible = false">通过并发布</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="usageDrawerVisible" title="引用分析" size="560px">
      <el-descriptions v-if="selectedRow" :column="1" border>
        <el-descriptions-item label="项目">{{ selectedRow.name }}</el-descriptions-item>
        <el-descriptions-item label="引用模块">{{ selectedRow.usedBy }}</el-descriptions-item>
      </el-descriptions>
      <el-timeline>
        <el-timeline-item timestamp="医生站">医嘱开立和处方模板引用</el-timeline-item>
        <el-timeline-item timestamp="护士站">核对执行和治疗记录引用</el-timeline-item>
        <el-timeline-item timestamp="费用">单次透析费用和报表统计引用</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
