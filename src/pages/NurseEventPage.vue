<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{
  context: PageContext;
}>();

type EventRow = {
  id: string;
  patient: string;
  eventCategory: string;
  eventType: string;
  source: string;
  level: string;
  description: string;
  owner: string;
  status: string;
  deadline: string;
  nextAction: string;
};

const selectedId = ref('NEV-001');
const handleDialogVisible = ref(false);
const escalateDialogVisible = ref(false);
const closeDialogVisible = ref(false);
const traceDrawerVisible = ref(false);

const rows: EventRow[] = [
  { id: 'NEV-001', patient: '王建国', eventCategory: '并发症', eventType: '低血压', source: '护士评估', level: '高', description: '透中血压下降并伴头晕', owner: '张护士', status: '待处理', deadline: '2026-05-10 10:00', nextAction: '立即处理' },
  { id: 'NEV-002', patient: '李秀英', eventCategory: '过敏史', eventType: '导管红肿', source: '通路观察', level: '高', description: '导管出口处红肿疼痛，需排除敷料过敏和感染', owner: '钱护士', status: '处理中', deadline: '2026-05-10 12:00', nextAction: '感控协同' },
  { id: 'NEV-003', patient: '赵明', eventCategory: '专科特殊治疗史', eventType: '通路异响', source: '通路记录', level: '中', description: '人工血管震颤减弱', owner: '刘护士', status: '待复查', deadline: '2026-05-12 17:00', nextAction: '超声复查' },
  { id: 'NEV-004', patient: '陈志强', eventCategory: '就诊史', eventType: '跌倒风险', source: '出院随访', level: '中', description: '患者自述站立不稳，近期急诊就诊一次', owner: '周护士', status: '待处理', deadline: '2026-05-11 12:00', nextAction: '提醒家属' },
  { id: 'NEV-005', patient: '周庆', eventCategory: '并发症', eventType: '皮肤瘙痒', source: '患者留言', level: '低', description: '近期皮肤瘙痒明显', owner: '张护士', status: '已关闭', deadline: '2026-05-10 18:00', nextAction: '健康教育' },
  { id: 'NEV-006', patient: '何雪', eventCategory: '过敏史', eventType: '用药咨询', source: '护士留言', level: '低', description: '询问左卡尼汀用法，既往无药物过敏', owner: '钱护士', status: '待处理', deadline: '2026-05-11 09:00', nextAction: '确认医生意见' },
  { id: 'NEV-007', patient: '孙海', eventCategory: '住院史', eventType: '感染筛查', source: '随访', level: '高', description: '发热伴寒战，近一月有住院抗感染史', owner: '刘护士', status: '处理中', deadline: '2026-05-10 09:30', nextAction: '转医生' },
  { id: 'NEV-008', patient: '马丽', eventCategory: '专科特殊治疗史', eventType: '隔离解除', source: '感控检查', level: '中', description: '隔离标记需要复核', owner: '感染护士', status: '待复查', deadline: '2026-05-12 12:00', nextAction: '感控复核' },
  { id: 'NEV-009', patient: '郭强', eventCategory: 'MACE', eventType: '胸闷心悸', source: '患者上报', level: '高', description: '透后胸闷心悸，需按 MACE 事件初筛', owner: '周护士', status: '待处理', deadline: '2026-05-11 17:00', nextAction: '立即上报医生' },
  { id: 'NEV-010', patient: '陈敏', eventCategory: '手术史', eventType: '置管术后随访', source: '宣教记录', level: '低', description: '需补充深静脉置管术后照护说明', owner: '张护士', status: '待复查', deadline: '2026-05-12 17:00', nextAction: '电话回访' },
];

const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['clinical_event', 'clinical_history_event', 'event_screening', 'event_handle_record', 'nursing_follow_up'];

const metrics = computed(() => [
  { label: '事件总数', value: rows.length, tone: 'blue' },
  { label: '高风险', value: rows.filter((item) => item.level === '高').length, tone: 'red' },
  { label: '待处理', value: rows.filter((item) => item.status === '待处理').length, tone: 'orange' },
  { label: '处理中', value: rows.filter((item) => item.status === '处理中').length, tone: 'orange' },
  { label: '已关闭', value: rows.filter((item) => item.status === '已关闭').length, tone: 'green' },
]);

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value === '已关闭') return 'success';
  if (value === '高') return 'danger';
  if (value === '处理中' || value === '待处理' || value === '待复查') return 'warning';
  return 'info';
}

function selectRow(row: EventRow): void {
  selectedId.value = row.id;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}

function openHandle(row: EventRow): void {
  selectedId.value = row.id;
  handleDialogVisible.value = true;
}

function openEscalate(row: EventRow): void {
  selectedId.value = row.id;
  escalateDialogVisible.value = true;
}

function openClose(row: EventRow): void {
  selectedId.value = row.id;
  closeDialogVisible.value = true;
}
</script>

