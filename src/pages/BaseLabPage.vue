<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();

type Row = {
  code: string;
  name: string;
  itemType: string;
  category: string;
  hospitalMapping: string;
  unit: string;
  refRange: string;
  reportType: string;
  criticalRule: string;
  status: string;
  owner: string;
  nextAction: string;
};

const selectedCode = ref('LAB-K');
const itemDialogVisible = ref(false);
const criticalDialogVisible = ref(false);
const usageDrawerVisible = ref(false);

const rows: Row[] = [
  { code: 'LAB-K', name: '血钾', itemType: '标准化检验项目', category: '生化', hospitalMapping: 'LIS_K_001', unit: 'mmol/L', refRange: '3.5-5.5', reportType: '结构化检验报告', criticalRule: '>=6.5危急', status: '启用', owner: '检验科', nextAction: '持续维护' },
  { code: 'LAB-HB', name: '血红蛋白', itemType: '标准化检验项目', category: '血常规', hospitalMapping: 'LIS_HB_001', unit: 'g/L', refRange: '100-120', reportType: '结构化检验报告', criticalRule: '<70预警', status: '启用', owner: '检验科', nextAction: '持续维护' },
  { code: 'LAB-ALB', name: '白蛋白', itemType: '标准化检验项目', category: '生化', hospitalMapping: 'LIS_ALB_001', unit: 'g/L', refRange: '35-50', reportType: '结构化检验报告', criticalRule: '<30预警', status: '启用', owner: '检验科', nextAction: '持续维护' },
  { code: 'LAB-P', name: '血磷', itemType: '标准化检验项目', category: '生化', hospitalMapping: 'LIS_P_001', unit: 'mmol/L', refRange: '0.81-1.45', reportType: '结构化检验报告', criticalRule: '>2.0预警', status: '启用', owner: '检验科', nextAction: '持续维护' },
  { code: 'LAB-CA', name: '血钙', itemType: '标准化检验项目', category: '生化', hospitalMapping: 'LIS_CA_001', unit: 'mmol/L', refRange: '2.1-2.6', reportType: '结构化检验报告', criticalRule: '<1.8或>3.0', status: '启用', owner: '检验科', nextAction: '持续维护' },
  { code: 'LAB-PTH', name: '甲状旁腺激素', itemType: '标准化检验项目', category: '骨病', hospitalMapping: 'LIS_PTH_001', unit: 'pg/ml', refRange: '150-600', reportType: '结构化检验报告', criticalRule: '>800预警', status: '启用', owner: '检验科', nextAction: '持续维护' },
  { code: 'LAB-KTV', name: 'Kt/V', itemType: '标准化检验项目', category: '透析充分性', hospitalMapping: 'HD_KTV_CALC', unit: '', refRange: '>=1.20', reportType: '透析充分性报告', criticalRule: '<1.20预警', status: '启用', owner: '质控办', nextAction: '持续维护' },
  { code: 'LAB-HBSAG', name: 'HBsAg', itemType: '标准化检验项目', category: '感染筛查', hospitalMapping: 'LIS_HBSAG_001', unit: '', refRange: '阴性', reportType: '感染筛查报告', criticalRule: '阳性预警', status: '启用', owner: '感控管理', nextAction: '持续维护' },
  { code: 'LAB-ENDOTOXIN', name: '水质内毒素', itemType: '标准化检验项目', category: '水质检测', hospitalMapping: 'WATER_ENDOTOXIN', unit: 'EU/ml', refRange: '<0.25', reportType: '水质检测报告', criticalRule: '>=0.25阻断', status: '待复核', owner: '设备科', nextAction: '复核发布' },
  { code: 'EXAM-AVF-US', name: '内瘘超声', itemType: '检查项目目录', category: '超声检查', hospitalMapping: 'PACS_US_AVF', unit: '次', refRange: '报告描述', reportType: '超声检查报告', criticalRule: '狭窄>50%预警', status: '启用', owner: '医技科', nextAction: '持续维护' },
  { code: 'EXAM-CHEST-XR', name: '胸部正位片', itemType: '检查项目目录', category: '影像检查', hospitalMapping: 'PACS_XR_CHEST', unit: '次', refRange: '报告描述', reportType: '影像检查报告', criticalRule: '感染征象预警', status: '启用', owner: '医技科', nextAction: '持续维护' },
  { code: 'LAB-GCP-SAMPLE', name: '研究标本项目', itemType: '标准化检验项目', category: 'GCP检验', hospitalMapping: 'GCP_PROTOCOL_ITEM', unit: '方案定义', refRange: '方案定义', reportType: '研究检验报告', criticalRule: '受控上报', status: '受控', owner: 'CRC站', nextAction: '研究授权' },
];

