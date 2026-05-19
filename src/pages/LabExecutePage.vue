<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, Operation, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{
  context: PageContext;
}>();

type ExecuteRow = {
  id: string;
  patient: string;
  item: string;
  detail: string;
  planTime: string;
  executor: string;
  doubleCheck: string;
  status: string;
  risk: string;
  specimenStatus: string;
  reportWriteback: string;
  nextAction: string;
};

const selectedId = ref('LEX-001');
const checkDialogVisible = ref(false);
const executeDialogVisible = ref(false);
const correctionDialogVisible = ref(false);
const traceDrawerVisible = ref(false);

const rows: ExecuteRow[] = [
  { id: 'LEX-001', patient: '王建国', item: '血常规检测核对', detail: '条码 LSP-001，静脉血，血球分析仪02', planTime: '接收后30分钟', executor: '李技师', doubleCheck: '需双人', status: '待核对', risk: '低', specimenStatus: '已接收', reportWriteback: '待回写', nextAction: '双人核对' },
  { id: 'LEX-002', patient: '李秀英', item: '白蛋白生化检测', detail: '离心分装后上机，生化分析仪01', planTime: '09:00前', executor: '王技师', doubleCheck: '需双人', status: '待执行', risk: '低', specimenStatus: '已分装', reportWriteback: '待回写', nextAction: '执行检测' },
  { id: 'LEX-003', patient: '赵明', item: '血钾危急复查', detail: '绿色通道，结果需电话复述确认', planTime: '立即', executor: '张技师', doubleCheck: '已完成', status: '已执行', risk: '高', specimenStatus: '优先接收', reportWriteback: '已回写', nextAction: '危急通知' },
  { id: 'LEX-004', patient: '陈志强', item: '凝血功能检测', detail: '枸橼酸血标本量不足，需重新采集', planTime: '10:00前', executor: '孙技师', doubleCheck: '需双人', status: '暂停', risk: '高', specimenStatus: '拒收待补', reportWriteback: '退回护士站', nextAction: '等待标本重采' },
  { id: 'LEX-005', patient: '周庆', item: '乙肝四项检测', detail: '感染项目专用流程，阳性需感控标记', planTime: '11:00前', executor: '吴技师', doubleCheck: '已完成', status: '已执行', risk: '中', specimenStatus: '已接收', reportWriteback: '已回写', nextAction: '复核感染结果' },
  { id: 'LEX-006', patient: '何雪', item: 'Kt/V透前透后配对', detail: '双管配对检测尿素氮，计算充分性', planTime: '治疗后', executor: '郑技师', doubleCheck: '需双人', status: '待执行', risk: '中', specimenStatus: '已分装', reportWriteback: '待回写', nextAction: '执行复查' },
  { id: 'LEX-007', patient: '孙海', item: '感染四项复核', detail: 'HBsAg 阳性结果复核，需二次确认', planTime: '10:30前', executor: '赵技师', doubleCheck: '通过', status: '待执行', risk: '中', specimenStatus: '感染专柜', reportWriteback: '待回写', nextAction: '复核报告' },
  { id: 'LEX-008', patient: '马丽', item: 'BNP优先检测', detail: '心衰风险，免疫分析仪优先队列', planTime: '立即', executor: '冯技师', doubleCheck: '需双人', status: '待核对', risk: '中', specimenStatus: '绿色通道', reportWriteback: '待回写', nextAction: '优先检测' },
  { id: 'LEX-009', patient: '郭强', item: '钙磷PTH检测', detail: '钙磷与 PTH 同批次复核', planTime: '14:30前', executor: '蒋技师', doubleCheck: '需双人', status: '待执行', risk: '低', specimenStatus: '已分装', reportWriteback: '待回写', nextAction: '写执行记录' },
  { id: 'LEX-010', patient: '陈敏', item: '尿素清除率复查', detail: '透前透后血未齐，等待第二管', planTime: '透析后', executor: '谢技师', doubleCheck: '通过', status: '已执行', risk: '低', specimenStatus: '待补管', reportWriteback: '部分回写', nextAction: '补齐标本' },
];

const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['order_execution', 'double_check_record', 'execution_correction', 'nursing_signature'];

const metrics = computed(() => [
  { label: '执行总数', value: rows.length, tone: 'blue' },
  { label: '待核对', value: rows.filter((item) => item.status === '待核对').length, tone: 'orange' },
  { label: '待执行', value: rows.filter((item) => item.status === '待执行').length, tone: 'orange' },
  { label: '已执行', value: rows.filter((item) => item.status === '已执行').length, tone: 'green' },
  { label: '暂停', value: rows.filter((item) => item.status === '暂停').length, tone: 'red' },
]);

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value === '已执行' || value === '通过' || value === '已完成' || value === '已接收' || value === '已分装' || value === '已回写') return 'success';
  if (value === '待核对' || value === '待执行' || value === '需双人' || value.includes('待') || value.includes('部分')) return 'warning';
  if (value === '暂停' || value === '高' || value.includes('拒收') || value.includes('退回')) return 'danger';
  return 'info';
}

function selectRow(row: ExecuteRow): void {
  selectedId.value = row.id;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}

function openCheck(row?: ExecuteRow): void {
  selectedId.value = row?.id ?? rows[0].id;
  checkDialogVisible.value = true;
}

function openExecute(row: ExecuteRow): void {
  selectedId.value = row.id;
  executeDialogVisible.value = true;
}

