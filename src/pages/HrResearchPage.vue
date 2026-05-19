<script setup lang="ts">
import { computed, ref } from 'vue';
import { DataLine, Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();
type Row = { id: string; name: string; project: string; researchType: string; role: string; period: string; outputType: string; output: string; reviewStatus: string; owner: string; nextAction: string };
const selectedId = ref('HRR-001');
const researchDialogVisible = ref(false);
const outputDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const rows: Row[] = [
  { id: 'HRR-001', name: '刘主任', project: '维持性血透充分性改进', researchType: '院内课题', role: '负责人', period: '2026年度', outputType: '论文', output: '透析充分性论文初稿', reviewStatus: '进行中', owner: '医务科', nextAction: '阶段复核' },
  { id: 'HRR-002', name: '陈教授', project: 'HD-MBD-02研究', researchType: 'GCP项目', role: '分中心负责人', period: '2026-2027', outputType: '科研成果', output: 'CRF数据与结题报告', reviewStatus: '受控', owner: 'GCP中心', nextAction: 'CRC协同' },
  { id: 'HRR-003', name: '王护士长', project: '透析护理安全改进', researchType: '护理科研', role: '负责人', period: '2026年度', outputType: '科研基金', output: '护理专项基金申请', reviewStatus: '进行中', owner: '护理部', nextAction: '收集数据' },
  { id: 'HRR-004', name: '李教授', project: '血管通路风险模型', researchType: '专科研究', role: '负责人', period: '2026年度', outputType: '专利', output: '通路风险评估算法专利', reviewStatus: '待立项', owner: '医务科', nextAction: '伦理材料' },
  { id: 'HRR-005', name: '周药师', project: '透析用药适宜性分析', researchType: '药学研究', role: '研究成员', period: '2026年度', outputType: '论文', output: '透析用药分析论文', reviewStatus: '进行中', owner: '药剂科', nextAction: '药品数据' },
  { id: 'HRR-006', name: '孙检验师', project: '危急值闭环效率分析', researchType: '质量研究', role: '数据成员', period: '2026年度', outputType: '软著', output: '危急值闭环看板软著', reviewStatus: '待复核', owner: '检验科', nextAction: '数据脱敏' },
  { id: 'HRR-007', name: '马感控', project: '隔离透析感染风险评估', researchType: '感控研究', role: '研究成员', period: '2026年度', outputType: '科研成果', output: '感控改进成果', reviewStatus: '进行中', owner: '院感科', nextAction: '现场检查' },
  { id: 'HRR-008', name: '陈技师', project: '水质异常与设备放行分析', researchType: '设备研究', role: '数据成员', period: '2026年度', outputType: '专利', output: '水处理异常预警装置', reviewStatus: '进行中', owner: '设备科', nextAction: '水质数据' },
  { id: 'HRR-009', name: '钱CRC', project: 'HD-CKD-01研究', researchType: 'GCP项目', role: 'CRC', period: '2026-2027', outputType: '专著', output: '血透临床研究资料汇编', reviewStatus: '受控', owner: 'CRC站', nextAction: '访视核查' },
  { id: 'HRR-010', name: '赵护士', project: '患者宣教依从性研究', researchType: '护理科研', role: '研究成员', period: '2026年度', outputType: '论文', output: '患者宣教依从性论文', reviewStatus: '待复核', owner: '护理部', nextAction: '补充样本' },
];
const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['staff_research_record', 'research_project_member', 'research_output_record', 'research_fund_record', 'research_patent_record', 'research_software_copyright', 'research_audit_log'];
const metrics = computed(() => [
  { label: '科研记录', value: rows.length, tone: 'blue' },
  { label: '进行中', value: rows.filter((item) => item.reviewStatus === '进行中').length, tone: 'green' },
  { label: '待复核/立项', value: rows.filter((item) => item.reviewStatus.includes('待')).length, tone: 'orange' },
  { label: 'GCP受控', value: rows.filter((item) => item.reviewStatus === '受控').length, tone: 'red' },
  { label: '专利/软著', value: rows.filter((item) => item.outputType === '专利' || item.outputType === '软著').length, tone: 'green' },
]);
function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' { if (['进行中', '阶段复核'].includes(value)) return 'success'; if (value === '受控') return 'danger'; if (value.includes('待') || value.includes('伦理') || value.includes('脱敏') || value.includes('补充')) return 'warning'; return 'info'; }
function selectRow(row: Row): void { selectedId.value = row.id; }
function submitAction(message: string): void { ElMessage.success(message); }
</script>

<template>
  <section class="hr-page">
    <el-card class="hr-work-card" shadow="never">
      <template #header><div class="hr-header"><div><h2>{{ props.context.menuTitle }}</h2><p>管理员工科研项目、角色、产出和受控状态，区分院内科研与 GCP 项目授权边界。</p></div><div class="hr-actions"><el-button type="primary" :icon="DataLine" @click="researchDialogVisible = true">科研登记</el-button><el-button @click="outputDialogVisible = true">成果复核</el-button><el-button @click="traceDrawerVisible = true">科研追溯</el-button></div></div></template>
      <el-form class="hr-filter" inline><el-form-item label="关键字"><el-input placeholder="姓名、项目、成果、角色" clearable /></el-form-item><el-form-item label="成果类型"><el-select placeholder="全部类型" clearable><el-option label="专著" value="专著" /><el-option label="论文" value="论文" /><el-option label="科研基金" value="科研基金" /><el-option label="科研成果" value="科研成果" /><el-option label="专利" value="专利" /><el-option label="软著" value="软著" /></el-select></el-form-item><el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="进行中" value="进行中" /><el-option label="待复核" value="待复核" /><el-option label="受控" value="受控" /></el-select></el-form-item><el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item></el-form>
      <div class="hr-stat-grid"><el-card v-for="item in metrics" :key="item.label" :class="['hr-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>
      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow"><el-table-column prop="name" label="姓名" width="95" fixed="left" /><el-table-column prop="project" label="项目" min-width="170" /><el-table-column prop="researchType" label="类型" width="105" /><el-table-column prop="role" label="角色" width="120" /><el-table-column prop="period" label="周期" width="105" /><el-table-column prop="outputType" label="成果类型" width="100" /><el-table-column prop="output" label="成果名称" min-width="145" /><el-table-column prop="reviewStatus" label="状态" width="95"><template #default="{ row }"><el-tag :type="tagType(row.reviewStatus)">{{ row.reviewStatus }}</el-tag></template></el-table-column><el-table-column prop="owner" label="责任部门" width="110" /><el-table-column prop="nextAction" label="下一步" min-width="120" /><el-table-column label="操作" width="220" fixed="right"><template #default="{ row }"><el-button link type="primary" @click.stop="selectRow(row); researchDialogVisible = true">登记</el-button><el-button link @click.stop="selectRow(row); outputDialogVisible = true">成果</el-button><el-button link @click.stop="selectRow(row); traceDrawerVisible = true">追溯</el-button></template></el-table-column></el-table>
    </el-card>    <el-dialog v-model="researchDialogVisible" title="科研项目登记" width="660px"><el-form label-width="110px"><el-form-item label="人员"><el-input :model-value="currentRow.name" disabled /></el-form-item><el-form-item label="项目名称"><el-input :model-value="currentRow.project" /></el-form-item><el-form-item label="项目类型"><el-select :model-value="currentRow.researchType"><el-option label="GCP项目" value="GCP项目" /><el-option label="护理科研" value="护理科研" /><el-option label="质量研究" value="质量研究" /><el-option label="设备研究" value="设备研究" /></el-select></el-form-item><el-form-item label="成果类型"><el-select :model-value="currentRow.outputType"><el-option label="专著" value="专著" /><el-option label="论文" value="论文" /><el-option label="科研基金" value="科研基金" /><el-option label="科研成果" value="科研成果" /><el-option label="专利" value="专利" /><el-option label="软著" value="软著" /></el-select></el-form-item><el-form-item label="角色"><el-input :model-value="currentRow.role" /></el-form-item><el-form-item label="说明"><el-input type="textarea" :rows="3" placeholder="记录成果名称、数据来源、权限边界、伦理要求和职责" /></el-form-item></el-form><template #footer><el-button @click="researchDialogVisible = false">取消</el-button><el-button type="primary" @click="researchDialogVisible = false; submitAction('科研项目记录已保存')">保存项目</el-button></template></el-dialog>
    <el-dialog v-model="outputDialogVisible" title="科研成果复核" width="580px"><el-form label-width="110px"><el-form-item label="成果"><el-input :model-value="currentRow.output" disabled /></el-form-item><el-form-item label="复核结论"><el-radio-group model-value="pass"><el-radio-button label="pass">通过</el-radio-button><el-radio-button label="supplement">补材料</el-radio-button><el-radio-button label="controlled">受控归档</el-radio-button></el-radio-group></el-form-item><el-form-item label="复核意见"><el-input type="textarea" :rows="3" placeholder="记录成果材料、脱敏要求和归档意见" /></el-form-item></el-form><template #footer><el-button @click="outputDialogVisible = false">取消</el-button><el-button type="primary" @click="outputDialogVisible = false; submitAction('科研成果复核已保存')">提交复核</el-button></template></el-dialog>
    <el-drawer v-model="traceDrawerVisible" title="科研工作追溯" size="520px"><el-timeline><el-timeline-item timestamp="项目登记">项目：{{ currentRow.project }}</el-timeline-item><el-timeline-item timestamp="过程复核" type="warning">状态：{{ currentRow.reviewStatus }}，下一步：{{ currentRow.nextAction }}</el-timeline-item><el-timeline-item timestamp="档案输出" type="success">写入科研档案和授权审计</el-timeline-item></el-timeline></el-drawer>
  </section>
</template>