<template>
  <section class="nurse-execution-page">
    <el-card class="nurse-work-card" shadow="never">
      <template #header>
        <div class="nurse-header">
          <div>
            <h2>{{ context.menuTitle }}</h2>
            <p>进行护理异常初筛、风险分级、医生转交和患者安抚，所有处理结果会回写到随访和日志。</p>
          </div>
          <div class="nurse-actions">
            <el-button type="primary" :icon="Warning" @click="openHandle(rows[0])">新增初筛</el-button>
            <el-button :icon="CircleCheck" @click="openEscalate(rows[0])">上报医生</el-button>
            <el-button :icon="CircleCheck" @click="openClose(rows[4])">关闭事件</el-button>
          </div>
        </div>
      </template>

      <el-form class="nurse-filter" inline>
        <el-form-item label="关键字">
          <el-input placeholder="患者、事件、来源、责任人" clearable />
        </el-form-item>
        <el-form-item label="级别">
          <el-select placeholder="全部级别" clearable>
            <el-option label="高" value="高" />
            <el-option label="中" value="中" />
            <el-option label="低" value="低" />
          </el-select>
        </el-form-item>
        <el-form-item label="事件分类">
          <el-select placeholder="全部分类" clearable>
            <el-option label="就诊史" value="就诊史" />
            <el-option label="住院史" value="住院史" />
            <el-option label="手术史" value="手术史" />
            <el-option label="专科特殊治疗史" value="专科特殊治疗史" />
            <el-option label="并发症" value="并发症" />
            <el-option label="过敏史" value="过敏史" />
            <el-option label="MACE" value="MACE" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select placeholder="全部状态" clearable>
            <el-option label="待处理" value="待处理" />
            <el-option label="处理中" value="处理中" />
            <el-option label="待复查" value="待复查" />
            <el-option label="已关闭" value="已关闭" />
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
        <el-table-column prop="eventCategory" label="事件分类" width="125" />
        <el-table-column prop="eventType" label="事件类型" width="120" />
        <el-table-column prop="source" label="来源" width="100" />
        <el-table-column prop="level" label="级别" width="80">
          <template #default="{ row }"><el-tag :type="tagType(row.level)">{{ row.level }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="200" />
        <el-table-column prop="owner" label="责任人" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }"><el-tag :type="tagType(row.status)" effect="plain">{{ row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="deadline" label="时限" width="150" />
        <el-table-column prop="nextAction" label="下一步" min-width="120" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click.stop="openHandle(row)">处理</el-button>
            <el-button link @click.stop="openEscalate(row)">上报</el-button>
            <el-button link type="danger" @click.stop="openClose(row)">关闭</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="handleDialogVisible" title="护理异常初筛" width="640px">
      <el-form label-width="100px">
        <el-form-item label="患者"><el-input :model-value="currentRow.patient" disabled /></el-form-item>
        <el-form-item label="事件类型"><el-input :model-value="currentRow.eventType" /></el-form-item>
        <el-form-item label="事件分类">
          <el-select :model-value="currentRow.eventCategory">
            <el-option label="就诊史" value="就诊史" />
            <el-option label="住院史" value="住院史" />
            <el-option label="手术史" value="手术史" />
            <el-option label="专科特殊治疗史" value="专科特殊治疗史" />
            <el-option label="并发症" value="并发症" />
            <el-option label="过敏史" value="过敏史" />
            <el-option label="MACE" value="MACE" />
          </el-select>
        </el-form-item>
        <el-form-item label="风险级别">
          <el-radio-group model-value="高">
            <el-radio-button label="高">高</el-radio-button>
            <el-radio-button label="中">中</el-radio-button>
            <el-radio-button label="低">低</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理建议"><el-input type="textarea" :rows="3" placeholder="记录安抚、观察、复查或转交建议" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleDialogVisible = false; submitAction('护理异常初筛已保存')">保存初筛</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="escalateDialogVisible" title="上报医生" width="620px">
      <el-form label-width="100px">
        <el-form-item label="事件"><el-input :model-value="currentRow.eventType" disabled /></el-form-item>
        <el-form-item label="接收医生"><el-input placeholder="请输入接收医生" /></el-form-item>
        <el-form-item label="紧急程度">
          <el-select placeholder="请选择">
            <el-option label="普通" value="normal" />
            <el-option label="加急" value="urgent" />
            <el-option label="危急" value="critical" />
          </el-select>
        </el-form-item>
        <el-form-item label="上报说明"><el-input type="textarea" :rows="3" placeholder="说明异常原因、已做处理和下一步建议" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="escalateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="escalateDialogVisible = false; submitAction('事件已上报医生')">确认上报</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="closeDialogVisible" title="事件关闭" width="580px">
      <el-form label-width="100px">
        <el-form-item label="事件"><el-input :model-value="currentRow.id" disabled /></el-form-item>
        <el-form-item label="关闭结果">
          <el-radio-group model-value="close">
            <el-radio-button label="close">关闭</el-radio-button>
            <el-radio-button label="follow">继续随访</el-radio-button>
            <el-radio-button label="return">退回补充</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="说明"><el-input type="textarea" :rows="3" placeholder="填写转归、责任人确认和复查要求" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="closeDialogVisible = false; submitAction('事件已关闭并回写日志')">提交关闭</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="事件追溯" size="520px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-10 08:20" type="danger">事件发生：{{ currentRow.description }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 08:40">护士完成初筛并记录风险级别</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 09:00" type="success">医生确认或关闭，结果回写护理日志</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
