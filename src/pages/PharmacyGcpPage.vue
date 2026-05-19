<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, FirstAidKit, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();

type GcpRow = {
  id: string;
  subject: string;
  project: string;
  drug: string;
  visit: string;
  randomNo: string;
  actionType: string;
  transportTemp: string;
  storageTemp: string;
  storageHumidity: string;
  overTempRecord: string;
  stockStatus: string;
  dispenseStatus: string;
  pharmacist: string;
  nextAction: string;
};

const selectedId = ref('PGCP-001');
const dispenseDialogVisible = ref(false);
const returnDialogVisible = ref(false);
const auditDrawerVisible = ref(false);
const receiveDialogVisible = ref(false);
const destroyDialogVisible = ref(false);
const tempDialogVisible = ref(false);

const rows: GcpRow[] = [
  { id: 'PGCP-001', subject: '潘德胜', project: 'HD-CKD-01', drug: '研究药物A', visit: 'V2', randomNo: 'R-0108', actionType: '接收', transportTemp: '3.8℃', storageTemp: '4.2℃', storageHumidity: '48%', overTempRecord: '无', stockStatus: '专柜锁定', dispenseStatus: '待核对', pharmacist: 'GCP药师', nextAction: '核对随机号' },
  { id: 'PGCP-002', subject: '马丽', project: 'HD-CKD-01', drug: '研究药物B', visit: 'V3', randomNo: 'R-0112', actionType: '发放', transportTemp: '4.1℃', storageTemp: '4.5℃', storageHumidity: '52%', overTempRecord: '无', stockStatus: '可发放', dispenseStatus: '待发放', pharmacist: 'GCP药师', nextAction: '访视发药' },
  { id: 'PGCP-003', subject: '郭强', project: 'CKD-QOL-02', drug: '对照药', visit: 'V1', randomNo: 'R-0201', actionType: '发放', transportTemp: '4.0℃', storageTemp: '4.6℃', storageHumidity: '50%', overTempRecord: '无', stockStatus: '可发放', dispenseStatus: '已发放', pharmacist: '周药师', nextAction: '回收空盒' },
  { id: 'PGCP-004', subject: '陈敏', project: 'CKD-QOL-02', drug: '研究药物C', visit: 'V4', randomNo: 'R-0208', actionType: '回收', transportTemp: '5.2℃', storageTemp: '4.4℃', storageHumidity: '49%', overTempRecord: '无', stockStatus: '回收中', dispenseStatus: '退药中', pharmacist: '王药师', nextAction: '核对回收' },
  { id: 'PGCP-005', subject: '孙海', project: 'HD-CKD-01', drug: '研究药物A', visit: 'V2', randomNo: 'R-0117', actionType: '暂停', transportTemp: '4.3℃', storageTemp: '4.7℃', storageHumidity: '51%', overTempRecord: '无', stockStatus: '方案暂停', dispenseStatus: '暂停', pharmacist: 'GCP药师', nextAction: '方案确认' },
  { id: 'PGCP-006', subject: '周庆', project: 'HD-CKD-01', drug: '研究药物B', visit: 'V1', randomNo: 'R-0121', actionType: '接收', transportTemp: '8.6℃', storageTemp: '4.9℃', storageHumidity: '53%', overTempRecord: '运输超温12分钟', stockStatus: '隔离待判', dispenseStatus: '暂停', pharmacist: 'GCP药师', nextAction: '超温处理' },
  { id: 'PGCP-007', subject: '何雪', project: 'CKD-QOL-02', drug: '研究药物C', visit: 'V5', randomNo: 'R-0210', actionType: '销毁', transportTemp: '4.5℃', storageTemp: '4.8℃', storageHumidity: '47%', overTempRecord: '无', stockStatus: '待销毁', dispenseStatus: '回收完成', pharmacist: '王药师', nextAction: '双人销毁' },
  { id: 'PGCP-008', subject: '李秀英', project: 'HD-CKD-01', drug: '研究药物A', visit: 'V3', randomNo: 'R-0124', actionType: '储存监测', transportTemp: '4.0℃', storageTemp: '7.9℃', storageHumidity: '62%', overTempRecord: '冰箱超温8分钟', stockStatus: '超温待评估', dispenseStatus: '暂停', pharmacist: 'GCP药师', nextAction: 'PI判定' },
  { id: 'PGCP-009', subject: '赵明', project: 'CKD-QOL-02', drug: '对照药', visit: 'V2', randomNo: 'R-0214', actionType: '回收', transportTemp: '4.7℃', storageTemp: '4.3℃', storageHumidity: '49%', overTempRecord: '无', stockStatus: '回收中', dispenseStatus: '退药中', pharmacist: '周药师', nextAction: '依从性核对' },
  { id: 'PGCP-010', subject: '陈志强', project: 'HD-CKD-01', drug: '研究药物B', visit: 'V4', randomNo: 'R-0128', actionType: '发放', transportTemp: '4.2℃', storageTemp: '4.5℃', storageHumidity: '50%', overTempRecord: '无', stockStatus: '可发放', dispenseStatus: '待发放', pharmacist: 'GCP药师', nextAction: '访视发药' },
];

