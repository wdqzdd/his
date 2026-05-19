<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, DocumentAdd, Search, Upload } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{
  context: PageContext;
}>();

type SpecimenRow = {
  id: string;
  patient: string;
  orderItem: string;
  specimen: string;
  collector: string;
  collectTime: string;
  handoverStatus: string;
  receiveTime: string;
  processStatus: string;
  storageStatus: string;
  transportStatus: string;
  destroyStatus: string;
  sendStatus: string;
  lab: string;
  nextAction: string;
};

const selectedId = ref('LSP-001');
const collectDialogVisible = ref(false);
const receiveDialogVisible = ref(false);
const processDialogVisible = ref(false);
const storageDialogVisible = ref(false);
const destroyDialogVisible = ref(false);
const traceDrawerVisible = ref(false);

const rows: SpecimenRow[] = [
  { id: 'LSP-001', patient: '王建国', orderItem: '血常规', specimen: '静脉血', collector: '张护士', collectTime: '2026-05-10 07:20', handoverStatus: '已交接', receiveTime: '2026-05-10 07:35', processStatus: '无需分装', storageStatus: '室温暂存', transportStatus: '院内转运完成', destroyStatus: '待销毁', sendStatus: '已送检', lab: '检验科一组', nextAction: '等待结果' },
  { id: 'LSP-002', patient: '李秀英', orderItem: '白蛋白', specimen: '静脉血', collector: '钱护士', collectTime: '2026-05-10 07:35', handoverStatus: '已交接', receiveTime: '2026-05-10 07:48', processStatus: '已离心分装', storageStatus: '冷藏储存', transportStatus: '院内转运完成', destroyStatus: '待销毁', sendStatus: '已送检', lab: '检验科二组', nextAction: '等待结果' },
  { id: 'LSP-003', patient: '赵明', orderItem: '血钾复查', specimen: '静脉血', collector: '刘护士', collectTime: '2026-05-10 08:05', handoverStatus: '绿色通道', receiveTime: '2026-05-10 08:12', processStatus: '优先处理', storageStatus: '室温暂存', transportStatus: '专人转运', destroyStatus: '待销毁', sendStatus: '已送检', lab: '检验科危急值组', nextAction: '优先检测' },
  { id: 'LSP-004', patient: '陈志强', orderItem: '凝血功能', specimen: '枸橼酸血', collector: '周护士', collectTime: '2026-05-10 08:20', handoverStatus: '待交接', receiveTime: '-', processStatus: '未处理', storageStatus: '未入库', transportStatus: '待转运', destroyStatus: '未到期', sendStatus: '待送检', lab: '检验科一组', nextAction: '确认接收' },
  { id: 'LSP-005', patient: '周庆', orderItem: '乙肝四项', specimen: '血清', collector: '张护士', collectTime: '2026-05-10 08:40', handoverStatus: '未交接', receiveTime: '-', processStatus: '未处理', storageStatus: '未入库', transportStatus: '未转运', destroyStatus: '未到期', sendStatus: '待采集', lab: '检验科二组', nextAction: '采样提醒' },
  { id: 'LSP-006', patient: '何雪', orderItem: 'Kt/V', specimen: '透前透后血', collector: '钱护士', collectTime: '2026-05-11 07:20', handoverStatus: '已交接', receiveTime: '2026-05-11 07:40', processStatus: '双管配对', storageStatus: '冷藏储存', transportStatus: '院内转运完成', destroyStatus: '待销毁', sendStatus: '已送检', lab: '检验科一组', nextAction: '结果回写' },
  { id: 'LSP-007', patient: '孙海', orderItem: '感染四项', specimen: '血清', collector: '刘护士', collectTime: '2026-05-11 07:30', handoverStatus: '已交接', receiveTime: '2026-05-11 07:50', processStatus: '已离心分装', storageStatus: '感染专柜', transportStatus: '隔离转运', destroyStatus: '待销毁', sendStatus: '已送检', lab: '检验科感染组', nextAction: '隔离确认' },
  { id: 'LSP-008', patient: '马丽', orderItem: 'BNP', specimen: '静脉血', collector: '感染护士', collectTime: '2026-05-11 13:10', handoverStatus: '绿色通道', receiveTime: '2026-05-11 13:20', processStatus: '优先处理', storageStatus: '冷藏储存', transportStatus: '专人转运', destroyStatus: '待销毁', sendStatus: '已送检', lab: '检验科二组', nextAction: '优先检测' },
  { id: 'LSP-009', patient: '郭强', orderItem: '钙磷PTH', specimen: '静脉血', collector: '张护士', collectTime: '2026-05-11 13:20', handoverStatus: '已交接', receiveTime: '2026-05-11 13:35', processStatus: '已离心分装', storageStatus: '冷藏储存', transportStatus: '院内转运完成', destroyStatus: '已销毁', sendStatus: '已送检', lab: '检验科一组', nextAction: '等待复核' },
  { id: 'LSP-010', patient: '陈敏', orderItem: '尿素清除率', specimen: '透前透后血', collector: '周护士', collectTime: '2026-05-11 18:10', handoverStatus: '待交接', receiveTime: '-', processStatus: '未处理', storageStatus: '未入库', transportStatus: '待转运', destroyStatus: '未到期', sendStatus: '待送检', lab: '检验科一组', nextAction: '确认送检' },
];

