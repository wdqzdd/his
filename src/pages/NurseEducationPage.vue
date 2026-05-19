<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, DocumentAdd, Search, Share } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{
  context: PageContext;
}>();

type EducationRow = {
  id: string;
  patient: string;
  educationType: string;
  topic: string;
  mode: string;
  understanding: string;
  planTime: string;
  owner: string;
  status: string;
  nextAction: string;
};

const selectedId = ref('EDU-001');
const educationDialogVisible = ref(false);
const confirmDialogVisible = ref(false);
const planDialogVisible = ref(false);
const traceDrawerVisible = ref(false);

const rows: EducationRow[] = [
  { id: 'EDU-001', patient: '王建国', educationType: '健康指导', topic: '低钾饮食', mode: '床旁宣教', understanding: '已掌握', planTime: '2026-05-10 08:30', owner: '张护士', status: '待随访', nextAction: '安排下次复查' },
  { id: 'EDU-002', patient: '李秀英', educationType: '通路护理教育', topic: '通路护理', mode: '电话随访', understanding: '部分掌握', planTime: '2026-05-10 09:00', owner: '钱护士', status: '待确认', nextAction: '补充解释' },
  { id: 'EDU-003', patient: '赵明', educationType: '随访记录', topic: '透后体重管理', mode: '居家端', understanding: '已掌握', planTime: '2026-05-10 09:30', owner: '刘护士', status: '已完成', nextAction: '观察体重' },
  { id: 'EDU-004', patient: '陈志强', educationType: '通路护理教育', topic: '血管通路观察', mode: '床旁宣教', understanding: '未掌握', planTime: '2026-05-10 10:00', owner: '周护士', status: '待随访', nextAction: '追加宣教' },
  { id: 'EDU-005', patient: '周庆', educationType: '离院宣教', topic: '低血压处理', mode: '短视频', understanding: '已掌握', planTime: '2026-05-10 10:20', owner: '张护士', status: '已完成', nextAction: '持续提醒' },
  { id: 'EDU-006', patient: '何雪', educationType: '月度教育', topic: '钙磷控制', mode: '床旁宣教', understanding: '部分掌握', planTime: '2026-05-10 10:40', owner: '钱护士', status: '待确认', nextAction: '复核答题' },
  { id: 'EDU-007', patient: '孙海', educationType: '健康指导', topic: '抗凝药注意事项', mode: '电话随访', understanding: '已掌握', planTime: '2026-05-10 11:00', owner: '刘护士', status: '待随访', nextAction: '一周后复查' },
  { id: 'EDU-008', patient: '马丽', educationType: '新患者教育', topic: '隔离透析宣教', mode: '床旁宣教', understanding: '已掌握', planTime: '2026-05-10 11:20', owner: '感染护士', status: '已完成', nextAction: '隔离提醒' },
  { id: 'EDU-009', patient: '郭强', educationType: '月度教育', topic: '营养补充', mode: '居家端', understanding: '部分掌握', planTime: '2026-05-10 11:40', owner: '周护士', status: '待确认', nextAction: '居家端回访' },
  { id: 'EDU-010', patient: '陈敏', educationType: '随访任务', topic: '复诊预约', mode: '电话随访', understanding: '已掌握', planTime: '2026-05-10 12:00', owner: '张护士', status: '待随访', nextAction: '预约门诊' },
];

const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['education_record', 'follow_up_plan', 'follow_up_record', 'patient_feedback', 'education_signature'];

const metrics = computed(() => [
  { label: '宣教总数', value: rows.length, tone: 'blue' },
  { label: '待随访', value: rows.filter((item) => item.status === '待随访').length, tone: 'orange' },
  { label: '待确认', value: rows.filter((item) => item.status === '待确认').length, tone: 'orange' },
  { label: '已完成', value: rows.filter((item) => item.status === '已完成').length, tone: 'green' },
  { label: '未掌握', value: rows.filter((item) => item.understanding === '未掌握').length, tone: 'red' },
]);

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value === '已完成' || value === '已掌握') return 'success';
  if (value === '待随访' || value === '待确认' || value === '部分掌握') return 'warning';
  if (value === '未掌握') return 'danger';
  return 'info';
}

function selectRow(row: EducationRow): void {
  selectedId.value = row.id;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}

function openEducation(row?: EducationRow): void {
  selectedId.value = row?.id ?? rows[0].id;
  educationDialogVisible.value = true;
}

function openConfirm(row: EducationRow): void {
  selectedId.value = row.id;
  confirmDialogVisible.value = true;
}

function openPlan(row: EducationRow): void {
  selectedId.value = row.id;
  planDialogVisible.value = true;
}
</script>

