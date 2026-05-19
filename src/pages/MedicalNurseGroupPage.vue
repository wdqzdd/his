<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, Search, UserFilled } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();

type GroupRow = { id: string; bigDept: string; specialty: string; ward: string; groupName: string; subGroup: string; leader: string; beds: string; members: string; patients: number; status: string; nextAction: string };
type BedRow = { id: string; bigDept: string; specialty: string; ward: string; groupName: string; bedCode: string; zone: string; bedType: string; device: string; status: string; nextAction: string };
type MemberRow = { id: string; groupName: string; member: string; role: string; qualification: string; joinDate: string; handover: string; status: string; nextAction: string };
type ChangeRow = { id: string; object: string; changeType: string; beforeValue: string; afterValue: string; reason: string; operator: string; changedAt: string; status: string; nextAction: string };

const activeTab = ref('groups');
const selectedId = ref('NG-001');
const groupDialogVisible = ref(false);
const memberDialogVisible = ref(false);
const traceDrawerVisible = ref(false);

const groupRows: GroupRow[] = [
  { id: 'NG-001', bigDept: '内科', specialty: '肾内科', ward: '血透中心', groupName: 'A区护理组', subGroup: 'A区一组', leader: '周敏', beds: 'A01-A08', members: '8人', patients: 72, status: '启用', nextAction: '进入排班' },
  { id: 'NG-002', bigDept: '内科', specialty: '肾内科', ward: '血透中心', groupName: 'A区护理组', subGroup: 'A区二组', leader: '李洁', beds: 'A09-A16', members: '7人', patients: 68, status: '启用', nextAction: '进入排班' },
  { id: 'NG-003', bigDept: '内科', specialty: '肾内科', ward: '血透中心', groupName: 'B区护理组', subGroup: 'B区一组', leader: '赵琼', beds: 'B01-B07', members: '7人', patients: 61, status: '启用', nextAction: '进入排班' },
  { id: 'NG-004', bigDept: '内科', specialty: '肾内科', ward: '血透中心', groupName: 'B区护理组', subGroup: 'B区二组', leader: '王丽', beds: 'B08-B14', members: '6人', patients: 55, status: '待复核', nextAction: '成员复核' },
  { id: 'NG-005', bigDept: '内科', specialty: '肾内科', ward: '血透中心', groupName: 'C区护理组', subGroup: 'C区一组', leader: '刘芳', beds: 'C01-C07', members: '6人', patients: 48, status: '启用', nextAction: '进入排班' },
  { id: 'NG-006', bigDept: '内科', specialty: '肾内科', ward: '血透中心', groupName: 'C区护理组', subGroup: 'C区二组', leader: '陈蕾', beds: 'C08-C14', members: '6人', patients: 47, status: '启用', nextAction: '进入排班' },
  { id: 'NG-007', bigDept: '内科', specialty: '感染肾病', ward: '隔离透析区', groupName: '隔离护理组', subGroup: '乙肝隔离组', leader: '孙涵', beds: 'I01-I04', members: '5人', patients: 18, status: '复核中', nextAction: '复核后启用' },
  { id: 'NG-008', bigDept: '急诊医学', specialty: '急诊透析', ward: '急诊加透区', groupName: '急诊加透组', subGroup: '临时加透组', leader: '何琴', beds: 'E01-E04', members: '4人', patients: 12, status: '待启用', nextAction: '资质确认' },
  { id: 'NG-009', bigDept: '内科', specialty: '肾内科', ward: '夜间透析区', groupName: '夜班护理组', subGroup: '夜间一组', leader: '邓雪', beds: 'N01-N06', members: '5人', patients: 30, status: '启用', nextAction: '夜间值班' },
  { id: 'NG-010', bigDept: '护理部', specialty: '专科质控', ward: '全院区', groupName: '质控护理组', subGroup: '质控抽查组', leader: '郑主任', beds: '抽查机位', members: '4人', patients: 0, status: '启用', nextAction: '质控抽查' },
];

