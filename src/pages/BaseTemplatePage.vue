<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, Files, Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();
type Row = { code: string; name: string; category: string; version: string; scene: string; signer: string; status: string; owner: string; nextAction: string };
const selectedCode = ref('TPL-PRE');
const templateDialogVisible = ref(false);
const versionDialogVisible = ref(false);
const usageDrawerVisible = ref(false);
const rows: Row[] = [
  { code: 'TPL-ORDER-HD', name: '标准血透医嘱模板', category: '医嘱模板', version: 'v1.2', scene: '医生站/医嘱组套', signer: '主诊医生', status: '启用', owner: '医务科', nextAction: '持续维护' },
  { code: 'TPL-RX-HD', name: '透析处方模板', category: '透析处方模板', version: 'v1.5', scene: '医生站/透析处方', signer: '主诊医生', status: '启用', owner: '医务科', nextAction: '持续维护' },
  { code: 'TPL-MED-EPO', name: '贫血用药处方模板', category: '用药处方模板', version: 'v1.1', scene: '医生站/药房站', signer: '医生/药师', status: '启用', owner: '药剂科', nextAction: '持续维护' },
  { code: 'TPL-MR-ROUND', name: '血透查房病历模板', category: '病历模板', version: 'v2.0', scene: '病历病程', signer: '医生', status: '启用', owner: '医务科', nextAction: '持续维护' },
  { code: 'TPL-PRE', name: '透前评估模板', category: '护理评估', version: 'v1.4', scene: '治疗记录', signer: '责任护士', status: '启用', owner: '护理部', nextAction: '持续维护' },
  { code: 'TPL-POST', name: '透后评估模板', category: '护理评估', version: 'v1.3', scene: '治疗记录', signer: '责任护士', status: '启用', owner: '护理部', nextAction: '持续维护' },
  { code: 'TPL-RECORD', name: '透析记录单模板', category: '医疗文书', version: 'v2.0', scene: '归档审核', signer: '医生/护士/患者', status: '启用', owner: '医务科', nextAction: '持续维护' },
  { code: 'TPL-CONSENT-HD', name: '血液净化知情同意书', category: '知情同意', version: 'v2.1', scene: '导诊/医生站', signer: '患者/医生', status: '启用', owner: '医务科', nextAction: '持续维护' },
  { code: 'TPL-CONSENT-GCP', name: '研究知情同意书', category: 'GCP文书', version: 'v1.0', scene: 'CRC站', signer: '受试者/研究者', status: '受控', owner: 'GCP中心', nextAction: '研究授权' },
  { code: 'TPL-REPORT', name: '月度健康报告模板', category: '健康报告', version: '草稿', scene: '医生站/患者端', signer: '主诊医生', status: '待复核', owner: '医务科', nextAction: '复核发布' },
  { code: 'TPL-EDU-ACCESS', name: '通路护理宣教模板', category: '宣教模板', version: 'v1.3', scene: '护士站/患者端', signer: '护士/患者', status: '启用', owner: '护理部', nextAction: '持续维护' },
  { code: 'TPL-EVENT', name: '临床事件记录模板', category: '事件记录', version: 'v1.2', scene: '医生站/护士站', signer: '责任人', status: '启用', owner: '医务科', nextAction: '持续维护' },
  { code: 'TPL-INFECT', name: '感控整改记录模板', category: '感控文书', version: 'v1.1', scene: '感控管理', signer: '检查人/复核人', status: '启用', owner: '感控管理', nextAction: '持续维护' },
  { code: 'TPL-CQI', name: 'CQI改进项目模板', category: '质量改进', version: 'v1.0', scene: '规则配置/CQI', signer: '质控负责人', status: '启用', owner: '质控办', nextAction: '持续维护' },
  { code: 'TPL-OLD-CONSENT', name: '旧版透析同意书', category: '历史文书', version: 'v1.0', scene: '历史归档', signer: '患者/医生', status: '停用', owner: '医务科', nextAction: '引用清理' },
];
const currentRow = computed(() => rows.find((item) => item.code === selectedCode.value) ?? rows[0]);
const activeTables = ['base_template', 'medical_record', 'patient_consent', 'template_version_log'];
const metrics = computed(() => [
  { label: '模板数', value: rows.length, tone: 'blue' },
  { label: '启用', value: rows.filter((item) => item.status === '启用').length, tone: 'green' },
  { label: '待复核/受控', value: rows.filter((item) => item.status === '待复核' || item.status === '受控').length, tone: 'orange' },
  { label: '需签名', value: rows.filter((item) => item.signer !== '责任人').length, tone: 'purple' },
]);
function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' { if (['启用', '持续维护'].includes(value)) return 'success'; if (value.includes('待') || value.includes('受控') || value.includes('草稿') || value.includes('授权') || value.includes('复核')) return 'warning'; if (value === '停用') return 'info'; return 'info'; }
function selectRow(row: Row): void { selectedCode.value = row.code; }
function submitAction(message: string): void { ElMessage.success(message); }
</script>