const currentRow = computed(() => rows.find((item) => item.code === selectedCode.value) ?? rows[0]);
const activeTables = ['base_lab_item', 'base_exam_item', 'lab_item_mapping', 'lab_result_item', 'critical_value_rule', 'critical_value_record'];
const metrics = computed(() => [
  { label: '检验检查项目', value: rows.length, tone: 'blue' },
  { label: '启用', value: rows.filter((item) => item.status === '启用').length, tone: 'green' },
  { label: '危急/预警规则', value: rows.filter((item) => item.criticalRule.includes('危急') || item.criticalRule.includes('预警')).length, tone: 'orange' },
  { label: '检查项目', value: rows.filter((item) => item.itemType === '检查项目目录').length, tone: 'purple' },
]);

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (['启用', '持续维护'].includes(value)) return 'success';
  if (value.includes('危急') || value.includes('阻断')) return 'danger';
  if (value.includes('预警') || value.includes('待') || value.includes('受控') || value.includes('授权')) return 'warning';
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
            <p>维护检验项目目录、标准化项目、医院项目映射、参考范围、检查项目目录、检查分类和报告类型。</p>
          </div>
          <div class="base-actions">
            <el-button type="primary" :icon="CircleCheck" @click="itemDialogVisible = true">新增项目</el-button>
            <el-button :icon="Warning" @click="criticalDialogVisible = true">危急值规则</el-button>
            <el-button @click="usageDrawerVisible = true">引用分析</el-button>
          </div>
        </div>
      </template>

      <el-form class="base-filter" inline>
        <el-form-item label="关键字"><el-input placeholder="项目、映射编码、分类、报告类型、规则" clearable /></el-form-item>
        <el-form-item label="分类"><el-select placeholder="全部分类" clearable><el-option label="生化" value="生化" /><el-option label="血常规" value="血常规" /><el-option label="感染筛查" value="感染筛查" /><el-option label="水质检测" value="水质检测" /><el-option label="超声检查" value="超声检查" /><el-option label="影像检查" value="影像检查" /></el-select></el-form-item>
        <el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="启用" value="启用" /><el-option label="待复核" value="待复核" /><el-option label="受控" value="受控" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <div class="base-stat-grid"><el-card v-for="item in metrics" :key="item.label" :class="['base-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>
      <el-table :data="rows" border stripe highlight-current-row row-key="code" @row-click="selectRow">
        <el-table-column prop="code" label="编码" width="145" fixed="left" />
        <el-table-column prop="name" label="项目名称" min-width="135" />
        <el-table-column prop="itemType" label="项目类型" width="125" />
        <el-table-column prop="category" label="分类" width="100" />
        <el-table-column prop="hospitalMapping" label="院内映射" width="125" />
        <el-table-column prop="unit" label="单位" width="80" />
        <el-table-column prop="refRange" label="参考范围" width="115" />
        <el-table-column prop="reportType" label="报告类型" width="125" />
        <el-table-column prop="criticalRule" label="危急/预警" min-width="120"><template #default="{ row }"><el-tag :type="tagType(row.criticalRule)" effect="plain">{{ row.criticalRule }}</el-tag></template></el-table-column>
        <el-table-column prop="status" label="状态" width="95"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="owner" label="责任部门" width="105" />
        <el-table-column prop="nextAction" label="下一步" min-width="110" />
        <el-table-column label="操作" width="220" fixed="right"><template #default="{ row }"><el-button link type="primary" @click.stop="selectRow(row); itemDialogVisible = true">维护</el-button><el-button link @click.stop="selectRow(row); criticalDialogVisible = true">危急值</el-button><el-button link @click.stop="selectRow(row); usageDrawerVisible = true">引用</el-button></template></el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="itemDialogVisible" title="检验检查项目维护" width="680px">
      <el-form label-width="120px">
        <el-form-item label="项目编码"><el-input :model-value="currentRow.code" /></el-form-item>
        <el-form-item label="项目名称"><el-input :model-value="currentRow.name" /></el-form-item>
        <el-form-item label="项目类型"><el-input :model-value="currentRow.itemType" /></el-form-item>
        <el-form-item label="院内映射"><el-input :model-value="currentRow.hospitalMapping" placeholder="填写 LIS/PACS 项目编码、结果字段和报告单位" /></el-form-item>
        <el-form-item label="单位/范围"><el-input :model-value="`${currentRow.unit} / ${currentRow.refRange}`" /></el-form-item>
        <el-form-item label="报告类型"><el-input :model-value="currentRow.reportType" /></el-form-item>
        <el-form-item label="说明"><el-input type="textarea" :rows="3" placeholder="记录检验检查口径、达标判定、报告类型和趋势统计影响" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="itemDialogVisible = false">取消</el-button><el-button type="primary" @click="itemDialogVisible = false; submitAction('检验检查项目已保存')">保存项目</el-button></template>
    </el-dialog>

    <el-dialog v-model="criticalDialogVisible" title="危急值与达标规则" width="600px">
      <el-form label-width="110px">
        <el-form-item label="项目"><el-input :model-value="currentRow.name" disabled /></el-form-item>
        <el-form-item label="规则类型"><el-checkbox-group><el-checkbox label="危急值通知" /><el-checkbox label="疗效预警" /><el-checkbox label="CQI达标" /><el-checkbox label="阻断上机" /></el-checkbox-group></el-form-item>
        <el-form-item label="规则说明"><el-input type="textarea" :rows="3" placeholder="记录阈值、通知责任人、复核要求和关闭条件" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="criticalDialogVisible = false">取消</el-button><el-button type="primary" @click="criticalDialogVisible = false; submitAction('危急值规则已更新')">保存规则</el-button></template>
    </el-dialog>

    <el-drawer v-model="usageDrawerVisible" title="检验检查项目引用分析" size="520px">
      <el-timeline>
        <el-timeline-item timestamp="引用位置">项目：{{ currentRow.name }}，规则：{{ currentRow.criticalRule }}</el-timeline-item>
        <el-timeline-item timestamp="接口校验" type="warning">检查 LIS/PACS 映射、危急值通知、医生评估和报表影响。</el-timeline-item>
        <el-timeline-item timestamp="闭环输出" type="success">发布后同步医嘱、检验科、预警和统计。</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