const bedRows: BedRow[] = [
  { id: 'BED-001', bigDept: '内科', specialty: '肾内科', ward: '血透中心', groupName: 'A区一组', bedCode: 'A01', zone: '普通A区', bedType: '普通机位', device: 'HD-001', status: '可用', nextAction: '排班引用' },
  { id: 'BED-002', bigDept: '内科', specialty: '肾内科', ward: '血透中心', groupName: 'A区一组', bedCode: 'A02', zone: '普通A区', bedType: '普通机位', device: 'HD-002', status: '可用', nextAction: '排班引用' },
  { id: 'BED-003', bigDept: '内科', specialty: '肾内科', ward: '血透中心', groupName: 'A区二组', bedCode: 'A12', zone: '普通A区', bedType: '普通机位', device: 'HD-012', status: '待消毒', nextAction: '消毒复核' },
  { id: 'BED-004', bigDept: '内科', specialty: '肾内科', ward: '血透中心', groupName: 'B区一组', bedCode: 'B03', zone: '普通B区', bedType: '普通机位', device: 'HD-023', status: '维修停用', nextAction: '替换机位' },
  { id: 'BED-005', bigDept: '内科', specialty: '肾内科', ward: '血透中心', groupName: 'B区二组', bedCode: 'B09', zone: '普通B区', bedType: '普通机位', device: 'HD-029', status: '可用', nextAction: '排班引用' },
  { id: 'BED-006', bigDept: '内科', specialty: '肾内科', ward: '血透中心', groupName: 'C区一组', bedCode: 'C02', zone: '普通C区', bedType: 'HDF机位', device: 'HDF-002', status: '可用', nextAction: '特殊净化引用' },
  { id: 'BED-007', bigDept: '内科', specialty: '感染肾病', ward: '隔离透析区', groupName: '乙肝隔离组', bedCode: 'I01', zone: '乙肝隔离', bedType: '隔离机位', device: 'ISO-001', status: '可用', nextAction: '隔离排班' },
  { id: 'BED-008', bigDept: '内科', specialty: '感染肾病', ward: '隔离透析区', groupName: '丙肝隔离组', bedCode: 'I05', zone: '丙肝隔离', bedType: '隔离机位', device: 'ISO-005', status: '待复核', nextAction: '感控复核' },
  { id: 'BED-009', bigDept: '急诊医学', specialty: '急诊透析', ward: '急诊加透区', groupName: '临时加透组', bedCode: 'E01', zone: '急诊备用', bedType: '备用机位', device: 'ER-001', status: '可用', nextAction: '临时加透' },
  { id: 'BED-010', bigDept: '内科', specialty: '肾内科', ward: '夜间透析区', groupName: '夜间一组', bedCode: 'N02', zone: '夜间区', bedType: '夜间机位', device: 'HD-N02', status: '可用', nextAction: '夜间排班' },
];

const memberRows: MemberRow[] = [
  { id: 'MEM-001', groupName: 'A区一组', member: '周敏', role: '组长', qualification: '血透专科/带教', joinDate: '2024-03-01', handover: '已交接', status: '在组', nextAction: '持续排班' },
  { id: 'MEM-002', groupName: 'A区一组', member: '李洁', role: '责任护士', qualification: '血透专科', joinDate: '2024-06-01', handover: '已交接', status: '在组', nextAction: '持续排班' },
  { id: 'MEM-003', groupName: 'B区一组', member: '赵琼', role: '组长', qualification: '血透专科', joinDate: '2023-11-01', handover: '已交接', status: '在组', nextAction: '持续排班' },
  { id: 'MEM-004', groupName: 'B区二组', member: '王丽', role: '组长', qualification: '证书临期', joinDate: '2025-01-01', handover: '待补', status: '待复核', nextAction: '证书复核' },
  { id: 'MEM-005', groupName: 'C区一组', member: '刘芳', role: '责任护士', qualification: '血透专科', joinDate: '2024-09-01', handover: '已交接', status: '在组', nextAction: '持续排班' },
  { id: 'MEM-006', groupName: 'C区二组', member: '陈蕾', role: '责任护士', qualification: '血透专科', joinDate: '2025-04-01', handover: '已交接', status: '在组', nextAction: '持续排班' },
  { id: 'MEM-007', groupName: '乙肝隔离组', member: '孙涵', role: '组长', qualification: '隔离资质', joinDate: '2024-05-01', handover: '已交接', status: '在组', nextAction: '隔离排班' },
  { id: 'MEM-008', groupName: '临时加透组', member: '何琴', role: '组长', qualification: '急诊培训待补', joinDate: '2026-05-01', handover: '待交接', status: '待启用', nextAction: '培训确认' },
  { id: 'MEM-009', groupName: '夜间一组', member: '邓雪', role: '组长', qualification: '夜间值班', joinDate: '2025-08-01', handover: '已交接', status: '在组', nextAction: '夜间值班' },
  { id: 'MEM-010', groupName: '质控抽查组', member: '郑主任', role: '质控护士长', qualification: '质控授权', joinDate: '2023-01-01', handover: '已交接', status: '在组', nextAction: '质控抽查' },
];

