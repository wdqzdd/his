<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, Document, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{
  context: PageContext;
}>();

type LabRow = {
  id: string;
  patient: string;
  dialysisNo: string;
  reportType: string;
  reportNo: string;
  item: string;
  value: string;
  abnormal: string;
  critical: string;
  status: string;
  reviewer: string;
  nextAction: string;
};

const selectedId = ref('NLAB-001');
const reportDialogVisible = ref(false);
const remindDialogVisible = ref(false);
const referDialogVisible = ref(false);
const traceDrawerVisible = ref(false);

const rows: LabRow[] = [
  { id: 'NLAB-001', patient: '王建国', dialysisNo: 'HD-00038', reportType: '检验结果', reportNo: 'R20260510001', item: 'K+', value: '6.2 mmol/L', abnormal: '偏高', critical: '危急', status: '待医生解读', reviewer: '刘医生', nextAction: '立即提醒医生' },
  { id: 'NLAB-002', patient: '李秀英', dialysisNo: 'HD-00072', reportType: '检验趋势', reportNo: 'R20260510002', item: 'Alb', value: '34 g/L', abnormal: '偏低', critical: '否', status: '待复查', reviewer: '张护士', nextAction: '安排复查' },
  { id: 'NLAB-003', patient: '赵明', dialysisNo: 'HD-00116', reportType: '原始检验报告', reportNo: 'R20260510003', item: 'P', value: '1.82 mmol/L', abnormal: '偏高', critical: '否', status: '已查看', reviewer: '刘医生', nextAction: '写入随访' },
  { id: 'NLAB-004', patient: '陈志强', dialysisNo: 'HD-00128', reportType: '检验结果', reportNo: 'R20260510004', item: 'Hb', value: '88 g/L', abnormal: '偏低', critical: '否', status: '待医生解读', reviewer: '周护士', nextAction: '转医生评估' },
  { id: 'NLAB-005', patient: '周庆', dialysisNo: 'HD-00218', reportType: '检验趋势', reportNo: 'R20260510005', item: 'Kt/V', value: '1.18', abnormal: '未达标', critical: '否', status: '待复查', reviewer: '刘医生', nextAction: '补充处方' },
  { id: 'NLAB-006', patient: '何雪', dialysisNo: 'HD-00246', reportType: '危急值查看', reportNo: 'R20260510006', item: 'Ca', value: '2.08 mmol/L', abnormal: '偏高', critical: '否', status: '待医生解读', reviewer: '钱护士', nextAction: '通知医生' },
  { id: 'NLAB-007', patient: '孙海', dialysisNo: 'HD-00277', reportType: '检查结果', reportNo: 'PACS20260510007', item: '胸片', value: '双肺纹理增粗', abnormal: '异常', critical: '否', status: '已查看', reviewer: '张护士', nextAction: '持续观察' },
  { id: 'NLAB-008', patient: '马丽', dialysisNo: 'HD-00305', reportType: '检验结果', reportNo: 'R20260510008', item: 'HBsAg', value: '阳性', abnormal: '异常', critical: '否', status: '隔离标记', reviewer: '感染护士', nextAction: '转隔离队列' },
  { id: 'NLAB-009', patient: '郭强', dialysisNo: 'HD-00322', reportType: '检查报告', reportNo: 'US20260510009', item: '内瘘超声', value: '流量偏低', abnormal: '异常', critical: '否', status: '待复查', reviewer: '刘医生', nextAction: '复查并解释' },
  { id: 'NLAB-010', patient: '陈敏', dialysisNo: 'HD-00341', reportType: '检验结果', reportNo: 'R20260510010', item: '白蛋白', value: '33 g/L', abnormal: '偏低', critical: '否', status: '待医生解读', reviewer: '王护士', nextAction: '营养宣教' },
];

const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['lab_report', 'exam_report', 'result_read_notice', 'doctor_interpretation_task', 'follow_up_reminder'];

const metrics = computed(() => [
  { label: '报告总数', value: rows.length, tone: 'blue' },
  { label: '待解读', value: rows.filter((item) => item.status === '待医生解读').length, tone: 'orange' },
  { label: '待复查', value: rows.filter((item) => item.status === '待复查').length, tone: 'orange' },
  { label: '危急值', value: rows.filter((item) => item.critical === '危急').length, tone: 'red' },
  { label: '已查看', value: rows.filter((item) => item.status === '已查看').length, tone: 'green' },
]);

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value === '已查看') return 'success';
  if (value === '危急' || value === '待医生解读') return 'danger';
  if (value === '待复查' || value === '异常' || value === '偏高' || value === '偏低') return 'warning';
  return 'info';
}

function selectRow(row: LabRow): void {
  selectedId.value = row.id;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}

function openReport(row: LabRow): void {
  selectedId.value = row.id;
  reportDialogVisible.value = true;
}

function openRemind(row: LabRow): void {
  selectedId.value = row.id;
  remindDialogVisible.value = true;
}

function openRefer(row: LabRow): void {
  selectedId.value = row.id;
  referDialogVisible.value = true;
}
</script>

