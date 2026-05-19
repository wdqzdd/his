<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, DocumentAdd, Search, Upload, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{
  context: PageContext;
}>();

type ResultRow = {
  id: string;
  patient: string;
  reportNo: string;
  item: string;
  value: string;
  refRange: string;
  source: string;
  abnormal: string;
  critical: string;
  reviewStatus: string;
  nextAction: string;
};

const selectedId = ref('LINP-001');
const inputDialogVisible = ref(false);
const uploadDialogVisible = ref(false);
const importDialogVisible = ref(false);
const ocrDialogVisible = ref(false);
const reviewDialogVisible = ref(false);
const traceDrawerVisible = ref(false);

const rows: ResultRow[] = [
  { id: 'LINP-001', patient: '王建国', reportNo: 'R20260510001', item: 'K+', value: '4.8 mmol/L', refRange: '3.5-5.5', source: 'LIS同步', abnormal: '否', critical: '否', reviewStatus: '待复核', nextAction: '等待发布' },
  { id: 'LINP-002', patient: '李秀英', reportNo: 'R20260510002', item: 'Alb', value: '34 g/L', refRange: '35-50', source: '手工录入', abnormal: '偏低', critical: '否', reviewStatus: '待复核', nextAction: '补充备注' },
  { id: 'LINP-003', patient: '赵明', reportNo: 'R20260510003', item: 'K+', value: '5.9 mmol/L', refRange: '3.5-5.5', source: 'LIS同步', abnormal: '偏高', critical: '危急', reviewStatus: '待通知', nextAction: '危急通知' },
  { id: 'LINP-004', patient: '陈志强', reportNo: 'R20260510004', item: '凝血功能', value: '待录入', refRange: '-', source: '原始报告', abnormal: '待判定', critical: '否', reviewStatus: '未复核', nextAction: '录入结果' },
  { id: 'LINP-005', patient: '周庆', reportNo: 'R20260510005', item: 'HBsAg', value: '阳性', refRange: '阴性', source: 'LIS同步', abnormal: '异常', critical: '否', reviewStatus: '待复核', nextAction: '复核并归档' },
  { id: 'LINP-006', patient: '何雪', reportNo: 'R20260510006', item: 'Kt/V', value: '1.34', refRange: '>=1.20', source: '手工录入', abnormal: '达标', critical: '否', reviewStatus: '待复核', nextAction: '趋势判断' },
  { id: 'LINP-007', patient: '孙海', reportNo: 'R20260510007', item: 'BNP', value: '980 pg/mL', refRange: '<100', source: 'LIS同步', abnormal: '偏高', critical: '否', reviewStatus: '待复核', nextAction: '转医生' },
  { id: 'LINP-008', patient: '马丽', reportNo: 'R20260510008', item: 'PTH', value: '780 pg/mL', refRange: '150-600', source: '原始报告', abnormal: '偏高', critical: '否', reviewStatus: '已复核', nextAction: '已归档' },
  { id: 'LINP-009', patient: '郭强', reportNo: 'R20260510009', item: 'Hb', value: '92 g/L', refRange: '100-120', source: '手工录入', abnormal: '偏低', critical: '否', reviewStatus: '待复核', nextAction: '补充达标判定' },
  { id: 'LINP-010', patient: '陈敏', reportNo: 'R20260510010', item: 'P', value: '1.82 mmol/L', refRange: '0.81-1.45', source: 'LIS同步', abnormal: '偏高', critical: '否', reviewStatus: '待复核', nextAction: '复核发布' },
];

const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['lab_result', 'lab_result_item', 'critical_value_notice', 'lab_report_attachment'];

const metrics = computed(() => [
  { label: '结果总数', value: rows.length, tone: 'blue' },
  { label: '待复核', value: rows.filter((item) => item.reviewStatus === '待复核').length, tone: 'orange' },
  { label: '危急值', value: rows.filter((item) => item.critical === '危急').length, tone: 'red' },
  { label: '已复核', value: rows.filter((item) => item.reviewStatus === '已复核').length, tone: 'green' },
  { label: '待通知', value: rows.filter((item) => item.reviewStatus === '待通知').length, tone: 'orange' },
]);

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value === '达标' || value === '已复核') return 'success';
  if (value === '危急') return 'danger';
  if (value === '待复核' || value === '待通知' || value === '待录入') return 'warning';
  if (value === '偏高' || value === '偏低' || value === '异常' || value === '待判定') return 'warning';
  return 'info';
}

function selectRow(row: ResultRow): void {
  selectedId.value = row.id;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}

function openInput(row?: ResultRow): void {
  selectedId.value = row?.id ?? rows[0].id;
  inputDialogVisible.value = true;
}

function openReview(row: ResultRow): void {
  selectedId.value = row.id;
  reviewDialogVisible.value = true;
}
</script>

