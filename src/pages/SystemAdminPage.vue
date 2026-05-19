<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  CircleCheck,
  DocumentChecked,
  EditPen,
  Lock,
  Operation,
  Search,
  User,
  Warning,
} from '@element-plus/icons-vue';
import type { PageContext } from '../types';

const props = defineProps<{
  context: PageContext;
}>();

const editDrawerVisible = ref(false);
const reviewDialogVisible = ref(false);
const auditDrawerVisible = ref(false);
const selectedRow = ref<Record<string, string> | null>(null);

const tableMap = {
  'system-user': ['sys_user', 'sys_work_identity', 'sys_user_role', 'sys_audit_log'],
  'system-role': ['sys_role', 'sys_permission', 'sys_role_permission', 'sys_audit_log'],
  'system-org': ['sys_organization', 'staff_profile', 'patient_assignment'],
  'system-dict': ['sys_dict', 'sys_dict_item', 'base_dict'],
  'system-menu': ['sys_workstation', 'sys_menu', 'sys_permission', 'sys_role_permission'],
  'system-message': ['system_message_template', 'workflow_task', 'system_message'],
  'system-log': ['sys_audit_log', 'integration_sync_log', 'device_raw_data'],
  'system-param': ['sys_parameter', 'sys_security_policy', 'sys_file_storage'],
  'system-backup': ['sys_backup_plan', 'sys_backup_log', 'sys_restore_log'],
  'system-monitor': ['sys_service_status', 'integration_endpoint', 'device_gateway'],
} as Record<string, string[]>;

const userRows = [
  { name: '张明', account: 'doctor001', employeeNo: 'HD-D-001', org: '血液净化中心', identity: '医生站 / 主诊医生', roles: '医嘱开立、预警处理', status: '启用', lastLogin: '2026-05-10 08:12' },
  { name: '周敏', account: 'nurse018', employeeNo: 'HD-N-018', org: '血液净化中心', identity: '护士站 / 护理组长', roles: '核对执行、治疗记录', status: '启用', lastLogin: '2026-05-10 07:48' },
  { name: '许工', account: 'device006', employeeNo: 'HD-E-006', org: '工程设备组', identity: '技师与设备站 / 设备技师', roles: '巡检维护、水质复核', status: '待复核', lastLogin: '2026-05-09 17:30' },
  { name: '李婷', account: 'guide012', employeeNo: 'HD-G-012', org: '导诊客服组', identity: '导诊台 / 导诊客服', roles: '建档、预约、归属分配', status: '启用', lastLogin: '2026-05-10 09:02' },
];

const roleRows = [
  { role: '主诊医生', code: 'doctor_attending', scope: '本人分管患者', menus: '医生站、科室看板', buttons: '医嘱开立/提交审核/预警处理', status: '已发布' },
  { role: '护理组长', code: 'nurse_leader', scope: '本护理组患者', menus: '护士站、科室看板', buttons: '护理审核/双人核对/治疗归档', status: '已发布' },
  { role: '系统管理员', code: 'system_admin', scope: '全院系统配置', menus: '系统管理、基础数据中心', buttons: '新增/停用/授权/导出', status: '变更待复核' },
];

const orgRows = [
  { name: '华东肾病医学中心', code: 'ORG001', type: '医院', parent: '-', status: '启用', owner: '院办' },
  { name: '总院区', code: 'CAMPUS01', type: '院区', parent: '华东肾病医学中心', status: '启用', owner: '运营管理部' },
  { name: '血液净化中心', code: 'HD001', type: '科室/中心', parent: '总院区', status: '启用', owner: '肾内科' },
  { name: '工程设备组', code: 'DEV001', type: '部门', parent: '血液净化中心', status: '启用', owner: '设备负责人' },
];

const menuRows = [
  { workstation: '医生站', menu: '医嘱管理', route: '/workspace/医生站/doctor-order', permission: 'doctor:order:*', status: '启用', owner: '系统管理员' },
  { workstation: '护士站', menu: '核对和执行', route: '/workspace/护士站/nurse-execute', permission: 'nurse:execute:*', status: '启用', owner: '系统管理员' },
  { workstation: '科室看板', menu: '预警与危急值', route: '/workspace/科室看板/board-warning', permission: 'board:warning:view', status: '启用', owner: '系统管理员' },
  { workstation: '药房站', menu: 'GCP药物协同', route: '/workspace/药房站/pharmacy-gcp', permission: 'pharmacy:gcp:*', status: '停用', owner: 'GCP管理员' },
];

