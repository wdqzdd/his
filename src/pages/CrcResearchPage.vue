<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  CircleCheck,
  DocumentAdd,
  Files,
  FirstAidKit,
  Search,
  Warning,
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{
  context: PageContext;
}>();

type SubjectRow = {
  id: string;
  project: string;
  subjectNo: string;
  patient: string;
  stage: string;
  consent: string;
  randomNo: string;
  visitWindow: string;
  aeStatus: string;
  drugStatus: string;
  specimenStatus: string;
  queryStatus: string;
  risk: string;
  nextAction: string;
};

type VisitRow = {
  visit: string;
  window: string;
  form: string;
  lab: string;
  drug: string;
  status: string;
};

const sectionByMenu: Record<string, string> = {
  'crc-project': 'project',
  'crc-screen': 'screen',
  'crc-soa': 'soa',
  'crc-visit': 'visit',
  'crc-ae': 'ae',
  'crc-drug': 'drug',
  'crc-specimen': 'specimen',
  'crc-query': 'query',
  'crc-audit': 'audit',
  'crc-export': 'export',
};

const activeTab = ref(sectionByMenu[props.context.menuKey] ?? 'project');
const selectedSubjectId = ref('CRC-001');
const screenDialogVisible = ref(false);
const visitDialogVisible = ref(false);
const aeDialogVisible = ref(false);
const drugDialogVisible = ref(false);
const queryDialogVisible = ref(false);
const auditDrawerVisible = ref(false);

watch(
  () => props.context.menuKey,
  (menuKey) => {
    activeTab.value = sectionByMenu[menuKey] ?? 'project';
  },
);

const subjects = ref<SubjectRow[]>([
  { id: 'CRC-001', project: 'HD-CKD-01', subjectNo: 'S-001', patient: '潘德胜', stage: '筛选期', consent: '已签署', randomNo: '待随机', visitWindow: 'V0 2026-05-12', aeStatus: '无', drugStatus: '未发放', specimenStatus: '待采集', queryStatus: '0条', risk: '中', nextAction: '完成筛选检验' },
  { id: 'CRC-002', project: 'HD-CKD-01', subjectNo: 'S-002', patient: '郭强', stage: '入组', consent: '已签署', randomNo: 'R-1002', visitWindow: 'V1 2026-05-14', aeStatus: '无', drugStatus: '已发放', specimenStatus: '已入库', queryStatus: '1条', risk: '中', nextAction: '回复质疑' },
  { id: 'CRC-003', project: 'HD-CKD-01', subjectNo: 'S-003', patient: '马丽', stage: '随访中', consent: '已签署', randomNo: 'R-1003', visitWindow: 'V2 2026-05-18', aeStatus: '轻度AE', drugStatus: '待回收', specimenStatus: '已运输', queryStatus: '0条', risk: '高', nextAction: 'AE随访' },
  { id: 'CRC-004', project: 'HD-CKD-02', subjectNo: 'S-004', patient: '王建国', stage: '筛选失败', consent: '已签署', randomNo: '-', visitWindow: '关闭', aeStatus: '无', drugStatus: '不适用', specimenStatus: '不适用', queryStatus: '0条', risk: '低', nextAction: '归档筛败原因' },
  { id: 'CRC-005', project: 'HD-CKD-02', subjectNo: 'S-005', patient: '李秀兰', stage: '随访中', consent: '已签署', randomNo: 'R-2005', visitWindow: 'V3 2026-05-21', aeStatus: '无', drugStatus: '已发放', specimenStatus: '待采集', queryStatus: '2条', risk: '中', nextAction: '访视提醒' },
  { id: 'CRC-006', project: 'HD-CKD-02', subjectNo: 'S-006', patient: '陈志强', stage: '入组', consent: '已签署', randomNo: 'R-2006', visitWindow: 'V1 2026-05-15', aeStatus: '无', drugStatus: '已发放', specimenStatus: '已入库', queryStatus: '0条', risk: '低', nextAction: '持续随访' },
  { id: 'CRC-007', project: 'HD-VASC-01', subjectNo: 'S-007', patient: '刘梦莹', stage: '筛选期', consent: '待签署', randomNo: '待随机', visitWindow: 'V0 2026-05-13', aeStatus: '无', drugStatus: '未发放', specimenStatus: '待采集', queryStatus: '0条', risk: '高', nextAction: '补知情同意' },
  { id: 'CRC-008', project: 'HD-VASC-01', subjectNo: 'S-008', patient: '孙海', stage: '随访中', consent: '已签署', randomNo: 'R-3008', visitWindow: 'V4 2026-05-24', aeStatus: 'SAE待评估', drugStatus: '暂停发放', specimenStatus: '已入库', queryStatus: '3条', risk: '高', nextAction: 'SAE上报' },
  { id: 'CRC-009', project: 'HD-ANEMIA-01', subjectNo: 'S-009', patient: '曹敏', stage: '随访中', consent: '已签署', randomNo: 'R-4009', visitWindow: 'V2 2026-05-19', aeStatus: '无', drugStatus: '已发放', specimenStatus: '已运输', queryStatus: '0条', risk: '低', nextAction: '持续随访' },
  { id: 'CRC-010', project: 'HD-ANEMIA-01', subjectNo: 'S-010', patient: '何雪', stage: '退出', consent: '已签署', randomNo: 'R-4010', visitWindow: 'EOT 2026-05-11', aeStatus: '无', drugStatus: '已回收', specimenStatus: '已归档', queryStatus: '0条', risk: '低', nextAction: '完成退出访视' },
  { id: 'CRC-011', project: 'HD-CKD-01', subjectNo: 'S-011', patient: '赵明', stage: '筛选期', consent: '待签署', randomNo: '待随机', visitWindow: 'V0 2026-05-16', aeStatus: '无', drugStatus: '未发放', specimenStatus: '待采集', queryStatus: '0条', risk: '中', nextAction: '预约知情' },
  { id: 'CRC-012', project: 'HD-CKD-02', subjectNo: 'S-012', patient: '周庆', stage: '随访中', consent: '已签署', randomNo: 'R-2012', visitWindow: 'V2 2026-05-17', aeStatus: '无', drugStatus: '已发放', specimenStatus: '待运输', queryStatus: '1条', risk: '中', nextAction: '标本运输' },
]);