const changeRows: ChangeRow[] = [
  { id: 'NGC-001', object: 'B区二组', changeType: '组长调整', beforeValue: '赵琼', afterValue: '王丽', reason: '护理组扩容', operator: '护理部周敏', changedAt: '2026-05-10 09:10', status: '待复核', nextAction: '医务复核' },
  { id: 'NGC-002', object: '乙肝隔离组', changeType: '启用', beforeValue: '停用', afterValue: '复核中', reason: '隔离患者增加', operator: '感控孙主任', changedAt: '2026-05-11 14:20', status: '复核中', nextAction: '感控确认' },
  { id: 'NGC-003', object: 'A12', changeType: '床号状态', beforeValue: '可用', afterValue: '待消毒', reason: '上一班治疗结束', operator: '护士李洁', changedAt: '2026-05-15 12:20', status: '待处理', nextAction: '消毒复核' },
  { id: 'NGC-004', object: 'B03', changeType: '床号停用', beforeValue: '可用', afterValue: '维修停用', reason: '设备报警', operator: '技师许工', changedAt: '2026-05-14 16:05', status: '已同步', nextAction: '排班避让' },
  { id: 'NGC-005', object: '急诊加透组', changeType: '新增小组', beforeValue: '无', afterValue: '临时加透组', reason: '急诊加透业务独立管理', operator: '医务张洁', changedAt: '2026-05-12 10:30', status: '待启用', nextAction: '资质确认' },
  { id: 'NGC-006', object: '夜间一组', changeType: '成员移入', beforeValue: '4人', afterValue: '5人', reason: '夜间透析增加', operator: '护理部赵琼', changedAt: '2026-05-13 17:45', status: '已生效', nextAction: '夜间排班' },
];

const hierarchyRows = [
  { id: 'ORG-001', level: '大科', name: '内科', parent: '-', owner: '医务科', related: '肾内科/感染肾病', status: '启用', nextAction: '维护专科' },
  { id: 'ORG-002', level: '专科', name: '肾内科', parent: '内科', owner: '医务科', related: '血透中心/夜间透析区', status: '启用', nextAction: '维护病区' },
  { id: 'ORG-003', level: '病区/中心', name: '血透中心', parent: '肾内科', owner: '护士长周敏', related: 'A/B/C区护理组', status: '启用', nextAction: '维护护理组' },
  { id: 'ORG-004', level: '护理组别', name: 'A区护理组', parent: '血透中心', owner: '周敏', related: 'A区一组/A区二组', status: '启用', nextAction: '维护小组' },
  { id: 'ORG-005', level: '护理小组', name: 'A区一组', parent: 'A区护理组', owner: '周敏', related: 'A01-A08', status: '启用', nextAction: '维护床号' },
  { id: 'ORG-006', level: '病区/中心', name: '隔离透析区', parent: '感染肾病', owner: '孙涵', related: '乙肝/丙肝隔离组', status: '复核中', nextAction: '感控复核' },
];

const currentRow = computed(() => groupRows.find((item) => item.id === selectedId.value) ?? groupRows[0]);
const activeTables = ['nursing_group', 'care_team_member', 'bed_station', 'group_change_log'];
const metrics = computed(() => [
  { label: '护理组/小组', value: groupRows.length, tone: 'blue' },
  { label: '启用', value: groupRows.filter((item) => item.status === '启用').length, tone: 'green' },
  { label: '待复核/待启用', value: groupRows.filter((item) => item.status.includes('待') || item.status.includes('复核')).length, tone: 'orange' },
  { label: '维护床号', value: bedRows.length, tone: 'purple' },
]);

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (['启用', '在组', '可用', '已生效', '已同步', '进入排班'].includes(value)) return 'success';
  if (value.includes('维修') || value.includes('停用')) return 'danger';
  if (value.includes('待') || value.includes('复核') || value.includes('临期')) return 'warning';
  return 'info';
}

