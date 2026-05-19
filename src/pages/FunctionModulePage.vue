<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { Connection, DocumentAdd, Operation, Search, SwitchButton } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

type Tone = 'blue' | 'green' | 'orange' | 'red';

type FilterItem = {
  label: string;
  placeholder: string;
  type?: 'input' | 'select' | 'date' | 'month';
  options?: string[];
};

type ColumnItem = {
  prop: string;
  label: string;
  minWidth?: number;
  width?: number;
  tag?: boolean;
  fixed?: 'left' | 'right';
};

type FieldItem = {
  label: string;
  model: string;
  placeholder?: string;
  type?: 'input' | 'textarea' | 'select' | 'date';
  options?: string[];
};

type RowItem = Record<string, string | number>;

const props = defineProps<{
  title: string;
  subtitle: string;
  flowText: string;
  filters: FilterItem[];
  stats: Array<{ label: string; value: string | number; tone: Tone }>;
  rows: RowItem[];
  columns: ColumnItem[];
  primaryAction: string;
  primaryDialogTitle: string;
  primaryFields: FieldItem[];
  reviewAction: string;
  reviewDialogTitle: string;
  reviewFields: FieldItem[];
  traceTitle: string;
  traceRows: RowItem[];
  traceColumns: ColumnItem[];
  closureTables: string;
  closureText: string;
}>();

const selectedRow = ref<RowItem>(props.rows[0] ?? {});
const primaryVisible = ref(false);
const reviewVisible = ref(false);
const traceVisible = ref(false);
const primaryForm = reactive<Record<string, string>>({});
const reviewForm = reactive<Record<string, string>>({});
const primaryKey = computed(() => props.columns[0]?.prop ?? 'name');

function tagType(value: string | number | undefined) {
  const text = String(value ?? '');
  if (['启用', '正常', '已完成', '已关闭', '已发布', '成功', '达标', '通过', '在线', '可用'].some((item) => text.includes(item))) return 'success';
  if (['异常', '高', '一级', '失败', '超时', '禁用', '故障', '危急'].some((item) => text.includes(item))) return 'danger';
  if (['待', '草稿', '处理中', '复核', '关注', '预警'].some((item) => text.includes(item))) return 'warning';
  return 'info';
}

function selectRow(row: RowItem): void {
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
            <el-button type="primary" :icon="DocumentAdd" @click="primaryVisible = true">{{ primaryAction }}</el-button>
            <el-button :icon="Operation" @click="reviewVisible = true">{{ reviewAction }}</el-button>
            <el-button :icon="SwitchButton" @click="reviewVisible = true">提交复核</el-button>
            <el-button :icon="Connection" @click="traceVisible = true">追溯</el-button>
          </div>
        </div>
      </template>

      <el-form class="report-filter" inline>
        <el-form-item v-for="item in filters" :key="item.label" :label="item.label">
          <el-date-picker v-if="item.type === 'date'" type="date" :placeholder="item.placeholder" />
          <el-date-picker v-else-if="item.type === 'month'" type="month" :placeholder="item.placeholder" />
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
                <strong>业务列表</strong>
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
                  <el-button link type="primary" @click.stop="selectRow(row); primaryVisible = true">维护</el-button>
                  <el-button link @click.stop="selectRow(row); reviewVisible = true">处理</el-button>
                  <el-button link @click.stop="selectRow(row); reviewVisible = true">复核</el-button>
                  <el-button link @click.stop="selectRow(row); traceVisible = true">追溯</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :xs="24" :xl="8">
          <el-card class="report-side-card" shadow="never">
            <template #header>
              <div class="report-card-header">
                <strong>当前业务对象</strong>
                <el-tag :type="tagType(selectedRow.status)">{{ selectedRow.status }}</el-tag>
              </div>
            </template>
            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="对象">{{ selectedRow[primaryKey] }}</el-descriptions-item>
              <el-descriptions-item label="状态">{{ selectedRow.status }}</el-descriptions-item>
              <el-descriptions-item label="责任人">{{ selectedRow.owner }}</el-descriptions-item>
              <el-descriptions-item label="时间">{{ selectedRow.time }}</el-descriptions-item>
              <el-descriptions-item label="下一步">{{ selectedRow.nextAction }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-dialog v-model="primaryVisible" :title="primaryDialogTitle" width="720px">
      <el-form :model="primaryForm" label-width="112px">
        <el-form-item v-for="field in primaryFields" :key="field.model" :label="field.label">
          <el-date-picker v-if="field.type === 'date'" v-model="primaryForm[field.model]" type="date" :placeholder="field.placeholder" />
          <el-select v-else-if="field.type === 'select'" v-model="primaryForm[field.model]" :placeholder="field.placeholder" clearable>
            <el-option v-for="option in field.options" :key="option" :label="option" :value="option" />
          </el-select>
          <el-input v-else-if="field.type === 'textarea'" v-model="primaryForm[field.model]" type="textarea" :rows="3" :placeholder="field.placeholder" />
          <el-input v-else v-model="primaryForm[field.model]" :placeholder="field.placeholder" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="primaryVisible = false">取消</el-button>
        <el-button type="primary" @click="submit('业务表单已保存，并写入待复核记录', () => primaryVisible = false)">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="reviewVisible" :title="reviewDialogTitle" width="680px">
      <el-form :model="reviewForm" label-width="112px">
        <el-form-item v-for="field in reviewFields" :key="field.model" :label="field.label">
          <el-date-picker v-if="field.type === 'date'" v-model="reviewForm[field.model]" type="date" :placeholder="field.placeholder" />
          <el-select v-else-if="field.type === 'select'" v-model="reviewForm[field.model]" :placeholder="field.placeholder" clearable>
            <el-option v-for="option in field.options" :key="option" :label="option" :value="option" />
          </el-select>
          <el-input v-else-if="field.type === 'textarea'" v-model="reviewForm[field.model]" type="textarea" :rows="3" :placeholder="field.placeholder" />
          <el-input v-else v-model="reviewForm[field.model]" :placeholder="field.placeholder" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reviewVisible = false">取消</el-button>
        <el-button type="primary" @click="submit('处理结果已提交，审计日志已记录', () => reviewVisible = false)">确认处理</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="traceVisible" :title="traceTitle" size="760px">
      <el-table :data="traceRows" border stripe>
        <el-table-column
          v-for="column in traceColumns"
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