const currentRow = computed(() => rows.find((item) => item.id === selectedId.value) ?? rows[0]);
const activeTables = ['gcp_drug_account', 'gcp_dispense_record', 'gcp_drug_return', 'gcp_audit_trail'];

const metrics = computed(() => [
  { label: '受试者', value: rows.length, tone: 'blue' },
  { label: '待核对', value: rows.filter((item) => item.dispenseStatus === '待核对').length, tone: 'orange' },
  { label: '待发放', value: rows.filter((item) => item.dispenseStatus === '待发放').length, tone: 'orange' },
  { label: '已发放', value: rows.filter((item) => item.dispenseStatus === '已发放').length, tone: 'green' },
  { label: '温度异常', value: rows.filter((item) => item.overTempRecord !== '无').length, tone: 'red' },
]);

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value === '可发放' || value === '已发放') return 'success';
  if (value === '专柜锁定' || value === '待核对' || value === '待发放' || value === '退药中' || value === '回收中' || value === '待销毁' || value === '隔离待判') return 'warning';
  if (value === '方案暂停' || value === '暂停' || value === '超温待评估' || value.includes('超温')) return 'danger';
  return 'info';
}

function selectRow(row: GcpRow): void { selectedId.value = row.id; }
function submitAction(message: string): void { ElMessage.success(message); }
</script>