<template>
  <section class="nurse-execution-page">
    <el-card class="nurse-work-card" shadow="never">
      <template #header>
        <div class="nurse-header">
          <div>
            <h2>{{ context.menuTitle }}</h2>
            <p>查看检验报告、记录复查提醒、转医生解读，并把结果回写到护理随访和治疗准备。</p>
          </div>
          <div class="nurse-actions">
            <el-button type="primary" :icon="Document" @click="openReport(rows[0])">查看报告</el-button>
            <el-button :icon="Warning" @click="openRemind(rows[1])">复查提醒</el-button>
            <el-button :icon="CircleCheck" @click="openRefer(rows[0])">转医生解读</el-button>
          </div>
        </div>
      </template>

      <el-form class="nurse-filter" inline>
        <el-form-item label="关键字">
          <el-input placeholder="患者、报告号、项目、检验科" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select placeholder="全部状态" clearable>
            <el-option label="待医生解读" value="待医生解读" />
            <el-option label="待复查" value="待复查" />
            <el-option label="已查看" value="已查看" />
          </el-select>
        </el-form-item>
        <el-form-item label="报告类型">
          <el-select placeholder="全部类型" clearable>
            <el-option label="检验结果" value="检验结果" />
            <el-option label="检验趋势" value="检验趋势" />
            <el-option label="原始检验报告" value="原始检验报告" />
            <el-option label="危急值查看" value="危急值查看" />
            <el-option label="检查结果" value="检查结果" />
            <el-option label="检查报告" value="检查报告" />
          </el-select>
        </el-form-item>
        <el-form-item label="危急值">
          <el-select placeholder="全部" clearable>
            <el-option label="危急" value="危急" />
            <el-option label="否" value="否" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>

      <div class="nurse-stat-grid">
        <el-card v-for="item in metrics" :key="item.label" :class="['nurse-stat-card', item.tone]" shadow="never">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </el-card>
      </div>

      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow">
        <el-table-column prop="patient" label="患者" width="100" fixed="left" />
        <el-table-column prop="dialysisNo" label="透析号" width="110" />
        <el-table-column prop="reportType" label="报告类型" width="125" />
        <el-table-column prop="reportNo" label="报告号" width="130" />
        <el-table-column prop="item" label="项目" width="100" />
        <el-table-column prop="value" label="结果" width="115" />
        <el-table-column prop="abnormal" label="异常" width="90">
          <template #default="{ row }"><el-tag :type="tagType(row.abnormal)" effect="plain">{{ row.abnormal }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="critical" label="危急值" width="90">
          <template #default="{ row }"><el-tag :type="tagType(row.critical)">{{ row.critical }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="110">
          <template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="reviewer" label="责任人" width="100" />
        <el-table-column prop="nextAction" label="下一步" min-width="130" />
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click.stop="openReport(row)">查看</el-button>
            <el-button link @click.stop="openRemind(row)">复查</el-button>
            <el-button link type="danger" @click.stop="openRefer(row)">转医生</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="reportDialogVisible" title="检验报告查看" width="620px">
      <el-form label-width="100px">
        <el-form-item label="患者"><el-input :model-value="currentRow.patient" disabled /></el-form-item>
        <el-form-item label="报告号"><el-input :model-value="currentRow.reportNo" disabled /></el-form-item>
        <el-form-item label="结果摘要"><el-input :model-value="`${currentRow.item} ${currentRow.value}`" disabled /></el-form-item>
        <el-form-item label="查看备注"><el-input type="textarea" :rows="3" placeholder="记录护士查看结论、患者解释和随访提示" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reportDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="reportDialogVisible = false; submitAction('检验报告已查看并回写护理随访')">确认查看</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="remindDialogVisible" title="复查提醒" width="600px">
      <el-form label-width="100px">
        <el-form-item label="复查项目"><el-input :model-value="currentRow.item" disabled /></el-form-item>
        <el-form-item label="提醒时间"><el-date-picker type="datetime" placeholder="选择提醒时间" /></el-form-item>
        <el-form-item label="提醒方式">
          <el-radio-group model-value="phone">
            <el-radio-button label="phone">电话</el-radio-button>
            <el-radio-button label="message">站内消息</el-radio-button>
            <el-radio-button label="home">居家端</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="提醒说明"><el-input type="textarea" :rows="3" placeholder="说明复查原因、注意事项和责任人" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="remindDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="remindDialogVisible = false; submitAction('复查提醒已生成')">保存提醒</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="referDialogVisible" title="转医生解读" width="620px">
      <el-form label-width="100px">
        <el-form-item label="患者"><el-input :model-value="currentRow.patient" disabled /></el-form-item>
        <el-form-item label="接收医生"><el-input placeholder="请输入责任医生" /></el-form-item>
        <el-form-item label="紧急程度">
          <el-select placeholder="请选择">
            <el-option label="普通" value="normal" />
            <el-option label="加急" value="urgent" />
            <el-option label="危急" value="critical" />
          </el-select>
        </el-form-item>
        <el-form-item label="转交说明"><el-input type="textarea" :rows="3" placeholder="记录解读要点、需补充的病情和交接建议" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="referDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="referDialogVisible = false; submitAction('已转医生解读并生成待办')">确认转交</el-button>
      </template>
    </el-dialog>
  </section>
</template>