const visitRows: VisitRow[] = [
  { visit: 'V0 筛选', window: '-14~0天', form: '筛选表/知情同意', lab: '血常规、生化、感染四项', drug: '无', status: '进行中' },
  { visit: 'V1 随机', window: '第0天', form: '随机/基线表', lab: '基线检验', drug: '首次发放', status: '待执行' },
  { visit: 'V2 随访', window: '第14天±3', form: '疗效/AE/合并用药', lab: '生化、Hb', drug: '依从性核对', status: '待执行' },
  { visit: 'EOT 退出', window: '末次用药后', form: '退出表/总结', lab: '安全性检验', drug: '回收', status: '待执行' },
];

const selectedSubject = computed(() => subjects.value.find((item) => item.id === selectedSubjectId.value) ?? subjects.value[0]);

const metrics = computed(() => [
  { label: '受试者', value: subjects.value.length, tone: 'blue' },
  { label: '筛选期', value: subjects.value.filter((item) => item.stage === '筛选期').length, tone: 'orange' },
  { label: '随访中', value: subjects.value.filter((item) => item.stage === '随访中').length, tone: 'green' },
  { label: 'AE/SAE', value: subjects.value.filter((item) => item.aeStatus !== '无').length, tone: 'red' },
  { label: '数据质疑', value: subjects.value.reduce((sum, item) => sum + Number.parseInt(item.queryStatus, 10), 0), tone: 'orange' },
]);

