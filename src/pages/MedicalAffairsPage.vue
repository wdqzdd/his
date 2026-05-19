<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  CircleCheck,
  DocumentChecked,
  EditPen,
  OfficeBuilding,
  Operation,
  Search,
  UserFilled,
  Warning,
} from '@element-plus/icons-vue';
import type { PageContext } from '../types';

const props = defineProps<{
  context: PageContext;
}>();

const editDrawerVisible = ref(false);
const assignDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const selectedRow = ref<Record<string, string> | null>(null);

const tableMap = {
  'medical-duty': ['staff_profile', 'duty_schedule', 'sys_work_identity'],
  'medical-nurse-group': ['nursing_group', 'care_team_member', 'bed_station'],
  'medical-resource': ['bed_station', 'bed_zone', 'device_archive', 'device_alert'],
  'medical-team': ['care_team', 'care_team_member', 'staff_profile'],
  'medical-dynamic': ['patient_contract', 'patient_assignment', 'staff_profile'],
  'medical-assignment': ['patient_assignment', 'assignment_change_log', 'workflow_task'],
} as Record<string, string[]>;

const dutyRows = [
  { date: '2026-05-10', shift: '上午班', object: '医疗值班', owner: '张明', scope: 'A/B区治疗审核', status: '已发布', next: '交班确认' },
  { date: '2026-05-10', shift: '上午班', object: '护理值班', owner: '周敏', scope: 'A区护理组', status: '已发布', next: '班前核对' },
  { date: '2026-05-10', shift: '全日', object: '设备值班', owner: '许工', scope: '水处理与设备巡检', status: '待确认', next: '确认值班' },
];

const groupRows = [
  { object: 'A区一组', owner: '周敏', scope: 'A01-A16', members: '8人', patients: '72人', status: '启用', next: '进入排班' },
  { object: 'B区二组', owner: '赵玲', scope: 'B01-B14', members: '7人', patients: '61人', status: '启用', next: '进入排班' },
  { object: '隔离组', owner: '孙涛', scope: 'I01-I08', members: '5人', patients: '18人', status: '复核中', next: '复核后启用' },
];

const resourceRows = [
  { object: '普通治疗区A', owner: '设备组', scope: '16机位', members: '15可用', patients: 'HD-08待维修', status: '部分受限', next: '调整排班' },
  { object: '乙肝隔离区', owner: '感染管理', scope: '8机位', members: '8可用', patients: '正常', status: '可用', next: '隔离排班' },
  { object: '急诊备用区', owner: '医务科', scope: '4机位', members: '3可用', patients: '1台维护到期', status: '待复核', next: '设备复核' },
];

const teamRows = [
  { object: '血透长期随访团队', owner: '王主任', scope: '维持性血液透析', members: '12人', patients: '326人', status: '启用', next: '签约分配' },
  { object: '血管通路团队', owner: '李教授', scope: '内瘘/导管/人工血管', members: '8人', patients: '98人', status: '启用', next: '通路评估' },
  { object: 'GCP肾病研究团队', owner: '陈教授', scope: '药物临床研究', members: '9人', patients: '12人', status: '受控', next: 'CRC协同' },
];

const dynamicRows = [
  { object: '签约患者', owner: '导诊台', scope: '本月', members: '+4', patients: '326', status: '增长', next: '归属复核' },
  { object: '在管患者', owner: '医务医事站', scope: '当前', members: '+2', patients: '312', status: '稳定', next: '分工平衡' },
  { object: '退出患者', owner: '导诊台', scope: '本月', members: '+1', patients: '3', status: '待归档', next: '退出原因归档' },
];

const assignmentRows = [
  { object: '王建国', owner: '张明', scope: '周敏 / A区一组', members: 'A08', patients: '长期透析', status: '有效', next: '进入排班' },
  { object: '李秀兰', owner: '陈宁', scope: '赵玲 / B区二组', members: 'B12', patients: '导管患者', status: '待调整', next: '责任护士变更' },
  { object: '赵明', owner: '张明', scope: '孙涛 / 隔离组', members: 'I03', patients: '乙肝隔离', status: '有效', next: '隔离排班' },
];

const mode = computed(() => {
  if (props.context.menuKey === 'medical-nurse-group') return 'group';
  if (props.context.menuKey === 'medical-resource') return 'resource';
  if (props.context.menuKey === 'medical-team') return 'team';
  if (props.context.menuKey === 'medical-dynamic') return 'dynamic';
  if (props.context.menuKey === 'medical-assignment') return 'assignment';
  return 'duty';
});

const rows = computed(() => {
  if (mode.value === 'group') return groupRows;
  if (mode.value === 'resource') return resourceRows;
  if (mode.value === 'team') return teamRows;
  if (mode.value === 'dynamic') return dynamicRows;
  if (mode.value === 'assignment') return assignmentRows;
  return dutyRows;
});

const activeTables = computed(() => tableMap[props.context.menuKey] ?? tableMap['medical-duty']);

function openEdit(row?: Record<string, string>): void {
  selectedRow.value = row ?? null;
  editDrawerVisible.value = true;
}

