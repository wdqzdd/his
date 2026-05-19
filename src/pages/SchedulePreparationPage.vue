<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  Calendar,
  CircleCheck,
  DocumentChecked,
  EditPen,
  Operation,
  RefreshRight,
  Search,
  Warning,
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

defineProps<{
  context: PageContext;
}>();

type ScheduleRow = {
  bed: string;
  zone: string;
  shift: string;
  patient: string;
  mode: string;
  infection: string;
  status: string;
  doctor: string;
  nurse: string;
  source: string;
  next: string;
};

type CheckinRow = {
  patient: string;
  schedule: string;
  bed: string;
  checkinMethod: string;
  checkinTime: string;
  checkinStatus: string;
  owner: string;
  nextAction: string;
};

const editDialogVisible = ref(false);
const changeDialogVisible = ref(false);
const absenceDialogVisible = ref(false);
const checkinDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const selectedRow = ref<ScheduleRow | null>(null);

const scheduleRows: ScheduleRow[] = [
  { bed: 'A08', zone: 'A区', shift: '上午班', patient: '王建国', mode: 'HD 4h', infection: '无', status: '已排班', doctor: '张明', nurse: '周敏', source: '预约审核通过', next: '待签到' },
  { bed: 'A10', zone: 'A区', shift: '上午班', patient: '吴海', mode: 'HD 4h', infection: '无', status: '待确认', doctor: '陈宁', nurse: '周敏', source: '补透申请', next: '确认机位' },
  { bed: 'B12', zone: 'B区', shift: '下午班', patient: '李秀兰', mode: 'HDF 4h', infection: '无', status: '冲突', doctor: '陈宁', nurse: '赵玲', source: '预约退回修改', next: '调床或换班' },
  { bed: 'I03', zone: '隔离区', shift: '上午班', patient: '赵明', mode: 'HD 4h', infection: '乙肝', status: '已排班', doctor: '张明', nurse: '孙涛', source: '隔离预约', next: '隔离签到' },
  { bed: 'C16', zone: 'C区', shift: '下午班', patient: '刘桂英', mode: 'HD 4h', infection: '无', status: '请假', doctor: '王主任', nurse: '吴倩', source: '长期排班', next: '登记缺席/补透' },
  { bed: '急备01', zone: '急诊备用区', shift: '中午班', patient: '陈志强', mode: 'HD 3.5h', infection: '无', status: '临时加透', doctor: '张明', nurse: '赵玲', source: '临时申请', next: '医生确认' },
  { bed: 'C06', zone: 'C区', shift: '上午班', patient: '周萍', mode: 'HDF 4h', infection: '无', status: '已排班', doctor: '陈宁', nurse: '孙涛', source: '特殊净化预约', next: '待签到' },
  { bed: 'D03', zone: 'D区', shift: '上午班', patient: '韩梅', mode: 'HD 4h', infection: '无', status: '已排班', doctor: '刘主任', nurse: '赵玲', source: '预约审核通过', next: '已签到' },
  { bed: 'B07', zone: 'B区', shift: '下午班', patient: '林建平', mode: 'HD 4h', infection: '导管风险', status: '待确认', doctor: '王主任', nurse: '孙涛', source: '随访申请', next: '感控确认' },
  { bed: 'N02', zone: '夜间区', shift: '夜间班', patient: '马强', mode: 'HD 4h', infection: '无', status: '已排班', doctor: '张明', nurse: '赵玲', source: '夜间班预约', next: '待签到' },
];

const waitingRows = [
  { patient: '黄立军', request: '新签约规律透析', mode: 'HD', need: '每周二四六上午', risk: '导管患者', status: '待排床' },
  { patient: '周桂芳', request: '补透', mode: 'HD', need: '今日下午', risk: '高钾复查', status: '待确认' },
  { patient: '马建', request: '换班', mode: 'HDF', need: '周三上午改下午', risk: '无', status: '待调整' },
];