const closureChecks = computed(() => [
  { label: '知情同意', value: selectedSubject.value.consent, pass: selectedSubject.value.consent === '已签署' },
  { label: '随机号', value: selectedSubject.value.randomNo, pass: !selectedSubject.value.randomNo.includes('待') },
  { label: '访视窗', value: selectedSubject.value.visitWindow, pass: !selectedSubject.value.visitWindow.includes('关闭') },
  { label: 'AE/SAE', value: selectedSubject.value.aeStatus, pass: selectedSubject.value.aeStatus === '无' },
  { label: '研究药物', value: selectedSubject.value.drugStatus, pass: !selectedSubject.value.drugStatus.includes('暂停') && !selectedSubject.value.drugStatus.includes('待') },
  { label: '数据质疑', value: selectedSubject.value.queryStatus, pass: selectedSubject.value.queryStatus === '0条' },
]);

const activeTables = ['crc_project', 'crc_subject', 'crc_visit', 'crc_form_data', 'crc_adverse_event', 'crc_study_drug', 'crc_specimen_chain', 'crc_query', 'crc_audit_trail'];

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (['已签署', '无', '已发放', '已入库', '已运输', '已回收', '已归档', '低', '随访中'].includes(value) || value === '0条') return 'success';
  if (['高'].includes(value) || value.includes('SAE') || value.includes('暂停') || value.includes('待签署')) return 'danger';
  if (value.includes('待') || value.includes('筛选') || value.includes('中') || value.includes('条') || value === '中') return 'warning';
  return 'info';
}

function selectSubject(row: SubjectRow): void {
  selectedSubjectId.value = row.id;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}

function saveScreen(): void {
  selectedSubject.value.consent = '已签署';
  screenDialogVisible.value = false;
  submitAction('筛选信息已保存，知情同意和入排标准进入审计轨迹');
}

function saveVisit(): void {
  visitDialogVisible.value = false;
  submitAction('访视表单已提交，缺失项将生成数据质疑');
}

function saveAe(): void {
  selectedSubject.value.aeStatus = '轻度AE';
  aeDialogVisible.value = false;
  submitAction('不良事件已登记，必要时触发SAE上报流程');
}

function saveDrug(): void {
  selectedSubject.value.drugStatus = '已发放';
  drugDialogVisible.value = false;
  submitAction('研究药物发放/回收台账已更新');
}

function closeQuery(): void {
  selectedSubject.value.queryStatus = '0条';
  queryDialogVisible.value = false;
  submitAction('数据质疑已回复并关闭');
}
</script>

