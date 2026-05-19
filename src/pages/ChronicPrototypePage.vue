<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Bell, Connection, DocumentChecked, Files, Link, Operation, Search, Warning } from '@element-plus/icons-vue';
import type { PageContext } from '../types';
import type { ChronicTableRow } from '../data/chronicPrototypePages';
import type { BusinessOperationDialogSpec } from '../data/businessOperationDialogs';
import BusinessOperationDialog from '../components/BusinessOperationDialog.vue';
import { resolveBusinessOperationDialog } from '../data/businessOperationDialogs';
import { getChronicPrototypePage } from '../data/chronicPrototypePages';

const props = defineProps<{
  context: PageContext;
}>();

const router = useRouter();
const selectedRowId = ref('');
const operationDialogVisible = ref(false);
const localStatus = ref<Record<string, string>>({});
const dialogSpec = ref<BusinessOperationDialogSpec | null>(null);

const page = computed(() => getChronicPrototypePage(props.context));
const hydratedRows = computed<ChronicTableRow[]>(() =>
  page.value.rows.map((row) => ({
    ...row,
    status: localStatus.value[row.id] ?? row.status,
  })),
);
const selectedRow = computed(() => hydratedRows.value.find((item) => item.id === selectedRowId.value) ?? hydratedRows.value[0]);

function tagType(status: string): 'primary' | 'success' | 'warning' | 'danger' | 'info' {
  if (status.includes('高') || status.includes('危') || status.includes('异常') || status.includes('逾期') || status.includes('冲突')) return 'danger';
  if (status.includes('待') || status.includes('草稿') || status.includes('分派')) return 'warning';
  if (status.includes('已') || status.includes('启用') || status.includes('在管')) return 'success';
  return 'primary';
}

function openRow(row: ChronicTableRow | string): void {
  selectedRowId.value = typeof row === 'string' ? row : row.id;
}

function openOperation(operationKey: string, row?: ChronicTableRow): void {
  if (row) openRow(row);
  dialogSpec.value = resolveBusinessOperationDialog({
    context: props.context,
    page: page.value,
    row: selectedRow.value,
    operationKey,
  });
  operationDialogVisible.value = true;
}

function applyRowOperation(operationKey: string, row: ChronicTableRow): void {
  openRow(row);
  openOperation(operationKey, row);
}

function submitOperation(payload: { spec: BusinessOperationDialogSpec; form: Record<string, string> }): void {
  if (payload.spec.mode !== 'trace') {
    localStatus.value = {
      ...localStatus.value,
      [selectedRow.value.id]: payload.spec.targetStatus,
    };
  }
  operationDialogVisible.value = false;
  ElMessage.success(`${payload.spec.title}已提交，已回写状态、任务和审计轨迹。`);
}

function goQuickLink(workspace: string, menuKey: string): void {
  router.push(`/workspace/${encodeURIComponent(workspace)}/${menuKey}`);
}
</script>