const bedGrid = [
  { bed: 'A08', zone: 'A区', patient: '王建国', status: '已排班', tone: 'success' },
  { bed: 'A09', zone: 'A区', patient: '空闲', status: '可用', tone: 'info' },
  { bed: 'A10', zone: 'A区', patient: '吴海', status: '待确认', tone: 'warning' },
  { bed: 'B12', zone: 'B区', patient: '李秀兰', status: '冲突', tone: 'danger' },
  { bed: 'I03', zone: '隔离区', patient: '赵明', status: '隔离', tone: 'success' },
  { bed: 'C16', zone: 'C区', patient: '刘桂英', status: '请假', tone: 'warning' },
  { bed: '急备01', zone: '急诊备用区', patient: '陈志强', status: '临时', tone: 'primary' },
  { bed: '水质复核', zone: 'A区', patient: '暂停放行', status: '设备限制', tone: 'danger' },
];

const metrics = [
  { label: '已排患者', value: 126, tone: 'blue' },
  { label: '待排/待确认', value: 14, tone: 'orange' },
  { label: '冲突与限制', value: 4, tone: 'red' },
  { label: '可用机位', value: 61, tone: 'green' },
];

const activeTables = ['bed_zone', 'bed_station', 'dialysis_schedule', 'schedule_change_log', 'checkin_record'];

const checkinRows: CheckinRow[] = [
  { patient: '王建国', schedule: '2026-05-10 上午班', bed: 'A08', checkinMethod: 'IC卡', checkinTime: '07:28', checkinStatus: '已签到', owner: '导诊王敏', nextAction: '进入透前评估' },
  { patient: '赵明', schedule: '2026-05-10 上午班', bed: 'I03', checkinMethod: '人工登记', checkinTime: '07:35', checkinStatus: '已签到', owner: '导诊陈洁', nextAction: '隔离通道引导' },
  { patient: '韩梅', schedule: '2026-05-10 上午班', bed: 'D03', checkinMethod: '人脸识别', checkinTime: '07:42', checkinStatus: '已签到', owner: '导诊陈洁', nextAction: '进入护士站' },
  { patient: '李秀兰', schedule: '2026-05-10 下午班', bed: 'B12', checkinMethod: '未登记', checkinTime: '待到院', checkinStatus: '待报到', owner: '导诊王敏', nextAction: '电话提醒' },
  { patient: '刘桂英', schedule: '2026-05-10 下午班', bed: 'C16', checkinMethod: '电话确认', checkinTime: '10:20', checkinStatus: '请假', owner: '导诊李倩', nextAction: '生成补透' },
  { patient: '陈志强', schedule: '2026-05-10 中午班', bed: '急备01', checkinMethod: '急诊登记', checkinTime: '11:05', checkinStatus: '迟到', owner: '急诊护士长', nextAction: '医生确认' },
  { patient: '周萍', schedule: '2026-05-10 上午班', bed: 'C06', checkinMethod: '人工登记', checkinTime: '待到院', checkinStatus: '待报到', owner: '导诊李倩', nextAction: '资料复核' },
  { patient: '林建平', schedule: '2026-05-10 下午班', bed: 'B07', checkinMethod: '未登记', checkinTime: '待到院', checkinStatus: '待报到', owner: '感控护士', nextAction: '导管风险确认' },
  { patient: '马强', schedule: '2026-05-10 夜间班', bed: 'N02', checkinMethod: '未登记', checkinTime: '待到院', checkinStatus: '待报到', owner: '导诊王敏', nextAction: '夜间班提醒' },
  { patient: '孙丽', schedule: '2026-05-10 中午班', bed: 'E04', checkinMethod: '人工登记', checkinTime: '未到', checkinStatus: '未到', owner: '导诊李倩', nextAction: '联系家属' },
];

const shiftCapacity = computed(() => [
  { label: '上午班', used: 44, total: 48, color: '#2f63c9' },
  { label: '中午班', used: 36, total: 44, color: '#1f9d71' },
  { label: '下午班', used: 46, total: 52, color: '#c77a00' },
  { label: '夜间班', used: 12, total: 16, color: '#6854f2' },
]);

function tagType(status: string): 'success' | 'warning' | 'danger' | 'info' | 'primary' {
  if (['已排班', '可用', '隔离'].includes(status)) return 'success';
  if (['待确认', '请假', '待调整', '待报到', '迟到'].includes(status)) return 'warning';
  if (['冲突', '设备限制', '未到'].includes(status)) return 'danger';
  if (['已签到'].includes(status)) return 'success';
  if (['临时加透', '临时'].includes(status)) return 'primary';
  return 'info';
}

