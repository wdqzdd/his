<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { DataAnalysis, Download, Histogram, Refresh, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

type Tone = 'blue' | 'green' | 'orange' | 'red';

type StatCard = {
  label: string;
  value: string | number;
  tone: Tone;
};

type FilterItem = {
  label: string;
  placeholder: string;
  options?: string[];
  type?: 'select' | 'month' | 'date' | 'input';
};

type ReportColumn = {
  prop: string;
  label: string;
  minWidth?: number;
  width?: number;
  tag?: boolean;
  fixed?: 'left' | 'right';
};

type ReportRow = Record<string, string | number>;

type DialogField = {
  label: string;
  model: string;
  placeholder?: string;
  type?: 'input' | 'textarea' | 'select' | 'date';
  options?: string[];
};

const props = defineProps<{
  title: string;
  subtitle: string;
  flowText: string;
  filters: FilterItem[];
  stats: StatCard[];
  rows: ReportRow[];
  columns: ReportColumn[];
  drillRows: ReportRow[];
  drillColumns: ReportColumn[];
  snapshotTitle: string;
  snapshotFields: DialogField[];
  exportTitle: string;
  exportFields: DialogField[];
  improvementTitle: string;
  improvementFields: DialogField[];
  closureTables: string;
  closureText: string;
}>();

const selectedRow = ref<ReportRow>(props.rows[0] ?? {});
const snapshotVisible = ref(false);
const exportVisible = ref(false);
const drillVisible = ref(false);
const improvementVisible = ref(false);
const snapshotForm = reactive<Record<string, string>>({});
const exportForm = reactive<Record<string, string>>({});
const improvementForm = reactive<Record<string, string>>({});

const primaryKey = computed(() => props.columns[0]?.prop ?? 'name');

watch(
  () => props.rows,
  (rows) => {
    selectedRow.value = rows[0] ?? {};
  },
);

function tagType(value: string | number) {
  const text = String(value);
  if (['正常', '已发布', '已归档', '达标', '成功', '已关闭'].some((item) => text.includes(item))) return 'success';
  if (['异常', '超标', '一级', '高风险', '未达标'].some((item) => text.includes(item))) return 'danger';
  if (['关注', '待', '草稿', '处理中', '复核'].some((item) => text.includes(item))) return 'warning';
  return 'info';
}

function selectRow(row: ReportRow): void {
  selectedRow.value = row;
}

function submit(message: string, close: () => void): void {
  close();
  ElMessage.success(message);
}
</script>

<template>
  <section class="report-analytics-page">
    <el-card class="report-work-card" shadow="never">
      <template #header>
        <div class="report-header">
          <div>
            <h2>{{ title }}</h2>
            <p>{{ subtitle }}</p>
          </div>
          <div class="report-actions">
            <el-button type="primary" :icon="Refresh" @click="snapshotVisible = true">生成快照</el-button>
            <el-button :icon="Download" @click="exportVisible = true">导出报表</el-button>
            <el-button :icon="Warning" @click="improvementVisible = true">异常改进</el-button>
            <el-button :icon="Histogram" @click="drillVisible = true">下钻分析</el-button>
          </div>
        </div>
      </template>

      <el-form class="report-filter" inline>
        <el-form-item v-for="item in filters" :key="item.label" :label="item.label">
          <el-date-picker v-if="item.type === 'month'" type="month" :placeholder="item.placeholder" />
          <el-date-picker v-else-if="item.type === 'date'" type="date" :placeholder="item.placeholder" />
          <el-select v-else-if="item.type === 'select'" :placeholder="item.placeholder" clearable>
            <el-option v-for="option in item.options" :key="option" :label="option" :value="option" />
          </el-select>
          <el-input v-else :placeholder="item.placeholder" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>

      <div class="report-stat-grid">
        <el-card v-for="item in stats" :key="item.label" :class="['report-stat-card', item.tone]" shadow="never">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </el-card>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :xl="16">
          <el-card class="report-main-card" shadow="never">
            <template #header>
              <div class="report-card-header">
                <strong>指标明细</strong>
                <el-tag type="primary" effect="plain">{{ flowText }}</el-tag>
              </div>
            </template>
            <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow">
              <el-table-column
                v-for="column in columns"
                :key="column.prop"
                :prop="column.prop"
                :label="column.label"
                :min-width="column.minWidth"
                :width="column.width"
                :fixed="column.fixed"
              >
                <template v-if="column.tag" #default="{ row }">
                  <el-tag :type="tagType(row[column.prop])">{{ row[column.prop] }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="220" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click.stop="selectRow(row); drillVisible = true">下钻</el-button>
                  <el-button link @click.stop="selectRow(row); snapshotVisible = true">快照</el-button>
                  <el-button link @click.stop="selectRow(row); improvementVisible = true">改进</el-button>
                  <el-button link @click.stop="selectRow(row); exportVisible = true">导出</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>

        <el-col :xs="24" :xl="8">
          <el-card class="report-side-card" shadow="never">
            <template #header>
              <div class="report-card-header">
                <strong>当前指标闭环</strong>
                <el-tag :type="tagType(selectedRow.status ?? '')">{{ selectedRow.status }}</el-tag>
              </div>
            </template>
            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="指标">{{ selectedRow[primaryKey] }}</el-descriptions-item>
              <el-descriptions-item label="当前值">{{ selectedRow.value }}</el-descriptions-item>
              <el-descriptions-item label="目标">{{ selectedRow.target }}</el-descriptions-item>
              <el-descriptions-item label="来源">{{ selectedRow.source }}</el-descriptions-item>
              <el-descriptions-item label="责任人">{{ selectedRow.owner }}</el-descriptions-item>
              <el-descriptions-item label="下一步">{{ selectedRow.nextAction }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-dialog v-model="snapshotVisible" :title="snapshotTitle" width="660px">
      <el-form :model="snapshotForm" label-width="112px">
        <el-form-item v-for="field in snapshotFields" :key="field.model" :label="field.label">
          <el-date-picker v-if="field.type === 'date'" v-model="snapshotForm[field.model]" type="date" :placeholder="field.placeholder" />
          <el-select v-else-if="field.type === 'select'" v-model="snapshotForm[field.model]" :placeholder="field.placeholder" clearable>
            <el-option v-for="option in field.options" :key="option" :label="option" :value="option" />
          </el-select>
          <el-input v-else-if="field.type === 'textarea'" v-model="snapshotForm[field.model]" type="textarea" :rows="3" :placeholder="field.placeholder" />
          <el-input v-else v-model="snapshotForm[field.model]" :placeholder="field.placeholder" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="snapshotVisible = false">取消</el-button>
        <el-button type="primary" :icon="DataAnalysis" @click="submit('报表快照已生成，指标口径和下钻链接已固化', () => snapshotVisible = false)">生成快照</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="exportVisible" :title="exportTitle" width="640px">
      <el-form :model="exportForm" label-width="112px">
        <el-form-item v-for="field in exportFields" :key="field.model" :label="field.label">
          <el-select v-if="field.type === 'select'" v-model="exportForm[field.model]" :placeholder="field.placeholder" clearable>
            <el-option v-for="option in field.options" :key="option" :label="option" :value="option" />
          </el-select>
          <el-input v-else-if="field.type === 'textarea'" v-model="exportForm[field.model]" type="textarea" :rows="3" :placeholder="field.placeholder" />
          <el-input v-else v-model="exportForm[field.model]" :placeholder="field.placeholder" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="exportVisible = false">取消</el-button>
        <el-button type="primary" @click="submit('导出任务已提交，完成后进入消息中心', () => exportVisible = false)">确认导出</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="improvementVisible" :title="improvementTitle" width="680px">
      <el-form :model="improvementForm" label-width="112px">
        <el-form-item v-for="field in improvementFields" :key="field.model" :label="field.label">
          <el-select v-if="field.type === 'select'" v-model="improvementForm[field.model]" :placeholder="field.placeholder" clearable>
            <el-option v-for="option in field.options" :key="option" :label="option" :value="option" />
          </el-select>
          <el-input v-else-if="field.type === 'textarea'" v-model="improvementForm[field.model]" type="textarea" :rows="3" :placeholder="field.placeholder" />
          <el-input v-else v-model="improvementForm[field.model]" :placeholder="field.placeholder" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="improvementVisible = false">取消</el-button>
        <el-button type="primary" @click="submit('异常指标已生成改进任务，并推送责任工作站', () => improvementVisible = false)">生成改进</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="drillVisible" title="指标下钻明细" size="760px">
      <el-table :data="drillRows" border stripe>
        <el-table-column
          v-for="column in drillColumns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :min-width="column.minWidth"
          :width="column.width"
        >
          <template v-if="column.tag" #default="{ row }">
            <el-tag :type="tagType(row[column.prop])">{{ row[column.prop] }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
  </section>
</template>