const logRows = [
  { time: '2026-05-10 09:22', user: '系统管理员', action: '变更角色权限', entity: '主诊医生', result: '待复核', ip: '10.8.2.16' },
  { time: '2026-05-10 08:12', user: '张明', action: '登录系统', entity: '医生站身份', result: '成功', ip: '10.8.6.41' },
  { time: '2026-05-09 17:42', user: '系统管理员', action: '停用菜单', entity: '药房站/GCP药物协同', result: '成功', ip: '10.8.2.16' },
];

const genericRows = [
  { item: '登录安全策略', code: 'SEC_LOGIN', owner: '系统管理员', status: '启用', next: '90天强制改密' },
  { item: '任务提醒模板', code: 'MSG_TASK', owner: '信息管理部', status: '待复核', next: '复核模板变量' },
  { item: '每日备份策略', code: 'BAK_DAILY', owner: '运维管理员', status: '启用', next: '每日 02:00 自动备份' },
];

const pageMode = computed(() => {
  if (props.context.menuKey === 'system-role') return 'role';
  if (props.context.menuKey === 'system-org') return 'org';
  if (props.context.menuKey === 'system-menu') return 'menu';
  if (props.context.menuKey === 'system-log') return 'log';
  if (props.context.menuKey === 'system-user') return 'user';
  return 'generic';
});

const activeTables = computed(() => tableMap[props.context.menuKey] ?? tableMap['system-user']);
const pageHint = computed(() => {
  const map: Record<string, string> = {
    'system-user': '维护员工账号、工作身份、角色绑定和账号状态。',
    'system-role': '维护角色、菜单、按钮和数据范围授权。',
    'system-org': '维护医院、院区、中心、科室和部门层级。',
    'system-menu': '维护工作站菜单、路由和权限标识。',
    'system-log': '查询登录、授权、接口、设备和关键业务操作日志。',
  };
  return map[props.context.menuKey] ?? '维护系统字典、消息模板、参数、备份和监控配置。';
});

function openEdit(row?: Record<string, string>): void {
  selectedRow.value = row ?? null;
  editDrawerVisible.value = true;
}

function openReview(row: Record<string, string>): void {
  selectedRow.value = row;
  reviewDialogVisible.value = true;
}

function openAudit(row: Record<string, string>): void {
  selectedRow.value = row;
  auditDrawerVisible.value = true;
}
</script>

