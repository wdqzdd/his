<script setup lang="ts">
import { ref } from 'vue';
import { CircleCheck, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

type NursePatientRow = {
  id: string;
  patient: string;
  dialysisNo: string;
  patientTag: string;
  shift: string;
  bed: string;
  nursingGroup: string;
  mode: string;
  access: string;
  orderStatus: string;
  nursingStatus: string;
  risk: string;
  responsibleNurse: string;
  nextAction: string;
};

const detailDrawerVisible = ref(false);
const handoverDialogVisible = ref(false);
const riskDialogVisible = ref(false);
const selected = ref<NursePatientRow | null>(null);

const rows: NursePatientRow[] = [
  { id: 'NP-001', patient: '王建国', dialysisNo: 'HD-00038', patientTag: '当日透析', shift: '上午班', bed: 'A区08床', nursingGroup: '一组', mode: 'HD', access: '左前臂自体内瘘', orderStatus: '医嘱已审核', nursingStatus: '待核对', risk: '低', responsibleNurse: '赵护士', nextAction: '核对医嘱' },
  { id: 'NP-002', patient: '李秀兰', dialysisNo: 'HD-00072', patientTag: '重点关注', shift: '上午班', bed: 'A区12床', nursingGroup: '一组', mode: 'HD', access: '右颈长期导管', orderStatus: '医嘱已审核', nursingStatus: '待护理审核', risk: '中', responsibleNurse: '钱护士', nextAction: '导管风险审核' },
  { id: 'NP-003', patient: '赵明', dialysisNo: 'HD-00116', patientTag: '异常患者', shift: '下午班', bed: 'B区03床', nursingGroup: '二组', mode: 'HD', access: '右前臂自体内瘘', orderStatus: '退回医生', nursingStatus: '暂停', risk: '高', responsibleNurse: '孙护士', nextAction: '等待医嘱修正' },
  { id: 'NP-004', patient: '陈志强', dialysisNo: 'HD-00128', patientTag: '待执行', shift: '下午班', bed: 'B区07床', nursingGroup: '二组', mode: 'HD+HF', access: '左上臂人工血管', orderStatus: '医嘱已审核', nursingStatus: '执行中', risk: '中', responsibleNurse: '周护士', nextAction: '继续执行' },
  { id: 'NP-005', patient: '刘梅英', dialysisNo: 'HD-00151', patientTag: '新收病人', shift: '夜班', bed: 'C区02床', nursingGroup: '夜班组', mode: 'HD+HP', access: '股静脉临时导管', orderStatus: '同意书待确认', nursingStatus: '待护理审核', risk: '高', responsibleNurse: '吴护士', nextAction: '核对专项同意' },
  { id: 'NP-006', patient: '孙海', dialysisNo: 'HD-00177', patientTag: '当日透析', shift: '上午班', bed: 'A区05床', nursingGroup: '一组', mode: 'HD', access: '左前臂自体内瘘', orderStatus: '医嘱已审核', nursingStatus: '待执行', risk: '低', responsibleNurse: '郑护士', nextAction: '执行用药' },
  { id: 'NP-007', patient: '马丽', dialysisNo: 'HD-00203', patientTag: '重点关注', shift: '上午班', bed: '隔离区01床', nursingGroup: '隔离组', mode: '隔离HD', access: '右前臂自体内瘘', orderStatus: '医嘱已审核', nursingStatus: '待核对', risk: '中', responsibleNurse: '冯护士', nextAction: '核对隔离物品' },
  { id: 'NP-008', patient: '周庆', dialysisNo: 'HD-00218', patientTag: '重点关注', shift: '下午班', bed: 'A区16床', nursingGroup: '二组', mode: 'HD', access: '右颈长期导管', orderStatus: '医嘱已审核', nursingStatus: '待核对', risk: '高', responsibleNurse: '蒋护士', nextAction: '限制超滤核对' },
  { id: 'NP-009', patient: '何雪', dialysisNo: 'HD-00246', patientTag: '待执行', shift: '下午班', bed: 'B区11床', nursingGroup: '二组', mode: 'HD', access: '左前臂自体内瘘', orderStatus: '医嘱已审核', nursingStatus: '待执行', risk: '中', responsibleNurse: '谢护士', nextAction: '执行用药' },
  { id: 'NP-010', patient: '郭强', dialysisNo: 'HD-00277', patientTag: '异常患者', shift: '夜班', bed: 'C区06床', nursingGroup: '夜班组', mode: 'HD', access: '左上臂人工血管', orderStatus: '待护理审核', nursingStatus: '未核对', risk: '高', responsibleNurse: '陆护士', nextAction: '护理审核' },
];

const viewCards = [
  { label: '当日透析患者', value: rows.filter((item) => item.patientTag === '当日透析').length, hint: '已签到并生成治疗准备队列' },
  { label: '新收病人', value: rows.filter((item) => item.patientTag === '新收病人').length, hint: '首次入组或首次透析需重点评估' },
  { label: '重点关注患者', value: rows.filter((item) => item.patientTag === '重点关注').length, hint: '导管、隔离、低血压和高危通路' },
  { label: '护理组视图', value: new Set(rows.map((item) => item.nursingGroup)).size, hint: '按护理组和机位责任汇总' },
];

const activeTables = ['nursing_patient', 'schedule_plan', 'medical_order', 'dialysis_prescription', 'nursing_handover', 'nursing_group_assignment'];

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (['低', '医嘱已审核', '待执行', '执行中'].includes(value)) return 'success';
  if (value === '高' || value.includes('退回') || value.includes('暂停')) return 'danger';
  if (value === '中' || value.includes('待') || value.includes('同意书')) return 'warning';
  return 'info';
}

