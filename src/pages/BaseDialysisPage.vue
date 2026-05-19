<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, Operation, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();

type Row = {
  code: string;
  name: string;
  category: string;
  defaultValue: string;
  linkedItem: string;
  riskRule: string;
  status: string;
  owner: string;
  nextAction: string;
};

const selectedCode = ref('MODE-HD');
const modeDialogVisible = ref(false);
const paramDialogVisible = ref(false);
const usageDrawerVisible = ref(false);

const rows: Row[] = [
  { code: 'MODE-HD', name: 'HD', category: '透析模式字典', defaultValue: '4h', linkedItem: '血液透析治疗费', riskRule: '常规抗凝', status: '启用', owner: '医务科', nextAction: '持续维护' },
  { code: 'MODE-HDF', name: 'HDF', category: '透析模式字典', defaultValue: '4h', linkedItem: '血液透析滤过治疗费', riskRule: '常规抗凝', status: '启用', owner: '医务科', nextAction: '持续维护' },
  { code: 'METHOD-HP', name: '血液灌流', category: '血液净化方式字典', defaultValue: '2h', linkedItem: '血液灌流治疗费', riskRule: '需同意书/耗材核对', status: '待复核', owner: '医务科', nextAction: '复核发布' },
  { code: 'ANTICOAG-NOHEP', name: '无肝素抗凝', category: '抗凝方式字典', defaultValue: '无肝素', linkedItem: '处方抗凝', riskRule: '出血风险优先', status: '启用', owner: '医务科', nextAction: '持续维护' },
  { code: 'DIALYZER-HF', name: '高通量透析器类型', category: '透析器类型', defaultValue: 'HF-1.6', linkedItem: '高通量透析器', riskRule: '批号/UDI核对', status: '启用', owner: '药耗组', nextAction: '持续维护' },
  { code: 'FILTER-HDF', name: '血滤器类型', category: '血滤器类型', defaultValue: 'HDF-1.8', linkedItem: '血滤器耗材', riskRule: '置换液量核对', status: '启用', owner: '药耗组', nextAction: '持续维护' },
  { code: 'CARTRIDGE-HA130', name: '灌流器类型', category: '灌流器类型', defaultValue: 'HA130', linkedItem: '血液灌流器', riskRule: '凝血/过敏提示', status: '待复核', owner: '药耗组', nextAction: '复核发布' },
  { code: 'DIALYSATE-K2', name: '低钾透析液配置', category: '透析液配置项', defaultValue: 'K=2.0 mmol/L', linkedItem: '透析液处方', riskRule: '血钾联动校验', status: '启用', owner: '技师站', nextAction: '持续维护' },
  { code: 'ACCESS-TYPE-AVF', name: '自体内瘘', category: '血管通路类型', defaultValue: 'AVF', linkedItem: '通路档案', riskRule: '穿刺位点核对', status: '启用', owner: '通路团队', nextAction: '持续维护' },
  { code: 'ACCESS-SITE-LFA', name: '左前臂', category: '通路部位字典', defaultValue: '左前臂', linkedItem: '通路档案', riskRule: '左右侧核对', status: '启用', owner: '通路团队', nextAction: '持续维护' },
  { code: 'PUNCTURE-ROPE', name: '绳梯法穿刺', category: '穿刺方式字典', defaultValue: '绳梯法', linkedItem: '穿刺记录', riskRule: '扣眼/绳梯区分', status: '启用', owner: '护理部', nextAction: '持续维护' },
  { code: 'COMP-IDH', name: '透中低血压', category: '透析并发症字典', defaultValue: '收缩压下降', linkedItem: '症状处理', riskRule: '预警/CQI联动', status: '启用', owner: '医务科', nextAction: '持续维护' },
  { code: 'SUMMARY-ADEQ', name: '透析充分性小结项', category: '治疗小结模板项', defaultValue: 'Kt/V、URR', linkedItem: '治疗小结模板', riskRule: '归档完整性校验', status: '启用', owner: '质控办', nextAction: '持续维护' },
];