function openEdit(row?: ScheduleRow): void {
  selectedRow.value = row ?? scheduleRows[0];
  editDialogVisible.value = true;
}

function openChange(row: ScheduleRow): void {
  selectedRow.value = row;
  changeDialogVisible.value = true;
}

function openAbsence(row: ScheduleRow): void {
  selectedRow.value = row;
  absenceDialogVisible.value = true;
}

function openCheckin(row: ScheduleRow): void {
  selectedRow.value = row;
  checkinDialogVisible.value = true;
}

function openTrace(row: ScheduleRow): void {
  selectedRow.value = row;
  traceDrawerVisible.value = true;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}
</script>

<template>
  <section class="schedule-page">
    <el-card class="schedule-work-card" shadow="never">
      <template #header>
        <div class="schedule-work-header">
          <div>
            <h2>排班排床</h2>
            <p>从预约审核结果生成当日或周期排班，处理调床、换班、请假、缺席、补透、临时加透和报到签到。</p>
          </div>
          <div class="schedule-actions">
            <el-button type="primary" :icon="Calendar" @click="openEdit()">新增排班</el-button>
            <el-button :icon="Operation" @click="openChange(scheduleRows[0])">批量调班</el-button>
            <el-button :icon="CircleCheck" @click="submitAction('排班方案已发布给护士站和治疗记录')">发布排班</el-button>
            <el-button :icon="DocumentChecked" @click="openTrace(scheduleRows[0])">变更追溯</el-button>
          </div>
        </div>
      </template>

      <el-form class="schedule-filter" inline>
        <el-form-item label="日期">
          <el-date-picker type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="班次">
          <el-select placeholder="全部班次" clearable>
            <el-option label="上午班" value="morning" />
            <el-option label="中午班" value="noon" />
            <el-option label="下午班" value="afternoon" />
            <el-option label="夜间班" value="night" />
          </el-select>
        </el-form-item>
        <el-form-item label="分区">
          <el-select placeholder="全部分区" clearable>
            <el-option label="A区" value="a" />
            <el-option label="B区" value="b" />
            <el-option label="隔离区" value="iso" />
            <el-option label="急诊备用区" value="emergency" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select placeholder="全部状态" clearable>
            <el-option label="已排班" value="scheduled" />
            <el-option label="待确认" value="pending" />
            <el-option label="冲突" value="conflict" />
            <el-option label="请假" value="leave" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input placeholder="患者、机位、医生、护士" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">查询</el-button>
          <el-button :icon="RefreshRight">刷新容量</el-button>
        </el-form-item>
      </el-form>

      <div class="schedule-stat-grid">
        <el-card v-for="item in metrics" :key="item.label" :class="['schedule-stat-card', item.tone]" shadow="never">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </el-card>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :xl="16">
          <el-card class="schedule-main-card" shadow="never">
            <template #header>
              <div class="schedule-card-header">
                <div>
                  <strong>机位排班网格</strong>
                  <p>按分区、班次和机位展示患者安排，冲突、隔离和设备限制必须先处理后发布。</p>
                </div>
                <el-tag type="primary" effect="plain">周视图 / 今日 2026-05-10</el-tag>
              </div>
            </template>
            <div class="bed-grid">
              <button v-for="bed in bedGrid" :key="bed.bed" type="button" :class="['bed-cell', bed.tone]">
                <span>{{ bed.zone }}</span>
                <strong>{{ bed.bed }}</strong>
                <em>{{ bed.patient }}</em>
                <small>{{ bed.status }}</small>
              </button>
            </div>
          </el-card>

          <el-card class="schedule-main-card" shadow="never">
            <template #header>
              <div class="schedule-card-header">
                <strong>排班明细</strong>
                <el-button type="primary" plain>导出排班表</el-button>
              </div>
            </template>
            <el-table :data="scheduleRows" border stripe>
              <el-table-column prop="bed" label="机位" width="90" />
              <el-table-column prop="zone" label="分区" width="100" />
              <el-table-column prop="shift" label="班次" width="100" />
              <el-table-column prop="patient" label="患者" width="110" />
              <el-table-column prop="mode" label="模式" width="110" />
              <el-table-column prop="infection" label="隔离" width="90" />
              <el-table-column prop="status" label="状态" width="110">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.status)">{{ row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="doctor" label="医生" width="100" />
              <el-table-column prop="nurse" label="护士" width="100" />
              <el-table-column prop="source" label="来源" min-width="140" />
              <el-table-column prop="next" label="下一步" min-width="130" />
              <el-table-column label="操作" width="250" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
                  <el-button link @click="openChange(row)">调床/换班</el-button>
                  <el-button link @click="openAbsence(row)">请假/缺席</el-button>
                  <el-button link @click="openCheckin(row)">签到</el-button>
                  <el-button link @click="openTrace(row)">追溯</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>

          <el-card class="schedule-main-card" shadow="never">
            <template #header>
              <div class="schedule-card-header">
                <strong>报到签到记录</strong>
                <el-tag type="primary" effect="plain">待报到 / 当日患者 / 签到状态</el-tag>
              </div>
            </template>
            <el-table :data="checkinRows" border stripe>
              <el-table-column prop="patient" label="当日患者" width="110" />
              <el-table-column prop="schedule" label="治疗日期/班次" min-width="150" />
              <el-table-column prop="bed" label="机位" width="90" />
              <el-table-column prop="checkinMethod" label="报到方式" width="110" />
              <el-table-column prop="checkinTime" label="签到时间" width="105" />
              <el-table-column prop="checkinStatus" label="签到状态" width="105">
                <template #default="{ row }"><el-tag :type="tagType(row.checkinStatus)">{{ row.checkinStatus }}</el-tag></template>
              </el-table-column>
              <el-table-column prop="owner" label="责任人" width="110" />
              <el-table-column prop="nextAction" label="下一步" min-width="130" />
              <el-table-column label="操作" width="140" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click="openCheckin(scheduleRows[0])">签到</el-button>
                  <el-button link @click="openTrace(scheduleRows[0])">追溯</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>

        <el-col :xs="24" :xl="8">
          <el-card class="schedule-side-card" shadow="never">
            <template #header>
              <strong>班次容量</strong>
            </template>
            <div class="capacity-list">
              <div v-for="item in shiftCapacity" :key="item.label" class="capacity-item">
                <div>
                  <strong>{{ item.label }}</strong>
                  <span>{{ item.used }} / {{ item.total }} 人</span>
                </div>
                <el-progress :percentage="Math.round((item.used / item.total) * 100)" :color="item.color" />
              </div>
            </div>
          </el-card>

          <el-card class="schedule-side-card" shadow="never">
            <template #header>
              <strong>待排队列</strong>
            </template>
            <div class="waiting-list">
              <div v-for="item in waitingRows" :key="item.patient" class="waiting-item">
                <div>
                  <strong>{{ item.patient }}</strong>
                  <p>{{ item.request }} / {{ item.mode }} / {{ item.need }}</p>
                  <small>{{ item.risk }}</small>
                </div>
                <el-tag :type="tagType(item.status)">{{ item.status }}</el-tag>
              </div>
            </div>
          </el-card>

          <el-card class="schedule-side-card" shadow="never">
            <template #header>
              <strong>排班安全关注</strong>
            </template>
            <div class="schedule-risk-line danger">
              <el-icon><Warning /></el-icon>
              <span>隔离患者不得排入普通区；设备或水质未放行的机位不得发布排班。</span>
            </div>
            <div class="schedule-risk-line">
              <el-icon><DocumentChecked /></el-icon>
              <span>调床、换班、请假、缺席、补透和临时加透必须记录原因并进入追溯。</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-dialog v-model="editDialogVisible" title="新增/编辑排班" width="660px">
      <el-form label-width="110px">
        <el-form-item label="患者">
          <el-select :model-value="selectedRow?.patient" placeholder="请选择预约审核通过的患者">
            <el-option label="王建国" value="王建国" />
            <el-option label="黄立军" value="黄立军" />
            <el-option label="周桂芳" value="周桂芳" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期/班次">
          <el-date-picker type="date" placeholder="日期" />
          <el-select class="inline-select" :model-value="selectedRow?.shift" placeholder="班次">
            <el-option label="上午班" value="上午班" />
            <el-option label="中午班" value="中午班" />
            <el-option label="下午班" value="下午班" />
          </el-select>
        </el-form-item>
        <el-form-item label="分区/机位">
          <el-cascader
            placeholder="请选择分区机位"
            :options="[
              { label: 'A区', value: 'A区', children: [{ label: 'A08', value: 'A08' }, { label: 'A10', value: 'A10' }] },
              { label: 'B区', value: 'B区', children: [{ label: 'B12', value: 'B12' }] },
              { label: '隔离区', value: '隔离区', children: [{ label: 'I03', value: 'I03' }] },
            ]"
          />
        </el-form-item>
        <el-form-item label="透析模式">
          <el-select :model-value="selectedRow?.mode" placeholder="模式">
            <el-option label="HD 4h" value="HD 4h" />
            <el-option label="HDF 4h" value="HDF 4h" />
            <el-option label="临时 HD 3.5h" value="HD 3.5h" />
          </el-select>
        </el-form-item>
        <el-form-item label="排班说明">
          <el-input type="textarea" :rows="3" placeholder="记录预约来源、隔离要求、特殊注意事项" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAction('排班已保存，等待发布')">保存排班</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="changeDialogVisible" title="调床/换班" width="620px">
      <el-form label-width="110px">
        <el-form-item label="当前安排">
          <el-input :model-value="selectedRow ? `${selectedRow.patient} / ${selectedRow.shift} / ${selectedRow.bed}` : ''" />
        </el-form-item>
        <el-form-item label="调整类型">
          <el-radio-group model-value="bed">
            <el-radio-button label="bed">调床</el-radio-button>
            <el-radio-button label="shift">换班</el-radio-button>
            <el-radio-button label="extra">补透</el-radio-button>
            <el-radio-button label="temporary">临时加透</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="新班次/机位">
          <el-input placeholder="例如：下午班 / A09" />
        </el-form-item>
        <el-form-item label="调整原因">
          <el-input type="textarea" :rows="3" placeholder="记录患者原因、设备原因、隔离要求或容量调整依据" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="changeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAction('调床换班已记录并写入变更追溯')">提交调整</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="absenceDialogVisible" title="请假/缺席登记" width="560px">
      <el-form label-width="110px">
        <el-form-item label="患者">
          <el-input :model-value="selectedRow?.patient" />
        </el-form-item>
        <el-form-item label="登记类型">
          <el-select model-value="leave">
            <el-option label="请假" value="leave" />
            <el-option label="缺席" value="absent" />
            <el-option label="取消排班" value="cancel" />
          </el-select>
        </el-form-item>
        <el-form-item label="补透安排">
          <el-input placeholder="例如：次日下午班 A09" />
        </el-form-item>
        <el-form-item label="说明">
          <el-input type="textarea" :rows="3" placeholder="记录联系结果、患者原因和后续补透计划" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="absenceDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAction('请假/缺席已登记，补透任务已生成')">提交登记</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="checkinDialogVisible" title="报到签到登记" width="560px">
      <el-alert type="info" show-icon :closable="false" title="签到结果会写入当日治疗队列，未到或迟到将生成导诊提醒和护士站提示。" />
      <el-form class="dialog-form" label-width="110px">
        <el-form-item label="患者">
          <el-input :model-value="selectedRow?.patient" />
        </el-form-item>
        <el-form-item label="签到方式">
          <el-select model-value="manual">
            <el-option label="人工登记" value="manual" />
            <el-option label="IC卡" value="card" />
            <el-option label="人脸识别" value="face" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group model-value="checked">
            <el-radio-button label="checked">已签到</el-radio-button>
            <el-radio-button label="late">迟到</el-radio-button>
            <el-radio-button label="absent">未到</el-radio-button>
            <el-radio-button label="leave">请假</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="异常说明">
          <el-input type="textarea" :rows="3" placeholder="记录迟到、未到、请假、家属代办或身份核验异常" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="checkinDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAction('签到状态已写入当日治疗队列')">保存签到</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="排班变更追溯" size="520px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-09 16:20" type="primary">预约审核通过，生成待排任务：{{ selectedRow?.patient }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-09 17:05">导诊排入 {{ selectedRow?.shift }} / {{ selectedRow?.bed }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 07:30" type="success">发布到护士站，等待签到与透前评估</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