function openDetail(row: NursePatientRow): void {
  selected.value = row;
  detailDrawerVisible.value = true;
}

function openHandover(row: NursePatientRow): void {
  selected.value = row;
  handoverDialogVisible.value = true;
}

function openRisk(row: NursePatientRow): void {
  selected.value = row;
  riskDialogVisible.value = true;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}
</script>

<template>
  <section class="nurse-execution-page">
    <el-card class="nurse-work-card" shadow="never">
      <template #header>
        <div class="nurse-header">
          <div>
            <h2>{{ context.menuTitle }}</h2>
            <p>查看当班护理患者、机位、通路、医嘱状态、护理状态和风险，作为护理审核与核对执行入口。</p>
          </div>
          <div class="nurse-actions">
            <el-button type="primary" :icon="CircleCheck" @click="openDetail(rows[0])">查看患者</el-button>
            <el-button :icon="Warning" @click="openRisk(rows[2])">处理风险</el-button>
          </div>
        </div>
      </template>

      <el-form class="nurse-filter" inline>
        <el-form-item label="患者"><el-input placeholder="姓名、透析号、床位" clearable /></el-form-item>
        <el-form-item label="班次"><el-select placeholder="全部班次" clearable><el-option label="上午班" value="上午班" /><el-option label="下午班" value="下午班" /><el-option label="夜班" value="夜班" /></el-select></el-form-item>
        <el-form-item label="视图"><el-select placeholder="全部视图" clearable><el-option label="当日透析患者" value="当日透析" /><el-option label="新收病人" value="新收病人" /><el-option label="重点关注患者" value="重点关注" /><el-option label="待执行患者" value="待执行" /><el-option label="异常患者" value="异常患者" /></el-select></el-form-item>
        <el-form-item label="护理组"><el-select placeholder="全部护理组" clearable><el-option label="一组" value="一组" /><el-option label="二组" value="二组" /><el-option label="隔离组" value="隔离组" /><el-option label="夜班组" value="夜班组" /></el-select></el-form-item>
        <el-form-item label="风险"><el-select placeholder="全部风险" clearable><el-option label="高" value="高" /><el-option label="中" value="中" /><el-option label="低" value="低" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <div class="nurse-stat-grid">
        <el-card v-for="item in viewCards" :key="item.label" class="nurse-stat-card blue" shadow="never">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
          <small>{{ item.hint }}</small>
        </el-card>
      </div>

      <el-table :data="rows" border stripe>
        <el-table-column prop="patient" label="患者" width="95" fixed="left" />
        <el-table-column prop="dialysisNo" label="透析号" width="115" />
        <el-table-column prop="patientTag" label="患者视图" width="115" />
        <el-table-column prop="shift" label="班次" width="90" />
        <el-table-column prop="bed" label="机位" width="105" />
        <el-table-column prop="nursingGroup" label="护理组" width="95" />
        <el-table-column prop="mode" label="模式" width="90" />
        <el-table-column prop="access" label="通路" min-width="150" />
        <el-table-column prop="orderStatus" label="医嘱状态" min-width="125"><template #default="{ row }"><el-tag :type="tagType(row.orderStatus)">{{ row.orderStatus }}</el-tag></template></el-table-column>
        <el-table-column prop="nursingStatus" label="护理状态" min-width="115"><template #default="{ row }"><el-tag :type="tagType(row.nursingStatus)" effect="plain">{{ row.nursingStatus }}</el-tag></template></el-table-column>
        <el-table-column prop="risk" label="风险" width="80"><template #default="{ row }"><el-tag :type="tagType(row.risk)">{{ row.risk }}</el-tag></template></el-table-column>
        <el-table-column prop="responsibleNurse" label="责任护士" width="105" />
        <el-table-column prop="nextAction" label="下一步" min-width="130" />
        <el-table-column label="操作" width="230" fixed="right">
          <template #default="{ row }"><el-button link type="primary" @click="openDetail(row)">详情</el-button><el-button link @click="openHandover(row)">交接</el-button><el-button link @click="openRisk(row)">风险</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-drawer v-model="detailDrawerVisible" title="护理患者详情" size="620px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="患者">{{ selected?.patient }} / {{ selected?.dialysisNo }}</el-descriptions-item>
        <el-descriptions-item label="班次机位">{{ selected?.shift }} / {{ selected?.bed }}</el-descriptions-item>
        <el-descriptions-item label="通路">{{ selected?.access }}</el-descriptions-item>
        <el-descriptions-item label="医嘱状态">{{ selected?.orderStatus }}</el-descriptions-item>
        <el-descriptions-item label="下一步">{{ selected?.nextAction }}</el-descriptions-item>
      </el-descriptions>
    </el-drawer>

    <el-dialog v-model="handoverDialogVisible" title="护理交接登记" width="620px">
      <el-form label-width="110px">
        <el-form-item label="患者"><el-input :model-value="selected?.patient" disabled /></el-form-item>
        <el-form-item label="交接类型"><el-select model-value="shift"><el-option label="班次交接" value="shift" /><el-option label="风险交接" value="risk" /><el-option label="机位交接" value="bed" /></el-select></el-form-item>
        <el-form-item label="交接内容"><el-input type="textarea" :rows="3" placeholder="通路、医嘱、风险、设备和患者状态" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="handoverDialogVisible = false">取消</el-button><el-button type="primary" @click="handoverDialogVisible = false; submitAction('护理交接已保存')">保存交接</el-button></template>
    </el-dialog>

    <el-dialog v-model="riskDialogVisible" title="护理风险处理" width="620px">
      <el-form label-width="110px">
        <el-form-item label="患者"><el-input :model-value="selected?.patient" disabled /></el-form-item>
        <el-form-item label="风险处理"><el-radio-group model-value="review"><el-radio-button label="review">进入护理审核</el-radio-button><el-radio-button label="doctor">通知医生</el-radio-button><el-radio-button label="event">生成事件</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="处理说明"><el-input type="textarea" :rows="3" placeholder="记录风险来源、处理意见和下一步责任人" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="riskDialogVisible = false">取消</el-button><el-button type="primary" @click="riskDialogVisible = false; submitAction('护理风险处理结果已回写')">提交处理</el-button></template>
    </el-dialog>
  </section>
</template>
