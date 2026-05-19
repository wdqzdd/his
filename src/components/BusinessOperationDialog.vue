<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Bell, Warning } from '@element-plus/icons-vue';
import type { PageContext } from '../types';
import type { BusinessOperationDialogSpec } from '../data/businessOperationDialogs';
import type { ChronicPrototypePageSpec, ChronicTableRow } from '../data/chronicPrototypePages';

const props = defineProps<{
  modelValue: boolean;
  context: PageContext;
  page: ChronicPrototypePageSpec;
  row: ChronicTableRow;
  spec: BusinessOperationDialogSpec;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  submit: [payload: { spec: BusinessOperationDialogSpec; form: Record<string, string> }];
}>();

const formModel = ref<Record<string, string>>({});

const visible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

const statusText = computed(() => (props.spec.mode === 'trace' ? props.row.status : `${props.row.status} -> ${props.spec.targetStatus}`));

function tagType(status: string): 'primary' | 'success' | 'warning' | 'danger' | 'info' {
  if (status.includes('高') || status.includes('危') || status.includes('异常') || status.includes('逾期') || status.includes('冲突')) return 'danger';
  if (status.includes('待') || status.includes('草稿') || status.includes('分派')) return 'warning';
  if (status.includes('已') || status.includes('启用') || status.includes('在管')) return 'success';
  return 'primary';
}

watch(
  () => [props.spec.operationKey, props.row.id],
  () => {
    formModel.value = {
      subject: props.row.subject ?? '',
      status: props.row.status ?? '',
      owner: props.row.owner ?? '',
      nextAction: props.row.nextAction ?? '',
    };
    for (const field of props.spec.fields) {
      formModel.value[field.prop] = formModel.value[field.prop] ?? '';
    }
  },
  { immediate: true },
);

function submit(): void {
  emit('submit', { spec: props.spec, form: formModel.value });
}
</script>

<template>
  <el-dialog v-model="visible" class="business-operation-dialog" width="1080px" append-to-body>
    <template #header>
      <div class="business-dialog-header">
        <div>
          <span>{{ page.title }}</span>
          <strong>{{ spec.title }}</strong>
          <p>{{ spec.description }}</p>
        </div>
        <el-tag :type="tagType(row.status)" effect="plain">{{ statusText }}</el-tag>
      </div>
    </template>

    <el-row :gutter="16">
      <el-col :xs="24" :lg="15">
        <el-card class="business-dialog-card" shadow="never">
          <template #header>
            <div class="business-dialog-card-title">
              <strong>当前业务对象</strong>
              <el-tag effect="plain">{{ context.role }}</el-tag>
            </div>
          </template>
          <el-descriptions :column="2" size="small" border>
            <el-descriptions-item v-for="column in page.columns.slice(0, 8)" :key="column.prop" :label="column.label">
              {{ row[column.prop] || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="下一步">{{ row.nextAction }}</el-descriptions-item>
            <el-descriptions-item label="办理范围">{{ context.department }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card class="business-dialog-card" shadow="never">
          <template #header>
            <div class="business-dialog-card-title">
              <strong>{{ spec.mode === 'trace' ? '追溯调阅' : spec.mode === 'review' ? '审核复核表单' : '业务办理表单' }}</strong>
              <span>{{ page.activeObject }}</span>
            </div>
          </template>

          <el-alert
            v-if="spec.mode === 'review'"
            type="warning"
            show-icon
            :closable="false"
            title="审核/复核必须填写结论、意见和签名方式；退回时要说明补充项。"
          />
          <el-alert
            v-else-if="spec.mode === 'trace'"
            type="info"
            show-icon
            :closable="false"
            title="追溯弹框用于查看状态变化、责任人、时间和审计原因。"
          />

          <el-form class="business-dialog-form" label-width="116px">
            <el-form-item v-for="field in spec.fields" :key="field.prop" :label="field.label">
              <el-input v-if="field.component === 'input'" v-model="formModel[field.prop]" :placeholder="field.placeholder" />
              <el-input
                v-else-if="field.component === 'textarea'"
                v-model="formModel[field.prop]"
                :placeholder="field.placeholder"
                type="textarea"
                :rows="4"
              />
              <el-date-picker v-else-if="field.component === 'date'" v-model="formModel[field.prop]" type="date" :placeholder="field.placeholder" />
              <el-select v-else v-model="formModel[field.prop]" :placeholder="field.placeholder">
                <el-option v-for="option in field.options ?? []" :key="option" :label="option" :value="option" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card v-if="spec.mode === 'trace'" class="business-dialog-card" shadow="never">
          <template #header>
            <div class="business-dialog-card-title">
              <strong>审计时间轴</strong>
              <el-tag type="primary" effect="plain">操作留痕</el-tag>
            </div>
          </template>
          <el-timeline class="business-audit-timeline">
            <el-timeline-item v-for="item in page.auditTrail" :key="item.title" :timestamp="item.time">
              <strong>{{ item.title }}</strong>
              <p>{{ item.desc }}</p>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="9">
        <el-card class="business-dialog-card" shadow="never">
          <template #header>
            <div class="business-dialog-card-title">
              <strong>风险提示</strong>
              <el-icon><Warning /></el-icon>
            </div>
          </template>
          <div class="business-risk-list">
            <div v-for="item in page.riskAlerts.slice(0, 4)" :key="item" class="business-risk-item">
              <el-icon><Bell /></el-icon>
              <p>{{ item }}</p>
            </div>
          </div>
        </el-card>

      </el-col>
    </el-row>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button v-if="spec.mode !== 'trace'">保存草稿</el-button>
      <el-button type="primary" @click="submit">{{ spec.submitText }}</el-button>
    </template>
  </el-dialog>
</template>