const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['specimen_record', 'sample_tracking', 'lab_receive_log'];

const metrics = computed(() => [
  { label: '标本总数', value: rows.length, tone: 'blue' },
  { label: '待送检', value: rows.filter((item) => item.sendStatus === '待送检').length, tone: 'orange' },
  { label: '待采集', value: rows.filter((item) => item.sendStatus === '待采集').length, tone: 'orange' },
  { label: '离心分装', value: rows.filter((item) => item.processStatus.includes('离心')).length, tone: 'blue' },
  { label: '待销毁', value: rows.filter((item) => item.destroyStatus === '待销毁').length, tone: 'orange' },
  { label: '已送检', value: rows.filter((item) => item.sendStatus === '已送检').length, tone: 'green' },
  { label: '危急优先', value: rows.filter((item) => item.nextAction === '优先检测').length, tone: 'red' },
]);

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value === '已送检' || value === '已交接' || value === '已离心分装' || value === '已销毁' || value.includes('完成')) return 'success';
  if (value === '绿色通道' || value === '优先处理' || value.includes('感染')) return 'danger';
  if (value === '待送检' || value === '待采集' || value === '待交接' || value === '未交接' || value === '未处理' || value === '待转运' || value === '待销毁') return 'warning';
  return 'info';
}

function selectRow(row: SpecimenRow): void {
  selectedId.value = row.id;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}

function openCollect(row?: SpecimenRow): void {
  selectedId.value = row?.id ?? rows[0].id;
  collectDialogVisible.value = true;
}

function openReceive(row: SpecimenRow): void {
  selectedId.value = row.id;
  receiveDialogVisible.value = true;
}

function openProcess(row: SpecimenRow): void {
  selectedId.value = row.id;
  processDialogVisible.value = true;
}

function openStorage(row: SpecimenRow): void {
  selectedId.value = row.id;
  storageDialogVisible.value = true;
}

function openDestroy(row: SpecimenRow): void {
  selectedId.value = row.id;
  destroyDialogVisible.value = true;
}
</script>

