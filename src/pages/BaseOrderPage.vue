<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, Files, Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();
type Row = {
  code: string;
  name: string;
  orderType: string;
  usage: string;
  frequency: string;
  doseUnit: string;
  packageUnit: string;
  executeMethod: string;
  setScope: string;
  permission: string;
  executor: string;
  status: string;
  owner: string;
  usedBy: string;
  nextAction: string;
};
const selectedCode = ref('ORD-HD-001');
const editDialogVisible = ref(false);
const setDialogVisible = ref(false);
const usageDrawerVisible = ref(false);
const rows: Row[] = [
  { code: 'ORD-HD-001', name: '普通血液透析', orderType: '长期医嘱项目', usage: '治疗申请', frequency: '按治疗日', doseUnit: '次', packageUnit: '次', executeMethod: '治疗执行', setScope: '科室', permission: '医生开立', executor: '护士站', status: '启用', owner: '医务科', usedBy: '处方/治疗记录', nextAction: '持续维护' },
  { code: 'ORD-HDF-001', name: '血液透析滤过', orderType: '长期医嘱项目', usage: '治疗申请', frequency: '按治疗日', doseUnit: '次', packageUnit: '次', executeMethod: '治疗执行', setScope: '科室', permission: '医生开立', executor: '护士站', status: '启用', owner: '医务科', usedBy: '处方/费用', nextAction: '持续维护' },
  { code: 'ORD-TEMP-ALB', name: '白蛋白应急补充', orderType: '临时医嘱项目', usage: '静滴', frequency: '临时一次', doseUnit: 'g', packageUnit: '瓶', executeMethod: '护士执行/药房发药', setScope: '全院', permission: '高风险审核', executor: '护士站/药房', status: '待复核', owner: '药剂科', usedBy: '透中处理/药房', nextAction: '药师复核' },
  { code: 'ORD-LAB-K', name: '血钾检测', orderType: '检验医嘱项目', usage: '静脉采血', frequency: '临时', doseUnit: '项', packageUnit: '管', executeMethod: '采集送检', setScope: '全院', permission: '医生/护士申请', executor: '检验科', status: '启用', owner: '检验科', usedBy: '危急值预警', nextAction: '持续维护' },
  { code: 'ORD-LAB-HB', name: '血红蛋白检测', orderType: '检验医嘱项目', usage: '静脉采血', frequency: '月度', doseUnit: '项', packageUnit: '管', executeMethod: '采集送检', setScope: '科室', permission: '医生开立', executor: '检验科', status: '启用', owner: '检验科', usedBy: '贫血管理', nextAction: '持续维护' },
  { code: 'ORD-EXAM-US', name: '内瘘超声检查', orderType: '检查医嘱项目', usage: '检查申请', frequency: '按需', doseUnit: '次', packageUnit: '次', executeMethod: '预约检查', setScope: '科室', permission: '医生开立', executor: '超声科', status: '启用', owner: '医技科', usedBy: '通路评估', nextAction: '持续维护' },
  { code: 'ORD-DRUG-EPO', name: '促红素注射', orderType: '药品医嘱项目', usage: '皮下注射', frequency: '每周2次', doseUnit: 'IU', packageUnit: '支', executeMethod: '药房审方/护士执行', setScope: '科室', permission: '药师审核', executor: '护士站/药房', status: '启用', owner: '药剂科', usedBy: '药房/费用', nextAction: '持续维护' },
  { code: 'ORD-DRUG-HEP', name: '低分子肝素钠', orderType: '药品医嘱项目', usage: '皮下注射', frequency: '透析前', doseUnit: 'ml', packageUnit: '支', executeMethod: '双人核对', setScope: '科室', permission: '出血风险校验', executor: '护士站', status: '启用', owner: '药剂科', usedBy: '抗凝处方', nextAction: '持续维护' },
  { code: 'ORD-CARE-PRE', name: '透前评估', orderType: '护理医嘱项目', usage: '护理评估', frequency: '每次治疗', doseUnit: '次', packageUnit: '次', executeMethod: '护理记录', setScope: '科室', permission: '护士执行', executor: '护士站', status: '启用', owner: '护理部', usedBy: '治疗记录', nextAction: '持续维护' },
  { code: 'ORD-CARE-DIS', name: '终末消毒', orderType: '护理医嘱项目', usage: '设备消毒', frequency: '治疗后', doseUnit: '次', packageUnit: '次', executeMethod: '消毒记录', setScope: '科室', permission: '护士/技师', executor: '护士站/技师站', status: '启用', owner: '感控管理', usedBy: '归档/感控', nextAction: '持续维护' },
  { code: 'ORD-ENTRUST-DIET', name: '限盐限水宣教', orderType: '嘱托医嘱项目', usage: '宣教嘱托', frequency: '每月', doseUnit: '次', packageUnit: '次', executeMethod: '宣教签名', setScope: '个人', permission: '责任医护', executor: '护士站/患者端', status: '启用', owner: '护理部', usedBy: '宣教/居家主页', nextAction: '持续维护' },
  { code: 'SET-HD-STD', name: '标准血透医嘱组套', orderType: '医嘱组套', usage: '复制组套', frequency: '组套引用', doseUnit: '套', packageUnit: '套', executeMethod: '医生引用', setScope: '科室/HD', permission: '科室权限', executor: '医生站', status: '待复核', owner: '医务科', usedBy: '医生站', nextAction: '复核发布' },
  { code: 'SET-HDF-STD', name: 'HDF医嘱组套', orderType: '医嘱组套', usage: '复制组套', frequency: '组套引用', doseUnit: '套', packageUnit: '套', executeMethod: '医生引用', setScope: '科室/HDF', permission: '科室权限', executor: '医生站', status: '草稿', owner: '医务科', usedBy: '医生站', nextAction: '补全项目' },
];
const currentRow = computed(() => rows.find((item) => item.code === selectedCode.value) ?? rows[0]);
const activeTables = ['base_order_item', 'base_order_set', 'base_order_set_item'];
const metrics = computed(() => [
  { label: '医嘱项', value: rows.length, tone: 'blue' },
  { label: '启用', value: rows.filter((item) => item.status === '启用').length, tone: 'green' },
  { label: '待复核/草稿', value: rows.filter((item) => item.status !== '启用').length, tone: 'orange' },
  { label: '医嘱组套', value: rows.filter((item) => item.orderType === '医嘱组套').length, tone: 'purple' },
]);
function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' { if (['启用', '持续维护'].includes(value)) return 'success'; if (value.includes('待') || value.includes('草稿') || value.includes('补')) return 'warning'; return 'info'; }
function selectRow(row: Row): void { selectedCode.value = row.code; }
function submitAction(message: string): void { ElMessage.success(message); }
</script>