<template>
  <section class="lab-workflow-page">
    <el-card class="lab-work-card" shadow="never">
      <template #header>
        <div class="lab-header">
          <div>
            <h2>{{ context.menuTitle }}</h2>
            <p>录入检验结果、上传原始报告、同步 LIS，并在复核后回写医生站和护理站。</p>
          </div>
          <div class="lab-actions">
            <el-button type="primary" :icon="DocumentAdd" @click="openInput()">录入结果</el-button>
            <el-button :icon="Upload" @click="uploadDialogVisible = true">上传报告</el-button>
            <el-button :icon="Upload" @click="importDialogVisible = true">Excel导入</el-button>
            <el-button :icon="DocumentAdd" @click="ocrDialogVisible = true">OCR识别</el-button>
            <el-button :icon="CircleCheck" @click="openReview(rows[0])">结果复核</el-button>
            <el-button :icon="Warning" @click="traceDrawerVisible = true">危急通知</el-button>
          </div>
        </div>
      </template>

      <el-form class="lab-filter" inline>
        <el-form-item label="关键字"><el-input placeholder="患者、项目、报告号、来源" clearable /></el-form-item>
        <el-form-item label="来源">
          <el-select placeholder="全部来源" clearable>
            <el-option label="LIS同步" value="LIS同步" />
            <el-option label="手工录入" value="手工录入" />
            <el-option label="原始报告" value="原始报告" />
          </el-select>
        </el-form-item>
        <el-form-item label="复核状态">
          <el-select placeholder="全部状态" clearable>
            <el-option label="待复核" value="待复核" />
            <el-option label="待通知" value="待通知" />
            <el-option label="已复核" value="已复核" />
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
        <el-table-column prop="reportNo" label="报告号" width="130" />
        <el-table-column prop="item" label="项目" width="100" />
        <el-table-column prop="value" label="结果" width="120" />
        <el-table-column prop="refRange" label="参考范围" width="120" />
        <el-table-column prop="source" label="来源" width="100" />
        <el-table-column prop="abnormal" label="异常" width="100">
          <template #default="{ row }"><el-tag :type="tagType(row.abnormal)" effect="plain">{{ row.abnormal }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="critical" label="危急值" width="90">
          <template #default="{ row }"><el-tag :type="tagType(row.critical)">{{ row.critical }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="reviewStatus" label="复核" width="100">
          <template #default="{ row }"><el-tag :type="tagType(row.reviewStatus)" effect="plain">{{ row.reviewStatus }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="nextAction" label="下一步" min-width="120" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click.stop="openInput(row)">编辑</el-button>
            <el-button link @click.stop="openReview(row)">复核</el-button>
            <el-button link type="danger" @click.stop="traceDrawerVisible = true">追溯</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="inputDialogVisible" title="录入检验结果" width="680px">
      <el-form label-width="100px">
        <el-form-item label="报告号"><el-input :model-value="currentRow.reportNo" disabled /></el-form-item>
        <el-form-item label="录入来源">
          <el-radio-group model-value="manual">
            <el-radio-button label="manual">手工录入</el-radio-button>
            <el-radio-button label="lis">LIS同步</el-radio-button>
            <el-radio-button label="excel">Excel导入</el-radio-button>
            <el-radio-button label="ocr">OCR识别</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="结果说明"><el-input type="textarea" :rows="4" placeholder="录入项目、结果、单位、参考范围和异常说明" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="inputDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="inputDialogVisible = false; submitAction('检验结果已录入')">保存结果</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="uploadDialogVisible" title="上传原始报告" width="560px">
      <el-upload drag action="#">
        <el-icon><Upload /></el-icon>
        <div class="el-upload__text">拖拽检验报告文件或点击上传</div>
      </el-upload>
      <template #footer>
        <el-button @click="uploadDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="uploadDialogVisible = false; submitAction('原始报告已上传')">保存附件</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="importDialogVisible" title="Excel导入检验结果" width="640px">
      <el-alert type="warning" show-icon :closable="false" title="导入前需校验患者、报告号、项目编码、单位和参考范围，异常值导入后仍需人工复核。" />
      <el-form class="dialog-form" label-width="110px">
        <el-form-item label="导入模板">
          <el-upload drag action="#">
            <el-icon><Upload /></el-icon>
            <div class="el-upload__text">拖拽 Excel 文件或点击上传</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="匹配规则">
          <el-select placeholder="请选择">
            <el-option label="按报告号+项目编码" value="report-item" />
            <el-option label="按患者号+采样时间" value="patient-time" />
            <el-option label="人工确认冲突项" value="manual" />
          </el-select>
        </el-form-item>
        <el-form-item label="导入说明"><el-input type="textarea" :rows="3" placeholder="记录导入来源、冲突处理、异常项和复核要求" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="importDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="importDialogVisible = false; submitAction('Excel检验结果已导入，等待结果复核')">导入结果</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="ocrDialogVisible" title="OCR识别（二期）" width="600px">
      <el-alert type="info" show-icon :closable="false" title="需求文档标注 OCR 为二期能力，当前原型保留识别入口和审核流。" />
      <el-form class="dialog-form" label-width="110px">
        <el-form-item label="原始报告"><el-input :model-value="currentRow.reportNo" disabled /></el-form-item>
        <el-form-item label="识别状态">
          <el-radio-group model-value="pending">
            <el-radio-button label="pending">待识别</el-radio-button>
            <el-radio-button label="review">待人工校对</el-radio-button>
            <el-radio-button label="hold">暂不启用</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="校对说明"><el-input type="textarea" :rows="3" placeholder="记录 OCR 字段映射、识别置信度、人工校对和复核要求" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="ocrDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="ocrDialogVisible = false; submitAction('OCR识别任务已登记为二期待办')">登记任务</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="reviewDialogVisible" title="结果复核" width="620px">
      <el-form label-width="100px">
        <el-form-item label="项目"><el-input :model-value="`${currentRow.patient} / ${currentRow.item}`" disabled /></el-form-item>
        <el-form-item label="复核结果">
          <el-radio-group model-value="pass">
            <el-radio-button label="pass">通过</el-radio-button>
            <el-radio-button label="return">退回修改</el-radio-button>
            <el-radio-button label="notify">通知医生</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="复核意见"><el-input type="textarea" :rows="3" placeholder="记录复核结论、通知情况和发布说明" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reviewDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="reviewDialogVisible = false; submitAction('检验结果已复核')">提交复核</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="危急值通知" size="520px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-10 07:42" type="danger">危急值生成：{{ currentRow.item }} {{ currentRow.value }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 07:50">通知责任医生和护士站</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 08:10" type="success">复核后归档并回写预警</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
