<script setup lang="ts">
import { ref } from 'vue';
import { CircleCheck, Search, Upload } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

type SpecimenRow = {
  id: string;
  patient: string;
  specimenType: string;
  collector: string;
  collectionTime: string;
  deliveryTime: string;
  destination: string;
  status: string;
  nextAction: string;
};

const collectDialogVisible = ref(false);
const confirmDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const selected = ref<SpecimenRow | null>(null);

const rows: SpecimenRow[] = [
  { id: 'SP-001', patient: '王建国', specimenType: '血标本', collector: '赵护士', collectionTime: '2026-05-10 07:50', deliveryTime: '2026-05-10 08:10', destination: '检验科', status: '已送检', nextAction: '等待结果' },
  { id: 'SP-002', patient: '李秀兰', specimenType: '导管出口拭子', collector: '钱护士', collectionTime: '2026-05-10 08:20', deliveryTime: '2026-05-10 08:40', destination: '检验科', status: '待送检', nextAction: '立即送检' },
  { id: 'SP-003', patient: '赵明', specimenType: '血标本', collector: '孙护士', collectionTime: '2026-05-10 08:35', deliveryTime: '待送检', destination: '检验科', status: '待采集', nextAction: '采集血标本' },
  { id: 'SP-004', patient: '陈志强', specimenType: '通路标本', collector: '周护士', collectionTime: '2026-05-10 09:00', deliveryTime: '2026-05-10 09:20', destination: '检验科', status: '已送检', nextAction: '等待结果' },
  { id: 'SP-005', patient: '刘梅英', specimenType: '专项治疗标本', collector: '吴护士', collectionTime: '待采集', deliveryTime: '待送检', destination: '检验科', status: '待采集', nextAction: '补同意后采集' },
  { id: 'SP-006', patient: '孙海', specimenType: '血标本', collector: '郑护士', collectionTime: '2026-05-11 07:40', deliveryTime: '2026-05-11 08:00', destination: '检验科', status: '已送检', nextAction: '等待结果' },
  { id: 'SP-007', patient: '马丽', specimenType: '隔离标本', collector: '冯护士', collectionTime: '2026-05-11 08:10', deliveryTime: '2026-05-11 08:30', destination: '隔离标本通道', status: '已送检', nextAction: '隔离确认' },
  { id: 'SP-008', patient: '周庆', specimenType: '血标本', collector: '蒋护士', collectionTime: '2026-05-11 08:20', deliveryTime: '待送检', destination: '检验科', status: '待采集', nextAction: '采集后送检' },
  { id: 'SP-009', patient: '何雪', specimenType: '复查标本', collector: '谢护士', collectionTime: '2026-05-11 09:00', deliveryTime: '2026-05-11 09:20', destination: '检验科', status: '已送检', nextAction: '结果回写' },
  { id: 'SP-010', patient: '郭强', specimenType: '血标本', collector: '陆护士', collectionTime: '2026-05-11 09:10', deliveryTime: '待送检', destination: '检验科', status: '待采集', nextAction: '采集Kt/V复查' },
];

const activeTables = ['specimen_collection', 'specimen_delivery', 'lab_order', 'nursing_specimen_log'];

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value === '已送检') return 'success';
  if (value.includes('待')) return 'warning';
  return 'info';
}

function openCollect(row?: SpecimenRow): void { selected.value = row ?? rows[0]; collectDialogVisible.value = true; }
function openConfirm(row: SpecimenRow): void { selected.value = row; confirmDialogVisible.value = true; }
function openTrace(row: SpecimenRow): void { selected.value = row; traceDrawerVisible.value = true; }
function submitAction(message: string): void { ElMessage.success(message); }
</script>

<template>
  <section class="nurse-execution-page">
    <el-card class="nurse-work-card" shadow="never">
      <template #header><div class="nurse-header"><div><h2>{{ context.menuTitle }}</h2><p>记录血标本、拭子、专项治疗标本的采集、送检和追溯，联动检验科工作站。</p></div><div class="nurse-actions"><el-button type="primary" :icon="Upload" @click="openCollect()">登记采集</el-button><el-button :icon="CircleCheck" @click="openConfirm(rows[0])">确认送检</el-button></div></div></template>
      <el-form class="nurse-filter" inline><el-form-item label="关键字"><el-input placeholder="患者、标本类型、检验科" clearable /></el-form-item><el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="待采集" value="待采集" /><el-option label="待送检" value="待送检" /><el-option label="已送检" value="已送检" /></el-select></el-form-item><el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item></el-form>
      <el-table :data="rows" border stripe><el-table-column prop="id" label="标本号" width="105" fixed="left" /><el-table-column prop="patient" label="患者" width="100" /><el-table-column prop="specimenType" label="标本类型" width="120" /><el-table-column prop="collector" label="采集护士" width="100" /><el-table-column prop="collectionTime" label="采集时间" width="145" /><el-table-column prop="deliveryTime" label="送检时间" width="145" /><el-table-column prop="destination" label="目的地" min-width="130" /><el-table-column prop="status" label="状态" width="100"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column><el-table-column prop="nextAction" label="下一步" min-width="120" /><el-table-column label="操作" width="210" fixed="right"><template #default="{ row }"><el-button link type="primary" @click="openCollect(row)">采集</el-button><el-button link @click="openConfirm(row)">送检</el-button><el-button link @click="openTrace(row)">追溯</el-button></template></el-table-column></el-table>
    </el-card>    <el-dialog v-model="collectDialogVisible" title="标本采集登记" width="620px"><el-form label-width="110px"><el-form-item label="患者"><el-input :model-value="selected?.patient" /></el-form-item><el-form-item label="标本类型"><el-select :model-value="selected?.specimenType"><el-option label="血标本" value="血标本" /><el-option label="拭子" value="拭子" /><el-option label="专项治疗标本" value="专项治疗标本" /><el-option label="复查标本" value="复查标本" /></el-select></el-form-item><el-form-item label="采集时间"><el-date-picker type="datetime" /></el-form-item><el-form-item label="送检目的地"><el-input :model-value="selected?.destination" /></el-form-item><el-form-item label="备注"><el-input type="textarea" :rows="3" placeholder="采集条件、保存方式、隔离要求" /></el-form-item></el-form><template #footer><el-button @click="collectDialogVisible = false">取消</el-button><el-button type="primary" @click="collectDialogVisible = false; submitAction('标本采集已登记')">保存</el-button></template></el-dialog>
    <el-dialog v-model="confirmDialogVisible" title="确认送检" width="560px"><el-form label-width="100px"><el-form-item label="标本"><el-input :model-value="selected?.id" disabled /></el-form-item><el-form-item label="确认结果"><el-radio-group model-value="send"><el-radio-button label="send">已送检</el-radio-button><el-radio-button label="hold">暂存</el-radio-button></el-radio-group></el-form-item><el-form-item label="说明"><el-input type="textarea" :rows="3" /></el-form-item></el-form><template #footer><el-button @click="confirmDialogVisible = false">取消</el-button><el-button type="primary" @click="confirmDialogVisible = false; submitAction('标本送检已确认')">提交</el-button></template></el-dialog>
    <el-drawer v-model="traceDrawerVisible" title="标本追溯" size="520px"><el-timeline><el-timeline-item timestamp="2026-05-10 07:50" type="primary">采集标本：{{ selected?.specimenType }}</el-timeline-item><el-timeline-item timestamp="2026-05-10 08:10">送检到检验科</el-timeline-item><el-timeline-item timestamp="2026-05-10 08:30" type="success">检验结果回写</el-timeline-item></el-timeline></el-drawer>
  </section>
</template>
