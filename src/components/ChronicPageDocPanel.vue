<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Connection, DocumentChecked, Files, Operation } from '@element-plus/icons-vue';
import type { PageContext } from '../types';
import { getChronicPageDoc } from '../data/chronicPageDocs';

const props = defineProps<{
  context: PageContext;
}>();

const activeNames = ref<string[]>([]);
const doc = computed(() => getChronicPageDoc(props.context));
const sourcePath = '慢性病居家住院式管理系统/功能文档整理';

watch(
  () => `${props.context.workspace}:${props.context.menuKey}`,
  () => {
    activeNames.value = [];
  },
);
</script>

<template>
  <section class="chronic-doc-panel">
    <div class="chronic-doc-header">
      <div>
        <span>慢性病居家住院式管理系统</span>
        <strong>{{ doc.title }}</strong>
        <p>{{ doc.positioning }}</p>
      </div>
      <div class="chronic-doc-source">
        <el-tag v-for="item in doc.sourceDocs" :key="item" type="primary" effect="plain">
          {{ item }}
        </el-tag>
      </div>
    </div>

    <el-collapse v-model="activeNames" class="chronic-doc-collapse">
      <el-collapse-item name="page">
        <template #title>
          <div class="chronic-collapse-title">
            <el-icon><DocumentChecked /></el-icon>
            页面功能核对
            <small>{{ context.workspace }} / {{ context.menuTitle }}</small>
          </div>
        </template>
        <div class="chronic-doc-grid">
          <div class="chronic-doc-block">
            <div class="chronic-doc-block-title">
              <el-icon><Files /></el-icon>
              <strong>业务对象</strong>
            </div>
            <div class="chronic-tag-list">
              <el-tag v-for="item in doc.businessObjects" :key="item" effect="plain">{{ item }}</el-tag>
            </div>
          </div>

          <div class="chronic-doc-block">
            <div class="chronic-doc-block-title">
              <el-icon><Operation /></el-icon>
              <strong>页面动作</strong>
            </div>
            <ul>
              <li v-for="item in doc.coreActions" :key="item">{{ item }}</li>
            </ul>
          </div>

          <div class="chronic-doc-block">
            <div class="chronic-doc-block-title">
              <el-icon><Connection /></el-icon>
              <strong>关键字段</strong>
            </div>
            <div class="chronic-field-list">
              <code v-for="item in doc.keyFields" :key="item">{{ item }}</code>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </section>
</template>