<template>
  <section class="chronic-page">
    <el-card class="chronic-hero-card" shadow="never">
      <div class="chronic-hero-main">
        <div>
          <span class="chronic-kicker">慢病居家住院式管理</span>
          <h2>{{ page.title }}</h2>
          <p>{{ page.subtitle }}</p>
          <div class="chronic-source-line">
            <el-tag v-for="item in page.sourceDocs" :key="item" effect="plain">{{ item }}</el-tag>
          </div>
        </div>
        <el-descriptions :column="1" size="small" border class="chronic-context-desc">
          <el-descriptions-item label="当前对象">{{ page.activeObject }}</el-descriptions-item>
          <el-descriptions-item label="身份">{{ context.role }}</el-descriptions-item>
          <el-descriptions-item label="范围">{{ context.department }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>

    <el-card class="chronic-filter-card" shadow="never">
      <el-form class="filter-form chronic-page-filter" inline>
        <el-form-item v-for="filter in page.filters" :key="filter" :label="filter">
          <el-input v-if="filter.includes('姓名') || filter.includes('患者') || filter.includes('账号')" :prefix-icon="Search" placeholder="输入关键词" clearable />
          <el-select v-else placeholder="全部" clearable>
            <el-option label="全部" value="all" />
            <el-option label="待处理" value="pending" />
            <el-option label="已闭环" value="done" />
            <el-option label="高风险" value="risk" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
      <div class="chronic-action-bar">
          <el-button
            v-for="(flow, index) in page.primaryFlow"
            :key="flow.key"
            :type="index === 0 ? 'primary' : undefined"
            plain
            @click="openOperation(flow.key)"
          >
            {{ flow.actionText }}
          </el-button>
        </div>
      </el-card>

    <div class="chronic-stat-grid">
      <el-card v-for="item in page.metrics" :key="item.label" :class="['metric-card', item.tone]" shadow="never">
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
        <p>{{ item.hint }}</p>
      </el-card>
    </div>

    <el-row :gutter="16" class="chronic-main-row">
      <el-col :xs="24" :xl="17">
        <el-card class="page-card" shadow="never">
          <template #header>
            <div class="page-card-header">
              <div>
                <strong>{{ page.title }}列表</strong>
                <p>当前列表直接承载慢病功能文档要求的业务对象、状态、责任人、时间、下一步和追溯入口。</p>
              </div>
              <el-tag type="primary" effect="plain">{{ page.rows.length }} 条样例数据</el-tag>
            </div>
          </template>

          <el-table :data="hydratedRows" border stripe highlight-current-row @row-click="openRow">
            <el-table-column v-for="column in page.columns" :key="column.prop" v-bind="column">
              <template v-if="column.prop === 'status'" #default="{ row }">
                <el-tag :type="tagType(row.status)" effect="plain">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="闭环操作" width="210" fixed="right">
              <template #default="{ row }">
                <el-button
                  v-for="operation in page.rowOperations"
                  :key="operation.key"
                  link
                  :type="operation.type"
                  @click.stop="applyRowOperation(operation.key, row)"
                >
                  {{ operation.label }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <el-card class="page-card" shadow="never">
          <template #header>
            <div class="page-card-header">
              <div>
                <strong>功能办理区</strong>
                <p>把功能文档中的主动作画入页面：新建/提交、审核/核对、执行/处理、归档/关闭。</p>
              </div>
            </div>
          </template>
          <div class="chronic-workbench-grid">
            <div v-for="flow in page.primaryFlow" :key="flow.key" class="chronic-workbench-section">
              <div class="chronic-section-title">
                <el-icon><Operation /></el-icon>
                <strong>{{ flow.label }}</strong>
              </div>
              <p>{{ flow.desc }}</p>
              <el-button type="primary" plain @click="openOperation(flow.key)">
                {{ flow.actionText }}
              </el-button>
            </div>
          </div>
        </el-card>

        <el-card class="page-card" shadow="never">
          <template #header>
            <div class="page-card-header">
              <div>
                <strong>跨页面办理入口</strong>
                <p>真实场景里当前页面处理后会进入医生、护士、患者端、规则或报表页面。</p>
              </div>
            </div>
          </template>
          <div class="chronic-link-grid">
            <button v-for="link in page.quickLinks" :key="`${link.workspace}-${link.menuKey}`" type="button" @click="goQuickLink(link.workspace, link.menuKey)">
              <strong>{{ link.label }}</strong>
              <span>{{ link.workspace }}</span>
              <p>{{ link.desc }}</p>
            </button>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :xl="7">
        <el-card class="side-insight-card" shadow="never">
          <template #header>
            <div class="chronic-section-title">
              <el-icon><Files /></el-icon>
              <strong>当前详情</strong>
            </div>
          </template>
          <div class="chronic-current-object">
            <h3>{{ selectedRow.subject }}</h3>
            <el-tag :type="tagType(selectedRow.status)" effect="dark">{{ selectedRow.status }}</el-tag>
            <p>{{ selectedRow.disease }}</p>
          </div>
          <el-descriptions :column="1" size="small" border>
            <el-descriptions-item v-for="item in page.detailItems" :key="item.label" :label="item.label">
              {{ item.value }}
            </el-descriptions-item>
            <el-descriptions-item label="下一步">{{ selectedRow.nextAction }}</el-descriptions-item>
          </el-descriptions>
          <div class="chronic-detail-actions">
            <el-button type="primary" @click="openOperation(page.primaryFlow[0].key)">办理当前项</el-button>
            <el-button @click="applyRowOperation('trace', selectedRow)">查看追溯</el-button>
          </div>
        </el-card>

        <el-card class="side-insight-card" shadow="never">
          <template #header>
            <div class="chronic-section-title">
              <el-icon><Warning /></el-icon>
              <strong>风险与规则</strong>
            </div>
          </template>
          <div v-for="item in page.riskAlerts" :key="item" class="risk-block">
            <el-icon><Bell /></el-icon>
            <div>
              <strong>规则提示</strong>
              <p>{{ item }}</p>
            </div>
          </div>
        </el-card>

        <el-card class="side-insight-card" shadow="never">
          <template #header>
            <div class="chronic-section-title">
              <el-icon><Connection /></el-icon>
              <strong>闭环时间轴</strong>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item v-for="item in page.timeline" :key="item" timestamp="业务节点">
              {{ item }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </section>

  <BusinessOperationDialog
    v-if="dialogSpec"
    v-model="operationDialogVisible"
    :context="context"
    :page="page"
    :row="selectedRow"
    :spec="dialogSpec"
    @submit="submitOperation"
  />
</template>