<template>
  <section class="pharmacy-page">
    <el-card class="pharmacy-work-card" shadow="never">
      <template #header>
        <div class="pharmacy-header">
          <div>
            <h2>{{ context.menuTitle }}</h2>
            <p>围绕研究药物专柜、随机号、访视发药和回收退药形成 GCP 药物闭环。</p>
          </div>
          <div class="pharmacy-actions">
            <el-button type="primary" :icon="FirstAidKit" @click="dispenseDialogVisible = true">访视发药</el-button>
            <el-button @click="receiveDialogVisible = true">药物接收</el-button>
            <el-button :icon="Warning" @click="returnDialogVisible = true">回收退药</el-button>
            <el-button @click="destroyDialogVisible = true">销毁登记</el-button>
            <el-button @click="tempDialogVisible = true">温湿度处理</el-button>
            <el-button :icon="CircleCheck" @click="auditDrawerVisible = true">审计追踪</el-button>
          </div>
        </div>
      </template>
      <el-form class="pharmacy-filter" inline>
        <el-form-item label="关键字"><el-input placeholder="受试者、项目、随机号、药物" clearable /></el-form-item>
        <el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="待核对" value="待核对" /><el-option label="待发放" value="待发放" /><el-option label="已发放" value="已发放" /><el-option label="暂停" value="暂停" /></el-select></el-form-item>
        <el-form-item label="动作"><el-select placeholder="全部动作" clearable><el-option label="接收" value="接收" /><el-option label="发放" value="发放" /><el-option label="回收" value="回收" /><el-option label="销毁" value="销毁" /><el-option label="储存监测" value="储存监测" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>
      <div class="pharmacy-stat-grid"><el-card v-for="item in metrics" :key="item.label" :class="['pharmacy-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card></div>
      <el-table :data="rows" border stripe highlight-current-row row-key="id" @row-click="selectRow">
        <el-table-column prop="subject" label="受试者" width="100" fixed="left" />
        <el-table-column prop="project" label="项目" width="120" />
        <el-table-column prop="drug" label="研究药物" min-width="130" />
        <el-table-column prop="visit" label="访视" width="80" />
        <el-table-column prop="randomNo" label="随机号" width="110" />
        <el-table-column prop="actionType" label="动作" width="90" />
        <el-table-column prop="transportTemp" label="运输温度" width="95" />
        <el-table-column prop="storageTemp" label="储存温度" width="95" />
        <el-table-column prop="storageHumidity" label="储存湿度" width="95" />
        <el-table-column prop="overTempRecord" label="超温记录" min-width="125"><template #default="{ row }"><el-tag :type="tagType(row.overTempRecord)" effect="plain">{{ row.overTempRecord }}</el-tag></template></el-table-column>
        <el-table-column prop="stockStatus" label="药物状态" width="110"><template #default="{ row }"><el-tag :type="tagType(row.stockStatus)" effect="plain">{{ row.stockStatus }}</el-tag></template></el-table-column>
        <el-table-column prop="dispenseStatus" label="发放状态" width="100"><template #default="{ row }"><el-tag :type="tagType(row.dispenseStatus)">{{ row.dispenseStatus }}</el-tag></template></el-table-column>
        <el-table-column prop="pharmacist" label="药师" width="100" />
        <el-table-column prop="nextAction" label="下一步" min-width="120" />
      </el-table>
    </el-card>

    <el-dialog v-model="dispenseDialogVisible" title="GCP访视发药" width="620px">
      <el-form label-width="100px">
        <el-form-item label="受试者"><el-input :model-value="currentRow.subject" disabled /></el-form-item>
        <el-form-item label="随机号"><el-input :model-value="currentRow.randomNo" /></el-form-item>
        <el-form-item label="发放数量"><el-input placeholder="请输入本次发放数量" /></el-form-item>
        <el-form-item label="说明"><el-input type="textarea" :rows="3" placeholder="记录方案核对、访视号、药物编号和交待事项" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dispenseDialogVisible = false">取消</el-button><el-button type="primary" @click="dispenseDialogVisible = false; submitAction('GCP访视发药已记录')">确认发药</el-button></template>
    </el-dialog>

    <el-dialog v-model="returnDialogVisible" title="GCP回收退药" width="600px">
      <el-form label-width="100px">
        <el-form-item label="受试者"><el-input :model-value="currentRow.subject" disabled /></el-form-item>
        <el-form-item label="回收数量"><el-input placeholder="请输入回收数量和空盒数" /></el-form-item>
        <el-form-item label="回收说明"><el-input type="textarea" :rows="3" placeholder="记录依从性、剩余量、回收人和异常说明" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="returnDialogVisible = false">取消</el-button><el-button type="primary" @click="returnDialogVisible = false; submitAction('GCP回收退药已记录')">提交回收</el-button></template>
    </el-dialog>

    <el-dialog v-model="receiveDialogVisible" title="GCP药物接收" width="620px">
      <el-form label-width="110px">
        <el-form-item label="项目/药物"><el-input :model-value="`${currentRow.project} / ${currentRow.drug}`" disabled /></el-form-item>
        <el-form-item label="运输温度"><el-input :model-value="currentRow.transportTemp" /></el-form-item>
        <el-form-item label="接收数量"><el-input placeholder="请输入接收数量、药物编号和包装状态" /></el-form-item>
        <el-form-item label="接收说明"><el-input type="textarea" :rows="3" placeholder="记录接收人、温度计编号、运输箱状态和偏离说明" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="receiveDialogVisible = false">取消</el-button><el-button type="primary" @click="receiveDialogVisible = false; submitAction('GCP药物接收已记录')">确认接收</el-button></template>
    </el-dialog>

    <el-dialog v-model="destroyDialogVisible" title="GCP药物销毁登记" width="600px">
      <el-form label-width="110px">
        <el-form-item label="药物"><el-input :model-value="currentRow.drug" disabled /></el-form-item>
        <el-form-item label="销毁数量"><el-input placeholder="请输入待销毁数量" /></el-form-item>
        <el-form-item label="双人复核"><el-input placeholder="药师 + CRC/PI 复核人" /></el-form-item>
        <el-form-item label="销毁原因"><el-input type="textarea" :rows="3" placeholder="记录超温、过期、方案结束或回收后销毁原因" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="destroyDialogVisible = false">取消</el-button><el-button type="danger" @click="destroyDialogVisible = false; submitAction('GCP药物销毁已登记')">提交销毁</el-button></template>
    </el-dialog>

    <el-dialog v-model="tempDialogVisible" title="GCP温湿度与超温处理" width="620px">
      <el-form label-width="110px">
        <el-form-item label="运输温度"><el-input :model-value="currentRow.transportTemp" /></el-form-item>
        <el-form-item label="储存温湿度"><el-input :model-value="`${currentRow.storageTemp} / ${currentRow.storageHumidity}`" /></el-form-item>
        <el-form-item label="超温记录"><el-input :model-value="currentRow.overTempRecord === '无' ? '' : currentRow.overTempRecord" placeholder="记录超温时长、最高温度和影响批号" /></el-form-item>
        <el-form-item label="处理结果"><el-select placeholder="请选择"><el-option label="可继续使用" value="use" /><el-option label="隔离待判" value="hold" /><el-option label="PI判定停用" value="stop" /><el-option label="转销毁" value="destroy" /></el-select></el-form-item>
      </el-form>
      <template #footer><el-button @click="tempDialogVisible = false">取消</el-button><el-button type="primary" @click="tempDialogVisible = false; submitAction('温湿度处理已提交')">提交处理</el-button></template>
    </el-dialog>

    <el-drawer v-model="auditDrawerVisible" title="GCP药物审计追踪" size="520px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-10 08:10" type="primary">访视核对：{{ currentRow.project }} / {{ currentRow.visit }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 08:20">随机号与专柜药物匹配，运输温度 {{ currentRow.transportTemp }}，储存 {{ currentRow.storageTemp }} / {{ currentRow.storageHumidity }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 08:40" type="success">接收/发放/回收/销毁和超温处理同步 CRC 站</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