const currentRow = computed(() => rows.find((item) => item.code === selectedCode.value) ?? rows[0]);
const activeTables = ['base_dialysis_mode', 'base_dict', 'base_material', 'base_template', 'dialysis_prescription', 'dialysis_mode_param'];
const metrics = computed(() => [
  { label: '专科资料', value: rows.length, tone: 'blue' },
  { label: '启用', value: rows.filter((item) => item.status === '启用').length, tone: 'green' },
  { label: '待复核', value: rows.filter((item) => item.status === '待复核').length, tone: 'orange' },
  { label: '处方/治疗引用', value: rows.filter((item) => item.linkedItem.includes('处方') || item.linkedItem.includes('治疗')).length, tone: 'purple' },
]);

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (['启用', '持续维护'].includes(value)) return 'success';
  if (value.includes('待') || value.includes('复核') || value.includes('风险') || value.includes('预警')) return 'warning';
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
            <p>维护透析模式、净化方式、抗凝、滤器耗材类型、透析液、通路、穿刺、并发症和治疗小结模板项。</p>
          </div>
          <div class="base-actions">
            <el-button type="primary" :icon="Operation" @click="modeDialogVisible = true">专科项维护</el-button>
            <el-button :icon="Warning" @click="paramDialogVisible = true">参数规则</el-button>
            <el-button :icon="CircleCheck" @click="usageDrawerVisible = true">引用分析</el-button>
          </div>
        </div>
      </template>

      <el-form class="base-filter" inline>
        <el-form-item label="关键字"><el-input placeholder="模式、净化方式、抗凝、通路、穿刺、并发症、小结项" clearable /></el-form-item>
        <el-form-item label="分类"><el-select placeholder="全部分类" clearable><el-option label="透析模式字典" value="透析模式字典" /><el-option label="血液净化方式字典" value="血液净化方式字典" /><el-option label="抗凝方式字典" value="抗凝方式字典" /><el-option label="透析器类型" value="透析器类型" /><el-option label="血滤器类型" value="血滤器类型" /><el-option label="灌流器类型" value="灌流器类型" /><el-option label="透析液配置项" value="透析液配置项" /><el-option label="血管通路类型" value="血管通路类型" /><el-option label="通路部位字典" value="通路部位字典" /><el-option label="穿刺方式字典" value="穿刺方式字典" /><el-option label="透析并发症字典" value="透析并发症字典" /><el-option label="治疗小结模板项" value="治疗小结模板项" /></el-select></el-form-item>
        <el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="启用" value="启用" /><el-option label="待复核" value="待复核" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <div class="base-stat-grid"><el-card v-for="item in metrics" :key="item.label" :class="['base-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>
      <el-table :data="rows" border stripe highlight-current-row row-key="code" @row-click="selectRow">
        <el-table-column prop="code" label="编码" width="145" fixed="left" />
        <el-table-column prop="name" label="名称" min-width="150" />
        <el-table-column prop="category" label="分类" width="135" />
        <el-table-column prop="defaultValue" label="默认值/范围" width="120" />
        <el-table-column prop="linkedItem" label="关联项目" width="135" />
        <el-table-column prop="riskRule" label="风险/校验规则" min-width="145"><template #default="{ row }"><el-tag :type="tagType(row.riskRule)" effect="plain">{{ row.riskRule }}</el-tag></template></el-table-column>
        <el-table-column prop="status" label="状态" width="95"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="owner" label="责任部门" width="105" />
        <el-table-column prop="nextAction" label="下一步" min-width="110" />
        <el-table-column label="操作" width="220" fixed="right"><template #default="{ row }"><el-button link type="primary" @click.stop="selectRow(row); modeDialogVisible = true">维护</el-button><el-button link @click.stop="selectRow(row); paramDialogVisible = true">规则</el-button><el-button link @click.stop="selectRow(row); usageDrawerVisible = true">引用</el-button></template></el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="modeDialogVisible" title="专科基础资料维护" width="680px">
      <el-form label-width="120px">
        <el-form-item label="编码"><el-input :model-value="currentRow.code" /></el-form-item>
        <el-form-item label="名称"><el-input :model-value="currentRow.name" /></el-form-item>
        <el-form-item label="分类"><el-input :model-value="currentRow.category" /></el-form-item>
        <el-form-item label="默认值"><el-input :model-value="currentRow.defaultValue" /></el-form-item>
        <el-form-item label="关联项目"><el-input :model-value="currentRow.linkedItem" /></el-form-item>
        <el-form-item label="适用限制"><el-checkbox-group><el-checkbox label="需知情同意" /><el-checkbox label="需医生审核" /><el-checkbox label="上机核对" /><el-checkbox label="费用联动" /><el-checkbox label="感控/隔离限制" /></el-checkbox-group></el-form-item>
        <el-form-item label="说明"><el-input type="textarea" :rows="3" placeholder="记录专科项适用场景、处方校验、治疗记录和费用影响" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="modeDialogVisible = false">取消</el-button><el-button type="primary" @click="modeDialogVisible = false; submitAction('专科基础资料已保存')">保存</el-button></template>
    </el-dialog>

    <el-dialog v-model="paramDialogVisible" title="专科参数与风险规则" width="620px">
      <el-form label-width="110px">
        <el-form-item label="对象"><el-input :model-value="currentRow.name" disabled /></el-form-item>
        <el-form-item label="规则类型"><el-checkbox-group><el-checkbox label="范围校验" /><el-checkbox label="风险提示" /><el-checkbox label="上机核对" /><el-checkbox label="并发症预警" /><el-checkbox label="归档完整性" /></el-checkbox-group></el-form-item>
        <el-form-item label="规则说明"><el-input type="textarea" :rows="3" placeholder="记录参数上下限、抗凝禁忌、通路穿刺、并发症处理和归档要求" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="paramDialogVisible = false">取消</el-button><el-button type="primary" @click="paramDialogVisible = false; submitAction('专科参数规则已更新')">保存规则</el-button></template>
    </el-dialog>

    <el-drawer v-model="usageDrawerVisible" title="专科资料引用分析" size="520px">
      <el-timeline>
        <el-timeline-item timestamp="引用位置">对象：{{ currentRow.name }}，关联：{{ currentRow.linkedItem }}</el-timeline-item>
        <el-timeline-item timestamp="处方校验" type="warning">检查透析处方、上机核对、治疗记录、费用和报表影响。</el-timeline-item>
        <el-timeline-item timestamp="闭环输出" type="success">发布后同步医生站、护士站、药耗费用、质控和统计报表。</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