function openCorrection(row: ExecuteRow): void {
  selectedId.value = row.id;
  correctionDialogVisible.value = true;
}
</script>

<template>
  <section class="lab-workflow-page">
    <el-card class="lab-work-card" shadow="never">
      <template #header>
        <div class="lab-header">
          <div>
            <h2>{{ context.menuTitle }}</h2>
            <p>完成检验医嘱的双人核对、执行确认和异常勘误，并把结果同步到治疗记录。</p>
          </div>
          <div class="lab-actions">
            <el-button type="primary" :icon="Operation" @click="openCheck()">双人核对</el-button>
            <el-button :icon="CircleCheck" @click="openExecute(rows[1])">执行医嘱</el-button>
            <el-button :icon="Warning" @click="openCorrection(rows[3])">异常勘误</el-button>
          </div>
        </div>
      </template>

      <el-form class="lab-filter" inline>
        <el-form-item label="关键字"><el-input placeholder="患者、项目、执行人、批号" clearable /></el-form-item>
        <el-form-item label="计划时间">
          <el-select placeholder="全部时间" clearable>
            <el-option label="上机前" value="上机前" />
            <el-option label="治疗中" value="治疗中" />
            <el-option label="透析后" value="透析后" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select placeholder="全部状态" clearable>
            <el-option label="待核对" value="待核对" />
            <el-option label="待执行" value="待执行" />
            <el-option label="已执行" value="已执行" />
            <el-option label="暂停" value="暂停" />
          </el-select>
        </el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <div class="lab-stat-grid">
        <el-card v-for="item in metrics" :key="item.label" :class="['lab-stat-card', item.tone]" shadow="never">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </el-card>
      </div>

      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow">
        <el-table-column prop="patient" label="患者" width="100" fixed="left" />
        <el-table-column prop="item" label="项目" min-width="140" />
        <el-table-column prop="detail" label="明细" min-width="200" />
        <el-table-column prop="planTime" label="时间" width="100" />
        <el-table-column prop="executor" label="执行人" width="100" />
        <el-table-column prop="specimenStatus" label="标本状态" width="105">
          <template #default="{ row }"><el-tag :type="tagType(row.specimenStatus)" effect="plain">{{ row.specimenStatus }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="doubleCheck" label="双人核对" width="100">
          <template #default="{ row }"><el-tag :type="tagType(row.doubleCheck)" effect="plain">{{ row.doubleCheck }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="risk" label="风险" width="80">
          <template #default="{ row }"><el-tag :type="tagType(row.risk)">{{ row.risk }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="reportWriteback" label="结果回写" width="110">
          <template #default="{ row }"><el-tag :type="tagType(row.reportWriteback)" effect="plain">{{ row.reportWriteback }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="nextAction" label="下一步" min-width="120" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click.stop="openCheck(row)">核对</el-button>
            <el-button link @click.stop="openExecute(row)">执行</el-button>
            <el-button link type="danger" @click.stop="openCorrection(row)">勘误</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="checkDialogVisible" title="双人核对" width="620px">
      <el-form label-width="100px">
        <el-form-item label="项目"><el-input :model-value="`${currentRow.patient} / ${currentRow.item}`" disabled /></el-form-item>
        <el-form-item label="核对项">
          <el-checkbox-group model-value="patient">
            <el-checkbox-button label="patient">患者</el-checkbox-button>
            <el-checkbox-button label="order">医嘱</el-checkbox-button>
            <el-checkbox-button label="specimen">标本</el-checkbox-button>
            <el-checkbox-button label="risk">风险</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="第二核对人"><el-input placeholder="请输入第二核对护士" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="checkDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="checkDialogVisible = false; submitAction('双人核对已完成')">完成核对</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="executeDialogVisible" title="执行医嘱" width="620px">
      <el-form label-width="100px">
        <el-form-item label="执行项目"><el-input :model-value="currentRow.item" disabled /></el-form-item>
        <el-form-item label="执行时间"><el-date-picker type="datetime" /></el-form-item>
        <el-form-item label="执行结果">
          <el-radio-group model-value="done">
            <el-radio-button label="done">已执行</el-radio-button>
            <el-radio-button label="hold">暂停</el-radio-button>
            <el-radio-button label="refuse">患者拒绝</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="记录"><el-input type="textarea" :rows="3" placeholder="记录剂量、结果和注意事项" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="executeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="executeDialogVisible = false; submitAction('检验执行结果已保存')">提交执行</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="correctionDialogVisible" title="异常勘误" width="620px">
      <el-form label-width="100px">
        <el-form-item label="项目"><el-input :model-value="currentRow.item" disabled /></el-form-item>
        <el-form-item label="异常类型">
          <el-select placeholder="请选择">
            <el-option label="时间错误" value="time" />
            <el-option label="剂量/批号错误" value="batch" />
            <el-option label="患者拒绝" value="refuse" />
          </el-select>
        </el-form-item>
        <el-form-item label="勘误说明"><el-input type="textarea" :rows="3" placeholder="记录原记录、修正后内容和复核人" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="correctionDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="correctionDialogVisible = false; submitAction('异常勘误已提交')">提交勘误</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="执行追溯" size="520px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-10 08:05" type="primary">核对通过：{{ currentRow.item }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 08:20">执行结果写入检验记录</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 08:40" type="success">异常或暂停记录已归档</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