<template>
  <section class="lab-workflow-page">
    <el-card class="lab-work-card" shadow="never">
      <template #header>
        <div class="lab-header">
          <div>
            <h2>{{ context.menuTitle }}</h2>
            <p>登记采集、送检和接收回执，让标本轨迹和检验结果可追溯。</p>
          </div>
          <div class="lab-actions">
            <el-button type="primary" :icon="Upload" @click="openCollect()">登记采集</el-button>
            <el-button :icon="CircleCheck" @click="openReceive(rows[0])">确认送检</el-button>
            <el-button :icon="DocumentAdd" @click="openProcess(rows[1])">离心分装</el-button>
            <el-button :icon="DocumentAdd" @click="openStorage(rows[6])">储存转运</el-button>
            <el-button :icon="DocumentAdd" @click="traceDrawerVisible = true">查看追溯</el-button>
          </div>
        </div>
      </template>

      <el-form class="lab-filter" inline>
        <el-form-item label="关键字">
          <el-input placeholder="患者、标本类型、检验科、采集人" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select placeholder="全部状态" clearable>
            <el-option label="待采集" value="待采集" />
            <el-option label="待送检" value="待送检" />
            <el-option label="已送检" value="已送检" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>

      <div class="lab-stat-grid">
        <el-card v-for="item in metrics" :key="item.label" :class="['lab-stat-card', item.tone]" shadow="never">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </el-card>
      </div>

      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow">
        <el-table-column prop="patient" label="患者" width="100" fixed="left" />
        <el-table-column prop="orderItem" label="检验项目" min-width="150" />
        <el-table-column prop="specimen" label="标本" width="100" />
        <el-table-column prop="collector" label="采集人" width="100" />
        <el-table-column prop="collectTime" label="采集时间" width="150" />
        <el-table-column prop="handoverStatus" label="交接" width="100">
          <template #default="{ row }"><el-tag :type="tagType(row.handoverStatus)" effect="plain">{{ row.handoverStatus }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="receiveTime" label="接收时间" width="145" />
        <el-table-column prop="processStatus" label="离心/分装" width="115">
          <template #default="{ row }"><el-tag :type="tagType(row.processStatus)" effect="plain">{{ row.processStatus }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="storageStatus" label="储存" width="100" />
        <el-table-column prop="transportStatus" label="转运" width="120" />
        <el-table-column prop="destroyStatus" label="销毁" width="95">
          <template #default="{ row }"><el-tag :type="tagType(row.destroyStatus)" effect="plain">{{ row.destroyStatus }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="sendStatus" label="送检状态" width="100">
          <template #default="{ row }"><el-tag :type="tagType(row.sendStatus)">{{ row.sendStatus }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="lab" label="接收检验科" width="120" />
        <el-table-column prop="nextAction" label="下一步" min-width="120" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click.stop="openCollect(row)">编辑</el-button>
            <el-button link @click.stop="openReceive(row)">送检</el-button>
            <el-button link @click.stop="openProcess(row)">处理</el-button>
            <el-button link @click.stop="openStorage(row)">储存</el-button>
            <el-button link type="danger" @click.stop="openDestroy(row)">销毁</el-button>
            <el-button link type="danger" @click.stop="traceDrawerVisible = true">追溯</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="collectDialogVisible" title="标本采集登记" width="620px">
      <el-form label-width="100px">
        <el-form-item label="患者"><el-input :model-value="currentRow.patient" disabled /></el-form-item>
        <el-form-item label="标本类型"><el-input :model-value="currentRow.specimen" /></el-form-item>
        <el-form-item label="采集时间"><el-date-picker type="datetime" placeholder="选择采集时间" /></el-form-item>
        <el-form-item label="备注"><el-input type="textarea" :rows="3" placeholder="记录采集条件、异常和送检要求" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="collectDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="collectDialogVisible = false; submitAction('标本采集登记已保存')">保存登记</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="receiveDialogVisible" title="确认送检" width="560px">
      <el-form label-width="100px">
        <el-form-item label="标本"><el-input :model-value="currentRow.orderItem" disabled /></el-form-item>
        <el-form-item label="接收科室"><el-input :model-value="currentRow.lab" /></el-form-item>
        <el-form-item label="送检结果">
          <el-radio-group model-value="sent">
            <el-radio-button label="sent">已送检</el-radio-button>
            <el-radio-button label="hold">暂缓</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="receiveDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="receiveDialogVisible = false; submitAction('标本已确认送检')">确认送检</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="processDialogVisible" title="标本离心分装" width="620px">
      <el-form label-width="100px">
        <el-form-item label="标本"><el-input :model-value="`${currentRow.patient} / ${currentRow.specimen}`" disabled /></el-form-item>
        <el-form-item label="处理动作">
          <el-checkbox-group model-value="centrifuge">
            <el-checkbox-button label="centrifuge">离心</el-checkbox-button>
            <el-checkbox-button label="aliquot">分装</el-checkbox-button>
            <el-checkbox-button label="barcode">复核条码</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="处理说明"><el-input type="textarea" :rows="3" placeholder="记录离心参数、分装管数、异常溶血/凝血和复核人" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="processDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="processDialogVisible = false; submitAction('标本离心分装记录已保存')">保存处理</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="storageDialogVisible" title="标本储存与转运" width="620px">
      <el-form label-width="100px">
        <el-form-item label="标本"><el-input :model-value="currentRow.id" disabled /></el-form-item>
        <el-form-item label="储存条件">
          <el-select placeholder="请选择">
            <el-option label="室温暂存" value="room" />
            <el-option label="冷藏储存" value="cold" />
            <el-option label="感染专柜" value="infection" />
            <el-option label="长期冻存" value="frozen" />
          </el-select>
        </el-form-item>
        <el-form-item label="出库转运"><el-input placeholder="记录出库时间、转运人员、目的地和温控要求" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="storageDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="storageDialogVisible = false; submitAction('标本储存与转运记录已保存')">保存记录</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="destroyDialogVisible" title="标本销毁登记" width="560px">
      <el-form label-width="100px">
        <el-form-item label="标本"><el-input :model-value="`${currentRow.patient} / ${currentRow.orderItem}`" disabled /></el-form-item>
        <el-form-item label="销毁原因"><el-input placeholder="留样到期、检验完成、样本异常或医嘱取消" /></el-form-item>
        <el-form-item label="双人确认"><el-input placeholder="销毁人 / 复核人" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="destroyDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="destroyDialogVisible = false; submitAction('标本销毁记录已提交')">提交销毁</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="标本追溯" size="520px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-10 07:20" type="primary">完成采集：{{ currentRow.patient }} / {{ currentRow.orderItem }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 07:35">交接接收：{{ currentRow.handoverStatus }}，接收时间 {{ currentRow.receiveTime }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 07:45">处理：{{ currentRow.processStatus }}；储存：{{ currentRow.storageStatus }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 08:00" type="success">转运到 {{ currentRow.lab }}，销毁状态：{{ currentRow.destroyStatus }}</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
