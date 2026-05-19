<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, Document, Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();

type LogRow = {
  id: string;
  subject: string;
  patient: string;
  content: string;
  source: string;
  status: string;
  owner: string;
  time: string;
  nextAction: string;
};

const selectedId = ref('PLOG-001');
const editDialogVisible = ref(false);
const confirmDialogVisible = ref(false);
const traceDrawerVisible = ref(false);

const rows: LogRow[] = [
  { id: 'PLOG-001', subject: '药师审核交接', patient: '王建国等12人', content: '上午班待审核医嘱 6 条，含 1 条高钾用药', source: '审核队列', status: '待确认', owner: '周药师', time: '2026-05-10 08:00', nextAction: '审核确认' },
  { id: 'PLOG-002', subject: '库存提醒', patient: '陈志强', content: '米多君低库存，已提醒库房补货', source: '库存预警', status: '处理中', owner: '陈药师', time: '2026-05-10 08:20', nextAction: '补货复核' },
  { id: 'PLOG-003', subject: '退回医嘱', patient: '郭强', content: '碳酸镧与钙剂重复风险，退回医生确认', source: '适宜性检查', status: '已记录', owner: '王药师', time: '2026-05-10 08:35', nextAction: '等待医生' },
  { id: 'PLOG-004', subject: 'GCP药物交接', patient: '潘德胜', content: '研究药物专柜锁定，需核对随机号', source: 'GCP台账', status: '待确认', owner: 'GCP药师', time: '2026-05-10 09:00', nextAction: '项目备案' },
  { id: 'PLOG-005', subject: '发药复核', patient: '李秀英', content: 'EPO 已四查十对，等待护士签收', source: '发药单', status: '处理中', owner: '周药师', time: '2026-05-10 09:20', nextAction: '护士签收' },
  { id: 'PLOG-006', subject: '退药登记', patient: '何雪', content: '铁剂因医嘱调整退回药房', source: '退药申请', status: '已记录', owner: '陈药师', time: '2026-05-10 09:40', nextAction: '库存回退' },
  { id: 'PLOG-007', subject: '禁忌提示', patient: '孙海', content: '过敏史缺失，暂停发药', source: '风险检查', status: '待确认', owner: '王药师', time: '2026-05-10 10:00', nextAction: '补全过敏史' },
  { id: 'PLOG-008', subject: '效期盘点', patient: '全量库存', content: '骨化三醇胶丸近效期 18 盒', source: '效期预警', status: '处理中', owner: '陈药师', time: '2026-05-10 10:20', nextAction: '优先使用' },
  { id: 'PLOG-009', subject: '药品交待', patient: '周庆', content: '司维拉姆随餐服用已交待', source: '用药交待', status: '已记录', owner: '周药师', time: '2026-05-10 10:40', nextAction: '归档' },
  { id: 'PLOG-010', subject: '班末总结', patient: '全量患者', content: '当班无严重发药差错，待签名归档', source: '班末总结', status: '待确认', owner: '周药师', time: '2026-05-10 11:00', nextAction: '签名确认' },
];

const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['pharmacy_work_log', 'pharmacy_audit_log', 'pharmacy_handover_record'];

const metrics = computed(() => [
  { label: '日志总数', value: rows.length, tone: 'blue' },
  { label: '待确认', value: rows.filter((item) => item.status === '待确认').length, tone: 'orange' },
  { label: '处理中', value: rows.filter((item) => item.status === '处理中').length, tone: 'orange' },
  { label: '已记录', value: rows.filter((item) => item.status === '已记录').length, tone: 'green' },
  { label: 'GCP相关', value: rows.filter((item) => item.source.includes('GCP')).length, tone: 'blue' },
]);

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value === '已记录') return 'success';
  if (value === '待确认' || value === '处理中') return 'warning';
  return 'info';
}

function selectRow(row: LogRow): void { selectedId.value = row.id; }
function submitAction(message: string): void { ElMessage.success(message); }
function openEdit(row?: LogRow): void { selectedId.value = row?.id ?? rows[0].id; editDialogVisible.value = true; }
function openConfirm(row: LogRow): void { selectedId.value = row.id; confirmDialogVisible.value = true; }
</script>

<template>
  <section class="pharmacy-page">
    <el-card class="pharmacy-work-card" shadow="never">
      <template #header>
        <div class="pharmacy-header">
          <div>
            <h2>{{ context.menuTitle }}</h2>
            <p>记录药师审核、发药、退药、库存预警和 GCP 药物交接，支持班次审计。</p>
          </div>
          <div class="pharmacy-actions">
            <el-button type="primary" :icon="Document" @click="openEdit()">新增日志</el-button>
            <el-button :icon="CircleCheck" @click="openConfirm(rows[0])">确认完成</el-button>
          </div>
        </div>
      </template>
      <el-form class="pharmacy-filter" inline>
        <el-form-item label="关键字"><el-input placeholder="主题、患者、来源、内容" clearable /></el-form-item>
        <el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="待确认" value="待确认" /><el-option label="处理中" value="处理中" /><el-option label="已记录" value="已记录" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>
      <div class="pharmacy-stat-grid">
        <el-card v-for="item in metrics" :key="item.label" :class="['pharmacy-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card>
      </div>
      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow">
        <el-table-column prop="id" label="日志号" width="110" fixed="left" />
        <el-table-column prop="subject" label="主题" width="130" />
        <el-table-column prop="patient" label="患者范围" width="120" />
        <el-table-column prop="content" label="内容" min-width="220" />
        <el-table-column prop="source" label="来源" width="110" />
        <el-table-column prop="status" label="状态" width="90"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="owner" label="责任药师" width="100" />
        <el-table-column prop="time" label="时间" width="150" />
        <el-table-column prop="nextAction" label="下一步" min-width="120" />
        <el-table-column label="操作" width="200" fixed="right"><template #default="{ row }"><el-button link type="primary" @click.stop="openEdit(row)">编辑</el-button><el-button link @click.stop="openConfirm(row)">确认</el-button><el-button link @click.stop="traceDrawerVisible = true">追溯</el-button></template></el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="editDialogVisible" title="药房工作日志" width="640px">
      <el-form label-width="100px">
        <el-form-item label="主题"><el-input :model-value="currentRow.subject" /></el-form-item>
        <el-form-item label="患者范围"><el-input :model-value="currentRow.patient" /></el-form-item>
        <el-form-item label="来源"><el-input :model-value="currentRow.source" /></el-form-item>
        <el-form-item label="内容"><el-input type="textarea" :rows="4" :model-value="currentRow.content" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="editDialogVisible = false">取消</el-button><el-button type="primary" @click="editDialogVisible = false; submitAction('药房日志已保存')">保存</el-button></template>
    </el-dialog>

    <el-dialog v-model="confirmDialogVisible" title="日志确认" width="560px">
      <el-form label-width="100px">
        <el-form-item label="日志号"><el-input :model-value="currentRow.id" disabled /></el-form-item>
        <el-form-item label="确认结果"><el-radio-group model-value="done"><el-radio-button label="done">完成</el-radio-button><el-radio-button label="follow">继续跟进</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="确认意见"><el-input type="textarea" :rows="3" placeholder="补充确认说明和后续安排" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="confirmDialogVisible = false">取消</el-button><el-button type="primary" @click="confirmDialogVisible = false; submitAction('药房日志已确认')">提交确认</el-button></template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="药房日志追溯" size="520px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-10 08:00" type="primary">创建日志：{{ currentRow.subject }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 08:30">补充交接说明和业务单据</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 09:00" type="success">药师签名确认并进入审计</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
