<script setup lang="ts">
import { computed, ref } from 'vue';
import { DataLine, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();

type DynamicRow = { id: string; object: string; dimension: string; period: string; currentValue: string; changeValue: string; status: string; owner: string; nextAction: string };
type PatientRow = { id: string; patient: string; listType: string; contractStatus: string; doctor: string; nurse: string; groupName: string; bedIntent: string; changedAt: string; status: string; nextAction: string };
type StaffRow = { id: string; staff: string; staffType: string; scope: string; teamOrWard: string; qualification: string; currentPatients: number; dutyStatus: string; status: string; nextAction: string };

const activeTab = ref('snapshot');
const selectedId = ref('DYN-001');
const reviewDialogVisible = ref(false);
const alertDialogVisible = ref(false);
const traceDrawerVisible = ref(false);

const snapshotRows: DynamicRow[] = [
  { id: 'DYN-001', object: '签约患者', dimension: '患者动态', period: '本月', currentValue: '326人', changeValue: '+4', status: '增长', owner: '导诊台', nextAction: '归属复核' },
  { id: 'DYN-002', object: '在管患者', dimension: '患者动态', period: '当前', currentValue: '312人', changeValue: '+2', status: '稳定', owner: '医务医事站', nextAction: '分工平衡' },
  { id: 'DYN-003', object: '新收患者', dimension: '患者动态', period: '本周', currentValue: '7人', changeValue: '+3', status: '关注', owner: '导诊台', nextAction: '分配医护' },
  { id: 'DYN-004', object: '退出患者', dimension: '患者动态', period: '本月', currentValue: '3人', changeValue: '+1', status: '待归档', owner: '导诊台', nextAction: '退出原因归档' },
  { id: 'DYN-005', object: 'A区护理人力', dimension: '人员动态', period: '本周', currentValue: '15人', changeValue: '-1', status: '关注', owner: '护理部', nextAction: '补充排班' },
  { id: 'DYN-006', object: 'B区医生分工', dimension: '人员动态', period: '本周', currentValue: '4人', changeValue: '0', status: '稳定', owner: '医务科', nextAction: '继续监测' },
  { id: 'DYN-007', object: '隔离区患者', dimension: '患者动态', period: '当前', currentValue: '18人', changeValue: '+2', status: '关注', owner: '感控管理', nextAction: '隔离资源复核' },
  { id: 'DYN-008', object: '居家随访患者', dimension: '患者动态', period: '本月', currentValue: '76人', changeValue: '+5', status: '增长', owner: '居家随访团队', nextAction: '随访任务生成' },
  { id: 'DYN-009', object: 'GCP受试者', dimension: '患者动态', period: '本月', currentValue: '12人', changeValue: '+1', status: '受控', owner: 'CRC站', nextAction: '授权复核' },
  { id: 'DYN-010', object: '排班缺口', dimension: '资源动态', period: '下周', currentValue: '3班次', changeValue: '+1', status: '预警', owner: '医务科', nextAction: '调整值班' },
];

const patientRows: PatientRow[] = [
  { id: 'PAT-001', patient: '王建国 / P20260510001', listType: '签约患者', contractStatus: '已签约', doctor: '张明', nurse: '周敏', groupName: 'A区一组', bedIntent: 'A08', changedAt: '2026-05-10 09:20', status: '在管', nextAction: '排班引用' },
  { id: 'PAT-002', patient: '李秀兰 / P20260510002', listType: '签约患者', contractStatus: '待续约', doctor: '陈宁', nurse: '赵琼', groupName: 'B区一组', bedIntent: 'B12', changedAt: '2026-05-10 10:15', status: '待复核', nextAction: '续约复核' },
  { id: 'PAT-003', patient: '赵明 / P20260510003', listType: '在管患者', contractStatus: '已签约', doctor: '张明', nurse: '孙涵', groupName: '乙肝隔离组', bedIntent: 'I03', changedAt: '2026-05-09 15:30', status: '在管', nextAction: '隔离排班' },
  { id: 'PAT-004', patient: '刘梦莹 / P20260510004', listType: '新收患者', contractStatus: '草稿', doctor: '王主任', nurse: '李洁', groupName: 'A区二组', bedIntent: 'A12', changedAt: '2026-05-14 11:00', status: '待分配', nextAction: '确认责任医护' },
  { id: 'PAT-005', patient: '何雪 / P20260510005', listType: '在管患者', contractStatus: '已签约', doctor: '陈教授', nurse: '刘芳', groupName: 'C区一组', bedIntent: 'C02', changedAt: '2026-05-08 08:40', status: '在管', nextAction: '处方评估' },
  { id: 'PAT-006', patient: '马丽 / P20260510006', listType: '在管患者', contractStatus: '已签约', doctor: '孙主任', nurse: '孙涵', groupName: '乙肝隔离组', bedIntent: 'I01', changedAt: '2026-05-08 16:10', status: '在管', nextAction: '隔离排班' },
  { id: 'PAT-007', patient: '周庆 / P20260510007', listType: '签约患者', contractStatus: '待变更', doctor: '刘主任', nurse: '王丽', groupName: 'B区二组', bedIntent: 'B08', changedAt: '2026-05-12 13:35', status: '待调整', nextAction: '护理组调整' },
  { id: 'PAT-008', patient: '陈敏 / P20260510008', listType: '在管患者', contractStatus: '已签约', doctor: '李教授', nurse: '周敏', groupName: 'A区一组', bedIntent: 'A05', changedAt: '2026-05-11 09:05', status: '在管', nextAction: '通路评估' },
  { id: 'PAT-009', patient: '潘德胜 / P20260510009', listType: '新收患者', contractStatus: 'GCP受控', doctor: '陈教授', nurse: '邓雪', groupName: '夜间一组', bedIntent: 'N02', changedAt: '2026-05-14 15:00', status: '受控', nextAction: 'CRC授权复核' },
  { id: 'PAT-010', patient: '吴海 / P20260510010', listType: '退出患者', contractStatus: '解约待归档', doctor: '刘主任', nurse: '赵玲', groupName: 'D区一组', bedIntent: 'D03', changedAt: '2026-05-09 16:25', status: '待归档', nextAction: '退出记录归档' },
  { id: 'PAT-011', patient: '郭强 / P20260510011', listType: '在管患者', contractStatus: '已签约', doctor: '周主任', nurse: '陈蕾', groupName: 'C区二组', bedIntent: 'C09', changedAt: '2026-05-13 10:20', status: '待复核', nextAction: '团队确认' },
  { id: 'PAT-012', patient: '韩梅 / P20260510012', listType: '新收患者', contractStatus: '已签约', doctor: '刘主任', nurse: '赵玲', groupName: 'D区一组', bedIntent: 'D02', changedAt: '2026-05-14 08:50', status: '待排班', nextAction: '排班排床' },
];

const staffRows: StaffRow[] = [
  { id: 'STA-001', staff: '张明', staffType: '病区工作人员', scope: '主诊医生', teamOrWard: '血透中心 A/B区', qualification: '有效', currentPatients: 82, dutyStatus: '上午班已发布', status: '可分配', nextAction: '持续分管' },
  { id: 'STA-002', staff: '陈宁', staffType: '病区工作人员', scope: '主诊医生', teamOrWard: '血透中心 C区', qualification: '有效', currentPatients: 64, dutyStatus: '下午班待确认', status: '可分配', nextAction: '确认排班' },
  { id: 'STA-003', staff: '周敏', staffType: '病区工作人员', scope: '护理组长', teamOrWard: 'A区一组', qualification: '有效', currentPatients: 72, dutyStatus: '上午班已发布', status: '可分配', nextAction: '持续分管' },
  { id: 'STA-004', staff: '赵琼', staffType: '病区工作人员', scope: '护理组长', teamOrWard: 'B区一组', qualification: '有效', currentPatients: 61, dutyStatus: '下午班待确认', status: '可分配', nextAction: '确认排班' },
  { id: 'STA-005', staff: '孙涵', staffType: '病区工作人员', scope: '隔离组长', teamOrWard: '乙肝隔离组', qualification: '隔离资质有效', currentPatients: 18, dutyStatus: '待复核', status: '待复核', nextAction: '感控复核' },
  { id: 'STA-006', staff: '李教授', staffType: '专家团队工作人员', scope: '通路专家', teamOrWard: '血管通路团队', qualification: '有效', currentPatients: 98, dutyStatus: '会诊已发布', status: '可分配', nextAction: '通路会诊' },
  { id: 'STA-007', staff: '陈教授', staffType: '专家团队工作人员', scope: 'GCP负责人', teamOrWard: 'GCP肾病研究团队', qualification: 'GCP授权', currentPatients: 12, dutyStatus: '受控访问', status: '受控', nextAction: 'CRC协同' },
  { id: 'STA-008', staff: '刘主任', staffType: '专家团队工作人员', scope: '质控负责人', teamOrWard: '质控改进团队', qualification: '有效', currentPatients: 0, dutyStatus: '质量值班草稿', status: '可分配', nextAction: 'CQI项目' },
  { id: 'STA-009', staff: '王丽', staffType: '病区工作人员', scope: '护理组长', teamOrWard: 'B区二组', qualification: '证书临期', currentPatients: 55, dutyStatus: '待复核', status: '预警', nextAction: '证书续期' },
  { id: 'STA-010', staff: '邓雪', staffType: '病区工作人员', scope: '夜班护理', teamOrWard: '夜间一组', qualification: '夜间值班有效', currentPatients: 30, dutyStatus: '夜间班已发布', status: '可分配', nextAction: '夜间值班' },
];

const currentRow = computed(() => snapshotRows.find((item) => item.id === selectedId.value) ?? snapshotRows[0]);
const activeTables = ['patient_contract', 'patient_assignment', 'staff_profile', 'resource_dynamic_snapshot'];
const metrics = computed(() => [
  { label: '动态项', value: snapshotRows.length, tone: 'blue' },
  { label: '签约/在管', value: patientRows.filter((item) => item.listType === '签约患者' || item.listType === '在管患者').length, tone: 'green' },
  { label: '新收/退出', value: patientRows.filter((item) => item.listType === '新收患者' || item.listType === '退出患者').length, tone: 'orange' },
  { label: '人员预警/受控', value: staffRows.filter((item) => item.status === '预警' || item.status === '受控' || item.status === '待复核').length, tone: 'purple' },
]);

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (['稳定', '增长', '在管', '可分配', '已签约', '持续分管'].includes(value)) return 'success';
  if (value === '预警') return 'danger';
  if (value.includes('关注') || value.includes('待') || value.includes('受控') || value.includes('草稿') || value.includes('临期')) return 'warning';
  return 'info';
}

