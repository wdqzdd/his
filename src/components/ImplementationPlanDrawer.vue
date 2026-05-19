<script setup lang="ts">
import { computed } from 'vue';
import { Connection, DocumentChecked, Files, Operation, Warning } from '@element-plus/icons-vue';
import type { PageContext } from '../types';
import { getImplementationPlan } from '../data/implementationPlans';

const props = defineProps<{
  modelValue: boolean;
  context: PageContext;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

const plan = computed(() => getImplementationPlan(props.context));
</script>

<template>
  <el-drawer v-model="visible" size="720px" class="implementation-drawer" append-to-body>
    <template #header>
      <div class="implementation-drawer-header">
        <div>
          <span>功能块开发落地文档</span>
          <strong>{{ plan.title }}</strong>
        </div>
        <el-tag type="primary" effect="plain">{{ plan.doc }}</el-tag>
      </div>
    </template>

    <section class="implementation-plan">
      <el-alert type="info" :closable="false" show-icon>
        <template #title>
          当前页：{{ context.workspace }} / {{ context.menuTitle }}。主页面保持业务操作优先，当前抽屉用于核对开发方案中的接口、表、状态和验收点。
        </template>
      </el-alert>

      <el-card class="implementation-section" shadow="never">
        <template #header>
          <div class="implementation-section-title">
            <el-icon><DocumentChecked /></el-icon>
            <strong>业务定位</strong>
          </div>
        </template>
        <p class="implementation-positioning">{{ plan.positioning }}</p>
        <div class="implementation-rule-list">
          <el-tag v-for="rule in plan.rules" :key="rule" type="warning" effect="plain">{{ rule }}</el-tag>
        </div>
      </el-card>

      <el-row :gutter="12">
        <el-col :span="12">
          <el-card class="implementation-section" shadow="never">
            <template #header>
              <div class="implementation-section-title">
                <el-icon><Operation /></el-icon>
                <strong>界面功能交互</strong>
              </div>
            </template>
            <ul class="implementation-list">
              <li v-for="item in plan.interactions" :key="item">{{ item }}</li>
            </ul>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="implementation-section" shadow="never">
            <template #header>
              <div class="implementation-section-title">
                <el-icon><Warning /></el-icon>
                <strong>状态设计</strong>
              </div>
            </template>
            <div class="implementation-state-list">
              <div v-for="state in plan.states" :key="state.name" class="implementation-state-row">
                <strong>{{ state.name }}</strong>
                <div>
                  <el-tag v-for="value in state.values" :key="value" size="small" effect="plain">{{ value }}</el-tag>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-card class="implementation-section" shadow="never">
        <template #header>
          <div class="implementation-section-title">
            <el-icon><Connection /></el-icon>
            <strong>后端接口</strong>
          </div>
        </template>
        <el-table :data="plan.apis" border stripe size="small">
          <el-table-column prop="method" label="方法" width="92" />
          <el-table-column prop="path" label="路径" min-width="240" />
          <el-table-column prop="desc" label="说明" min-width="160" />
        </el-table>
      </el-card>

      <el-card class="implementation-section" shadow="never">
        <template #header>
          <div class="implementation-section-title">
            <el-icon><Files /></el-icon>
            <strong>验收用例</strong>
          </div>
        </template>
        <el-check-tag v-for="item in plan.acceptance" :key="item" class="implementation-check" checked>
          {{ item }}
        </el-check-tag>
      </el-card>
    </section>
  </el-drawer>
</template>