<template>
  <section class="nurse-execution-page">
    <el-card class="nurse-work-card" shadow="never">
      <template #header>
        <div class="nurse-header">
          <div>
            <h2>{{ context.menuTitle }}</h2>
            <p>记录宣教主题、患者掌握情况和随访计划，并同步到居家端和护士工作日志。</p>
          </div>
          <div class="nurse-actions">
            <el-button type="primary" :icon="DocumentAdd" @click="openEducation()">新增宣教</el-button>
            <el-button :icon="CircleCheck" @click="openConfirm(rows[0])">确认掌握</el-button>
            <el-button :icon="Share" @click="openPlan(rows[1])">生成随访</el-button>
          </div>
        </div>
      </template>

      <el-form class="nurse-filter" inline>
        <el-form-item label="关键字">
          <el-input placeholder="患者、主题、方式、责任人" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select placeholder="全部状态" clearable>
            <el-option label="待随访" value="待随访" />
            <el-option label="待确认" value="待确认" />
            <el-option label="已完成" value="已完成" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类">
          <el-select placeholder="全部分类" clearable>
            <el-option label="随访任务" value="随访任务" />
            <el-option label="随访记录" value="随访记录" />
            <el-option label="健康指导" value="健康指导" />
            <el-option label="离院宣教" value="离院宣教" />
            <el-option label="通路护理教育" value="通路护理教育" />
            <el-option label="新患者教育" value="新患者教育" />
            <el-option label="月度教育" value="月度教育" />
          </el-select>
        </el-form-item>
        <el-form-item label="掌握情况">
          <el-select placeholder="全部" clearable>
            <el-option label="已掌握" value="已掌握" />
            <el-option label="部分掌握" value="部分掌握" />
            <el-option label="未掌握" value="未掌握" />
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
        <el-table-column prop="educationType" label="分类" width="115" />
        <el-table-column prop="topic" label="宣教主题" min-width="150" />
        <el-table-column prop="mode" label="方式" width="100" />
        <el-table-column prop="understanding" label="掌握情况" width="100">
          <template #default="{ row }"><el-tag :type="tagType(row.understanding)" effect="plain">{{ row.understanding }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="planTime" label="计划时间" width="150" />
        <el-table-column prop="owner" label="责任人" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="nextAction" label="下一步" min-width="130" />
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click.stop="openEducation(row)">编辑</el-button>
            <el-button link @click.stop="openConfirm(row)">确认</el-button>
            <el-button link type="danger" @click.stop="openPlan(row)">随访</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="educationDialogVisible" title="随访与宣教" width="640px">
      <el-form label-width="100px">
        <el-form-item label="患者"><el-input :model-value="currentRow.patient" disabled /></el-form-item>
        <el-form-item label="宣教主题"><el-input :model-value="currentRow.topic" /></el-form-item>
        <el-form-item label="分类">
          <el-select :model-value="currentRow.educationType">
            <el-option label="随访任务" value="随访任务" />
            <el-option label="随访记录" value="随访记录" />
            <el-option label="健康指导" value="健康指导" />
            <el-option label="离院宣教" value="离院宣教" />
            <el-option label="通路护理教育" value="通路护理教育" />
            <el-option label="新患者教育" value="新患者教育" />
            <el-option label="月度教育" value="月度教育" />
          </el-select>
        </el-form-item>
        <el-form-item label="方式">
          <el-select placeholder="请选择">
            <el-option label="床旁宣教" value="bedside" />
            <el-option label="电话随访" value="phone" />
            <el-option label="居家端" value="home" />
            <el-option label="短视频" value="video" />
          </el-select>
        </el-form-item>
        <el-form-item label="宣教内容"><el-input type="textarea" :rows="3" placeholder="记录要点、交待事项和患者反馈" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="educationDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="educationDialogVisible = false; submitAction('宣教记录已保存')">保存宣教</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="confirmDialogVisible" title="确认掌握" width="560px">
      <el-form label-width="100px">
        <el-form-item label="患者"><el-input :model-value="currentRow.patient" disabled /></el-form-item>
        <el-form-item label="确认结果">
          <el-radio-group model-value="pass">
            <el-radio-button label="pass">已掌握</el-radio-button>
            <el-radio-button label="partial">部分掌握</el-radio-button>
            <el-radio-button label="fail">未掌握</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="说明"><el-input type="textarea" :rows="3" placeholder="记录患者答复、未掌握点和补充说明" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="confirmDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmDialogVisible = false; submitAction('宣教掌握情况已确认')">确认结果</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="planDialogVisible" title="生成随访计划" width="620px">
      <el-form label-width="100px">
        <el-form-item label="患者"><el-input :model-value="currentRow.patient" disabled /></el-form-item>
        <el-form-item label="随访时间"><el-date-picker type="datetime" placeholder="选择随访时间" /></el-form-item>
        <el-form-item label="随访方式">
          <el-radio-group model-value="phone">
            <el-radio-button label="phone">电话</el-radio-button>
            <el-radio-button label="home">居家端</el-radio-button>
            <el-radio-button label="clinic">门诊</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="随访内容"><el-input type="textarea" :rows="3" placeholder="记录回访重点、观察指标和再教育内容" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="planDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="planDialogVisible = false; submitAction('随访计划已生成')">保存计划</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="宣教追溯" size="520px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-10 08:30" type="primary">完成宣教：{{ currentRow.topic }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 08:40">记录掌握情况并生成随访计划</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 09:00" type="success">同步到居家端和护士工作日志</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
