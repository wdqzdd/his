<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  CircleCheck,
  DocumentChecked,
  EditPen,
  FirstAidKit,
  Operation,
  Search,
  Warning,
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{
  context: PageContext;
}>();

type AccessRow = {
  patient: string;
  accessType: string;
  site: string;
  createdDate: string;
  useStatus: string;
  maturity: string;
  flow: string;
  risk: string;
  patency: string;
  lastPuncture: string;
  next: string;
};

const editDrawerVisible = ref(false);
const enableDialogVisible = ref(false);
const assessmentDialogVisible = ref(false);
const punctureDialogVisible = ref(false);
const eventDialogVisible = ref(false);
const retireDialogVisible = ref(false);
const timelineDrawerVisible = ref(false);
const selectedRow = ref<AccessRow | null>(null);

const accessRows: AccessRow[] = [
  { patient: '王建国', accessType: '自体动静脉内瘘', site: '左前臂', createdDate: '2025-11-18', useStatus: '使用中', maturity: '成熟', flow: '820 ml/min', risk: '低', patency: '174天', lastPuncture: '阶梯法 / 05-10', next: '常规穿刺' },
  { patient: '李秀兰', accessType: '长期导管', site: '右颈内静脉', createdDate: '2026-02-06', useStatus: '使用中', maturity: '不适用', flow: '导管血流 260 ml/min', risk: '中', patency: '94天', lastPuncture: '导管连接 / 05-10', next: '出口护理评估' },
  { patient: '赵明', accessType: '自体动静脉内瘘', site: '右前臂', createdDate: '2026-04-20', useStatus: '待启用', maturity: '待评估', flow: '420 ml/min', risk: '中', patency: '20天', lastPuncture: '未使用', next: '超声评估' },
  { patient: '陈志强', accessType: '人工血管', site: '左上臂', createdDate: '2025-08-12', useStatus: '预警', maturity: '成熟', flow: '620 ml/min', risk: '高', patency: '272天', lastPuncture: '区域法 / 05-09', next: '狭窄评估' },
  { patient: '刘桂英', accessType: '临时导管', site: '股静脉', createdDate: '2026-05-02', useStatus: '待退出', maturity: '不适用', flow: '220 ml/min', risk: '高', patency: '8天', lastPuncture: '导管连接 / 05-08', next: '退出计划' },
];

const eventRows = [
  { patient: '陈志强', event: '静脉压升高', level: '高', time: '2026-05-09', result: '建议超声评估狭窄' },
  { patient: '李秀兰', event: '导管出口红肿', level: '中', time: '2026-05-10', result: '加强出口护理并复查' },
  { patient: '王建国', event: '穿刺点渗血', level: '低', time: '2026-05-08', result: '压迫后好转' },
];

const metrics = [
  { label: '当前可用通路', value: 312, tone: 'green' },
  { label: '待启用评估', value: 18, tone: 'orange' },
  { label: '高风险事件', value: 7, tone: 'red' },
  { label: '本周穿刺记录', value: 824, tone: 'blue' },
];

const activeTables = [
  'vascular_access',
  'vascular_access_operation',
  'vascular_access_enable',
  'vascular_access_assessment',
  'puncture_record',
  'vascular_access_event',
  'vascular_access_timeline',
];

const pageHint = computed(() =>
  props.context.workspace === '护士站'
    ? '护理侧重点是上机前通路核对、穿刺方式、导管连接、异常事件和透后观察。'
    : '医生侧重点是通路档案、建立/置管、成熟评估、启用、风险分级和退出决策。',
);

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (['使用中', '成熟', '低'].includes(value)) return 'success';
  if (['待启用', '待评估', '中', '待退出'].includes(value)) return 'warning';
  if (['预警', '高'].includes(value)) return 'danger';
  return 'info';
}

function openEdit(row?: AccessRow): void {
  selectedRow.value = row ?? accessRows[0];
  editDrawerVisible.value = true;
}

function openEnable(row: AccessRow): void {
  selectedRow.value = row;
  enableDialogVisible.value = true;
}