function selectRow(row: GroupRow): void {
  selectedId.value = row.id;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}
</script>

<template>
  <section class="medical-affairs-page">
    <el-card class="medical-work-card" shadow="never">
      <template #header>
        <div class="medical-work-header">
          <div>
            <h2>{{ props.context.menuTitle }}</h2>
            <p>维护大科、专科、病区/中心、护理组别、护理小组、床号和成员，供归属分配、排班排床和护理工作量统计引用。</p>
          </div>
          <div class="medical-actions">
            <el-button type="primary" :icon="UserFilled" @click="groupDialogVisible = true">新增组别/床号</el-button>
            <el-button :icon="CircleCheck" @click="memberDialogVisible = true">成员调整</el-button>
            <el-button @click="traceDrawerVisible = true">变更追溯</el-button>
          </div>
        </div>
      </template>

      <el-form class="medical-filter" inline>
        <el-form-item label="关键字"><el-input placeholder="大科、专科、病区、护理组、床号、成员" clearable /></el-form-item>
        <el-form-item label="层级">
          <el-select placeholder="全部层级" clearable>
            <el-option label="大科" value="大科" />
            <el-option label="专科" value="专科" />
            <el-option label="病区/中心" value="病区/中心" />
            <el-option label="护理组别" value="护理组别" />
            <el-option label="护理小组" value="护理小组" />
            <el-option label="床号" value="床号" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="启用" value="启用" /><el-option label="待复核" value="待复核" /><el-option label="停用" value="停用" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <div class="medical-stat-grid">
        <el-card v-for="item in metrics" :key="item.label" :class="['medical-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card>
      </div>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="层级关系维护" name="hierarchy">
          <el-table :data="hierarchyRows" border stripe row-key="id">
            <el-table-column prop="level" label="层级" width="110" fixed="left" />
            <el-table-column prop="name" label="名称" min-width="130" />
            <el-table-column prop="parent" label="上级" width="120" />
            <el-table-column prop="owner" label="负责人" width="120" />
            <el-table-column prop="related" label="下级/关联对象" min-width="150" />
            <el-table-column prop="status" label="状态" width="95"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
            <el-table-column prop="nextAction" label="下一步" min-width="120" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="护理组别/小组维护" name="groups">
          <el-table :data="groupRows" border stripe highlight-current-row row-key="id" @row-click="selectRow">
            <el-table-column prop="bigDept" label="大科" width="90" fixed="left" />
            <el-table-column prop="specialty" label="专科" width="105" />
            <el-table-column prop="ward" label="病区/中心" width="120" />
            <el-table-column prop="groupName" label="护理组别" width="120" />
            <el-table-column prop="subGroup" label="护理小组" width="120" />
            <el-table-column prop="leader" label="组长" width="95" />
            <el-table-column prop="beds" label="负责床号/机位" width="130" />
            <el-table-column prop="members" label="成员" width="80" />
            <el-table-column prop="patients" label="覆盖患者" width="95" />
            <el-table-column prop="status" label="状态" width="95"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
            <el-table-column prop="nextAction" label="下一步" min-width="120" />
            <el-table-column label="操作" width="220" fixed="right"><template #default="{ row }"><el-button link type="primary" @click.stop="selectRow(row); groupDialogVisible = true">维护</el-button><el-button link @click.stop="selectRow(row); memberDialogVisible = true">成员</el-button><el-button link @click.stop="selectRow(row); traceDrawerVisible = true">追溯</el-button></template></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="床号维护" name="beds">
          <el-table :data="bedRows" border stripe row-key="id">
            <el-table-column prop="bedCode" label="床号/机位" width="100" fixed="left" />
            <el-table-column prop="bigDept" label="大科" width="90" />
            <el-table-column prop="specialty" label="专科" width="105" />
            <el-table-column prop="ward" label="病区/中心" width="120" />
            <el-table-column prop="groupName" label="护理小组" width="120" />
            <el-table-column prop="zone" label="分区" width="110" />
            <el-table-column prop="bedType" label="床号类型" width="110" />
            <el-table-column prop="device" label="绑定设备" width="100" />
            <el-table-column prop="status" label="状态" width="95"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
            <el-table-column prop="nextAction" label="下一步" min-width="120" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="护理组成员维护" name="members">
          <el-table :data="memberRows" border stripe row-key="id">
            <el-table-column prop="groupName" label="护理小组" width="120" fixed="left" />
            <el-table-column prop="member" label="成员" width="95" />
            <el-table-column prop="role" label="组内角色" width="110" />
            <el-table-column prop="qualification" label="资质" min-width="130" />
            <el-table-column prop="joinDate" label="加入日期" width="115" />
            <el-table-column prop="handover" label="交接" width="100" />
            <el-table-column prop="status" label="状态" width="95"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
            <el-table-column prop="nextAction" label="下一步" min-width="120" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="护理组变更记录" name="changes">
          <el-table :data="changeRows" border stripe row-key="id">
            <el-table-column prop="object" label="变更对象" min-width="130" fixed="left" />
            <el-table-column prop="changeType" label="类型" width="105" />
            <el-table-column prop="beforeValue" label="变更前" width="120" />
            <el-table-column prop="afterValue" label="变更后" width="120" />
            <el-table-column prop="reason" label="原因" min-width="140" />
            <el-table-column prop="operator" label="操作人" width="115" />
            <el-table-column prop="changedAt" label="时间" width="145" />
            <el-table-column prop="status" label="状态" width="95"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
            <el-table-column prop="nextAction" label="下一步" min-width="120" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog v-model="groupDialogVisible" title="层级、护理组与床号维护" width="680px">
      <el-form label-width="110px">
        <el-form-item label="大科"><el-input :model-value="currentRow.bigDept" /></el-form-item>
        <el-form-item label="专科"><el-input :model-value="currentRow.specialty" /></el-form-item>
        <el-form-item label="病区/中心"><el-input :model-value="currentRow.ward" /></el-form-item>
        <el-form-item label="护理组别"><el-input :model-value="currentRow.groupName" /></el-form-item>
        <el-form-item label="护理小组"><el-input :model-value="currentRow.subGroup" /></el-form-item>
        <el-form-item label="负责床号"><el-input :model-value="currentRow.beds" /></el-form-item>
        <el-form-item label="启用状态"><el-radio-group model-value="enable"><el-radio-button label="enable">启用</el-radio-button><el-radio-button label="review">待复核</el-radio-button><el-radio-button label="stop">停用</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="说明"><el-input type="textarea" :rows="3" placeholder="记录层级关系、床号范围、覆盖患者和调整原因" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="groupDialogVisible = false">取消</el-button><el-button type="primary" @click="groupDialogVisible = false; submitAction('护理组别和床号已保存')">保存</el-button></template>
    </el-dialog>

    <el-dialog v-model="memberDialogVisible" title="护理组成员调整" width="620px">
      <el-form label-width="110px">
        <el-form-item label="护理小组"><el-input :model-value="currentRow.subGroup" disabled /></el-form-item>
        <el-form-item label="成员调整"><el-checkbox-group><el-checkbox label="增加责任护士" /><el-checkbox label="移出成员" /><el-checkbox label="调整组长" /><el-checkbox label="同步值班" /><el-checkbox label="同步分管患者" /></el-checkbox-group></el-form-item>
        <el-form-item label="调整说明"><el-input type="textarea" :rows="3" placeholder="记录人员、资质、交接、生效日期和影响患者" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="memberDialogVisible = false">取消</el-button><el-button type="primary" @click="memberDialogVisible = false; submitAction('护理组成员调整已提交')">提交调整</el-button></template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="护理组别变更追溯" size="560px">
      <el-timeline>
        <el-timeline-item timestamp="层级建立">大科/专科/病区：{{ currentRow.bigDept }} / {{ currentRow.specialty }} / {{ currentRow.ward }}</el-timeline-item>
        <el-timeline-item timestamp="组别与床号维护" type="warning">护理小组：{{ currentRow.subGroup }}，床号：{{ currentRow.beds }}</el-timeline-item>
        <el-timeline-item timestamp="业务引用" type="success">同步导诊归属、排班排床、护士站和报表统计</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