<template>
  <section class="base-data-page">
    <el-card class="base-work-card" shadow="never">
      <template #header><div class="base-work-header"><div><h2>{{ props.context.menuTitle }}</h2><p>维护医嘱、透析处方、用药处方、护理记录、病历、健康报告、宣教和知情同意模板版本，发布后供各业务页面引用。</p></div><div class="base-actions"><el-button type="primary" :icon="Files" @click="templateDialogVisible = true">新增模板</el-button><el-button :icon="CircleCheck" @click="versionDialogVisible = true">版本发布</el-button><el-button @click="usageDrawerVisible = true">引用分析</el-button></div></div></template>
      <el-form class="base-filter" inline><el-form-item label="关键字"><el-input placeholder="模板、分类、场景、签名方" clearable /></el-form-item><el-form-item label="分类"><el-select placeholder="全部分类" clearable><el-option label="医嘱模板" value="医嘱模板" /><el-option label="透析处方模板" value="透析处方模板" /><el-option label="用药处方模板" value="用药处方模板" /><el-option label="护理评估" value="护理评估" /><el-option label="病历模板" value="病历模板" /><el-option label="健康报告" value="健康报告" /><el-option label="宣教模板" value="宣教模板" /><el-option label="知情同意" value="知情同意" /><el-option label="GCP文书" value="GCP文书" /><el-option label="质量改进" value="质量改进" /></el-select></el-form-item><el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="启用" value="启用" /><el-option label="待复核" value="待复核" /><el-option label="受控" value="受控" /><el-option label="停用" value="停用" /></el-select></el-form-item><el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item></el-form>
      <div class="base-stat-grid"><el-card v-for="item in metrics" :key="item.label" :class="['base-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>
      <el-table :data="rows" border stripe highlight-current-row row-key="code" @row-click="selectRow"><el-table-column prop="code" label="编码" width="150" fixed="left" /><el-table-column prop="name" label="模板名称" min-width="170" /><el-table-column prop="category" label="分类" width="105" /><el-table-column prop="version" label="版本" width="90" /><el-table-column prop="scene" label="使用场景" min-width="130" /><el-table-column prop="signer" label="签名方" width="135" /><el-table-column prop="status" label="状态" width="95"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column><el-table-column prop="owner" label="责任部门" width="105" /><el-table-column prop="nextAction" label="下一步" min-width="110" /><el-table-column label="操作" width="220" fixed="right"><template #default="{ row }"><el-button link type="primary" @click.stop="selectRow(row); templateDialogVisible = true">维护</el-button><el-button link @click.stop="selectRow(row); versionDialogVisible = true">版本</el-button><el-button link @click.stop="selectRow(row); usageDrawerVisible = true">引用</el-button></template></el-table-column></el-table>
    </el-card>    <el-dialog v-model="templateDialogVisible" title="模板基础资料维护" width="650px"><el-form label-width="110px"><el-form-item label="模板编码"><el-input :model-value="currentRow.code" /></el-form-item><el-form-item label="模板名称"><el-input :model-value="currentRow.name" /></el-form-item><el-form-item label="使用场景"><el-input :model-value="currentRow.scene" /></el-form-item><el-form-item label="签名方"><el-input :model-value="currentRow.signer" /></el-form-item><el-form-item label="模板字段"><el-checkbox-group><el-checkbox label="患者信息" /><el-checkbox label="治疗日期" /><el-checkbox label="责任人" /><el-checkbox label="电子签名" /></el-checkbox-group></el-form-item><el-form-item label="说明"><el-input type="textarea" :rows="3" placeholder="记录模板字段、适用页面、签名和归档规则" /></el-form-item></el-form><template #footer><el-button @click="templateDialogVisible = false">取消</el-button><el-button type="primary" @click="templateDialogVisible = false; submitAction('模板资料已保存')">保存模板</el-button></template></el-dialog>
    <el-dialog v-model="versionDialogVisible" title="模板版本发布" width="600px"><el-form label-width="110px"><el-form-item label="模板"><el-input :model-value="currentRow.name" disabled /></el-form-item><el-form-item label="发布结论"><el-radio-group model-value="publish"><el-radio-button label="publish">发布</el-radio-button><el-radio-button label="return">退回</el-radio-button><el-radio-button label="archive">归档旧版</el-radio-button></el-radio-group></el-form-item><el-form-item label="影响范围"><el-checkbox-group><el-checkbox label="新增文书" /><el-checkbox label="历史版本保留" /><el-checkbox label="签名规则" /><el-checkbox label="患者端展示" /></el-checkbox-group></el-form-item><el-form-item label="复核意见"><el-input type="textarea" :rows="3" placeholder="记录版本差异、历史兼容和发布影响" /></el-form-item></el-form><template #footer><el-button @click="versionDialogVisible = false">取消</el-button><el-button type="primary" @click="versionDialogVisible = false; submitAction('模板版本发布结果已保存')">提交发布</el-button></template></el-dialog>
    <el-drawer v-model="usageDrawerVisible" title="模板引用分析" size="520px"><el-timeline><el-timeline-item timestamp="引用位置">模板：{{ currentRow.name }}，场景：{{ currentRow.scene }}</el-timeline-item><el-timeline-item timestamp="版本校验" type="warning">发布前检查历史文书、签名、患者端和归档影响。</el-timeline-item><el-timeline-item timestamp="闭环输出" type="success">同步医生站、护士站、导诊台、患者端和CQI页面。</el-timeline-item></el-timeline></el-drawer>
  </section>
</template>