<template>
  <section class="system-admin-page">
    <el-card class="system-work-card" shadow="never">
      <template #header>
        <div class="system-work-header">
          <div>
            <h2>{{ context.menuTitle }}</h2>
            <p>{{ pageHint }}</p>
          </div>
          <div class="system-actions">
            <el-button type="primary" :icon="User" @click="openEdit()">新增</el-button>
            <el-button :icon="Operation">批量授权</el-button>
            <el-button :icon="CircleCheck">提交复核</el-button>
            <el-button :icon="DocumentChecked">审计查询</el-button>
          </div>
        </div>
      </template>

      <el-form class="system-filter" inline>
        <el-form-item label="关键词">
          <el-input placeholder="姓名、账号、角色、菜单、组织或编码" clearable />
        </el-form-item>
        <el-form-item label="组织">
          <el-select placeholder="全部组织" clearable>
            <el-option label="血液净化中心" value="hd" />
            <el-option label="工程设备组" value="dev" />
            <el-option label="导诊客服组" value="guide" />
            <el-option label="信息管理部" value="it" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select placeholder="全部状态" clearable>
            <el-option label="启用" value="enabled" />
            <el-option label="停用" value="disabled" />
            <el-option label="待复核" value="review" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>

      <el-table v-if="pageMode === 'user'" :data="userRows" border stripe>
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="account" label="账号" width="120" />
        <el-table-column prop="employeeNo" label="工号" width="120" />
        <el-table-column prop="org" label="组织" width="130" />
        <el-table-column prop="identity" label="工作身份" min-width="190" />
        <el-table-column prop="roles" label="角色权限" min-width="190" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '启用' ? 'success' : 'warning'">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastLogin" label="最近登录" width="170" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link @click="openReview(row)">复核</el-button>
            <el-button link @click="openAudit(row)">审计</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-table v-else-if="pageMode === 'role'" :data="roleRows" border stripe>
        <el-table-column prop="role" label="角色" width="130" />
        <el-table-column prop="code" label="编码" width="150" />
        <el-table-column prop="scope" label="数据范围" min-width="150" />
        <el-table-column prop="menus" label="工作站菜单" min-width="180" />
        <el-table-column prop="buttons" label="按钮权限" min-width="220" />
        <el-table-column prop="status" label="状态" width="120" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">配置</el-button>
            <el-button link @click="openReview(row)">复核</el-button>
            <el-button link @click="openAudit(row)">审计</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-table v-else-if="pageMode === 'org'" :data="orgRows" border stripe>
        <el-table-column prop="name" label="组织名称" min-width="180" />
        <el-table-column prop="code" label="编码" width="120" />
        <el-table-column prop="type" label="类型" width="120" />
        <el-table-column prop="parent" label="上级组织" min-width="170" />
        <el-table-column prop="owner" label="负责人" width="130" />
        <el-table-column prop="status" label="状态" width="100" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link>下级</el-button>
            <el-button link @click="openAudit(row)">审计</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-table v-else-if="pageMode === 'menu'" :data="menuRows" border stripe>
        <el-table-column prop="workstation" label="工作站" width="140" />
        <el-table-column prop="menu" label="菜单" width="150" />
        <el-table-column prop="route" label="路由" min-width="230" />
        <el-table-column prop="permission" label="权限标识" min-width="170" />
        <el-table-column prop="owner" label="维护人" width="130" />
        <el-table-column prop="status" label="状态" width="100" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link>授权</el-button>
            <el-button link @click="openAudit(row)">审计</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-table v-else-if="pageMode === 'log'" :data="logRows" border stripe>
        <el-table-column prop="time" label="时间" width="170" />
        <el-table-column prop="user" label="操作人" width="120" />
        <el-table-column prop="action" label="动作" width="150" />
        <el-table-column prop="entity" label="对象" min-width="190" />
        <el-table-column prop="ip" label="终端IP" width="120" />
        <el-table-column prop="result" label="结果" width="100" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openAudit(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-table v-else :data="genericRows" border stripe>
        <el-table-column prop="item" label="配置项" min-width="180" />
        <el-table-column prop="code" label="编码" width="140" />
        <el-table-column prop="owner" label="责任人" width="130" />
        <el-table-column prop="status" label="状态" width="110" />
        <el-table-column prop="next" label="下一步" min-width="220" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">维护</el-button>
            <el-button link @click="openReview(row)">复核</el-button>
            <el-button link @click="openAudit(row)">审计</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-drawer v-model="editDrawerVisible" title="编辑配置" size="560px">
      <el-form label-width="100px">
        <el-form-item label="名称">
          <el-input :model-value="selectedRow?.name || selectedRow?.role || selectedRow?.menu || selectedRow?.item" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="编码/账号">
          <el-input :model-value="selectedRow?.account || selectedRow?.code || selectedRow?.permission" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="组织">
          <el-select placeholder="选择组织">
            <el-option label="血液净化中心" value="hd" />
            <el-option label="工程设备组" value="dev" />
            <el-option label="信息管理部" value="it" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group :model-value="selectedRow?.status || '启用'">
            <el-radio-button label="启用" />
            <el-radio-button label="停用" />
            <el-radio-button label="待复核" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="变更原因">
          <el-input type="textarea" :rows="3" placeholder="请输入变更原因，保存后进入待复核状态" />
        </el-form-item>
      </el-form>
      <div class="drawer-actions">
        <el-button @click="editDrawerVisible = false">取消</el-button>
        <el-button type="primary" :icon="EditPen" @click="editDrawerVisible = false">保存为待复核</el-button>
      </div>
    </el-drawer>

    <el-dialog v-model="reviewDialogVisible" title="复核权限变更" width="560px">
      <el-descriptions v-if="selectedRow" :column="1" border>
        <el-descriptions-item label="对象">{{ selectedRow.name || selectedRow.role || selectedRow.menu || selectedRow.item }}</el-descriptions-item>
        <el-descriptions-item label="当前状态">{{ selectedRow.status }}</el-descriptions-item>
        <el-descriptions-item label="影响范围">登录身份、工作站菜单、按钮权限和数据范围</el-descriptions-item>
      </el-descriptions>
      <el-form class="dialog-form" label-width="90px">
        <el-form-item label="复核意见">
          <el-input type="textarea" :rows="3" placeholder="请输入复核意见" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reviewDialogVisible = false">退回</el-button>
        <el-button type="primary" @click="reviewDialogVisible = false">通过并发布</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="auditDrawerVisible" title="审计追溯" size="560px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-10 09:22" type="warning">提交权限变更，状态变为待复核</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 09:12" type="primary">修改菜单权限和数据范围</el-timeline-item>
        <el-timeline-item timestamp="2026-05-09 17:30" type="success">上一次复核通过并发布</el-timeline-item>
      </el-timeline>
      <div class="system-risk-line safe">
        <el-icon><Lock /></el-icon>
        <span>审计记录包含修改前后值、操作人、时间、终端和复核结果。</span>
      </div>
    </el-drawer>
  </section>
</template>