function selectRow(row: DynamicRow): void {
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
            <p>跟踪签约、在管、新收、退出患者及其分管医护，同时查看病区和专家团队工作人员动态。</p>
          </div>
          <div class="medical-actions">
            <el-button type="primary" :icon="DataLine" @click="reviewDialogVisible = true">动态复核</el-button>
            <el-button :icon="Warning" @click="alertDialogVisible = true">生成预警</el-button>
            <el-button @click="traceDrawerVisible = true">动态追溯</el-button>
          </div>
        </div>
      </template>

      <el-form class="medical-filter" inline>
        <el-form-item label="关键字"><el-input placeholder="患者、医护、组别、团队、下一步" clearable /></el-form-item>
        <el-form-item label="清单">
          <el-select placeholder="全部清单" clearable>
            <el-option label="签约患者列表" value="签约患者" />
            <el-option label="在管患者列表" value="在管患者" />
            <el-option label="新收患者列表" value="新收患者" />
            <el-option label="退出患者列表" value="退出患者" />
            <el-option label="病区工作人员一览表" value="病区工作人员" />
            <el-option label="专家团队工作人员一览表" value="专家团队工作人员" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="在管" value="在管" /><el-option label="待复核" value="待复核" /><el-option label="待归档" value="待归档" /><el-option label="预警" value="预警" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <div class="medical-stat-grid">
        <el-card v-for="item in metrics" :key="item.label" :class="['medical-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card>
      </div>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="动态快照" name="snapshot">
          <el-table :data="snapshotRows" border stripe highlight-current-row row-key="id" @row-click="selectRow">
            <el-table-column prop="object" label="动态对象" min-width="130" fixed="left" />
            <el-table-column prop="dimension" label="维度" width="105" />
            <el-table-column prop="period" label="周期" width="90" />
            <el-table-column prop="currentValue" label="当前值" width="105" />
            <el-table-column prop="changeValue" label="变化" width="85" />
            <el-table-column prop="status" label="状态" width="95"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
            <el-table-column prop="owner" label="责任方" width="130" />
            <el-table-column prop="nextAction" label="下一步" min-width="130" />
            <el-table-column label="操作" width="210" fixed="right"><template #default="{ row }"><el-button link type="primary" @click.stop="selectRow(row); reviewDialogVisible = true">复核</el-button><el-button link @click.stop="selectRow(row); alertDialogVisible = true">预警</el-button><el-button link @click.stop="selectRow(row); traceDrawerVisible = true">追溯</el-button></template></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="签约/在管/新收/退出患者列表" name="patients">
          <el-table :data="patientRows" border stripe row-key="id">
            <el-table-column prop="patient" label="患者" min-width="160" fixed="left" />
            <el-table-column prop="listType" label="清单类型" width="105" />
            <el-table-column prop="contractStatus" label="签约状态" width="110" />
            <el-table-column prop="doctor" label="主诊医生" width="95" />
            <el-table-column prop="nurse" label="责任护士" width="95" />
            <el-table-column prop="groupName" label="护理组" width="110" />
            <el-table-column prop="bedIntent" label="机位意向" width="95" />
            <el-table-column prop="changedAt" label="更新时间" width="145" />
            <el-table-column prop="status" label="状态" width="95"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
            <el-table-column prop="nextAction" label="下一步" min-width="130" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="患者及其分管医护一览表" name="assignment-view">
          <el-table :data="patientRows" border stripe row-key="id">
            <el-table-column prop="patient" label="患者" min-width="160" fixed="left" />
            <el-table-column prop="doctor" label="主诊医生" width="100" />
            <el-table-column prop="nurse" label="责任护士" width="100" />
            <el-table-column prop="groupName" label="护理组" width="120" />
            <el-table-column prop="bedIntent" label="床号/机位" width="105" />
            <el-table-column prop="contractStatus" label="来源状态" width="110" />
            <el-table-column prop="status" label="分管状态" width="100"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
            <el-table-column prop="nextAction" label="下一步" min-width="130" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="分工分管一览表" name="assignment-summary">
          <el-table :data="staffRows" border stripe row-key="id">
            <el-table-column prop="staff" label="人员" width="95" fixed="left" />
            <el-table-column prop="scope" label="分工角色" width="120" />
            <el-table-column prop="teamOrWard" label="病区/团队" min-width="140" />
            <el-table-column prop="currentPatients" label="分管患者" width="95" />
            <el-table-column prop="dutyStatus" label="值班状态" width="130" />
            <el-table-column prop="qualification" label="资质" width="120" />
            <el-table-column prop="status" label="状态" width="95"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
            <el-table-column prop="nextAction" label="下一步" min-width="130" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="病区/专家团队工作人员一览表" name="staff">
          <el-table :data="staffRows" border stripe row-key="id">
            <el-table-column prop="staff" label="工作人员" width="100" fixed="left" />
            <el-table-column prop="staffType" label="人员清单" width="150" />
            <el-table-column prop="scope" label="岗位/角色" width="120" />
            <el-table-column prop="teamOrWard" label="病区/团队" min-width="150" />
            <el-table-column prop="qualification" label="资质" width="120" />
            <el-table-column prop="currentPatients" label="当前分管" width="95" />
            <el-table-column prop="status" label="状态" width="95"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
            <el-table-column prop="nextAction" label="下一步" min-width="130" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog v-model="reviewDialogVisible" title="人员与患者动态复核" width="620px">
      <el-form label-width="110px">
        <el-form-item label="动态对象"><el-input :model-value="currentRow.object" disabled /></el-form-item>
        <el-form-item label="复核结论"><el-radio-group model-value="confirm"><el-radio-button label="confirm">确认变化</el-radio-button><el-radio-button label="adjust">需调整分工</el-radio-button><el-radio-button label="archive">归档退出</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="复核说明"><el-input type="textarea" :rows="3" placeholder="记录变化原因、责任方、影响患者和后续处理" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="reviewDialogVisible = false">取消</el-button><el-button type="primary" @click="reviewDialogVisible = false; submitAction('动态复核已保存')">提交复核</el-button></template>
    </el-dialog>

    <el-dialog v-model="alertDialogVisible" title="动态预警处理" width="620px">
      <el-form label-width="110px">
        <el-form-item label="预警对象"><el-input :model-value="`${currentRow.object} / ${currentRow.status}`" disabled /></el-form-item>
        <el-form-item label="处理方向"><el-checkbox-group><el-checkbox label="调整归属" /><el-checkbox label="补充分工" /><el-checkbox label="补充排班" /><el-checkbox label="退出归档" /><el-checkbox label="看板提示" /></el-checkbox-group></el-form-item>
        <el-form-item label="处理要求"><el-input type="textarea" :rows="3" placeholder="说明预警原因、处理时限、责任人和需要回写的业务页面" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="alertDialogVisible = false">取消</el-button><el-button type="primary" @click="alertDialogVisible = false; submitAction('动态预警已生成')">生成预警</el-button></template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="动态追溯" size="560px">
      <el-timeline>
        <el-timeline-item timestamp="数据快照">对象：{{ currentRow.object }}，当前：{{ currentRow.currentValue }}</el-timeline-item>
        <el-timeline-item timestamp="变化判定" type="warning">变化：{{ currentRow.changeValue }}，状态：{{ currentRow.status }}</el-timeline-item>
        <el-timeline-item timestamp="业务输出" type="success">进入分工、排班、员工主页和看板处理</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