<template>
  <section class="crc-page">
    <el-card class="crc-work-card" shadow="never">
      <template #header>
        <div class="crc-header">
          <div>
            <h2>药物临床研究 / CRC站</h2>
            <p>管理研究项目、受试者筛选、SoA访视、表单、AE/SAE、研究药物、标本链、数据质疑、审计轨迹和导出。</p>
          </div>
          <div class="crc-actions">
            <el-button type="primary" :icon="DocumentAdd" @click="screenDialogVisible = true">筛选入组</el-button>
            <el-button :icon="Files" @click="visitDialogVisible = true">访视表单</el-button>
            <el-button :icon="Warning" @click="aeDialogVisible = true">AE/SAE</el-button>
            <el-button :icon="FirstAidKit" @click="drugDialogVisible = true">研究药物</el-button>
          </div>
        </div>
      </template>

      <el-form class="crc-filter" inline>
        <el-form-item label="项目">
          <el-select placeholder="全部项目" clearable>
            <el-option label="HD-CKD-01" value="ckd1" />
            <el-option label="HD-CKD-02" value="ckd2" />
            <el-option label="HD-VASC-01" value="vasc" />
            <el-option label="HD-ANEMIA-01" value="anemia" />
          </el-select>
        </el-form-item>
        <el-form-item label="阶段">
          <el-select placeholder="全部阶段" clearable>
            <el-option label="筛选期" value="screen" />
            <el-option label="入组" value="random" />
            <el-option label="随访中" value="follow" />
            <el-option label="退出" value="exit" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键字">
          <el-input placeholder="受试者、患者、随机号、质疑" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>

      <div class="crc-stat-grid">
        <el-card v-for="item in metrics" :key="item.label" :class="['crc-stat-card', item.tone]" shadow="never">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </el-card>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :xl="16">
          <el-card class="crc-main-card" shadow="never">
            <template #header>
              <div class="crc-card-header">
                <div>
                  <strong>受试者与访视闭环</strong>
                  <p>示例数据不少于 10 条，必须体现知情同意、随机、访视、AE、药物、标本、质疑和审计追踪。</p>
                </div>
                <el-tag type="primary" effect="plain">筛选 -> 知情 -> 随机 -> 访视 -> 数据核查 -> 归档导出</el-tag>
              </div>
            </template>
            <el-table :data="subjects" border stripe highlight-current-row row-key="id" @row-click="selectSubject">
              <el-table-column prop="project" label="项目" width="110" fixed="left" />
              <el-table-column prop="subjectNo" label="受试者" width="95" />
              <el-table-column prop="patient" label="患者" width="90" />
              <el-table-column prop="stage" label="阶段" width="95">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.stage)">{{ row.stage }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="consent" label="知情" width="95" />
              <el-table-column prop="randomNo" label="随机号" width="110" />
              <el-table-column prop="visitWindow" label="访视窗" min-width="130" />
              <el-table-column prop="aeStatus" label="AE/SAE" width="110" />
              <el-table-column prop="drugStatus" label="研究药物" width="110" />
              <el-table-column prop="specimenStatus" label="标本" width="100" />
              <el-table-column prop="queryStatus" label="质疑" width="80" />
              <el-table-column prop="risk" label="风险" width="75">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.risk)" effect="plain">{{ row.risk }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="nextAction" label="下一步" min-width="130" />
              <el-table-column label="操作" width="245" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click.stop="selectSubject(row); screenDialogVisible = true">筛选</el-button>
                  <el-button link @click.stop="selectSubject(row); visitDialogVisible = true">访视</el-button>
                  <el-button link @click.stop="selectSubject(row); aeDialogVisible = true">AE</el-button>
                  <el-button link @click.stop="selectSubject(row); queryDialogVisible = true">质疑</el-button>
                  <el-button link @click.stop="selectSubject(row); auditDrawerVisible = true">审计</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>

        <el-col :xs="24" :xl="8">
          <el-card class="crc-side-card" shadow="never">
            <template #header>
              <div class="crc-card-header">
                <strong>当前受试者闭环</strong>
                <el-tag :type="tagType(selectedSubject.risk)">{{ selectedSubject.risk }}风险</el-tag>
              </div>
            </template>
            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="受试者">{{ selectedSubject.subjectNo }} / {{ selectedSubject.patient }}</el-descriptions-item>
              <el-descriptions-item label="项目">{{ selectedSubject.project }}</el-descriptions-item>
              <el-descriptions-item label="访视">{{ selectedSubject.visitWindow }}</el-descriptions-item>
              <el-descriptions-item label="下一步">{{ selectedSubject.nextAction }}</el-descriptions-item>
            </el-descriptions>
            <div class="crc-check-list">
              <div v-for="item in closureChecks" :key="item.label" class="crc-check-row">
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
                <el-icon :class="{ pass: item.pass, block: !item.pass }">
                  <CircleCheck v-if="item.pass" />
                  <Warning v-else />
                </el-icon>
              </div>
            </div>
            <div class="crc-quick-actions">
              <el-button type="primary" @click="visitDialogVisible = true">提交访视</el-button>
              <el-button @click="auditDrawerVisible = true">审计轨迹</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="crc-workspace-card" shadow="never">
      <template #header>
        <div class="crc-card-header">
          <div>
            <strong>SoA访视与数据核查</strong>
            <p>访视窗、表单、检验、研究药物和标本链需要按方案联动，缺失项生成质疑并保留轨迹。</p>
          </div>
          <el-button type="primary" :icon="Files" @click="visitDialogVisible = true">填写访视表</el-button>
        </div>
      </template>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="SoA访视" name="soa">
          <el-table :data="visitRows" border stripe>
            <el-table-column prop="visit" label="访视" min-width="130" />
            <el-table-column prop="window" label="窗口期" width="120" />
            <el-table-column prop="form" label="表单" min-width="160" />
            <el-table-column prop="lab" label="检验/检查" min-width="180" />
            <el-table-column prop="drug" label="研究药物" min-width="120" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="tagType(row.status)">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="数据导出" name="export">
          <el-descriptions :column="3" border>
            <el-descriptions-item label="可导出项目">4个</el-descriptions-item>
            <el-descriptions-item label="待关闭质疑">8条</el-descriptions-item>
            <el-descriptions-item label="审计轨迹">开启</el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog v-model="screenDialogVisible" title="筛选与知情同意" width="700px">
      <el-form label-width="110px">
        <el-form-item label="受试者">
          <el-input :model-value="`${selectedSubject.subjectNo} / ${selectedSubject.patient}`" />
        </el-form-item>
        <el-form-item label="知情同意">
          <el-radio-group model-value="signed">
            <el-radio-button label="signed">已签署</el-radio-button>
            <el-radio-button label="pending">待签署</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="入排标准">
          <el-input type="textarea" :rows="3" placeholder="记录入选、排除标准核对和筛选失败原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="screenDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveScreen">保存筛选</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="visitDialogVisible" title="访视表单" width="720px">
      <el-form label-width="110px">
        <el-form-item label="访视">
          <el-select model-value="v1">
            <el-option label="V0 筛选" value="v0" />
            <el-option label="V1 随机" value="v1" />
            <el-option label="V2 随访" value="v2" />
            <el-option label="EOT 退出" value="eot" />
          </el-select>
        </el-form-item>
        <el-form-item label="表单数据">
          <el-input type="textarea" :rows="4" placeholder="填写源数据、合并用药、疗效指标、方案偏离和备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="visitDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveVisit">提交访视</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="aeDialogVisible" title="AE / SAE 登记" width="700px">
      <el-alert type="warning" show-icon :closable="false" title="严重不良事件需按方案和法规时限上报，原型仅展示流程。" />
      <el-form class="dialog-form" label-width="110px">
        <el-form-item label="事件类型">
          <el-select model-value="ae">
            <el-option label="AE" value="ae" />
            <el-option label="SAE" value="sae" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" :rows="3" placeholder="记录发生时间、严重程度、关联性、处理和转归" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="aeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveAe">保存事件</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="drugDialogVisible" title="研究药物管理" width="660px">
      <el-form label-width="110px">
        <el-form-item label="操作">
          <el-radio-group model-value="dispense">
            <el-radio-button label="dispense">发放</el-radio-button>
            <el-radio-button label="return">回收</el-radio-button>
            <el-radio-button label="destroy">销毁</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="批号/数量">
          <el-input placeholder="扫描批号并填写数量" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="drugDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveDrug">保存台账</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="queryDialogVisible" title="数据质疑处理" width="660px">
      <el-form label-width="110px">
        <el-form-item label="质疑内容">
          <el-input type="textarea" :rows="3" placeholder="数据缺失、逻辑矛盾、访视窗偏离或源数据不一致" />
        </el-form-item>
        <el-form-item label="回复">
          <el-input type="textarea" :rows="3" placeholder="填写回复说明和修正依据" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="queryDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="closeQuery">关闭质疑</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="auditDrawerVisible" title="审计追踪" size="620px">
      <el-timeline>
        <el-timeline-item timestamp="知情同意" type="primary">{{ selectedSubject.consent }}，操作者：CRC钱</el-timeline-item>
        <el-timeline-item timestamp="随机/访视" type="warning">{{ selectedSubject.randomNo }}，{{ selectedSubject.visitWindow }}</el-timeline-item>
        <el-timeline-item timestamp="药物/标本" type="success">药物：{{ selectedSubject.drugStatus }}；标本：{{ selectedSubject.specimenStatus }}</el-timeline-item>
        <el-timeline-item timestamp="数据核查">质疑：{{ selectedSubject.queryStatus }}；AE：{{ selectedSubject.aeStatus }}</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