<template>
  <section class="base-data-page">
    <el-card class="base-work-card" shadow="never">
      <template #header><div class="base-work-header"><div><h2>{{ props.context.menuTitle }}</h2><p>维护临时、长期、护理、检验、检查、嘱托医嘱和医嘱组套，统一用法、频次、单位、执行方式和权限口径。</p></div><div class="base-actions"><el-button type="primary" :icon="Files" @click="editDialogVisible = true">新增医嘱</el-button><el-button :icon="CircleCheck" @click="setDialogVisible = true">组套维护</el-button><el-button @click="usageDrawerVisible = true">引用分析</el-button></div></div></template>
      <el-form class="base-filter" inline><el-form-item label="关键字"><el-input placeholder="编码、名称、用法、频次、执行方式、组套权限" clearable /></el-form-item><el-form-item label="医嘱类型"><el-select placeholder="全部类型" clearable><el-option label="临时医嘱项目" value="临时医嘱项目" /><el-option label="长期医嘱项目" value="长期医嘱项目" /><el-option label="护理医嘱项目" value="护理医嘱项目" /><el-option label="检验医嘱项目" value="检验医嘱项目" /><el-option label="检查医嘱项目" value="检查医嘱项目" /><el-option label="嘱托医嘱项目" value="嘱托医嘱项目" /><el-option label="药品医嘱项目" value="药品医嘱项目" /><el-option label="医嘱组套" value="医嘱组套" /></el-select></el-form-item><el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="启用" value="启用" /><el-option label="待复核" value="待复核" /><el-option label="草稿" value="草稿" /></el-select></el-form-item><el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item></el-form>
      <div class="base-stat-grid"><el-card v-for="item in metrics" :key="item.label" :class="['base-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>
      <el-table :data="rows" border stripe highlight-current-row row-key="code" @row-click="selectRow"><el-table-column prop="code" label="编码" width="135" fixed="left" /><el-table-column prop="name" label="名称" min-width="145" /><el-table-column prop="orderType" label="类型" width="125" /><el-table-column prop="usage" label="用法" width="105" /><el-table-column prop="frequency" label="频次" width="105" /><el-table-column prop="doseUnit" label="剂量单位" width="95" /><el-table-column prop="packageUnit" label="包装单位" width="95" /><el-table-column prop="executeMethod" label="执行方式" width="135" /><el-table-column prop="setScope" label="组套适用" width="105" /><el-table-column prop="permission" label="权限控制" width="120" /><el-table-column prop="executor" label="执行方" width="120" /><el-table-column prop="status" label="状态" width="95"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column><el-table-column prop="owner" label="责任部门" width="100" /><el-table-column prop="usedBy" label="引用模块" min-width="130" /><el-table-column prop="nextAction" label="下一步" min-width="110" /><el-table-column label="操作" width="255" fixed="right"><template #default="{ row }"><el-button link type="primary" @click.stop="selectRow(row); editDialogVisible = true">维护</el-button><el-button link @click.stop="selectRow(row); setDialogVisible = true">组套</el-button><el-button link @click.stop="selectRow(row); submitAction('组套已复制为个人草稿')">复制</el-button><el-button link @click.stop="selectRow(row); submitAction('医嘱项启停状态已记录')">启停</el-button><el-button link @click.stop="selectRow(row); usageDrawerVisible = true">引用</el-button></template></el-table-column></el-table>
    </el-card>    <el-dialog v-model="editDialogVisible" title="医嘱基础资料维护" width="720px"><el-form label-width="120px"><el-form-item label="医嘱编码"><el-input :model-value="currentRow.code" /></el-form-item><el-form-item label="医嘱名称"><el-input :model-value="currentRow.name" /></el-form-item><el-form-item label="医嘱类型"><el-input :model-value="currentRow.orderType" /></el-form-item><el-form-item label="用法/频次"><el-input :model-value="`${currentRow.usage} / ${currentRow.frequency}`" /></el-form-item><el-form-item label="剂量/包装单位"><el-input :model-value="`${currentRow.doseUnit} / ${currentRow.packageUnit}`" /></el-form-item><el-form-item label="执行方式"><el-input :model-value="currentRow.executeMethod" /></el-form-item><el-form-item label="执行方"><el-input :model-value="currentRow.executor" /></el-form-item><el-form-item label="关联控制"><el-checkbox-group><el-checkbox label="需要审核" /><el-checkbox label="生成费用" /><el-checkbox label="扣减药耗" /><el-checkbox label="写入治疗记录" /><el-checkbox label="进入药师审核" /></el-checkbox-group></el-form-item><el-form-item label="变更原因"><el-input type="textarea" :rows="3" placeholder="说明执行逻辑、安全校验、费用和药耗影响" /></el-form-item></el-form><template #footer><el-button @click="editDialogVisible = false">取消</el-button><el-button type="primary" @click="editDialogVisible = false; submitAction('医嘱资料已保存为待复核')">保存</el-button></template></el-dialog>
    <el-dialog v-model="setDialogVisible" title="医嘱组套维护" width="700px"><el-form label-width="120px"><el-form-item label="组套/医嘱"><el-input :model-value="currentRow.name" disabled /></el-form-item><el-form-item label="组套项目"><el-checkbox-group><el-checkbox label="透析治疗医嘱" /><el-checkbox label="检验医嘱" /><el-checkbox label="检查医嘱" /><el-checkbox label="药品医嘱" /><el-checkbox label="护理医嘱" /><el-checkbox label="嘱托医嘱" /></el-checkbox-group></el-form-item><el-form-item label="适用范围"><el-checkbox-group><el-checkbox label="全院组套" /><el-checkbox label="科室组套" /><el-checkbox label="个人组套" /><el-checkbox label="适用病种" /><el-checkbox label="适用透析方式" /></el-checkbox-group></el-form-item><el-form-item label="组套操作"><el-checkbox-group><el-checkbox label="新增" /><el-checkbox label="修改" /><el-checkbox label="删除" /><el-checkbox label="启用/停用" /><el-checkbox label="复制" /><el-checkbox label="排序" /><el-checkbox label="权限控制" /><el-checkbox label="明细维护" /></el-checkbox-group></el-form-item><el-form-item label="复核意见"><el-input type="textarea" :rows="3" placeholder="记录组套适用科室、病种、透析方式、默认频次、排序和禁忌提示" /></el-form-item></el-form><template #footer><el-button @click="setDialogVisible = false">取消</el-button><el-button type="primary" @click="setDialogVisible = false; submitAction('医嘱组套已提交复核')">提交组套</el-button></template></el-dialog>
    <el-drawer v-model="usageDrawerVisible" title="医嘱引用分析" size="520px"><el-timeline><el-timeline-item timestamp="引用位置">当前医嘱：{{ currentRow.name }}，引用：{{ currentRow.usedBy }}</el-timeline-item><el-timeline-item timestamp="安全校验" type="warning">检查处方、执行、费用、药耗和报表影响。</el-timeline-item><el-timeline-item timestamp="业务输出" type="success">发布后同步医生站、护士站、药房和费用。</el-timeline-item></el-timeline></el-drawer>
  </section>
</template>