function openAssessment(row: AccessRow): void {
  selectedRow.value = row;
  assessmentDialogVisible.value = true;
}

function openPuncture(row: AccessRow): void {
  selectedRow.value = row;
  punctureDialogVisible.value = true;
}

function openEvent(row: AccessRow): void {
  selectedRow.value = row;
  eventDialogVisible.value = true;
}

function openRetire(row: AccessRow): void {
  selectedRow.value = row;
  retireDialogVisible.value = true;
}

function openTimeline(row: AccessRow): void {
  selectedRow.value = row;
  timelineDrawerVisible.value = true;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}
</script>

<template>
  <section class="access-page">
    <el-card class="access-work-card" shadow="never">
      <template #header>
        <div class="access-work-header">
          <div>
            <h2>血管通路</h2>
            <p>{{ pageHint }}</p>
          </div>
          <div class="access-actions">
            <el-button type="primary" :icon="FirstAidKit" @click="openEdit()">新增通路</el-button>
            <el-button :icon="CircleCheck" @click="openEnable(accessRows[2])">启用评估</el-button>
            <el-button :icon="Operation" @click="openPuncture(accessRows[0])">穿刺记录</el-button>
            <el-button :icon="DocumentChecked" @click="openTimeline(accessRows[0])">时间轴</el-button>
          </div>
        </div>
      </template>

      <el-form class="access-filter" inline>
        <el-form-item label="关键词">
          <el-input placeholder="患者、通路类型、部位或风险" clearable />
        </el-form-item>
        <el-form-item label="通路类型">
          <el-select placeholder="全部类型" clearable>
            <el-option label="自体动静脉内瘘" value="avf" />
            <el-option label="人工血管" value="avg" />
            <el-option label="长期导管" value="tcc" />
            <el-option label="临时导管" value="temp" />
          </el-select>
        </el-form-item>
        <el-form-item label="使用状态">
          <el-select placeholder="全部状态" clearable>
            <el-option label="使用中" value="using" />
            <el-option label="待启用" value="pending" />
            <el-option label="预警" value="warning" />
            <el-option label="待退出" value="retire" />
          </el-select>
        </el-form-item>
        <el-form-item label="风险">
          <el-select placeholder="全部风险" clearable>
            <el-option label="高" value="high" />
            <el-option label="中" value="middle" />
            <el-option label="低" value="low" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>

      <div class="access-stat-grid">
        <el-card v-for="item in metrics" :key="item.label" :class="['access-stat-card', item.tone]" shadow="never">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </el-card>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :xl="17">
          <el-card class="access-main-card" shadow="never">
            <template #header>
              <div class="access-card-header">
                <div>
                  <strong>通路档案与当前状态</strong>
                  <p>当前可用通路会被透析处方、上机核对、穿刺记录和风险预警引用。</p>
                </div>
                <el-tag type="primary" effect="plain">{{ context.workspace }} / {{ context.role }}</el-tag>
              </div>
            </template>
            <el-table :data="accessRows" border stripe>
              <el-table-column prop="patient" label="患者" width="110" />
              <el-table-column prop="accessType" label="通路类型" min-width="150" />
              <el-table-column prop="site" label="部位" width="110" />
              <el-table-column prop="createdDate" label="建立日期" width="115" />
              <el-table-column prop="useStatus" label="使用状态" width="110">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.useStatus)">{{ row.useStatus }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="maturity" label="成熟/评估" width="115" />
              <el-table-column prop="flow" label="血流/通畅" min-width="150" />
              <el-table-column prop="risk" label="风险" width="90">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.risk)" effect="plain">{{ row.risk }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="patency" label="通畅时间" width="100" />
              <el-table-column prop="lastPuncture" label="最近穿刺/连接" min-width="150" />
              <el-table-column prop="next" label="下一步" min-width="130" />
              <el-table-column label="操作" width="290" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click="openEdit(row)">档案</el-button>
                  <el-button link @click="openAssessment(row)">评估</el-button>
                  <el-button link @click="openPuncture(row)">穿刺</el-button>
                  <el-button link @click="openEvent(row)">事件</el-button>
                  <el-button link type="danger" @click="openRetire(row)">退出</el-button>
                  <el-button link @click="openTimeline(row)">时间轴</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>

        <el-col :xs="24" :xl="7">
          <el-card class="access-side-card" shadow="never">
            <template #header>
              <strong>通路风险事件</strong>
            </template>
            <div class="access-event-list">
              <div v-for="item in eventRows" :key="`${item.patient}-${item.event}`" class="access-event-item">
                <div>
                  <strong>{{ item.patient }} / {{ item.event }}</strong>
                  <p>{{ item.time }} - {{ item.result }}</p>
                </div>
                <el-tag :type="tagType(item.level)">{{ item.level }}</el-tag>
              </div>
            </div>
          </el-card>

          <el-card class="access-side-card" shadow="never">
            <template #header>
              <strong>上机前核对</strong>
            </template>
            <div class="access-check-list">
              <div><span>当前可用通路</span><strong>必须与处方一致</strong></div>
              <div><span>感染/狭窄/血栓</span><strong>异常需先处置</strong></div>
              <div><span>穿刺方式</span><strong>记录动脉端与静脉端</strong></div>
            </div>
            <div class="access-risk-line danger">
              <el-icon><Warning /></el-icon>
              <span>高风险通路、导管感染、疑似狭窄或血栓不得只做备注，必须生成事件和后续复查任务。</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-drawer v-model="editDrawerVisible" title="通路档案维护" size="620px">
      <el-form label-width="110px">
        <el-form-item label="患者">
          <el-input :model-value="selectedRow?.patient" />
        </el-form-item>
        <el-form-item label="通路类型">
          <el-select :model-value="selectedRow?.accessType">
            <el-option label="自体动静脉内瘘" value="自体动静脉内瘘" />
            <el-option label="人工血管" value="人工血管" />
            <el-option label="长期导管" value="长期导管" />
            <el-option label="临时导管" value="临时导管" />
          </el-select>
        </el-form-item>
        <el-form-item label="部位">
          <el-input :model-value="selectedRow?.site" />
        </el-form-item>
        <el-form-item label="建立日期">
          <el-date-picker type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="手术/置管记录">
          <el-input type="textarea" :rows="3" placeholder="记录术式、操作者、导管型号、并发症和注意事项" />
        </el-form-item>
      </el-form>
      <div class="drawer-actions">
        <el-button @click="editDrawerVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAction('通路档案已保存')">保存档案</el-button>
      </div>
    </el-drawer>

    <el-dialog v-model="enableDialogVisible" title="通路启用评估" width="620px">
      <el-form label-width="110px">
        <el-form-item label="患者/通路">
          <el-input :model-value="selectedRow ? `${selectedRow.patient} / ${selectedRow.accessType} / ${selectedRow.site}` : ''" />
        </el-form-item>
        <el-form-item label="评估结果">
          <el-radio-group model-value="pass">
            <el-radio-button label="pass">可启用</el-radio-button>
            <el-radio-button label="wait">暂缓</el-radio-button>
            <el-radio-button label="reject">不可用</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="首次使用日期">
          <el-date-picker type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="评估意见">
          <el-input type="textarea" :rows="3" placeholder="记录震颤、杂音、血流量、超声结论和穿刺建议" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="enableDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAction('启用评估已保存，处方和上机核对可引用')">保存评估</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="assessmentDialogVisible" title="通路评估" width="620px">
      <el-form label-width="110px">
        <el-form-item label="评估类型">
          <el-select model-value="routine">
            <el-option label="常规评估" value="routine" />
            <el-option label="超声评估" value="ultrasound" />
            <el-option label="感染评估" value="infection" />
            <el-option label="狭窄/血栓评估" value="stenosis" />
          </el-select>
        </el-form-item>
        <el-form-item label="血流量">
          <el-input :model-value="selectedRow?.flow" />
        </el-form-item>
        <el-form-item label="风险等级">
          <el-select :model-value="selectedRow?.risk">
            <el-option label="低" value="低" />
            <el-option label="中" value="中" />
            <el-option label="高" value="高" />
          </el-select>
        </el-form-item>
        <el-form-item label="评估结论">
          <el-input type="textarea" :rows="3" placeholder="记录感染征象、狭窄、血栓、动脉瘤、皮肤状态和处理建议" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="assessmentDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAction('通路评估已生成风险状态和后续任务')">提交评估</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="punctureDialogVisible" title="穿刺/导管连接记录" width="620px">
      <el-form label-width="110px">
        <el-form-item label="患者/通路">
          <el-input :model-value="selectedRow ? `${selectedRow.patient} / ${selectedRow.accessType}` : ''" />
        </el-form-item>
        <el-form-item label="穿刺方式">
          <el-select model-value="rope">
            <el-option label="阶梯法" value="rope" />
            <el-option label="扣眼法" value="buttonhole" />
            <el-option label="区域法" value="area" />
            <el-option label="导管连接" value="catheter" />
          </el-select>
        </el-form-item>
        <el-form-item label="动静脉端">
          <el-input placeholder="例如：动脉端近心侧，静脉端远心侧" />
        </el-form-item>
        <el-form-item label="穿刺结果">
          <el-radio-group model-value="success">
            <el-radio-button label="success">成功</el-radio-button>
            <el-radio-button label="adjust">调整后成功</el-radio-button>
            <el-radio-button label="failed">失败</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="观察记录">
          <el-input type="textarea" :rows="3" placeholder="记录渗血、肿胀、疼痛、导管出口和固定情况" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="punctureDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAction('穿刺记录已写入治疗记录和通路时间轴')">保存穿刺</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="eventDialogVisible" title="通路事件登记" width="620px">
      <el-form label-width="110px">
        <el-form-item label="事件类型">
          <el-select placeholder="请选择事件类型">
            <el-option label="感染" value="infection" />
            <el-option label="狭窄" value="stenosis" />
            <el-option label="血栓" value="thrombosis" />
            <el-option label="穿刺失败" value="puncture_failed" />
            <el-option label="导管功能不良" value="catheter" />
          </el-select>
        </el-form-item>
        <el-form-item label="严重程度">
          <el-select model-value="middle">
            <el-option label="低" value="low" />
            <el-option label="中" value="middle" />
            <el-option label="高" value="high" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理结果">
          <el-input type="textarea" :rows="3" placeholder="记录处置、转诊、用药、复查和是否影响下次治疗" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="eventDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAction('通路事件已登记，并生成风险预警')">提交事件</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="retireDialogVisible" title="通路废弃/退出" width="560px">
      <el-alert type="warning" show-icon :closable="false" title="通路退出会影响处方、排班、上机核对和穿刺记录，请确认已有替代通路或治疗计划。" />
      <el-form class="dialog-form" label-width="110px">
        <el-form-item label="退出原因">
          <el-select placeholder="请选择原因">
            <el-option label="感染" value="infection" />
            <el-option label="血栓闭塞" value="thrombosis" />
            <el-option label="功能不良" value="dysfunction" />
            <el-option label="替代通路启用" value="replaced" />
          </el-select>
        </el-form-item>
        <el-form-item label="退出日期">
          <el-date-picker type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="说明">
          <el-input type="textarea" :rows="3" placeholder="记录退出依据、替代通路和后续随访" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="retireDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="submitAction('通路退出已提交复核，相关处方将提示重新确认')">提交退出</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="timelineDrawerVisible" title="通路时间轴" size="520px">
      <el-timeline>
        <el-timeline-item timestamp="2025-11-18" type="primary">建立通路：{{ selectedRow?.accessType }} / {{ selectedRow?.site }}</el-timeline-item>
        <el-timeline-item timestamp="2025-12-28" type="success">成熟评估通过，首次启用</el-timeline-item>
        <el-timeline-item timestamp="2026-05-08">穿刺记录：{{ selectedRow?.lastPuncture }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10" type="warning">本次治疗前核对：风险 {{ selectedRow?.risk }}，下一步 {{ selectedRow?.next }}</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