function openAssign(row: Record<string, string>): void {
  selectedRow.value = row;
  assignDialogVisible.value = true;
}

function openTrace(row: Record<string, string>): void {
  selectedRow.value = row;
  traceDrawerVisible.value = true;
}
</script>

<template>
  <section class="medical-affairs-page">
    <el-card class="medical-work-card" shadow="never">
      <template #header>
        <div class="medical-work-header">
          <div>
            <h2>{{ context.menuTitle }}</h2>
            <p>维护值班、护理组、机位、专家团队和分管关系，输出给导诊归属、排班排床和员工主页。</p>
          </div>
          <div class="medical-actions">
            <el-button type="primary" :icon="UserFilled" @click="openEdit()">新增</el-button>
            <el-button :icon="Operation">批量调整</el-button>
            <el-button :icon="CircleCheck">发布</el-button>
            <el-button :icon="DocumentChecked">变更追溯</el-button>
          </div>
        </div>
      </template>

      <el-form class="medical-filter" inline>
        <el-form-item label="日期">
          <el-date-picker type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="范围">
          <el-select placeholder="全部范围" clearable>
            <el-option label="血液净化中心" value="hd" />
            <el-option label="A区" value="a" />
            <el-option label="隔离区" value="iso" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select placeholder="全部状态" clearable>
            <el-option label="启用" value="enabled" />
            <el-option label="待确认" value="pending" />
            <el-option label="部分受限" value="limited" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="rows" border stripe>
        <el-table-column v-if="mode === 'duty'" prop="date" label="日期" width="120" />
        <el-table-column v-if="mode === 'duty'" prop="shift" label="班次" width="100" />
        <el-table-column prop="object" :label="mode === 'assignment' ? '患者/对象' : '资源对象'" min-width="160" />
        <el-table-column prop="owner" label="负责人" width="120" />
        <el-table-column prop="scope" label="范围/分工" min-width="170" />
        <el-table-column prop="members" label="成员/机位" width="120" />
        <el-table-column prop="patients" label="患者/影响" width="130" />
        <el-table-column prop="status" label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="row.status === '启用' || row.status === '有效' || row.status === '可用' ? 'success' : row.status === '部分受限' || row.status === '待调整' ? 'warning' : 'info'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="next" label="下一步" min-width="140" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link @click="openAssign(row)">调整</el-button>
            <el-button link @click="openTrace(row)">追溯</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-drawer v-model="editDrawerVisible" title="维护科室资源" size="560px">
      <el-form label-width="100px">
        <el-form-item label="资源名称">
          <el-input :model-value="selectedRow?.object" placeholder="请输入资源名称" />
        </el-form-item>
        <el-form-item label="负责人">
          <el-input :model-value="selectedRow?.owner" placeholder="请选择负责人" />
        </el-form-item>
        <el-form-item label="范围">
          <el-input :model-value="selectedRow?.scope" placeholder="请输入负责范围" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group :model-value="selectedRow?.status || '启用'">
            <el-radio-button label="启用" />
            <el-radio-button label="待确认" />
            <el-radio-button label="停用" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="说明">
          <el-input type="textarea" :rows="3" placeholder="记录资源调整原因和影响范围" />
        </el-form-item>
      </el-form>
      <div class="drawer-actions">
        <el-button @click="editDrawerVisible = false">取消</el-button>
        <el-button type="primary" :icon="EditPen" @click="editDrawerVisible = false">保存</el-button>
      </div>
    </el-drawer>

    <el-dialog v-model="assignDialogVisible" title="调整分工/资源" width="560px">
      <el-descriptions v-if="selectedRow" :column="1" border>
        <el-descriptions-item label="对象">{{ selectedRow.object }}</el-descriptions-item>
        <el-descriptions-item label="当前负责人">{{ selectedRow.owner }}</el-descriptions-item>
        <el-descriptions-item label="当前范围">{{ selectedRow.scope }}</el-descriptions-item>
      </el-descriptions>
      <el-form class="dialog-form" label-width="100px">
        <el-form-item label="调整后负责人">
          <el-select placeholder="选择人员">
            <el-option label="张明" value="zhang" />
            <el-option label="周敏" value="zhou" />
            <el-option label="赵玲" value="zhao" />
          </el-select>
        </el-form-item>
        <el-form-item label="调整原因">
          <el-input type="textarea" :rows="3" placeholder="记录调整原因，保存后写入 assignment_change_log" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="assignDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="assignDialogVisible = false">确认调整</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="资源变更追溯" size="520px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-10 09:20" type="warning">调整责任护士，等待复核</el-timeline-item>
        <el-timeline-item timestamp="2026-05-08 16:40" type="primary">机位范围从 B10 调整到 B12</el-timeline-item>
        <el-timeline-item timestamp="2026-05-01 08:00" type="success">资源关系发布生效</el-timeline-item>
      </el-timeline>
      <div class="medical-risk-line safe">
        <el-icon><OfficeBuilding /></el-icon>
        <span>资源变更会影响导诊归属、排班排床、员工主页待办和工作量统计。</span>
      </div>
    </el-drawer>
  </section>
</template>
